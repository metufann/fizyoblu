import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ArrowUpRight, Phone } from 'lucide-react';
import type { SiteSettings } from '../types';

interface NavbarProps {
  settings?: SiteSettings;
}

export const Navbar: React.FC<NavbarProps> = ({ settings }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: 'Ana Sayfa', href: '/' },
    { name: 'Hakkımızda', href: '/hakkimizda' },
    { name: 'Hizmetler', href: '/hizmetler' },
    { name: 'Şubeler', href: '/subeler' },
    { name: 'Ekibimiz', href: '/ekibimiz' },
    { name: 'Blog', href: '/blog' },
    { name: 'Galeri', href: '/galeri' },
    { name: 'İletişim', href: '/iletisim' },
  ];

  const phone = settings?.contact_phone || '+90 (212) 444 89 20';
  const whatsapp = settings?.contact_whatsapp || '+90 (532) 123 45 67';
  const cleanWhatsapp = whatsapp.replace(/[^0-9]/g, '');

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#FAF9F5]/95 backdrop-blur-md border-b border-[#E8E4DC] py-4'
          : 'bg-[#FAF9F5] border-b border-transparent py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 flex items-center justify-between">
        {/* Brand / Logo */}
        <Link to="/" className="group flex items-center py-1">
          <img
            src={settings?.site_logo || '/logo/logo-horizontal.svg'}
            alt={settings?.logo_text || 'FizyoBlu Logo'}
            className="h-10 sm:h-11 w-auto object-contain transition-transform group-hover:scale-[1.02]"
            onError={(e) => {
              // Fallback to text if image fails
              (e.currentTarget as HTMLElement).style.display = 'none';
              const fallback = document.getElementById('navbar-text-fallback');
              if (fallback) fallback.style.display = 'flex';
            }}
          />
          <div id="navbar-text-fallback" className="hidden flex-col">
            <span className="font-serif text-2xl tracking-[0.2em] font-normal uppercase text-[#1C2024]">
              {settings?.logo_text || 'FIZYOBLU'}
            </span>
            <span className="text-[10px] tracking-[0.25em] uppercase text-[#736E65] font-light">
              Klinik Pilates & Fizyoterapi
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-8">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.href;
            return (
              <Link
                key={link.name}
                to={link.href}
                className={`text-sm tracking-wide font-normal transition-colors relative py-1 ${
                  isActive ? 'text-[#1C2024] font-medium' : 'text-[#5C574E] hover:text-[#1C2024]'
                }`}
              >
                {link.name}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-[#3B4C3E]" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Direct Action Contacts */}
        <div className="hidden lg:flex items-center space-x-5">
          <a
            href={`tel:${phone.replace(/[^0-9+]/g, '')}`}
            className="flex items-center text-xs tracking-wider text-[#5C574E] hover:text-[#1C2024] transition-colors"
          >
            <Phone className="w-3.5 h-3.5 mr-1.5 opacity-70" />
            <span>{phone}</span>
          </a>

          <a
            href={`https://wa.me/${cleanWhatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-4 py-2 border border-[#3B4C3E] text-xs font-medium tracking-wider text-[#3B4C3E] hover:bg-[#3B4C3E] hover:text-[#FAF9F5] transition-all"
          >
            <span>WHATSAPP</span>
            <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
          </a>
        </div>

        {/* Mobile Toggle Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="lg:hidden p-2 text-[#22252A] hover:text-black focus:outline-none"
          aria-label="Menüyü Aç"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="lg:hidden bg-[#FAF9F5] border-b border-[#E8E4DC] px-6 py-8">
          <nav className="flex flex-col space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className="text-base text-[#22252A] hover:text-[#3B4C3E] font-medium tracking-wide py-1"
              >
                {link.name}
              </Link>
            ))}
          </nav>

          <div className="mt-8 pt-6 border-t border-[#E8E4DC] flex flex-col space-y-3">
            <a
              href={`tel:${phone.replace(/[^0-9+]/g, '')}`}
              className="text-sm text-[#5C574E] flex items-center"
            >
              <Phone className="w-4 h-4 mr-2" />
              {phone}
            </a>
            <a
              href={`https://wa.me/${cleanWhatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center py-2.5 px-4 bg-[#3B4C3E] text-[#FAF9F5] text-xs tracking-wider uppercase font-medium"
            >
              <span>WhatsApp İle İletişim</span>
              <ArrowUpRight className="w-4 h-4 ml-1.5" />
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
