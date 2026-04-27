<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\FormVersionController;

Route::apiResource('form-versions', FormVersionController::class);
