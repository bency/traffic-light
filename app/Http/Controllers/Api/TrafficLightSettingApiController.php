<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\TrafficLightLocation;
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

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string',
            'red_seconds' => 'required|integer',
            'yellow_seconds' => 'required|integer',
            'green_seconds' => 'required|integer',
            'left_green_seconds' => 'integer',
            'straight_green_seconds' => 'integer',
            'right_green_seconds' => 'integer',
            'offset' => 'integer',
            'start_time' => 'nullable|date_format:H:i|required_with:end_time',
            'end_time' => 'nullable|date_format:H:i|required_with:start_time',
            'traffic_light_location_id' => 'required|exists:traffic_light_locations,id',
            'heading' => 'required|string'
        ]);

        $setting = TrafficLightSetting::create($request->all());

        return response()->json($setting, 201);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'name' => 'string',
            'red_seconds' => 'integer',
            'yellow_seconds' => 'integer',
            'green_seconds' => 'integer',
            'left_green_seconds' => 'integer',
            'straight_green_seconds' => 'integer',
            'right_green_seconds' => 'integer',
            'offset' => 'integer',
            'start_time' => 'nullable|date_format:H:i|required_with:end_time',
            'end_time' => 'nullable|date_format:H:i|required_with:start_time',
            'traffic_light_location_id' => 'exists:traffic_light_locations,id',
            'heading' => 'string'
        ]);

        $setting = TrafficLightSetting::findOrFail($id);
        $setting->update($request->all());

        return response()->json($setting, 200);
    }

    public function getRoads(Request $request)
    {
        $county = $request->county;
        $district = $request->district;
        $road = $request->road;

        $locations = TrafficLightLocation::where('county', $county)
            ->where('district', $district)
            ->where('connected_roads', 'like', '%' . $road . '%')
            ->pluck('connected_roads');

        return response()->json($locations);
    }
}
