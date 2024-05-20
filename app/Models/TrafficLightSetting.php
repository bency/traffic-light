<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TrafficLightSetting extends Model
{
    use HasFactory;
    protected $fillable = [
        'name',
        'red_seconds',
        'yellow_seconds',
        'green_seconds',
        'left_green_seconds',
        'straight_green_seconds',
        'right_green_seconds',
        'offset',
        'start_time',
        'end_time',
        'heading',
        'traffic_light_location_id',
    ];

    public function trafficLightLocation()
    {
        return $this->belongsTo(TrafficLightLocation::class);
    }
}
