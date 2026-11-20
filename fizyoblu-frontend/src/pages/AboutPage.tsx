import React from 'react';
import { SEO } from '../components/SEO';
import { ArrowUpRight } from 'lucide-react';
import type { SiteSettings } from '../types';

interface AboutPageProps {
  settings?: SiteSettings;
}

export const AboutPage: React.FC<AboutPageProps> = ({ settings }) => {
  const whatsapp = settings?.contact_whatsapp || '+90 (532) 123 45 67';
  const cleanWhatsapp = whatsapp.replace(/[^0-9]/g, '');

  return (
    <>
      <SEO
        title="Hakkımızda"
        description="FizyoBlu'nun bütüncül klinik yaklaşımı, fizyoterapi standartları ve medikal reformer pilates felsefesi."
      />

      {/* Page Header */}
      <section className="pt-36 pb-20 bg-[#FAF9F5] border-b border-[#E8E4DC]">
        <div className="max-w-4xl mx-auto px-6 sm:px-8 text-center space-y-4">
          <span className="text-[11px] font-semibold tracking-[0.25em] uppercase text-[#6B7566] block">
            KURUMSAL & FELSEFEMİZ
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl text-[#1B1E1C] font-normal leading-tight">
            FizyoBlu Yaklaşımı
          </h1>
          <p className="text-base sm:text-lg text-[#5A564E] font-light max-w-2xl mx-auto leading-relaxed">
            Hareketin yalnızca kas geliştirmekten ibaret olmadığına, doğru biyomekanik ve fizyoterapi bilimiyle omurganın kendini onarma kabiliyetine inanıyoruz.
          </p>
        </div>
      </section>

      {/* Narrative Section */}
      <section className="py-24 bg-[#FAF9F5]">
        <div className="max-w-4xl mx-auto px-6 sm:px-8 space-y-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="aspect-[4/5] bg-[#ECE8E0] overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&w=1200&q=80"
                alt="FizyoBlu Stüdyo Ortamı"
                className="w-full h-full object-cover grayscale-[15%]"
              />
            </div>
            <div className="space-y-4">
              <h2 className="font-serif text-2xl sm:text-3xl text-[#1B1E1C]">
                Klasik Egzersiz Kalıplarının Ötesinde
              </h2>
              <p className="text-sm text-[#5C574E] leading-relaxed font-light">
                FizyoBlu, fizyoterapi prensipleri ile medikal pilatesi aynı çatı altında buluşturmak amacıyla kuruldu. Modern şehir yaşamının getirdiği hareketsizlik, masa başı çalışma ve stres omurga sağlığımızı doğrudan tehdit eder.
              </p>
              <p className="text-sm text-[#5C574E] leading-relaxed font-light">
                Her seansımız, bireyin postüral yapısı, ağrı geçmişi ve anatomik hedefleri dikkate alınarak lisanslı fizyoterapistler tarafından yönetilir.
              </p>
            </div>
          </div>

          {/* Pillars */}
          <div className="pt-12 border-t border-[#E8E4DC] grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-2">
              <span className="font-serif text-2xl text-[#3B4C3E] block">01</span>
              <h3 className="font-serif text-lg text-[#1B1E1C]">Bireye Özel Değerlendirme</h3>
              <p className="text-xs text-[#6A655C] leading-relaxed font-light">
                Ezber egzersiz programları yerine her seans öncesinde omurga hizalanması ve eklem mobilitesi gözlemlenir.
              </p>
            </div>

            <div className="space-y-2">
              <span className="font-serif text-2xl text-[#3B4C3E] block">02</span>
              <h3 className="font-serif text-lg text-[#1B1E1C]">Tıbbi & Klinik Altyapı</h3>
              <p className="text-xs text-[#6A655C] leading-relaxed font-light">
                Eğitmenlerimiz tıp kökenli fizyoterapistlerden oluşur; bel, boyun ve eklem rahatsızlıklarında en güvenli hareket açısı korunur.
              </p>
            </div>

            <div className="space-y-2">
              <span className="font-serif text-2xl text-[#3B4C3E] block">03</span>
              <h3 className="font-serif text-lg text-[#1B1E1C]">Hijyen & Ferah Atmosfer</h3>
              <p className="text-xs text-[#6A655C] leading-relaxed font-light">
                Stüdyolarımız gün ışığı alan, yüksek tavanlı, ferah ve her seans sonrası sterilize edilen özel ekipmanlarla donatılmıştır.
              </p>
            </div>
          </div>

          {/* Standards Banner */}
          <div className="bg-[#F3EFE7] p-8 md:p-12 border border-[#DFD9CE] space-y-4">
            <h3 className="font-serif text-2xl text-[#1B1E1C]">
              Bize Danışmak İster misiniz?
            </h3>
            <p className="text-sm text-[#5C574E] font-light max-w-2xl leading-relaxed">
              Mevcut bel, boyun veya eklem şikayetleriniz hakkında detaylı görüşmek ve stüdyomuzu ziyaret etmek için uzman ekibimizle WhatsApp üzerinden doğrudan iletişime geçebilirsiniz.
            </p>
            <div className="pt-2">
              <a
                href={`https://wa.me/${cleanWhatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-6 py-3 bg-[#2B382D] text-[#FAF9F5] text-xs font-medium tracking-wider uppercase hover:bg-[#1E261F] transition-all"
              >
                <span>Fizyoterapistimize Yazın</span>
                <ArrowUpRight className="w-4 h-4 ml-1.5" />
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
