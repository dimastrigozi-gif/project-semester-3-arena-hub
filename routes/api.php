<?php

use App\Modules\Tournaments\Http\Controllers\TournamentApiController;
use Illuminate\Support\Facades\Route;

// Endpoint turnamen yang dipakai frontend React
Route::get('/tournaments', [TournamentApiController::class, 'index']);
Route::get('/tournaments/{id}', [TournamentApiController::class, 'show']);
Route::post('/tournaments', [TournamentApiController::class, 'store']);
Route::post('/tournaments/{id}/register', [TournamentApiController::class, 'register']);
