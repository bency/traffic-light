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
        Schema::create('traffic_light_settings', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->integer('red_seconds');
            $table->integer('yellow_seconds');
            $table->integer('green_seconds');
            $table->integer('left_green_seconds')->default(0);
            $table->integer('straight_green_seconds')->default(0);
            $table->integer('right_green_seconds')->default(0);
            $table->integer('offset')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('traffic_light_settings');
    }
};
