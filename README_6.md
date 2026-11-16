# README_6 — Modul Praktikum: Ngecek & Ngoprek Kode ArenaHub

Selamat datang di modul praktikum. Ini bukan teori — ini **latihan tangan**. Tujuannya biar kamu **beneran paham alur VS Code**: buka file mana, cari baris berapa, ubah apa, kesalahan muncul gimana, dan cara balikinnya.

Anggap kamu murid yang mau **ujian praktik**. Baca sambil langsung buka laptop, jangan cuma dibaca doang. Praktik > hafalan. 🔧

---

## TUJUAN PRAKTIKUM

Setelah modul ini, kamu bisa:

1. **Ubah teks** di halaman React & di database MySQL, lalu lihat perubahannya.
2. **Ubah desain** (warna tombol) pakai Tailwind CSS.
3. **Sengaja bikin error** di Controller, baca error-nya, lalu **balikin** kayak semula.
4. **Ngecek error** pakai Inspect Element (F12) → Console & Network.
5. **Cari file cepat** di VS Code (`Ctrl+P`) dan **baca error di terminal** dengan benar.

---

## ALAT & BAHAN (Persiapan Wajib)

Sebelum mulai, siapin ini. Kalau nggak, praktikum bakal ngambek. 😅

1. **Buka proyek di VS Code:**

   ```bash
   code C:\Users\ASUS\OneDrive\Documents\arenahub-backend
   ```

2. **Nyalain ServBay** + pastikan **MySQL running**.

3. **Buka 2 terminal** di VS Code (`Ctrl + \`` atau menu Terminal → New Terminal):

   ```bash
   # Terminal 1 — backend Laravel
   php artisan serve
   # → http://127.0.0.1:8000

   # Terminal 2 — frontend Vite (biar perubahan langsung kelihatan)
   npm run dev
   ```

   > **Kenapa dua-duanya?** `php artisan serve` buat Laravel (API + halaman), `npm run dev` buat React (hot reload). Kalau cuma mau lihat hasil build, cukup `php artisan serve` (tapi harus `npm run build` dulu). Detailnya di README_2.

4. **Buka browser** ke `http://127.0.0.1:8000`.

5. **Buka DevTools:** tekan **F12** (atau klik kanan → Inspect).

> **Penting bedain 2 mode (jangan ketuker):**
> - **Mode ngoding (dev):** `php artisan serve` + `npm run dev` hidup. Perubahan `.jsx` langsung muncul (hot reload) — cukup **save**, browser update sendiri.
> - **Mode build/produksi:** `npm run build` sekali, lalu `php artisan serve` aja. Perubahan `.jsx` **butuh `npm run build` ulang** biar kelihatan.
>
> Di praktikum ini kita pakai **mode dev** biar cepat.

---

## PRAKTIKUM 1 — Ubah Teks (Test Visual)

Kita bakal ubah teks di dua tempat: **di React (tampilan)** dan **di database (data)**. Ini penting biar kamu ngerti bedanya "teks statis di kode" vs "teks dari database".

### 1A. Ubah Judul Halaman "Tentang" (di React)

**Tujuan:** ubah teks judul jadi **"Tentang Kami"**.

**Langkah 1 — Buka file yang benar.**

Di VS Code, buka file:

```
resources/js/pages/Tentang.jsx
```

Cara cepat: tekan **`Ctrl + P`**, ketik `Tentang`, pilih `Tentang.jsx`, Enter.

**Langkah 2 — Cari barisnya.**

Ada di **baris 7**:

```jsx
7: <h1 className="h1 mb-3">Tentang ArenaHub</h1>
```

**Langkah 3 — Ubah teksnya.**

**SEBELUM (baris 7):**

```jsx
<h1 className="h1 mb-3">Tentang ArenaHub</h1>
```

**SESUDAH:**

```jsx
<h1 className="h1 mb-3">Tentang Kami</h1>
```

> Cuma ganti teks di antara `>` dan `</h1>`. **Jangan sentuh** `className="h1 mb-3"` — itu styling.

**Langkah 4 — Save & lihat hasilnya.**

- Tekan **`Ctrl + S`** (Save).
- Lihat browser. Karena `npm run dev` jalan, perubahan **langsung muncul** dalam sekejap (hot reload).
- Kalau **nggak berubah**: refresh manual (**F5** atau `Ctrl + R`). Kalau masih nggak, berarti `npm run dev` mati / kamu di mode build → lihat catatan di bawah.

**Langkah 5 (opsional) — Ubah juga label di Navbar.**

Biar konsisten, ubah menu Navbar juga. File:

```
resources/js/components/Navbar.jsx
```

**Baris 23**:

```jsx
// SEBELUM
{ to: "/tentang", label: "Tentang" },

// SESUDAH
{ to: "/tentang", label: "Tentang Kami" },
```

Save → Navbar langsung berubah.

> **Catatan mode build:** kalau kamu **tidak** pakai `npm run dev`, perubahan `.jsx` **nggak** akan muncul sampai kamu `npm run build` ulang. Itu karena browser baca file hasil build di `public/build/`, bukan file sumber. Jadi: ngoding → dev; mau lihat hasil final → build.

---

### 1B. Ubah Judul Turnamen di Database MySQL (di Adminer/phpMyAdmin)

Sekarang beda kasus: ini **data dari database**, bukan teks statis. Perubahannya **nggak di file kode**, tapi di tabel database.

**Tujuan:** ubah judul turnamen pertama dari *"Poliwangi Mobile Legends Championship"* jadi, misalnya, *"ArenaHub MLBB Open 2026"*.

**Langkah 1 — Buka Adminer/phpMyAdmin (atau panel Database ServBay).**

Login pakai kredensial dari `.env` (baris 23–28):

- Server/Host: `127.0.0.1`
- Port: `3306`
- Username: `arenahub`
- Password: `arenahub123`
- Database: `arenahub_db`

**Langkah 2 — Buka tabel `tournaments`.**

Klik database `arenahub_db` → tabel `tournaments`. Kamu bakal lihat 4 baris (data dari seeder). Baris pertama (id = 1) judulnya `Poliwangi Mobile Legends Championship`.

**Langkah 3 — Ubah datanya. Ada 2 cara:**

**Cara A — lewat UI (klik-klik):**

1. Klik **Edit** di baris `id = 1`.
2. Di kolom `title`, ganti isinya jadi `ArenaHub MLBB Open 2026`.
3. Klik **Save**.

**Cara B — lewat SQL (lebih cepat & lebih "IT"):**

Klik tab **SQL**, lalu jalankan:

```sql
UPDATE tournaments
SET title = 'ArenaHub MLBB Open 2026'
WHERE id = 1;
```

Klik **Execute / Run**.

**Langkah 4 — Lihat perubahannya di website.**

Balik ke browser di `http://127.0.0.1:8000` (Home) → **refresh (F5)**. Data di-fetch ulang dari API saat halaman dimuat, jadi **wajib refresh** biar perubahan kelihatan. Sekarang kartu turnamen pertama judulnya udah berubah. 🎉

> **Kenapa harus refresh, bukan otomatis?** Karena React ambil data sekali saat halaman dimuat (`useEffect` di `Home.jsx` baris 30–32). Ubah database nggak "nutul" React. Refresh = minta data baru.

> **Balikin ke semula (kalau perlu):**
> ```sql
> UPDATE tournaments
> SET title = 'Poliwangi Mobile Legends Championship'
> WHERE id = 1;
> ```

**Pelajaran penting dari Praktikum 1:**
- Teks di `.jsx` = **tampilan** (ubah file → save → muncul).
- Teks di database = **data** (ubah tabel → refresh → muncul).
- Dua-duanya bisa muncul sebagai teks di layar, tapi **sumbernya beda**. Ini yang sering ditanya dosen!

---

## PRAKTIKUM 2 — Ubah Desain (Test Tailwind)

**Tujuan:** ubah warna tombol **"Cari Turnamen"** di halaman Home dari **cyan** jadi **merah**.

**Langkah 1 — Buka file Home.**

```
resources/js/pages/Home.jsx
```

Cara cepat: **`Ctrl + P`** → ketik `Home` → Enter.

**Langkah 2 — Cari tombol "Cari Turnamen".**

Ada di **baris 57–62**. Fokus ke **baris 59** (tempat `className`):

```jsx
57: <Link
58:   to="/cari-turnamen"
59:   className="inline-flex items-center justify-center gap-2 rounded-md bg-arena-cyan px-6 py-3 font-semibold text-arena-bg transition-all duration-300 hover:scale-105 hover:brightness-110"
60: >
61:   <Search className="h-5 w-5" /> Cari Turnamen
62: </Link>
```

**Langkah 3 — Ubah kelas Tailwind warna.**

Cari dua token di **baris 59**:
- `bg-arena-cyan` = warna latar (background) → ganti jadi `bg-arena-danger` (merah).
- `text-arena-bg` = warna teks → ganti jadi `text-white` (biar kebaca di atas merah).

**SEBELUM (baris 59):**

```jsx
className="inline-flex items-center justify-center gap-2 rounded-md bg-arena-cyan px-6 py-3 font-semibold text-arena-bg transition-all duration-300 hover:scale-105 hover:brightness-110"
```

**SESUDAH:**

```jsx
className="inline-flex items-center justify-center gap-2 rounded-md bg-arena-danger px-6 py-3 font-semibold text-white transition-all duration-300 hover:scale-105 hover:brightness-110"
```

**Langkah 4 — Save & lihat.**

`Ctrl + S` → tombol langsung jadi merah (mode dev). Kalau nggak, refresh.

**Langkah 5 (bonus) — Coba warna lain.**

Ganti `bg-arena-danger` dengan salah satu ini (dari `tailwind.config.js`):

| Kelas | Warna |
| --- | --- |
| `bg-arena-cyan` | cyan |
| `bg-arena-purple` | ungu |
| `bg-arena-success` | hijau |
| `bg-arena-warning` | kuning |
| `bg-arena-danger` | merah |

Atau pakai warna default Tailwind: `bg-red-500`, `bg-emerald-500`, `bg-sky-400`, dst. Coba-coba aja!

> **Balikin ke semula:** ganti `bg-arena-danger` → `bg-arena-cyan`, dan `text-white` → `text-arena-bg`.

**Pelajaran penting:** Tailwind itu **utility class**. Mau ubah warna? Tinggal ganti `bg-...`. Nggak perlu nulis CSS manual. Class-nya ada di `className="..."`.

---

## PRAKTIKUM 3 — Bikin Error Sengaja (Test Debugging)

Sekarang bagian paling seru (dan paling edukatif): **sengaja ngerusak kode**, lihat error-nya, lalu **balikin**. Tujuan: kamu nggak panik kalau nanti error beneran, karena udah pernah lihat "wujudnya".

> ⚠️ **Aturan Wajib:** commit dulu pakai Git, ATAU catat kode aslinya. Biar kalau lupa cara balikin, tinggal `git restore`. **Jangan praktik ini di kode yang belum di-save/commit.** 😅

### 3A. Rusak Controller → Muncul Error 500

**Langkah 1 — Buka controller.**

```
app/Modules/Tournaments/Http/Controllers/TournamentApiController.php
```

(cepat: `Ctrl + P` → ketik `TournamentApiController`)

**Langkah 2 — Pilih baris yang mau dirusak.**

Lihat **baris 15**:

```php
15: $dataTurnamen = Tournament::orderBy('start_date', 'asc')->get();
```

Perhatikan **titik koma `;`** di akhir. Kita bakal **hapus titik komanya**.

**Langkah 3 — Hapus titik koma (sengaja!).**

**SEBELUM (benar):**

```php
$dataTurnamen = Tournament::orderBy('start_date', 'asc')->get();
```

**SESUDAH (rusak — titik koma hilang):**

```php
$dataTurnamen = Tournament::orderBy('start_date', 'asc')->get()
```

Save (`Ctrl + S`).

**Langkah 4 — Lihat error-nya.**

Buka/refresh Home di browser. Karena Home manggil `/api/tournaments`, dan controller-nya sekarang **syntax error**, bakal muncul:

- Di **browser**: halaman nampilin **500 Server Error** (atau pesan "Gagal mengambil data turnamen" di Home, karena Axios nangkep error).
- Di **terminal `php artisan serve`**: muncul pesan kayak `PHP Parse error: syntax error, unexpected ... in ...TournamentApiController.php on line 15`.
- Di **`storage/logs/laravel.log`**: tercatat detail error-nya.

**Langkah 5 — Balikin (fix).**

Tambahkan lagi titik komanya di baris 15:

```php
$dataTurnamen = Tournament::orderBy('start_date', 'asc')->get();
```

Save. Refresh browser. Beres, kartu muncul lagi. ✅

> **Alternatif balikin via Git:**
> ```bash
> git restore app/Modules/Tournaments/Http/Controllers/TournamentApiController.php
> ```

**Kalau lupa lokasi error:** buka **`storage/logs/laravel.log`**, scroll ke **paling bawah**, cari baris `Parse error ... on line 15`. Itu nunjukin file & baris yang rusak.

### 3B. (Bonus) Rusak JSX → Layar Blank

Coba juga versi frontend. Buka `resources/js/pages/Tentang.jsx`, hapus satu kurung penutup atau tag penutup (misal hapus `</h1>` di baris 7), save. Hasilnya: **layar blank / error merah di browser**, dan terminal Vite bakal ngasih pesan "Failed to compile" / syntax error. Balikin dengan menambah lagi `</h1>`. Ini ngelatih bedain error **backend (500)** vs **frontend (blank)**.

### 3C. Cara Ngecek Error di Browser Pakai F12

**Langkah 1 — Buka DevTools.** Tekan **F12** (atau `Ctrl + Shift + I`).

**Langkah 2 — Buka tab Console.**
Di sini muncul error JavaScript & log. Error tampil **merah**. Klik panah `▸` buat lihat detail + lokasi file.

Contoh yang bakal kamu lihat saat controller rusak:

```
GET http://127.0.0.1:8000/api/tournaments 500 (Internal Server Error)
```

atau saat JSX rusak:

```
Uncaught SyntaxError: ...
```

**Langkah 3 — Buka tab Network (buat error API).**
Klik tab **Network** → refresh (F5) → cari request `tournaments`. Lihat kolom **Status**:

- `200` = OK ✅
- `404` = endpoint nggak ketemu
- `500` = server error (kode PHP rusak)
- `blocked/CORS` = masalah origin

Klik request itu → tab **Response** buat lihat pesan error dari Laravel.

**Langkah 4 — Baca & perbaiki.** Cocokin pesan error sama file & baris yang disebut, balikin kodenya, refresh.

**Pelajaran penting:**
- Error **backend/API** → kelihatan di **Network** (status 500) + terminal Laravel.
- Error **frontend/JSX** → kelihatan di **Console** (merah) + terminal Vite.

---

## PRAKTIKUM 4 — Alur Cek Visual Code

### 4A. Cari File Cepat di VS Code (`Ctrl + P`)

Jangan scroll folder manual (lama & bikin pusing). Pakai **Quick Open**.

**Langkah 1** — Tekan **`Ctrl + P`**. Muncul kotak pencarian di atas.

**Langkah 2** — Ketik **nama file** (bukan isi). Contoh:
- `Home` → muncul `Home.jsx`
- `TournamentApi` → muncul controller-nya
- `Tentang` → muncul `Tentang.jsx`

**Langkah 3** — Pilih dengan panah `↑ ↓`, tekan **Enter** buat buka.

**Shortcut pelengkap yang wajib hafal:**

| Shortcut | Fungsi |
| --- | --- |
| `Ctrl + P` | Cari & buka file cepat |
| `Ctrl + F` | Cari teks **di dalam file** yang lagi dibuka |
| `Ctrl + Shift + F` | Cari teks **di seluruh proyek** (misal cari `bg-arena-cyan`) |
| `Ctrl + G` | Lompat ke **baris** tertentu (ketik nomor baris) |
| `Ctrl + S` | Save |
| `Ctrl + \`` | Buka/tutup terminal |
| `Alt + ↑ / ↓` | Pindah baris kode |
| `Ctrl + Shift + K` | Hapus satu baris |

> **Trik praktikum:** mau nyari "di mana `api.get("/tournaments")` dipanggil?" → `Ctrl + Shift + F` → ketik `api.get`. Langsung ketemu semua lokasinya. Ini cara tercepat jawab pertanyaan dosen "ini dipanggil di mana?".

### 4B. Cara Ngecek Terminal (Baca Error dari Atas atau Bawah?)

Ini pertanyaan penting yang bikin banyak orang salah baca. Aturannya beda tergantung jenisnya:

**Prinsip umum:**
- **Perintah baru & output baru selalu muncul di BAWAH.** Jadi untuk melihat "apa yang barusan terjadi", lihat **paling bawah**.
- **Di dalam satu stack trace PHP**, baris **paling atas** biasanya berisi **penyebab utama** (misal `PHP Parse error: ... on line 15`), lalu di bawahnya tumpukan pemanggilan (stack).

**Praktisnya, baca kayak gini:**

1. **Cari baris yang nyebut nama file + nomor baris.** Itu kunci utamanya. Contoh:
   ```
   PHP Parse error: syntax error, unexpected end of file
   in C:\...\TournamentApiController.php on line 15
   ```
   → langsung tahu: file `TournamentApiController.php`, baris **15**.

2. **Kalau banyak baris (`stack trace`), fokus ke yang ada `file ... line ...` paling atas.** Itu sumber masalahnya; sisanya cuma "jalur" pemanggilan.

3. **Kalau terminal terus bertambah (log request), lihat blok paling bawah.** Blok terakhir = kejadian terbaru.

**Jenis-jenis pesan terminal & artinya:**

| Tampilan di terminal | Arti | Aksi |
| --- | --- | --- |
| `INFO Server running on [http://127.0.0.1:8000]` | Normal, server hidup | Cuek aja |
| `... /api/tournaments ... 200` | Request sukses | Normal |
| `... /api/tournaments ... 500` | Ada error server | Cek `laravel.log`, cari file+baris |
| `PHP Parse error ... on line X` | Syntax error PHP | Betulin baris X |
| `Class "..." not found` | Autoload/namespace salah | `composer dump-autoload` |
| `SQLSTATE[...]` | Masalah database | Cek `.env` + MySQL nyala |
| `Vite manifest not found` | Frontend belum di-build | `npm run build` |
| `Failed to listen ... address already in use` | Port bentrok | `php artisan serve --port=8080` |

> **Ingat:** tulisan request yang lalu-lalang (`/api/tournaments ~ 200`) itu **normal**, bukan error. Itu server lapor "ada yang akses". Baru **panik** kalau ada status `500` atau kata `error`/`exception`.

**Mulai baca dari bawah atau atas? Ini jawaban singkatnya:**

```
┌───────────────────────────────────────────────┐
│ request log terbaru            ← lihat di SINI│
│ (paling bawah = paling baru)                   │
│ ... /api/tournaments 500   ← ada masalah!       │
│ php artisan serve                              │
│  ↑ blok perintah terbaru ada di bawah          │
└───────────────────────────────────────────────┘

Stack trace PHP (mis. error padat):
┌───────────────────────────────────────────────┐
│ #0 ... TournamentApiController.php:15  ← awal │
│ #1 ...                                         │
│ #2 ...                                         │
│   ↑ penyebab biasanya di baris PALING ATAS     │
└───────────────────────────────────────────────┘
```

Intinya: **cari baris yang ada nama file + `line`-nya**. Itu jawabannya. Sisanya konteks.

---

## LEMBAR KERJA (Diisi Sambil Praktik)

| No | Praktikum | File | Baris | Berhasil? (✓/✗) |
| --- | --- | --- | --- | --- |
| 1A | Ubah judul Tentang jadi "Tentang Kami" | `resources/js/pages/Tentang.jsx` | 7 | ☐ |
| 1A | Ubah label Navbar Tentang | `resources/js/components/Navbar.jsx` | 23 | ☐ |
| 1B | Ubah judul turnamen id=1 di DB | Adminer → tabel `tournaments` | — | ☐ |
| 2 | Ubah warna tombol Cari Turnamen | `resources/js/pages/Home.jsx` | 59 | ☐ |
| 3A | Rusak controller (hapus `;`) → 500 | `.../TournamentApiController.php` | 15 | ☐ |
| 3A | Balikin titik koma → normal | sama | 15 | ☐ |
| 3C | Cek error di F12 Console & Network | browser DevTools | — | ☐ |
| 4A | Buka file pakai Ctrl+P | VS Code | — | ☐ |
| 4B | Baca error di terminal | — | — | ☐ |

---

## RINGKASAN PRAKTIKUM (Hafalin Sebelum Ujian)

- **Ubah teks di React** → buka file `.jsx`, cari baris, ganti teks, `Ctrl+S`. Mode dev = langsung muncul; mode build = `npm run build` dulu.
- **Ubah data di database** → Adminer/SQL, `UPDATE`, lalu **refresh** browser.
- **Ubah warna** → ganti class Tailwind `bg-...` di `className`.
- **Bikin error backend** → rusak sintaks PHP (mis. hapus `;`) → 500 → balikin `;`.
- **Bikin error frontend** → rusak JSX (kurung/tag) → layar blank → balikin tag.
- **Cek error API** → F12 → **Network** (status 500/404).
- **Cek error JS** → F12 → **Console** (merah).
- **Cari file** → `Ctrl+P`. **Cari teks se-proyek** → `Ctrl+Shift+F`. **Ke baris** → `Ctrl+G`.
- **Baca error terminal** → cari baris yang nyebut **nama file + line**; log terbaru di **bawah**.

---

## PENUTUP

Praktikum itu bukan soal sekali jadi. Justru dengan **sengaja bikin error** dan **berhasil balikin**, kamu paham alurnya beneran — bukan cuma hafal. Ulang praktikum ini 2–3 kali, dan kamu bakal pede waktu dosen minta "coba ubah ini", "coba bikin error", atau "ini error kenapa?".

Kalau macet, balik ke README_4 (P3K error). Kalau mau paham alur dalamnya, balik ke README_5 (lifecycle). Selamat praktik — semoga ujian praktiknya lancar! 🔥
