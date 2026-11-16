<?php

namespace App\Modules\Tournaments\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Tournaments\Models\Tournament;
use Illuminate\Http\Request;

class TournamentApiController extends Controller
{
    // Ambil semua data turnamen dari database
    public function index()
    {
        // Urutkan dari tanggal paling dekat
        $dataTurnamen = Tournament::orderBy('start_date', 'asc')->get();

        return response()->json([
            'message' => 'Daftar turnamen berhasil diambil',
            'data' => $dataTurnamen,
        ]);
    }

    // Ambil satu turnamen buat halaman detail
    public function show($id)
    {
        $turnamen = Tournament::find($id);

        // Kalau datanya nggak ada, balikin 404
        if (! $turnamen) {
            return response()->json([
                'message' => 'Turnamen tidak ditemukan',
            ], 404);
        }

        return response()->json([
            'message' => 'Detail turnamen berhasil diambil',
            'data' => $turnamen,
        ]);
    }

    // Simpan turnamen baru dari form React
    public function store(Request $request)
    {
        // Validasi input dari React, lalu simpan turnamen baru ke database
    }

    // Daftarkan tim ke turnamen
    public function register(Request $request, $id)
    {
        // Cek kuota pakai transaksi biar pendaftaran barengan nggak bikin over
    }
}
