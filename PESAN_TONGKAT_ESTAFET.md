# PESAN TONGKAT ESTAFET — ArenaHub

> Dokumen ini ditulis oleh "senior" yang menyerahkan proyek ke kamu.
> Anggap ini catatan serah-terima shift: apa yang sudah jadi, apa yang belum,
> dan urutan kerja yang paling aman supaya kamu tidak bingung di hari pertama.

---

## 1. KONDISI SAAT INI (APA YANG SUDAH JALAN)

### 1.1 Stack yang dipakai

| Lapisan | Teknologi | Keterangan |
| --- | --- | --- |
| Backend | Laravel 13.42 / PHP 8.4 | Struktur modular sederhana di `app/Modules` |
| Database | MySQL (`arenahub_db`) | Diatur di `.env`; `config/database.php` masih punya fallback SQLite |
| Frontend | React 18 + Vite + Tailwind | Semua halaman ada di `resources/js` |
| HTTP Client | Axios | Instance global di `resources/js/utils/api.js` |
| Auth | BELUM ADA (masih palsu) | `AuthContext.jsx` hanya menyimpan user demo di `sessionStorage` |

Perintah menjalankan yang benar untuk kondisi sekarang:

```powershell
# dari root project
composer install
npm install
php artisan serve
```

Kalau mau mode development frontend:

```powershell
npm run dev
```

Catatan: `npm run dev` membuka Vite di port 5173 dan **belum ada proxy** ke Laravel.
Karena `api.js` memakai `baseURL: "/api"`, cara paling gampang untuk sekarang adalah
`npm run build` lalu buka lewat `php artisan serve` (satu origin). Kalau tetap mau
pakai port 5173, tambahkan proxy di `vite.config.js` (contoh ada di FASE 5).

### 1.2 Frontend React — UI sudah siap

Semua halaman utama sudah ada dan bisa dibuka:

- `Home`, `Tentang`, `CariTurnamen`
- `DetailTurnamen`, `Pendaftaran`, `Pembayaran`
- `TurnamenSaya`, `DetailTurnamenSaya`, `Jadwal`, `Pertandingan`
- `SignIn`, `SignUp`, `Profil`
- Area organizer: `Dashboard`, `BuatTurnamen`, `TurnamenSaya`, `DetailTurnamen`

Routing ada di `resources/js/App.jsx`. Semua halaman dibungkus `Layout`, `AuthProvider`,
dan `QueryClientProvider`.

### 1.3 Database — tabel dasar sudah ada

Migration sudah pernah dijalankan (`php artisan migrate:status` menunjukkan semua `Ran`):

- `users`, `password_reset_tokens`, `sessions` (bawaan Laravel)
- `cache`, `jobs` (bawaan Laravel)
- `tournaments` — `id, title, game, quota, price, start_date, timestamps`
- `teams` — baru `id, name, timestamps` (BELUM punya `tournament_id`)

**PENTING:** isi database saat ini masih kosong.

```
tournaments = 0
teams       = 0
users       = 0
```

Seeder contoh sudah disiapkan di `database/seeders/TournamentSeeder.php`, tapi belum
dijalankan. Jalankan dulu:

```powershell
php artisan db:seed --class=TournamentSeeder
```

Kalau ingin mulai bersih total (hati-hati, ini menghapus data):

```powershell
php artisan migrate:fresh --seed
```

### 1.4 API GET — sudah jalan

File route: `routes/api.php`

| Method | URL | Controller | Status |
| --- | --- | --- | --- |
| GET | `/api/tournaments` | `TournamentApiController@index` | JALAN |
| GET | `/api/tournaments/{id}` | `TournamentApiController@show` | JALAN |
| POST | `/api/tournaments` | `TournamentApiController@store` | KOSONG (belum diisi) |
| POST | `/api/tournaments/{id}/register` | `TournamentApiController@register` | KOSONG (belum diisi) |

`index()` mengurutkan turnamen dari `start_date` paling dekat, lalu mengembalikan:

```json
{
  "message": "Daftar turnamen berhasil diambil",
  "data": [ { "id": 1, "title": "...", "game": "mlbb", "quota": 32 } ]
}
```

`show()` mengembalikan format yang sama, dan `404` kalau ID tidak ada.

### 1.5 Integrasi Axios — sudah jalan untuk GET

`resources/js/utils/api.js`:

```js
import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  headers: {
    Accept: "application/json",
  },
});

export default api;
```

Halaman yang sudah memanggil API:

- `Home.jsx`, `CariTurnamen.jsx`, `Jadwal.jsx`
- `DetailTurnamen.jsx`, `Pendaftaran.jsx`, `Pembayaran.jsx`
- `TurnamenSaya.jsx`, `DetailTurnamenSaya.jsx`
- `organizer/Dashboard.jsx`, `organizer/TurnamenSaya.jsx`, `organizer/DetailTurnamen.jsx`

Semua memakai pola:

```js
const response = await api.get("/tournaments");
const data = response.data.data || [];
```

Lalu data dirapikan oleh `rapikanTurnamen()` di `resources/js/utils/turnamen.js`
supaya nama field dari Laravel (`title`, `quota`, `price`, `start_date`) cocok dengan
yang dipakai komponen React (`name`, `slots`, `fee`, `date`).

### 1.6 Yang sudah setengah jalan (jangan bingung)

- **Tombol "Buat Turnamen"** di `organizer/BuatTurnamen.jsx` sudah memanggil
  `api.post("/tournaments", ...)` pada baris 32–51. Tapi karena `store()` masih kosong,
  request tidak menyimpan apa pun.
- **Tombol "Daftar Sekarang"** di `DetailTurnamen.jsx` (baris 70) hanya melakukan
  navigasi ke `/pendaftaran/:id`. Belum ada request POST.
- **Form Pendaftaran** (`Pendaftaran.jsx`) baru mengumpulkan data di state React.
  Tombol "Lanjut ke Pembayaran" (baris 141) langsung pindah halaman tanpa menyimpan tim.
- **Pembayaran** (`Pembayaran.jsx`) masih simulasi. Tombol "Saya Sudah Bayar"
  (baris 154–156) hanya mengubah state `done` menjadi `true`.
- **Login** (`SignIn.jsx`) masih tiruan. Role ditentukan dari email yang mengandung
  kata `"organizer"`. Tidak ada password check, tidak ada token.
- **Repo Git belum diinisialisasi.** Folder ini bukan repo Git. Sangat disarankan
  `git init` sebelum mulai ngoding (lihat TIPS EMAS).

### 1.7 Hasil sapu bersih jejak AI

- File konfigurasi agent `opencode.json` sudah dihapus. File itu juga berisi API key,
  jadi menghapusnya sekaligus membuang rahasia dari folder proyek.
- Tidak ada folder `.agents`, `.claude`, `.kiro`, `.codex`, `.cursor`, atau `.opencode`
  di root proyek.
- Tidak ada package AI di `composer.json` maupun `package.json`.
- Komentar di kode sudah memakai bahasa Indonesia santai. Penanda tugas yang dulu
  berbunyi seperti instruksi kelas sudah diganti jadi catatan kerja biasa.
- Catatan: folder `vendor/laravel/framework/.agents` adalah milik package Laravel,
  jangan diapa-apakan.

---

## 2. ROADMAP MANUAL (LANGKAH DEMI LANGKAH)

Kerjakan berurutan. Jangan lompat ke FASE 4 sebelum FASE 1–3 beres.
Setiap fase selesai, langsung commit.

---

### FASE 1 — PERBAIKI DATABASE

Tujuan: tabel `teams` harus tahu dia milik turnamen mana, plus simpan data kapten
dan status pendaftaran.

#### Langkah 1.1 — Buat migration baru

Jangan mengedit migration lama yang sudah jalan. Buat migration tambahan:

```powershell
php artisan make:migration add_tournament_id_to_teams_table --table=teams
```

Buka file baru di `database/migrations/` (nama depannya tanggal hari ini), lalu isi:

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('teams', function (Blueprint $table) {
            $table->foreignId('tournament_id')
                ->after('id')
                ->constrained('tournaments')
                ->cascadeOnDelete();

            $table->string('captain_name')->after('name');
            $table->string('captain_game_id')->after('captain_name');
            $table->text('members')->nullable()->after('captain_game_id');
            $table->string('status')->default('pending')->after('members');

            $table->index(['tournament_id', 'status']);
        });
    }

    public function down(): void
    {
        Schema::table('teams', function (Blueprint $table) {
            $table->dropForeign(['tournament_id']);
            $table->dropIndex(['tournament_id', 'status']);
            $table->dropColumn([
                'tournament_id',
                'captain_name',
                'captain_game_id',
                'members',
                'status',
            ]);
        });
    }
};
```

> Catatan MySQL vs SQLite: `after()` dan `dropColumn` multiple didukung MySQL.
> Kalau suatu saat pindah ke SQLite, `after()` diabaikan dan `dropColumn` sebaiknya
> dipecah satu per satu. Untuk sekarang `.env` memakai MySQL, jadi aman.

#### Langkah 1.2 — Jalankan migration

```powershell
php artisan migrate
```

Kalau muncul error koneksi, cek MySQL sudah jalan dan database `arenahub_db` sudah
dibuat, lalu cek `.env`:

```
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=arenahub_db
DB_USERNAME=arenahub
DB_PASSWORD=arenahub123
```

#### Langkah 1.3 — Tambahkan relasi di model

`app/Modules/Tournaments/Models/Tournament.php` — tambahkan method:

```php
use Illuminate\Database\Eloquent\Relations\HasMany;

public function teams(): HasMany
{
    return $this->hasMany(Team::class);
}
```

`app/Modules/Tournaments/Models/Team.php` — tambahkan:

```php
use Illuminate\Database\Eloquent\Relations\BelongsTo;

public function tournament(): BelongsTo
{
    return $this->belongsTo(Tournament::class);
}
```

Lalu lengkapi `$fillable` milik `Team`:

```php
protected $fillable = [
    'tournament_id',
    'name',
    'captain_name',
    'captain_game_id',
    'members',
    'status',
];
```

#### Langkah 1.4 — (Opsional tapi disarankan) Lengkapi kolom turnamen

Form React mengirim/menyimpan `mode`, `location`, `description`, `rules`, `team_size`.
Kalau kamu mau data itu ikut tersimpan, buat migration lagi:

```powershell
php artisan make:migration add_detail_columns_to_tournaments_table --table=tournaments
```

Isi `up()`:

```php
Schema::table('tournaments', function (Blueprint $table) {
    $table->string('mode')->default('online')->after('game');
    $table->string('location')->nullable()->after('mode');
    $table->text('description')->nullable()->after('location');
    $table->text('rules')->nullable()->after('description');
    $table->unsignedTinyInteger('team_size')->default(5)->after('rules');
    $table->string('status')->default('upcoming')->after('team_size');
});
```

Tambahkan juga kolom-kolom itu ke `$fillable` dan `$casts` di `Tournament.php`.

#### Langkah 1.5 — Cek hasil

```powershell
php artisan migrate:status
php artisan db:table teams
php artisan db:table tournaments
```

`php artisan db:table` akan menampilkan struktur tabel. Pastikan `tournament_id`
ada di `teams`.

---

### FASE 2 — LENGKAPI BACKEND API (CRUD)

File yang disentuh: `app/Modules/Tournaments/Http/Controllers/TournamentApiController.php`.

Saat dokumen ini ditulis, posisi method:

- `store()` mulai sekitar **baris 42**
- `register()` mulai sekitar **baris 48**

Kalau baris bergeser setelah kamu edit, cari saja nama method-nya dengan Ctrl+F.

#### Langkah 2.1 — Tambahkan import

Di bagian atas file, setelah `use Illuminate\Http\Request;`:

```php
use App\Modules\Tournaments\Models\Team;
use Illuminate\Support\Facades\DB;
```

#### Langkah 2.2 — Isi method `store()` (Buat Turnamen)

Ganti isi `store()` menjadi:

```php
public function store(Request $request)
{
    // Validasi dulu, jangan percaya mentah-mentah data dari React
    $validated = $request->validate([
        'title' => ['required', 'string', 'max:120', 'unique:tournaments,title'],
        'game' => ['required', 'in:efootball,mlbb,freefire,pointblank'],
        'quota' => ['required', 'integer', 'min:2', 'max:512'],
        'price' => ['required', 'integer', 'min:0'],
        'start_date' => ['required', 'date', 'after_or_equal:today'],

        // opsional, hanya dipakai kalau kolomnya sudah kamu tambahkan di FASE 1
        'mode' => ['nullable', 'in:online,offline'],
        'location' => ['nullable', 'string', 'max:200'],
        'description' => ['nullable', 'string'],
        'rules' => ['nullable', 'string'],
        'team_size' => ['nullable', 'integer', 'min:1', 'max:10'],
    ]);

    $turnamen = Tournament::create($validated);

    return response()->json([
        'message' => 'Turnamen berhasil dibuat',
        'data' => $turnamen,
    ], 201);
}
```

Yang wajib kamu pahami:

- `validate()` otomatis membalas `422` dengan detail error kalau input salah.
- `unique:tournaments,title` mencegah judul turnamen dobel.
- `after_or_equal:today` mencegah membuat turnamen di tanggal yang sudah lewat.
- `201` adalah status HTTP yang benar untuk "data berhasil dibuat".

#### Langkah 2.3 — Isi method `register()` (Daftar Turnamen / anti-kuota jebol)

Ini bagian paling penting. Bayangkan 100 orang menekan "Daftar" di detik yang sama.
Kalau kamu hanya melakukan:

```php
$jumlah = Team::where('tournament_id', $id)->count();
if ($jumlah >= $turnamen->quota) { /* tolak */ }
Team::create([...]);
```

dua request bisa sama-sama membaca `$jumlah` yang masih di bawah kuota, lalu
dua-duanya menyimpan. Akibatnya kuota bisa jebol.

Solusinya: bungkus dalam `DB::transaction()` dan kunci baris turnamen dengan
`lockForUpdate()`. Baris yang dikunci akan membuat request lain menunggu sampai
transaksi pertama selesai.

Ganti isi `register()` menjadi:

```php
public function register(Request $request, $id)
{
    $validated = $request->validate([
        'name' => ['required', 'string', 'max:100'],
        'captain_name' => ['required', 'string', 'max:100'],
        'captain_game_id' => ['required', 'string', 'max:50'],
        'members' => ['nullable', 'string'],
    ]);

    try {
        $tim = DB::transaction(function () use ($id, $validated) {
            // Kunci baris turnamen sampai transaksi selesai.
            // Request lain yang mendaftar ke turnamen yang sama akan mengantre.
            $turnamen = Tournament::whereKey($id)->lockForUpdate()->firstOrFail();

            $terisi = Team::where('tournament_id', $turnamen->id)->count();

            if ($terisi >= $turnamen->quota) {
                throw new \RuntimeException('Kuota turnamen sudah penuh.');
            }

            // Cek nama tim dobel di turnamen yang sama
            $sudahAda = Team::where('tournament_id', $turnamen->id)
                ->where('name', $validated['name'])
                ->exists();

            if ($sudahAda) {
                throw new \RuntimeException('Nama tim sudah terdaftar di turnamen ini.');
            }

            return Team::create([
                'tournament_id' => $turnamen->id,
                ...$validated,
            ]);
        });

        return response()->json([
            'message' => 'Pendaftaran berhasil',
            'data' => $tim,
        ], 201);
    } catch (\RuntimeException $e) {
        return response()->json([
            'message' => $e->getMessage(),
        ], 422);
    } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
        return response()->json([
            'message' => 'Turnamen tidak ditemukan',
        ], 404);
    }
}
```

Urutan kerja `DB::transaction` + `lockForUpdate`:

1. Transaksi dimulai.
2. Baris turnamen dikunci (`SELECT ... FOR UPDATE`).
3. Hitung jumlah tim yang sudah terdaftar.
4. Kalau penuh, lempar exception → transaksi otomatis rollback.
5. Kalau masih ada slot, simpan tim.
6. Transaksi commit, kunci dilepas.
7. Request berikutnya baru boleh membaca dan menghitung ulang.

> **Penting:** `lockForUpdate()` hanya benar-benar mengunci di MySQL/PostgreSQL.
> Di SQLite, perintah ini diabaikan. Untuk produksi, tetap pakai MySQL seperti `.env`
> sekarang. Kalau nanti tes pakai SQLite, jangan mengandalkan lock ini.

#### Langkah 2.4 — (Opsional) Endpoint daftar peserta

Tambahkan method untuk organizer melihat peserta:

```php
public function teams($id)
{
    $turnamen = Tournament::with('teams')->find($id);

    if (!$turnamen) {
        return response()->json(['message' => 'Turnamen tidak ditemukan'], 404);
    }

    return response()->json([
        'message' => 'Daftar tim berhasil diambil',
        'data' => $turnamen->teams,
    ]);
}
```

Daftarkan route-nya di `routes/api.php`:

```php
Route::get('/tournaments/{id}/teams', [TournamentApiController::class, 'teams']);
```

#### Langkah 2.5 — Tes cepat tanpa Postman

```powershell
# Buat turnamen
Invoke-RestMethod -Method Post -Uri http://127.0.0.1:8000/api/tournaments `
  -ContentType "application/json" `
  -Body '{"title":"Test Cup","game":"mlbb","quota":4,"price":0,"start_date":"2026-12-01"}'

# Lihat daftar
Invoke-RestMethod -Uri http://127.0.0.1:8000/api/tournaments

# Daftar tim
Invoke-RestMethod -Method Post -Uri http://127.0.0.1:8000/api/tournaments/1/register `
  -ContentType "application/json" `
  -Body '{"name":"Tim Satu","captain_name":"Budi","captain_game_id":"BUDI01","members":"Andi - ANDI01\nCici - CICI01"}'
```

Coba daftar 5 kali dengan `quota: 4`. Pendaftaran ke-5 harus gagal dengan
`422` dan pesan "Kuota turnamen sudah penuh."

---

### FASE 3 — HUBUNGKAN FRONTEND KE API

#### 3.1 Tombol "Buat Turnamen" — sudah setengah jadi

File: `resources/js/pages/organizer/BuatTurnamen.jsx`
Fungsi: `handlePublish` mulai **baris 32**.

Saat ini yang dikirim hanya 5 field:

```js
await api.post("/tournaments", {
  title: form.name,
  game: form.game,
  quota: Number(form.slots),
  price: Number(form.fee),
  start_date: form.date,
});
```

Kalau kamu sudah menambah kolom detail di FASE 1, kirim juga:

```js
const payload = {
  title: form.name,
  game: form.game,
  quota: Number(form.slots),
  price: Number(form.fee),
  start_date: form.date,
  mode: form.mode,
  location: form.mode === "offline" ? form.location : null,
  description: form.description || null,
  rules: form.rules || null,
  team_size: 5,
};

await api.post("/tournaments", payload);
```

Perbaiki juga penanganan error supaya pesan validasi Laravel terlihat:

```js
} catch (err) {
  const pesan =
    err.response?.data?.message ||
    Object.values(err.response?.data?.errors || {}).flat().join(", ") ||
    "Pastikan backend Laravel sudah jalan.";

  toast({
    title: "Gagal menyimpan turnamen",
    description: pesan,
    variant: "destructive",
  });
}
```

#### 3.2 Tombol "Daftar" — DetailTurnamen

File: `resources/js/pages/DetailTurnamen.jsx`
Fungsi: `handleDaftar` sekitar **baris 70**.

Untuk sekarang fungsi ini sudah benar: kalau belum login, lempar ke
`/signin?redirect=/pendaftaran/:id`; kalau sudah login, ke `/pendaftaran/:id`.
Yang perlu diubah bukan tombol ini, tapi form pendaftarannya.

#### 3.3 Form Pendaftaran — kirim data tim ke API

File: `resources/js/pages/Pendaftaran.jsx`

Saat ini:
- `handleSubmitStep1` (baris 64–67) hanya pindah dari step 1 ke step 2.
- Tombol "Lanjut ke Pembayaran" (baris 140–145) langsung `navigate`.

Tambahkan state:

```js
const [menyimpan, setMenyimpan] = useState(false);
const [pesanError, setPesanError] = useState("");
```

Buat fungsi baru di dalam komponen:

```js
const kirimPendaftaran = async () => {
  setMenyimpan(true);
  setPesanError("");

  try {
    await api.post(`/tournaments/${t.id}/register`, {
      name: form.name,
      captain_name: isTeam ? form.captain : form.name,
      captain_game_id: form.gameId,
      members: isTeam ? form.members : null,
    });

    navigate(`/pembayaran/${t.id}`);
  } catch (err) {
    setPesanError(
      err.response?.data?.message ||
        "Pendaftaran gagal. Coba lagi atau hubungi panitia."
    );
  } finally {
    setMenyimpan(false);
  }
};
```

Ganti tombol di step 2:

```jsx
<button
  onClick={kirimPendaftaran}
  disabled={menyimpan}
  className="flex flex-1 items-center justify-center gap-2 rounded-md bg-arena-cyan px-4 py-3 font-semibold text-arena-bg transition hover:brightness-110 disabled:opacity-60"
>
  {menyimpan ? "Menyimpan..." : "Lanjut ke Pembayaran"}
  <ArrowRight className="h-4 w-4" />
</button>
```

Tampilkan error di atas tombol:

```jsx
{pesanError && (
  <p className="rounded-md border border-arena-danger/40 bg-arena-danger/10 p-3 text-sm text-arena-danger">
    {pesanError}
  </p>
)}
```

#### 3.4 Pembayaran

File: `resources/js/pages/Pembayaran.jsx`

Skenario paling rapi:

- **Opsi A (disarankan untuk tugas):** simpan tim saat klik "Lanjut ke Pembayaran"
  (seperti langkah 3.3). Halaman pembayaran cukup menampilkan simulasi, lalu tombol
  "Saya Sudah Bayar" mengubah status.
- **Opsi B:** simpan tim baru setelah pembayaran. Pindahkan pemanggilan
  `api.post(.../register)` ke tombol "Saya Sudah Bayar" (baris 154–156).
  Tapi kamu harus membawa data form dari `Pendaftaran` ke `Pembayaran`. Bisa lewat
  state router (`navigate(path, { state: { form } })`) atau `sessionStorage`.
  Opsi ini lebih ribet, jangan dipilih kalau baru belajar.

Kalau di masa depan mau update status pembayaran di backend, buat endpoint baru,
misalnya `PATCH /api/teams/{id}/payment`, dan tambahkan kolom `payment_status`
di tabel `teams`.

#### 3.5 Rapikan data peserta di TurnamenSaya

`TurnamenSaya.jsx` (baris 22–39) masih mengambil **semua** turnamen. Setelah backend
punya relasi tim, buat endpoint "turnamen yang saya ikuti" berbasis user login
(lihat FASE 4), misalnya `GET /api/my-tournaments`, lalu ganti pemanggilan di halaman
itu. Jangan memfilter di frontend berdasarkan nama user — frontend tidak aman.

#### 3.6 Tampilkan peserta di area organizer

`resources/js/pages/organizer/DetailTurnamen.jsx` sekitar baris 104 masih menulis
"Data peserta bakal muncul...". Setelah endpoint `teams()` jadi, ganti dengan:

```js
const [peserta, setPeserta] = useState([]);

useEffect(() => {
  api.get(`/tournaments/${id}/teams`)
    .then((res) => setPeserta(res.data.data || []))
    .catch(() => setPeserta([]));
}, [id]);
```

Lalu render `peserta.map(...)` di dalam card "Peserta".

---

### FASE 4 — SISTEM LOGIN (AUTHENTIKASI)

Target: login sungguhan, token, dan pembatasan role. Jangan pakai `sessionStorage`
berisi user palsu lagi.

#### 4.1 Pasang Laravel Sanctum

```powershell
composer require laravel/sanctum
php artisan install:api
```

`install:api` akan menambahkan konfigurasi Sanctum, memastikan `routes/api.php`
terdaftar (sudah terdaftar di `bootstrap/app.php`), dan menawarkan menjalankan
migration. Jawab `yes` kalau diminta.

Kalau `install:api` tidak tersedia/berbeda di versi Laravel-mu:

```powershell
php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"
php artisan migrate
```

Cek `config/sanctum.php` sudah ada.

#### 4.2 Tambah kolom `role` di tabel users

```powershell
php artisan make:migration add_role_to_users_table --table=users
```

Isi:

```php
public function up(): void
{
    Schema::table('users', function (Blueprint $table) {
        $table->string('role')->default('peserta')->after('email');
        $table->string('username')->nullable()->unique()->after('name');
    });
}

public function down(): void
{
    Schema::table('users', function (Blueprint $table) {
        $table->dropColumn(['role', 'username']);
    });
}
```

Jalankan:

```powershell
php artisan migrate
```

Update `app/Models/User.php`. Model ini memakai atribut PHP 8, bukan `$fillable`
biasa:

```php
#[Fillable(['name', 'username', 'email', 'password', 'role'])]
#[Hidden(['password', 'remember_token'])]
```

Pastikan juga `use Laravel\Sanctum\HasApiTokens;` lalu tambahkan trait:

```php
use HasApiTokens, HasFactory, Notifiable;
```

#### 4.3 Buat AuthController

```powershell
php artisan make:controller AuthController
```

Isi `app/Http/Controllers/AuthController.php`:

```php
<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:100'],
            'email' => ['required', 'email', 'max:150', 'unique:users,email'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
            'role' => ['nullable', 'in:peserta,organizer'],
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => $validated['password'], // otomatis di-hash oleh cast 'hashed'
            'role' => $validated['role'] ?? 'peserta',
        ]);

        $token = $user->createToken('arenahub')->plainTextToken;

        return response()->json([
            'message' => 'Registrasi berhasil',
            'user' => $user,
            'token' => $token,
        ], 201);
    }

    public function login(Request $request)
    {
        $validated = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required', 'string'],
        ]);

        $user = User::where('email', $validated['email'])->first();

        if (!$user || !Hash::check($validated['password'], $user->password)) {
            return response()->json([
                'message' => 'Email atau password salah',
            ], 401);
        }

        $token = $user->createToken('arenahub')->plainTextToken;

        return response()->json([
            'message' => 'Login berhasil',
            'user' => $user,
            'token' => $token,
        ]);
    }

    public function me(Request $request)
    {
        return response()->json([
            'message' => 'Data user berhasil diambil',
            'user' => $request->user(),
        ]);
    }

    public function logout(Request $request)
    {
        // Hapus token yang sedang dipakai saja
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Logout berhasil',
        ]);
    }
}
```

Catatan keamanan:

- Jangan pernah menyimpan role hanya di frontend. Role harus dicek di server.
- Jangan mengembalikan `password` di response. `$hidden` sudah menanganinya.
- Token Sanctum itu bearer token. Perlakukan seperti password.

#### 4.4 Buat middleware Admin/Organizer

```powershell
php artisan make:middleware EnsureIsOrganizer
```

Isi `app/Http/Middleware/EnsureIsOrganizer.php`:

```php
<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureIsOrganizer
{
    public function handle(Request $request, Closure $next): Response
    {
        if ($request->user()?->role !== 'organizer') {
            return response()->json([
                'message' => 'Akses ditolak. Halaman ini khusus organizer.',
            ], 403);
        }

        return $next($request);
    }
}
```

Daftarkan alias di `bootstrap/app.php`:

```php
->withMiddleware(function (Middleware $middleware): void {
    $middleware->alias([
        'organizer' => \App\Http\Middleware\EnsureIsOrganizer::class,
    ]);
})
```

#### 4.5 Update routes

`routes/api.php` menjadi seperti ini:

```php
<?php

use App\Http\Controllers\AuthController;
use App\Modules\Tournaments\Http\Controllers\TournamentApiController;
use Illuminate\Support\Facades\Route;

// Auth
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Publik
Route::get('/tournaments', [TournamentApiController::class, 'index']);
Route::get('/tournaments/{id}', [TournamentApiController::class, 'show']);

// Harus login
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::post('/tournaments/{id}/register', [TournamentApiController::class, 'register']);

    // Khusus organizer
    Route::middleware('organizer')->group(function () {
        Route::post('/tournaments', [TournamentApiController::class, 'store']);
        Route::get('/tournaments/{id}/teams', [TournamentApiController::class, 'teams']);
    });
});
```

Kalau belum mau mengunci POST turnamen, lewati dulu middleware `organizer`, tapi
ingat: itu berarti siapa pun bisa membuat turnamen.

#### 4.6 Update frontend — simpan token

Di `resources/js/utils/api.js`:

```js
import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  headers: {
    Accept: "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("arenahub_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("arenahub_token");
      localStorage.removeItem("arenahub_user");
      // biarkan halaman memutuskan redirect-nya sendiri
    }
    return Promise.reject(error);
  }
);

export default api;
```

> Pilihan penyimpanan token:
> - `localStorage` — gampang, tetap login setelah tab ditutup, tapi rentan XSS.
> - `sessionStorage` — hilang saat tab ditutup, sedikit lebih aman.
> - HttpOnly cookie — paling aman, tapi butuh setup CORS + CSRF yang lebih rumit.
> Untuk tugas kuliah, `localStorage` cukup. Untuk produksi, pertimbangkan cookie.

#### 4.7 Update AuthContext

Ganti isi `resources/js/context/AuthContext.jsx` supaya memakai API, bukan user palsu:

```jsx
import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import api from "@/utils/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem("arenahub_user");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  const simpanSesi = useCallback((data) => {
    localStorage.setItem("arenahub_token", data.token);
    localStorage.setItem("arenahub_user", JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
  }, []);

  const login = useCallback(async (email, password) => {
    const res = await api.post("/login", { email, password });
    return simpanSesi(res.data);
  }, [simpanSesi]);

  const register = useCallback(async (payload) => {
    const res = await api.post("/register", payload);
    return simpanSesi(res.data);
  }, [simpanSesi]);

  const logout = useCallback(async () => {
    try {
      await api.post("/logout");
    } catch {
      // token mungkin sudah tidak valid, lanjut hapus sesi lokal saja
    }
    localStorage.removeItem("arenahub_token");
    localStorage.removeItem("arenahub_user");
    setUser(null);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("arenahub_token");
    if (!token) return;

    api.get("/me")
      .then((res) => {
        setUser(res.data.user);
        localStorage.setItem("arenahub_user", JSON.stringify(res.data.user));
      })
      .catch(() => {
        localStorage.removeItem("arenahub_token");
        localStorage.removeItem("arenahub_user");
        setUser(null);
      });
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, login, register, logout, isAuthenticated: !!user }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
```

Sesuaikan `SignIn.jsx` dan `SignUp.jsx`:

```js
// SignIn.jsx
const { login } = useAuth();
const [error, setError] = useState("");
const [loading, setLoading] = useState(false);

const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError("");

  try {
    const user = await login(email, password);
    if (redirect) {
      navigate(redirect);
    } else if (user.role === "organizer") {
      navigate("/organizer/dashboard");
    } else {
      navigate("/");
    }
  } catch (err) {
    setError(err.response?.data?.message || "Login gagal.");
  } finally {
    setLoading(false);
  }
};
```

`SignUp.jsx` serupa, tapi memanggil `register({ name, email, password, password_confirmation })`.

#### 4.8 Cek alur login

1. `POST /api/register` → dapat `token` + `user`.
2. `POST /api/login` → dapat `token` + `user`.
3. Request berikutnya mengirim header `Authorization: Bearer <token>`.
4. `GET /api/me` mengembalikan user yang sedang login.
5. `POST /api/logout` menghapus token aktif.

Kalau `POST /api/tournaments` mengembalikan `401`, berarti token tidak terkirim.
Kalau `403`, berarti role user bukan `organizer`.

---

### FASE 5 — TESTING & DEBUGGING

#### 5.1 Tes API pakai Postman

Buat Collection baru bernama **ArenaHub**, lalu set collection variable:

| Variable | Value |
| --- | --- |
| `baseUrl` | `http://127.0.0.1:8000/api` |
| `token` | (kosong dulu) |

Request yang perlu dibuat:

**1. GET Daftar Turnamen**

```
GET {{baseUrl}}/tournaments
```

Expected: `200`, body punya `message` dan `data` berupa array.

**2. GET Detail Turnamen**

```
GET {{baseUrl}}/tournaments/1
```

Expected: `200`. Kalau ID tidak ada: `404` dengan `"Turnamen tidak ditemukan"`.

**3. POST Buat Turnamen**

```
POST {{baseUrl}}/tournaments
Headers:
  Content-Type: application/json
  Authorization: Bearer {{token}}
Body (raw JSON):
{
  "title": "Test Cup",
  "game": "mlbb",
  "quota": 4,
  "price": 0,
  "start_date": "2026-12-01"
}
```

Expected: `201`.

**4. POST Daftar Tim**

```
POST {{baseUrl}}/tournaments/1/register
Headers:
  Content-Type: application/json
  Authorization: Bearer {{token}}
Body (raw JSON):
{
  "name": "Tim Satu",
  "captain_name": "Budi",
  "captain_game_id": "BUDI01",
  "members": "Andi - ANDI01\nCici - CICI01"
}
```

Expected: `201`. Ulangi sampai kuota habis, lalu harus `422`.

**5. POST Login**

```
POST {{baseUrl}}/login
Body (raw JSON):
{
  "email": "test@example.com",
  "password": "password"
}
```

Simpan token otomatis dengan script di tab **Tests**:

```js
const res = pm.response.json();
if (res.token) {
  pm.collectionVariables.set("token", res.token);
}
```

Cara mengecek penyebab error di Postman:

- Lihat tab **Body** pada response.
- `422` = validasi gagal. Baca `errors`.
- `401` = belum login / token salah.
- `403` = role tidak diizinkan.
- `404` = ID tidak ada.
- `500` = ada error PHP. Buka `storage/logs/laravel.log`.

#### 5.2 Tes frontend

```powershell
# Terminal 1
php artisan serve

# Terminal 2 (opsional untuk dev)
npm run dev
```

Buka `http://127.0.0.1:8000` (kalau pakai build) atau `http://localhost:5173`
(kalau pakai Vite dev).

Kalau pakai Vite dev dan API gagal karena beda port, tambahkan proxy di `vite.config.js`:

```js
server: {
  watch: {
    ignored: ['**/storage/framework/views/**'],
  },
  proxy: {
    '/api': {
      target: 'http://127.0.0.1:8000',
      changeOrigin: true,
    },
  },
},
```

#### 5.3 Debug di browser (F12)

1. Buka halaman yang bermasalah.
2. Tekan **F12** → tab **Console**. Error JavaScript muncul di sini.
3. Tab **Network** → filter **Fetch/XHR**.
4. Klik request ke `/api/...`, lihat:
   - **Status** (`200`, `422`, `500`, dst.)
   - **Headers** → pastikan `Authorization` terkirim kalau perlu login.
   - **Payload** → pastikan data yang dikirim benar.
   - **Response** → pesan error asli dari Laravel.
5. Kalau response kosong padahal status `200`, kemungkinan controller belum
   mengembalikan apa-apa (ini kondisi `store()` sebelum diisi).

#### 5.4 Debug di terminal Laravel

```powershell
# Lihat log terakhir
Get-Content storage\logs\laravel.log -Tail 80

# Ikuti log secara live
php artisan pail

# Bersihkan cache konfigurasi kalau .env berubah tapi tidak terbaca
php artisan config:clear
php artisan cache:clear
php artisan route:clear
php artisan view:clear
```

#### 5.5 Tabel error umum

| Gejala | Kemungkinan penyebab | Solusi |
| --- | --- | --- |
| `500` saat POST | Controller error / kolom tidak ada | Cek `storage/logs/laravel.log` |
| `419` | CSRF (biasanya route web, bukan API) | Pastikan memanggil `/api/...` |
| `CORS error` | Frontend beda origin | Pakai proxy Vite atau konfigurasi CORS |
| `401 Unauthenticated` | Token tidak dikirim | Cek interceptor Axios |
| `422` terus | Validasi gagal | Baca `errors` di response |
| Data tidak muncul | Seeder belum jalan | `php artisan db:seed --class=TournamentSeeder` |
| Perubahan `.env` tidak berefek | Config ter-cache | `php artisan config:clear` |
| `SQLSTATE` koneksi | MySQL mati / kredensial salah | Cek `.env` dan service MySQL |

---

## 3. DAFTAR FILE PENTING (CHEAT SHEET)

### Backend

| Path | Isi |
| --- | --- |
| `routes/api.php` | Semua endpoint API |
| `routes/web.php` | Catch-all React (`view('app')`) |
| `bootstrap/app.php` | Routing, middleware alias, exception handler |
| `app/Modules/Tournaments/Http/Controllers/TournamentApiController.php` | `index`, `show`, `store`, `register` |
| `app/Modules/Tournaments/Models/Tournament.php` | Model turnamen, `$fillable`, `$casts` |
| `app/Modules/Tournaments/Models/Team.php` | Model tim, `$fillable` |
| `app/Models/User.php` | Model user + trait Sanctum nanti |
| `app/Http/Controllers/AuthController.php` | Akan kamu buat di FASE 4 |
| `app/Http/Middleware/EnsureIsOrganizer.php` | Akan kamu buat di FASE 4 |
| `app/Providers/AppServiceProvider.php` | Tempat binding service kalau perlu |
| `database/migrations/2026_11_13_000001_create_tournaments_table.php` | Tabel turnamen |
| `database/migrations/2026_11_13_000002_create_teams_table.php` | Tabel tim |
| `database/seeders/TournamentSeeder.php` | Data contoh turnamen |
| `database/seeders/DatabaseSeeder.php` | Seeder utama (masih membuat 1 user tes) |
| `.env` | Koneksi DB, `APP_URL`, dll. |
| `storage/logs/laravel.log` | Log error backend |

### Frontend

| Path | Isi |
| --- | --- |
| `resources/js/main.jsx` | Entry point React |
| `resources/js/App.jsx` | Semua route React |
| `resources/js/utils/api.js` | Instance Axios + interceptor token nanti |
| `resources/js/utils/turnamen.js` | `rapikanTurnamen`, format harga/tanggal, daftar game |
| `resources/js/context/AuthContext.jsx` | State login (sekarang masih tiruan) |
| `resources/js/components/TournamentCard.jsx` | Kartu turnamen |
| `resources/js/components/Layout.jsx` / `Navbar.jsx` | Kerangka halaman |
| `resources/js/pages/Home.jsx` | Beranda |
| `resources/js/pages/CariTurnamen.jsx` | Daftar + filter turnamen |
| `resources/js/pages/DetailTurnamen.jsx` | Detail publik + tombol daftar |
| `resources/js/pages/Pendaftaran.jsx` | Form pendaftaran (perlu POST) |
| `resources/js/pages/Pembayaran.jsx` | Simulasi pembayaran |
| `resources/js/pages/TurnamenSaya.jsx` | Turnamen yang diikuti (masih semua data) |
| `resources/js/pages/DetailTurnamenSaya.jsx` | Detail turnamen yang diikuti |
| `resources/js/pages/Jadwal.jsx` | Jadwal turnamen |
| `resources/js/pages/Pertandingan.jsx` | Masih kosong, belum ada data |
| `resources/js/pages/SignIn.jsx` / `SignUp.jsx` | Login/daftar (perlu sambung API) |
| `resources/js/pages/Profil.jsx` | Profil user |
| `resources/js/pages/organizer/Dashboard.jsx` | Statistik organizer |
| `resources/js/pages/organizer/BuatTurnamen.jsx` | Form buat turnamen (sudah POST) |
| `resources/js/pages/organizer/TurnamenSaya.jsx` | Daftar turnamen organizer |
| `resources/js/pages/organizer/DetailTurnamen.jsx` | Detail + peserta |
| `resources/views/app.blade.php` | HTML shell React |
| `vite.config.js` | Konfigurasi Vite (alias `@`, proxy nanti) |
| `resources/css/app.css` / `resources/js/index.css` | Styling Tailwind |

### Dokumentasi proyek

- `README.md` — ringkasan proyek dan endpoint.
- `README_1.md` sampai `README_6.md` — panduan belajar membangun proyek dari nol.
- `PESAN_TONGKAT_ESTAFET.md` — dokumen ini.

---

## 4. 5 TIPS EMAS DARI SENIOR

### Tip 1 — Inisialisasi Git SEKARANG, lalu commit kecil-kecil

Folder ini **belum** repo Git. Sebelum mengubah apa pun:

```powershell
git init
git add .
git commit -m "chore: kondisi awal ArenaHub sebelum pengembangan manual"
```

Biasakan commit setiap satu fitur selesai, bukan setiap akhir hari:

```powershell
git add app routes database
git commit -m "feat: endpoint create tournament"
```

Kalau salah, kamu bisa kembali. Tanpa Git, satu `migrate:fresh` bisa menghapus kerjaan
berjam-jam. Pastikan juga `.env` dan `database/database.sqlite` ada di `.gitignore`.

### Tip 2 — Setiap habis ubah `.env` atau config, bersihkan cache

Laravel menyimpan cache konfigurasi. Gejala klasik: kamu ubah database di `.env` tapi
aplikasi tetap memakai database lama.

```powershell
php artisan config:clear
php artisan cache:clear
php artisan route:clear
php artisan view:clear
```

Kalau kamu sedang mengembangkan dan perubahan tidak muncul, jalankan empat perintah
itu dulu sebelum panik.

### Tip 3 — Baca log, jangan menebak

Error `500` hampir selalu punya jejak di `storage/logs/laravel.log`.

```powershell
Get-Content storage\logs\laravel.log -Tail 100
```

Lebih enak lagi, jalankan `php artisan pail` di terminal terpisah. Log akan muncul
real-time saat kamu menekan tombol di frontend. Untuk frontend, buka F12 → Console
dan Network. Jangan mengubah kode acak-acakan sebelum tahu error aslinya.

### Tip 4 — `migrate:fresh --seed` hanya untuk lokal, dan validasi selalu di backend

`php artisan migrate:fresh` **menghapus semua tabel dan data**. Aman di laptop
sendiri, berbahaya kalau diarahkan ke database bersama. Sebelum menjalankannya,
pastikan `.env` menunjuk ke database lokal.

Selain itu: validasi di React itu untuk kenyamanan pengguna, bukan keamanan. Server
tetap harus memvalidasi semuanya (`$request->validate`). Jangan pernah percaya
`price`, `quota`, atau `role` yang dikirim dari browser.

### Tip 5 — Lindungi operasi yang berebutan dengan transaksi + kunci baris

Setiap kali ada operasi "hitung dulu, baru simpan" yang bisa ditekan banyak orang
sekaligus (pendaftaran, pembayaran, klaim kuota), gunakan:

```php
DB::transaction(function () {
    $row = Model::whereKey($id)->lockForUpdate()->firstOrFail();
    // cek kuota / stok
    // simpan
});
```

Tanpa ini, kuota bisa jebol walau di frontend tombolnya sudah kamu `disable`.
Tombol `disable` hanya mencegah satu orang menekan dua kali; ia tidak mencegah
100 orang menekan bersamaan.

**Bonus keamanan:** file `opencode.json` yang dihapus tadi berisi API key. Kalau file
itu pernah kamu salin, unggah, atau commit ke tempat lain, anggap key-nya bocor dan
buat key baru. Jangan pernah menaruh rahasia di file yang ikut ter-commit.

---

## 5. PESAN PERPISAHAN

Ini titik serah-terima.

Fondasinya sudah berdiri: React-nya rapi, databasenya siap, API GET sudah bisa
dipanggil, dan Axios sudah menyambung keduanya. Yang tersisa bukan pekerjaan ajaib —
hanya pekerjaan yang belum diketik: satu migration, dua method controller, beberapa
tombol yang harus dihubungkan, lalu login yang benar.

Mulai dari FASE 1. Jangan langsung ke FASE 4 karena login terlihat keren. Developer
yang baik menyelesaikan fondasi dulu, baru memasang atap.

Saat error muncul — dan pasti muncul — jangan panik. Error bukan tanda kamu gagal;
error adalah cara Laravel memberi tahu di mana masalahnya. Baca log, baca response,
baca pesan validasi. Hampir semua jawaban ada di sana.

Kamu sekarang memegang kendali penuh. Tidak ada AI yang akan mengetik untukmu lagi,
dan itu kabar baik: setiap baris yang kamu tulis sendiri akan kamu pahami, dan setiap
bug yang kamu perbaiki sendiri akan kamu ingat selamanya. Proyek ini akan menjadi
milikmu — bukan karena kamu mewarisinya, tapi karena kamu membangunnya dengan tanganmu.

Kerjakan satu fase per hari. Commit. Tes. Ulangi.

Selamat ngoding. Tongkat estafet sudah di tanganmu.

— Senior Developer ArenaHub
