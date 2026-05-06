<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\SubscriptionController;

Route::apiResource('subscriptions', SubscriptionController::class);
