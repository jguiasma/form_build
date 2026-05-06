<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\FormStepController;

Route::apiResource('form-steps', FormStepController::class);
