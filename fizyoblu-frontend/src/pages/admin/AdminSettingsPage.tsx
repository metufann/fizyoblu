import React, { useEffect, useState } from 'react';
import { AdminLayout } from '../../components/AdminLayout';
import { api } from '../../services/api';
import { Save } from 'lucide-react';
import type { SiteSettings } from '../../types';

export const AdminSettingsPage: React.FC = () => {
  const [settings, setSettings] = useState<SiteSettings>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ text: string; error?: boolean } | null>(null);

  useEffect(() => {
    api.getSettings()
      .then((res) => {
        if (res.success) setSettings(res.data);
      })
      .catch((err) => setMessage({ text: err.message, error: true }))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (key: string, value: string) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const res = await api.updateSettings(settings);
      if (res.success) {
        setMessage({ text: 'Site ayarları başarıyla kaydedildi. Değişiklikler anında yayına yansıdı.' });
      }
    } catch (err: any) {
      setMessage({ text: err.message, error: true });
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout title="Site ve İçerik Ayarları" subtitle="Ana sayfa, iletişim, sosyal medya ve SEO içeriklerinin dinamik yönetimi">
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

      {loading ? (
        <p className="text-xs text-[#736E65]">Ayarlar yükleniyor...</p>
      ) : (
        <form onSubmit={handleSave} className="space-y-8 text-xs max-w-4xl">
          {/* Section 1: Hero & Ana Sayfa */}
          <div className="bg-white border border-[#E5E0D5] p-6 space-y-4">
            <h3 className="font-serif text-lg text-[#1B1E1C] border-b border-[#EFECE5] pb-2">
              Ana Sayfa & Hero Alanı
            </h3>

            <div>
              <label className="block uppercase tracking-wider text-[#6A655C] mb-1 font-medium">
                Hero Üst Başlık (Eyebrow)
              </label>
              <input
                type="text"
                value={settings.hero_eyebrow || ''}
                onChange={(e) => handleChange('hero_eyebrow', e.target.value)}
                className="w-full border border-[#DDD8CE] px-3 py-2 text-xs focus:outline-none focus:border-[#2B382D]"
              />
            </div>

            <div>
              <label className="block uppercase tracking-wider text-[#6A655C] mb-1 font-medium">
                Hero Ana Başlık
              </label>
              <input
                type="text"
                value={settings.hero_title || ''}
                onChange={(e) => handleChange('hero_title', e.target.value)}
                className="w-full border border-[#DDD8CE] px-3 py-2 text-xs focus:outline-none focus:border-[#2B382D]"
              />
            </div>

            <div>
              <label className="block uppercase tracking-wider text-[#6A655C] mb-1 font-medium">
                Hero Alt Açıklama
              </label>
              <textarea
                rows={3}
                value={settings.hero_subtitle || ''}
                onChange={(e) => handleChange('hero_subtitle', e.target.value)}
                className="w-full border border-[#DDD8CE] px-3 py-2 text-xs focus:outline-none focus:border-[#2B382D]"
              />
            </div>

            <div>
              <label className="block uppercase tracking-wider text-[#6A655C] mb-1 font-medium">
                Hero Görsel URL
              </label>
              <input
                type="text"
                value={settings.hero_image || ''}
                onChange={(e) => handleChange('hero_image', e.target.value)}
                className="w-full border border-[#DDD8CE] px-3 py-2 text-xs focus:outline-none focus:border-[#2B382D]"
              />
            </div>

            <div>
              <label className="block uppercase tracking-wider text-[#6A655C] mb-1 font-medium">
                Yaklaşımımız Bölümü Başlığı
              </label>
              <input
                type="text"
                value={settings.about_preview_title || ''}
                onChange={(e) => handleChange('about_preview_title', e.target.value)}
                className="w-full border border-[#DDD8CE] px-3 py-2 text-xs focus:outline-none focus:border-[#2B382D]"
              />
            </div>

            <div>
              <label className="block uppercase tracking-wider text-[#6A655C] mb-1 font-medium">
                Yaklaşımımız Bölümü Açıklama Metni
              </label>
              <textarea
                rows={4}
                value={settings.about_preview_text || ''}
                onChange={(e) => handleChange('about_preview_text', e.target.value)}
                className="w-full border border-[#DDD8CE] px-3 py-2 text-xs focus:outline-none focus:border-[#2B382D]"
              />
            </div>
          </div>

          {/* Section 2: İletişim Bilgileri */}
          <div className="bg-white border border-[#E5E0D5] p-6 space-y-4">
            <h3 className="font-serif text-lg text-[#1B1E1C] border-b border-[#EFECE5] pb-2">
              Genel İletişim Bilgileri
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block uppercase tracking-wider text-[#6A655C] mb-1 font-medium">
                  Merkez Telefon
                </label>
                <input
                  type="text"
                  value={settings.contact_phone || ''}
                  onChange={(e) => handleChange('contact_phone', e.target.value)}
                  className="w-full border border-[#DDD8CE] px-3 py-2 text-xs focus:outline-none focus:border-[#2B382D]"
                />
              </div>

              <div>
                <label className="block uppercase tracking-wider text-[#6A655C] mb-1 font-medium">
                  Merkez WhatsApp Hattı
                </label>
                <input
                  type="text"
                  value={settings.contact_whatsapp || ''}
                  onChange={(e) => handleChange('contact_whatsapp', e.target.value)}
                  className="w-full border border-[#DDD8CE] px-3 py-2 text-xs focus:outline-none focus:border-[#2B382D]"
                />
              </div>
            </div>

            <div>
              <label className="block uppercase tracking-wider text-[#6A655C] mb-1 font-medium">
                E-posta Adresi
              </label>
              <input
                type="email"
                value={settings.contact_email || ''}
                onChange={(e) => handleChange('contact_email', e.target.value)}
                className="w-full border border-[#DDD8CE] px-3 py-2 text-xs focus:outline-none focus:border-[#2B382D]"
              />
            </div>
          </div>

          {/* Section 3: Sosyal Medya */}
          <div className="bg-white border border-[#E5E0D5] p-6 space-y-4">
            <h3 className="font-serif text-lg text-[#1B1E1C] border-b border-[#EFECE5] pb-2">
              Sosyal Medya Bağlantıları
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block uppercase tracking-wider text-[#6A655C] mb-1 font-medium">
                  Instagram Linki
                </label>
                <input
                  type="text"
                  value={settings.social_instagram || ''}
                  onChange={(e) => handleChange('social_instagram', e.target.value)}
                  className="w-full border border-[#DDD8CE] px-3 py-2 text-xs focus:outline-none focus:border-[#2B382D]"
                />
              </div>

              <div>
                <label className="block uppercase tracking-wider text-[#6A655C] mb-1 font-medium">
                  LinkedIn Linki
                </label>
                <input
                  type="text"
                  value={settings.social_linkedin || ''}
                  onChange={(e) => handleChange('social_linkedin', e.target.value)}
                  className="w-full border border-[#DDD8CE] px-3 py-2 text-xs focus:outline-none focus:border-[#2B382D]"
                />
              </div>
            </div>
          </div>

          {/* Section 4: SEO */}
          <div className="bg-white border border-[#E5E0D5] p-6 space-y-4">
            <h3 className="font-serif text-lg text-[#1B1E1C] border-b border-[#EFECE5] pb-2">
              Varsayılan SEO Meta Bilgileri
            </h3>

            <div>
              <label className="block uppercase tracking-wider text-[#6A655C] mb-1 font-medium">
                Varsayılan Meta Title
              </label>
              <input
                type="text"
                value={settings.meta_title || ''}
                onChange={(e) => handleChange('meta_title', e.target.value)}
                className="w-full border border-[#DDD8CE] px-3 py-2 text-xs focus:outline-none focus:border-[#2B382D]"
              />
            </div>

            <div>
              <label className="block uppercase tracking-wider text-[#6A655C] mb-1 font-medium">
                Varsayılan Meta Description
              </label>
              <textarea
                rows={3}
                value={settings.meta_description || ''}
                onChange={(e) => handleChange('meta_description', e.target.value)}
                className="w-full border border-[#DDD8CE] px-3 py-2 text-xs focus:outline-none focus:border-[#2B382D]"
              />
            </div>
          </div>

          {/* Save Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center px-6 py-3 bg-[#2B382D] text-[#FAF9F5] text-xs font-medium uppercase tracking-wider hover:bg-[#1E261F] transition-all disabled:opacity-50"
            >
              <Save className="w-3.5 h-3.5 mr-1.5" />
              <span>{saving ? 'Kaydediliyor...' : 'Tüm Ayarları Kaydet'}</span>
            </button>
          </div>
        </form>
      )}
    </AdminLayout>
  );
};
