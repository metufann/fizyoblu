import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Clock, User, Calendar } from 'lucide-react';
import { SEO } from '../components/SEO';
import { api } from '../services/api';
import type { BlogPost } from '../types';

export const BlogDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    api.getBlogPostBySlug(slug)
      .then((res) => {
        if (res.success && res.data) {
          setPost(res.data);
        } else {
          setError('Blog yazısı bulunamadı.');
        }
      })
      .catch((err) => setError(err.message || 'Yazı yüklenirken hata oluştu.'))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="pt-40 pb-24 text-center">
        <p className="text-sm text-[#736E65]">Blog yazısı yükleniyor...</p>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="pt-40 pb-24 text-center space-y-4">
        <h1 className="font-serif text-2xl text-[#1B1E1C]">Yazı Bulunamadı</h1>
        <p className="text-sm text-[#736E65]">Aradığınız makale mevcut değil veya yayından kaldırılmış olabilir.</p>
        <Link to="/blog" className="inline-block text-xs uppercase tracking-wider text-[#2B382D] underline">
          Tüm Yazılara Dön
        </Link>
      </div>
    );
  }

  const formattedDate = new Date(post.publishedAt).toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <>
      <SEO
        title={post.metaTitle || post.title}
        description={post.metaDescription || post.summary}
        ogImage={post.coverImageUrl}
        type="article"
      />

      <article className="pt-36 pb-24 bg-[#FAF9F5]">
        <div className="max-w-3xl mx-auto px-6 sm:px-8">
          <Link
            to="/blog"
            className="inline-flex items-center text-xs tracking-wider uppercase text-[#736E65] hover:text-[#1B1E1C] mb-8 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5 mr-1.5" />
            <span>Tüm Yazılara Dön</span>
          </Link>

          <header className="space-y-4 mb-8">
            {post.categoryName && (
              <span className="text-[11px] font-semibold tracking-[0.25em] uppercase text-[#6B7566] block">
                {post.categoryName}
              </span>
            )}

            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#1B1E1C] font-normal leading-tight">
              {post.title}
            </h1>

            <p className="text-base sm:text-lg text-[#555148] font-light leading-relaxed">
              {post.summary}
            </p>

            <div className="pt-4 pb-4 border-y border-[#E8E4DC] flex flex-wrap items-center gap-6 text-xs text-[#706B62]">
              <div className="flex items-center space-x-1.5">
                <User className="w-3.5 h-3.5 opacity-70" />
                <span>{post.author}</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <Calendar className="w-3.5 h-3.5 opacity-70" />
                <span>{formattedDate}</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <Clock className="w-3.5 h-3.5 opacity-70" />
                <span>{post.readTimeMinutes} dakika okuma</span>
              </div>
            </div>
          </header>

          {/* Cover */}
          {post.coverImageUrl && (
            <div className="aspect-[16/9] overflow-hidden bg-[#ECE8E0] mb-12">
              <img
                src={post.coverImageUrl}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Rich Content from TipTap / HTML */}
          <div
            className="prose prose-neutral max-w-none text-[#3A362F] font-light leading-relaxed text-sm sm:text-base space-y-6"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Author Box */}
          <div className="mt-16 pt-8 border-t border-[#E8E4DC] flex items-center justify-between text-xs text-[#7A756B]">
            <p>Yazar: <strong className="text-[#1B1E1C] font-medium">{post.author}</strong></p>
            <Link to="/blog" className="uppercase tracking-wider hover:text-black">
              Diğer Makaleler →
            </Link>
          </div>
        </div>
      </article>
    </>
  );
};
