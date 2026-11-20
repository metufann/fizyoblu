import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import { SEO } from '../components/SEO';
import { api } from '../services/api';
import type { Service, SiteSettings } from '../types';

interface ServiceDetailPageProps {
  settings?: SiteSettings;
}

export const ServiceDetailPage: React.FC<ServiceDetailPageProps> = ({ settings }) => {
  const { slug } = useParams<{ slug: string }>();
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    api.getServiceBySlug(slug)
      .then((res) => {
        if (res.success && res.data) {
          setService(res.data);
        } else {
          setError('Hizmet bulunamadı.');
        }
      })
      .catch((err) => setError(err.message || 'Hizmet yüklenirken bir hata oluştu.'))
      .finally(() => setLoading(false));
  }, [slug]);

  const whatsapp = settings?.contact_whatsapp || '+90 (532) 123 45 67';
  const cleanWhatsapp = whatsapp.replace(/[^0-9]/g, '');

  if (loading) {
    return (
      <div className="pt-40 pb-24 text-center">
        <p className="text-sm text-[#736E65]">Hizmet detayları yükleniyor...</p>
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="pt-40 pb-24 text-center space-y-4">
        <h1 className="font-serif text-2xl text-[#1B1E1C]">Hizmet Bulunamadı</h1>
        <p className="text-sm text-[#736E65]">Aradığınız hizmet mevcut değil veya kaldırılmış olabilir.</p>
        <Link to="/hizmetler" className="inline-block text-xs uppercase tracking-wider text-[#2B382D] underline">
          Hizmetlere Dön
        </Link>
      </div>
    );
  }

  return (
    <>
      <SEO
        title={service.title}
        description={service.metaDescription || service.summary}
        ogImage={service.imageUrl}
      />

      <article className="pt-36 pb-24 bg-[#FAF9F5]">
        <div className="max-w-4xl mx-auto px-6 sm:px-8">
          {/* Back link */}
          <Link
            to="/hizmetler"
            className="inline-flex items-center text-xs tracking-wider uppercase text-[#736E65] hover:text-[#1B1E1C] mb-8 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5 mr-1.5" />
            <span>Tüm Hizmetlere Dön</span>
          </Link>

          <header className="space-y-4 mb-10">
            <h1 className="font-serif text-3xl sm:text-5xl text-[#1B1E1C] font-normal leading-tight">
              {service.title}
            </h1>
            {service.summary && (
              <p className="text-base sm:text-lg text-[#555148] font-light leading-relaxed">
                {service.summary}
              </p>
            )}
          </header>

          {/* Service Image */}
          {service.imageUrl && (
            <div className="aspect-[16/9] overflow-hidden bg-[#ECE8E0] mb-12">
              <img
                src={service.imageUrl}
                alt={service.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Description Content */}
          <div className="prose prose-neutral max-w-none text-sm sm:text-base text-[#4A463E] leading-relaxed space-y-6 font-light whitespace-pre-line">
            {service.description}
          </div>

          {/* Action Box */}
          <div className="mt-16 bg-[#F2EEE6] p-8 sm:p-10 border border-[#E0D9CD] flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-1 text-center sm:text-left">
              <h3 className="font-serif text-xl text-[#1B1E1C]">
                Bu Hizmet Hakkında Bilgi Alın
              </h3>
              <p className="text-xs sm:text-sm text-[#666157] font-light">
                Uzman fizyoterapistlerimizle görüşerek sizin için en uygun seans planını oluşturun.
              </p>
            </div>

            <a
              href={`https://wa.me/${cleanWhatsapp}?text=Merhaba,%20${encodeURIComponent(service.title)}%20hizmetiniz%20hakkında%20bilgi%20almak%20istiyorum.`}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 inline-flex items-center px-6 py-3.5 bg-[#2B382D] text-[#FAF9F5] text-xs font-medium tracking-[0.15em] uppercase hover:bg-[#1E261F] transition-all"
            >
              <span>WhatsApp İle Sorun</span>
              <ArrowUpRight className="w-4 h-4 ml-1.5" />
            </a>
          </div>
        </div>
      </article>
    </>
  );
};
