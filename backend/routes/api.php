<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::post('/tokens/create', function (Request $request) {
    $request->validate([
        'email' => 'required|email',
        'password' => 'required',
        'device_name' => 'required|string',
    ]);

    $user = \App\Models\User::where('email', $request->email)->first();

    if (! $user || ! \Illuminate\Support\Facades\Hash::check($request->password, $user->password)) {
        return response()->json(['message' => 'Invalid credentials'], 401);
    }

    return ['token' => $user->createToken($request->device_name)->plainTextToken];
});

Route::get('/health', fn () => response()->json(['status' => 'ok']));

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', fn (Request $r) => $r->user());

    Route::get('/reports/daily', [\App\Http\Controllers\Api\ReportController::class, 'daily']);

    Route::apiResource('categories', \App\Http\Controllers\Api\CategoryController::class);
    Route::apiResource('products', \App\Http\Controllers\Api\ProductController::class);
    Route::apiResource('transactions', \App\Http\Controllers\Api\TransactionController::class);
});
