import { useState } from 'react';
import { Leaf, LockKeyhole, Mail, UserRound } from 'lucide-react';
import PlantArtwork from '../components/PlantArtwork';

function AuthPage({ onSignIn, onSignUp, onProviderSignIn, busy, error }) {
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({
    name: 'Thu',
    email: 'thu.smartgarden@gmail.com',
    password: 'demo1234',
  });

  const isRegister = mode === 'register';

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (isRegister) {
      await onSignUp(form);
      return;
    }
    await onSignIn(form);
  };

  return (
    <main className="min-h-screen px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto grid min-h-[calc(100vh-48px)] max-w-6xl overflow-hidden rounded-card border border-emerald-100 bg-white/82 shadow-card backdrop-blur lg:grid-cols-[1.05fr_0.95fr]">
        <section className="relative flex min-h-[360px] flex-col justify-between overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-yellow-50 p-8 sm:p-10">
          <div className="relative z-10 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 text-white shadow-soft">
              <Leaf size={28} aria-hidden="true" />
            </div>
            <div>
              <p className="text-2xl font-black text-emerald-700">Plant-IQ</p>
              <p className="text-sm font-semibold text-slate-500">My Smart Garden</p>
            </div>
          </div>

          <div className="relative z-10 my-8 flex justify-center">
            <PlantArtwork variant="hero" className="h-64 w-full max-w-sm drop-shadow-[0_24px_34px_rgba(21,128,61,0.16)]" />
          </div>

          <div className="relative z-10 max-w-xl">
            <p className="text-sm font-black uppercase text-emerald-600">Smart garden workspace</p>
            <h1 className="mt-3 text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">
              Theo dõi vườn cây trước khi bật bơm.
            </h1>
            <p className="mt-4 text-base font-semibold leading-7 text-slate-600">
              Đăng nhập để xem cảm biến, lịch chăm sóc, cảnh báo và điều khiển thiết bị ESP32.
            </p>
          </div>
        </section>

        <section className="flex items-center p-6 sm:p-10">
          <form onSubmit={handleSubmit} className="w-full rounded-card border border-slate-100 bg-white/92 p-6 shadow-soft">
            <div className="mb-6">
              <p className="text-sm font-black uppercase text-emerald-600">
                {isRegister ? 'Tạo tài khoản' : 'Đăng nhập'}
              </p>
              <h2 className="mt-2 text-3xl font-black text-slate-950">
                {isRegister ? 'Bắt đầu với Plant-IQ' : 'Chào mừng trở lại'}
              </h2>
            </div>

            <div className="grid gap-3">
              <OAuthButton
                label="Tiếp tục với Google"
                provider="google"
                busy={busy}
                onProviderSignIn={onProviderSignIn}
              />
              <OAuthButton
                label="Tiếp tục với GitHub"
                provider="github"
                busy={busy}
                onProviderSignIn={onProviderSignIn}
              />
            </div>

            <div className="my-5 flex items-center gap-3">
              <div className="h-px flex-1 bg-slate-200" />
              <span className="text-xs font-black uppercase text-slate-400">hoặc email</span>
              <div className="h-px flex-1 bg-slate-200" />
            </div>

            <div className="grid gap-4">
              {isRegister ? (
                <Field icon={UserRound} label="Tên hiển thị">
                  <input
                    value={form.name}
                    onChange={(event) => setForm({ ...form, name: event.target.value })}
                    className="min-h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 font-semibold outline-none focus:border-emerald-400"
                    required
                  />
                </Field>
              ) : null}

              <Field icon={Mail} label="Email">
                <input
                  type="email"
                  value={form.email}
                  onChange={(event) => setForm({ ...form, email: event.target.value })}
                  className="min-h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 font-semibold outline-none focus:border-emerald-400"
                  required
                />
              </Field>

              <Field icon={LockKeyhole} label="Mật khẩu">
                <input
                  type="password"
                  value={form.password}
                  onChange={(event) => setForm({ ...form, password: event.target.value })}
                  className="min-h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 font-semibold outline-none focus:border-emerald-400"
                  minLength={6}
                  required
                />
              </Field>
            </div>

            {error ? (
              <p className="mt-4 rounded-2xl bg-rose-50 px-4 py-3 text-sm font-bold text-rose-700">
                {error}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={busy}
              className="mt-6 min-h-12 w-full rounded-2xl bg-emerald-600 px-5 font-black text-white shadow-soft transition hover:bg-emerald-700 disabled:opacity-60"
            >
              {busy ? 'Đang xử lý...' : isRegister ? 'Tạo tài khoản' : 'Đăng nhập'}
            </button>

            <div className="mt-5 flex items-center justify-center gap-2 text-sm font-semibold text-slate-500">
              <span>{isRegister ? 'Đã có tài khoản?' : 'Chưa có tài khoản?'}</span>
              <button
                type="button"
                onClick={() => setMode(isRegister ? 'login' : 'register')}
                className="font-black text-emerald-700 hover:text-emerald-800"
              >
                {isRegister ? 'Đăng nhập' : 'Đăng ký'}
              </button>
            </div>
          </form>
        </section>
      </div>
    </main>
  );
}

function OAuthButton({ label, provider, busy, onProviderSignIn }) {
  return (
    <button
      type="button"
      onClick={() => onProviderSignIn(provider)}
      disabled={busy}
      className="group inline-flex min-h-12 w-full items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white px-5 font-black text-slate-700 shadow-soft transition hover:border-emerald-200 hover:bg-emerald-50 disabled:opacity-60"
    >
      <BrandIcon provider={provider} />
      {label}
    </button>
  );
}

function BrandIcon({ provider }) {
  if (provider === 'google') {
    return (
      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white ring-1 ring-slate-200 transition group-hover:ring-emerald-200">
        <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
          <path
            fill="#4285F4"
            d="M21.6 12.23c0-.77-.07-1.52-.2-2.23H12v4.22h5.38a4.6 4.6 0 0 1-2 3.02v2.51h3.24c1.9-1.75 2.98-4.33 2.98-7.52Z"
          />
          <path
            fill="#34A853"
            d="M12 22c2.7 0 4.96-.9 6.62-2.45l-3.24-2.51c-.9.6-2.04.95-3.38.95-2.6 0-4.81-1.76-5.6-4.12H3.05v2.6A10 10 0 0 0 12 22Z"
          />
          <path
            fill="#FBBC05"
            d="M6.4 13.87a6 6 0 0 1 0-3.74v-2.6H3.05a10 10 0 0 0 0 8.94l3.35-2.6Z"
          />
          <path
            fill="#EA4335"
            d="M12 6.01c1.47 0 2.8.51 3.84 1.5l2.86-2.86A9.64 9.64 0 0 0 12 2 10 10 0 0 0 3.05 7.53l3.35 2.6C7.19 7.77 9.4 6.01 12 6.01Z"
          />
        </svg>
      </span>
    );
  }

  return (
    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-950 text-white transition group-hover:bg-slate-800">
      <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
        <path
          fill="currentColor"
          d="M12 2C6.48 2 2 6.58 2 12.22c0 4.5 2.86 8.32 6.84 9.67.5.1.68-.22.68-.49v-1.9c-2.78.62-3.37-1.22-3.37-1.22-.45-1.18-1.1-1.5-1.1-1.5-.91-.64.07-.63.07-.63 1 .07 1.53 1.06 1.53 1.06.9 1.56 2.34 1.11 2.91.85.09-.66.35-1.11.63-1.37-2.22-.26-4.56-1.14-4.56-5.05 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.31.1-2.72 0 0 .84-.28 2.75 1.05A9.32 9.32 0 0 1 12 6.88c.85 0 1.7.12 2.5.34 1.9-1.33 2.74-1.05 2.74-1.05.55 1.41.2 2.46.1 2.72.64.72 1.03 1.63 1.03 2.75 0 3.92-2.34 4.78-4.57 5.04.36.32.68.94.68 1.9v2.82c0 .27.18.59.69.49A10.13 10.13 0 0 0 22 12.22C22 6.58 17.52 2 12 2Z"
        />
      </svg>
    </span>
  );
}

function Field({ icon: Icon, label, children }) {
  return (
    <label className="grid gap-2 text-sm font-black text-slate-700">
      <span className="inline-flex items-center gap-2">
        <Icon size={16} className="text-emerald-600" aria-hidden="true" />
        {label}
      </span>
      {children}
    </label>
  );
}

export default AuthPage;
