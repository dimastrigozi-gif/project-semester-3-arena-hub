import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CalendarDays, RefreshCw } from "lucide-react";
import { stages, formatTanggal, rapikanTurnamen } from "@/utils/turnamen";
import api from "@/utils/api";
import StatusBadge from "@/components/StatusBadge";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function Jadwal() {
  const [turnamen, setTurnamen] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Ambil jadwal turnamen dari API Laravel
  const ambilJadwal = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await api.get("/tournaments");
      const data = response.data.data || [];
      setTurnamen(data.map(rapikanTurnamen));
    } catch (err) {
      setError("Gagal mengambil jadwal turnamen. Pastikan backend Laravel sudah jalan.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    ambilJadwal();
  }, []);

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="h1 mb-2">Jadwal Pertandingan</h1>
      <p className="meta mb-8 text-arena-muted">Jadwal turnamen yang terdaftar di ArenaHub.</p>

      {loading && <LoadingSpinner text="Memuat jadwal turnamen..." />}

      {!loading && error && (
        <div className="rounded-lg border border-dashed border-arena-danger/40 bg-arena-card p-10 text-center">
          <p className="text-arena-danger">{error}</p>
          <button
            onClick={ambilJadwal}
            className="mt-4 inline-flex items-center gap-2 rounded-md bg-arena-cyan px-5 py-2.5 font-semibold text-arena-bg transition-all duration-300 hover:scale-105"
          >
            <RefreshCw className="h-4 w-4" /> Coba Lagi
          </button>
        </div>
      )}

      {!loading && !error && (
        <>
          <h2 className="h2 mb-4">Jadwal Turnamen</h2>
          {turnamen.length === 0 ? (
            <div className="rounded-lg border border-dashed border-arena-border bg-arena-card p-10 text-center">
              <p className="text-arena-muted">Belum ada jadwal turnamen.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {turnamen.map((t) => (
                <Link
                  key={t.id}
                  to={`/turnamen/${t.id}`}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-arena-border bg-arena-card p-4 transition-all duration-300 hover:-translate-y-1 hover:border-arena-cyan/60"
                >
                  <div>
                    <p className="font-heading text-sm font-bold">{t.name}</p>
                    <p className="meta mt-1 flex items-center gap-1.5 text-arena-muted">
                      <CalendarDays className="h-3.5 w-3.5" /> {formatTanggal(t.date)} · {t.time}
                    </p>
                  </div>
                  <StatusBadge status={t.status} />
                </Link>
              ))}
            </div>
          )}

          <h2 className="h2 mb-4 mt-10">Tahapan Pertandingan</h2>
          <div className="flex flex-col gap-0">
            {stages.map((s, i) => (
              <div key={s.key} className="flex items-center gap-3">
                <div className="flex flex-col items-center">
                  <span className="meta flex h-8 w-8 items-center justify-center rounded-full border border-arena-border text-arena-muted">
                    {i + 1}
                  </span>
                  {i < stages.length - 1 && <span className="h-10 w-px bg-arena-border" />}
                </div>
                <div className="flex-1 rounded-md border border-arena-border bg-arena-card px-4 py-3">
                  <p className="meta font-semibold">{s.label}</p>
                  <p className="meta text-arena-muted">{s.date} · {s.time}</p>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
