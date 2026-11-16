# README_4 — P3K Error ArenaHub (Biar Nggak Panik Pas Presentasi)

Tenang. Error itu **normal**. Yang bikin gagal presentasi bukan error-nya, tapi panik-nya. README ini kayak kotak P3K: buka, cari gejalanya, ikutin langkahnya. 90% error di proyek ini jatuh ke salah satu dari daftar di bawah.

> **Cara pakai:** pas error muncul, jangan langsung ngoding ngawur. **Baca pesan error-nya dulu**, cocokin sama tabel di Bagian 1, lalu lompat ke penjelasan detail di Bagian 2. Tarik napas. Kita beresin. 🧰

---

## BAGIAN 0 — 3 MANTRA PERTOLONGAN PERTAMA

Sebelum ngecek apa pun, pastikan 3 hal ini dulu. Ini nyelesaiin mayoritas masalah:

1. **Server Laravel hidup?** → Terminal tempat `php artisan serve` masih jalan? Kalau ketutup, buka lagi.
2. **MySQL/ServBay nyala?** → Buka app ServBay, pastikan service **MySQL running**.
3. **Mode yang bener?**
   - Lagi **ngoding** → `npm run dev` harus hidup (terminal kedua).
   - Mau **presentasi/demo** → jalanin **`npm run build`** dulu, lalu cukup `php artisan serve` (nggak butuh `npm run dev`).

Kalau tiga ini udah beres tapi masih error, lanjut ke tabel. 👇

**Terminal yang ideal pas presentasi (2 terminal):**

```
Terminal 1:  php artisan serve          → http://127.0.0.1:8000
Terminal 2:  (opsional) npm run dev     → kalau lagi mode ngoding
```

Atau mode produksi (cuma 1 terminal): `npm run build` sekali, lalu `php artisan serve`.

---

## BAGIAN 1 — TABEL P3K UTAMA

Cari gejalanya, ikutin solusinya. Kolom solusi sengaja diringkas; versi lengkapnya ada di Bagian 2.

| Gejala Error | Penyebab | Langkah Solusi |
| --- | --- | --- |
| **"Vite manifest not found at: .../public/build/manifest.json"** — React blank putih, cuma tulisan error | `@vite(...)` di `app.blade.php` nyari file build, tapi `public/build/` belum ada / belum di-build | 1) `npm install` 2) `npm run build` 3) refresh browser. Atau jalanin `npm run dev` di terminal kedua |
| **"SQLSTATE[HY000] [1045] Access denied for user 'arenahub'@'localhost'"** | Username/password database di `.env` salah, atau user MySQL belum dibuat, atau MySQL mati | 1) Buka `.env` baris **23–28**, cocokin `DB_USERNAME`/`DB_PASSWORD` 2) Pastikan user ada di MySQL/ServBay 3) `php artisan config:clear` 4) restart `php artisan serve` |
| **"Connection refused"** (biasanya `SQLSTATE[HY000] [2002]` atau Axios `net::ERR_CONNECTION_REFUSED`) | Server Laravel mati, atau MySQL mati, atau port bentrok/salah | 1) Pastikan `php artisan serve` **masih jalan** 2) Nyalain MySQL/ServBay 3) Cek port (`--port=8080`) 4) Pastikan React nembak ke host/port yang bener |
| **Error CORS** ("blocked by CORS policy", "No 'Access-Control-Allow-Origin'") | Frontend & backend beda origin (mis. React di `:5173` nembak langsung ke `:8000`), atau config CORS ngunci | 1) Pakai `baseURL: "/api"` (relatif) → **sudah benar di `utils/api.js`** 2) Cek `config/cors.php` (`paths: ['api/*']`, `allowed_origins: ['*']`) 3) `php artisan config:clear` 4) Jangan pakai URL absolut ke `:8000` dari dev server |
| **Klik tombol/menu Navbar tapi halaman nggak berubah / blank** | Route salah di `App.jsx`, komponen error saat render, atau tombol nunjuk ke path yang nggak ada | 1) F12 → **Console** (liat error merah) 2) F12 → **Network** (liat status 404/500) 3) Cek `<Route>` di `App.jsx` 4) Cek `to="..."` di `Navbar.jsx` |
| **"500 Internal Server Error"** — halaman putih/error server | `Class not found`, syntax error PHP, `.env`/`APP_KEY` hilang, cache config basi, atau bug di controller | 1) Buka `storage/logs/laravel.log` (cari baris terakhir) 2) `composer dump-autoload` 3) `php artisan config:clear` + `route:clear` 4) cek sintaks file yang barusan diedit |

---

## BAGIAN 2 — PENJELASAN DETAIL TIAP KASUS

### 2.1 "Vite Manifest Not Found" (React Blank Putih)

**Gejala lengkap biasanya kayak gini:**

```
Vite manifest not found at: C:\...\arenahub-backend\public\build\manifest.json
```

Terkadang ada tombol "Show Exception" / halaman putih.

**Kenapa?** Laravel nge-load React lewat directive `@vite('resources/js/main.jsx')` di `resources/views/app.blade.php` (baris **14–15**). Saat **nggak ada server Vite** (`npm run dev` mati) **dan nggak ada hasil build**, Laravel bingung: "manifest-nya mana?" Manifest itu `public/build/manifest.json`, file "daftar isi" hasil `npm run build` yang bilang file JS/CSS mana yang harus dimuat.

Jadi logikanya: `@vite` butuh **salah satu** dari dua ini:
- **Mode dev**: `npm run dev` hidup (manggil langsung ke server Vite), atau
- **Mode build**: ada file `public/build/manifest.json` (hasil `npm run build`).

Kalau dua-duanya nggak ada → manifest not found.

**Langkah solusi (pilih salah satu):**

**Opsi A — Buat build produksi (paling aman buat presentasi):**

```bash
npm install          # kalau belum pernah / node_modules hilang
npm run build        # ini yang bikin public/build/manifest.json
php artisan serve    # kalau belum jalan
```

Lalu **refresh browser** (Ctrl+Shift+R buat hard refresh).

**Opsi B — Mode dev (kalau mau ngoding + hot reload):**

```bash
# terminal 1
php artisan serve

# terminal 2 (biarkan hidup)
npm run dev
```

**Cek cepat:** pastikan file ini ada:

```
public/build/manifest.json
```

Kalau ada → `npm run build` berhasil. Kalau nggak ada → build belum jalan/gagal.

> **Jebakan presentasi:** kamu ngoding pakai `npm run dev`, terus terminal Vite ketutup pas mau demo → langsung "manifest not found". **Selalu `npm run build` sebelum naik panggung.** Satu terminal, aman.

---

### 2.2 "SQLSTATE[HY000] [1045] Access Denied"

**Gejala lengkap:**

```
SQLSTATE[HY000] [1045] Access denied for user 'arenahub'@'localhost' (using password: YES)
```

**Kenapa?** Laravel nyoba login ke MySQL pakai kredensial di `.env`, tapi MySQL bilang "ditolak". Penyebabnya salah satu:

1. `DB_USERNAME` / `DB_PASSWORD` di `.env` salah ketik atau beda sama user di MySQL.
2. User `arenahub` belum dibuat di MySQL.
3. Password di MySQL beneran beda.
4. MySQL-nya sendiri pakai user lain (mis. `root` tanpa password).

**Langkah solusi:**

**Langkah 1 — Cek `.env`** di root proyek, baris **23–28**:

```dotenv
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=arenahub_db
DB_USERNAME=arenahub
DB_PASSWORD=arenahub123
```

Pastikan `DB_DATABASE`, `DB_USERNAME`, `DB_PASSWORD` **persis sama** dengan yang ada di MySQL.

**Langkah 2 — Login ke MySQL buat cek / bikin user.** Lewat Adminer/ServBay, atau terminal:

```bash
mysql -u root -p
```

Di dalam MySQL, pastikan database & user ada:

```sql
SHOW DATABASES LIKE 'arenahub_db';
SELECT user, host FROM mysql.user WHERE user = 'arenahub';
```

Kalau **belum ada**, bikin:

```sql
CREATE DATABASE IF NOT EXISTS arenahub_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'arenahub'@'localhost' IDENTIFIED BY 'arenahub123';
GRANT ALL PRIVILEGES ON arenahub_db.* TO 'arenahub'@'localhost';
FLUSH PRIVILEGES;
```

**Langkah 3 — Kalau MySQL kamu cuma pakai `root` tanpa password**, tinggal sesuaikan `.env`:

```dotenv
DB_USERNAME=root
DB_PASSWORD=
```

**Langkah 4 — Bersihin cache config & restart server** (WAJIB, karena `php artisan serve` nyimpen config di awal):

```bash
php artisan config:clear
php artisan serve
```

**Uji koneksi tanpa buka browser:**

```bash
php artisan migrate:status
```

Kalau muncul daftar migrasi (bukan error 1045) → koneksi DB udah beres. ✅

> **Ingat:** setiap kali ubah `.env`, **selalu** `php artisan config:clear` + restart `php artisan serve`. Kalau nggak, perubahan nggak kebaca.

---

### 2.3 "Connection Refused" (Server Mati / Port Bentrok)

**Gejala:**

- Di terminal: `SQLSTATE[HY000] [2002] Connection refused` (ini **MySQL** yang nolak).
- Di browser/Console: `net::ERR_CONNECTION_REFUSED` atau `AxiosError: Network Error` (ini **Laravel** yang nggak nyambung).

Bedain dua ini penting:

| `ERR_CONNECTION_REFUSED` di browser | `[2002] Connection refused` di Laravel |
| --- | --- |
| **Server Laravel** (`php artisan serve`) mati / salah port | **MySQL** mati / salah host-port |
| Solusi: nyalain `php artisan serve` | Solusi: nyalain MySQL/ServBay |

**Langkah solusi:**

**Kalau Laravel mati:**

```bash
php artisan serve
# default: http://127.0.0.1:8000
```

Pastikan URL di browser = URL yang muncul di terminal. Kalau Laravel bilang port `8000`, ya buka `127.0.0.1:8000`.

**Kalau port 8000 bentrok** (`Failed to listen on 127.0.0.1:8000` / `address already in use`):

```bash
php artisan serve --port=8080
```

Lalu buka `http://127.0.0.1:8080`.

**Kalau MySQL mati:**

1. Buka **ServBay** → nyalain service **MySQL**.
2. Cek lagi: `php artisan migrate:status`.

**Kalau React nembak ke port salah:** pastikan `resources/js/utils/api.js` pakai **path relatif**:

```js
const api = axios.create({
  baseURL: "/api",   // ← BENAR: ikut origin yang lagi buka
  ...
});
```

Jangan diganti jadi `http://localhost:8000/api` dari dev server — nanti malah kena CORS/connection issue pas port beda.

---

### 2.4 Error CORS (React Diblokir Laravel)

**Gejala di Console (F12):**

```
Access to XMLHttpRequest at 'http://...' from origin 'http://localhost:5173'
has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header...
```

**Kenapa?** Browser punya aturan keamanan: halaman dari **origin A** nggak boleh sembarangan ambil data dari **origin B**, kecuali B ngizinin (CORS). "Origin" = kombinasi **protokol + host + port**. Jadi `localhost:5173` beda origin sama `localhost:8000`.

**Kabar baik:** proyek ini **udah dirancang anti-CORS**. Lihat `resources/js/utils/api.js` baris **4**:

```js
baseURL: "/api",
```

Karena `baseURL` **relatif** (`/api`, bukan URL penuh), request ikut origin halaman. Kalau halaman dibuka dari `:8000`, request ke `:8000/api` → **same-origin** → nggak kena CORS.

**Langkah solusi:**

**Langkah 1 — Pastikan `api.js` masih pakai `baseURL: "/api"`.** Jangan diganti ke URL absolut.

**Langkah 2 — Akses lewat Laravel, bukan Vite.** Buka `http://127.0.0.1:8000`, **bukan** `http://127.0.0.1:5173`. (Port 5173 itu server Vite internal; halaman utama tetap dibuka dari Laravel.)

**Langkah 3 — Cek `config/cors.php`.** Proyek ini isinya udah bener:

```php
'paths' => ['api/*'],
'allowed_methods' => ['*'],
'allowed_origins' => ['*'],      // ← lintas origin dibolehin
'allowed_headers' => ['*'],
```

Kalau `allowed_origins` kamu bukan `['*']`, ubah balikin ke `['*']` buat development:

```php
'allowed_origins' => ['*'],
```

**Langkah 4 — Bersihin cache config:**

```bash
php artisan config:clear
```

**Langkah 5 — Restart `php artisan serve`**, hard refresh browser (Ctrl+Shift+R).

---

### 2.5 Klik Navbar Nggak Respon / Halaman Blank (Cek di F12)

**Gejala:** Klik menu "Cari Turnamen" / "Tentang" di Navbar, tapi URL berubah & halaman kosong, atau nggak terjadi apa-apa.

**Kenapa bisa?** Ada 3 tersangka utama:

1. **Route belum terdaftar / salah** di `resources/js/App.jsx`.
2. **Komponen error** pas di-render (misal import salah, variabel `undefined`).
3. **Tombol nunjuk ke path yang nggak ada** (route nggak cocok → jatuh ke `PageNotFound`).

**Cara ngecek pakai Inspect Element (F12) — step by step:**

**Langkah 1 — Buka DevTools.** Tekan **F12** (atau Ctrl+Shift+I, atau klik kanan → **Inspect**).

**Langkah 2 — Buka tab Console.** Ini nyatet error JavaScript. Kalau ada tulisan **merah**, itu biang keroknya. Contoh yang sering:

```
Uncaught ReferenceError: X is not defined
Element type is invalid...
```

Error kayak gini = komponen gagal render → layar blank. Solusi: benerin file yang disebut di error.

**Langkah 3 — Buka tab Network.** Klik navbar lagi sambil Network kebuka, liat request barunya:

- Status **200** → request sukses (masalahnya di render, cek Console lagi).
- Status **404** → path/endpoint nggak ada (cek route).
- Status **500** → server error (lanjut ke Kasus 2.6).
- Status **CORS/blocked** → lanjut Kasus 2.4.

**Langkah 4 — Cek route di `App.jsx`.** Buka `resources/js/App.jsx`, pastikan path di Navbar **ada pasangannya** di `<Route>`. Contoh:

```jsx
<Route path="/tentang" element={<Tentang />} />
<Route path="/cari-turnamen" element={<CariTurnamen />} />
```

Kalau Navbar punya `to="/tentang"` tapi `<Route path="/tentang">` nggak ada → blank / 404.

**Langkah 5 — Cek `to="..."` di Navbar.** Buka `resources/js/components/Navbar.jsx`, array `publicLinks` **baris 20–24**:

```jsx
const publicLinks = [
  { to: "/", label: "Home", end: true },
  { to: "/cari-turnamen", label: "Cari Turnamen" },
  { to: "/tentang", label: "Tentang" },
];
```

Pastikan `to` di sini **sama persis** dengan `path` di `App.jsx`.

> Kalau nggak ketemu route-nya, React bakal nampilin `PageNotFound` (lihat `resources/js/lib/PageNotFound.jsx`) — halaman 404 versi ArenaHub dengan tulisan "Halaman Tidak Ditemukan". Itu tandanya route **salah/tidak ada**, bukan file rusak.

---

### 2.6 Error 500 Internal Server Error

**Gejala:** Browser nampilin "500 | Server Error", atau JSON balikin error 500. Sering disertai "Class not found", "Undefined", atau "syntax error".

**Penyebab umum + solusi cepat:**

**a) "Class not found"** (misal `Class "App\Modules\..." not found`)
→ File baru belum ke-autoload. Solusi:

```bash
composer dump-autoload
```

Pastikan juga **namespace** di file PHP cocok sama lokasi foldernya.

**b) Syntax error PHP** (kurang `;`, kurang `}`, typo)
→ Muncul kalau kamu baru edit file `.php` (controller/model/route). Solusi: cek baris yang disebut di pesan error, atau jalanin:

```bash
php -l app/Modules/Tournaments/Http/Controllers/TournamentApiController.php
```

(`php -l` = cek sintaks satu file tanpa jalanin.)

**c) `.env` hilang / `APP_KEY` kosong**
→ Error enkripsi. Solusi:

```bash
cp .env.example .env
php artisan key:generate
php artisan config:clear
```

**d) Cache config/route basi**
→ Sering setelah ubah `.env` atau `routes`. Solusi:

```bash
php artisan config:clear
php artisan route:clear
php artisan cache:clear
```

**e) Bug beneran di kode (misal variabel undefined di controller)**
→ Solusi paling akurat: **buka log**.

**Cara baca log (WAJIB bisa):**

```
storage/logs/laravel.log
```

Buka file itu, scroll ke **paling bawah**, cari **timestamp terbaru**. Pesan detail + lokasi file + nomor baris ada di situ. Baca dari atas error terakhir.

Kalau mau lihat detail error langsung di browser (khusus development), pastikan `.env`:

```dotenv
APP_DEBUG=true
```

Kalau `APP_DEBUG=false`, pesan detail disembunyiin — jangan dipakai pas ngoding.

> **Jebakan:** setelah ubah `.env`, lupa `config:clear` → Laravel masih pakai setelan lama → error 500 misterius. Hampir selalu solusinya: `config:clear` + restart server.

---

## BAGIAN 3 — `php artisan serve` Jalan, Tapi Terminal Nampilin "Tulisan Aneh"

Ini sering bikin panik padahal **normal**. Yuk bedain mana yang normal, mana yang error.

### 3.1 Tulisan yang NORMAL (cuek aja)

Saat `php artisan serve` sukses, biasanya muncul:

```
INFO  Server running on [http://127.0.0.1:8000].

  Press Ctrl+C to stop the server
```

Dan tiap kali ada request, muncul log kayak:

```
 2026-11-15 10:20:31 / ................ ~ 200
 2026-11-15 10:20:33 /api/tournaments ..... ~ 200
 2026-11-15 10:20:40 /build/assets/app.js  ~ 304
```

Itu **log request biasa**: URL, status (`200` = OK, `304` = cache, `404`/`500` = masalah). **Jangan panik** — itu bukan error, itu server lagi "ngomong" ngasih tau ada yang akses.

### 3.2 Tulisan yang BENERAN Error (perlu dicek)

| Tulisan di terminal | Arti | Solusi |
| --- | --- | --- |
| `Failed to listen on 127.0.0.1:8000 (reason: address already in use)` | Port 8000 udah dipakai | `php artisan serve --port=8080` |
| `could not find driver` | ekstensi PHP (`pdo_mysql`/`pdo_sqlite`) mati | aktifkan di `php.ini`, cek `php -m` |
| `No application encryption key has been specified` | `APP_KEY` kosong | `php artisan key:generate` |
| `SQLSTATE[HY000] ...` | masalah database (lihat Kasus 2.2 / 2.3) | cek `.env` + MySQL nyala |
| `Class "..." not found` | autoload belum update | `composer dump-autoload` |
| `Vite manifest not found` | build/dev belum jalan | `npm run build` atau `npm run dev` |
| PHP `Parse error: syntax error` | ada typo di file `.php` | betulin baris yang disebut |

**Yang harus dicek kalau terminal aneh:**

1. **Port bentrok?** → ganti `--port=8080`.
2. **PHP versi & ekstensi?** → `php --version`, `php -m` (harus ada `pdo_mysql`, `mbstring`, `openssl`, dll).
3. **`.env` bener?** → `APP_KEY` keisi, `DB_*` cocok.
4. **Database nyala?** → ServBay MySQL running.
5. **Log detail** → `storage/logs/laravel.log`.

> Aturan emas: **selama ada tulisan "Server running on [http://...]"** dan browser bisa buka, terminal itu sehat. Tulisan request yang lalu-lalang itu fitur, bukan bug.

---

## BAGIAN 4 — Buka `localhost:8000` Malah 404 / 500. Cek Apa?

Dua-duanya "halaman nggak muncul", tapi obatnya beda. Bedain dulu: **404 = "alamat nggak ketemu"**, **500 = "server error pas proses"**.

### 4.1 Kalau 404 Not Found

**Cek di `routes/web.php`.** File ini nentuin halaman mana yang ditampilin. Proyek ini pakai "catch-all" buat React:

```php
Route::get('/{any}', function () {
    return view('app');
})->where('any', '(?!api(?:/|$)|up$).*');
```

Artinya: **semua** path (kecuali `/api/*`) bakal nampilin view `app` (yang isinya React). Jadi:

- Kalau kamu buka `/tentang` dan **404**, berarti `routes/web.php` **nggak ke-load** atau ada route lain yang "nyerobot" duluan.
- **JANGAN** buka `/api` di browser tanpa endpoint — itu emang 404 (memang nggak ada route-nya). Yang bener: `/api/tournaments`.

**Cek juga:**

1. **`routes/web.php` masih ada & utuh?** Kalau kehapus/keubah, catch-all hilang → 404.
2. **Cache route basi?** → `php artisan route:clear` lalu restart.
3. **Liat daftar route:** `php artisan route:list` → pastiin ada baris catch-all `GET|HEAD  {any}` dan route `/api/tournaments`.
4. **`APP_URL` di `.env`** (baris 5): pastiin `APP_URL=http://localhost:8000` (atau `127.0.0.1:8000`) sesuai yang kamu buka.

> Kalau 404-nya **di dalam React** (bukan halaman Laravel), itu beda: React nampilin `PageNotFound`. Artinya route ada di `App.jsx`? Cek Bagian 2.5.

### 4.2 Kalau 500 Internal Server Error

500 = server "keselek". Urutan pengecekan:

**Langkah 1 — Nyalain detail error.** Pastikan `.env` (baris 4):

```dotenv
APP_DEBUG=true
```

Lalu refresh → sekarang browser nampilin pesan error detail + file + baris.

**Langkah 2 — Cek `.env` lengkap.** Minimal ini harus ada & bener:

```dotenv
APP_KEY=base64:...          # kalau kosong → php artisan key:generate
APP_URL=http://localhost:8000
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=arenahub_db
DB_USERNAME=arenahub
DB_PASSWORD=arenahub123
```

**Langkah 3 — Bersihin semua cache.**

```bash
php artisan config:clear
php artisan route:clear
php artisan cache:clear
```

**Langkah 4 — Baca log.** `storage/logs/laravel.log`, scroll paling bawah. Ini nunjukin **persis** file & baris yang error.

**Langkah 5 — Autoload & sintaks.**

```bash
composer dump-autoload
```

Kalau baru edit file `.php`, cek sintaksnya (`php -l namafile.php`).

**Langkah 6 — Cek `routes`.** Pastikan `routes/web.php` dan `routes/api.php` nggak ada typo (kurang `;`, nama class salah). Route yang nunjuk ke controller yang nggak ada → 500 "Class not found".

**Langkah 7 — Permission storage** (kalau pindah OS/pindah folder). Pastikan folder `storage/` dan `bootstrap/cache/` bisa ditulis. Di Windows biasanya aman, tapi kalau pindah dari Linux bisa jadi masalah.

---

## BAGIAN 5 — DAFTAR PERINTAH "PENYELAMAT"

Hafalin segelintir ini, kamu bisa beresin 80% error. Urutin dari atas.

```bash
# 1. Bersihin cache (paling sering ngebenerin)
php artisan config:clear
php artisan route:clear
php artisan cache:clear

# 2. Refresh autoload (kalau "Class not found")
composer dump-autoload

# 3. Build frontend (kalau "Vite manifest not found")
npm run build

# 4. Restart server (WAJIB setelah ubah .env)
php artisan serve

# 5. Cek koneksi DB
php artisan migrate:status

# 6. Liat semua route (buat debug 404)
php artisan route:list

# 7. Liat log error terakhir
# buka: storage/logs/laravel.log
```

**Combo "panic button"** kalau beneran kacau dan mau reset cepat (mode development):

```bash
php artisan config:clear
php artisan route:clear
php artisan cache:clear
composer dump-autoload
npm run build
php artisan serve
```

> ⚠️ **Jangan** asal `php artisan migrate:fresh` pas presentasi — itu **menghapus semua data**. Pakai itu cuma kalau memang mau reset data dummy (mis. `migrate:fresh --seed` buat balikin data contoh).

---

## BAGIAN 6 — CHECKLIST PRE-PRESENTASI (Jalanin 5 Menit Sebelum Naik)

Centang satu-satu. Ini nyegah 90% drama.

- [ ] **ServBay nyala**, service **MySQL running**.
- [ ] **`npm run build`** udah dijalanin (ada `public/build/manifest.json`).
- [ ] **`php artisan serve`** jalan, terminal nampilin `Server running on [http://127.0.0.1:8000]`.
- [ ] Buka **`http://127.0.0.1:8000`** → Home muncul, **kartu turnamen tampil** (berarti DB + API + frontend nyambung).
- [ ] Klik **Navbar** (Home, Cari Turnamen, Tentang) → semua pindah halaman mulus.
- [ ] Coba **filter/pencarian** di halaman Cari Turnamen → hasil berubah.
- [ ] Buka **F12 → Console** → **nggak ada error merah**.
- [ ] Kalau sempat: `php artisan config:clear` biar setelan fresh.
- [ ] **Git commit** kondisi terakhir (biar bisa `git restore` kalau ada yang kehapus pas demo).

Kalau semua centang → tinggal pede. 🔥

---

## BAGIAN 7 — PESAN TERAKHIR (Biar Mental Kuat)

- **Error = informasi, bukan bencana.** Pesannya selalu bilang masalahnya di mana. Baca pelan-pelan.
- **Urutan debug universal:** (1) baca error → (2) cek console/terminal → (3) buka log → (4) `config:clear` + restart → (5) baru ngubek kode.
- **90% error presentasi** = server belum nyala, DB belum nyala, atau lupa `npm run build`. Tiga ini dulu.
- **Jangan ngoding panik di depan dosen.** Kalau mentok: tenang, jelasin "ini masalah konfigurasi environment", jalanin `config:clear` + `npm run build` + restart. Sering langsung beres.
- Kalau beneran nggak ketemu: `storage/logs/laravel.log` adalah sahabat terbaikmu. Scroll ke bawah, baca error terakhir.

Selamat presentasi. Kamu udah pegang peta lengkapnya. Kalau ada yang error, tinggal balik ke README ini. 💪
