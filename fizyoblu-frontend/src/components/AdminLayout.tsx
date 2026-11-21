import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  Sparkles,
  MapPin,
  Users,
  FileText,
  Image,
  Mail,
  Settings,
  LogOut,
  ExternalLink
} from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children, title, subtitle }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  const navItems = [
    { name: 'Genel Bakış', href: '/admin', icon: LayoutDashboard },
    { name: 'Hizmetler', href: '/admin/services', icon: Sparkles },
    { name: 'Şubeler', href: '/admin/branches', icon: MapPin },
    { name: 'Ekip Üyeleri', href: '/admin/team', icon: Users },
    { name: 'Blog & Yazılar', href: '/admin/blog', icon: FileText },
    { name: 'Galeri & Medya', href: '/admin/gallery', icon: Image },
    { name: 'Gelen Mesajlar', href: '/admin/messages', icon: Mail },
    { name: 'Site Ayarları', href: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#F7F6F2] flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-[#1C1F1D] text-[#ECE7DE] flex flex-col justify-between border-r border-[#2C302D] shrink-0">
        <div>
          {/* Logo / Admin Brand */}
          <div className="p-6 border-b border-[#2C302D]">
            <Link to="/" target="_blank" className="flex items-center space-x-3 group">
              <img
                src="/logo/logo-icon.svg"
                alt="FizyoBlu Logo"
                className="h-9 w-9 shrink-0 object-contain"
              />
              <div className="flex flex-col">
                <span className="font-serif text-lg tracking-[0.15em] font-medium uppercase text-[#FAF9F5] group-hover:text-[#0E9AD7] transition-colors leading-none">
                  FIZYOBLU
                </span>
                <span className="block text-[9px] tracking-[0.2em] uppercase text-[#66C044] font-semibold mt-1">
                  Yönetim Paneli
                </span>
              </div>
            </Link>
          </div>

          {/* Nav Items */}
          <nav className="p-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.href === '/admin'
                  ? location.pathname === '/admin'
                  : location.pathname.startsWith(item.href);

              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center space-x-3 px-3.5 py-2.5 text-xs tracking-wider rounded transition-colors ${
                    isActive
                      ? 'bg-[#2E3B30] text-[#E7EDE8] font-medium'
                      : 'text-[#A39E94] hover:bg-[#252A27] hover:text-[#FAF9F5]'
                  }`}
                >
                  <Icon className="w-4 h-4 opacity-80" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Info & Footer Actions */}
        <div className="p-4 border-t border-[#2C302D] space-y-3">
          <div className="px-2">
            <p className="text-xs font-medium text-[#FAF9F5] truncate">{user?.fullName || 'Yönetici'}</p>
            <p className="text-[11px] text-[#7C776D] truncate">{user?.email}</p>
          </div>

          <div className="pt-2 flex items-center justify-between">
            <Link
              to="/"
              target="_blank"
              className="text-xs text-[#9E998F] hover:text-white flex items-center transition-colors"
            >
              <span>Siteyi Gör</span>
              <ExternalLink className="w-3 h-3 ml-1" />
            </Link>

            <button
              onClick={handleLogout}
              className="text-xs text-[#C56868] hover:text-[#E07D7D] flex items-center transition-colors"
            >
              <LogOut className="w-3.5 h-3.5 mr-1" />
              <span>Çıkış</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="bg-white border-b border-[#E5E0D6] px-8 py-6">
          <h1 className="font-serif text-2xl text-[#1E2220] tracking-wide">{title}</h1>
          {subtitle && <p className="text-xs text-[#736E65] mt-1 font-light">{subtitle}</p>}
        </header>

        {/* Page Content */}
        <div className="p-6 md:p-8 flex-1 overflow-y-auto">{children}</div>
      </main>
    </div>
  );
};
