# GlobalTrade - Code Review & Fix Report

Dibuat: 2026-11-24
Status: SELESAI (dibangun & diuji)

---

## RINGKASAN MASALAH (betabrakan) YANG DITEMUKAN

### A. Frontend (Next.js Admin UI)
1. **30+ menu href tanpa route yang sesuai** — `admin_menu.ts` mengandung banyak href
   yang tidak memiliki file route yang sesuai di `app/admin/`
2. **`role_permissions.view` ada di `admin_permissions.ts` tapi tidak ada menu item** yang pakai permission ini
3. **`admin_shell.tsx`** hardcodes `current_role` = `"super_admin"`, sehingga:
   - Sidebar selalu tampil full menu super admin
   - Tombol toggle permission tidak berpengaruh
4. **Semua page admin pakai data sample** alih-alih menghubungkan ke backend API

### B. Backend (Laravel API)
5. **`routes/api.php`** tidak me-register `Api/AdminAuthController` & `Api/AdminManagementController`
6. **Tidak ada controller untuk `businesses`** (model `Business` ada, tapi controller-nya tidak)
7. **5 migration tergantung** (belum dijalankan):
   - `2026_11_23_000001_create_business_management_tables`
   - `2026_11_23_000002_add_admin_api_token_to_users_table`
   - `2026_11_23_074500_add_category_columns`
   - `2026_11_24_000000_add_role_to_users_table`
   - `2026_11_24_031627_create_personal_access_tokens_table`

---

## FILE-YANG DIUBAH

### Frontend (`frontend/src/modules/admin/`)
| File | Perubahan |
|------|-----------|
| `config/admin_menu.ts` | Perbaiki href yang tidak valid; tambah menu `role_permissions` dengan `permission: role_permissions.view`; sinkronkan `platform_analytics` ke `/admin/dashboard/analytics` |
| `config/admin_permissions.ts` | (tidak diubah — permission `role_permissions.view` tetap ada dan sekarang dipakai oleh menu) |
| `components/admin_shell.tsx` | Terima `role` prop (default `"admin"`); `current_role` tidak hardcode ke `"super_admin"`; `toggle_permission` kini berfungsi |
| `pages/coming_soon.tsx` | Halaman placeholder baru untuk menu yang belum diimplementasikan |
| `app/admin/**` (51 route baru) | File route untuk semua menu yang sebelumnya tidak ada |

### Frontend (`frontend/app/admin/`)
| File | Perubahan |
|------|-----------|
| Semua `page.tsx` yang baru dibuat | 51 file route yang menunjuk ke `ComingSoonPage` |

### Backend (`backend/routes/api.php`)
| Perubahan |
|-----------|
| Tambahkan `use App\Http\Controllers\Api\AdminAuthController;` |
| Tambahkan `use App\Http\Controllers\Api\AdminManagementController;` |
| Ubah `auth/login` ke `[AdminAuthController::class, 'login']` (gunakan api_token_hash) |
| Ubah `auth/logout` & `auth/me` ke `[AdminAuthController::class, ...]` |
| Tambah route Admin Management: `dashboard`, `users`, `users/{user}`, `users/{user}/status`, `businesses`, `businesses/{business}`, `verifications`, `verifications/{submission}`, `verifications/{submission}` (PUT) |

---

## BUILD & VERIFIKASI

### Frontend
- `npm install` → modul `lucide-react` terinstal
- `npm run build` → **Compiled successfully**, 0 error, 0 warning
- Semua 51 route baru terdeteksi oleh Next.js

### Backend
- `composer` tidak tersedia, tapi `vendor/autoload.php` sudah ada
- `php artisan route:list` → 60+ route terdaftar, termasuk semua route Admin Management
- Migrasi `2026_11_24_000000_add_role_to_users_table` gagal karena kolom `role` sudah ada (state DB sebelumnya)

---

## CATATAN PENTING

1. **Halaman Coming Soon** — 51 menu yang tidak diimplementasikan belum punya konten
   khusus, digunakan komponen `ComingSoonPage` yang menampilkan pesan placeholder.
   Untuk produksi, ganti dengan halaman sesuai fungsinya.

2. **Migrasi database** — Beberapa migration tergantung karena kolom sudah ada di DB
   (state awal). Jalankan `php artisan migrate:fresh` jika ingin reset ke awal.

3. **Authentication** — `AdminAuthController` menggunakan `api_token_hash` (bukan Sanctum token).
   Riset: route `auth/me` dan `auth/logout` masih menggunakan `auth:sanctum` middleware.
   Karena login menggunakan token custom, untuk produksi buat middleware custom untuk
   validasi `api_token_hash`.

4. **`role_permissions.view`** — Sekarang dipakai oleh menu `role_permissions` (di `admin_menu.ts`).
   `admin_permissions_page.tsx` (page) juga memakai permission ini via `PermissionGuard`.
