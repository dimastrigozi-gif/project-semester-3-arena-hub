# README_5 — Lifecycle ArenaHub: Kenapa Website Ini Bisa Jalan dari Database Sampai ke Layar

Ini file "bedah total". Kalau README 1–4 ngajarin *cara pakai*, README_5 ini ngajarin *cara kerja di balik layar*. Tujuannya: kamu bisa jawab **"kenapa folder ini ada?"**, **"kenapa file ini penting?"**, dan **"gimana ceritanya data dari database bisa nongol jadi kartu di layar?"** — lengkap dengan **nama file + nomor baris persis**.

Anggap kamu lagi ngobrol sama temen yang baru pertama kali ngoding, terus kamu jelasin sambil nunjuk-nunjuk VS Code. Santai, tapi detail. Siapin kopi. ☕

> **Aturan main baca README ini:** nomor baris bisa **bergeser** kalau file diedit di atasnya. Kalau mau jago, hafalin **teks kodenya** (misal `protected $table = 'tournaments';`), lalu pakai `Ctrl + F` di VS Code. Nomor baris itu buat nunjuk, teks itu buat memastikan.

---

## GAMBARAN BESAR: Satu Request, Dua Dunia

Website ArenaHub itu **dua aplikasi** yang saling ngobrol:

```
┌─────────────────────────┐        HTTP/JSON        ┌─────────────────────────┐
│   DUNIA FRONTEND        │  ────── request ───────► │   DUNIA BACKEND         │
│   React + Vite          │                         │   Laravel + PHP         │
│   (resources/js)        │  ◄───── JSON ────────── │   (app, routes, DB)     │
└─────────────────────────┘                         └─────────────────────────┘
            │                                                    │
            ▼                                                    ▼
      Tampil di layar                                    Database MySQL
      (kartu turnamen)                                   (tabel tournaments)
```

Pertanyaan inti README ini: **gimana data ngalir dari kiri ke kanan, lalu balik lagi jadi tampilan?** Jawabannya ada di jalur tracing di bawah. 👇

---

## BAGIAN 1 — JALUR TRACING KODE (Dari Database ke Layar)

Kita ikutin satu data turnamen, dari dia "lahir" di database sampe muncul jadi kartu di halaman Home. Ini urutannya **persis**, file dan baris disebutkan.

### Langkah 0 — Fondasi: Tabel Dibuat Dulu (Migration)

Sebelum ada data, harus ada **tabel**. Tabel dicetak oleh file migration.

**File:** `database/migrations/2026_11_13_000001_create_tournaments_table.php`

- **Baris 12** → `Schema::create('tournaments', function (Blueprint $table) {` — ini yang **bikin tabel** bernama `tournaments`.
- **Baris 14** → `$table->string('title');` — kolom **title** (nama turnamen).
- **Baris 15** → `$table->string('game');` — kolom **game**.
- **Baris 16** → `$table->integer('quota');` — kolom **quota** (kuota peserta).
- **Baris 17** → `$table->integer('price');` — kolom **price** (harga).
- **Baris 18** → `$table->date('start_date');` — kolom **start_date** (tanggal mulai).
- **Baris 19** → `$table->timestamps();` — otomatis bikin kolom `created_at` & `updated_at`.

Tabel baru beneran nyampe ke MySQL waktu kamu ngetik:

```bash
php artisan migrate
```

**Analogi:** migration itu **cetakan kue**. Database itu **loyang**. `php artisan migrate` = nyetak cetakan ke loyang, jadi tabelnya beneran ada.

### Langkah 1 — Isi Data Awal (Seeder)

Tabel kosong itu boring. Biar Home ada isinya, kita isi pakai seeder.

**File:** `database/seeders/TournamentSeeder.php`

- **Baris 11** → `public function run(): void {` — fungsi yang jalan saat seeding.
- **Baris 13–19** → `Tournament::create([...])` — bikin turnamen pertama:

  ```php
  Tournament::create([
      'title' => 'Poliwangi Mobile Legends Championship',  // baris 14
      'game' => 'mlbb',                                    // baris 15
      'quota' => 32,                                       // baris 16
      'price' => 50000,                                    // baris 17
      'start_date' => '2026-09-18',                        // baris 18
  ]);
  ```

  Total ada 4 turnamen (baris 13–43). Dijalanin lewat:

  ```bash
  php artisan migrate --seed
  ```

**Analogi:** seeder itu **pengisi rak contoh**. Biar toko (tabel) nggak kelihatan kosong pas dibuka.

### Langkah 2 — Model: "Wakil" Tabel di Kode PHP

Sekarang tabel udah ada & terisi. Gimana kode PHP ngobrol sama tabel itu? Lewat **Model**.

**File:** `app/Modules/Tournaments/Models/Tournament.php`

- **Baris 7** → `class Tournament extends Model` — ini model, turunan `Model` Laravel. Artinya dia otomatis punya "kemampuan" ngobrol sama database (query, insert, dll).
- **Baris 10** → `protected $table = 'tournaments';` — **INI yang nentuin** model ini nyambung ke tabel `tournaments`. Kalau baris ini nggak ada, Laravel nebak dari nama class (jadi `tournaments` juga sih, tapi eksplisit lebih aman).
- **Baris 13–19** → `protected $fillable = [...]` — daftar kolom yang **boleh diisi massal** dari form/seeder: `title`, `game`, `quota`, `price`, `start_date`. Ini benteng keamanan (mass assignment protection).
- **Baris 22–26** → `protected $casts = [...]` — nentuin tipe data biar rapi waktu dikirim ke React: `quota` & `price` jadi integer, `start_date` jadi format tanggal `Y-m-d`.

> **Soal "relasi":** di file ini **belum ada method relasi** (misal `teams()`). Jadi turnamen & tim saat ini belum dihubungkan secara eksplisit di model. Kalau nanti mau relasi (misal 1 turnamen punya banyak tim), tambahin method kayak gini di dalam class:
>
> ```php
> public function teams()
> {
>     return $this->hasMany(Team::class);   // konsepnya, butuh kolom tournament_id di tabel teams
> }
> ```
>
> Tapi **jujur ke dosen**: di versi sekarang tabel `teams` masih berdiri sendiri (cuma `id`, `name`), belum ada foreign key. Jadi relasinya belum diimplementasi.

**Analogi model:** kalau tabel itu **buku besar** di gudang, model itu **petugas** yang ngerti cara buka halaman buku itu. Kamu tinggal bilang "kasih semua turnamen", si petugas (model) yang ngambil dari buku (tabel).

### Langkah 3 — Route: Resepsionis yang Ngarahin Request

Sekarang bagian yang nyambungin **URL** ke **kode**.

**File:** `routes/api.php`

- **Baris 7** → `Route::get('/tournaments', [TournamentApiController::class, 'index']);`

  Artinya: "kalau ada **GET** ke `/tournaments`, panggil method **`index`** di `TournamentApiController`".

Kenapa `/tournaments` doang, bukan `/api/tournaments`? Karena Laravel otomatis nambahin prefix `/api` buat semua route di file ini. Itu diatur di:

**File:** `bootstrap/app.php`
- **Baris 9–14** → `->withRouting(web: ..., api: __DIR__.'/../routes/api.php', ...)`
- **Baris 11** khususnya → `api: __DIR__.'/../routes/api.php',` — ini yang **mendaftarkan** `routes/api.php` sebagai route API (otomatis di-prefix `/api`).

Jadi request nyata dari browser = **`GET /api/tournaments`**.

**Analogi route:** resepsionis hotel. Tamu (request) bilang "saya mau kamar 201" (URL), resepsionis ngasih kunci ke petugas kamar yang tepat (controller).

### Langkah 4 — Controller: Koki yang Ambil Data & Bikin JSON

**File:** `app/Modules/Tournaments/Http/Controllers/TournamentApiController.php`

- **Baris 12–21** → method `index()` — ini **penangan request GET** `/api/tournaments`.

  Bedah dalamnya:
  - **Baris 15** → `$dataTurnamen = Tournament::orderBy('start_date', 'asc')->get();`

    Ini **query ke database**: "ambil semua turnamen, urutkan dari tanggal mulai paling dekat". `Tournament` = model (petugas tadi). `->get()` = eksekusi, ambil semua baris.

  - **Baris 17–20** → `return response()->json([...])` — bungkus hasil jadi **JSON** dan kirim balik:

    ```php
    return response()->json([
        'message' => 'Daftar turnamen berhasil diambil',
        'data' => $dataTurnamen,
    ]);
    ```

**Analogi controller:** koki. Nerima pesanan (request), masak pakai bahan dari gudang (query DB lewat model), lalu nyajiin di piring (response JSON).

Contoh JSON yang keluar:

```json
{
  "message": "Daftar turnamen berhasil diambil",
  "data": [
    { "id": 1, "title": "Poliwangi Mobile Legends Championship", "game": "mlbb", "quota": 32, "price": 50000, "start_date": "2026-09-18" }
  ]
}
```

### Langkah 5 — Axios: Kurir dari React ke Laravel

Sekarang pindah ke **dunia frontend**. React butuh "kurir" buat minta data. Kurirnya **Axios**.

**File:** `resources/js/utils/api.js`

- **Baris 3–8** → `const api = axios.create({...})` — bikin "kurir" sekali, pakai berulang.
- **Baris 4** → `baseURL: "/api",` — **INI baris paling penting**: semua request otomatis dikasih awalan `/api`. Jadi `api.get("/tournaments")` = request ke `/api/tournaments`.
- **Baris 6** → `Accept: "application/json"` — bilang ke Laravel: "balikin JSON ya".

**Analogi:** `api.js` itu **nomor kontak + template pesanan** yang udah disiapin. Tiap mau pesan, tinggal tulis item-nya.

### Langkah 6 — React Minta Data (Home.jsx)

**File:** `resources/js/pages/Home.jsx`

- **Baris 10–12** → siapin "kotak" state:

  ```jsx
  const [turnamen, setTurnamen] = useState([]);   // baris 10 → isi data
  const [loading, setLoading] = useState(true);   // baris 11 → status loading
  const [error, setError] = useState("");         // baris 12 → status error
  ```

- **Baris 15–28** → fungsi `ambilTurnamen()` — **INI fungsi yang nge-fetch data**:

  - **Baris 20** → `const response = await api.get("/tournaments");`
    → kirim GET ke `/api/tournaments`. `await` = tunggu kurir balik.
  - **Baris 21** → `const data = response.data.data || [];`
    → ambil isi `data` dari JSON tadi.
  - **Baris 22** → `setTurnamen(data.map(rapikanTurnamen));`
    → simpan ke state (sambil dirapikan). Ini yang memicu React render ulang.
  - **Baris 25** → `setLoading(false)` → matiin loading.

- **Baris 30–32** → `useEffect(() => { ambilTurnamen(); }, []);`
  → "jalankan `ambilTurnamen` **sekali** pas Home dibuka".

**Analogi:** `useEffect` = alarm yang bunyi saat halaman dibuka. `ambilTurnamen` = orang yang langsung nelpon kurir (Axios) buat minta barang (data).

### Langkah 7 — rapikanTurnamen: Penerjemah Field

JSON dari Laravel pakai nama `title`, `start_date`, `price`, `quota`. Komponen React maunya `name`, `date`, `fee`, `slots`. Makanya ada "penerjemah".

**File:** `resources/js/utils/turnamen.js`

- **Baris 71–103** → `export const rapikanTurnamen = (item) => { ... }`
  - **Baris 72** → `const tanggal = String(item.start_date || "").slice(0, 10);` — ambil tanggal aja (`2026-09-18`).
  - **Baris 75** → `name: item.title || item.name || "Turnamen Tanpa Nama",` — `title` (Laravel) → `name` (React).
  - **Baris 85** → `fee: Number(item.price ?? item.fee ?? 0),` — `price` → `fee`.
  - **Baris 86** → `slots: Number(item.quota ?? item.slots ?? 0),` — `quota` → `slots`.

**Analogi:** menu asing diterjemahin ke bahasa lokal. Bahan sama, labelnya disesuaikan.

### Langkah 8 — React Nge-render Kartu

Data udah rapi di state `turnamen`. Sekarang **ditampilin**.

**File:** `resources/js/pages/Home.jsx`

- **Baris 34–35** → pisahin data:
  ```jsx
  const ongoing = turnamen.filter((t) => t.status === "ongoing");
  const upcoming = turnamen.filter((t) => t.status !== "ongoing" && t.status !== "completed");
  ```
- **Baris 146–150** → loop data jadi kartu:
  ```jsx
  {upcoming.map((t) => (
    <TournamentCard key={t.id} tournament={t} to={`/turnamen/${t.id}`} />
  ))}
  ```
  `.map()` = ubah tiap item jadi satu kartu. `key={t.id}` = nomor kursi unik.

**File:** `resources/js/components/TournamentCard.jsx`

- **Baris 8** → `export default function TournamentCard({ tournament, to, ... })` — nerima 1 object turnamen.
- **Baris 27–29** → `<h3 ...>{tournament.name}</h3>` — **judul kartu** dirender di sini.
- **Baris 40** → `{tournament.participants}/{tournament.slots} peserta` — kuota peserta.
- **Baris 43** → `{tournament.fee === 0 ? "Gratis" : formatRupiah(tournament.fee)}` — harga.

**SELESAI!** Data dari tabel `tournaments` → model → controller → JSON → Axios → state → kartu. 🎉

### Ringkasan Jalur (Hafalin Versi Ini)

```
[1] Migration  create_tournaments_table.php:12  → bikin tabel `tournaments`
        │  php artisan migrate
[2] Seeder      TournamentSeeder.php:13-19        → isi data contoh
        │
[3] Model       Tournament.php:10                 → nyambung ke tabel `tournaments`
        │
[4] request     browser GET /api/tournaments
        │
[5] Route       routes/api.php:7                   → arahkan ke controller@index
        │  (prefix /api dari bootstrap/app.php:11)
[6] Controller  TournamentApiController.php:12-21  → query DB + response()->json()
        │
[7] Axios       utils/api.js:4 (baseURL /api) + Home.jsx:20 (api.get)
        │
[8] State       Home.jsx:22  setTurnamen(...)       → React render ulang
        │
[9] Render      Home.jsx:146-150 + TournamentCard.jsx:27-29
        ▼
   KARTU MUNCUL DI LAYAR
```

---

## BAGIAN 2 — BEDAH FOLDER & FILE UTAMA (Satu per Satu)

Sekarang kita zoom tiap bagian. **Kenapa folder ini ada? Kenapa file ini penting?**

### 2.1 Folder `routes/` — Kenapa `web.php` Return View, `api.php` Return JSON?

Dua file ini sama-sama "resepsionis", tapi **melayani dua jenis tamu berbeda**.

**`routes/web.php` — buat halaman (HTML/View):**

```php
5: Route::get('/{any}', function () {
6:     return view('app');
7: })->where('any', '(?!api(?:/|$)|up$).*');
```

- **Baris 5** → `Route::get('/{any}', ...)` — tangkap **semua path** (`/`, `/tentang`, `/cari-turnamen`, `/turnamen/1`, dst). `{any}` = wildcard "apa aja".
- **Baris 6** → `return view('app');` — **balikin VIEW** (`resources/views/app.blade.php`), bukan JSON. View ini HTML yang jadi "panggung" buat React.
- **Baris 7** → `.where('any', '(?!api(?:/|$)|up$).*')` — **KECUALIKAN** `/api/...` dan `/up`. Jadi request API **tidak** ditangkep di sini — dia diteruskan ke `routes/api.php`.

**Kenapa web.php return view?** Karena ini yang dibuka **browser**. Browser butuh **HTML** buat nampilin halaman. HTML itulah yang nge-load React, dan React nanti yang ambil data.

**`routes/api.php` — buat data (JSON):**

```php
7:  Route::get('/tournaments', [TournamentApiController::class, 'index']);
8:  Route::get('/tournaments/{id}', [TournamentApiController::class, 'show']);
9:  Route::post('/tournaments', [TournamentApiController::class, 'store']);
10: Route::post('/tournaments/{id}/register', [TournamentApiController::class, 'register']);
```

- **Baris 7** → GET semua turnamen → `index`.
- **Baris 8** → GET satu turnamen → `show`.
- **Baris 9** → POST bikin turnamen → `store`.
- **Baris 10** → POST daftar tim → `register`.

**Kenapa api.php return JSON?** Karena yang minta **React (Axios)**, bukan manusia/browser langsung. React butuh **data mentah** (JSON), bukan HTML. Jadi controller selalu `response()->json(...)`.

**Bedanya cara kerja (penting buat dosen):**

| Aspek | `routes/web.php` | `routes/api.php` |
| --- | --- | --- |
| Yang akses | Browser (user) | React/Axios (aplikasi) |
| Balikin apa | HTML/View (`view('app')`) | JSON (`response()->json`) |
| Prefix URL | `/` (langsung) | otomatis `/api` |
| Butuh CSRF token & session | Ya | Tidak (stateless) |
| Tujuan | Nampilin halaman | Nyuplai data |

`bootstrap/app.php` baris **9–14** yang "memasang" dua file route ini ke aplikasi. Tanpa baris itu, Laravel nggak tahu mau baca route dari mana.

### 2.2 Folder Model — `Tournament.php` (Nama Tabel & Relasi)

> **Catatan lokasi:** kamu bilang "app/Models/Tournament.php". Aslinya model turnamen ada di **`app/Modules/Tournaments/Models/Tournament.php`**, bukan `app/Models/`. Folder `app/Models/` cuma berisi `User.php`. Ini karena proyek pakai gaya **modular** (dikelompokkan per fitur di `app/Modules`). Sebutin path yang benar pas presentasi!

**File:** `app/Modules/Tournaments/Models/Tournament.php`

- **Baris 7** → `class Tournament extends Model` — bikin class model.
- **Baris 10** → `protected $table = 'tournaments';` → **INI baris yang nentuin nama tabel**. Model ini nyambung ke tabel `tournaments`.
- **Baris 13–19** → `protected $fillable = ['title', 'game', 'quota', 'price', 'start_date'];` → kolom yang boleh diisi.
- **Baris 22–26** → `protected $casts = [...]` → tipe data (`quota` & `price` integer, `start_date` tanggal).

**Soal relasi (jawab jujur):** di file ini **belum ada method relasi**. Kalau dosen nanya "relasinya mana?", jawab:

> "Model turnamen saat ini fokus ke tabel `tournaments`. Relasi ke `teams` belum diimplementasi — tabel `teams` masih independen. Kalau mau, tinggal tambah `hasMany`/`belongsToMany` + foreign key di migration."

Bandingkan dengan **`app/Models/User.php`**:

- **Baris 13** → `#[Fillable(['name', 'email', 'password'])]` → di Laravel 13, `fillable` bisa pakai *attribute* (cara baru), bukan cuma `protected $fillable`.
- **Baris 14** → `#[Hidden(['password', 'remember_token'])]` → sembunyiin field sensitif dari JSON.

**`Team.php`** (`app/Modules/Tournaments/Models/Team.php`):
- **Baris 10** → `protected $table = 'teams';`
- **Baris 13–15** → `$fillable = ['name'];`

**Kenapa model penting?** Karena inilah satu-satunya "jembatan resmi" antara kode PHP dan tabel database. Tanpa model, controller harus nulis SQL mentah. Dengan model, cukup `Tournament::orderBy(...)->get()`.

### 2.3 Folder `app/Modules/` — Bedah `TournamentApiController.php`

**File:** `app/Modules/Tournaments/Http/Controllers/TournamentApiController.php`

Ini "koki" yang ngurus semua request turnamen. 4 method:

**a) `index()` — HANDLE GET (semua turnamen) → baris 12–21**

```php
12: public function index()
13: {
15:     $dataTurnamen = Tournament::orderBy('start_date', 'asc')->get();
17:     return response()->json([
18:         'message' => 'Daftar turnamen berhasil diambil',
19:         'data' => $dataTurnamen,
20:     ]);
21: }
```

- **Baris 12–21** = penangan **GET `/api/tournaments`**.
- **Baris 15** = query database (urut tanggal terdekat).
- **Baris 17–20** = balikin JSON.

**b) `show($id)` — HANDLE GET (satu turnamen) → baris 24–39**

```php
24: public function show($id)
26:     $turnamen = Tournament::find($id);
29:     if (!$turnamen) {
30:         return response()->json(['message' => 'Turnamen tidak ditemukan'], 404);
38:     return response()->json([...'data' => $turnamen]);
```

- **Baris 26** = cari turnamen by id (`find`).
- **Baris 29–33** = kalau nggak ada, balikin **404**.
- **Baris 35–38** = kalau ada, balikin detail JSON.

**c) `store()` — BAKAL NGURUS POST (bikin turnamen) → baris 42–46 — MASIH TODO!**

```php
42: public function store(Request $request)
43: {
45:     // TODO: Mahasiswa, isi logika DB::transaction dan lockForUpdate di sini (Modul 9)
46: }
```

- **Baris 42** = method yang bakal nanganin **POST `/api/tournaments`**.
- **Baris 45** = **masih kosong/TODO** — belum ada logika nyimpen. Ini tugas praktikum (Modul 9). Kalau dipanggil sekarang, dia **nggak balikin apa-apa** (atau error karena nggak ada `return`).

**d) `register()` — BAKAL NGURUS POST (daftar tim) → baris 49–53 — MASIH TODO!**

```php
49: public function register(Request $request, $id)
50: {
51:     // TODO: Mahasiswa, isi logika DB::transaction dan lockForUpdate di sini (Modul 9)
52: }
```

- **Baris 49** = method yang bakal nanganin **POST `/api/tournaments/{id}/register`**.
- **Baris 51** = **TODO**, belum diisi.

**Jadi jawaban kalau dosen nanya:**
- "GET ditangani di mana?" → **`index()` baris 12–21** (semua) & **`show()` baris 24–39** (satu).
- "POST di mana?" → dideklarasikan di **`store()` baris 42–46** & **`register()` baris 49–53**, tapi **logikanya masih TODO** (belum selesai).

**Analogi controller:** satu dapur punya beberapa koki spesialis: `index` = koki yang nyajiin semua menu, `show` = yang nyajiin satu piring, `store` & `register` = koki yang belum datang (masih TODO).

### 2.4 Folder `database/migrations/` — Bedah `create_tournaments`

**File:** `database/migrations/2026_11_13_000001_create_tournaments_table.php`

- **Baris 7** → `return new class extends Migration` — migration anonim (gaya Laravel modern).
- **Baris 10** → `public function up(): void` — fungsi **saat migrate** (bikin tabel).
- **Baris 12** → `Schema::create('tournaments', function (Blueprint $table) {` — bikin tabel `tournaments`.

Kolom-kolomnya:

| Baris | Kode | Arti |
| --- | --- | --- |
| 13 | `$table->id();` | kolom `id` (primary key, auto increment) |
| **14** | `$table->string('title');` | kolom **title** (nama turnamen) |
| 15 | `$table->string('game');` | kolom `game` (jenis game) |
| **16** | `$table->integer('quota');` | kolom **quota** (kuota peserta) |
| **17** | `$table->integer('price');` | kolom **price** (harga) |
| 18 | `$table->date('start_date');` | kolom `start_date` (tanggal mulai) |
| 19 | `$table->timestamps();` | kolom `created_at` & `updated_at` |

- **Baris 24–27** → `public function down(): void { Schema::dropIfExists('tournaments'); }` — kalau migration di-rollback, tabel dihapus.

**Jadi kolom `title`, `quota`, `price` ada di baris 14, 16, 17.** Hafalin tiga ini karena sering ditanya.

**Analogi migration:** cetakan/loyang kue. `up()` = bikin loyang. `down()` = bongkar loyang.

### 2.5 Folder `resources/js/` — Bedah `App.jsx` & `utils/api.js`

**a) `resources/js/App.jsx` — Peta Routing**

File ini "peta" halaman: URL mana nampilin komponen apa.

- **Baris 4** → `import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';` — alat routing.
- **Baris 30** → `<QueryClientProvider client={queryClientInstance}>` — provider React Query (opsional, buat data fetching lanjutan).
- **Baris 31** → `<Router>` — bungkus seluruh app biar bisa routing.
- **Baris 34** → `<Routes>` — daftar semua route.
- **Baris 35** → `<Route element={<Layout />}>` — **SEMUA halaman dibungkus `Layout`** (yang isinya Navbar + Footer + `<Outlet />`). Makanya Navbar/Footer selalu muncul.
- **Baris 36** → `<Route path="/" element={<Home />} />` — Home.
- **Baris 39** → `<Route path="/tentang" element={<Tentang />} />` — Tentang.
- **Baris 41** → `<Route path="/cari-turnamen" element={<CariTurnamen />} />` — Cari Turnamen.
- **Baris 53** → `<Route path="*" element={<PageNotFound />} />` — kalau URL nggak cocok, tampil 404 versi ArenaHub.

**Kenapa file ini penting?** Tanpa `App.jsx`, React nggak tahu halaman mana yang harus ditampilin buat tiap URL. Ini "papan petunjuk" aplikasi.

**b) `resources/js/utils/api.js` — baseURL Axios**

- **Baris 1** → `import axios from "axios";` — pakai Axios.
- **Baris 3** → `const api = axios.create({ ... })` — bikin instance Axios.
- **Baris 4** → `baseURL: "/api",` — **INI baris kunci**. Semua request dikasih prefix `/api`.
- **Baris 6** → `Accept: "application/json"` — minta JSON.
- **Baris 10** → `export default api;` — diekspor biar bisa dipakai file lain (Home, CariTurnamen, dll).

**Kenapa pakai path relatif `/api`?** Biar request ikut origin halaman (same-origin), jadi **bebas CORS** dan otomatis nyambung ke server yang lagi nge-host — baik dev (`:8000`) maupun produksi.

### 2.6 Bonus — Jembatan Laravel → React (Kenapa React Bisa "Nempel")

Dua file ini yang nyambungin dunia backend & frontend. Sering ditanya, jarang dijelasin.

**`resources/views/app.blade.php`** — kerangka HTML:

- **Baris 14** → `@viteReactRefresh` — suntik Hot Refresh (mode dev).
- **Baris 15** → `@vite('resources/js/main.jsx')` — **muat React**. Kalau mode dev, ambil dari server Vite; kalau build, ambil manifest.
- **Baris 18** → `<div id="root"></div>` — **panggung kosong** yang bakal diisi React.

**`resources/js/main.jsx`** — titik nyala React:

- **Baris 3** → `import App from '@/App.jsx'` — ambil komponen App.
- **Baris 4** → `import '../css/app.css'` — muat styling global (Tailwind).
- **Baris 6** → `ReactDOM.createRoot(document.getElementById('root')).render(` — **cari `<div id="root">` tadi, lalu render React ke situ**.
- **Baris 7** → `<App />` — semua isi aplikasi.

**Styling global** ada di `resources/css/app.css`:
- **Baris 1–3** → `@tailwind base; @tailwind components; @tailwind utilities;` — nyalain Tailwind.
- **Baris 6–21** → variabel warna `--arena-*`.
- **Baris 33–56** → class custom `.hero-title`, `.h1`, `.h2`, `.meta`.

**Vite** (`vite.config.js`) nyambungin semuanya:
- **Baris 14** → `input: ['resources/js/main.jsx']` — file awal yang di-bundle.
- **Baris 8–10** → alias `@` → `resources/js` (makanya import `@/components/...` jalan).

---

## BAGIAN 3 — "SEHARI DALAM HIDUP" SATU REQUEST (Narasi Buat Presentasi)

Ini versi cerita yang bisa kamu hafal & ucapin di depan dosen. Kalau bingung mau mulai dari mana, baca ini:

> "Pas user buka `localhost:8000`, browser minta halaman ke Laravel. Laravel baca `routes/web.php` — karena ini bukan `/api`, dia balikin `view('app')`, yaitu `app.blade.php`. File itu isinya `<div id="root">` plus `@vite('resources/js/main.jsx')`. Nah, `main.jsx` inilah yang nge-render React ke dalam `#root`, dan `App.jsx` nentuin halaman mana yang tampil lewat routing — misalnya Home.
>
> Pas Home tampil, di `Home.jsx` ada `useState` buat nyimpen data, dan `useEffect` yang manggil fungsi `ambilTurnamen`. Fungsi itu pakai Axios dari `utils/api.js`, yang nembak `GET /api/tournaments`.
>
> Request itu masuk ke `routes/api.php`, diarahkan ke `TournamentApiController@index`. Controller manggil model `Tournament` — yang nyambung ke tabel `tournaments` lewat `protected $table` di baris 10 — lalu query database pakai `Tournament::orderBy(...)->get()`. Hasilnya dibungkus `response()->json()` dan dikirim balik ke React.
>
> React nerima JSON, ambil `response.data.data`, lalu `rapikanTurnamen` nyamain nama field (`title`→`name`, `price`→`fee`, `quota`→`slots`). Setelah itu `setTurnamen` nyimpen data ke state — dan karena state berubah, React otomatis render ulang. Terakhir, `.map()` di Home ngubah tiap object jadi `TournamentCard`, dan munculah kartu-kartu turnamen di layar."

Itu narasi lengkapnya. Kalau bisa nyebutin minimal **route → controller → model → JSON → Axios → state → render**, dosen udah ngerti kamu paham beneran.

---

## BAGIAN 4 — CHEAT SHEET LOKASI & BARIS (Buat Nunjuk Cepat)

| Apa | File | Baris penting |
| --- | --- | --- |
| Bikin tabel turnamen | `database/migrations/2026_11_13_000001_create_tournaments_table.php` | `Schema::create` **12**; `title` **14**, `quota` **16**, `price` **17** |
| Data contoh | `database/seeders/TournamentSeeder.php` | `create` **13–19** |
| Model turnamen | `app/Modules/Tournaments/Models/Tournament.php` | `$table` **10**; `$fillable` **13–19**; `$casts` **22–26** |
| Route API | `routes/api.php` | GET **7**, GET id **8**, POST **9**, register **10** |
| Route halaman | `routes/web.php` | catch-all `view('app')` **5–7** |
| Controller GET | `app/Modules/Tournaments/Http/Controllers/TournamentApiController.php` | `index` **12–21**; query **15**; json **17–20** |
| Controller POST (TODO) | sama | `store` **42–46**; `register` **49–53** |
| Daftar route API | `bootstrap/app.php` | `withRouting(... api: ...)` **9–14** |
| baseURL Axios | `resources/js/utils/api.js` | **4** |
| Fetch di Home | `resources/js/pages/Home.jsx` | state **10–12**; fetch **20**; setState **22**; useEffect **30–32**; render **146–150** |
| Render kartu | `resources/js/components/TournamentCard.jsx` | judul **27–29**; harga **43** |
| Penerjemah field | `resources/js/utils/turnamen.js` | `rapikanTurnamen` **71–103** |
| Routing React | `resources/js/App.jsx` | Router **31**, Routes **34**, Layout **35**, Home **36**, Tentang **39**, Cari **41**, catch-all **53** |
| Jembatan ke React | `resources/views/app.blade.php` | `@vite` **15**, `#root` **18** |
| Render React | `resources/js/main.jsx` | `createRoot(...).render` **6–8** |
| Layout + Footer | `resources/js/components/Layout.jsx` | Navbar **8**, Outlet **10**, footer **12–16** |

---

## BAGIAN 5 — LATIHAN TANYA-JAWAB (Simulasi Dosen)

Latih sendiri sebelum sidang. Jawab keras-keras. 💪

**Q: Kenapa ada dua folder route (`web.php` & `api.php`)?**
A: `web.php` buat halaman browser (balikin HTML/View), `api.php` buat data JSON yang dipakai React. Prefix `/api` otomatis dari `bootstrap/app.php` baris 9–14.

**Q: Di mana nama tabel ditentukan?**
A: Di model `Tournament.php` baris 10: `protected $table = 'tournaments';`.

**Q: Data turnamen diambil di baris berapa?**
A: Query di controller `TournamentApiController.php` baris 15; fungsi fetch di React `Home.jsx` baris 15–28, request di baris 20.

**Q: POST/store udah jalan?**
A: Belum. `store()` baris 42–46 dan `register()` baris 49–53 masih TODO (Modul 9).

**Q: Kenapa data JSON bisa jadi kartu?**
A: Axios ambil JSON → `rapikanTurnamen` (turnamen.js 71–103) samain field → `setTurnamen` (Home.jsx 22) → React render ulang → `.map()` di 146–150 render `TournamentCard`.

**Q: Kolom title, quota, price dibuat di baris berapa?**
A: Migration `create_tournaments_table.php` baris 14, 16, 17.

**Q: React nempel ke Laravel gimana?**
A: `app.blade.php` baris 15 `@vite('resources/js/main.jsx')` + baris 18 `<div id="root">`, lalu `main.jsx` baris 6–8 nge-render App ke situ.

**Q: Relasi turnamen–tim ada?**
A: Belum diimplementasi. Model `Tournament.php` belum punya method relasi; tabel `teams` masih independen (`id`, `name`).

Kalau semua jawaban ini udah nempel di kepala, kamu siap. Selamat presentasi! 🔥
