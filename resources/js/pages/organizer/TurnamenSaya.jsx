import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Search, RefreshCw } from "lucide-react";
import { gameById, statusLabel, formatTanggal, rapikanTurnamen } from "@/utils/turnamen";
import api from "@/utils/api";
import StatusBadge from "@/components/StatusBadge";
import LoadingSpinner from "@/components/LoadingSpinner";

const orgStatus = (t) => {
  if (t.status === "completed") return "completed";
  if (t.status === "ongoing") return "ongoing";
  if (t.registrationOpen) return "registration_open";
  return "published";
};

export default function OrganizerTurnamenSaya() {
  const [turnamen, setTurnamen] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");
  const filters = ["all", "registration_open", "ongoing", "completed"];

  // Ambil data turnamen dari API Laravel
  const ambilTurnamen = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await api.get("/tournaments");
      const data = response.data.data || [];
      setTurnamen(data.map(rapikanTurnamen));
    } catch (err) {
      setError("Gagal mengambil data turnamen. Pastikan backend Laravel sudah jalan.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    ambilTurnamen();
  }, []);

  const filtered = turnamen.filter((t) => filter === "all" || orgStatus(t) === filter);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="h1">Turnamen Saya</h1>
          <p className="meta mt-1 text-arena-muted">Kelola turnamen yang telah kamu buat.</p>
        </div>
        <Link
          to="/organizer/buat-turnamen"
          className="inline-flex items-center gap-2 rounded-md bg-arena-purple px-4 py-2.5 font-semibold text-white transition-all duration-300 hover:scale-105 hover:brightness-110"
        >
          <Plus className="h-4 w-4" /> Buat Turnamen
        </Link>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={
              "meta rounded-full border px-3.5 py-1.5 font-semibold transition-all duration-300 hover:scale-105 " +
              (filter === f ? "border-arena-purple bg-arena-purple/10 text-arena-purple" : "border-arena-border bg-arena-card text-arena-muted hover:text-arena-text")
            }
          >
            {f === "all" ? "Semua" : statusLabel(f)}
          </button>
        ))}
      </div>

      {loading && <LoadingSpinner />}

      {!loading && error && (
        <div className="mt-6 rounded-lg border border-dashed border-arena-danger/40 bg-arena-card p-10 text-center">
          <p className="text-arena-danger">{error}</p>
          <button
            onClick={ambilTurnamen}
            className="mt-4 inline-flex items-center gap-2 rounded-md bg-arena-cyan px-5 py-2.5 font-semibold text-arena-bg transition-all duration-300 hover:scale-105"
          >
            <RefreshCw className="h-4 w-4" /> Coba Lagi
          </button>
        </div>
      )}

      {!loading && !error && (
        <div className="mt-6 flex flex-col gap-3">
          {filtered.map((t) => (
            <Link
              key={t.id}
              to={`/organizer/turnamen/${t.id}`}
              className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-arena-border bg-arena-card p-5 transition-all duration-300 hover:-translate-y-1 hover:border-arena-purple/60"
            >
              <div className="flex-1">
                <span className="meta font-semibold text-arena-cyan">{gameById(t.game).name}</span>
                <h3 className="mt-1 font-heading text-base font-bold">{t.name}</h3>
                <p className="meta mt-1 text-arena-muted">
                  {formatTanggal(t.date)} · {t.mode === "online" ? "Online" : "Offline"} · {t.slots} kuota
                </p>
              </div>
              <StatusBadge status={orgStatus(t)} label={statusLabel(orgStatus(t))} />
            </Link>
          ))}
          {filtered.length === 0 && (
            <div className="rounded-lg border border-dashed border-arena-border bg-arena-card p-12 text-center">
              <Search className="mx-auto mb-3 h-8 w-8 text-arena-muted" />
              <p className="text-arena-muted">Belum ada turnamen dengan status ini.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
