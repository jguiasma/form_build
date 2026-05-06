<?php
use App\Http\Controllers\AuthController;
use Illuminate\Support\Facades\Route;

// Auth routes with RFC 5322 validation and rate limiting
Route::group(['prefix' => 'auth'], function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/verify', [AuthController::class, 'verify']);
    Route::post('/finalize-registration', [AuthController::class, 'finalizeRegistration']);
});

