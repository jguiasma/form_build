<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\FormAnswerController;

Route::apiResource('form-answers', FormAnswerController::class);

