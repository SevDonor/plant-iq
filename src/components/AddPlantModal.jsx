import { useEffect, useState } from 'react';
import { X } from 'lucide-react';

const initialForm = {
  name: '',
  scientificName: '',
  species: '',
};

function AddPlantModal({ open, onClose, onSubmit, busy, plant = null }) {
  const [form, setForm] = useState(initialForm);
  const isEdit = Boolean(plant);

  useEffect(() => {
    if (!open) return;
    setForm(
      plant
        ? {
            name: plant.name || '',
            scientificName: plant.scientificName || '',
            species: plant.species || '',
          }
        : initialForm,
    );
  }, [open, plant]);

  if (!open) {
    return null;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    await onSubmit(form);
    if (!isEdit) setForm(initialForm);
  };

  return (
    <div className="fixed inset-0 z-40 flex items-end justify-center bg-slate-950/35 px-4 py-6 backdrop-blur-sm sm:items-center">
      <form
        onSubmit={handleSubmit}
        role="dialog"
        aria-modal="true"
        aria-label={isEdit ? 'Chỉnh sửa thông tin cây' : 'Thêm cây mới'}
        className="w-full max-w-lg rounded-card border border-emerald-100 bg-white p-6 shadow-card"
      >
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black text-slate-950">
              {isEdit ? 'Chỉnh sửa thông tin cây' : 'Thêm cây mới'}
            </h2>
            <p className="mt-1 text-sm font-semibold text-slate-500">
              {isEdit ? 'Cập nhật hồ sơ cây để theo dõi chính xác hơn.' : 'Tạo hồ sơ cây để theo dõi trong Plant-IQ.'}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 text-slate-500 transition hover:bg-rose-50 hover:text-rose-600"
            aria-label={isEdit ? 'Hủy chỉnh sửa cây' : 'Hủy thêm cây'}
          >
            <X size={18} aria-hidden="true" />
          </button>
        </div>

        <div className="grid gap-4">
          <Field label="Tên cây">
            <input
              value={form.name}
              onChange={(event) => setForm({ ...form, name: event.target.value })}
              className="min-h-12 w-full rounded-2xl border border-slate-200 px-4 font-semibold outline-none focus:border-emerald-400"
              required
            />
          </Field>
          <Field label="Tên khoa học">
            <input
              value={form.scientificName}
              onChange={(event) => setForm({ ...form, scientificName: event.target.value })}
              className="min-h-12 w-full rounded-2xl border border-slate-200 px-4 font-semibold outline-none focus:border-emerald-400"
              required
            />
          </Field>
          <Field label="Loài / mô tả ngắn">
            <input
              value={form.species}
              onChange={(event) => setForm({ ...form, species: event.target.value })}
              className="min-h-12 w-full rounded-2xl border border-slate-200 px-4 font-semibold outline-none focus:border-emerald-400"
              required
            />
          </Field>
        </div>

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            className="min-h-12 rounded-2xl bg-slate-100 px-5 font-black text-slate-600 transition hover:bg-slate-200"
          >
            Hủy
          </button>
          <button
            type="submit"
            disabled={busy}
            className="min-h-12 rounded-2xl bg-emerald-600 px-5 font-black text-white transition hover:bg-emerald-700 disabled:opacity-60"
          >
            {busy ? 'Đang lưu...' : isEdit ? 'Lưu thay đổi' : 'Thêm cây'}
          </button>
        </div>
      </form>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label className="grid gap-2 text-sm font-black text-slate-700">
      {label}
      {children}
    </label>
  );
}

export default AddPlantModal;
