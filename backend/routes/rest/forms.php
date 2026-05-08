<?php

use App\Http\Controllers\Api\FormController;
use App\Http\Controllers\Api\FormFieldController;
use App\Http\Controllers\Api\FormStepController;
use Illuminate\Support\Facades\Route;

Route::prefix('admin')->middleware('auth:sanctum')->group(function () {
    Route::post('/forms/{form}/publish', [FormController::class, 'publish']);
    Route::get('/forms/{form}/responses', [FormController::class, 'responses']);
    Route::put('/forms/{form}/reorder-steps', [FormStepController::class, 'reorderSteps']);
    Route::put('/steps/{step}/reorder-fields', [FormFieldController::class, 'reorderFields']);
    Route::get('/forms', [FormController::class, 'index']);
    Route::post('/forms', [FormController::class, 'store']);
    Route::get('/forms/{form}', [FormController::class, 'show']);
    Route::put('/forms/{form}', [FormController::class, 'update']);
    Route::delete('/forms/{form}', [FormController::class, 'destroy']);
    Route::get('/stats', [FormController::class, 'stats']);
});

Route::prefix('forms')->group(function () {
    Route::get('/{uuid}', [FormController::class, 'publicShow']);
    Route::post('/{form}/start', [FormController::class, 'start']);
    Route::post('/{form}/submit', [FormController::class, 'submit']);
    Route::post('/{form}/steps/{step}/answers', [FormStepController::class, 'saveAnswers']);
});
