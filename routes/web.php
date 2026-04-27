<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Dashboard\AuthController;
use App\Http\Controllers\Dashboard\HomeController;
use App\Http\Controllers\Dashboard\AccountController;
use App\Http\Controllers\Dashboard\PackController;
use App\Http\Controllers\Dashboard\SubscriptionController;
use App\Http\Controllers\Dashboard\FormCategoryController;
use App\Http\Controllers\Dashboard\FormFieldController;

// Auth
Route::prefix('dashboard')->name('dashboard.')->group(function () {
    Route::middleware('guest')->group(function () {
        Route::get('login', [AuthController::class, 'showLogin'])->name('login');
        Route::post('login', [AuthController::class, 'login']);
    });

    Route::middleware('auth')->group(function () {
        Route::post('logout', [AuthController::class, 'logout'])->name('logout');
        Route::get('/', [HomeController::class, 'index'])->name('home');

        // Accounts
        Route::get('accounts/datatable', [AccountController::class, 'datatable'])->name('accounts.datatable');
        Route::resource('accounts', AccountController::class);

        // Packs
        Route::get('packs/datatable', [PackController::class, 'datatable'])->name('packs.datatable');
        Route::resource('packs', PackController::class);

        // Subscriptions
        Route::get('subscriptions/datatable', [SubscriptionController::class, 'datatable'])->name('subscriptions.datatable');
        Route::resource('subscriptions', SubscriptionController::class);

        // Form Categories
        Route::get('form-categories/datatable', [FormCategoryController::class, 'datatable'])->name('form-categories.datatable');
        Route::resource('form-categories', FormCategoryController::class);
        Route::post('form-categories/{formCategory}/toggle', [FormCategoryController::class, 'toggleStatus'])->name('form-categories.toggle');

        // Form Fields
        Route::get('form-fields/datatable', [FormFieldController::class, 'datatable'])->name('form-fields.datatable');
        Route::resource('form-fields', FormFieldController::class);
        Route::post('form-fields/{formField}/toggle', [FormFieldController::class, 'toggleStatus'])->name('form-fields.toggle');
        Route::post('form-fields/{formField}/toggle-category/{category}', [FormFieldController::class, 'toggleCategory'])->name('form-fields.toggle-category');
        Route::post('form-fields/{formField}/toggle-pack/{pack}', [FormFieldController::class, 'togglePack'])->name('form-fields.toggle-pack');


    });
});
