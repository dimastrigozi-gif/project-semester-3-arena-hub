# README_2 — Alur Kerja, Respon Visual & Bikin Halaman Manual (Tanpa Base44)

Yo! Ini lanjutan dari `README_1.md`. Kalau README_1 ngajarin kamu nyalain mesinnya, README_2 ini bakal bongkar kap mesinnya biar kamu paham **kenapa** dan **gimana** semuanya jalan. Santai, kita bahas kayak nongkrong di warkop. Kopi dulu, baru ngoding. ☕

Kita bakal bahas 3 gede:

1. **Alur kerja** — dari folder kosong sampai website nongol di browser, plus beda `npm run dev` vs `npm run build`.
2. **Respon visual** — gimana data JSON dari Laravel bisa jadi kartu turnamen keren di React.
3. **Cara manual** — bikin Home, Tentang, Cari Turnamen MURNI pakai tangan sendiri (tanpa Base44).

---

## BAGIAN 1 — ALUR KERJA (Workflow)

### 1.1 Cerita dari Nol: Folder Kosong → Website Jalan

Bayangin kamu baru dapet laptop baru, folder masih kosong, jiwa masih suci. Ini urutan "ritual" yang kamu lakuin, step by step, plus alasan di balik tiap langkah.

**Langkah 1 — Tarik Laravel-nya dulu**

```bash
composer create-project laravel/laravel arenahub-backend
cd arenahub-backend
```

Kenapa `composer`? Karena Laravel itu kumpulan package PHP. Composer itu urusan "belanja bahan" — dia download Laravel + semua library PHP yang dibutuhin ke folder `vendor/`. Ibarat mau masak, ini belanja bahan ke pasar dulu.

**Langkah 2 — Setting "KTP" aplikasi (`.env`)**

```bash
cp .env.example .env
php artisan key:generate
```

`.env` itu file rahasia yang nyimpen "identitas" aplikasi: nama app, koneksi database, sampe password. File ini **nggak** ikut di-commit ke Git (karena rahasia!). Jadi tiap orang yang clone repo harus bikin `.env` sendiri dari contohnya (`.env.example`).

`php artisan key:generate` ngisi `APP_KEY` — kunci enkripsi buat session, cookie, dll. Tanpa ini Laravel bakal nangis minta key.

**Langkah 3 — Siapin database**

```bash
# MySQL: bikin database + user (lihat README_1 bagian 5)
# atau SQLite: cukup touch database/database.sqlite
php artisan migrate --seed
```

`migrate` itu nyetak tabel-tabel ke database sesuai "cetakan" di `database/migrations`. `--seed` sekalian ngisi data contoh (turnamen dummy) biar Home nggak kosong pas pertama dibuka. Analoginya: migrate = bangun rak, seed = taruh barang contoh di rak biar kelihatan isi.

**Langkah 4 — Belanja bahan frontend**

```bash
npm install
```

`npm` itu "composer"-nya dunia JavaScript. Dia download React, Vite, Tailwind, Axios, dst. ke folder `node_modules/`. Ini yang bikin React bisa jalan.

**Langkah 5 — Nyalain dua "dapur"**

Di sini bagian yang sering bikin bingung pemula: **ArenaHub itu dua aplikasi yang jalan bareng** dalam satu proyek.

- **Laravel** = dapur belakang (backend), nyiapin data & API.
- **React** = etalase depan (frontend), nampilin UI ke user.

Karena itu kamu butuh **dua server** saat ngoding:

```bash
# Terminal 1 — server backend Laravel
php artisan serve
# jalan di http://127.0.0.1:8000

# Terminal 2 — server frontend Vite (hot reload)
npm run dev
```

Sekarang buka `http://127.0.0.1:8000` di browser. Keliatan? Mantap.

### 1.2 Kenapa Harus Dua Server? (Konsep Penting)

Coba lihat `resources/views/app.blade.php`. Di dalamnya ada:

```blade
@viteReactRefresh
@vite('resources/js/main.jsx')
```

Dua baris ajaib itulah yang "nyambungin" Laravel ke React.

- Saat **mode dev** (`npm run dev`), `@vite` nyuntik script yang nunjuk ke server Vite (biasanya port 5173). Jadi Laravel cuma ngasih "kerangka HTML kosong" (`<div id="root"></div>`), terus Vite yang ngisi React ke situ.
- Saat **mode build** (`npm run build`), `@vite` nyuntuk file JS/CSS hasil build ke folder `public/build`.

React-nya nempel di `<div id="root"></div>` (lihat `resources/js/main.jsx`):

```jsx
ReactDOM.createRoot(document.getElementById("root")).render(<App />);
```

Jadi Laravel nyerahin "panggung kosong", React naik ke panggung dan nari. Paham sampai sini? Keren.

### 1.3 `npm run dev` vs `npm run build` — Beda & Kapan Pakai

Ini pertanyaan paling sering muncul. Kita bedah pakai analogi.

#### Analogi: Masak di Rumah vs Katering

**`npm run dev` = masak langsung di dapur, request per porsi (à la carte)**

Kamu ngoding JSX, save file, browser langsung update **dalam hitungan milidetik** tanpa reload. Namanya *Hot Module Replacement (HMR)*. Cocok banget buat fase "ngoding & eksperimen" — ubah warna, ubah teks, langsung kelihatan. Ribet? Nggak, tinggal save.

Kelebihan:
- Ngebut banget pas ngoding.
- Perubahan langsung kelihatan tanpa refresh.
- Ada error message jelas di browser.

Kekurangan:
- Butuh server Vite hidup terus.
- File yang dibaca itu versi "mentah + dipecah-pecah", bukan optimasi produksi.
- **Bahaya:** kalau kamu `git push` atau kasih project ke orang lain tanpa build, orang itu buka tanpa `npm run dev` → halaman bisa blank/nggak ke-load.

**`npm run build` = masak sekotak-nya, pesen buat pesta (catering siap saji)**

Kamu jalanin `npm run build` (yang di `package.json` = `vite build`). Vite ngambil semua JSX, nge-bundle, nge-minify (perkecil), nge-hash nama file, dan naruh hasilnya di `public/build/`. Hasilnya: file statis yang **nggak butuh server Vite** dan **jauh lebih ringan**.

Kelebihan:
- Bisa jalan tanpa `npm run dev` — cukup `php artisan serve`.
- Loading lebih cepat buat user.
- Siap dipakai buat rilis/presentasi/upload ke hosting.

Kekurangan:
- Nggak hot reload. Tiap ubah kode harus build ulang.
- Build makan waktu (beberapa detik lebih lama dari save di dev).

#### Tabel Cepat

| Aspek | `npm run dev` | `npm run build` |
| --- | --- | --- |
| Tujuan | Ngoding sehari-hari | Rilis / demo / produksi |
| Hot reload | ✅ Yes | ❌ No |
| Butuh server Vite | ✅ Wajib hidup | ❌ Nggak perlu |
| Output | Disajikan Vite (port 5173) | File statis di `public/build` |
| Kecepatan load user | Standar | Optimal (minified) |
| Kapan dipakai | Fase develop & eksperimen | Sebelum presentasi / push / deploy |

#### Aturan Praktis (Hafalin ini)

- Lagi **ngoding & utak-atik tampilan** → `npm run dev`.
- Mau **presentasi, demo di depan dosen, push ke Git, atau deploy** → `npm run build` **dulu**, baru `php artisan serve`.
- **Sebelum push ke GitHub** selalu `npm run build` biar orang lain bisa langsung buka tanpa `npm run dev`. (Kecuali kamu sengaja mau mereka ngoding.)

Flow lengkap buat presentasi:

```bash
# 1. pastikan backend siap
php artisan migrate --seed

# 2. build aset produksi
npm run build

# 3. nyalain server (cukup satu terminal!)
php artisan serve
# buka http://127.0.0.1:8000
```

Gampangnya: **dev buat masak, build buat ngantar pesanan.**

---

## BAGIAN 2 — RESPON VISUAL (Apa yang Muncul di Layar)

Pertanyaan besarnya: *"Kok data JSON dari Laravel bisa berubah jadi kartu-kartu turnamen keren di React?"*

Jawaban singkat: ada "kurir" bernama **Axios** yang minta data, Laravel ngasih JSON, React nyetak jadi UI. Mari kita ikutin perjalanan data itu detik demi detik. Anggap kita buka halaman **Home**.

### 2.1 Peta Perjalanan Data (Gambaran Besar)

```
[User buka Home]
      │
      ▼
[Home.jsx jalan]  ──useEffect──►  [ambilTurnamen() dipanggil]
      │
      ▼
[Axios: api.get("/tournaments")]
      │  request HTTP GET
      ▼
[Laravel routes/api.php → TournamentApiController@index]
      │  query database
      ▼
[MySQL/SQLite] ── data turnamen ──► [Controller]
      │  response()->json(...)
      ▼
[JSON balik ke React] ──► [setTurnamen(...)] ──► [React re-render]
      │
      ▼
[Kartu turnamen muncul di layar] 🎉
```

Sekarang kita zoom tiap tahap pakai kode asli proyek ini.

### 2.2 STEP 1 — React Minta Data (Axios)

Lihat `resources/js/utils/api.js`. Ini "kurir" kita:

```js
import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  headers: { Accept: "application/json" },
});

export default api;
```

Penjelasan:
- `baseURL: "/api"` → semua request otomatis dikasih prefix `/api`. Jadi `api.get("/tournaments")` = request ke `/api/tournaments`.
- Kenapa pakai path relatif `/api`, bukan `http://localhost:8000/api`? Biar nggak kena masalah CORS dan otomatis nyambung ke server yang lagi nge-host (dev maupun produksi). Praktis.
- Header `Accept: application/json` → bilang ke Laravel: "eh, kasih gue JSON ya, bukan HTML".

### 2.3 STEP 2 — Home.jsx Nyiapin "Wadah" (useState)

Buka `resources/js/pages/Home.jsx`. Di atas, React nyiapin 3 wadah:

```jsx
const [turnamen, setTurnamen] = useState([]);   // data turnamen
const [loading, setLoading] = useState(true);   // lagi loading?
const [error, setError] = useState("");         // ada error?
```

Analoginya: `useState` itu kotak kosong berlabel.
- `turnamen` = kotak isinya list turnamen (awalnya `[]` = kosong).
- `loading` = lampu indikator "lagi ambil data" (awalnya `true`).
- `error` = kotak pesan kalau ada masalah (awalnya `""`).

Pasangan `[nilai, setNilai]` itu cara React ngubah isi kotak. **Setiap kali `setNilai` dipanggil, React otomatis nge-render ulang tampilan.** Ini inti dari "reaktif"-nya React.

### 2.4 STEP 3 — useEffect: "Jalanin Ini Sekali Saat Halaman Dibuka"

```jsx
useEffect(() => {
  ambilTurnamen();
}, []);
```

`useEffect` = alarm yang bunyi di momen tertentu. Array kosong `[]` di akhir artinya: **"jalanin sekali aja, pas komponen pertama kali muncul"**. Jadi pas Home dibuka, langsung panggil `ambilTurnamen()`. Kalau `[]`-nya ada isinya (misal `[q]`), dia jalan ulang tiap `q` berubah.

### 2.5 STEP 4 — Fungsi ambilTurnamen: Request + Simpan

```jsx
const ambilTurnamen = async () => {
  setLoading(true);
  setError("");

  try {
    const response = await api.get("/tournaments");
    const data = response.data.data || [];
    setTurnamen(data.map(rapikanTurnamen));
  } catch (err) {
    setError("Gagal mengambil data turnamen...");
  } finally {
    setLoading(false);
  }
};
```

Baca pelan-pelan:
1. `setLoading(true)` → nyalain lampu loading (spinner muncul).
2. `await api.get("/tournaments")` → **kurir berangkat** kirim GET ke `http://127.0.0.1:8000/api/tournaments`. `await` artinya "tunggu kurir balik bawa paket".
3. `response.data.data` → paket dari Laravel bentuknya `{ message, data }`, jadi ambil `data`-nya.
4. `data.map(rapikanTurnamen)` → tiap item dirapikan (lebih lanjut di bawah).
5. `setTurnamen(...)` → taruh hasil ke kotak → React render ulang → kartu muncul.
6. `catch` → kalau gagal (misal Laravel mati), isi `error`.
7. `finally` → apapun hasilnya, matiin loading.

### 2.6 STEP 5 — Laravel Nerima Request (Routing)

Request `/api/tournaments` masuk ke `routes/api.php`:

```php
Route::get('/tournaments', [TournamentApiController::class, 'index']);
```

Artinya: "kalau ada GET ke `/tournaments`, lempar ke method `index` di `TournamentApiController`". Ini kayak resepsionis hotel yang ngarahin tamu ke kamar yang bener.

### 2.7 STEP 6 — Controller Ambil Data & Bikin JSON

Buka `app/Modules/Tournaments/Http/Controllers/TournamentApiController.php`:

```php
public function index()
{
    // Urutkan dari tanggal paling dekat
    $dataTurnamen = Tournament::orderBy('start_date', 'asc')->get();

    return response()->json([
        'message' => 'Daftar turnamen berhasil diambil',
        'data' => $dataTurnamen,
    ]);
}
```

Bedah:
- `Tournament::orderBy('start_date', 'asc')` → model ngomong ke database: "kasih semua turnamen, urut dari tanggal terdekat". Ini yang nge-*query* tabel.
- `->get()` → eksekusi, dapat kumpulan data.
- `response()->json([...])` → bungkus jadi JSON, kirim balik ke React dengan status 200 (OK).

Hasil JSON-nya kira-kira begini:

```json
{
  "message": "Daftar turnamen berhasil diambil",
  "data": [
    {
      "id": 1,
      "title": "MLBB Season Cup",
      "game": "mlbb",
      "mode": "online",
      "start_date": "2026-09-18",
      "price": 50000,
      "quota": 32,
      "participants": 12,
      "status": "upcoming"
    }
  ]
}
```

Nah, perhatikan: **nama field dari Laravel (`title`, `start_date`, `price`, `quota`) beda sama yang dipakai komponen React (`name`, `date`, `fee`, `slots`)**. Makanya ada "penerjemah" → `rapikanTurnamen`. 👇

### 2.8 STEP 7 — rapikanTurnamen: Penerjemah Field

Buka `resources/js/utils/turnamen.js`:

```js
export const rapikanTurnamen = (item) => {
  const tanggal = String(item.start_date || "").slice(0, 10);

  return {
    id: item.id,
    name: item.title || item.name || "Turnamen Tanpa Nama",
    game: item.game,
    mode: item.mode || "online",
    date: tanggal,
    time: item.time || "19:00",
    fee: Number(item.price ?? item.fee ?? 0),
    slots: Number(item.quota ?? item.slots ?? 0),
    participants: Number(item.participants ?? 0),
    status: item.status || "upcoming",
    // ...dst
  };
};
```

Kenapa perlu ini? Karena backend dan frontend "bahasa"-nya beda. Backend bilang `title`, frontend maunya `name`. Fungsi ini nyamain bentuk data biar komponen tinggal pakai tanpa pusing. Ibarat nerjemahin menu berbahasa Inggris ke bahasa Indonesia buat pelanggan lokal.

`slice(0, 10)` ngambil `2026-09-18` dari timestamp panjang (buang bagian jam). `??` = nullish coalescing, artinya "pakai nilai kiri kalau ada, kalau null/undefined pakai kanan".

### 2.9 STEP 8 — React Nge-render Kartu

Setelah `setTurnamen`, `Home.jsx` nge-loop datanya:

```jsx
<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
  {upcoming.map((t) => (
    <TournamentCard key={t.id} tournament={t} to={`/turnamen/${t.id}`} />
  ))}
</div>
```

- `.map(...)` → ubah tiap item jadi satu `<TournamentCard />`.
- `key={t.id}` → tanda pengenal unik tiap kartu. **Wajib** ada biar React efisien nge-update, bukan nge-render ulang semua dari nol. Anggap key itu nomor kursi.
- Grid Tailwind `sm:grid-cols-2 lg:grid-cols-3` → 1 kolom di HP, 2 di tablet, 3 di desktop. Responsif otomatis.

Dan `TournamentCard` (`resources/js/components/TournamentCard.jsx`) yang nyetak visualnya:

```jsx
<h3 className="line-clamp-2 font-heading text-base font-bold leading-snug text-arena-text">
  {tournament.name}
</h3>
```

`{tournament.name}` → kurung kurawal `{}` itu cara React nyisipin nilai JavaScript ke dalam tampilan. Jadi `tournament.name` (yang tadinya `title` dari Laravel tadi) sekarang muncul jadi judul kartu. **Selesai — JSON udah resmi jadi kartu keren.** 🎉

### 2.10 Alur Singkat (Hafalin buat Presentasi)

1. User buka Home.
2. `useEffect` → `ambilTurnamen()`.
3. Axios `GET /api/tournaments`.
4. `routes/api.php` → `TournamentApiController@index`.
5. Controller query DB → `response()->json(...)`.
6. JSON balik ke React → `response.data.data`.
7. `rapikanTurnamen` samain field.
8. `setTurnamen(...)` → React re-render.
9. `TournamentCard` muncul. ✅

Itu jawaban lengkap "kenapa data bisa jadi tampilan". Keren kan, ternyata sederhana.

---

## BAGIAN 3 — CARA MANUAL (Bikin Halaman dari Nol, Tanpa Base44)

Oke, sekarang bagian yang bikin tangan gatel: bikin halaman **MURNI pakai ketikan sendiri**, tanpa Base44. Kita bikin tiga contoh: **Tentang**, **Home**, dan **Cari Turnamen**. Mulai dari yang paling gampang biar otot jari pemanasan.

> Catatan konsep: file `.jsx` itu "resep" yang nyampur JavaScript + HTML. Yang mirip HTML itu namanya **JSX**. Aturan beda dikit: `class` jadi `className`, dan tiap tag harus ditutup (`<img />`, bukan `<img>`).

### 3.1 Fondasi: Kenapa Halaman Bisa Muncul & Bisa Dipindah-pindah

Sebelum nyoret halaman, pahami dua hal:

**a) Routing** — daftar alamat halaman ada di `resources/js/App.jsx`:

```jsx
<Route path="/" element={<Home />} />
<Route path="/tentang" element={<Tentang />} />
<Route path="/cari-turnamen" element={<CariTurnamen />} />
```

Jadi `/tentang` bakal nampilin komponen `Tentang`. Mau nambah halaman? Tinggal tambah baris `<Route>` + import komponennya. Simpel.

**b) Styling pakai Tailwind** — proyek udah punya "palet warna" ArenaHub di `tailwind.config.js`:

```js
colors: {
  arena: {
    bg: '#0B0F17', card: '#151B26', border: '#232D3F',
    cyan: '#00F0FF', purple: '#7000FF', text: '#F0F4F8',
    muted: '#8A99AD', success: '#00E676', danger: '#FF5252',
  },
}
```

Artinya kamu bisa langsung pakai class kayak `bg-arena-bg`, `text-arena-cyan`, `border-arena-border` tanpa nulis hex warna. Nyaman.

### 3.2 Contoh 1 — Halaman "Tentang" (Halaman Statis, Tanpa State)

Halaman ini nggak butuh data dinamis, cuma teks + kartu fitur. Cocok buat pemula.

**File: `resources/js/pages/Tentang.jsx`**

```jsx
import React from "react";
import { Trophy, Target, Users, CalendarDays } from "lucide-react";

export default function Tentang() {
  // Data fitur disimpan sebagai array biar rapi & gampang nambah
  const fitur = [
    { icon: Trophy, title: "Cari & Daftar", desc: "Temukan turnamen dari berbagai game populer dan daftar dalam beberapa langkah." },
    { icon: CalendarDays, title: "Pantau Jadwal", desc: "Lihat jadwal pertandingan dan status progres kamu secara real-time." },
    { icon: Users, title: "Tim atau Individu", desc: "Daftar sebagai individu atau tim, sesuai format turnamen." },
    { icon: Target, title: "Untuk Organizer", desc: "Buat, publish, dan kelola turnamen dengan mudah." },
  ];

  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="h1 mb-3">Tentang ArenaHub</h1>
      <p className="text-arena-muted">
        ArenaHub adalah platform yang mempertemukan peserta dan organizer turnamen
        esport dalam satu tempat.
      </p>

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        {fitur.map((f) => (
          <div
            key={f.title}
            className="rounded-lg border border-arena-border bg-arena-card p-5"
          >
            <f.icon className="mb-3 h-6 w-6 text-arena-cyan" />
            <h3 className="font-heading text-base font-bold">{f.title}</h3>
            <p className="meta mt-1 text-arena-muted">{f.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
```

Bedah "kenapa & gimana":

- **`export default function Tentang()`** → komponen React itu cuma fungsi yang balikin JSX. Nama fungsi = nama komponen.
- **Array `fitur`** → daripada nulis 4 kartu manual (copy-paste), kita simpan data di array lalu `.map()`. Kalau mau nambah fitur, tinggal tambah 1 baris object, nggak sentuh JSX.
- **`{fitur.map((f) => (...))}`** → loop: tiap object jadi satu kartu. `key={f.title}` wajib biar React efisien.
- **`<f.icon />`** → lucide-react nyimpen ikon sebagai komponen. Jadi bisa dipanggil kayak tag. Ikonnya ikut dari object `icon: Trophy`.
- **Styling**: `max-w-3xl` (lebar maks), `px-4 py-16` (padding), `grid sm:grid-cols-2` (2 kolom di layar lebar), `rounded-lg border border-arena-border bg-arena-card` (kartu gelap dengan border), `text-arena-cyan` (ikon warna cyan). Semua Tailwind, tanpa nulis CSS satupun.
- **Tanpa `useState`** → karena halaman ini statis, nggak ada data yang berubah. Jangan pake state kalau nggak perlu. Keep it simple.

Daftarin di `App.jsx` (kalau belum ada):

```jsx
import Tentang from "@/pages/Tentang";
// ...
<Route path="/tentang" element={<Tentang />} />
```

Buka `/tentang`. Jadi. Itu halaman pertama hasil ketikan tanganmu sendiri. 💪

### 3.3 Contoh 2 — Halaman "Home" (Ambil Data + useState + loading/error)

Home itu "etalase" yang narik data dari Laravel. Ini contoh komplit `useState` + `useEffect` + Axios + render kartu. Sebagian besar kodenya udah ada di proyek; kita rangkum biar kebaca alurnya.

**File: `resources/js/pages/Home.jsx`** (versi ringkas yang bisa dipahami)

```jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Search } from "lucide-react";
import api from "@/utils/api";
import { rapikanTurnamen } from "@/utils/turnamen";
import TournamentCard from "@/components/TournamentCard";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function Home() {
  // 1. Siapin "kotak" state
  const [turnamen, setTurnamen] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // 2. Fungsi ambil data dari API Laravel
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

  // 3. Jalanin sekali saat halaman dibuka
  useEffect(() => {
    ambilTurnamen();
  }, []);

  // 4. Pisahin data berdasarkan status
  const ongoing = turnamen.filter((t) => t.status === "ongoing");
  const upcoming = turnamen.filter(
    (t) => t.status !== "ongoing" && t.status !== "completed"
  );

  // 5. Render
  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-arena-border">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:py-20 md:py-28">
          <h1 className="hero-title text-arena-text">
            Temukan Turnamenmu.
            <br />
            <span className="text-arena-cyan">Siap Bertanding?</span>
          </h1>
          <p className="mt-5 max-w-lg text-base text-arena-muted">
            Cari, daftar, dan pantau turnamen esport dalam satu platform.
          </p>
          <Link
            to="/cari-turnamen"
            className="mt-8 inline-flex items-center justify-center gap-2 rounded-md bg-arena-cyan px-6 py-3 font-semibold text-arena-bg transition-all duration-300 hover:scale-105 hover:brightness-110"
          >
            <Search className="h-5 w-5" /> Cari Turnamen
          </Link>
        </div>
      </section>

      {/* LOADING */}
      {loading && (
        <section className="mx-auto max-w-6xl px-4 pb-16">
          <LoadingSpinner />
        </section>
      )}

      {/* ERROR */}
      {!loading && error && (
        <section className="mx-auto max-w-6xl px-4 pb-16">
          <div className="rounded-lg border border-dashed border-arena-danger/40 bg-arena-card p-10 text-center">
            <p className="text-arena-danger">{error}</p>
            <button
              onClick={ambilTurnamen}
              className="mt-4 rounded-md bg-arena-cyan px-5 py-2.5 font-semibold text-arena-bg"
            >
              Coba Lagi
            </button>
          </div>
        </section>
      )}

      {/* DAFTAR TURNAMEN */}
      {!loading && !error && (
        <section className="mx-auto max-w-6xl px-4 pb-16">
          <h2 className="h2 mb-5">Turnamen Akan Datang</h2>
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
```

Poin "kenapa"-nya:

- **3 state** (`turnamen`, `loading`, `error`) = pola standar buat data dari API. Selalu siapin tiga ini: data, lagi loading, kalau error.
- **`useEffect` dengan `[]`** → "cuma jalan sekali pas mount". Jangan lupa dependency array, kalau nggak bisa infinite loop.
- **`if (loading) ...`, `if (error) ...`** → React nampilin UI beda sesuai state. Ini yang bikin aplikasi berasa "hidup" — ada spinner saat nunggu, ada tombol retry saat gagal.
- **`turnamen.filter(...)`** → nyaring array jadi `ongoing` & `upcoming` biar bisa ditampilin di section beda. `.filter` nggak ngubah asli, dia bikin array baru.

### 3.4 Contoh 3 — Halaman "Cari Turnamen" (useState untuk Filter + Pencarian)

Ini yang paling seru, karena pakai **beberapa state** buat filter: kata kunci, game, mode, dan status. Saat filter berubah, daftar langsung ikut nyaring (tanpa reload).

**File: `resources/js/pages/CariTurnamen.jsx`** (versi ringkas fokus konsep)

```jsx
import React, { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { games, rapikanTurnamen } from "@/utils/turnamen";
import api from "@/utils/api";
import TournamentCard from "@/components/TournamentCard";

export default function CariTurnamen() {
  // State data
  const [turnamen, setTurnamen] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // State filter (satu state per filter)
  const [q, setQ] = useState("");        // kata kunci
  const [game, setGame] = useState("all");
  const [mode, setMode] = useState("all");
  const [status, setStatus] = useState("all");

  const ambilTurnamen = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await api.get("/tournaments");
      const data = response.data.data || [];
      setTurnamen(data.map(rapikanTurnamen));
    } catch (err) {
      setError("Gagal mengambil data turnamen.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    ambilTurnamen();
  }, []);

  // useMemo: hitung hasil filter, hanya dihitung ulang kalau filter berubah
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

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="h1 mb-2">Cari Turnamen</h1>

      {/* INPUT PENCARIAN */}
      <div className="flex items-center gap-2 rounded-lg border border-arena-border bg-arena-card px-4 focus-within:border-arena-cyan">
        <Search className="h-5 w-5 text-arena-muted" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Cari turnamen atau game..."
          className="w-full bg-transparent py-3 text-sm outline-none placeholder:text-arena-muted"
        />
      </div>

      {/* FILTER GAME */}
      <div className="mt-4 flex flex-wrap gap-2">
        <Chip active={game === "all"} onClick={() => setGame("all")}>
          Semua Game
        </Chip>
        {games.map((g) => (
          <Chip key={g.id} active={game === g.id} onClick={() => setGame(g.id)}>
            {g.name}
          </Chip>
        ))}
      </div>

      {/* HASIL */}
      {loading && <p className="mt-8 text-arena-muted">Loading...</p>}
      {!loading && error && <p className="mt-8 text-arena-danger">{error}</p>}

      {!loading && !error && (
        <>
          <h2 className="h2 mt-8">{filtered.length} Turnamen Ditemukan</h2>
          {filtered.length === 0 ? (
            <p className="mt-6 text-arena-muted">Tidak ada yang cocok.</p>
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

// Komponen kecil buat tombol filter
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
```

Poin "kenapa & gimana" yang wajib paham:

- **Satu state per filter** (`q`, `game`, `mode`, `status`) → biar tiap filter independen. `setGame("mlbb")` cuma ngubah filter game, yang lain tetap.
- **`onChange={(e) => setQ(e.target.value)}`** → setiap ketikan di input, ambil nilai `e.target.value` dan simpan ke state `q`. Ini yang bikin input "terkontrol" (controlled input) — nilai di layar selalu sinkron sama state.
- **`value={q}`** → input selalu nampilin nilai state. Ini pasangan wajib dari `onChange`. Kalau cuma `onChange` tanpa `value`, input jadi liar.
- **`useMemo(...)`** → filter itu "kerjaan berat". `useMemo` nyimpen hasilnya dan cuma ngitung ulang kalau dependency (`turnamen, q, game, mode, status`) berubah. Ngirit performa. Kalau nggak berubah, hasil lama dipakai.
- **`t.name.toLowerCase().includes(q.toLowerCase())`** → pencarian case-insensitive. Input "MLBB" atau "mlbb" hasilnya sama. `toLowerCase` dulu baru bandingin.
- **`cn(...)`** → helper (dari `clsx` + `tailwind-merge`) buat gabung class secara kondisional. Kalau `active` true, pakai warna cyan; kalau nggak, abu-abu. Kode lebih bersih daripada nulis ternary panjang di `className`.
- **`children`** di `Chip` → isi di antara `<Chip>...</Chip>` masuk otomatis ke parameter `children`. Bikin komponen kecil bisa dipakai berulang.
- **`focus-within:border-arena-cyan`** → border nyala cyan saat input di dalamnya fokus. Detail kecil yang bikin UI berasa "mahal".
- **`bg-arena-cyan/10`** → opacity modifier Tailwind: cyan dengan 10% opacity. Cara cepat bikin efek "tint" tanpa nulis rgba manual.

### 3.5 Pola Wajib Bikin Halaman Manual (Checklist)

Tiap mau bikin halaman baru dari nol tanpa Base44, jalanin ritual ini:

1. **Bikin file** di `resources/js/pages/NamaHalaman.jsx`.
2. **Import** yang perlu: `React`, `useState`/`useEffect` (kalau butuh state), `Link`/`useSearchParams` (kalau butuh navigasi), `api` (kalau butuh data), ikon dari `lucide-react`.
3. **Definisikan state** pakai `useState` — data + loading + error minimal.
4. **Ambil data** pakai `useEffect` + `api.get(...)` kalau perlu backend.
5. **Tulis JSX** — struktur visual pakai `className` Tailwind (palet `arena-*` yang udah ada).
6. **Daftarin route** di `App.jsx`: import komponen + tambah `<Route path="/..." element={<NamaHalaman />} />`.
7. **Tes** dengan `npm run dev`, cek di browser, rapihin.
8. **Build** dengan `npm run build` sebelum presentasi/push.

---

## PENUTUP — TL;DR FASE 2

- **Alur kerja**: dua server barengan (`php artisan serve` buat Laravel, `npm run dev` buat React). `npm run dev` = masak buat ngoding (hot reload); `npm run build` = katering buat rilis/presentasi (file statis di `public/build`, nggak butuh Vite).
- **Respon visual**: Axios minta → `routes/api.php` → Controller query DB → `response()->json()` → React `setState` → `.map()` render `TournamentCard`. JSON → kartu keren.
- **Cara manual**: bikin file `.jsx`, pakai `useState` buat data/filter, `useEffect` buat fetch, `.map` buat render list, Tailwind `arena-*` buat styling, daftarin `<Route>` di `App.jsx`. Tanpa Base44 pun bisa.

Selamat ngoding. Kalau paham tiga bagian ini, kamu udah bisa bongkar-pasang ArenaHub sendiri pakai tangan. 🔥
