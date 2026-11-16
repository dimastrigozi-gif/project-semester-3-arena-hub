// Daftar game yang dipakai di form dan filter
export const games = [
  { id: "efootball", name: "eFootball", short: "eFootball" },
  { id: "mlbb", name: "Mobile Legends", short: "MLBB" },
  { id: "freefire", name: "Free Fire", short: "Free Fire" },
  { id: "pointblank", name: "Point Blank", short: "PB" },
];

export const gameById = (id) => {
  const game = games.find((g) => g.id === id);
  // Kalau game-nya belum ada di daftar, tampilkan id-nya aja
  return game || { id: id, name: id || "Game" };
};

// Tahapan turnamen (masih statis, nanti bisa dari database)
export const stages = [
  { key: "penyisihan", label: "Penyisihan", date: "18 September", time: "19:00" },
  { key: "r16", label: "Round of 16", date: "19 September", time: "19:00" },
  { key: "qf", label: "Quarter Final", date: "20 September", time: "19:00" },
  { key: "sf", label: "Semi Final", date: "21 September", time: "19:00" },
  { key: "final", label: "Final", date: "22 September", time: "19:00" },
];

export const progressSteps = [
  { key: "pendaftaran", label: "Pendaftaran" },
  { key: "verifikasi", label: "Verifikasi" },
  { key: "checkin", label: "Check-in" },
  { key: "match", label: "Pertandingan" },
  { key: "hasil", label: "Hasil" },
];

// Format harga jadi Rupiah
export const formatRupiah = (angka) => {
  return "Rp " + Number(angka || 0).toLocaleString("id-ID");
};

// Format tanggal dari Laravel (2026-09-18) jadi lebih enak dibaca
export const formatTanggal = (tanggal) => {
  if (!tanggal) return "-";
  const tanggalSaja = String(tanggal).slice(0, 10);
  const date = new Date(tanggalSaja);
  if (isNaN(date.getTime())) return tanggalSaja;

  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

export const statusLabel = (status) => {
  switch (status) {
    case "upcoming":
      return "Akan Datang";
    case "ongoing":
      return "Sedang Berlangsung";
    case "completed":
      return "Selesai";
    case "draft":
      return "Draft";
    case "published":
      return "Published";
    case "registration_open":
      return "Pendaftaran Dibuka";
    default:
      return status;
  }
};

// Samakan nama field dari Laravel dengan yang dipakai komponen React
export const rapikanTurnamen = (item) => {
  const tanggal = String(item.start_date || "").slice(0, 10);

  return {
    id: item.id,
    name: item.title || item.name || "Turnamen Tanpa Nama",
    game: item.game,
    mode: item.mode || "online",
    date: tanggal,
    time: item.time || "19:00",
    location: item.location || null,
    venue: item.venue || item.location || "-",
    address: item.address || "-",
    checkin: item.checkin || "-",
    fee: Number(item.price ?? item.fee ?? 0),
    slots: Number(item.quota ?? item.slots ?? 0),
    participants: Number(item.participants ?? 0),
    status: item.status || "upcoming",
    registrationOpen: item.registration_open ?? true,
    organizer: item.organizer || "ArenaHub",
    type: item.type || "team",
    teamSize: item.team_size || 5,
    description:
      item.description ||
      "Turnamen seru dari ArenaHub. Kumpulkan tim terbaikmu dan rebut hadiahnya!",
    rules:
      item.rules || [
        "Daftar sesuai jadwal yang sudah ditentukan.",
        "Dilarang menggunakan cheat atau bantuan pihak ketiga.",
        "Keputusan panitia tidak bisa diganggu gugat.",
      ],
  };
};
