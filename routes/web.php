<?php

use App\Http\Controllers\AccountController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ItemCategoryController;
use App\Http\Controllers\ItemController;
use App\Http\Controllers\ItemDetailsController;
use App\Http\Controllers\ItemImageController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\StockController;
use App\Http\Controllers\TransactionController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

// Route::get('/dashboard', function () {
//     return Inertia::render('Dashboard');
// })->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware(['auth', 'admin'])->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::resource('item', ItemController::class);
    Route::get('cart/{cart}', [CartController::class, 'show'])->name('cart.show');
    Route::get('cart', [CartController::class, 'index'])->name('cart.index');
    Route::resource('stock', StockController::class);
    Route::get('order/{order}', [OrderController::class, 'show'])->name('order.show');
    Route::patch('order/{order}/status', [OrderController::class, 'updateStatus'])->name('order.status.update');
    Route::get('order', [OrderController::class, 'index'])->name('order.index');
    Route::get('transactions/{transaction}', [TransactionController::class, 'show'])->name('transactions.show');
    Route::patch('transactions/{transaction}/status', [TransactionController::class, 'updateStatus'])->name('transactions.status.update');
    Route::get('transactions', [TransactionController::class, 'index'])->name('transactions.index');
    Route::resource('account', AccountController::class);
    Route::resource('item-details', ItemDetailsController::class);
    // Route::post('item/image/upload/{item}', [ItemController::class, 'uploadImage'])->name('item.image.store');

    Route::prefix('item/image')->group(function () {
        Route::post('{item}', [ItemImageController::class, 'store'])
            ->name('item.image.store');

        Route::delete('{image}', [ItemImageController::class, 'destroy'])
            ->name('item.image.delete');

        Route::patch('{image}/primary', [ItemImageController::class, 'setPrimary'])
            ->name('item.image.primary');

        Route::patch('{item}/reorder', [ItemImageController::class, 'reorder'])
            ->name('item.image.reorder');
    });

    Route::resource('item-category', ItemCategoryController::class);
    Route::get('item/image/add/{item}', [ItemController::class, 'addImage'])->name('item.image.add');
});

require __DIR__ . '/auth.php';
