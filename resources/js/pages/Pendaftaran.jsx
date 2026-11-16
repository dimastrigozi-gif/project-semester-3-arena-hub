import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowRight, ArrowLeft, User, Users } from "lucide-react";
import { gameById, formatRupiah, rapikanTurnamen } from "@/utils/turnamen";
import api from "@/utils/api";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function Pendaftaran() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [turnamen, setTurnamen] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    name: "",
    captain: "",
    gameId: "",
    members: "",
  });

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
        <LoadingSpinner text="Memuat data turnamen..." />
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

  const isTeam = t.type === "team";
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmitStep1 = (e) => {
    e.preventDefault();
    setStep(2);
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <div className="mb-8 flex items-center gap-2">
        <Step n={1} label="Data Peserta" active={step >= 1} done={step > 1} />
        <span className="h-px flex-1 bg-arena-border" />
        <Step n={2} label="Konfirmasi" active={step >= 2} done={false} />
        <span className="h-px flex-1 bg-arena-border" />
        <Step n={3} label="Pembayaran" active={false} done={false} />
      </div>

      <h1 className="h1 mb-2">Pendaftaran Turnamen</h1>
      <p className="meta mb-6 text-arena-muted">{t.name}</p>

      {step === 1 && (
        <form onSubmit={handleSubmitStep1} className="flex flex-col gap-4 rounded-lg border border-arena-border bg-arena-card p-6">
          <div className="mb-2 flex items-center gap-2">
            {isTeam ? <Users className="h-5 w-5 text-arena-cyan" /> : <User className="h-5 w-5 text-arena-cyan" />}
            <h2 className="font-heading text-base font-bold">{isTeam ? "Data Tim" : "Data Peserta"}</h2>
          </div>

          {isTeam ? (
            <>
              <Field label="Nama Tim" value={form.name} onChange={set("name")} placeholder="Contoh: Team Dimas" />
              <Field label="Nama Captain" value={form.captain} onChange={set("captain")} placeholder="Nama captain" />
              <Field label="Game ID Captain" value={form.gameId} onChange={set("gameId")} placeholder="Game ID" />
              <label className="flex flex-col gap-2">
                <span className="meta font-semibold">Anggota Tim ({t.teamSize} pemain)</span>
                <textarea
                  required
                  value={form.members}
                  onChange={set("members")}
                  placeholder={"Masukkan nama & game ID tiap anggota, satu per baris:\nAndi - ANDI001\nBudi - BUDI002"}
                  rows={4}
                  className="w-full rounded-md border border-arena-border bg-arena-bg px-3 py-2.5 text-sm outline-none focus:border-arena-cyan placeholder:text-arena-muted"
                />
              </label>
            </>
          ) : (
            <>
              <Field label="Nama" value={form.name} onChange={set("name")} placeholder="Nama lengkap" />
              <Field label="Username" value={form.captain} onChange={set("captain")} placeholder="Username in-game" />
              <Field label="Game ID" value={form.gameId} onChange={set("gameId")} placeholder="Game ID" />
            </>
          )}

          <button type="submit" className="mt-2 flex items-center justify-center gap-2 rounded-md bg-arena-cyan px-4 py-3 font-semibold text-arena-bg transition hover:brightness-110">
            Lanjut ke Konfirmasi <ArrowRight className="h-4 w-4" />
          </button>
        </form>
      )}

      {step === 2 && (
        <div className="flex flex-col gap-4 rounded-lg border border-arena-border bg-arena-card p-6">
          <h2 className="font-heading text-base font-bold">Konfirmasi Pendaftaran</h2>
          <div className="flex flex-col gap-2 border-t border-arena-border pt-4">
            <Row label="Turnamen" value={t.name} />
            <Row label="Game" value={gameById(t.game).name} />
            <Row label={isTeam ? "Nama Tim" : "Nama Peserta"} value={form.name || "-"} />
            {isTeam && <Row label="Captain" value={form.captain || "-"} />}
            <Row label="Game ID" value={form.gameId || "-"} />
            <div className="my-2 border-t border-arena-border" />
            <Row label="Biaya Pendaftaran" value={t.fee === 0 ? "Gratis" : formatRupiah(t.fee)} />
            <Row label="Total Pembayaran" value={t.fee === 0 ? "Gratis" : formatRupiah(t.fee)} highlight />
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setStep(1)}
              className="flex items-center justify-center gap-2 rounded-md border border-arena-border px-4 py-3 font-semibold text-arena-muted hover:text-arena-text"
            >
              <ArrowLeft className="h-4 w-4" /> Kembali
            </button>
            <button
              onClick={() => navigate(`/pembayaran/${t.id}`)}
              className="flex flex-1 items-center justify-center gap-2 rounded-md bg-arena-cyan px-4 py-3 font-semibold text-arena-bg transition hover:brightness-110"
            >
              Lanjut ke Pembayaran <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function Step({ n, label, active, done }) {
  return (
    <div className="flex items-center gap-2">
      <span
        className={
          "flex h-7 w-7 items-center justify-center rounded-full meta font-bold " +
          (done ? "bg-arena-success text-arena-bg" : active ? "bg-arena-cyan text-arena-bg" : "border border-arena-border text-arena-muted")
        }
      >
        {n}
      </span>
      <span className={"meta font-semibold " + (active ? "text-arena-text" : "text-arena-muted")}>{label}</span>
    </div>
  );
}

function Field({ label, ...props }) {
  return (
    <label className="flex flex-col gap-2">
      <span className="meta font-semibold">{label}</span>
      <input
        {...props}
        required
        className="w-full rounded-md border border-arena-border bg-arena-bg px-3 py-2.5 text-sm outline-none focus:border-arena-cyan placeholder:text-arena-muted"
      />
    </label>
  );
}

function Row({ label, value, highlight = false }) {
  return (
    <div className="flex items-center justify-between">
      <span className="meta text-arena-muted">{label}</span>
      <span className={"meta " + (highlight ? "font-heading text-lg font-bold text-arena-cyan" : "font-semibold")}>{value}</span>
    </div>
  );
}