<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\FieldOptionController;

Route::apiResource('field-options', FieldOptionController::class);
