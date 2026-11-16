import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { CheckCircle2, QrCode, Landmark, Wallet } from "lucide-react";
import { cn } from "@/lib/utils";
import { gameById, formatRupiah, rapikanTurnamen } from "@/utils/turnamen";
import api from "@/utils/api";
import LoadingSpinner from "@/components/LoadingSpinner";

const methods = [
  { id: "qris", label: "QRIS", icon: QrCode },
  { id: "bank", label: "Transfer Bank", icon: Landmark },
  { id: "ewallet", label: "E-Wallet", icon: Wallet },
];

export default function Pembayaran() {
  const { id } = useParams();
  const [turnamen, setTurnamen] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [method, setMethod] = useState("qris");
  const [done, setDone] = useState(false);

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
      <div className="mx-auto max-w-2xl px-4 py-10">
        <LoadingSpinner text="Memuat data pembayaran..." />
      </div>
    );
  }

  if (error || !turnamen) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <p className="text-arena-muted">{error || "Turnamen tidak ditemukan."}</p>
        <Link to="/cari-turnamen" className="mt-4 inline-block text-arena-cyan hover:underline">Kembali</Link>
      </div>
    );
  }

  const t = turnamen;

  if (done) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <span className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-arena-success/15">
          <CheckCircle2 className="h-9 w-9 text-arena-success" />
        </span>
        <h1 className="h1">Pembayaran Berhasil</h1>
        <p className="meta mt-2 text-arena-muted">
          Pendaftaranmu untuk <span className="font-semibold text-arena-text">{t.name}</span> telah dikonfirmasi.
        </p>
        <div className="mt-4 inline-flex items-center gap-2 rounded-md border border-arena-success/30 bg-arena-success/10 px-4 py-2">
          <span className="h-2 w-2 rounded-full bg-arena-success" />
          <span className="meta font-semibold text-arena-success">Status: Terdaftar</span>
        </div>
        <div className="mt-8 flex flex-col gap-3">
          <Link
            to={`/turnamen-saya/${t.id}`}
            className="rounded-md bg-arena-cyan px-4 py-3 font-semibold text-arena-bg transition hover:brightness-110"
          >
            Lihat Turnamen Saya
          </Link>
          <Link to="/turnamen-saya" className="meta text-arena-muted hover:text-arena-cyan">
            Lihat semua turnamen saya
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="h1 mb-2">Pembayaran</h1>
      <p className="meta mb-6 text-arena-muted">Selesaikan pembayaran untuk menyelesaikan pendaftaran.</p>

      <div className="rounded-lg border border-arena-border bg-arena-card p-6">
        <h2 className="font-heading text-base font-bold">Ringkasan</h2>
        <div className="mt-3 flex flex-col gap-2 border-t border-arena-border pt-3">
          <Row label="Turnamen" value={t.name} />
          <Row label="Game" value={gameById(t.game).name} />
          <Row label="Biaya Pendaftaran" value={t.fee === 0 ? "Gratis" : formatRupiah(t.fee)} />
          <div className="my-2 border-t border-arena-border" />
          <div className="flex items-center justify-between">
            <span className="font-semibold">Total Pembayaran</span>
            <span className="font-heading text-xl font-bold text-arena-cyan">
              {t.fee === 0 ? "Gratis" : formatRupiah(t.fee)}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-lg border border-arena-border bg-arena-card p-6">
        <h2 className="font-heading text-base font-bold">Metode Pembayaran</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {methods.map((m) => (
            <button
              key={m.id}
              onClick={() => setMethod(m.id)}
              className={cn(
                "flex flex-col items-center gap-2 rounded-lg border p-4 transition",
                method === m.id ? "border-arena-cyan bg-arena-cyan/10" : "border-arena-border hover:border-arena-muted"
              )}
            >
              <m.icon className={cn("h-6 w-6", method === m.id ? "text-arena-cyan" : "text-arena-muted")} />
              <span className="meta font-semibold">{m.label}</span>
            </button>
          ))}
        </div>

        <div className="mt-5 rounded-md border border-dashed border-arena-border bg-arena-bg p-5 text-center">
          {method === "qris" && (
            <>
              <div className="mx-auto flex h-40 w-40 items-center justify-center rounded-md bg-white p-3">
                <QrCode className="h-full w-full text-arena-bg" />
              </div>
              <p className="meta mt-3 text-arena-muted">Scan QRIS untuk membayar (mockup)</p>
            </>
          )}
          {method === "bank" && (
            <div className="text-left">
              <p className="meta text-arena-muted">Transfer ke rekening berikut:</p>
              <p className="mt-2 font-heading text-lg font-bold">Bank BCA · 1234567890</p>
              <p className="meta text-arena-muted">a.n. ArenaHub Esport</p>
            </div>
          )}
          {method === "ewallet" && (
            <div className="text-left">
              <p className="meta text-arena-muted">Bayar via E-Wallet:</p>
              <p className="mt-2 font-heading text-lg font-bold">GoPay / OVO / DANA</p>
              <p className="meta text-arena-muted">0812-3456-7890 (ArenaHub)</p>
            </div>
          )}
        </div>

        <button
          onClick={() => setDone(true)}
          className="mt-5 w-full rounded-md bg-arena-cyan px-4 py-3 font-semibold text-arena-bg transition hover:brightness-110"
        >
          Saya Sudah Bayar
        </button>
        <p className="meta mt-2 text-center text-arena-muted">Pembayaran masih berupa simulasi untuk tugas kuliah.</p>
      </div>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex items-center justify-between">
      <span className="meta text-arena-muted">{label}</span>
      <span className="meta font-semibold text-right">{value}</span>
    </div>
  );
}