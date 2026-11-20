import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { SEO } from '../components/SEO';
import { api } from '../services/api';
import type { Service } from '../types';

export const ServicesPage: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getServices()
      .then((res) => {
        if (res.success) setServices(res.data);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <SEO
        title="Hizmetlerimiz"
        description="Fizyoterapist eşliğinde klinik reformer pilates, skolyoz terapisi, duruş bozuklukları ve manuel terapi seansları."
      />

      <section className="pt-36 pb-20 bg-[#FAF9F5] border-b border-[#E8E4DC]">
        <div className="max-w-4xl mx-auto px-6 sm:px-8 text-center space-y-4">
          <span className="text-[11px] font-semibold tracking-[0.25em] uppercase text-[#6B7566] block">
            UZMANLIK ALANLARIMIZ
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl text-[#1B1E1C] font-normal leading-tight">
            Klinik Hizmetlerimiz
          </h1>
          <p className="text-base text-[#5A564E] font-light max-w-2xl mx-auto leading-relaxed">
            Her biri klinik değerlendirme ile planlanan, omurga sağlığını ve bedenin doğal hareket açıklığını destekleyen medikal uygulamalarımız.
          </p>
        </div>
      </section>

      <section className="py-24 bg-[#FAF9F5]">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          {loading ? (
            <div className="text-center py-12 text-sm text-[#7A756B]">Hizmetler yükleniyor...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
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
                    <h2 className="font-serif text-2xl text-[#1B1E1C] mb-2">{service.title}</h2>
                    <p className="text-sm text-[#666158] font-light leading-relaxed mb-6">
                      {service.summary}
                    </p>
                  </div>
                  <Link
                    to={`/hizmetler/${service.slug}`}
                    className="text-xs font-medium tracking-wider uppercase text-[#2B382D] flex items-center group-hover:text-[#4A5D4E]"
                  >
                    <span>Detayları İncele</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
};
