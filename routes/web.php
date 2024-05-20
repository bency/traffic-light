<?php

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

Route::view('/traffic-light-settings-page', 'traffic-light.settings');
