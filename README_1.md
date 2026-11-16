# README_1 — Membangun ArenaHub 100% Manual dari Nol

Dokumen ini khusus membahas **TITIK AWAL**: langkah pertama yang harus diketik di terminal, lalu urutan instalasi Laravel, setup `.env`, pembuatan database, sampai `php artisan serve` berhasil jalan. Semua dikerjakan **manual tanpa Base44**.

> Asumsi: kamu memakai Windows (PowerShell) seperti environment proyek ini. Perintah di Linux/macOS hampir sama, beda di cara menyalin file dan mengaktifkan Python/Composer bila perlu.

---

## 0. Prasyarat yang Harus Sudah Terpasang

Sebelum mengetik apa pun soal Laravel, pastikan empat alat ini sudah ada. Cek dari terminal:

```bash
php --version
composer --version
node --version
npm --version
```

Ketentuan versi untuk ArenaHub:

| Alat | Versi minimal | Catatan |
| --- | --- | --- |
| PHP | 8.3 | proyek butuh `php: ^8.3` |
| Composer | 2.x | dependency manager PHP |
| Node.js | 18+ | untuk React + Vite |
| npm | 9+ | ikut Node |

Cek juga ekstensi PHP yang wajib untuk Laravel:

```bash
php -m
```

Pastikan di daftar itu ada: `openssl`, `pdo`, `mbstring`, `tokenizer`, `xml`, `ctype`, `json`, `bcmath`, `fileinfo`, dan driver database (`pdo_mysql` atau `pdo_sqlite`).

Kalau `php --version` tidak dikenali, pasang PHP dulu (mis. lewat Laragon/XAMPP di Windows, atau `brew install php@8.3` di macOS). Composer bisa diambil dari https://getcomposer.org.

---

## 1. TITIK AWAL — Perintah Pertama di Terminal

Arahkan terminal ke folder tempat proyek akan dibuat, lalu ketik **perintah pertama** ini:

```bash
composer create-project laravel/laravel arenahub-backend
```

Inilah titik nolnya. Penjelasan per bagian:

- `composer create-project` — membuat proyek baru dari sebuah package, sekaligus menjalankan `composer install`.
- `laravel/laravel` — skeleton Laravel resmi (yang jadi isi `composer.json` proyek ini).
- `arenahub-backend` — nama folder tujuan. Ganti bila mau nama lain.

Setelah selesai, masuk ke folder hasil pembuatan:

```bash
cd arenahub-backend
```

> Kalau proyek ternyata sudah ada di folder ini (seperti kondisi sekarang), **lewati** `create-project`. Cukup pastikan berada di dalam folder proyek lalu jalankan `composer install` (lihat Langkah 3).

---

## 2. Verifikasi Isi Proyek (Sekilas)

Laravel yang baru dibuat sudah berisi kerangka standar. Struktur inti yang relevan:

```
arenahub-backend/
├── app/
├── bootstrap/
├── config/
├── database/
├── public/
├── resources/
├── routes/
├── storage/
├── .env.example
├── artisan
├── composer.json
└── package.json
```

File `artisan` adalah CLI Laravel. Semua perintah `php artisan ...` dijalankan dari root proyek ini.

---

## 3. Instal Dependency PHP (Composer)

Jika membuat proyek lewat `create-project`, langkah ini sudah otomatis. Kalau memakai repo yang sudah ada (seperti sekarang), jalankan:

```bash
composer install
```

Perintah ini membaca `composer.lock` dan memasang semua package PHP (Laravel framework `^13.17`, Tinker, Faker, PHPUnit, dll.) ke folder `vendor/`.

Kalau butuh menyegarkan autoload setelah menambah kelas baru:

```bash
composer dump-autoload
```

---

## 4. Setup File `.env`

Laravel butuh file `.env` sebagai konfigurasi environment. File ini **tidak** ikut ter-commit; yang ada di repo hanyalah `.env.example`.

Buat `.env` dari contoh:

**Windows PowerShell**

```powershell
Copy-Item .env.example .env
```

**Linux/macOS**

```bash
cp .env.example .env
```

Lalu buka `.env` dan sesuaikan nilai utama. Bagian penting:

```dotenv
APP_NAME=ArenaHub
APP_ENV=local
APP_KEY=
APP_DEBUG=true
APP_URL=http://localhost:8000
```

### Generate APP_KEY

`APP_KEY` dipakai untuk enkripsi. Selama kosong, aplikasi tidak bisa jalan. Isi otomatis dengan:

```bash
php artisan key:generate
```

Perintah ini menulis nilai `base64:...` ke `APP_KEY` di `.env`. Jangan bagikan nilai ini.

---

## 5. Pembuatan Database

Ada dua jalur. Pilih salah satu dan sesuaikan `.env`.

### Opsi A — MySQL (sesuai `.env.example` proyek ini)

`.env.example` bawaan memakai MySQL dengan database `arenahub_db`, user `arenahub`, password `arenahub123`.

Buat database dan user dari terminal MySQL:

```bash
mysql -u root -p
```

Di dalam prompt MySQL:

```sql
CREATE DATABASE arenahub_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'arenahub'@'localhost' IDENTIFIED BY 'arenahub123';
GRANT ALL PRIVILEGES ON arenahub_db.* TO 'arenahub'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

Pastikan `.env` berisi:

```dotenv
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=arenahub_db
DB_USERNAME=arenahub
DB_PASSWORD=arenahub123
```

### Opsi B — SQLite (paling cepat, tanpa server DB)

SQLite tidak perlu membuat server database. Cukup buat satu file lalu arahkan `.env` ke sana.

Buat file database:

**Windows PowerShell**

```powershell
New-Item -ItemType File -Path database/database.sqlite -Force
```

**Linux/macOS**

```bash
touch database/database.sqlite
```

Lalu ubah `.env`:

```dotenv
DB_CONNECTION=sqlite
# DB_DATABASE boleh dikosongkan; Laravel otomatis memakai database/database.sqlite
```

> Kalau `DB_DATABASE` diisi, gunakan path absolut, mis. `DB_DATABASE=C:/path/ke/arenahub-backend/database/database.sqlite`.

### Cek koneksi database

Setelah `.env` benar, uji koneksi dengan:

```bash
php artisan migrate:status
```

Kalau tidak error, koneksi database sudah oke.

---

## 6. Jalankan Migrasi (dan Seeder)

Migrasi membuat tabel-tabel (termasuk tabel turnamen & tim ArenaHub) sesuai file di `database/migrations`.

```bash
php artisan migrate
```

Ingin sekalian mengisi data contoh turnamen:

```bash
php artisan migrate --seed
```

Kalau hanya mau mengulang data contoh tanpa menghapus struktur tabel:

```bash
php artisan db:seed --class=TournamentSeeder
```

> Hati-hati: `php artisan migrate:fresh` akan **menghapus semua tabel** lalu membuatnya ulang. Hanya pakai saat yakin data boleh hilang.

---

## 7. Instal Dependency Frontend (React + Vite)

ArenaHub memakai React 18 + Vite + Tailwind CSS untuk tampilan.

```bash
npm install
```

Build aset produksi ke folder `public/build`:

```bash
npm run build
```

Atau, untuk pengembangan dengan hot reload (jalankan di terminal terpisah, biarkan hidup):

```bash
npm run dev
```

---

## 8. Jalankan Server Selama Pengembangan

Setelah dependency PHP, `.env`, database, migrasi, dan aset beres, nyalakan server:

```bash
php artisan serve
```

Secara default Laravel berjalan di:

```
http://127.0.0.1:8000
```

Buka URL itu di browser. Untuk ArenaHub, API tersedia di bawah `/api`, misalnya `http://127.0.0.1:8000/api/tournaments`.

Ingin ganti port:

```bash
php artisan serve --port=8080
```

---

## 9. Ringkasan Urutan Perintah (Copy-Paste)

Untuk proyek **baru dari nol**:

```bash
composer create-project laravel/laravel arenahub-backend
cd arenahub-backend
cp .env.example .env
php artisan key:generate
# buat database (MySQL: CREATE DATABASE ... / SQLite: touch database/database.sqlite)
# sesuaikan DB_* di .env
php artisan migrate --seed
npm install
npm run build
php artisan serve
```

Untuk repo yang **sudah ada** (kondisi proyek ini):

```bash
composer install
cp .env.example .env
php artisan key:generate
# buat database & sesuaikan DB_* di .env
php artisan migrate --seed
npm install
npm run build
php artisan serve
```

Kalau ingin mode development frontend, jalankan `npm run dev` di terminal terpisah sambil `php artisan serve` tetap hidup.

---

## 10. Troubleshooting Cepat

| Gejala | Penyebab umum | Solusi |
| --- | --- | --- |
| `No application encryption key` | `APP_KEY` kosong | `php artisan key:generate` |
| `could not find driver` | ekstensi `pdo_mysql`/`pdo_sqlite` mati | aktifkan di `php.ini`, lalu cek `php -m` |
| `Access denied for user` | kredensial DB salah | cocokkan `DB_USERNAME`/`DB_PASSWORD` di `.env` |
| Halaman tampil tanpa style | aset belum di-build | `npm install` lalu `npm run build` |
| Port 8000 dipakai | server lain jalan | `php artisan serve --port=8080` |
| Konfigurasi `.env` tidak kebaca | cache config | `php artisan config:clear` |
