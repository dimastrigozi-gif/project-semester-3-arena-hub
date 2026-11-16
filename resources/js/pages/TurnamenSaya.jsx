import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CalendarDays, Users, MapPin, RefreshCw } from "lucide-react";
import { gameById, statusLabel, formatTanggal, rapikanTurnamen } from "@/utils/turnamen";
import api from "@/utils/api";
import StatusBadge from "@/components/StatusBadge";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useAuth } from "@/context/AuthContext";

const sectionLabel = {
  upcoming: "Akan Datang",
  ongoing: "Sedang Berlangsung",
  completed: "Selesai",
};

export default function TurnamenSaya() {
  const { isAuthenticated } = useAuth();
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

      // Sementara ambil semua turnamen dulu, nanti difilter pakai data pendaftaran.
      setTurnamen(data.map(rapikanTurnamen));
    } catch (err) {
      setError("Gagal mengambil data turnamen. Pastikan backend Laravel sudah jalan.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      ambilTurnamen();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <p className="text-arena-muted">Kamu perlu login untuk melihat turnamen yang kamu ikuti.</p>
        <Link
          to="/signin"
          className="mt-4 inline-block rounded-md bg-arena-cyan px-5 py-2.5 font-semibold text-arena-bg transition-all duration-300 hover:scale-105"
        >
          Sign In
        </Link>
      </div>
    );
  }

  const grouped = { upcoming: [], ongoing: [], completed: [] };
  turnamen.forEach((t) => {
    if (grouped[t.status]) {
      grouped[t.status].push(t);
    } else {
      grouped.upcoming.push(t);
    }
  });

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="h1 mb-2">Turnamen Saya</h1>
      <p className="meta mb-8 text-arena-muted">Daftar turnamen yang sudah kamu ikuti beserta statusnya.</p>

      {loading && <LoadingSpinner text="Memuat turnamen kamu..." />}

      {!loading && error && (
        <div className="rounded-lg border border-dashed border-arena-danger/40 bg-arena-card p-10 text-center">
          <p className="text-arena-danger">{error}</p>
          <button
            onClick={ambilTurnamen}
            className="mt-4 inline-flex items-center gap-2 rounded-md bg-arena-cyan px-5 py-2.5 font-semibold text-arena-bg transition-all duration-300 hover:scale-105"
          >
            <RefreshCw className="h-4 w-4" /> Coba Lagi
          </button>
        </div>
      )}

      {!loading && !error && turnamen.length === 0 && (
        <div className="rounded-lg border border-dashed border-arena-border bg-arena-card p-12 text-center">
          <p className="text-arena-muted">Kamu belum mengikuti turnamen apa pun.</p>
          <Link
            to="/cari-turnamen"
            className="mt-4 inline-block rounded-md bg-arena-cyan px-5 py-2.5 font-semibold text-arena-bg transition-all duration-300 hover:scale-105"
          >
            Cari Turnamen
          </Link>
        </div>
      )}

      {!loading &&
        !error &&
        ["upcoming", "ongoing", "completed"].map((key) => {
          const items = grouped[key];
          if (!items || items.length === 0) return null;

          return (
            <section key={key} className="mb-10">
              <h2 className="h2 mb-4">{sectionLabel[key]}</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {items.map((t) => (
                  <div
                    key={t.id}
                    className="rounded-lg border border-arena-border bg-arena-card p-5 transition-all duration-300 hover:-translate-y-1 hover:border-arena-cyan/60 hover:shadow-lg hover:shadow-arena-cyan/10"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span className="meta font-semibold text-arena-cyan">{gameById(t.game).name}</span>
                        <h3 className="mt-1 font-heading text-base font-bold">{t.name}</h3>
                      </div>
                      <StatusBadge status={t.status} label={statusLabel(t.status)} />
                    </div>
                    <div className="meta mt-4 flex flex-col gap-1.5 text-arena-muted">
                      <span className="flex items-center gap-2">
                        <CalendarDays className="h-3.5 w-3.5" /> {formatTanggal(t.date)} · {t.time}
                      </span>
                      <span className="flex items-center gap-2">
                        <Users className="h-3.5 w-3.5" /> {t.participants}/{t.slots} peserta
                      </span>
                      {t.mode === "offline" && (
                        <span className="flex items-center gap-2">
                          <MapPin className="h-3.5 w-3.5" /> {t.location}
                        </span>
                      )}
                    </div>
                    <Link
                      to={`/turnamen-saya/${t.id}`}
                      className="meta mt-4 inline-flex w-full items-center justify-center rounded-md border border-arena-border px-4 py-2.5 font-semibold transition-all duration-300 hover:scale-105 hover:border-arena-cyan hover:text-arena-cyan"
                    >
                      Lihat Turnamen
                    </Link>
                  </div>
                ))}
              </div>
            </section>
          );
        })}
    </div>
  );
}
