import React, { useEffect, useState } from 'react';
import { AdminLayout } from '../../components/AdminLayout';
import { TipTapEditor } from '../../components/TipTapEditor';
import { api } from '../../services/api';
import { Plus, Edit2, Trash2, X } from 'lucide-react';
import type { BlogPost, Category } from '../../types';

export const AdminBlogPage: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Partial<BlogPost> | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [message, setMessage] = useState<{ text: string; error?: boolean } | null>(null);

  const loadData = async () => {
    try {
      const [postsRes, catsRes] = await Promise.all([
        api.getAdminBlogPosts(),
        api.getCategories()
      ]);
      if (postsRes.success) setPosts(postsRes.data);
      if (catsRes.success) setCategories(catsRes.data);
    } catch (err: any) {
      setMessage({ text: err.message, error: true });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenCreate = () => {
    setEditing({
      title: '',
      slug: '',
      summary: '',
      content: '<p>Yazınızı buraya yazabilirsiniz...</p>',
      coverImageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=1200&q=80',
      categoryId: categories[0]?.id,
      author: 'FizyoBlu Uzman Ekibi',
      readTimeMinutes: 4,
      metaTitle: '',
      metaDescription: '',
      isPublished: true,
      isFeatured: false
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (post: BlogPost) => {
    setEditing({ ...post });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Bu blog yazısını silmek istediğinizden emin misiniz?')) return;
    try {
      await api.deleteBlogPost(id);
      setMessage({ text: 'Yazı silindi.' });
      loadData();
    } catch (err: any) {
      setMessage({ text: err.message, error: true });
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;

    try {
      if (editing.id) {
        await api.updateBlogPost(editing.id, editing);
        setMessage({ text: 'Yazı güncellendi.' });
      } else {
        await api.createBlogPost(editing);
        setMessage({ text: 'Yazı yayınlandı.' });
      }
      setIsModalOpen(false);
      setEditing(null);
      loadData();
    } catch (err: any) {
      setMessage({ text: err.message, error: true });
    }
  };

  return (
    <AdminLayout title="Blog ve İçerik Yönetimi" subtitle="TipTap zengin metin editörü ile omurga sağlığı makaleleri">
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
        <p className="text-xs text-[#736E65]">Toplam {posts.length} yazı bulunuyor.</p>
        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center px-4 py-2 bg-[#2B382D] text-[#FAF9F5] text-xs font-medium uppercase tracking-wider hover:bg-[#1E261F] transition-colors"
        >
          <Plus className="w-3.5 h-3.5 mr-1.5" />
          <span>Yeni Yazı Yaz</span>
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
                <th className="py-3 px-4">Başlık</th>
                <th className="py-3 px-4">Kategori</th>
                <th className="py-3 px-4">Yazar</th>
                <th className="py-3 px-4">Tarih</th>
                <th className="py-3 px-4">Durum</th>
                <th className="py-3 px-4 text-right">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EFECE5]">
              {posts.map((p) => (
                <tr key={p.id} className="hover:bg-[#FAF9F6]">
                  <td className="py-2.5 px-4">
                    <img
                      src={p.coverImageUrl}
                      alt=""
                      className="w-12 h-8 object-cover bg-neutral-100"
                    />
                  </td>
                  <td className="py-2.5 px-4 font-medium text-[#1B1E1C] max-w-xs truncate">{p.title}</td>
                  <td className="py-2.5 px-4 text-[#7A756B]">{p.categoryName || '-'}</td>
                  <td className="py-2.5 px-4 text-[#7A756B]">{p.author}</td>
                  <td className="py-2.5 px-4 text-[#7A756B]">
                    {new Date(p.publishedAt).toLocaleDateString('tr-TR')}
                  </td>
                  <td className="py-2.5 px-4">
                    {p.isPublished ? (
                      <span className="text-[10px] bg-[#E8F5E9] text-[#2E7D32] px-1.5 py-0.5 rounded font-medium">
                        Yayında
                      </span>
                    ) : (
                      <span className="text-[10px] bg-[#ECEFF1] text-[#546E7A] px-1.5 py-0.5 rounded font-medium">
                        Taslak
                      </span>
                    )}
                  </td>
                  <td className="py-2.5 px-4 text-right space-x-2">
                    <button
                      onClick={() => handleOpenEdit(p)}
                      className="p-1 text-[#4A5D4E] hover:text-black"
                      title="Düzenle"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(p.id)}
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

      {/* TipTap Modal */}
      {isModalOpen && editing && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white max-w-4xl w-full p-6 sm:p-8 border border-[#DDD6C8] my-8 space-y-5">
            <div className="flex items-center justify-between border-b border-[#EFECE5] pb-4">
              <h3 className="font-serif text-xl text-[#1B1E1C]">
                {editing.id ? 'Blog Yazısını Düzenle' : 'Yeni Blog Yazısı Oluştur'}
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block uppercase tracking-wider text-[#6A655C] mb-1 font-medium">
                    Yazı Başlığı *
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
                    Kategori
                  </label>
                  <select
                    value={editing.categoryId || ''}
                    onChange={(e) => setEditing({ ...editing, categoryId: parseInt(e.target.value) || undefined })}
                    className="w-full border border-[#DDD8CE] px-3 py-2 text-xs focus:outline-none focus:border-[#2B382D]"
                  >
                    <option value="">Seçiniz</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block uppercase tracking-wider text-[#6A655C] mb-1 font-medium">
                  Kısa Özet *
                </label>
                <textarea
                  required
                  rows={2}
                  value={editing.summary || ''}
                  onChange={(e) => setEditing({ ...editing, summary: e.target.value })}
                  className="w-full border border-[#DDD8CE] px-3 py-2 text-xs focus:outline-none focus:border-[#2B382D]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block uppercase tracking-wider text-[#6A655C] mb-1 font-medium">
                    Kapak Görseli URL *
                  </label>
                  <input
                    type="text"
                    required
                    value={editing.coverImageUrl || ''}
                    onChange={(e) => setEditing({ ...editing, coverImageUrl: e.target.value })}
                    className="w-full border border-[#DDD8CE] px-3 py-2 text-xs focus:outline-none focus:border-[#2B382D]"
                  />
                </div>

                <div>
                  <label className="block uppercase tracking-wider text-[#6A655C] mb-1 font-medium">
                    Yazar
                  </label>
                  <input
                    type="text"
                    value={editing.author || ''}
                    onChange={(e) => setEditing({ ...editing, author: e.target.value })}
                    className="w-full border border-[#DDD8CE] px-3 py-2 text-xs focus:outline-none focus:border-[#2B382D]"
                  />
                </div>
              </div>

              {/* TipTap Rich Text Editor */}
              <div>
                <label className="block uppercase tracking-wider text-[#6A655C] mb-1 font-medium">
                  Yazı İçeriği (TipTap Editör) *
                </label>
                <TipTapEditor
                  content={editing.content || '<p></p>'}
                  onChange={(html) => setEditing({ ...editing, content: html })}
                />
              </div>

              {/* SEO Inputs */}
              <div className="p-4 bg-[#F8F6F2] border border-[#E5E0D5] space-y-3">
                <h4 className="font-medium text-[#444] uppercase tracking-wider text-[11px]">
                  SEO Ayarları (Opsiyonel)
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[#6A655C] mb-1">Meta Title</label>
                    <input
                      type="text"
                      placeholder="Sayfa başlığı..."
                      value={editing.metaTitle || ''}
                      onChange={(e) => setEditing({ ...editing, metaTitle: e.target.value })}
                      className="w-full border border-[#DDD8CE] bg-white px-3 py-1.5 text-xs focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[#6A655C] mb-1">Meta Description</label>
                    <input
                      type="text"
                      placeholder="Arama motoru açıklaması..."
                      value={editing.metaDescription || ''}
                      onChange={(e) => setEditing({ ...editing, metaDescription: e.target.value })}
                      className="w-full border border-[#DDD8CE] bg-white px-3 py-1.5 text-xs focus:outline-none"
                    />
                  </div>
                </div>
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
                  Kaydet & Yayınla
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};
