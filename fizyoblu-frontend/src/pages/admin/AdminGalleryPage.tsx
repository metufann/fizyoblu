import React, { useEffect, useState, useRef } from 'react';
import { AdminLayout } from '../../components/AdminLayout';
import { api } from '../../services/api';
import { Upload, Trash2 } from 'lucide-react';
import type { MediaItem } from '../../types';

export const AdminGalleryPage: React.FC = () => {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<{ text: string; error?: boolean } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Stüdyo');

  const loadMedia = async () => {
    try {
      const res = await api.getAllMedia();
      if (res.success) setItems(res.data);
    } catch (err: any) {
      setMessage({ text: err.message, error: true });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMedia();
  }, []);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fileInputRef.current?.files?.[0]) {
      setMessage({ text: 'Lütfen yüklenecek bir görsel seçin.', error: true });
      return;
    }

    setUploading(true);
    setMessage(null);

    const formData = new FormData();
    formData.append('file', fileInputRef.current.files[0]);
    if (title) formData.append('title', title);
    if (category) formData.append('category', category);
    formData.append('showInGallery', 'true');

    try {
      const res = await api.uploadMedia(formData);
      if (res.success) {
        setMessage({ text: 'Görsel başarıyla yüklendi.' });
        setTitle('');
        if (fileInputRef.current) fileInputRef.current.value = '';
        loadMedia();
      }
    } catch (err: any) {
      setMessage({ text: err.message, error: true });
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Bu görseli silmek istediğinizden emin misiniz?')) return;
    try {
      await api.deleteMedia(id);
      setMessage({ text: 'Görsel silindi.' });
      loadMedia();
    } catch (err: any) {
      setMessage({ text: err.message, error: true });
    }
  };

  return (
    <AdminLayout title="Galeri & Medya Yönetimi" subtitle="Stüdyo fotoğraflarının yüklenmesi ve yönetimi">
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

      {/* Upload Box */}
      <div className="bg-white border border-[#E5E0D5] p-6 mb-8">
        <h3 className="font-serif text-lg text-[#1B1E1C] mb-4">Yeni Görsel Yükle</h3>
        <form onSubmit={handleUpload} className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs items-end">
          <div className="sm:col-span-2">
            <label className="block uppercase tracking-wider text-[#6A655C] mb-1 font-medium">
              Dosya Seç (JPG, PNG, WEBP)
            </label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              required
              className="w-full text-xs text-[#555] file:mr-3 file:py-2 file:px-3 file:border-0 file:text-xs file:bg-[#2B382D] file:text-white file:cursor-pointer"
            />
          </div>

          <div>
            <label className="block uppercase tracking-wider text-[#6A655C] mb-1 font-medium">
              Görsel Başlığı
            </label>
            <input
              type="text"
              placeholder="Örn: Reformer Odası"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border border-[#DDD8CE] px-3 py-2 text-xs focus:outline-none focus:border-[#2B382D]"
            />
          </div>

          <div>
            <label className="block uppercase tracking-wider text-[#6A655C] mb-1 font-medium">
              Kategori
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full border border-[#DDD8CE] px-3 py-2 text-xs focus:outline-none focus:border-[#2B382D]"
            >
              <option value="Stüdyo">Stüdyo</option>
              <option value="Reformer">Reformer</option>
              <option value="Egzersiz">Egzersiz</option>
              <option value="Ekip">Ekip</option>
            </select>
          </div>

          <div className="sm:col-span-4 flex justify-end pt-2">
            <button
              type="submit"
              disabled={uploading}
              className="inline-flex items-center px-5 py-2.5 bg-[#2B382D] text-[#FAF9F5] text-xs font-medium uppercase tracking-wider hover:bg-[#1E261F] transition-all disabled:opacity-50"
            >
              <Upload className="w-3.5 h-3.5 mr-1.5" />
              <span>{uploading ? 'Yükleniyor...' : 'Görseli Yükle'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Gallery Items Grid */}
      {loading ? (
        <p className="text-xs text-[#736E65]">Görseller yükleniyor...</p>
      ) : (
        <div>
          <div className="flex justify-between items-center mb-4">
            <p className="text-xs text-[#736E65]">Toplam {items.length} görsel kayıtlı.</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {items.map((item) => (
              <div key={item.id} className="group bg-white border border-[#E5E0D5] p-2 flex flex-col justify-between">
                <div className="aspect-[4/3] bg-neutral-100 overflow-hidden mb-2 relative">
                  <img src={item.url} alt="" className="w-full h-full object-cover" />
                  <span className="absolute bottom-1.5 left-1.5 bg-black/70 text-white text-[9px] px-1.5 py-0.5 uppercase tracking-wider">
                    {item.category || 'Genel'}
                  </span>
                </div>

                <div className="space-y-1">
                  <p className="text-xs font-medium text-[#1B1E1C] truncate">{item.title || item.fileName}</p>
                  <p className="text-[10px] text-[#888]">
                    {new Date(item.createdAt).toLocaleDateString('tr-TR')}
                  </p>
                </div>

                <div className="pt-2 mt-2 border-t border-[#EFECE5] flex justify-end">
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="text-xs text-[#C56868] hover:text-red-700 flex items-center"
                  >
                    <Trash2 className="w-3.5 h-3.5 mr-1" />
                    <span>Sil</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </AdminLayout>
  );
};
