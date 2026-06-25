import { Plus, Search, SlidersHorizontal, Trash2, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import AddPlantModal from '../components/AddPlantModal';
import PlantListCard from '../components/PlantListCard';

const statusOptions = [
  { value: 'all', label: 'Tất cả trạng thái' },
  { value: 'good', label: 'Đang khỏe' },
  { value: 'warning', label: 'Cần chú ý' },
  { value: 'danger', label: 'Nguy cấp' },
];

function PlantList({ plants, onDetail, onAddPlant, onUpdatePlant, onDeletePlant, actionBusy }) {
  const [addPlantOpen, setAddPlantOpen] = useState(false);
  const [editingPlant, setEditingPlant] = useState(null);
  const [deletingPlant, setDeletingPlant] = useState(null);
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [notice, setNotice] = useState(null);

  const filteredPlants = useMemo(() => {
    const keyword = query.trim().toLowerCase();

    return plants.filter((plant) => {
      const matchesStatus = statusFilter === 'all' || plant.status === statusFilter;
      const searchable = [plant.name, plant.scientificName, plant.species]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      const matchesKeyword = !keyword || searchable.includes(keyword);

      return matchesStatus && matchesKeyword;
    });
  }, [plants, query, statusFilter]);

  const runAction = async (successMessage, action) => {
    setNotice(null);
    try {
      await action();
      setNotice({ type: 'success', text: successMessage });
    } catch (error) {
      setNotice({
        type: 'error',
        text: error?.message || 'Không lưu được thay đổi. Kiểm tra kết nối hoặc quyền Firebase.',
      });
    }
  };

  const handleAddPlant = async (plant) => {
    await runAction(`Đã thêm ${plant.name}.`, async () => {
      await onAddPlant(plant);
      setAddPlantOpen(false);
    });
  };

  const handleEditPlant = async (plant) => {
    if (!editingPlant) return;
    await runAction(`Đã cập nhật ${plant.name}.`, async () => {
      await onUpdatePlant(editingPlant.id, plant);
      setEditingPlant(null);
    });
  };

  const handleConfirmDelete = async () => {
    if (!deletingPlant) return;
    const plantName = deletingPlant.name;

    await runAction(`Đã xóa ${plantName}.`, async () => {
      await onDeletePlant(deletingPlant.id);
      setDeletingPlant(null);
    });
  };

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-black text-slate-950">Danh sách cây</h2>
          <p className="mt-1 text-sm font-semibold text-slate-500">
            Theo dõi nhanh tình trạng, hồ sơ và thiết bị gắn với từng cây.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setAddPlantOpen(true)}
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-5 font-black text-white shadow-soft transition hover:bg-emerald-700"
        >
          <Plus size={18} aria-hidden="true" />
          Thêm cây mới
        </button>
      </div>

      {notice ? (
        <div
          className={`flex items-center justify-between gap-3 rounded-2xl px-4 py-3 text-sm font-black ${
            notice.type === 'error'
              ? 'bg-rose-50 text-rose-700 ring-1 ring-rose-100'
              : 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100'
          }`}
          role="status"
        >
          <span>{notice.text}</span>
          <button
            type="button"
            onClick={() => setNotice(null)}
            className="rounded-full p-1 transition hover:bg-white/70"
            aria-label="Đóng thông báo"
          >
            <X size={16} aria-hidden="true" />
          </button>
        </div>
      ) : null}

      <div className="grid gap-3 rounded-card border border-emerald-100 bg-white/82 p-3 shadow-card lg:grid-cols-[1fr_240px]">
        <label className="relative block">
          <Search
            size={18}
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            aria-hidden="true"
          />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Tìm theo tên cây, tên khoa học, loài..."
            className="min-h-12 w-full rounded-2xl border border-slate-200 bg-white pl-11 pr-4 text-sm font-bold text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-emerald-400"
          />
        </label>
        <label className="relative block">
          <SlidersHorizontal
            size={18}
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            aria-hidden="true"
          />
          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            className="min-h-12 w-full appearance-none rounded-2xl border border-slate-200 bg-white pl-11 pr-4 text-sm font-black text-slate-700 outline-none transition focus:border-emerald-400"
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      {filteredPlants.length ? (
        <div className="grid gap-5 md:grid-cols-2 2xl:grid-cols-4">
          {filteredPlants.map((plant) => (
            <PlantListCard
              key={plant.id}
              plant={plant}
              onDetail={onDetail}
              onEdit={setEditingPlant}
              onDelete={setDeletingPlant}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-card border border-dashed border-emerald-200 bg-white/80 p-8 text-center shadow-card">
          <h3 className="text-xl font-black text-slate-900">
            {plants.length ? 'Không tìm thấy cây phù hợp' : 'Chưa có cây nào'}
          </h3>
          <p className="mt-2 text-sm font-semibold text-slate-500">
            {plants.length ? 'Thử đổi từ khóa hoặc bộ lọc trạng thái.' : 'Bấm thêm cây mới để tạo hồ sơ cây đầu tiên.'}
          </p>
        </div>
      )}

      <AddPlantModal
        open={addPlantOpen}
        onClose={() => setAddPlantOpen(false)}
        onSubmit={handleAddPlant}
        busy={actionBusy}
      />
      <AddPlantModal
        open={Boolean(editingPlant)}
        plant={editingPlant}
        onClose={() => setEditingPlant(null)}
        onSubmit={handleEditPlant}
        busy={actionBusy}
      />
      <DeletePlantDialog
        plant={deletingPlant}
        busy={actionBusy}
        onCancel={() => setDeletingPlant(null)}
        onConfirm={handleConfirmDelete}
      />
    </section>
  );
}

function DeletePlantDialog({ plant, busy, onCancel, onConfirm }) {
  if (!plant) return null;

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-slate-950/40 px-4 py-6 backdrop-blur-sm"
      style={{ placeItems: 'center' }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`Xóa ${plant.name}`}
        className="mx-auto w-full max-w-[440px] rounded-card border border-rose-100 bg-white p-6 shadow-card"
        style={{
          width: 'min(440px, calc(100vw - 32px))',
          maxWidth: 'calc(100vw - 32px)',
          height: 'fit-content',
          alignSelf: 'center',
          justifySelf: 'center',
        }}
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-600">
          <Trash2 size={22} aria-hidden="true" />
        </div>
        <h3 className="mt-4 text-2xl font-black text-slate-950">Xóa cây này?</h3>
        <p className="mt-2 text-sm font-semibold text-slate-500">
          Hồ sơ <span className="font-black text-slate-800">{plant.name}</span> sẽ bị xóa khỏi danh sách cây.
          Thao tác này không xóa dữ liệu sensor đã ghi trong lịch sử.
        </p>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={onCancel}
            className="min-h-12 rounded-2xl bg-slate-100 px-5 font-black text-slate-600 transition hover:bg-slate-200"
          >
            Hủy
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={busy}
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-rose-600 px-5 font-black text-white shadow-soft transition hover:bg-rose-700 disabled:opacity-60"
            style={{
              backgroundColor: busy ? '#fb7185' : '#e11d48',
              color: '#ffffff',
              boxShadow: '0 10px 24px rgba(225, 29, 72, 0.20)',
            }}
          >
            <Trash2 size={18} aria-hidden="true" />
            {busy ? 'Đang xóa...' : 'Xóa cây'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default PlantList;
