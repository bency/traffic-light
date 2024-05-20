<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TrafficLightLocation extends Model
{
    use HasFactory;

    protected $fillable = [
        'county',
        'district',
        'latitude',
        'longitude',
        'connected_roads',
    ];

    public function trafficLightSettings()
    {
        return $this->hasMany(TrafficLightSetting::class);
    }
}
