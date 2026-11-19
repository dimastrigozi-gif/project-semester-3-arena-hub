<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('teams', function (Blueprint $table) {
            $table->foreignId('tournament_id')
                ->after('id')
                ->constrained('tournaments')
                ->cascadeOnDelete();

            $table->string('captain_name')->after('name');
            $table->string('captain_game_id')->after('captain_name');
            $table->text('members')->nullable()->after('captain_game_id');
            $table->string('status')->default('pending')->after('members');

            $table->index(['tournament_id', 'status']);
        });
    }

    public function down(): void
    {
        Schema::table('teams', function (Blueprint $table) {
            $table->dropForeign(['tournament_id']);
            $table->dropIndex(['tournament_id', 'status']);
            $table->dropColumn([
                'tournament_id',
                'captain_name',
                'captain_game_id',
                'members',
                'status',
            ]);
        });
    }
};