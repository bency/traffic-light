<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('traffic_light_settings', function (Blueprint $table) {
            $table->foreignId('traffic_light_location_id')->constrained('traffic_light_locations');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('traffic_light_settings', function (Blueprint $table) {
            $table->dropForeign(['traffic_light_location_id']);
            $table->dropColumn('traffic_light_location_id');
        });
    }
};
