<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\FormTypeController;

Route::apiResource('form-types', FormTypeController::class);

