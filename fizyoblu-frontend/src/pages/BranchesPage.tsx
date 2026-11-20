import React, { useEffect, useState } from 'react';
import { Phone, ArrowUpRight, Clock, MapPin } from 'lucide-react';
import { SEO } from '../components/SEO';
import { api } from '../services/api';
import type { Branch } from '../types';

export const BranchesPage: React.FC = () => {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getBranches()
      .then((res) => {
        if (res.success) setBranches(res.data);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <SEO
        title="Şubelerimiz"
        description="FizyoBlu Kadıköy ve Nişantaşı şubelerimiz: İletişim, adres, çalışma saatleri ve harita konumları."
      />

      <section className="pt-36 pb-20 bg-[#FAF9F5] border-b border-[#E8E4DC]">
        <div className="max-w-4xl mx-auto px-6 sm:px-8 text-center space-y-4">
          <span className="text-[11px] font-semibold tracking-[0.25em] uppercase text-[#6B7566] block">
            LOKASYONLARIMIZ
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl text-[#1B1E1C] font-normal leading-tight">
            FizyoBlu Stüdyoları
          </h1>
          <p className="text-base text-[#5A564E] font-light max-w-2xl mx-auto leading-relaxed">
            Merkezi ve kolay ulaşılabilir lokasyonlarımızda, sakin ve hijyenik stüdyo atmosferinde seanslarımıza katılabilirsiniz.
          </p>
        </div>
      </section>

      <section className="py-24 bg-[#FAF9F5]">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          {loading ? (
            <div className="text-center py-12 text-sm text-[#7A756B]">Şubeler yükleniyor...</div>
          ) : (
            <div className="space-y-16">
              {branches.map((b) => (
                <div
                  key={b.id}
                  className="bg-[#F6F3EB] border border-[#DDD6C8] grid grid-cols-1 lg:grid-cols-12 overflow-hidden"
                >
                  {/* Left / Info */}
                  <div className="p-8 sm:p-12 lg:col-span-7 flex flex-col justify-between space-y-8">
                    <div className="space-y-6">
                      <div>
                        <span className="text-[10px] tracking-[0.2em] uppercase text-[#6A7065] font-semibold block mb-1">
                          {b.district} • {b.city}
                        </span>
                        <h2 className="font-serif text-3xl text-[#1B1E1C]">{b.name}</h2>
                      </div>

                      <div className="space-y-4 text-sm text-[#555148] font-light">
                        <div className="flex items-start space-x-3">
                          <MapPin className="w-4 h-4 text-[#4A5D4E] shrink-0 mt-0.5" />
                          <span>{b.address}</span>
                        </div>

                        <div className="flex items-center space-x-3">
                          <Phone className="w-4 h-4 text-[#4A5D4E] shrink-0" />
                          <a href={`tel:${b.phone.replace(/[^0-9+]/g, '')}`} className="hover:underline">
                            {b.phone}
                          </a>
                        </div>

                        <div className="flex items-center space-x-3">
                          <Clock className="w-4 h-4 text-[#4A5D4E] shrink-0" />
                          <span>{b.workingHours}</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-6 border-t border-[#E4DECFA0] flex flex-wrap items-center gap-4 text-xs font-medium tracking-wider uppercase">
                      <a
                        href={`https://wa.me/${b.whatsApp.replace(/[^0-9]/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-5 py-2.5 bg-[#2B382D] text-[#FAF9F5] hover:bg-[#1E261F] transition-colors"
                      >
                        <span>WhatsApp İletişim</span>
                        <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
                      </a>

                      <a
                        href={b.googleMapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-5 py-2.5 border border-[#4A5D4E] text-[#2B382D] hover:bg-[#FAF9F5] transition-colors"
                      >
                        <span>Google Haritalarda Aç</span>
                        <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
                      </a>
                    </div>
                  </div>

                  {/* Right / Map or Image */}
                  <div className="lg:col-span-5 bg-[#EAE5DA] min-h-[300px]">
                    {b.imageUrl ? (
                      <img
                        src={b.imageUrl}
                        alt={b.name}
                        className="w-full h-full object-cover min-h-[320px]"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs text-[#7A756B]">
                        Stüdyo Görseli
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
};
