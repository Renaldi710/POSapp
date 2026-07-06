<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Transaction;
use App\Models\TransactionItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ReportController extends Controller
{
    public function daily(Request $request)
    {
        $date = $request->query('date', today()->toDateString());

        $summary = Transaction::whereDate('created_at', $date)
            ->selectRaw('count(*) as total_transactions')
            ->selectRaw('coalesce(sum(total_amount), 0) as total_revenue')
            ->first();

        $itemsSold = TransactionItem::whereHas('transaction', fn ($q) => $q->whereDate('created_at', $date))
            ->sum('quantity');

        $topProducts = TransactionItem::whereHas('transaction', fn ($q) => $q->whereDate('created_at', $date))
            ->select('product_id', DB::raw('sum(quantity) as total_qty'), DB::raw('sum(subtotal) as total'))
            ->with('product:id,name')
            ->groupBy('product_id')
            ->orderByDesc('total_qty')
            ->limit(5)
            ->get();

        return [
            'date' => $date,
            'total_transactions' => (int) $summary->total_transactions,
            'total_revenue' => (float) $summary->total_revenue,
            'total_items_sold' => (int) $itemsSold,
            'top_products' => $topProducts,
        ];
    }
}
