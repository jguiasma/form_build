<?php

use App\Http\Controllers\Api\FormFieldController;
use Illuminate\Support\Facades\Route;

Route::get('form-fields/palette', [FormFieldController::class, 'paletteComponents'])
    ->middleware('auth:sanctum');
Route::apiResource('form-fields', FormFieldController::class);
