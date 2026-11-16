import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { CheckCircle2, Circle, ArrowRight, CalendarDays, Users, MapPin, Globe } from "lucide-react";
import { cn } from "@/lib/utils";
import { gameById, formatRupiah, formatTanggal, progressSteps, statusLabel, rapikanTurnamen } from "@/utils/turnamen";
import api from "@/utils/api";
import StatusBadge from "@/components/StatusBadge";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function DetailTurnamenSaya() {
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
        setError("Kamu belum terdaftar di turnamen ini.");
      } finally {
        setLoading(false);
      }
    };

    ambilDetail();
  }, [id]);

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-10">
        <LoadingSpinner text="Memuat detail turnamen..." />
      </div>
    );
  }

  if (error || !turnamen) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <p className="text-arena-muted">{error || "Turnamen tidak ditemukan."}</p>
        <Link to="/turnamen-saya" className="mt-4 inline-block text-arena-cyan hover:underline">
          Kembali
        </Link>
      </div>
    );
  }

  const t = turnamen;
  const game = gameById(t.game);

  // Status pendaftaran sementara ditentukan dari status turnamen
  const currentIdx = t.status === "completed" ? 4 : t.status === "ongoing" ? 3 : 0;

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <Link to="/turnamen-saya" className="meta mb-4 inline-flex items-center gap-1 text-arena-muted hover:text-arena-cyan">
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
        <div className="meta mt-2 flex flex-wrap gap-4 text-arena-muted">
          <span className="flex items-center gap-1.5">
            <CalendarDays className="h-3.5 w-3.5" /> {formatTanggal(t.date)} · {t.time}
          </span>
          <span className="flex items-center gap-1.5">
            <Users className="h-3.5 w-3.5" /> {t.participants}/{t.slots} peserta
          </span>
        </div>
      </div>

      <div className="mt-6 rounded-lg border border-arena-border bg-arena-card p-6">
        <h2 className="h2 mb-5">Progress Pendaftaran</h2>
        <div className="flex flex-col gap-0 sm:flex-row sm:items-center">
          {progressSteps.map((s, i) => {
            const done = i < currentIdx;
            const active = i === currentIdx;
            return (
              <div key={s.key} className="flex flex-1 items-center gap-2 sm:flex-col sm:text-center">
                <div className="flex items-center gap-2 sm:flex-col">
                  {done ? (
                    <CheckCircle2 className="h-6 w-6 text-arena-success" />
                  ) : active ? (
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-arena-cyan text-xs font-bold text-arena-bg">
                      {i + 1}
                    </span>
                  ) : (
                    <Circle className="h-6 w-6 text-arena-muted" />
                  )}
                  <span className={cn("meta font-semibold sm:mt-1", active ? "text-arena-cyan" : done ? "text-arena-success" : "text-arena-muted")}>
                    {s.label}
                  </span>
                </div>
                {i < progressSteps.length - 1 && <span className="hidden h-px flex-1 bg-arena-border sm:block" />}
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="rounded-lg border border-arena-border bg-arena-card p-5">
          <h2 className="h2 mb-3">Status</h2>
          <div className="flex flex-col gap-2">
            <Row label="Status Turnamen" value={statusLabel(t.status)} />
            <Row label="Biaya Pendaftaran" value={t.fee === 0 ? "Gratis" : formatRupiah(t.fee)} />
            <Row label="Kuota" value={`${t.slots} peserta`} />
          </div>
        </div>

        <div className="rounded-lg border border-arena-border bg-arena-card p-5">
          <h2 className="h2 mb-3">Jadwal Pertandingan</h2>
          <p className="meta text-arena-muted">
            Jadwal detail pertandingan bakal tampil setelah data peserta tersimpan di database.
          </p>
          <Link
            to="/jadwal"
            className="meta mt-3 inline-flex items-center justify-center gap-2 rounded-md bg-arena-cyan px-4 py-2.5 font-semibold text-arena-bg transition-all duration-300 hover:scale-105 hover:brightness-110"
          >
            Lihat Jadwal <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      <div className="mt-6 rounded-lg border border-arena-border bg-arena-card p-5">
        <h2 className="h2 mb-3">Informasi {t.mode === "online" ? "Online" : "Offline"}</h2>
        {t.mode === "online" ? (
          <p className="meta text-arena-muted">
            Pertandingan dilakukan secara online. Room ID & password akan dibagikan melalui WhatsApp grup sebelum jadwal pertandingan.
          </p>
        ) : (
          <div className="meta flex flex-col gap-1.5 text-arena-muted">
            <p><span className="font-semibold text-arena-text">Venue:</span> {t.venue}</p>
            <p><span className="font-semibold text-arena-text">Alamat:</span> {t.address}</p>
            <p><span className="font-semibold text-arena-text">Check-in:</span> {t.checkin}</p>
          </div>
        )}
      </div>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex items-center justify-between border-b border-arena-border py-2 last:border-0">
      <span className="meta text-arena-muted">{label}</span>
      <span className="meta font-semibold">{value}</span>
    </div>
  );
}
