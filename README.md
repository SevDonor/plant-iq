# Plant-IQ

Plant-IQ là dashboard web IoT chăm sóc cây thông minh. Ứng dụng nhận dữ liệu cảm biến từ ESP32 qua Supabase Postgres/Realtime, hiển thị bằng React dashboard và có thể deploy lên Vercel.

```text
ESP32 / IoT device
  -> Supabase Postgres + Realtime
  -> React + Vite dashboard
  -> Vercel
```

## Công nghệ

- React + Vite
- Tailwind CSS
- lucide-react
- Recharts
- Supabase Postgres + Realtime
- Vercel static hosting

## Cài đặt

```bash
npm install
```

## Chạy local

```bash
npm run dev
```

Nếu chưa có `.env`, app tự dùng `src/data/mockData.js` nên vẫn chạy được.

## Build production

```bash
npm run build
```

## Cấu hình Supabase

Tạo file `.env` từ `.env.example`:

```bash
cp .env.example .env
```

Điền các biến public client:

```env
VITE_SUPABASE_URL=
VITE_SUPABASE_PUBLISHABLE_KEY=
```

Khi thiếu config, `src/supabase/supabaseClient.js` không khởi tạo Supabase và `src/supabase/plantService.js` fallback sang mock data.

## Đăng nhập / đăng xuất

Plant-IQ dùng Supabase Auth khi có env Supabase:

- Đăng nhập: `supabase.auth.signInWithPassword`.
- Đăng ký: `supabase.auth.signUp`.
- OAuth Google/GitHub: `supabase.auth.signInWithOAuth`.
- Đăng xuất: `supabase.auth.signOut`.
- Lắng nghe phiên: `supabase.auth.onAuthStateChange`.

For Google/GitHub OAuth, enable the provider in Supabase Dashboard under `Authentication -> Providers`, then add these local redirect URLs:

```text
http://127.0.0.1:5173
http://localhost:5173
```

Khi chưa có env Supabase, email/password fallback sang demo session local trong `localStorage` để có thể review UI mà không cần backend.

## Supabase schema gợi ý

```sql
create table public.devices (
  id text primary key,
  status text default 'online',
  signal text,
  firmware text,
  pump boolean default false,
  last_seen timestamptz default now(),
  last_command_at timestamptz
);

create table public.plants (
  id text primary key,
  name text not null,
  scientific_name text,
  species text,
  planted_date text,
  age_month int default 0,
  stage text,
  status text default 'good',
  status_text text,
  device_id text references public.devices(id),
  soil_moisture numeric,
  temperature numeric,
  light numeric,
  thresholds jsonb default '{}'::jsonb
);

create table public.sensor_readings (
  id bigint generated always as identity primary key,
  device_id text references public.devices(id),
  temperature numeric,
  air_humidity numeric,
  soil_moisture numeric,
  light numeric,
  air_quality numeric,
  recorded_label text,
  created_at timestamptz default now()
);

create table public.reminders (
  id uuid primary key default gen_random_uuid(),
  plant_id text references public.plants(id),
  title text not null,
  type text not null,
  schedule text,
  next_run text,
  due_label text,
  note text,
  enabled boolean default true,
  completed boolean default false,
  created_at timestamptz default now()
);
```

Bật Supabase Realtime cho các bảng `sensor_readings` và `devices` nếu muốn dashboard tự cập nhật khi ESP32 gửi dữ liệu.

## ESP32 gửi dữ liệu lên Supabase

ESP32 có thể insert vào REST endpoint của Supabase bằng anon/publishable key nếu Row Level Security cho phép. Production nên dùng policy chặt hoặc proxy/backend riêng cho device key.

```cpp
POST https://<project-ref>.supabase.co/rest/v1/sensor_readings
apikey: <publishable-key>
Authorization: Bearer <publishable-key>
Content-Type: application/json

{
  "device_id": "esp32-plant-001",
  "temperature": 26.8,
  "air_humidity": 67,
  "soil_moisture": 68,
  "light": 820,
  "air_quality": 34
}
```

ESP32 nên đọc lệnh bơm từ bảng `devices`, cột `pump` của `esp32-plant-001`.

## Deploy Vercel

1. Push project lên GitHub.
2. Import repo trong Vercel.
3. Framework preset: Vite.
4. Build command: `npm run build`.
5. Output directory: `dist`.
6. Thêm `VITE_SUPABASE_URL` và `VITE_SUPABASE_PUBLISHABLE_KEY` trong Vercel Project Settings.
7. Deploy.

## Chuẩn bị convert Tauri/Electron

- Supabase access nằm riêng trong `src/supabase/`.
- Component không import Supabase trực tiếp.
- Không cần backend server riêng ở v1.
- App chạy bằng static build Vite.
- Hạn chế browser-only API; các thao tác UI hiện chỉ dùng React state, chart SVG và service layer.

## Scripts

```bash
npm run dev
npm run build
npm run preview
```
