import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, Upload } from "lucide-react";
import { games, formatRupiah } from "@/utils/turnamen";
import api from "@/utils/api";
import { useToast } from "@/components/ui/use-toast";

export default function BuatTurnamen() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [preview, setPreview] = useState(false);
  const [menyimpan, setMenyimpan] = useState(false);
  const [form, setForm] = useState({
    name: "",
    game: "mlbb",
    mode: "online",
    date: "",
    time: "",
    location: "",
    fee: 0,
    slots: 32,
    description: "",
    rules: "",
  });

  const set = (k) => (e) => {
    const val = e.target.type === "number" ? Number(e.target.value) : e.target.value;
    setForm((f) => ({ ...f, [k]: val }));
  };

  // Kirim data turnamen baru ke API Laravel
  const handlePublish = async () => {
    setMenyimpan(true);

    try {
      await api.post("/tournaments", {
        title: form.name,
        game: form.game,
        quota: Number(form.slots),
        price: Number(form.fee),
        start_date: form.date,
      });

      toast({ title: "Turnamen berhasil dipublikasikan!" });
      navigate("/organizer/turnamen-saya");
    } catch (err) {
      toast({ title: "Gagal menyimpan turnamen", description: "Pastikan backend Laravel sudah jalan." });
    } finally {
      setMenyimpan(false);
    }
  };

  if (preview) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10">
        <h1 className="h1 mb-2">Preview Turnamen</h1>
        <p className="meta mb-6 text-arena-muted">Tinjau detail turnamen sebelum dipublikasikan.</p>

        <div className="rounded-lg border border-arena-border bg-arena-card p-6">
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-md bg-arena-cyan/10 px-3 py-1 meta font-semibold text-arena-cyan">
              {games.find((g) => g.id === form.game)?.name}
            </span>
            <span className="rounded-md bg-arena-purple/10 px-3 py-1 meta font-semibold text-arena-purple">
              {form.mode === "online" ? "Online" : "Offline"}
            </span>
          </div>
          <h2 className="h2 mt-4">{form.name || "Nama Turnamen"}</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <PreviewRow label="Tanggal" value={form.date || "-"} />
            <PreviewRow label="Waktu" value={form.time || "-"} />
            <PreviewRow label="Biaya" value={form.fee === 0 ? "Gratis" : formatRupiah(form.fee)} />
            <PreviewRow label="Slot" value={`${form.slots} tim`} />
            {form.mode === "offline" && <PreviewRow label="Lokasi" value={form.location || "-"} />}
          </div>
          <div className="mt-5 border-t border-arena-border pt-4">
            <p className="meta font-semibold">Deskripsi</p>
            <p className="mt-1 text-sm text-arena-muted">{form.description || "Belum ada deskripsi."}</p>
          </div>
          <div className="mt-4 border-t border-arena-border pt-4">
            <p className="meta font-semibold">Peraturan</p>
            <p className="mt-1 whitespace-pre-line text-sm text-arena-muted">{form.rules || "Belum ada peraturan."}</p>
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <button
            onClick={() => setPreview(false)}
            className="rounded-md border border-arena-border px-5 py-3 font-semibold text-arena-muted hover:text-arena-text"
          >
            Edit Kembali
          </button>
          <button
            onClick={handlePublish}
            disabled={menyimpan}
            className="flex-1 rounded-md bg-arena-purple px-5 py-3 font-semibold text-white transition-all duration-300 hover:scale-105 hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {menyimpan ? "Menyimpan..." : "Publish Tournament"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="h1 mb-2">Buat Turnamen</h1>
      <p className="meta mb-6 text-arena-muted">Isi detail turnamen, lalu preview sebelum publish.</p>

      <form
        onSubmit={(e) => { e.preventDefault(); setPreview(true); }}
        className="flex flex-col gap-4 rounded-lg border border-arena-border bg-arena-card p-6"
      >
        <Field label="Nama Turnamen" value={form.name} onChange={set("name")} placeholder="Contoh: Banyuwangi MLBB Cup" />

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="flex flex-col gap-2">
            <span className="meta font-semibold">Game</span>
            <select value={form.game} onChange={set("game")} className="rounded-md border border-arena-border bg-arena-bg px-3 py-2.5 text-sm outline-none focus:border-arena-cyan">
              {games.map((g) => (
                <option key={g.id} value={g.id}>{g.name}</option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-2">
            <span className="meta font-semibold">Mode</span>
            <select value={form.mode} onChange={set("mode")} className="rounded-md border border-arena-border bg-arena-bg px-3 py-2.5 text-sm outline-none focus:border-arena-cyan">
              <option value="online">Online</option>
              <option value="offline">Offline</option>
            </select>
          </label>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Tanggal" type="date" value={form.date} onChange={set("date")} />
          <Field label="Waktu" type="time" value={form.time} onChange={set("time")} />
        </div>

        {form.mode === "offline" && (
          <Field label="Lokasi / Venue" value={form.location} onChange={set("location")} placeholder="Nama venue & alamat" />
        )}

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Biaya Pendaftaran (Rp)" type="number" value={form.fee} onChange={set("fee")} />
          <Field label="Jumlah Slot" type="number" value={form.slots} onChange={set("slots")} />
        </div>

        <label className="flex flex-col gap-2">
          <span className="meta font-semibold">Deskripsi</span>
          <textarea
            value={form.description}
            onChange={set("description")}
            rows={3}
            placeholder="Deskripsi singkat turnamen"
            className="w-full rounded-md border border-arena-border bg-arena-bg px-3 py-2.5 text-sm outline-none focus:border-arena-cyan placeholder:text-arena-muted"
          />
        </label>

        <label className="flex flex-col gap-2">
          <span className="meta font-semibold">Peraturan</span>
          <textarea
            value={form.rules}
            onChange={set("rules")}
            rows={4}
            placeholder="Satu peraturan per baris"
            className="w-full rounded-md border border-arena-border bg-arena-bg px-3 py-2.5 text-sm outline-none focus:border-arena-cyan placeholder:text-arena-muted"
          />
        </label>

        <button
          type="submit"
          className="mt-2 flex items-center justify-center gap-2 rounded-md border border-arena-cyan bg-arena-cyan/10 px-4 py-3 font-semibold text-arena-cyan transition hover:bg-arena-cyan/20"
        >
          <Eye className="h-4 w-4" /> Preview
        </button>
      </form>
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

function PreviewRow({ label, value }) {
  return (
    <div className="flex items-center justify-between border-b border-arena-border py-2">
      <span className="meta text-arena-muted">{label}</span>
      <span className="meta font-semibold">{value}</span>
    </div>
  );
}