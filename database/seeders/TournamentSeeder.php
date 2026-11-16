<?php

namespace Database\Seeders;

use App\Modules\Tournaments\Models\Tournament;
use Illuminate\Database\Seeder;

class TournamentSeeder extends Seeder
{
    // Isi data contoh biar halaman depan nggak kosong
    public function run(): void
    {
        Tournament::create([
            'title' => 'Poliwangi Mobile Legends Championship',
            'game' => 'mlbb',
            'quota' => 32,
            'price' => 50000,
            'start_date' => '2026-09-18',
        ]);

        Tournament::create([
            'title' => 'Banyuwangi Free Fire Cup',
            'game' => 'freefire',
            'quota' => 48,
            'price' => 25000,
            'start_date' => '2026-09-20',
        ]);

        Tournament::create([
            'title' => 'Banyuwangi E-Football Tournament',
            'game' => 'efootball',
            'quota' => 64,
            'price' => 20000,
            'start_date' => '2026-09-25',
        ]);

        Tournament::create([
            'title' => 'East Java Point Blank Championship',
            'game' => 'pointblank',
            'quota' => 24,
            'price' => 75000,
            'start_date' => '2026-10-05',
        ]);
    }
}
