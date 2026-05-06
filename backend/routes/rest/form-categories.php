<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\FormCategoryController;

Route::apiResource('form-categories', FormCategoryController::class);

