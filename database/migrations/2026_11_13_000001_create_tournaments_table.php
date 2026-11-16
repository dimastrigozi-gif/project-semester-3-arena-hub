<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    // Bikin tabel turnamen
    public function up(): void
    {
        Schema::create('tournaments', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('game');
            $table->integer('quota');
            $table->integer('price');
            $table->date('start_date');
            $table->timestamps();
        });
    }

    // Hapus tabel kalau migration di-rollback
    public function down(): void
    {
        Schema::dropIfExists('tournaments');
    }
};
