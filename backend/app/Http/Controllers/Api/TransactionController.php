<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class TransactionController extends Controller
{
    public function index()
    {
        return Transaction::with('items.product', 'user')->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
        ]);

        return DB::transaction(function () use ($validated, $request) {
            $total = 0;
            $items = [];

            foreach ($validated['items'] as $item) {
                $product = Product::lockForUpdate()->findOrFail($item['product_id']);

                if ($product->stock < $item['quantity']) {
                    abort(422, "Insufficient stock for {$product->name}");
                }

                $product->decrement('stock', $item['quantity']);

                $items[] = [
                    'product_id' => $product->id,
                    'quantity' => $item['quantity'],
                    'price' => $product->price,
                    'subtotal' => $product->price * $item['quantity'],
                ];
                $total += $product->price * $item['quantity'];
            }

            $transaction = Transaction::create([
                'user_id' => $request->user()->id,
                'total_amount' => $total,
                'status' => 'completed',
            ]);

            $transaction->items()->createMany($items);

            return $transaction->load('items.product');
        });
    }

    public function show(Transaction $transaction)
    {
        return $transaction->load('items.product', 'user');
    }

    public function update(Request $request, Transaction $transaction)
    {
        $validated = $request->validate([
            'status' => 'sometimes|string|in:pending,completed,cancelled',
        ]);

        $transaction->update($validated);
        return $transaction->load('items.product', 'user');
    }

    public function destroy(Transaction $transaction)
    {
        $transaction->delete();
        return response()->noContent();
    }
}
