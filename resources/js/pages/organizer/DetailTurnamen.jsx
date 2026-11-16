import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { CalendarDays, Clock, Users, Wallet, Globe, MapPin, ArrowRight } from "lucide-react";
import { gameById, formatRupiah, formatTanggal, stages, statusLabel, rapikanTurnamen } from "@/utils/turnamen";
import api from "@/utils/api";
import StatusBadge from "@/components/StatusBadge";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function OrganizerDetailTurnamen() {
  const { id } = useParams();
  const [turnamen, setTurnamen] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Ambil detail turnamen dari API Laravel
  useEffect(() => {
    const ambilDetail = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await api.get(`/tournaments/${id}`);
        setTurnamen(rapikanTurnamen(response.data.data));
      } catch (err) {
        setError("Turnamen tidak ditemukan.");
      } finally {
        setLoading(false);
      }
    };

    ambilDetail();
  }, [id]);

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-10">
        <LoadingSpinner text="Memuat detail turnamen..." />
      </div>
    );
  }

  if (error || !turnamen) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <p className="text-arena-muted">{error || "Turnamen tidak ditemukan."}</p>
        <Link to="/organizer/turnamen-saya" className="mt-4 inline-block text-arena-cyan hover:underline">Kembali</Link>
      </div>
    );
  }

  const t = turnamen;
  const game = gameById(t.game);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <Link to="/organizer/turnamen-saya" className="meta mb-4 inline-flex items-center gap-1 text-arena-muted hover:text-arena-cyan">
        ← Turnamen Saya
      </Link>

      <div className="rounded-lg border border-arena-border bg-arena-card p-6">
        <div className="flex flex-wrap items-center gap-3">
          <span className="meta rounded-md bg-arena-cyan/10 px-3 py-1 font-semibold text-arena-cyan">{game.name}</span>
          <span className="meta flex items-center gap-1.5 rounded-md bg-arena-purple/10 px-3 py-1 font-semibold text-arena-purple">
            {t.mode === "online" ? <Globe className="h-3.5 w-3.5" /> : <MapPin className="h-3.5 w-3.5" />}
            {t.mode === "online" ? "Online" : "Offline"}
          </span>
          <StatusBadge status={t.status} label={statusLabel(t.status)} />
        </div>
        <h1 className="h1 mt-4">{t.name}</h1>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Info icon={CalendarDays} label="Tanggal" value={formatTanggal(t.date)} />
          <Info icon={Clock} label="Waktu" value={t.time} />
          <Info icon={Wallet} label="Biaya" value={t.fee === 0 ? "Gratis" : formatRupiah(t.fee)} />
          <Info icon={Users} label="Peserta" value={`${t.participants}/${t.slots}`} />
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        {/* Jadwal */}
        <div className="rounded-lg border border-arena-border bg-arena-card p-5">
          <h2 className="h2 mb-4">Jadwal Pertandingan</h2>
          <div className="flex flex-col gap-0">
            {stages.map((s, i) => (
              <div key={s.key} className="flex items-center gap-3">
                <div className="flex flex-col items-center">
                  <span className="meta flex h-7 w-7 items-center justify-center rounded-full border border-arena-cyan bg-arena-cyan/10 font-bold text-arena-cyan">{i + 1}</span>
                  {i < stages.length - 1 && <span className="h-6 w-px bg-arena-border" />}
                </div>
                <div className="py-1.5">
                  <p className="meta font-semibold">{s.label}</p>
                  <p className="meta text-arena-muted">{s.date} · {s.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Peserta */}
        <div className="rounded-lg border border-arena-border bg-arena-card p-5">
          <div className="flex items-center justify-between">
            <h2 className="h2">Peserta</h2>
            <span className="meta font-semibold text-arena-cyan">{t.participants} terdaftar</span>
          </div>
          <div className="mt-3 rounded-md border border-dashed border-arena-border bg-arena-bg p-8 text-center">
            <p className="meta text-arena-muted">
              Data peserta bakal muncul setelah fitur pendaftaran tersambung ke database.
            </p>
          </div>
        </div>
      </div>

      {/* Peraturan */}
      <div className="mt-6 rounded-lg border border-arena-border bg-arena-card p-5">
        <h2 className="h2 mb-3">Peraturan</h2>
        <ul className="flex flex-col gap-2">
          {t.rules.map((r, i) => (
            <li key={i} className="flex gap-2 text-sm text-arena-muted">
              <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-arena-cyan" />
              {r}
            </li>
          ))}
        </ul>
      </div>

      <Link
        to="/organizer/turnamen-saya"
        className="meta mt-6 inline-flex items-center gap-2 rounded-md border border-arena-border px-4 py-2.5 font-semibold transition-all duration-300 hover:scale-105 hover:border-arena-cyan hover:text-arena-cyan"
      >
        Kembali ke Turnamen Saya <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}

function Info({ icon: Icon, label, value }) {
  return (
    <div className="rounded-md border border-arena-border bg-arena-bg p-3">
      <span className="meta flex items-center gap-1.5 text-arena-muted">
        <Icon className="h-3.5 w-3.5" /> {label}
      </span>
      <p className="mt-1 text-sm font-semibold">{value}</p>
    </div>
  );
}
