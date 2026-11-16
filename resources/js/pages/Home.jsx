import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Search, Plus, ArrowRight, Gamepad2, RefreshCw } from "lucide-react";
import { games, rapikanTurnamen } from "@/utils/turnamen";
import api from "@/utils/api";
import TournamentCard from "@/components/TournamentCard";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function Home() {
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
      setError("Gagal mengambil data turnamen. Pastikan backend Laravel sudah jalan di port 8000.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    ambilTurnamen();
  }, []);

  const ongoing = turnamen.filter((t) => t.status === "ongoing");
  const upcoming = turnamen.filter((t) => t.status !== "ongoing" && t.status !== "completed");

  return (
    <div>
      <section className="relative overflow-hidden border-b border-arena-border">
        <div className="absolute inset-0 bg-[radial-gradient(60%_80%_at_50%_0%,rgba(0,240,255,0.12),transparent)]" />
        <div className="absolute inset-0 bg-[radial-gradient(50%_60%_at_80%_20%,rgba(112,0,255,0.14),transparent)]" />
        <div className="relative mx-auto max-w-6xl px-4 py-16 sm:py-20 md:py-28">
          <div className="max-w-2xl">
            <span className="meta mb-4 inline-flex items-center gap-2 rounded-full border border-arena-border bg-arena-card px-3 py-1 font-semibold text-arena-cyan">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-arena-cyan" />
              Platform Turnamen Esport
            </span>
            <h1 className="hero-title text-arena-text">
              Temukan Turnamenmu.
              <br />
              <span className="text-arena-cyan">Siap Bertanding?</span>
            </h1>
            <p className="mt-5 max-w-lg text-base text-arena-muted">
              Cari, daftar, dan pantau turnamen esport dalam satu platform.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/cari-turnamen"
                className="inline-flex items-center justify-center gap-2 rounded-md bg-arena-cyan px-6 py-3 font-semibold text-arena-bg transition-all duration-300 hover:scale-105 hover:brightness-110"
              >
                <Search className="h-5 w-5" /> Cari Turnamen
              </Link>
              <Link
                to="/signup"
                className="inline-flex items-center justify-center gap-2 rounded-md border border-arena-purple bg-arena-purple/10 px-6 py-3 font-semibold text-arena-text transition-all duration-300 hover:scale-105 hover:bg-arena-purple/20"
              >
                <Plus className="h-5 w-5" /> Buat Turnamen
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12">
        <h2 className="h2 mb-5">Game</h2>
        <div className="flex gap-3 overflow-x-auto pb-2">
          {games.map((g) => (
            <Link
              key={g.id}
              to={`/cari-turnamen?game=${g.id}`}
              className="flex shrink-0 items-center gap-2.5 rounded-lg border border-arena-border bg-arena-card px-5 py-3 transition-all duration-300 hover:scale-105 hover:border-arena-cyan"
            >
              <Gamepad2 className="h-5 w-5 text-arena-cyan" />
              <span className="font-heading font-bold">{g.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {loading && (
        <section className="mx-auto max-w-6xl px-4 pb-16">
          <LoadingSpinner />
        </section>
      )}

      {!loading && error && (
        <section className="mx-auto max-w-6xl px-4 pb-16">
          <div className="rounded-lg border border-dashed border-arena-danger/40 bg-arena-card p-10 text-center">
            <p className="text-arena-danger">{error}</p>
            <button
              onClick={ambilTurnamen}
              className="mt-4 inline-flex items-center gap-2 rounded-md bg-arena-cyan px-5 py-2.5 font-semibold text-arena-bg transition-all duration-300 hover:scale-105"
            >
              <RefreshCw className="h-4 w-4" /> Coba Lagi
            </button>
          </div>
        </section>
      )}

      {!loading && !error && ongoing.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 pb-12">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-2">
            <h2 className="h2">Turnamen Sedang Berlangsung</h2>
            <Link
              to="/cari-turnamen?status=ongoing"
              className="meta flex items-center gap-1 font-semibold text-arena-cyan hover:underline"
            >
              Lihat Semua <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {ongoing.map((t) => (
              <TournamentCard key={t.id} tournament={t} to={`/turnamen/${t.id}`} />
            ))}
          </div>
        </section>
      )}

      {!loading && !error && (
        <section className="mx-auto max-w-6xl px-4 pb-16">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-2">
            <h2 className="h2">Turnamen Akan Datang</h2>
            <Link
              to="/cari-turnamen"
              className="meta flex items-center gap-1 font-semibold text-arena-cyan hover:underline"
            >
              Lihat Semua Turnamen <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {upcoming.length === 0 ? (
            <div className="rounded-lg border border-dashed border-arena-border bg-arena-card p-10 text-center">
              <p className="text-arena-muted">Belum ada turnamen yang akan datang.</p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {upcoming.map((t) => (
                <TournamentCard key={t.id} tournament={t} to={`/turnamen/${t.id}`} />
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  );
}
