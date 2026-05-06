<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\PackController;

Route::apiResource('packs', PackController::class);

