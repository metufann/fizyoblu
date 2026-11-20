import React, { useEffect, useState } from 'react';
import { SEO } from '../components/SEO';
import { api } from '../services/api';
import type { TeamMember } from '../types';

export const TeamPage: React.FC = () => {
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getTeam()
      .then((res) => {
        if (res.success) setTeam(res.data);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <SEO
        title="Ekibimiz"
        description="FizyoBlu fizyoterapistleri ve klinik pilates eğitmenleri: Akademik eğitim, klinik deneyim ve sertifikalar."
      />

      <section className="pt-36 pb-20 bg-[#FAF9F5] border-b border-[#E8E4DC]">
        <div className="max-w-4xl mx-auto px-6 sm:px-8 text-center space-y-4">
          <span className="text-[11px] font-semibold tracking-[0.25em] uppercase text-[#6B7566] block">
            UZMANLARIMIZ
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl text-[#1B1E1C] font-normal leading-tight">
            Fizyoterapist Kadromuz
          </h1>
          <p className="text-base text-[#5A564E] font-light max-w-2xl mx-auto leading-relaxed">
            Tüm eğitmenlerimiz üniversite düzeyinde fizyoterapi eğitimi almış, anatomi ve omurga biyomekaniği konusunda uzmanlaşmış profesyonellerdir.
          </p>
        </div>
      </section>

      <section className="py-24 bg-[#FAF9F5]">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          {loading ? (
            <div className="text-center py-12 text-sm text-[#7A756B]">Ekip bilgileri yükleniyor...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
              {team.map((member) => (
                <div key={member.id} className="group flex flex-col justify-between">
                  <div>
                    <div className="aspect-[3/4] overflow-hidden bg-[#ECE8E0] mb-5">
                      <img
                        src={member.imageUrl}
                        alt={member.fullName}
                        className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-700"
                      />
                    </div>
                    <h2 className="font-serif text-2xl text-[#1B1E1C]">{member.fullName}</h2>
                    <p className="text-xs text-[#706B62] font-medium tracking-wide mt-1 uppercase mb-3">
                      {member.title}
                    </p>
                    <p className="text-sm text-[#5C574E] font-light leading-relaxed mb-4">
                      {member.bio}
                    </p>
                  </div>

                  {member.specialities && (
                    <div className="pt-3 border-t border-[#EAE5DC]">
                      <span className="text-[10px] tracking-[0.2em] uppercase text-[#88837A] block mb-1">
                        Uzmanlık Alanları
                      </span>
                      <p className="text-xs text-[#4A5D4E] font-medium">
                        {member.specialities}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
};
