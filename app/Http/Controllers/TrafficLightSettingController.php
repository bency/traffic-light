<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\TrafficLightSetting;

class TrafficLightSettingController extends Controller
{
    public function index()
    {
        return response()->json(TrafficLightSetting::all(), 200);
    }

    // 创建新的设置
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
            'start_time' => 'nullable|date_format:H:i:s|required_with:end_time', // 允许为空
            'end_time' => 'nullable|date_format:H:i:s|required_with:start_time', // 允许为空
            'heading' => 'nullable|string',
        ]);

        $setting = TrafficLightSetting::create($request->all());

        return response()->json($setting, 201);
    }

    // 获取单个设置
    public function show($id)
    {
        $setting = TrafficLightSetting::find($id);

        if (is_null($setting)) {
            return response()->json(['message' => 'Setting not found'], 404);
        }

        return response()->json($setting, 200);
    }

    // 更新设置
    public function update(Request $request, $id)
    {
        try {
            $request->validate([
                'name' => 'string',
                'red_seconds' => 'integer',
                'yellow_seconds' => 'integer',
                'green_seconds' => 'integer',
                'left_green_seconds' => 'integer',
                'straight_green_seconds' => 'integer',
                'right_green_seconds' => 'integer',
                'offset' => 'integer',
                'start_time' => 'nullable|date_format:H:i:s|required_with:end_time', // 允许为空
                'end_time' => 'nullable|date_format:H:i:s|required_with:start_time', // 允许为空
                'heading' => 'nullable|string',
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['errors' => $e->errors()], 422);
        }

        $setting = TrafficLightSetting::find($id);

        if (is_null($setting)) {
            return response()->json(['message' => 'Setting not found'], 404);
        }

        $setting->update($request->all());

        return response()->json($setting, 200);
    }

    // 删除设置
    public function destroy($id)
    {
        $setting = TrafficLightSetting::find($id);

        if (is_null($setting)) {
            return response()->json(['message' => 'Setting not found'], 404);
        }

        $setting->delete();

        return response()->json(null, 204);
    }

    public function showView()
    {
        return view('traffic-light.index');
    }
}
