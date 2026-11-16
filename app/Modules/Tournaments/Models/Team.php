<?php

namespace App\Modules\Tournaments\Models;

use Illuminate\Database\Eloquent\Model;

class Team extends Model
{
    // Nama tabel di database
    protected $table = 'teams';

    // Kolom yang boleh diisi
    protected $fillable = [
        'name',
    ];
}
