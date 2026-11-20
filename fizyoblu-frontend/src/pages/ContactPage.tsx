import React, { useState } from 'react';
import { Phone, Mail, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { SEO } from '../components/SEO';
import { api } from '../services/api';
import type { Branch, SiteSettings } from '../types';

interface ContactPageProps {
  settings?: SiteSettings;
  branches?: Branch[];
}

export const ContactPage: React.FC<ContactPageProps> = ({ settings, branches }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    interestedService: '',
    preferredBranch: '',
    message: ''
  });

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const phone = settings?.contact_phone || '+90 (212) 444 89 20';
  const whatsapp = settings?.contact_whatsapp || '+90 (532) 123 45 67';
  const cleanWhatsapp = whatsapp.replace(/[^0-9]/g, '');
  const email = settings?.contact_email || 'info@fizyoblu.com';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const res = await api.sendContactMessage(formData);
      if (res.success) {
        setSubmitted(true);
        setFormData({
          fullName: '',
          email: '',
          phone: '',
          interestedService: '',
          preferredBranch: '',
          message: ''
        });
      }
    } catch (err: any) {
      setError(err.message || 'Mesaj iletilirken bir sorun oluştu.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <SEO
        title="İletişim & Randevu Danışma"
        description="FizyoBlu ile iletişime geçin. Telefon, WhatsApp hattı, şube harita konumları ve iletişim formu."
      />

      <section className="pt-36 pb-20 bg-[#FAF9F5] border-b border-[#E8E4DC]">
        <div className="max-w-4xl mx-auto px-6 sm:px-8 text-center space-y-4">
          <span className="text-[11px] font-semibold tracking-[0.25em] uppercase text-[#6B7566] block">
            BİZE ULAŞIN
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl text-[#1B1E1C] font-normal leading-tight">
            İletişim & Danışma
          </h1>
          <p className="text-base text-[#5A564E] font-light max-w-2xl mx-auto leading-relaxed">
            Seanslarımız, klinik değerlendirme randevusu veya aklınıza takılan her türlü soru için ekibimize ulaşabilirsiniz.
          </p>
        </div>
      </section>

      <section className="py-24 bg-[#FAF9F5]">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            {/* Contact Details & Fast Channels */}
            <div className="lg:col-span-5 space-y-10">
              <div className="space-y-4">
                <h2 className="font-serif text-2xl text-[#1B1E1C]">Hızlı İletişim Kanalları</h2>
                <p className="text-sm text-[#615C53] font-light leading-relaxed">
                  WhatsApp üzerinden uzman fizyoterapistlerimize mesaj atabilir veya telefonla doğrudan arayabilirsiniz.
                </p>
              </div>

              {/* Fast action button */}
              <div>
                <a
                  href={`https://wa.me/${cleanWhatsapp}?text=Merhaba,%20klinik%20pilates%20seanslarınız%20hakkında%20bilgi%20almak%20istiyorum.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center px-6 py-4 bg-[#2B382D] text-[#FAF9F5] text-xs font-medium tracking-[0.15em] uppercase hover:bg-[#1E261F] transition-all"
                >
                  <span>WhatsApp Hattına Yazın</span>
                  <ArrowUpRight className="w-4 h-4 ml-2" />
                </a>
              </div>

              <div className="space-y-6 pt-4 border-t border-[#E8E4DC] text-sm text-[#555148] font-light">
                <div className="flex items-center space-x-3">
                  <Phone className="w-4 h-4 text-[#4A5D4E] shrink-0" />
                  <div>
                    <p className="text-xs text-[#807B72]">Telefon Numarası</p>
                    <a href={`tel:${phone.replace(/[^0-9+]/g, '')}`} className="text-sm font-medium text-[#1B1E1C] hover:underline">
                      {phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Mail className="w-4 h-4 text-[#4A5D4E] shrink-0" />
                  <div>
                    <p className="text-xs text-[#807B72]">E-posta Adresi</p>
                    <a href={`mailto:${email}`} className="text-sm font-medium text-[#1B1E1C] hover:underline">
                      {email}
                    </a>
                  </div>
                </div>
              </div>

              {/* Branches summary */}
              <div className="pt-6 border-t border-[#E8E4DC] space-y-4">
                <h3 className="font-serif text-lg text-[#1B1E1C]">Şubelerimiz</h3>
                {branches && branches.map((b) => (
                  <div key={b.id} className="text-xs text-[#6A655C] space-y-1">
                    <p className="font-medium text-[#1B1E1C]">{b.name}</p>
                    <p className="font-light">{b.address}</p>
                    <a
                      href={b.googleMapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#3B4C3E] underline inline-flex items-center pt-0.5"
                    >
                      Haritada Aç <ArrowUpRight className="w-2.5 h-2.5 ml-0.5" />
                    </a>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-7 bg-[#F7F4EC] p-8 sm:p-12 border border-[#DDD6C8]">
              <h2 className="font-serif text-2xl text-[#1B1E1C] mb-2">Bize Mesaj Gönderin</h2>
              <p className="text-xs text-[#736E65] font-light mb-8">
                Formu doldurduğunuzda en geç 24 saat içerisinde size geri dönüş sağlayacağız.
              </p>

              {submitted ? (
                <div className="py-12 text-center space-y-4">
                  <CheckCircle2 className="w-12 h-12 text-[#4A5D4E] mx-auto" />
                  <h3 className="font-serif text-2xl text-[#1B1E1C]">Mesajınız Alındı</h3>
                  <p className="text-sm text-[#615C53] max-w-md mx-auto font-light">
                    Teşekkür ederiz. İlettiğiniz bilgiler doğrultusunda fizyoterapist ekibimiz en kısa sürede sizinle iletişime geçecektir.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="text-xs tracking-wider uppercase text-[#2B382D] underline pt-4"
                  >
                    Yeni bir mesaj gönder
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  {error && (
                    <div className="p-3 bg-[#FBE9E7] text-[#C62828] text-xs">
                      {error}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-[#6A655C] mb-1.5">
                        Adınız Soyadınız *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        className="w-full bg-[#FAF9F5] border border-[#DDD8CE] px-3.5 py-2.5 text-xs text-[#222] focus:outline-none focus:border-[#2B382D]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs uppercase tracking-wider text-[#6A655C] mb-1.5">
                        Telefon Numaranız *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="05XX XXX XX XX"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full bg-[#FAF9F5] border border-[#DDD8CE] px-3.5 py-2.5 text-xs text-[#222] focus:outline-none focus:border-[#2B382D]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#6A655C] mb-1.5">
                      E-posta Adresiniz *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-[#FAF9F5] border border-[#DDD8CE] px-3.5 py-2.5 text-xs text-[#222] focus:outline-none focus:border-[#2B382D]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-[#6A655C] mb-1.5">
                        İlgilendiğiniz Hizmet
                      </label>
                      <select
                        value={formData.interestedService}
                        onChange={(e) => setFormData({ ...formData, interestedService: e.target.value })}
                        className="w-full bg-[#FAF9F5] border border-[#DDD8CE] px-3.5 py-2.5 text-xs text-[#222] focus:outline-none focus:border-[#2B382D]"
                      >
                        <option value="">Seçiniz (Opsiyonel)</option>
                        <option value="Klinik Pilates">Klinik Pilates</option>
                        <option value="Reformer Pilates">Reformer Pilates</option>
                        <option value="Manuel Terapi">Manuel Terapi</option>
                        <option value="Skolyoz Egzersizleri">Skolyoz & Omurga Egzersizleri</option>
                        <option value="Hamile Pilatesi">Hamile Pilatesi</option>
                        <option value="Postür Analizi">Postür Analizi</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs uppercase tracking-wider text-[#6A655C] mb-1.5">
                        Tercih Ettiğiniz Şube
                      </label>
                      <select
                        value={formData.preferredBranch}
                        onChange={(e) => setFormData({ ...formData, preferredBranch: e.target.value })}
                        className="w-full bg-[#FAF9F5] border border-[#DDD8CE] px-3.5 py-2.5 text-xs text-[#222] focus:outline-none focus:border-[#2B382D]"
                      >
                        <option value="">Fark etmez</option>
                        <option value="Kadıköy / Moda Şubesi">Kadıköy / Moda</option>
                        <option value="Nişantaşı Şubesi">Nişantaşı</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#6A655C] mb-1.5">
                      Mesajınız *
                    </label>
                    <textarea
                      required
                      rows={5}
                      placeholder="Şikayetleriniz veya sormak istedikleriniz..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full bg-[#FAF9F5] border border-[#DDD8CE] px-3.5 py-2.5 text-xs text-[#222] focus:outline-none focus:border-[#2B382D]"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3.5 bg-[#2B382D] text-[#FAF9F5] text-xs font-medium tracking-[0.15em] uppercase hover:bg-[#1E261F] transition-all disabled:opacity-50"
                  >
                    {submitting ? 'Gönderiliyor...' : 'Mesajı İlet'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
