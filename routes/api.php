<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\TrafficLightSettingController;
use App\Http\Controllers\Api\TrafficLightSettingApiController;
use App\Models\TrafficLightSetting;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::apiResource('traffic-light-settings', TrafficLightSettingController::class);
Route::get('/traffic-light-settings', [TrafficLightSettingApiController::class, 'index']);
Route::get('/counties', [TrafficLightSettingApiController::class, 'getCounties']);
Route::get('/districts', [TrafficLightSettingApiController::class, 'getDistricts']);
Route::get('/roads', [TrafficLightSettingApiController::class, 'getRoads']);
