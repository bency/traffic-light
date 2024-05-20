<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\TrafficLightLocation;
use Illuminate\Support\Facades\Validator;

class TrafficLightLocationController extends Controller
{
    public function upload(Request $request)
    {
        $request->validate([
            'file' => 'required|mimes:csv,txt',
        ]);

        $file = $request->file('file');
        $path = $file->getRealPath();
        $data = array_map('str_getcsv', file($path));
        $header = array_shift($data);

        foreach ($data as $row) {
            $row = array_combine($header, $row);
            $connected_roads = $this->getConnectedRoads($row['地址']);

            $validator = Validator::make([
                'county' => '台南市',
                'district' => $row['行政區'],
                'connected_roads' => $connected_roads,
            ], [
                'county' => 'required|string',
                'district' => 'required|string',
                'connected_roads' => 'required|string|unique:traffic_light_locations,connected_roads,NULL,id,county,台南市,district,' . $row['行政區'],
            ]);

            if ($validator->fails()) {
                continue; // 或者你可以選擇記錄錯誤信息
            }

            TrafficLightLocation::create([
                'county' => '台南市',
                'district' => $row['行政區'],
                'latitude' => $row['熱點緯度'] ?: "0",
                'longitude' => $row['熱點經度'] ?: "0",
                'connected_roads' => $connected_roads,
            ]);
        }

        return back()->with('success', 'CSV file imported successfully.');
    }

    private function getConnectedRoads($address)
    {
        // 去除末尾的 '口' 和 '前' 等字
        $address = preg_replace('/[口前]$/u', '', $address);
        // 使用 '與' 分隔取得連接的道路
        $roads = explode('與', $address);

        return implode('與', $roads);
    }
}
