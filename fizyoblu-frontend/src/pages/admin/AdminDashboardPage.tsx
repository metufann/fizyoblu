import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AdminLayout } from '../../components/AdminLayout';
import { api } from '../../services/api';
import { Sparkles, MapPin, Users, FileText, Mail, Image, ArrowRight } from 'lucide-react';
import type { ContactMessage } from '../../types';

export const AdminDashboardPage: React.FC = () => {
  const [stats, setStats] = useState({
    services: 0,
    branches: 0,
    team: 0,
    posts: 0,
    media: 0,
    unreadMessages: 0
  });
  const [recentMessages, setRecentMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboard() {
      try {
        const [servicesRes, branchesRes, teamRes, postsRes, mediaRes, messagesRes] = await Promise.all([
          api.getAdminServices(),
          api.getAdminBranches(),
          api.getAdminTeam(),
          api.getAdminBlogPosts(),
          api.getAllMedia(),
          api.getMessages()
        ]);

        const unread = messagesRes.success ? messagesRes.data.filter((m) => !m.isRead).length : 0;

        setStats({
          services: servicesRes.success ? servicesRes.data.length : 0,
          branches: branchesRes.success ? branchesRes.data.length : 0,
          team: teamRes.success ? teamRes.data.length : 0,
          posts: postsRes.success ? postsRes.data.length : 0,
          media: mediaRes.success ? mediaRes.data.length : 0,
          unreadMessages: unread
        });

        if (messagesRes.success) {
          setRecentMessages(messagesRes.data.slice(0, 5));
        }
      } catch (err) {
        console.error('Dashboard yüklenemedi:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboard();
  }, []);

  const statCards = [
    { title: 'Aktif Hizmetler', value: stats.services, icon: Sparkles, href: '/admin/services' },
    { title: 'Şubeler', value: stats.branches, icon: MapPin, href: '/admin/branches' },
    { title: 'Ekip Üyeleri', value: stats.team, icon: Users, href: '/admin/team' },
    { title: 'Blog Yazıları', value: stats.posts, icon: FileText, href: '/admin/blog' },
    { title: 'Galeri Görselleri', value: stats.media, icon: Image, href: '/admin/gallery' },
    { title: 'Okunmamış Mesaj', value: stats.unreadMessages, icon: Mail, href: '/admin/messages', highlight: stats.unreadMessages > 0 },
  ];

  return (
    <AdminLayout title="Yönetim Özeti" subtitle="FizyoBlu web sitesi içerik ve iletişim göstergeleri">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.title}
              to={card.href}
              className={`p-6 bg-white border transition-all hover:border-[#3B4C3E] ${
                card.highlight ? 'border-[#C56868] bg-[#FFFBFB]' : 'border-[#E4DFD5]'
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs uppercase tracking-wider text-[#736E65] font-medium">
                  {card.title}
                </span>
                <Icon className={`w-5 h-5 ${card.highlight ? 'text-[#C56868]' : 'text-[#4A5D4E]'}`} />
              </div>
              <p className="font-serif text-3xl text-[#1B1E1C]">{card.value}</p>
            </Link>
          );
        })}
      </div>

      {/* Recent Inquiries */}
      <div className="bg-white border border-[#E4DFD5] p-6 space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-[#EFECE5]">
          <h2 className="font-serif text-xl text-[#1B1E1C]">Son Gelen Mesajlar</h2>
          <Link
            to="/admin/messages"
            className="text-xs text-[#2B382D] hover:underline flex items-center font-medium"
          >
            <span>Tümünü Gör</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </Link>
        </div>

        {loading ? (
          <p className="text-xs text-[#7A756B] py-4">Veriler yükleniyor...</p>
        ) : recentMessages.length === 0 ? (
          <p className="text-xs text-[#7A756B] py-4">Henüz mesaj bulunmuyor.</p>
        ) : (
          <div className="divide-y divide-[#EFECE5]">
            {recentMessages.map((msg) => (
              <div key={msg.id} className="py-3 flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-[#1B1E1C]">
                    {msg.fullName}{' '}
                    {!msg.isRead && (
                      <span className="ml-2 inline-block px-1.5 py-0.5 bg-[#FBE9E7] text-[#C62828] text-[9px] uppercase font-bold">
                        Yeni
                      </span>
                    )}
                  </p>
                  <p className="text-[11px] text-[#736E65] mt-0.5">
                    {msg.email} • {msg.phone}
                    {msg.interestedService ? ` • ${msg.interestedService}` : ''}
                  </p>
                </div>
                <span className="text-[11px] text-[#8C877D]">
                  {new Date(msg.createdAt).toLocaleDateString('tr-TR')}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};
