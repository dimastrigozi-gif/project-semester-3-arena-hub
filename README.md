# ArenaHub Backend

Backend untuk aplikasi ArenaHub, dipakai untuk mengelola data turnamen game (Mobile Legends, Free Fire, eFootball, Point Blank). Dibuat dengan Laravel sebagai API dan React (Vite) untuk tampilannya.

## Teknologi

- Laravel 13 + PHP 8.3
- SQLite (bawaan, bisa diganti lewat `.env`)
- React 18 + Vite + Tailwind CSS

## Cara Menjalankan

```bash
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate --seed
npm install
npm run build
php artisan serve
```

Kalau mau mode development frontend, jalankan `npm run dev` di terminal terpisah.

## Endpoint API

| Method | URL | Keterangan |
| --- | --- | --- |
| GET | `/api/tournaments` | Ambil semua turnamen |
| GET | `/api/tournaments/{id}` | Detail satu turnamen |
| POST | `/api/tournaments` | Tambah turnamen baru |
| POST | `/api/tournaments/{id}/register` | Daftarkan tim ke turnamen |

## Struktur Singkat

- `app/Modules/Tournaments` - model dan controller turnamen
- `routes/api.php` - daftar endpoint API
- `database/migrations` - tabel turnamen dan tim
- `database/seeders` - data contoh turnamen
- `resources/js` - halaman React

## Catatan

Data contoh turnamen bisa diisi ulang dengan `php artisan db:seed --class=TournamentSeeder`.
