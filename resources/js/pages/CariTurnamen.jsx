import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, SlidersHorizontal, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { games, rapikanTurnamen } from "@/utils/turnamen";
import api from "@/utils/api";
import TournamentCard from "@/components/TournamentCard";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function CariTurnamen() {
  const [params, setParams] = useSearchParams();
  const [q, setQ] = useState(params.get("q") || "");
  const [game, setGame] = useState(params.get("game") || "all");
  const [mode, setMode] = useState("all");
  const [status, setStatus] = useState(params.get("status") || "all");
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

  const filtered = useMemo(() => {
    return turnamen.filter((t) => {
      const matchQ =
        !q ||
        t.name.toLowerCase().includes(q.toLowerCase()) ||
        t.organizer.toLowerCase().includes(q.toLowerCase());
      const matchGame = game === "all" || t.game === game;
      const matchMode = mode === "all" || t.mode === mode;
      const matchStatus = status === "all" || t.status === status;
      return matchQ && matchGame && matchMode && matchStatus;
    });
  }, [turnamen, q, game, mode, status]);

  const update = (key, val) => {
    const next = new URLSearchParams(params);
    if (val && val !== "all") next.set(key, val);
    else next.delete(key);
    setParams(next, { replace: true });
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="h1 mb-2">Cari Turnamen</h1>
      <p className="meta mb-6 text-arena-muted">Temukan turnamen yang sedang dibuka dan sesuai dengan game favoritmu.</p>

      <div className="flex items-center gap-2 rounded-lg border border-arena-border bg-arena-card px-4 focus-within:border-arena-cyan">
        <Search className="h-5 w-5 text-arena-muted" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Cari turnamen atau game..."
          className="w-full bg-transparent py-3 text-sm outline-none placeholder:text-arena-muted"
        />
      </div>

      <div className="mt-4 flex flex-col gap-4">
        <FilterRow label="Game">
          <Chip active={game === "all"} onClick={() => { setGame("all"); update("game", "all"); }}>Semua Game</Chip>
          {games.map((g) => (
            <Chip key={g.id} active={game === g.id} onClick={() => { setGame(g.id); update("game", g.id); }}>{g.name}</Chip>
          ))}
        </FilterRow>
        <FilterRow label="Mode">
          <Chip active={mode === "all"} onClick={() => setMode("all")}>Semua</Chip>
          <Chip active={mode === "online"} onClick={() => setMode("online")}>Online</Chip>
          <Chip active={mode === "offline"} onClick={() => setMode("offline")}>Offline</Chip>
        </FilterRow>
        <FilterRow label="Status">
          <Chip active={status === "all"} onClick={() => { setStatus("all"); update("status", "all"); }}>Semua</Chip>
          <Chip active={status === "upcoming"} onClick={() => { setStatus("upcoming"); update("status", "upcoming"); }}>Akan Datang</Chip>
          <Chip active={status === "ongoing"} onClick={() => { setStatus("ongoing"); update("status", "ongoing"); }}>Sedang Berlangsung</Chip>
          <Chip active={status === "completed"} onClick={() => { setStatus("completed"); update("status", "completed"); }}>Selesai</Chip>
        </FilterRow>
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
          <div className="mt-8 flex items-center justify-between">
            <h2 className="h2">{filtered.length} Turnamen Ditemukan</h2>
          </div>

          {filtered.length === 0 ? (
            <div className="mt-6 rounded-lg border border-dashed border-arena-border bg-arena-card p-12 text-center">
              <SlidersHorizontal className="mx-auto mb-3 h-8 w-8 text-arena-muted" />
              <p className="text-arena-muted">Tidak ada turnamen yang cocok dengan filter ini.</p>
            </div>
          ) : (
            <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((t) => (
                <TournamentCard key={t.id} tournament={t} to={`/turnamen/${t.id}`} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

function FilterRow({ label, children }) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
      <span className="meta w-16 shrink-0 font-semibold text-arena-muted">{label}</span>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

function Chip({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "meta rounded-full border px-3.5 py-1.5 font-semibold transition-all duration-300 hover:scale-105",
        active
          ? "border-arena-cyan bg-arena-cyan/10 text-arena-cyan"
          : "border-arena-border bg-arena-card text-arena-muted hover:text-arena-text"
      )}
    >
      {children}
    </button>
  );
}
