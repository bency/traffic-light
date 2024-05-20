<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use App\Models\TrafficLightSetting;

class TrafficLightSettingApiController extends Controller
{
    public function getCounties()
    {
        $json = Storage::disk('public')->get('tw_zipcode.json');
        $data = json_decode($json, true);

        $counties = array_map(function ($item) {
            return array_keys($item)[0];
        }, $data);

        return response()->json($counties);
    }

    public function getDistricts(Request $request)
    {
        $json = Storage::disk('public')->get('tw_zipcode.json');
        $data = json_decode($json, true);

        $county = $request->county;
        $districts = [];

        foreach ($data as $item) {
            if (array_key_exists($county, $item)) {
                $districts = array_map(function ($district) {
                    return array_keys($district)[0];
                }, $item[$county]);
                break;
            }
        }

        return response()->json($districts);
    }

    public function index(Request $request)
    {
        $query = TrafficLightSetting::with('trafficLightLocation');

        if ($request->has('county') && $request->county) {
            $query->whereHas('trafficLightLocation', function ($q) use ($request) {
                $q->where('county', $request->county);
            });
        }

        if ($request->has('district') && $request->district) {
            $query->whereHas('trafficLightLocation', function ($q) use ($request) {
                $q->where('district', $request->district);
            });
        }

        if ($request->has('road') && $request->road) {
            $query->whereHas('trafficLightLocation', function ($q) use ($request) {
                $q->where('connected_roads', 'like', '%' . $request->road . '%');
            });
        }

        $settings = $query->get();

        return response()->json($settings);
    }
}
