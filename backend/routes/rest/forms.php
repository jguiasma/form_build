<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\FormController;

Route::apiResource('forms', FormController::class);
