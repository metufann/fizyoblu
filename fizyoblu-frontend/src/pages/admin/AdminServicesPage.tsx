import React, { useEffect, useState } from 'react';
import { AdminLayout } from '../../components/AdminLayout';
import { api } from '../../services/api';
import { Plus, Edit2, Trash2, X } from 'lucide-react';
import type { Service } from '../../types';

export const AdminServicesPage: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Partial<Service> | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [message, setMessage] = useState<{ text: string; error?: boolean } | null>(null);

  const loadServices = async () => {
    try {
      const res = await api.getAdminServices();
      if (res.success) setServices(res.data);
    } catch (err: any) {
      setMessage({ text: err.message, error: true });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadServices();
  }, []);

  const handleOpenCreate = () => {
    setEditing({
      title: '',
      slug: '',
      summary: '',
      description: '',
      imageUrl: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1200&q=80',
      order: services.length + 1,
      isActive: true,
      isFeatured: false,
      metaDescription: ''
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (service: Service) => {
    setEditing({ ...service });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Bu hizmeti silmek istediğinizden emin misiniz?')) return;
    try {
      await api.deleteService(id);
      setMessage({ text: 'Hizmet silindi.' });
      loadServices();
    } catch (err: any) {
      setMessage({ text: err.message, error: true });
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;

    try {
      if (editing.id) {
        await api.updateService(editing.id, editing);
        setMessage({ text: 'Hizmet güncellendi.' });
      } else {
        await api.createService(editing);
        setMessage({ text: 'Hizmet eklendi.' });
      }
      setIsModalOpen(false);
      setEditing(null);
      loadServices();
    } catch (err: any) {
      setMessage({ text: err.message, error: true });
    }
  };

  return (
    <AdminLayout title="Hizmetler Yönetimi" subtitle="Klinik pilates ve fizyoterapi hizmetlerinin CRUD işlemleri">
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
        <p className="text-xs text-[#736E65]">Toplam {services.length} hizmet listeleniyor.</p>
        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center px-4 py-2 bg-[#2B382D] text-[#FAF9F5] text-xs font-medium uppercase tracking-wider hover:bg-[#1E261F] transition-colors"
        >
          <Plus className="w-3.5 h-3.5 mr-1.5" />
          <span>Yeni Hizmet Ekle</span>
        </button>
      </div>

      {loading ? (
        <p className="text-xs text-[#736E65]">Yükleniyor...</p>
      ) : (
        <div className="bg-white border border-[#E5E0D5] overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8F6F2] border-b border-[#E5E0D5] text-[#6A655C] uppercase tracking-wider font-semibold">
              <tr>
                <th className="py-3 px-4">Görsel</th>
                <th className="py-3 px-4">Hizmet Başlığı</th>
                <th className="py-3 px-4">Slug</th>
                <th className="py-3 px-4">Sıra</th>
                <th className="py-3 px-4">Öne Çıkan</th>
                <th className="py-3 px-4">Durum</th>
                <th className="py-3 px-4 text-right">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EFECE5]">
              {services.map((s) => (
                <tr key={s.id} className="hover:bg-[#FAF9F6]">
                  <td className="py-2.5 px-4">
                    <img
                      src={s.imageUrl || 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1200&q=80'}
                      alt=""
                      className="w-12 h-8 object-cover bg-neutral-100"
                    />
                  </td>
                  <td className="py-2.5 px-4 font-medium text-[#1B1E1C]">
                    <div>{s.title}</div>
                    {s.complianceNotes && (
                      <span className="text-[9px] bg-amber-50 text-amber-800 border border-amber-200 px-1 py-0.5 rounded font-medium mt-1 inline-block">
                        Mevzuat Notu
                      </span>
                    )}
                  </td>
                  <td className="py-2.5 px-4 text-[#7A756B]">/{s.slug}</td>
                  <td className="py-2.5 px-4 text-[#7A756B]">{s.order}</td>
                  <td className="py-2.5 px-4">
                    {s.isFeatured ? (
                      <span className="text-[10px] bg-[#E8F5E9] text-[#2E7D32] px-1.5 py-0.5 rounded font-medium">
                        Evet
                      </span>
                    ) : (
                      <span className="text-[10px] text-[#A09A8F]">Hayır</span>
                    )}
                  </td>
                  <td className="py-2.5 px-4">
                    {s.isActive ? (
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
                      onClick={() => handleOpenEdit(s)}
                      className="p-1 text-[#4A5D4E] hover:text-black"
                      title="Düzenle"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(s.id)}
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
                {editing.id ? 'Hizmeti Düzenle' : 'Yeni Hizmet Ekle'}
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
                  Hizmet Başlığı *
                </label>
                <input
                  type="text"
                  required
                  value={editing.title || ''}
                  onChange={(e) => setEditing({ ...editing, title: e.target.value })}
                  className="w-full border border-[#DDD8CE] px-3 py-2 text-xs focus:outline-none focus:border-[#2B382D]"
                />
              </div>

              <div>
                <label className="block uppercase tracking-wider text-[#6A655C] mb-1 font-medium">
                  Slug (URL Bağlantısı - Boş bırakılırsa başlıktan üretilir)
                </label>
                <input
                  type="text"
                  value={editing.slug || ''}
                  onChange={(e) => setEditing({ ...editing, slug: e.target.value })}
                  className="w-full border border-[#DDD8CE] px-3 py-2 text-xs focus:outline-none focus:border-[#2B382D]"
                />
              </div>

              <div>
                <label className="block uppercase tracking-wider text-[#6A655C] mb-1 font-medium">
                  Kısa Özet *
                </label>
                <input
                  type="text"
                  required
                  value={editing.summary || ''}
                  onChange={(e) => setEditing({ ...editing, summary: e.target.value })}
                  className="w-full border border-[#DDD8CE] px-3 py-2 text-xs focus:outline-none focus:border-[#2B382D]"
                />
              </div>

              <div>
                <label className="block uppercase tracking-wider text-[#6A655C] mb-1 font-medium">
                  Görsel URL
                </label>
                <input
                  type="text"
                  value={editing.imageUrl || ''}
                  onChange={(e) => setEditing({ ...editing, imageUrl: e.target.value })}
                  className="w-full border border-[#DDD8CE] px-3 py-2 text-xs focus:outline-none focus:border-[#2B382D]"
                />
              </div>

              <div>
                <label className="block uppercase tracking-wider text-[#6A655C] mb-1 font-medium">
                  Detaylı Açıklama *
                </label>
                <textarea
                  required
                  rows={6}
                  value={editing.description || ''}
                  onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                  className="w-full border border-[#DDD8CE] px-3 py-2 text-xs focus:outline-none focus:border-[#2B382D]"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block uppercase tracking-wider text-[#6A655C] mb-1 font-medium">
                    Sıra
                  </label>
                  <input
                    type="number"
                    value={editing.order ?? 0}
                    onChange={(e) => setEditing({ ...editing, order: parseInt(e.target.value) || 0 })}
                    className="w-full border border-[#DDD8CE] px-3 py-2 text-xs focus:outline-none focus:border-[#2B382D]"
                  />
                </div>

                <div className="flex items-center space-x-2 pt-6">
                  <input
                    type="checkbox"
                    id="isFeatured"
                    checked={editing.isFeatured || false}
                    onChange={(e) => setEditing({ ...editing, isFeatured: e.target.checked })}
                    className="rounded"
                  />
                  <label htmlFor="isFeatured" className="text-[#444] cursor-pointer">
                    Öne Çıkarılsın
                  </label>
                </div>

                <div className="flex items-center space-x-2 pt-6">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={editing.isActive ?? true}
                    onChange={(e) => setEditing({ ...editing, isActive: e.target.checked })}
                    className="rounded"
                  />
                  <label htmlFor="isActive" className="text-[#444] cursor-pointer">
                    Aktif
                  </label>
                </div>
              </div>

              <div>
                <label className="block uppercase tracking-wider text-[#6A655C] mb-1 font-medium text-[11px]">
                  Mevzuat & İnceleme Notu (Opsiyonel)
                </label>
                <textarea
                  rows={2}
                  value={editing.complianceNotes || ''}
                  onChange={(e) => setEditing({ ...editing, complianceNotes: e.target.value })}
                  placeholder="Sağlık tanıtım mevzuatı veya hekim inceleme açıklamaları..."
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
