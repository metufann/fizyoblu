import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, ArrowRight, ShieldCheck, Activity, Award } from 'lucide-react';
import { SEO } from '../components/SEO';
import { api } from '../services/api';
import type { Service, Branch, TeamMember, BlogPost, MediaItem, SiteSettings } from '../types';

interface HomePageProps {
  settings?: SiteSettings;
  branches?: Branch[];
}

export const HomePage: React.FC<HomePageProps> = ({ settings, branches }) => {
  const [services, setServices] = useState<Service[]>([]);
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [gallery, setGallery] = useState<MediaItem[]>([]);

  useEffect(() => {
    async function loadData() {
      try {
        const [servicesRes, teamRes, postsRes, galleryRes] = await Promise.all([
          api.getServices(),
          api.getTeam(),
          api.getBlogPosts(),
          api.getGallery()
        ]);

        if (servicesRes.success) setServices(servicesRes.data.filter((s) => s.isFeatured));
        if (teamRes.success) setTeam(teamRes.data.slice(0, 3));
        if (postsRes.success) setPosts(postsRes.data.slice(0, 3));
        if (galleryRes.success) setGallery(galleryRes.data.slice(0, 4));
      } catch (err) {
        console.error('Veri yüklenemedi:', err);
      }
    }

    loadData();
  }, []);

  const heroImage =
    settings?.hero_image ||
    'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1800&q=80';
  const eyebrow = settings?.hero_eyebrow || 'BİLİMSEL YAKLAŞIM & KLİNİK DENEYİM';
  const heroTitle = settings?.hero_title || 'Hareketin İyileştirici Gücüyle Bedeninizi Keşfedin';
  const heroSubtitle =
    settings?.hero_subtitle ||
    'Uzman fizyoterapistler rehberliğinde kişiselleştirilmiş klinik pilates, manuel terapi ve postür rehabilitasyonu.';
  const whatsapp = settings?.contact_whatsapp || '+90 (532) 123 45 67';
  const cleanWhatsapp = whatsapp.replace(/[^0-9]/g, '');

  return (
    <>
      <SEO
        title={settings?.meta_title || 'Klinik Pilates & Fizyoterapi'}
        description={settings?.meta_description || 'Uzman fizyoterapistler eşliğinde klinik reformer pilates ve omurga sağlığı.'}
      />

      {/* Hero Section */}
      <section className="relative pt-32 pb-24 md:pt-40 md:pb-32 overflow-hidden bg-[#FAF9F5]">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Left Copy */}
            <div className="lg:col-span-7 space-y-6">
              <span className="text-[11px] font-semibold tracking-[0.25em] uppercase text-[#6B7566] block">
                {eyebrow}
              </span>

              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-[#1B1E1C] leading-[1.12] tracking-tight font-normal">
                {heroTitle}
              </h1>

              <p className="text-base sm:text-lg text-[#55524B] font-light leading-relaxed max-w-xl">
                {heroSubtitle}
              </p>

              <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                <a
                  href={`https://wa.me/${cleanWhatsapp}?text=Merhaba,%20FizyoBlu%20klinik%20pilates%20seansları%20hakkında%20bilgi%20almak%20istiyorum.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center px-7 py-3.5 bg-[#2B382D] text-[#FAF9F5] text-xs font-medium tracking-[0.15em] uppercase hover:bg-[#1E261F] transition-all"
                >
                  <span>Bize Ulaşın</span>
                  <ArrowUpRight className="w-4 h-4 ml-2" />
                </a>

                <Link
                  to="/hizmetler"
                  className="inline-flex items-center justify-center px-7 py-3.5 border border-[#CEC8BD] text-[#22252A] text-xs font-medium tracking-[0.15em] uppercase hover:border-[#2B382D] transition-colors"
                >
                  <span>Hizmetlerimizi İnceleyin</span>
                  <ArrowRight className="w-4 h-4 ml-2 opacity-70" />
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="pt-8 grid grid-cols-3 gap-6 border-t border-[#E8E4DC] max-w-lg">
                <div>
                  <p className="font-serif text-2xl text-[#2B382D]">2018</p>
                  <p className="text-xs text-[#706B62] mt-0.5 font-light">Kuruluş Yılı (Ankara)</p>
                </div>
                <div>
                  <p className="font-serif text-2xl text-[#2B382D]">1:1</p>
                  <p className="text-xs text-[#706B62] mt-0.5 font-light">Kişisel Postür Analizi</p>
                </div>
                <div>
                  <p className="font-serif text-2xl text-[#2B382D]">%100</p>
                  <p className="text-xs text-[#706B62] mt-0.5 font-light">Fizyoterapist Kadro</p>
                </div>
              </div>
            </div>

            {/* Right Visual */}
            <div className="lg:col-span-5 relative">
              <div className="aspect-[4/5] overflow-hidden bg-[#ECE8E0]">
                <img
                  src={heroImage}
                  alt="FizyoBlu Reformer Pilates"
                  className="w-full h-full object-cover object-center grayscale-[15%] hover:grayscale-0 transition-all duration-700"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Philosophy & Approach Section */}
      <section className="py-24 bg-[#F4F1EA] border-y border-[#E6E0D4]">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="max-w-3xl mb-16">
            <span className="text-[11px] font-semibold tracking-[0.25em] uppercase text-[#6B7566] block mb-3">
              KURUMSAL FELSEFEMİZ
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#1B1E1C] font-normal leading-tight">
              {settings?.about_preview_title || '“Dün Olduğundan Daha İyi Ol”'}
            </h2>
            <p className="text-sm sm:text-base text-[#5C574E] mt-4 leading-relaxed font-light">
              {settings?.about_preview_text ||
                'FizyoBlu Sağlıklı Yaşam Merkezi, Fizyoterapist Selçuk Atakan Şener tarafından “dün olduğundan daha iyi ol” sloganıyla 2018 yılında Çukurambar, Ankara’da kurulmuştur. Deneyimli ve konusunda uzman fizyoterapistlerimiz; öncelikle kişisel postür analizi ile danışanlarımızın yaşam koşullarını ve rahatsızlıklarını göz önüne alarak vücut yapılarına en uygun programı belirlemektedir.'}
            </p>

            {/* Joseph Pilates Quote Snippet */}
            <div className="mt-8 pt-6 border-t border-[#DFD9CD]">
              <p className="font-serif text-base sm:text-lg text-[#2B382D] italic">
                “10 derste farkı hissedecek, 20 derste farkı görecek ve 30 derste farklı bir bedene sahip olacaksınız.”
              </p>
              <span className="text-[11px] text-[#7A756C] uppercase tracking-wider mt-1 block">
                — Joseph Pilates
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-3">
              <Activity className="w-6 h-6 text-[#4A5D4E]" />
              <h3 className="font-serif text-xl text-[#1B1E1C]">Kişisel Postür Analizi</h3>
              <p className="text-xs sm:text-sm text-[#6A655C] leading-relaxed font-light">
                Her seans öncesinde vücut diziliş ve düzeni kontrol edilir; danışanın yaşam koşulları ve mevcut postüral deviasyonları haritalandırılır.
              </p>
            </div>

            <div className="space-y-3">
              <ShieldCheck className="w-6 h-6 text-[#4A5D4E]" />
              <h3 className="font-serif text-xl text-[#1B1E1C]">Kişiye Özel Klinik Program</h3>
              <p className="text-xs sm:text-sm text-[#6A655C] leading-relaxed font-light">
                Klinik pilates, reformer, manuel terapi ve kinezyolojik bantlama ile bedeninize en uygun, hedefe odaklı medikal planlama yapılır.
              </p>
            </div>

            <div className="space-y-3">
              <Award className="w-6 h-6 text-[#4A5D4E]" />
              <h3 className="font-serif text-xl text-[#1B1E1C]">Uzman Fizyoterapist Kadro</h3>
              <p className="text-xs sm:text-sm text-[#6A655C] leading-relaxed font-light">
                Kurucumuz Fzt. Selçuk Atakan Şener öncülüğünde, tüm uygulamalar bilimsel altyapıya sahip lisanslı fizyoterapistler tarafından yürütülür.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Services */}
      <section className="py-24 bg-[#FAF9F5]">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4">
            <div>
              <span className="text-[11px] font-semibold tracking-[0.25em] uppercase text-[#6B7566] block mb-2">
                HİZMETLERİMİZ
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl text-[#1B1E1C] font-normal">
                Klinik Egzersiz & Fizyoterapi Çözümleri
              </h2>
            </div>
            <Link
              to="/hizmetler"
              className="text-xs tracking-wider uppercase text-[#2B382D] hover:text-[#4A5D4E] font-medium flex items-center"
            >
              <span>Tüm Hizmetler</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => (
              <div key={service.id} className="group flex flex-col justify-between">
                <div>
                  <div className="aspect-[16/10] overflow-hidden bg-[#ECE8E0] mb-5">
                    <img
                      src={service.imageUrl || 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=800&q=80'}
                      alt={service.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                  <h3 className="font-serif text-xl text-[#1B1E1C] mb-2">{service.title}</h3>
                  <p className="text-xs sm:text-sm text-[#68645C] leading-relaxed line-clamp-3 font-light mb-4">
                    {service.summary}
                  </p>
                </div>
                <Link
                  to={`/hizmetler/${service.slug}`}
                  className="text-xs font-medium tracking-wider uppercase text-[#2B382D] flex items-center group-hover:text-[#4A5D4E]"
                >
                  <span>Detaylı Bilgi</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Branches Showcase */}
      <section className="py-24 bg-[#F2EFE8] border-t border-[#E6E0D4]">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="max-w-2xl mb-16">
            <span className="text-[11px] font-semibold tracking-[0.25em] uppercase text-[#6B7566] block mb-2">
              STÜDYOLARIMIZ
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#1B1E1C] font-normal">
              FizyoBlu Şubeleri
            </h2>
            <p className="text-sm text-[#635E56] font-light mt-3">
              Merkezi konumları, aydınlık stüdyo atmosferi ve tam donanımlı reformer ekipmanları ile hizmetinizdeyiz.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {branches && branches.map((b) => (
              <div key={b.id} className="bg-[#FAF9F5] p-8 border border-[#DFD9CE] flex flex-col justify-between">
                <div>
                  <span className="text-[10px] tracking-[0.2em] uppercase text-[#736E65] font-medium block mb-1">
                    {b.district} / {b.city}
                  </span>
                  <h3 className="font-serif text-2xl text-[#1B1E1C] mb-3">{b.name}</h3>
                  <p className="text-sm text-[#615C53] font-light mb-4">{b.address}</p>
                  <p className="text-xs text-[#807B71] mb-6">
                    <span className="font-medium text-[#444038]">Çalışma Saatleri:</span> {b.workingHours}
                  </p>
                </div>

                <div className="pt-6 border-t border-[#EBE7DF] flex flex-wrap items-center gap-4 text-xs font-medium tracking-wider uppercase">
                  <a
                    href={`tel:${b.phone.replace(/[^0-9+]/g, '')}`}
                    className="text-[#2B382D] hover:underline"
                  >
                    {b.phone}
                  </a>
                  <span className="text-[#C5BFB4]">•</span>
                  <a
                    href={`https://wa.me/${b.whatsApp.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#2B382D] hover:underline flex items-center"
                  >
                    WhatsApp <ArrowUpRight className="w-3 h-3 ml-0.5" />
                  </a>
                  <span className="text-[#C5BFB4]">•</span>
                  <a
                    href={b.googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#55524B] hover:text-black flex items-center"
                  >
                    Yol Tarifi <ArrowUpRight className="w-3 h-3 ml-0.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Snippet */}
      <section className="py-24 bg-[#FAF9F5]">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4">
            <div>
              <span className="text-[11px] font-semibold tracking-[0.25em] uppercase text-[#6B7566] block mb-2">
                UZMAN KADRO
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl text-[#1B1E1C] font-normal">
                Fizyoterapistlerimiz
              </h2>
            </div>
            <Link
              to="/ekibimiz"
              className="text-xs tracking-wider uppercase text-[#2B382D] hover:text-[#4A5D4E] font-medium flex items-center"
            >
              <span>Ekibimizi Tanıyın</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member) => (
              <div key={member.id} className="group">
                <div className="aspect-[3/4] overflow-hidden bg-[#ECE8E0] mb-4">
                  <img
                    src={member.imageUrl}
                    alt={member.fullName}
                    className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-500"
                  />
                </div>
                <h3 className="font-serif text-lg text-[#1B1E1C]">{member.fullName}</h3>
                <p className="text-xs text-[#706B62] font-medium tracking-wide mt-0.5">{member.title}</p>
                {member.specialities && (
                  <p className="text-xs text-[#8A8478] mt-2 font-light line-clamp-2">
                    {member.specialities}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Latest Blog Insights */}
      {posts.length > 0 && (
        <section className="py-24 bg-[#F5F2EB] border-t border-[#E6E0D4]">
          <div className="max-w-7xl mx-auto px-6 sm:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4">
              <div>
                <span className="text-[11px] font-semibold tracking-[0.25em] uppercase text-[#6B7566] block mb-2">
                  KLİNİK GÜNLÜK & BİLGİ
                </span>
                <h2 className="font-serif text-3xl sm:text-4xl text-[#1B1E1C] font-normal">
                  Omurga Sağlığı ve Egzersiz Yazıları
                </h2>
              </div>
              <Link
                to="/blog"
                className="text-xs tracking-wider uppercase text-[#2B382D] hover:text-[#4A5D4E] font-medium flex items-center"
              >
                <span>Tüm Yazılar</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {posts.map((post) => (
                <article key={post.id} className="group flex flex-col justify-between">
                  <div>
                    <div className="aspect-[16/10] overflow-hidden bg-[#E2DDCF] mb-4">
                      <img
                        src={post.coverImageUrl}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    </div>
                    {post.categoryName && (
                      <span className="text-[10px] tracking-[0.2em] uppercase text-[#736E65] font-medium block mb-1">
                        {post.categoryName}
                      </span>
                    )}
                    <h3 className="font-serif text-lg text-[#1B1E1C] group-hover:text-[#3B4C3E] transition-colors leading-snug mb-2">
                      <Link to={`/blog/${post.slug}`}>{post.title}</Link>
                    </h3>
                    <p className="text-xs text-[#6B665E] font-light line-clamp-2 leading-relaxed mb-4">
                      {post.summary}
                    </p>
                  </div>
                  <div className="flex items-center text-[11px] text-[#8C877D] pt-2">
                    <span>{post.readTimeMinutes} dk okuma</span>
                    <span className="mx-2">•</span>
                    <span>{post.author}</span>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Gallery Section */}
      {gallery.length > 0 && (
        <section className="py-24 bg-[#FAF9F5] border-t border-[#E6E0D4]">
          <div className="max-w-7xl mx-auto px-6 sm:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4">
              <div>
                <span className="text-[11px] font-semibold tracking-[0.25em] uppercase text-[#6B7566] block mb-2">
                  STÜDYODAN KARELER
                </span>
                <h2 className="font-serif text-3xl sm:text-4xl text-[#1B1E1C] font-normal">
                  Sakin ve Ferah Çalışma Alanları
                </h2>
              </div>
              <Link
                to="/galeri"
                className="text-xs tracking-wider uppercase text-[#2B382D] hover:text-[#4A5D4E] font-medium flex items-center"
              >
                <span>Tüm Galeriyi Gör</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {gallery.map((img) => (
                <div key={img.id} className="aspect-[4/5] bg-[#ECE8E0] overflow-hidden">
                  <img
                    src={img.url}
                    alt={img.title || 'FizyoBlu Stüdyo'}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
      <section className="py-24 bg-[#232924] text-[#FAF9F5]">
        <div className="max-w-4xl mx-auto px-6 sm:px-8 text-center space-y-6">
          <span className="text-[11px] font-semibold tracking-[0.25em] uppercase text-[#96A697] block">
            DANIŞMANLIK & İLETİŞİM
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl font-normal leading-tight">
            Bedeninizi Dinleyin, Uzman Rehberliğinde Yeniden Başlayın
          </h2>
          <p className="text-sm sm:text-base text-[#B3AEA3] font-light max-w-2xl mx-auto leading-relaxed">
            Şubelerimizi ziyaret edebilir, detaylı klinik değerlendirme ve pilates programlarımız hakkında WhatsApp veya telefon hattımız üzerinden bilgi alabilirsiniz.
          </p>
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={`https://wa.me/${cleanWhatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 bg-[#FAF9F5] text-[#1B1E1C] text-xs font-medium tracking-[0.15em] uppercase hover:bg-[#EAE5D9] transition-colors"
            >
              <span>WhatsApp Hattı</span>
              <ArrowUpRight className="w-4 h-4 ml-1.5" />
            </a>
            <Link
              to="/iletisim"
              className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 border border-[#525E54] text-[#FAF9F5] text-xs font-medium tracking-[0.15em] uppercase hover:border-[#FAF9F5] transition-colors"
            >
              <span>İletişim Formu</span>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};
