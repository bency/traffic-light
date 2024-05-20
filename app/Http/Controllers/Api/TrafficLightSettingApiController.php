<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\TrafficLightSetting;

class TrafficLightSettingApiController extends Controller
{
    public function index(Request $request)
    {
        $query = TrafficLightSetting::with('trafficLightLocation');

        if ($request->has('county')) {
            $query->whereHas('trafficLightLocation', function ($q) use ($request) {
                $q->where('county', $request->county);
            });
        }

        if ($request->has('district')) {
            $query->whereHas('trafficLightLocation', function ($q) use ($request) {
                $q->where('district', $request->district);
            });
        }

        if ($request->has('road')) {
            $query->whereHas('trafficLightLocation', function ($q) use ($request) {
                $q->where('connected_roads', 'like', '%' . $request->road . '%');
            });
        }

        $settings = $query->get();

        return response()->json($settings);
    }
}
