<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\FormResponseController;

Route::apiResource('form-responses', FormResponseController::class);
