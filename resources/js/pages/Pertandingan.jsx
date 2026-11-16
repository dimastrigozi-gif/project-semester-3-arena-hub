import React from "react";
import { Link } from "react-router-dom";
import { Swords } from "lucide-react";

export default function Pertandingan() {
  // Data pertandingan belum ada di backend, nanti diisi setelah pendaftaran jalan.
  return (
    <div className="mx-auto max-w-3xl px-4 py-20 text-center">
      <span className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-arena-cyan/10">
        <Swords className="h-7 w-7 text-arena-cyan" />
      </span>
      <h1 className="h1">Pertandingan</h1>
      <p className="meta mt-2 text-arena-muted">
        Belum ada pertandingan yang bisa ditampilkan. Data pertandingan akan muncul setelah fitur pendaftaran selesai.
      </p>
      <Link
        to="/jadwal"
        className="mt-6 inline-block rounded-md bg-arena-cyan px-5 py-2.5 font-semibold text-arena-bg transition-all duration-300 hover:scale-105"
      >
        Lihat Jadwal
      </Link>
    </div>
  );
}
