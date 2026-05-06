<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\FormFieldController;

Route::get('form-fields/palette', [FormFieldController::class, 'paletteComponents']);
Route::apiResource('form-fields', FormFieldController::class);
