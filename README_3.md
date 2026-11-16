# README_3 — Peta Kode: Lokasi File, Baris, & Cara Ngubah (Buat Presentasi)

Ini file "kunci jawaban" kamu. Kalau dosen nanya *"ini filenya di mana?"*, *"baris berapa?"*, atau *"coba ubah warna ini"*, tinggal buka README_3 ini. Semua path dan nomor baris di bawah **akurat sesuai isi proyek sekarang**. Santai, kita bahas kayak ngasih bocoran ke temen sebelum ujian. 😎

> Catatan: nomor baris bisa **bergeser** kalau kamu nambah/ngurangi kode di atasnya. Jadi kalau dosen nanya dan posisinya beda dikit, cari pakai `Ctrl + F` (VS Code) pakai cuplikan teks yang ada di bawah. Itu trik paling aman.

---

## BAGIAN 1 — PETA DATABASE & FOLDER

### 1.1 Database MySQL Disimpen di Mana? (ServBay + `.env` + Adminer)

Ini pertanyaan jebakan yang sering bikin panik. Jawaban singkatnya:

> **Data MySQL TIDAK disimpan di dalam folder proyek.** Yang ada di folder proyek cuma *cara konek*-nya (`.env`). Datanya sendiri disimpen di **folder data milik server MySQL** yang dikelola **ServBay**.

Analoginya: folder proyek itu kayak **buku catatan alamat + nomor telepon**. Datanya (isi kontak) ada di **HP**. `.env` cuma nyimpen "alamat" ke database, bukan isi database-nya.

**Rantai hubungannya kayak gini:**

```
ServBay (nyalain server MySQL + PHP)
        │
        ▼
MySQL server (punya folder data sendiri di luar proyek)
        │  <— konek lewat host/port/user/password
        ▼
.env  (DB_CONNECTION, DB_HOST, DB_PORT, DB_DATABASE, DB_USERNAME, DB_PASSWORD)
        │
        ▼
Laravel baca .env → config/database.php → konek ke MySQL
        │
        ▼
React minta data lewat API → tampil di website
```

**a) ServBay** = aplikasi "all-in-one" buat nyalain PHP, MySQL/MariaDB, dan web server di laptop. Anggap ServBay itu **genset** yang nyalain listrik (MySQL). Kalau ServBay mati, database juga mati, website error "connection refused".

Jadi sebelum ngoding: **pastikan ServBay nyala dan service MySQL-nya running.**

**b) File `.env`** — lokasinya di root proyek:

```
C:\Users\ASUS\OneDrive\Documents\arenahub-backend\.env
```

Bagian database ada di **baris 23–28**:

```dotenv
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=arenahub_db
DB_USERNAME=arenahub
DB_PASSWORD=arenahub123
```

Ini "alamat lengkap" ke database. Laravel baca ini, terus nyocokin ke `config/database.php` (bagian `'mysql' => [...]` di **baris 47–65**) yang nentuin detail teknis koneksi.

**c) Cara buka phpMyAdmin / Adminer buat liat data**

Karena kamu pakai ServBay, ada beberapa cara:

1. **Lewat panel ServBay**: buka aplikasi ServBay → cari menu **Database** / **MySQL** → kelola database langsung dari situ (liat tabel, jalanin query).
2. **Lewat Adminer / phpMyAdmin** (kalau dipasang di ServBay): buka URL-nya di browser, lalu login pakai:
   - Server/Host: `127.0.0.1`
   - Port: `3306`
   - Username: `arenahub`
   - Password: `arenahub123`
   - Database: `arenahub_db`
3. **Lewat terminal (paling cepat untuk demo):**

   ```bash
   mysql -u arenahub -p arenahub_db
   # masukin password: arenahub123
   ```

   Setelah masuk, lihat tabel dan isinya:

   ```sql
   SHOW TABLES;
   SELECT * FROM tournaments;
   ```

> Catatan: kalau ServBay kamu ternyata pakai **root tanpa password**, tinggal ganti `DB_USERNAME=root` dan `DB_PASSWORD=` (kosong) di `.env`. Tapi proyek ini default-nya pakai user `arenahub`. Intinya: **nilai di `.env` harus persis sama dengan user yang ada di MySQL**, kalau enggak → error `Access denied for user`.

**d) Tabel apa aja yang ada di database?**

Tabel dibentuk dari file "cetakan" di folder `database/migrations/`:

| Tabel | Dibuat oleh file | Isi |
| --- | --- | --- |
| `tournaments` | `database/migrations/2026_11_13_000001_create_tournaments_table.php` | data turnamen (title, game, quota, price, start_date) |
| `teams` | `database/migrations/2026_11_13_000002_create_teams_table.php` | data tim |
| `users` | `database/migrations/0001_01_01_000000_create_users_table.php` | data user |
| `migrations`, `cache`, `jobs`, `sessions` | file migrasi bawaan Laravel | catatan internal Laravel |

Kolom tabel `tournaments` (dari migrasi, **baris 13–19**): `id`, `title`, `game`, `quota`, `price`, `start_date`, `created_at`, `updated_at`.

Data contoh diisi oleh `database/seeders/TournamentSeeder.php` (4 turnamen contoh: MLBB, Free Fire, eFootball, Point Blank).

---

### 1.2 Fungsi Folder Utama (Analogi Rumah)

Bayangin proyek ini satu **rumah**. Tiap folder punya peran:

```
arenahub-backend/
├── app/          → DAPUR        (logika backend: masak data)
├── resources/    → RUANG TAMU   (tampilan yang dilihat user)
├── routes/       → RESEPSIONIS  (papan alamat: URL → tujuan)
├── public/       → HALAMAN DEPAN (pintu masuk + aset jadi)
├── config/       → BUKU SETELAN (pengaturan)
├── database/     → GUDANG DATA  (cetakan tabel + data contoh)
├── storage/      → GUDANG BELAKANG (log, cache, file upload)
├── bootstrap/    → MESIN STARTER (nyalain aplikasi)
├── vendor/       → GUDANG BAHAN PHP   (hasil composer, JANGAN diutak-atik)
├── node_modules/ → GUDANG BAHAN JS    (hasil npm, JANGAN diutak-atik)
└── tests/        → RUANG UJI (testing otomatis)
```

Detail tiap folder:

**`app/` — Dapur (backend logic)**
Di sini "masakannya" dibuat: controller, model, dll. Yang penting buat kamu:
- `app/Modules/Tournaments/Http/Controllers/TournamentApiController.php` → controller yang ngambil data turnamen dari database dan balikin JSON.
- `app/Modules/Tournaments/Models/Tournament.php` → model = "wakil" tabel `tournaments` di kode.
- `app/Models/User.php` → model user.

Controller itu kayak **koki**: nerima pesanan (request), masak (query DB), nyajiin (response JSON).

**`resources/` — Ruang Tamu (tampilan / frontend)**
Ini yang dilihat user. Isinya:
- `resources/js/` → semua kode React (`.jsx`). **INI YANG PALING SERING KAMU UBAH** buat ngubah tampilan.
- `resources/views/app.blade.php` → kerangka HTML yang nyerahin "panggung" `<div id="root">` ke React.
- `resources/css/app.css` → styling global (yang di-import `main.jsx`).

**`routes/` — Resepsionis (peta URL)**
Nentuin URL mana nembak ke kode mana:
- `routes/web.php` → nampilin halaman React (semua route non-API).
- `routes/api.php` → daftar endpoint API (`/api/tournaments`, dst).

**`public/` — Halaman Depan (pintu masuk publik)**
- `public/index.php` → pintu masuk utama Laravel (semua request lewat sini).
- `public/build/` → hasil `npm run build` (JS+CSS produksi yang udah di-minify). **Jangan diedit manual**, itu hasil generate.
- `public/robots.txt`, `favicon.ico` → file publik standar.

**`config/` — Buku Setelan**
Setelan Laravel per topik: `config/database.php` (koneksi DB), `config/session.php`, `config/mail.php`, dll. Nilainya biasanya ngambil dari `.env`.

**`database/` — Gudang Data**
- `database/migrations/` → cetakan tabel.
- `database/seeders/` → data contoh.
- `database/factories/` → generator data palsu buat testing.

**`storage/` — Gudang Belakang**
- `storage/logs/laravel.log` → catatan error. **Kalau ada error aneh, buka file ini!**
- `storage/framework/` → cache internal.

**`vendor/` & `node_modules/`** — gudang bahan. Jangan diedit. Kalau rusak/hilang, tinggal `composer install` / `npm install` lagi.

---

## BAGIAN 2 — LOKASI FILE UI (Halaman Website)

Semua halaman React ada di `resources/js/pages/`, komponen (potongan UI yang dipakai berulang) di `resources/js/components/`. Ini peta lengkapnya.

### 2.1 Tabel Lokasi Halaman Penting

| Yang mau diubah | Path lengkap | Keterangan |
| --- | --- | --- |
| **Halaman Login (Sign In)** | `resources/js/pages/SignIn.jsx` | form email + password, tombol Sign In |
| **Halaman Daftar (Sign Up)** | `resources/js/pages/SignUp.jsx` | form registrasi |
| **Halaman Tentang** | `resources/js/pages/Tentang.jsx` | teks, kartu fitur |
| **Halaman Pencarian Turnamen** | `resources/js/pages/CariTurnamen.jsx` | search + filter game/mode/status |
| **Halaman Home (beranda)** | `resources/js/pages/Home.jsx` | hero + daftar turnamen |
| **Navbar (menu atas)** | `resources/js/components/Navbar.jsx` | logo, menu, tombol Sign In/Up |
| **Footer (kaki halaman)** | `resources/js/components/Layout.jsx` (baris 12–16) | teks footer |
| **Kartu turnamen** | `resources/js/components/TournamentCard.jsx` | desain 1 kartu turnamen |
| **Kerangka layout** | `resources/js/components/Layout.jsx` | navbar + `<Outlet />` + footer |
| **Daftar route (alamat halaman)** | `resources/js/App.jsx` | pemetaan URL → komponen |

> **Penting soal Navbar & Footer:** dua-duanya **bukan** halaman sendiri. Navbar & Footer dipasang sekali di `Layout.jsx`, lalu `<Outlet />` di tengahnya nampilin halaman yang lagi aktif (Home/Tentang/dll). Makanya Navbar/Footer **selalu muncul di semua halaman**. Kalau nyari "kok navbar ada di semua page?", jawabannya: karena `Layout.jsx` jadi "bingkai" buat semua route (lihat `App.jsx` baris 35).

### 2.2 Di Mana Navbar & Footer Persisnya?

**Footer** — ada di `resources/js/components/Layout.jsx`, **baris 12–16**:

```jsx
<footer className="border-t border-arena-border px-4 py-8">
  <div className="mx-auto max-w-6xl text-center meta text-arena-muted">
    ArenaHub — Platform Turnamen Esport · {new Date().getFullYear()}
  </div>
</footer>
```

**Navbar** — dipanggil di `Layout.jsx` baris 8 (`<Navbar />`), definisinya di `resources/js/components/Navbar.jsx`:
- Menu publik: array `publicLinks` **baris 20–24** (Home, Cari Turnamen, Tentang).
- Logo: fungsi `Logo()` **baris 26–37**.
- Tombol Sign In / Sign Up: **baris 77–91**.

### 2.3 Login Ada di File Mana?

`resources/js/pages/SignIn.jsx`:
- Judul "Sign In": **baris 35**.
- Subjudul: **baris 36**.
- Input email: **baris 44–51**.
- Input password: **baris 58–65**.
- Tombol Sign In (warna cyan): **baris 68–73**.
- Catatan prototype: **baris 82–84**.

> Login di proyek ini masih **prototype/dummy** — belum nembak ke backend beneran, cuma nyimpen user di `AuthContext`. Logikanya di `handleSubmit` **baris 16–27**. Kalau email mengandung kata `organizer`, dia login sebagai organizer.

### 2.4 Data Turnamen di Home Di-fetch di File Mana?

**Jawaban: `resources/js/pages/Home.jsx`.**

Bagian pentingnya:
- State penampung data: **baris 10** → `const [turnamen, setTurnamen] = useState([]);`
- Fungsi fetch: **baris 15–28** (`ambilTurnamen`).
- Baris request ke Laravel: **baris 20** →

  ```jsx
  const response = await api.get("/tournaments");
  ```

- Pemicu fetch saat halaman dibuka: **baris 30–32** (`useEffect`).
- Render kartu: **baris 121–125** (ongoing) dan **146–150** (upcoming).

Rantai lengkapnya (biar bisa jawab kalau dosen nanya "datanya dari mana?"):

```
Home.jsx baris 20  →  api.get("/tournaments")
      │  (api.js baris 4: baseURL "/api")
      ▼
GET /api/tournaments  →  routes/api.php baris 7
      ▼
TournamentApiController.php baris 12–21 (method index)
      ▼
Tournament::orderBy(...)->get()  →  baca tabel `tournaments` di MySQL
      ▼
response()->json(...)  →  JSON balik ke React
      ▼
Home.jsx baris 22  →  setTurnamen(...)  →  kartu muncul
```

Catatan: halaman `CariTurnamen.jsx` juga fetch di file sendiri (**baris 21–34**, request di **baris 26**). Jadi dua halaman ini punya "kurir" data masing-masing, tapi sama-sama nembak endpoint `/api/tournaments`.

---

## BAGIAN 3 — CARA NGUMBAH TEKS & DESAIN (What If)

Sekarang bagian paling praktis. Ini skenario "what if" yang kemungkinan besar ditanya dosen, plus contoh SEBELUM → SESUDAH.

### 3.1 Ubah Teks Deskripsi di Halaman "Tentang"

**File:** `resources/js/pages/Tentang.jsx`
**Baris:** **9–10** (di dalam `<p className="text-arena-muted">` yang dibuka di baris 8).

Kode aslinya:

```jsx
8:      <p className="text-arena-muted">
9:        ArenaHub adalah platform yang mempertemukan peserta dan organizer turnamen esport dalam satu tempat.
10:       Cari turnamen, daftar, lakukan pembayaran, dan pantau seluruh progres pertandinganmu dari awal hingga hasil.
11:      </p>
```

**SEBELUM** (baris 9–10):

```jsx
ArenaHub adalah platform yang mempertemukan peserta dan organizer turnamen esport dalam satu tempat.
Cari turnamen, daftar, lakukan pembayaran, dan pantau seluruh progres pertandinganmu dari awal hingga hasil.
```

**SESUDAH** (contoh kamu ubah):

```jsx
ArenaHub adalah rumah bagi para gamer yang ingin unjuk gigi.
Temukan turnamen favoritmu, daftar dalam hitungan menit, dan rebut hadiahnya!
```

Cukup ganti teks, simpan (Ctrl+S). Kalau `npm run dev` jalan, langsung berubah di browser.

**Bonus — ubah judul halaman:** baris **7**:

```jsx
<h1 className="h1 mb-3">Tentang ArenaHub</h1>
```

Ganti `Tentang ArenaHub` jadi apa pun, misal `Kenalan Sama ArenaHub`.

**Bonus — ubah kartu fitur:** datanya ada di array **baris 14–18**. Contoh, ganti judul salah satu fitur:

```jsx
// SEBELUM (baris 15)
{ icon: Trophy, title: "Cari & Daftar", desc: "..." },

// SESUDAH
{ icon: Trophy, title: "Cari & Ikuti", desc: "Temukan turnamen dan ikuti dengan mudah." },
```

Array itu di-render jadi kartu di **baris 20–25**, jadi ubah data → kartu otomatis ikut berubah. Nggak usah sentuh JSX kartunya.

### 3.2 Ubah Warna Tombol di Halaman "Home"

**File:** `resources/js/pages/Home.jsx`.

Di Home ada dua tombol besar di hero:
- **Tombol "Cari Turnamen"** → **baris 57–62**. Class warnanya di **baris 59**.
- **Tombol "Buat Turnamen"** → **baris 63–69**. Class warnanya di **baris 65**.

Lihat **baris 59** (tombol Cari Turnamen):

```jsx
className="inline-flex items-center justify-center gap-2 rounded-md bg-arena-cyan px-6 py-3 font-semibold text-arena-bg transition-all duration-300 hover:scale-105 hover:brightness-110"
```

Kuncinya ada di `bg-arena-cyan` (warna latar) dan `text-arena-bg` (warna teks). `arena-cyan` itu warna custom dari `tailwind.config.js` (nilainya `#00F0FF`).

**SEBELUM** (tombol cyan):

```jsx
className="... bg-arena-cyan ... text-arena-bg ... hover:brightness-110"
```

**SESUDAH** (jadi merah pakai warna ArenaHub `danger`):

```jsx
className="... bg-arena-danger ... text-white ... hover:brightness-110"
```

Contoh lebih lengkap, **baris 59** diganti jadi:

```jsx
className="inline-flex items-center justify-center gap-2 rounded-md bg-arena-danger px-6 py-3 font-semibold text-white transition-all duration-300 hover:scale-105 hover:brightness-110"
```

Beda cuma dua token:
- `bg-arena-cyan` → `bg-arena-danger`
- `text-arena-bg` → `text-white` (biar teks kebaca di atas merah)

**Pilihan warna yang udah tersedia** (dari `tailwind.config.js` baris 20–32):
| Class | Warna | Hex |
| --- | --- | --- |
| `bg-arena-cyan` | cyan | `#00F0FF` |
| `bg-arena-purple` | ungu | `#7000FF` |
| `bg-arena-success` | hijau | `#00E676` |
| `bg-arena-warning` | kuning | `#FFB300` |
| `bg-arena-danger` | merah | `#FF5252` |
| `bg-arena-bg` | gelap | `#0B0F17` |

**Kalau dosen minta warna spesifik yang nggak ada** (misal hijau tosca), langsung pakai class Tailwind default: `bg-emerald-500`, `bg-red-600`, `bg-sky-400`, dsb. Tailwind punya ratusan warna siap pakai.

> Tips demo: ubah warna **cuma di satu tombol** dulu biar keliatan "before-after"-nya. Jangan lupa Ctrl+S, terus tunjukin di browser (kalau mode dev, berubah sekejap).

### 3.3 Mau Ubah Warna Global (Semua Elemen Sekaligus)?

Kalau mau **semua** elemen cyan berubah (bukan cuma satu tombol), edit sumber warnanya di `tailwind.config.js` baris 25:

```js
arena: {
  cyan: '#00F0FF',   // ← ganti hex ini
  ...
}
```

Ganti `#00F0FF` jadi hex lain, **semua** `bg-arena-cyan` / `text-arena-cyan` di seluruh situs ikut berubah. Tapi hati-hati: ini efeknya global. Buat presentasi biasanya cukup ubah 1 tombol (lebih aman & terlihat jelas).

### 3.4 Ubah Teks/Navigasi Navbar

**File:** `resources/js/components/Navbar.jsx`.
- Menu publik (Home, Cari Turnamen, Tentang): array **baris 20–24**. Tinggal ubah `label`:

  ```jsx
  const publicLinks = [
    { to: "/", label: "Home", end: true },
    { to: "/cari-turnamen", label: "Cari Turnamen" },
    { to: "/tentang", label: "Tentang" },   // ← ubah "Tentang" jadi "About"
  ];
  ```

- Nama brand "ArenaHub" di logo: **baris 32–34**.
- Tombol "Sign Up" cyan: **baris 85–90** (warnanya `bg-arena-cyan`, baris 87).

### 3.5 Ubah Teks Footer

**File:** `resources/js/components/Layout.jsx`, **baris 14**:

```jsx
ArenaHub — Platform Turnamen Esport · {new Date().getFullYear()}
```

**SEBELUM:**

```jsx
ArenaHub — Platform Turnamen Esport · {new Date().getFullYear()}
```

**SESUDAH:**

```jsx
© {new Date().getFullYear()} ArenaHub. Dibuat dengan ❤️ oleh Tim Esport.
```

`{new Date().getFullYear()}` otomatis nampilin tahun sekarang (nggak usah ngetik "2026" manual).

### 3.6 Ubah Data Turnamen (Bukan Tampilan, Tapi Datanya)

Kalau yang mau diubah **isinya** (bukan desain), ada 2 cara:

1. **Ubah data contoh (seeder)** → `database/seeders/TournamentSeeder.php` baris 13–43. Ubah `title`, `price`, dll, lalu jalanin ulang:
   ```bash
   php artisan migrate:fresh --seed
   ```
   (⚠️ `migrate:fresh` **menghapus semua data** lalu ngisi ulang — pakai kalau data dummy boleh hilang.)
2. **Langsung di database** → buka Adminer/phpMyAdmin, edit tabel `tournaments`, atau lewat SQL:
   ```sql
   UPDATE tournaments SET title = 'Turnamen Baru' WHERE id = 1;
   ```

Ingat: yang nampilin data di Home adalah `Home.jsx` (nembak `/api/tournaments`), sedangkan yang nyiapin JSON-nya `TournamentApiController.php` baris 12–21. Mau ubah **logika** ambil data (mis. urutan, filter) → edit controller. Mau ubah **tampilan** → edit `Home.jsx`/`TournamentCard.jsx`.

---

## BAGIAN 4 — "Kalau File Ini Dihapus, Error Apa?" (Antisipasi Dosen)

Dosen suka nanya *"coba hapus file X, apa yang terjadi?"*. Ini contekan jawabannya. Jangan beneran hapus di folder asli — pakai Git biar bisa balikin, atau copy dulu.

| File/Folder yang dihapus | Yang terjadi | Cara balikin |
| --- | --- | --- |
| `resources/js/pages/Home.jsx` | `App.jsx` gagal import → layar blank / error merah di browser, `npm run build` gagal ("Could not resolve") | buat ulang file / `git restore` |
| `resources/js/components/Navbar.jsx` | `Layout.jsx` gagal import Navbar → seluruh situs error (karena Layout dipakai semua halaman) | `git restore` |
| `resources/js/components/Layout.jsx` | semua route error, karena semua halaman dibungkus `<Layout />` | `git restore` |
| `resources/js/App.jsx` | `main.jsx` gagal render `<App />` → layar putih total | `git restore` |
| `resources/js/utils/api.js` | semua `import api` gagal → halaman yang fetch data (Home, CariTurnamen) error | `git restore` |
| `routes/api.php` | endpoint `/api/tournaments` hilang → React dapat **404**, Home nampilin pesan error "Gagal mengambil data" | `git restore` |
| `app/Modules/Tournaments/Http/Controllers/TournamentApiController.php` | route nunjuk ke class yang nggak ada → **500 / Class not found**, API mati | `git restore` |
| `resources/views/app.blade.php` | Laravel nggak punya view buat `routes/web.php` → error "View [app] not found" | `git restore` |
| `database/migrations/*` | `php artisan migrate` nggak bikin tabel → tabel nggak ada → query error "table not found" | `git restore` lalu migrate |
| `.env` | `APP_KEY` hilang (error enkripsi) + koneksi DB hilang → **500** | `cp .env.example .env` lalu `php artisan key:generate` |
| `.env` dihapus dan di-commit | rahasia aman (karena `.env` di-gitignore), tapi mesin lain nggak bisa jalan tanpa bikin `.env` sendiri | sebarkan `.env.example`, bukan `.env` |
| `public/build/` | kalau **mode produksi** (tanpa `npm run dev`), CSS/JS 404 → halaman putih tanpa style | `npm run build` lagi |
| `vendor/` | `php artisan` dan Laravel **crash** ("Please run composer install") | `composer install` |
| `node_modules/` | `npm run dev` / `npm run build` gagal ("vite not found") | `npm install` |
| `storage/logs/laravel.log` | nggak fatal, Laravel bikin baru otomatis | otomatis dibuat ulang |

**Poin penting buat presentasi:** bedakan 3 jenis "rusak":

1. **Rusak frontend** (folder `resources/js`) → layar blank / error di browser, tapi server tetap jalan.
2. **Rusak backend/routing** (`app`, `routes`) → API mati, halaman nampilin pesan error data gagal dimuat.
3. **Rusak dependency** (`vendor`, `node_modules`, `.env`) → aplikasi nggak mau nyala sama sekali.

**Pro tips:** sebelum demo, `git init` + commit dulu. Kalau ada yang kehapus, `git restore .` balikin semua. Aman sentosa.

---

## RINGKASAN CEPAT (Buat Hafalan Sebelum Masuk Ruang Sidang)

- **Database**: bukan di folder proyek. Dikelola **ServBay**, alamat koneksinya di `.env` **baris 23–28**, tabelnya dibuat dari `database/migrations/`. Buka lain via ServBay Database / Adminer / `mysql -u arenahub -p arenahub_db`.
- **Folder**: `app`=dapur, `resources`=ruang tamu (UI), `routes`=resepsionis, `public`=pintu depan, `database`=gudang data.
- **Login** → `resources/js/pages/SignIn.jsx`
- **Tentang** → `resources/js/pages/Tentang.jsx`
- **Pencarian** → `resources/js/pages/CariTurnamen.jsx`
- **Navbar** → `resources/js/components/Navbar.jsx`
- **Footer** → `resources/js/components/Layout.jsx` baris **12–16**
- **Home fetch data** → `resources/js/pages/Home.jsx` baris **20** (`api.get("/tournaments")`)
- **Ubah teks Tentang** → `Tentang.jsx` baris **9–10**
- **Ubah warna tombol Home** → `Home.jsx` baris **59** (`bg-arena-cyan` → `bg-arena-danger`)
- **Ubah warna global** → `tailwind.config.js` baris **25**
- **Hapus file** → cek tabel Bagian 4, hampir semua bisa dibalikin pakai `git restore` atau reinstall (`composer install`/`npm install`).

Kalau kamu hafal peta ini, dosen mau nanya apa pun soal "file ini di mana", kamu tinggal tembak. Semangat sidangnya! 🔥
