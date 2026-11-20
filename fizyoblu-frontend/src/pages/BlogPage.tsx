import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search } from 'lucide-react';
import { SEO } from '../components/SEO';
import { api } from '../services/api';
import type { BlogPost, Category } from '../types';

export const BlogPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategory = searchParams.get('kategori') || '';

  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.getCategories(),
      api.getBlogPosts(activeCategory || undefined, searchQuery || undefined)
    ])
      .then(([catsRes, postsRes]) => {
        if (catsRes.success) setCategories(catsRes.data);
        if (postsRes.success) setPosts(postsRes.data);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [activeCategory, searchQuery]);

  const handleCategorySelect = (slug: string) => {
    if (slug === activeCategory) {
      searchParams.delete('kategori');
    } else {
      searchParams.set('kategori', slug);
    }
    setSearchParams(searchParams);
  };

  return (
    <>
      <SEO
        title="Blog & Bilgi Köşesi"
        description="Fizyoterapistlerimizin kaleminden omurga sağlığı, postür düzeltme, nefes ve klinik reformer pilates rehberleri."
      />

      <section className="pt-36 pb-20 bg-[#FAF9F5] border-b border-[#E8E4DC]">
        <div className="max-w-4xl mx-auto px-6 sm:px-8 text-center space-y-4">
          <span className="text-[11px] font-semibold tracking-[0.25em] uppercase text-[#6B7566] block">
            KLİNİK GÜNLÜK & YAZILAR
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl text-[#1B1E1C] font-normal leading-tight">
            Omurga Sağlığı & Pilates
          </h1>
          <p className="text-base text-[#5A564E] font-light max-w-2xl mx-auto leading-relaxed">
            Fizyoterapi ve biyomekanik temelli doğru bilgileri paylaştığımız uzman yazıları.
          </p>
        </div>
      </section>

      <section className="py-16 bg-[#FAF9F5]">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          {/* Controls: Categories & Search */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-12 border-b border-[#E8E4DC]">
            {/* Category Pills */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => handleCategorySelect('')}
                className={`px-4 py-1.5 text-xs tracking-wider uppercase transition-colors rounded-sm ${
                  !activeCategory
                    ? 'bg-[#2B382D] text-[#FAF9F5]'
                    : 'bg-[#EFECE5] text-[#555148] hover:bg-[#E5E0D5]'
                }`}
              >
                Tümü
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => handleCategorySelect(cat.slug)}
                  className={`px-4 py-1.5 text-xs tracking-wider uppercase transition-colors rounded-sm ${
                    activeCategory === cat.slug
                      ? 'bg-[#2B382D] text-[#FAF9F5]'
                      : 'bg-[#EFECE5] text-[#555148] hover:bg-[#E5E0D5]'
                  }`}
                >
                  {cat.name} ({cat.postCount})
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-64">
              <input
                type="text"
                placeholder="Yazılarda ara..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#FAF9F5] border border-[#DDD8CE] px-3.5 py-2 pl-9 text-xs text-[#222] focus:outline-none focus:border-[#2B382D]"
              />
              <Search className="w-4 h-4 text-[#8C877D] absolute left-3 top-2.5" />
            </div>
          </div>

          {/* Posts Grid */}
          <div className="pt-12">
            {loading ? (
              <div className="text-center py-12 text-sm text-[#7A756B]">Yazılar yükleniyor...</div>
            ) : posts.length === 0 ? (
              <div className="text-center py-16 text-sm text-[#7A756B]">
                Bu kriterlere uygun blog yazısı bulunamadı.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {posts.map((post) => (
                  <article key={post.id} className="group flex flex-col justify-between">
                    <div>
                      <div className="aspect-[16/10] overflow-hidden bg-[#ECE8E0] mb-5">
                        <img
                          src={post.coverImageUrl}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                      </div>
                      {post.categoryName && (
                        <span className="text-[10px] tracking-[0.2em] uppercase text-[#6B7566] font-semibold block mb-1">
                          {post.categoryName}
                        </span>
                      )}
                      <h2 className="font-serif text-2xl text-[#1B1E1C] group-hover:text-[#3B4C3E] transition-colors leading-snug mb-2">
                        <Link to={`/blog/${post.slug}`}>{post.title}</Link>
                      </h2>
                      <p className="text-xs sm:text-sm text-[#666157] font-light leading-relaxed mb-4 line-clamp-3">
                        {post.summary}
                      </p>
                    </div>

                    <div className="flex items-center text-[11px] text-[#8C877D] pt-2 border-t border-[#EAE5DC]">
                      <span>{post.readTimeMinutes} dk okuma</span>
                      <span className="mx-2">•</span>
                      <span>{post.author}</span>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
};
