import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { SEO } from '../components/SEO';
import { api } from '../services/api';
import type { MediaItem } from '../types';

export const GalleryPage: React.FC = () => {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('Tümü');
  const [selectedImage, setSelectedImage] = useState<MediaItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getGallery()
      .then((res) => {
        if (res.success) setItems(res.data);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const categories = ['Tümü', ...Array.from(new Set(items.map((i) => i.category).filter(Boolean)))];

  const filteredItems =
    activeCategory === 'Tümü'
      ? items
      : items.filter((i) => i.category === activeCategory);

  return (
    <>
      <SEO
        title="Galeri"
        description="FizyoBlu stüdyolarımızdan ferah kareler, reformer ve cadillac ekipmanlarımız ve seans anları."
      />

      <section className="pt-36 pb-20 bg-[#FAF9F5] border-b border-[#E8E4DC]">
        <div className="max-w-4xl mx-auto px-6 sm:px-8 text-center space-y-4">
          <span className="text-[11px] font-semibold tracking-[0.25em] uppercase text-[#6B7566] block">
            STÜDYO ATMOSFERİ
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl text-[#1B1E1C] font-normal leading-tight">
            FizyoBlu Galerisi
          </h1>
          <p className="text-base text-[#5A564E] font-light max-w-2xl mx-auto leading-relaxed">
            Aydınlık, yüksek tavanlı, ferah ve medikal hijyen standartlarında tasarlanmış pilates stüdyolarımız.
          </p>
        </div>
      </section>

      <section className="py-16 bg-[#FAF9F5]">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          {/* Category Filter */}
          {categories.length > 2 && (
            <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat as string)}
                  className={`px-4 py-1.5 text-xs tracking-wider uppercase transition-colors rounded-sm ${
                    activeCategory === cat
                      ? 'bg-[#2B382D] text-[#FAF9F5]'
                      : 'bg-[#EFECE5] text-[#555148] hover:bg-[#E5E0D5]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}

          {/* Grid */}
          {loading ? (
            <div className="text-center py-12 text-sm text-[#7A756B]">Görseller yükleniyor...</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setSelectedImage(item)}
                  className="group cursor-pointer aspect-[4/3] overflow-hidden bg-[#ECE8E0] relative"
                >
                  <img
                    src={item.url}
                    alt={item.title || 'FizyoBlu Galeri'}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {item.title && (
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                      <p className="text-xs text-white font-medium tracking-wide">{item.title}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-6 right-6 text-white/70 hover:text-white p-2"
            aria-label="Kapat"
          >
            <X className="w-8 h-8" />
          </button>
          <div
            className="max-w-4xl max-h-[85vh] flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={selectedImage.url}
              alt={selectedImage.title || 'Galeri Detay'}
              className="max-w-full max-h-[75vh] object-contain"
            />
            {selectedImage.title && (
              <p className="text-sm text-white/90 text-center mt-3 font-light">
                {selectedImage.title}
              </p>
            )}
          </div>
        </div>
      )}
    </>
  );
};
