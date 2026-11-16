import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  CalendarDays,
  Clock,
  MapPin,
  Wallet,
  Users,
  Globe,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { gameById, formatRupiah, formatTanggal, stages, rapikanTurnamen } from "@/utils/turnamen";
import api from "@/utils/api";
import { useAuth } from "@/context/AuthContext";
import StatusBadge from "@/components/StatusBadge";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function DetailTurnamen() {
  const { id } = useParams();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
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
        <Link to="/cari-turnamen" className="mt-4 inline-block text-arena-cyan hover:underline">
          Kembali ke Cari Turnamen
        </Link>
      </div>
    );
  }

  const t = turnamen;
  const game = gameById(t.game);
  const slotsLeft = t.slots - t.participants;
  const progress = t.slots > 0 ? (t.participants / t.slots) * 100 : 0;

  const handleDaftar = () => {
    if (!isAuthenticated) {
      navigate(`/signin?redirect=/pendaftaran/${t.id}`);
    } else {
      navigate(`/pendaftaran/${t.id}`);
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <Link to="/cari-turnamen" className="meta mb-4 inline-flex items-center gap-1 text-arena-muted hover:text-arena-cyan">
        ← Kembali
      </Link>

      <div className="rounded-lg border border-arena-border bg-arena-card p-6">
        <div className="flex flex-wrap items-center gap-3">
          <span className="meta rounded-md bg-arena-cyan/10 px-3 py-1 font-semibold text-arena-cyan">{game.name}</span>
          <span className="meta flex items-center gap-1.5 rounded-md bg-arena-purple/10 px-3 py-1 font-semibold text-arena-purple">
            {t.mode === "online" ? <Globe className="h-3.5 w-3.5" /> : <MapPin className="h-3.5 w-3.5" />}
            {t.mode === "online" ? "Online" : "Offline"}
          </span>
          <StatusBadge status={t.status} />
        </div>
        <h1 className="h1 mt-4">{t.name}</h1>
        <p className="meta mt-1 text-arena-muted">Diselenggarakan oleh {t.organizer}</p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Info icon={CalendarDays} label="Tanggal" value={formatTanggal(t.date)} />
          <Info icon={Clock} label="Waktu" value={t.time} />
          <Info icon={Wallet} label="Biaya" value={t.fee === 0 ? "Gratis" : formatRupiah(t.fee)} />
          <Info icon={Users} label="Slot" value={`${t.participants}/${t.slots} terisi`} />
        </div>
        {t.mode === "offline" && (
          <div className="mt-4 rounded-md border border-arena-border bg-arena-bg p-4">
            <p className="meta flex items-center gap-2 font-semibold text-arena-warning">
              <MapPin className="h-4 w-4" /> Venue: {t.venue}
            </p>
            <p className="meta mt-1 text-arena-muted">{t.address}</p>
            <p className="meta mt-1 text-arena-muted">Check-in: {t.checkin}</p>
          </div>
        )}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="flex flex-col gap-6 lg:col-span-2">
          {/* Tentang */}
          <Section title="Tentang Turnamen">
            <p className="text-sm leading-relaxed text-arena-muted">{t.description}</p>
          </Section>

          {/* Jadwal */}
          <Section title="Jadwal">
            <div className="flex flex-col gap-0">
              {stages.map((s, i) => (
                <div key={s.key} className="flex items-center gap-3">
                  <div className="flex flex-col items-center">
                    <span className="meta flex h-7 w-7 items-center justify-center rounded-full border border-arena-cyan bg-arena-cyan/10 font-bold text-arena-cyan">
                      {i + 1}
                    </span>
                    {i < stages.length - 1 && <span className="h-8 w-px bg-arena-border" />}
                  </div>
                  <div className="flex-1 py-2">
                    <p className="meta font-semibold">{s.label}</p>
                    <p className="meta text-arena-muted">{s.date} · {s.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </Section>

          {/* Peserta */}
          <Section title="Peserta">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-sm text-arena-muted">
                <span className="font-heading text-2xl font-bold text-arena-text">{t.participants}</span> / {t.slots} peserta terdaftar
              </p>
              <span className="meta font-semibold text-arena-success">{slotsLeft} slot tersisa</span>
            </div>
            <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-arena-bg">
              <div className="h-full rounded-full bg-arena-cyan transition-all duration-500" style={{ width: `${progress}%` }} />
            </div>
          </Section>

          {/* Peraturan */}
          <Section title="Peraturan">
            <ul className="flex flex-col gap-2">
              {t.rules.map((r, i) => (
                <li key={i} className="flex gap-2 text-sm text-arena-muted">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-arena-cyan" />
                  {r}
                </li>
              ))}
            </ul>
          </Section>
        </div>

        {/* Sidebar daftar */}
        <div className="lg:col-span-1">
          <div className="sticky top-20 rounded-lg border border-arena-border bg-arena-card p-5">
            <h3 className="font-heading text-lg font-bold">Status Pendaftaran</h3>
            <div className="mt-3 flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-arena-success" />
              <span className="meta font-semibold text-arena-success">Pendaftaran Dibuka</span>
            </div>
            <div className="mt-4 flex flex-col gap-2 border-t border-arena-border pt-4">
              <Row label="Biaya Pendaftaran" value={t.fee === 0 ? "Gratis" : formatRupiah(t.fee)} />
              <Row label="Format" value={t.type === "team" ? `Tim (${t.teamSize} pemain)` : "Individu"} />
              <Row label="Mode" value={t.mode === "online" ? "Online" : "Offline"} />
            </div>
            <button
              onClick={handleDaftar}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-md bg-arena-cyan px-4 py-3 font-semibold text-arena-bg transition-all duration-300 hover:scale-105 hover:brightness-110"
            >
              Daftar Sekarang <ArrowRight className="h-4 w-4" />
            </button>
            {!isAuthenticated && (
              <p className="meta mt-2 text-center text-arena-muted">
                Kamu perlu{" "}
                <Link to={`/signin?redirect=/pendaftaran/${t.id}`} className="text-arena-cyan hover:underline">
                  Sign In
                </Link>{" "}
                untuk mendaftar.
              </p>
            )}
          </div>
        </div>
      </div>
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

function Section({ title, children }) {
  return (
    <div className="rounded-lg border border-arena-border bg-arena-card p-5">
      <h2 className="h2 mb-3">{title}</h2>
      {children}
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex items-center justify-between">
      <span className="meta text-arena-muted">{label}</span>
      <span className="meta font-semibold">{value}</span>
    </div>
  );
}
