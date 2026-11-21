import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import type { SiteSettings, Branch } from '../types';

interface FooterProps {
  settings?: SiteSettings;
  branches?: Branch[];
}

export const Footer: React.FC<FooterProps> = ({ settings, branches }) => {
  const currentYear = new Date().getFullYear();
  const phone = settings?.contact_phone || '+90 (212) 444 89 20';
  const email = settings?.contact_email || 'info@fizyoblu.com';
  const whatsapp = settings?.contact_whatsapp || '+90 (532) 123 45 67';
  const cleanWhatsapp = whatsapp.replace(/[^0-9]/g, '');

  return (
    <footer className="bg-[#181B19] text-[#E0DCD4] pt-20 pb-12 border-t border-[#2A2E2B]">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 pb-16 border-b border-[#2A2E2B]">
          {/* Brand Col */}
          <div className="space-y-4">
            <Link to="/" className="inline-block group">
              <img
                src="/logo/fizyoblu-logo-complete-white.svg"
                alt="FizyoBlu - By Fizyoterapist Sağlıklı Yaşam Merkezi"
                className="h-24 w-auto object-contain opacity-95 hover:opacity-100 transition-opacity"
              />
            </Link>
            <p className="text-sm leading-relaxed text-[#9B978F] font-light max-w-sm">
              {settings?.site_description ||
                'Kişiye özel klinik pilates, omurga sağlığı ve fizyoterapi yaklaşımlarıyla bedenin doğal dengesini ve hareket özgürlüğünü inşa ediyoruz.'}
            </p>
            <div className="pt-2 flex items-center space-x-4 text-xs tracking-wider text-[#B8B3A9]">
              {settings?.social_instagram && (
                <a
                  href={settings.social_instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors flex items-center"
                >
                  Instagram <ArrowUpRight className="w-3 h-3 ml-0.5" />
                </a>
              )}
              {settings?.social_linkedin && (
                <a
                  href={settings.social_linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors flex items-center"
                >
                  LinkedIn <ArrowUpRight className="w-3 h-3 ml-0.5" />
                </a>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold tracking-[0.2em] uppercase text-[#D2CCC0]">
              Keşfedin
            </h4>
            <ul className="space-y-2.5 text-sm text-[#9B978F]">
              <li>
                <Link to="/hakkimizda" className="hover:text-[#FAF9F5] transition-colors">
                  Hakkımızda & Yaklaşımımız
                </Link>
              </li>
              <li>
                <Link to="/hizmetler" className="hover:text-[#FAF9F5] transition-colors">
                  Klinik Hizmetler
                </Link>
              </li>
              <li>
                <Link to="/ekibimiz" className="hover:text-[#FAF9F5] transition-colors">
                  Fizyoterapistlerimiz
                </Link>
              </li>
              <li>
                <Link to="/subeler" className="hover:text-[#FAF9F5] transition-colors">
                  Stüdyo & Şubelerimiz
                </Link>
              </li>
              <li>
                <Link to="/blog" className="hover:text-[#FAF9F5] transition-colors">
                  Omurga Sağlığı Yazıları
                </Link>
              </li>
              <li>
                <Link to="/galeri" className="hover:text-[#FAF9F5] transition-colors">
                  Stüdyo Galerisi
                </Link>
              </li>
            </ul>
          </div>

          {/* Branches Contact */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold tracking-[0.2em] uppercase text-[#D2CCC0]">
              Şubelerimiz
            </h4>
            <div className="space-y-4 text-sm text-[#9B978F]">
              {branches && branches.length > 0 ? (
                branches.map((b) => (
                  <div key={b.id} className="border-b border-[#2A2E2B]/60 pb-3 last:border-0 last:pb-0">
                    <p className="font-medium text-[#FAF9F5] text-xs tracking-wider uppercase mb-1">
                      {b.name}
                    </p>
                    <p className="text-xs leading-relaxed text-[#8E8B83] mb-1.5">{b.address}</p>
                    <div className="flex items-center space-x-3 text-xs text-[#B8B3A9]">
                      <a href={`tel:${b.phone.replace(/[^0-9+]/g, '')}`} className="hover:text-white">
                        {b.phone}
                      </a>
                      <span>•</span>
                      <a
                        href={b.googleMapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-white flex items-center"
                      >
                        Harita <ArrowUpRight className="w-2.5 h-2.5 ml-0.5" />
                      </a>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-[#7A766F]">Şube bilgileri yükleniyor...</p>
              )}
            </div>
          </div>

          {/* Central Contact */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold tracking-[0.2em] uppercase text-[#D2CCC0]">
              İletişim & Danışma
            </h4>
            <div className="space-y-2 text-sm text-[#9B978F]">
              <p className="text-xs text-[#8E8B83]">Merkez Telefon:</p>
              <a
                href={`tel:${phone.replace(/[^0-9+]/g, '')}`}
                className="text-base text-[#FAF9F5] hover:text-[#B5C2B4] font-medium block"
              >
                {phone}
              </a>
              <p className="text-xs text-[#8E8B83] pt-2">E-posta:</p>
              <a
                href={`mailto:${email}`}
                className="text-sm text-[#D2CCC0] hover:text-white transition-colors block"
              >
                {email}
              </a>
              <div className="pt-3">
                <a
                  href={`https://wa.me/${cleanWhatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-xs tracking-wider uppercase text-[#B5C2B4] hover:text-white"
                >
                  WhatsApp Hattı <ArrowUpRight className="w-3 h-3 ml-1" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Sub-footer */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#6F6B62] space-y-4 sm:space-y-0">
          <p>© {currentYear} FizyoBlu. Tüm hakları saklıdır. Klinik Pilates & Medikal Egzersiz.</p>
          <div className="flex items-center space-x-6">
            <Link to="/iletisim" className="hover:text-[#9B978F] transition-colors">
              İletişim
            </Link>
            <Link to="/admin/login" className="hover:text-[#9B978F] transition-colors">
              Yönetici Paneli
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
