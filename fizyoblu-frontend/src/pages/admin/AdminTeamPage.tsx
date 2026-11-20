import React, { useEffect, useState } from 'react';
import { AdminLayout } from '../../components/AdminLayout';
import { api } from '../../services/api';
import { Plus, Edit2, Trash2, X } from 'lucide-react';
import type { TeamMember } from '../../types';

export const AdminTeamPage: React.FC = () => {
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Partial<TeamMember> | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [message, setMessage] = useState<{ text: string; error?: boolean } | null>(null);

  const loadTeam = async () => {
    try {
      const res = await api.getAdminTeam();
      if (res.success) setTeam(res.data);
    } catch (err: any) {
      setMessage({ text: err.message, error: true });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTeam();
  }, []);

  const handleOpenCreate = () => {
    setEditing({
      fullName: '',
      title: 'Fizyoterapist & Klinik Pilates Eğitmeni',
      bio: '',
      imageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80',
      specialities: '',
      order: team.length + 1,
      isActive: true
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (member: TeamMember) => {
    setEditing({ ...member });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Bu ekip üyesini silmek istediğinizden emin misiniz?')) return;
    try {
      await api.deleteTeamMember(id);
      setMessage({ text: 'Ekip üyesi silindi.' });
      loadTeam();
    } catch (err: any) {
      setMessage({ text: err.message, error: true });
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;

    try {
      if (editing.id) {
        await api.updateTeamMember(editing.id, editing);
        setMessage({ text: 'Ekip üyesi güncellendi.' });
      } else {
        await api.createTeamMember(editing);
        setMessage({ text: 'Ekip üyesi eklendi.' });
      }
      setIsModalOpen(false);
      setEditing(null);
      loadTeam();
    } catch (err: any) {
      setMessage({ text: err.message, error: true });
    }
  };

  return (
    <AdminLayout title="Ekip Yönetimi" subtitle="Fizyoterapistler ve stüdyo eğitmen kadrosu">
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
        <p className="text-xs text-[#736E65]">Toplam {team.length} ekip üyesi listeleniyor.</p>
        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center px-4 py-2 bg-[#2B382D] text-[#FAF9F5] text-xs font-medium uppercase tracking-wider hover:bg-[#1E261F] transition-colors"
        >
          <Plus className="w-3.5 h-3.5 mr-1.5" />
          <span>Yeni Üye Ekle</span>
        </button>
      </div>

      {loading ? (
        <p className="text-xs text-[#736E65]">Yükleniyor...</p>
      ) : (
        <div className="bg-white border border-[#E5E0D5] overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8F6F2] border-b border-[#E5E0D5] text-[#6A655C] uppercase tracking-wider font-semibold">
              <tr>
                <th className="py-3 px-4">Fotoğraf</th>
                <th className="py-3 px-4">Ad Soyad</th>
                <th className="py-3 px-4">Unvan</th>
                <th className="py-3 px-4">Uzmanlık Alanları</th>
                <th className="py-3 px-4">Durum</th>
                <th className="py-3 px-4 text-right">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EFECE5]">
              {team.map((m) => (
                <tr key={m.id} className="hover:bg-[#FAF9F6]">
                  <td className="py-2.5 px-4">
                    <img
                      src={m.imageUrl}
                      alt={m.fullName}
                      className="w-10 h-10 object-cover rounded-full bg-neutral-100"
                    />
                  </td>
                  <td className="py-2.5 px-4 font-medium text-[#1B1E1C]">{m.fullName}</td>
                  <td className="py-2.5 px-4 text-[#7A756B]">{m.title}</td>
                  <td className="py-2.5 px-4 text-[#7A756B]">{m.specialities || '-'}</td>
                  <td className="py-2.5 px-4">
                    {m.isActive ? (
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
                      onClick={() => handleOpenEdit(m)}
                      className="p-1 text-[#4A5D4E] hover:text-black"
                      title="Düzenle"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(m.id)}
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
                {editing.id ? 'Ekip Üyesini Düzenle' : 'Yeni Ekip Üyesi Ekle'}
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
                  Ad Soyad *
                </label>
                <input
                  type="text"
                  required
                  value={editing.fullName || ''}
                  onChange={(e) => setEditing({ ...editing, fullName: e.target.value })}
                  className="w-full border border-[#DDD8CE] px-3 py-2 text-xs focus:outline-none focus:border-[#2B382D]"
                />
              </div>

              <div>
                <label className="block uppercase tracking-wider text-[#6A655C] mb-1 font-medium">
                  Unvan & Rol *
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
                  Fotoğraf URL *
                </label>
                <input
                  type="text"
                  required
                  value={editing.imageUrl || ''}
                  onChange={(e) => setEditing({ ...editing, imageUrl: e.target.value })}
                  className="w-full border border-[#DDD8CE] px-3 py-2 text-xs focus:outline-none focus:border-[#2B382D]"
                />
              </div>

              <div>
                <label className="block uppercase tracking-wider text-[#6A655C] mb-1 font-medium">
                  Biyografi & Eğitim Geçmişi *
                </label>
                <textarea
                  required
                  rows={4}
                  value={editing.bio || ''}
                  onChange={(e) => setEditing({ ...editing, bio: e.target.value })}
                  className="w-full border border-[#DDD8CE] px-3 py-2 text-xs focus:outline-none focus:border-[#2B382D]"
                />
              </div>

              <div>
                <label className="block uppercase tracking-wider text-[#6A655C] mb-1 font-medium">
                  Uzmanlık Alanları (Virgülle ayırarak yazabilirsiniz)
                </label>
                <input
                  type="text"
                  placeholder="Klinik Pilates, Omurga Rehabilitasyonu, Manuel Terapi"
                  value={editing.specialities || ''}
                  onChange={(e) => setEditing({ ...editing, specialities: e.target.value })}
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
