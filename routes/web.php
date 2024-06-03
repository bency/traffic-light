<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\TrafficLightSettingController;
use App\Http\Controllers\TrafficLightLocationController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

Route::get('/', [TrafficLightSettingController::class, 'showView']);

// 上傳 csv
Route::get('/upload', function () {
    return view('upload');
});
Route::post('/upload', [TrafficLightLocationController::class, 'upload'])->name('traffic-light-locations.upload');

Route::view('/traffic-light/settings', 'traffic-light.settings');
Route::view('/traffic-light/create', 'traffic-light.create');
Route::view('/traffic-light/edit', 'traffic-light.edit');

Route::get('/', function () {
    return view('welcome');
});

Route::get('/dashboard', function () {
    return view('dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__ . '/auth.php';
