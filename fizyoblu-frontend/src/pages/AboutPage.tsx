import React from 'react';
import { SEO } from '../components/SEO';
import { ArrowUpRight, CheckCircle2 } from 'lucide-react';
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
        title="Hakkımızda | FizyoBlu Sağlıklı Yaşam Merkezi"
        description="FizyoBlu Sağlıklı Yaşam Merkezi, Fzt. Selçuk Atakan Şener tarafından 2018 yılında Ankara Çukurambar'da kurulmuştur. Kişiye özel klinik pilates ve postür analizi felsefemiz."
      />

      {/* Page Header */}
      <section className="pt-36 pb-20 bg-[#FAF9F5] border-b border-[#E8E4DC]">
        <div className="max-w-4xl mx-auto px-6 sm:px-8 text-center space-y-4">
          <span className="text-[11px] font-semibold tracking-[0.25em] uppercase text-[#6B7566] block">
            KURULUŞ HİKÂYEMİZ & YAKLAŞIMIMIZ
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl text-[#1B1E1C] font-normal leading-tight">
            “Dün Olduğundan Daha İyi Ol”
          </h1>
          <p className="text-base sm:text-lg text-[#5A564E] font-light max-w-2xl mx-auto leading-relaxed">
            FizyoBlu Sağlıklı Yaşam Merkezi, 2018 yılında Çukurambar, Ankara’da Fizyoterapist Selçuk Atakan Şener tarafından kurulmuştur.
          </p>
        </div>
      </section>

      {/* Narrative Section */}
      <section className="py-24 bg-[#FAF9F5]">
        <div className="max-w-4xl mx-auto px-6 sm:px-8 space-y-20">
          {/* Story & Image */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="aspect-[4/5] bg-[#ECE8E0] overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&w=1200&q=80"
                alt="FizyoBlu Çukurambar Ankara Stüdyosu"
                className="w-full h-full object-cover grayscale-[15%]"
              />
            </div>
            <div className="space-y-5">
              <span className="text-[10px] tracking-[0.2em] uppercase font-semibold text-[#6B7566]">
                2018’DEN BUGÜNE ANKARA ÇUKURAMBAR
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl text-[#1B1E1C] font-normal leading-snug">
                Bedeninize Değer Veren Uzman Fizyoterapi Yaklaşımı
              </h2>
              <p className="text-sm text-[#5C574E] leading-relaxed font-light">
                FizyoBlu Sağlıklı Yaşam Merkezi, <strong>Fizyoterapist Selçuk Atakan Şener</strong> tarafından <strong>“Dün olduğundan daha iyi ol”</strong> sloganıyla 2018 yılında Çukurambar, Ankara’da kurulmuştur.
              </p>
              <p className="text-sm text-[#5C574E] leading-relaxed font-light">
                Merkezimizde; klinik pilates, reformer pilates, hamile pilatesi, manuel terapi, postür analizi, kinezyolojik bantlama, sporcu sağlığı ile MS, Parkinson ve diğer nörolojik hastalıkların rehabilitasyonu hizmetleri sunulmaktadır.
              </p>
            </div>
          </div>

          {/* Working Approach */}
          <div className="space-y-6 bg-[#F5F2EB] p-8 md:p-12 border border-[#E3DDD1]">
            <span className="text-[11px] font-semibold tracking-[0.25em] uppercase text-[#6B7566] block">
              ÇALIŞMA YAKLAŞIMIMIZ
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl text-[#1B1E1C]">
              Önce Bireysel Postür Analizi
            </h3>
            <p className="text-sm sm:text-base text-[#555147] font-light leading-relaxed">
              FizyoBlu Sağlıklı Yaşam Merkezinde deneyimli ve konusunda uzman fizyoterapistlerimiz; öncelikle <strong>kişisel postür analizi</strong> ile danışanlarımızın yaşam koşullarını ve rahatsızlıklarını göz önüne alarak vücut yapılarına en uygun programı belirlemektedirler.
            </p>
            <p className="text-sm sm:text-base text-[#555147] font-light leading-relaxed">
              Belirlenen bu kişiye özel program ile kişiler, hedeflerine daha kısa sürede ve bilinçli bir şekilde ulaşarak dün olduklarından her anlamda daha iyi bir beden sağlığına kavuşurlar.
            </p>

            <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-start space-x-3">
                <CheckCircle2 className="w-5 h-5 text-[#3B4C3E] shrink-0 mt-0.5" />
                <span className="text-xs sm:text-sm text-[#4E4A42] font-light">
                  Kişisel omurga ve postüral dizilim değerlendirmesi
                </span>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle2 className="w-5 h-5 text-[#3B4C3E] shrink-0 mt-0.5" />
                <span className="text-xs sm:text-sm text-[#4E4A42] font-light">
                  Günlük yaşam koşulları ve kas dengesizliklerinin analizi
                </span>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle2 className="w-5 h-5 text-[#3B4C3E] shrink-0 mt-0.5" />
                <span className="text-xs sm:text-sm text-[#4E4A42] font-light">
                  Fizyoterapist gözetiminde 1:1 medikal pilates ve reformer
                </span>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle2 className="w-5 h-5 text-[#3B4C3E] shrink-0 mt-0.5" />
                <span className="text-xs sm:text-sm text-[#4E4A42] font-light">
                  Bilinçli, güvenli ve sürdürülebilir gelişim takibi
                </span>
              </div>
            </div>
          </div>

          {/* Joseph Pilates Quote Box */}
          <div className="border-l-2 border-[#2B382D] pl-8 sm:pl-10 py-4 space-y-4">
            <span className="text-[11px] uppercase tracking-[0.25em] text-[#6B7566] font-semibold block">
              JOSEPH PILATES FELSEFESİ
            </span>
            <p className="font-serif text-xl sm:text-2xl text-[#1B1E1C] italic leading-relaxed">
              “10 derste farkı hissedecek,<br />
              20 derste farkı görecek ve<br />
              30 derste farklı bir bedene sahip olacaksınız.”
            </p>
            <p className="text-xs tracking-wider text-[#7A756C] uppercase font-medium">
              — Joseph Pilates
            </p>
          </div>

          {/* Founder Snippet */}
          <div className="pt-12 border-t border-[#E8E4DC] grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-2">
              <span className="font-serif text-2xl text-[#3B4C3E] block">2018</span>
              <h3 className="font-serif text-lg text-[#1B1E1C]">Kuruluş Yılı</h3>
              <p className="text-xs text-[#6A655C] leading-relaxed font-light">
                Çukurambar, Ankara’da kaliteli ve bilimsel fizyoterapi hizmeti sunma vizyonuyla kapılarını açtı.
              </p>
            </div>

            <div className="space-y-2">
              <span className="font-serif text-2xl text-[#3B4C3E] block">Fzt. Selçuk Atakan Şener</span>
              <h3 className="font-serif text-lg text-[#1B1E1C]">Kurucu & Fizyoterapist</h3>
              <p className="text-xs text-[#6A655C] leading-relaxed font-light">
                Kişiye özel postür analizi, klinik reformer pilates ve nörolojik rehabilitasyonda uzman rehberlik.
              </p>
            </div>

            <div className="space-y-2">
              <span className="font-serif text-2xl text-[#3B4C3E] block">Bütüncül Yaklaşım</span>
              <h3 className="font-serif text-lg text-[#1B1E1C]">Fizyoterapi Güvencesi</h3>
              <p className="text-xs text-[#6A655C] leading-relaxed font-light">
                Klasik egzersiz kalıplarının ötesinde, her bireyin anatomik yapısına saygılı klinik programlama.
              </p>
            </div>
          </div>

          {/* Contact Banner */}
          <div className="bg-[#FAF9F5] p-8 md:p-12 border border-[#DFD9CE] space-y-4">
            <h3 className="font-serif text-2xl text-[#1B1E1C]">
              Fizyoterapistlerimizle Görüşün
            </h3>
            <p className="text-sm text-[#5C574E] font-light max-w-2xl leading-relaxed">
              Mevcut bel, boyun ve eklem şikayetleriniz veya postür analizi randevunuz için Ankara Çukurambar merkezimizle iletişime geçebilirsiniz.
            </p>
            <div className="pt-2">
              <a
                href={`https://wa.me/${cleanWhatsapp}?text=Merhaba,%20FizyoBlu%20Çukurambar%20merkezinizde%20postür%20analizi%20ve%20klinik%20pilates%20hakkında%20bilgi%20almak%20istiyorum.`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-6 py-3 bg-[#2B382D] text-[#FAF9F5] text-xs font-medium tracking-wider uppercase hover:bg-[#1E261F] transition-all"
              >
                <span>WhatsApp İle İletişime Geçin</span>
                <ArrowUpRight className="w-4 h-4 ml-1.5" />
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
