import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Trophy, Plus, Users, CalendarDays, ArrowRight, RefreshCw } from "lucide-react";
import { rapikanTurnamen, formatTanggal } from "@/utils/turnamen";
import api from "@/utils/api";
import StatusBadge from "@/components/StatusBadge";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useAuth } from "@/context/AuthContext";

export default function OrganizerDashboard() {
  const { user } = useAuth();
  const [turnamen, setTurnamen] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  const stats = [
    { label: "Total Turnamen", value: turnamen.length, icon: Trophy },
    { label: "Total Kuota Peserta", value: turnamen.reduce((a, t) => a + t.slots, 0), icon: Users },
    { label: "Sedang Berlangsung", value: turnamen.filter((t) => t.status === "ongoing").length, icon: CalendarDays },
  ];

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="h1">Dashboard Organizer</h1>
          <p className="meta mt-1 text-arena-muted">Selamat datang, {user?.name || "Organizer"}.</p>
        </div>
        <Link
          to="/organizer/buat-turnamen"
          className="inline-flex items-center gap-2 rounded-md bg-arena-purple px-4 py-2.5 font-semibold text-white transition-all duration-300 hover:scale-105 hover:brightness-110"
        >
          <Plus className="h-4 w-4" /> Buat Turnamen
        </Link>
      </div>

      {loading && <LoadingSpinner />}

      {!loading && error && (
        <div className="mt-8 rounded-lg border border-dashed border-arena-danger/40 bg-arena-card p-10 text-center">
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
        <>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {stats.map((s) => (
              <div
                key={s.label}
                className="rounded-lg border border-arena-border bg-arena-card p-5 transition-all duration-300 hover:-translate-y-1 hover:border-arena-purple/60"
              >
                <s.icon className="mb-3 h-6 w-6 text-arena-purple" />
                <p className="font-heading text-3xl font-extrabold">{s.value}</p>
                <p className="meta text-arena-muted">{s.label}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 flex items-center justify-between">
            <h2 className="h2">Turnamen Terbaru</h2>
            <Link to="/organizer/turnamen-saya" className="meta flex items-center gap-1 font-semibold text-arena-cyan hover:underline">
              Lihat Semua <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="mt-4 flex flex-col gap-3">
            {turnamen.slice(0, 3).map((t) => (
              <Link
                key={t.id}
                to={`/organizer/turnamen/${t.id}`}
                className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-arena-border bg-arena-card p-4 transition-all duration-300 hover:-translate-y-1 hover:border-arena-purple/60"
              >
                <div>
                  <h3 className="font-heading text-sm font-bold">{t.name}</h3>
                  <p className="meta text-arena-muted">{formatTanggal(t.date)} · {t.slots} kuota peserta</p>
                </div>
                <StatusBadge status={t.status === "upcoming" ? "registration_open" : t.status} />
              </Link>
            ))}
            {turnamen.length === 0 && (
              <div className="rounded-lg border border-dashed border-arena-border bg-arena-card p-10 text-center">
                <p className="text-arena-muted">Belum ada turnamen. Yuk buat yang pertama!</p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
