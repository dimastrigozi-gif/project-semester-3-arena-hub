import React from "react";
import { Link } from "react-router-dom";
import { MapPin, CalendarDays, Users, Wallet } from "lucide-react";
import { cn } from "@/lib/utils";
import { gameById, formatRupiah, formatTanggal, statusLabel } from "@/utils/turnamen";
import StatusBadge from "@/components/StatusBadge";

export default function TournamentCard({ tournament, to, ctaLabel = "Lihat Detail" }) {
  const game = gameById(tournament.game);

  return (
    <div className="group flex flex-col overflow-hidden rounded-lg border border-arena-border bg-arena-card transition-all duration-300 hover:-translate-y-1 hover:border-arena-cyan/60 hover:shadow-lg hover:shadow-arena-cyan/10">
      <div className="flex items-center justify-between border-b border-arena-border px-4 py-3">
        <span className="meta font-semibold text-arena-cyan">{game.name}</span>
        <span
          className={cn(
            "meta rounded-full px-2.5 py-1 font-semibold",
            tournament.mode === "online"
              ? "bg-arena-purple/15 text-arena-purple"
              : "bg-arena-warning/15 text-arena-warning"
          )}
        >
          {tournament.mode === "online" ? "Online" : "Offline"}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-3 p-4">
        <h3 className="line-clamp-2 font-heading text-base font-bold leading-snug text-arena-text">
          {tournament.name}
        </h3>
        <div className="meta flex flex-col gap-1.5 text-arena-muted">
          <span className="flex items-center gap-2">
            <CalendarDays className="h-3.5 w-3.5" /> {formatTanggal(tournament.date)} · {tournament.time}
          </span>
          {tournament.mode === "offline" && (
            <span className="flex items-center gap-2">
              <MapPin className="h-3.5 w-3.5" /> {tournament.location}
            </span>
          )}
          <span className="flex items-center gap-2">
            <Users className="h-3.5 w-3.5" /> {tournament.participants}/{tournament.slots} peserta
          </span>
          <span className="flex items-center gap-2">
            <Wallet className="h-3.5 w-3.5" /> {tournament.fee === 0 ? "Gratis" : formatRupiah(tournament.fee)}
          </span>
        </div>
        <div className="mt-auto flex items-center justify-between gap-2 pt-2">
          <StatusBadge status={tournament.status} label={statusLabel(tournament.status)} />
          <Link
            to={to}
            className="meta rounded-md border border-arena-border px-3 py-1.5 font-semibold text-arena-text transition-all duration-300 hover:scale-105 hover:border-arena-cyan hover:text-arena-cyan"
          >
            {ctaLabel}
          </Link>
        </div>
      </div>
    </div>
  );
}
