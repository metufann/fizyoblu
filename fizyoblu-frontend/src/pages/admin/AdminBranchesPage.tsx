import React, { useEffect, useState } from 'react';
import { AdminLayout } from '../../components/AdminLayout';
import { api } from '../../services/api';
import { Plus, Edit2, Trash2, X } from 'lucide-react';
import type { Branch } from '../../types';

export const AdminBranchesPage: React.FC = () => {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Partial<Branch> | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [message, setMessage] = useState<{ text: string; error?: boolean } | null>(null);

  const loadBranches = async () => {
    try {
      const res = await api.getAdminBranches();
      if (res.success) setBranches(res.data);
    } catch (err: any) {
      setMessage({ text: err.message, error: true });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBranches();
  }, []);

  const handleOpenCreate = () => {
    setEditing({
      name: '',
      address: '',
      district: '',
      city: 'İstanbul',
      phone: '',
      whatsApp: '',
      email: '',
      workingHours: 'Hafta İçi: 08:30 - 20:30 | Cts: 09:00 - 18:00',
      googleMapsUrl: '',
      embedMapUrl: '',
      imageUrl: '',
      order: branches.length + 1,
      isActive: true
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (branch: Branch) => {
    setEditing({ ...branch });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Bu şubeyi silmek istediğinizden emin misiniz?')) return;
    try {
      await api.deleteBranch(id);
      setMessage({ text: 'Şube silindi.' });
      loadBranches();
    } catch (err: any) {
      setMessage({ text: err.message, error: true });
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;

    try {
      if (editing.id) {
        await api.updateBranch(editing.id, editing);
        setMessage({ text: 'Şube güncellendi.' });
      } else {
        await api.createBranch(editing);
        setMessage({ text: 'Şube eklendi.' });
      }
      setIsModalOpen(false);
      setEditing(null);
      loadBranches();
    } catch (err: any) {
      setMessage({ text: err.message, error: true });
    }
  };

  return (
    <AdminLayout title="Şubeler Yönetimi" subtitle="Şube lokasyonları, adres, telefon, WhatsApp ve çalışma saatleri">
      {message && (
        <div
          className={`p-3 text-xs mb-6 ${
            message.error
              ? 'bg-[#FBE9E7] text-[#C62828] border border-[#FFCCBC]'
              : 'bg-[#E8F5E9] text-[#2E7D32] border border-[#C8E6C9]'
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="flex justify-between items-center mb-6">
        <p className="text-xs text-[#736E65]">Toplam {branches.length} şube listeleniyor.</p>
        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center px-4 py-2 bg-[#2B382D] text-[#FAF9F5] text-xs font-medium uppercase tracking-wider hover:bg-[#1E261F] transition-colors"
        >
          <Plus className="w-3.5 h-3.5 mr-1.5" />
          <span>Yeni Şube Ekle</span>
        </button>
      </div>

      {loading ? (
        <p className="text-xs text-[#736E65]">Yükleniyor...</p>
      ) : (
        <div className="bg-white border border-[#E5E0D5] overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8F6F2] border-b border-[#E5E0D5] text-[#6A655C] uppercase tracking-wider font-semibold">
              <tr>
                <th className="py-3 px-4">Şube Adı</th>
                <th className="py-3 px-4">İlçe / Şehir</th>
                <th className="py-3 px-4">Telefon</th>
                <th className="py-3 px-4">WhatsApp</th>
                <th className="py-3 px-4">Çalışma Saatleri</th>
                <th className="py-3 px-4">Durum</th>
                <th className="py-3 px-4 text-right">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EFECE5]">
              {branches.map((b) => (
                <tr key={b.id} className="hover:bg-[#FAF9F6]">
                  <td className="py-2.5 px-4 font-medium text-[#1B1E1C]">{b.name}</td>
                  <td className="py-2.5 px-4 text-[#7A756B]">{b.district} / {b.city}</td>
                  <td className="py-2.5 px-4 text-[#7A756B]">{b.phone}</td>
                  <td className="py-2.5 px-4 text-[#7A756B]">{b.whatsApp}</td>
                  <td className="py-2.5 px-4 text-[#7A756B]">{b.workingHours}</td>
                  <td className="py-2.5 px-4">
                    {b.isActive ? (
                      <span className="text-[10px] bg-[#E8F5E9] text-[#2E7D32] px-1.5 py-0.5 rounded font-medium">
                        Aktif
                      </span>
                    ) : (
                      <span className="text-[10px] bg-[#ECEFF1] text-[#546E7A] px-1.5 py-0.5 rounded font-medium">
                        Pasif
                      </span>
                    )}
                  </td>
                  <td className="py-2.5 px-4 text-right space-x-2">
                    <button
                      onClick={() => handleOpenEdit(b)}
                      className="p-1 text-[#4A5D4E] hover:text-black"
                      title="Düzenle"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(b.id)}
                      className="p-1 text-[#C56868] hover:text-red-700"
                      title="Sil"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && editing && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white max-w-2xl w-full p-6 sm:p-8 border border-[#DDD6C8] my-8 space-y-5">
            <div className="flex items-center justify-between border-b border-[#EFECE5] pb-4">
              <h3 className="font-serif text-xl text-[#1B1E1C]">
                {editing.id ? 'Şubeyi Düzenle' : 'Yeni Şube Ekle'}
              </h3>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setEditing(null);
                }}
                className="text-[#888] hover:text-black"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="block uppercase tracking-wider text-[#6A655C] mb-1 font-medium">
                  Şube Adı *
                </label>
                <input
                  type="text"
                  required
                  value={editing.name || ''}
                  onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                  className="w-full border border-[#DDD8CE] px-3 py-2 text-xs focus:outline-none focus:border-[#2B382D]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block uppercase tracking-wider text-[#6A655C] mb-1 font-medium">
                    İlçe
                  </label>
                  <input
                    type="text"
                    value={editing.district || ''}
                    onChange={(e) => setEditing({ ...editing, district: e.target.value })}
                    className="w-full border border-[#DDD8CE] px-3 py-2 text-xs focus:outline-none focus:border-[#2B382D]"
                  />
                </div>
                <div>
                  <label className="block uppercase tracking-wider text-[#6A655C] mb-1 font-medium">
                    Şehir
                  </label>
                  <input
                    type="text"
                    value={editing.city || ''}
                    onChange={(e) => setEditing({ ...editing, city: e.target.value })}
                    className="w-full border border-[#DDD8CE] px-3 py-2 text-xs focus:outline-none focus:border-[#2B382D]"
                  />
                </div>
              </div>

              <div>
                <label className="block uppercase tracking-wider text-[#6A655C] mb-1 font-medium">
                  Açık Adres *
                </label>
                <input
                  type="text"
                  required
                  value={editing.address || ''}
                  onChange={(e) => setEditing({ ...editing, address: e.target.value })}
                  className="w-full border border-[#DDD8CE] px-3 py-2 text-xs focus:outline-none focus:border-[#2B382D]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block uppercase tracking-wider text-[#6A655C] mb-1 font-medium">
                    Telefon *
                  </label>
                  <input
                    type="text"
                    required
                    value={editing.phone || ''}
                    onChange={(e) => setEditing({ ...editing, phone: e.target.value })}
                    className="w-full border border-[#DDD8CE] px-3 py-2 text-xs focus:outline-none focus:border-[#2B382D]"
                  />
                </div>
                <div>
                  <label className="block uppercase tracking-wider text-[#6A655C] mb-1 font-medium">
                    WhatsApp Numarası
                  </label>
                  <input
                    type="text"
                    value={editing.whatsApp || ''}
                    onChange={(e) => setEditing({ ...editing, whatsApp: e.target.value })}
                    className="w-full border border-[#DDD8CE] px-3 py-2 text-xs focus:outline-none focus:border-[#2B382D]"
                  />
                </div>
              </div>

              <div>
                <label className="block uppercase tracking-wider text-[#6A655C] mb-1 font-medium">
                  Çalışma Saatleri
                </label>
                <input
                  type="text"
                  value={editing.workingHours || ''}
                  onChange={(e) => setEditing({ ...editing, workingHours: e.target.value })}
                  className="w-full border border-[#DDD8CE] px-3 py-2 text-xs focus:outline-none focus:border-[#2B382D]"
                />
              </div>

              <div>
                <label className="block uppercase tracking-wider text-[#6A655C] mb-1 font-medium">
                  Google Harita Bağlantısı (URL)
                </label>
                <input
                  type="text"
                  value={editing.googleMapsUrl || ''}
                  onChange={(e) => setEditing({ ...editing, googleMapsUrl: e.target.value })}
                  className="w-full border border-[#DDD8CE] px-3 py-2 text-xs focus:outline-none focus:border-[#2B382D]"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-[#EFECE5]">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setEditing(null);
                  }}
                  className="px-4 py-2 border border-[#DDD8CE] text-xs uppercase tracking-wider text-[#666] hover:bg-neutral-50"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#2B382D] text-[#FAF9F5] text-xs uppercase tracking-wider font-medium hover:bg-[#1E261F]"
                >
                  Kaydet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};
