<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Dashboard\AuthController;
use App\Http\Controllers\Dashboard\HomeController;
use App\Http\Controllers\Dashboard\AccountController;
use App\Http\Controllers\Dashboard\PackController;
use App\Http\Controllers\Dashboard\SubscriptionController;
use App\Http\Controllers\Dashboard\FormCategoryController;
use App\Http\Controllers\Dashboard\FormFieldController;
use App\Http\Controllers\Dashboard\FormTypeController;
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
        Route::get('accounts/export/{format}', [AccountController::class, 'export'])->name('accounts.export');

        // Packs
        Route::get('packs/datatable', [PackController::class, 'datatable'])->name('packs.datatable');
        Route::resource('packs', PackController::class);
        Route::get('packs/export/{format}', [PackController::class, 'export'])->name('packs.export');

        // Subscriptions
        Route::get('subscriptions/datatable', [SubscriptionController::class, 'datatable'])->name('subscriptions.datatable');
        Route::resource('subscriptions', SubscriptionController::class);
        Route::get('subscriptions/export/{format}', [SubscriptionController::class, 'export'])->name('subscriptions.export');

        // Form Categories
        Route::get('form-categories/datatable', [FormCategoryController::class, 'datatable'])->name('form-categories.datatable');
        Route::resource('form-categories', FormCategoryController::class);
        Route::post('form-categories/{formCategory}/toggle', [FormCategoryController::class, 'toggleStatus'])->name('form-categories.toggle');
        Route::get('form-categories/export/{format}', [FormCategoryController::class, 'export'])->name('form-categories.export');

        // Form Fields
        Route::get('form-fields/datatable', [FormFieldController::class, 'datatable'])->name('form-fields.datatable');
        Route::resource('form-fields', FormFieldController::class);
        Route::post('form-fields/{formField}/toggle', [FormFieldController::class, 'toggleStatus'])->name('form-fields.toggle');
        Route::post('form-fields/{formField}/toggle-category/{category}', [FormFieldController::class, 'toggleCategory'])->name('form-fields.toggle-category');
        Route::post('form-fields/{formField}/toggle-pack/{pack}', [FormFieldController::class, 'togglePack'])->name('form-fields.toggle-pack');
        Route::get('form-fields/export/{format}', [FormFieldController::class, 'export'])->name('form-fields.export');

 //Form Types
        Route::get('form-types/datatable', [FormTypeController::class, 'datatable'])->name('form-types.datatable');
        Route::resource('form-types', FormTypeController::class);
        Route::post('form-types/{formType}/toggle', [FormTypeController::class, 'toggleStatus'])->name('form-types.toggle');
        Route::get('form-types/export/{format}', [FormTypeController::class, 'export'])->name('form-types.export');
    });
});
