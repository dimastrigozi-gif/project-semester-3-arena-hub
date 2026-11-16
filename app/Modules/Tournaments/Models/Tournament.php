<?php

namespace App\Modules\Tournaments\Models;

use Illuminate\Database\Eloquent\Model;

class Tournament extends Model
{
    // Nama tabel di database
    protected $table = 'tournaments';

    // Kolom yang boleh diisi dari form
    protected $fillable = [
        'title',
        'game',
        'quota',
        'price',
        'start_date',
    ];

    // Biar tipe datanya rapi waktu dikirim ke React
    protected $casts = [
        'quota' => 'integer',
        'price' => 'integer',
        'start_date' => 'date:Y-m-d',
    ];
}
