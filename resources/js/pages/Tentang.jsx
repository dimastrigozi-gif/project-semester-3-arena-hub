import React from "react";
import { Trophy, Target, Users, CalendarDays } from "lucide-react";

export default function Tentang() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="h1 mb-3">Tentang ArenaHub</h1>
      <p className="text-arena-muted">
        ArenaHub adalah platform yang mempertemukan peserta dan organizer turnamen esport dalam satu tempat.
        Cari turnamen, daftar, lakukan pembayaran, dan pantau seluruh progres pertandinganmu dari awal hingga hasil.
      </p>

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        {[
          { icon: Trophy, title: "Cari & Daftar", desc: "Temukan turnamen dari berbagai game populer dan daftar dalam beberapa langkah." },
          { icon: CalendarDays, title: "Pantau Jadwal", desc: "Lihat jadwal pertandingan dan status progres kamu secara real-time." },
          { icon: Users, title: "Tim atau Individu", desc: "Daftar sebagai individu atau tim, sesuai format turnamen." },
          { icon: Target, title: "Untuk Organizer", desc: "Buat, publish, dan kelola turnamen dengan mudah." },
        ].map((f) => (
          <div key={f.title} className="rounded-lg border border-arena-border bg-arena-card p-5">
            <f.icon className="mb-3 h-6 w-6 text-arena-cyan" />
            <h3 className="font-heading text-base font-bold">{f.title}</h3>
            <p className="meta mt-1 text-arena-muted">{f.desc}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 rounded-lg border border-arena-border bg-arena-card p-5">
        <p className="meta text-arena-muted">
          Prototype ini dibuat untuk presentasi dan referensi desain. Data turnamen, peserta, dan pembayaran
          menggunakan data dummy.
        </p>
      </div>
    </div>
  );
}