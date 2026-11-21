import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Lock, Mail, ArrowRight } from 'lucide-react';
import { SEO } from '../../components/SEO';

export const AdminLoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('admin@fizyoblu.com');
  const [password, setPassword] = useState('FizyoBlu2024!');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await login({ email, password });
      navigate('/admin');
    } catch (err: any) {
      setError(err.message || 'Giriş yapılamadı. Lütfen bilgilerinizi kontrol edin.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEO title="Yönetici Girişi" />
      <div className="min-h-screen bg-[#F4F1EA] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
          <Link to="/" className="inline-block">
            <img
              src="/logo/logo-stacked.svg"
              alt="FizyoBlu Logo"
              className="h-24 w-auto mx-auto object-contain mb-3"
            />
          </Link>
          <h2 className="mt-1 text-xs uppercase tracking-[0.2em] font-semibold text-[#666157]">
            Yönetim Paneli Girişi
          </h2>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-[#FAF9F5] py-8 px-6 sm:px-10 border border-[#DDD6C8] space-y-6">
            {error && (
              <div className="p-3 bg-[#FBE9E7] border border-[#FFCCBC] text-[#C62828] text-xs">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#6A655C] mb-1.5">
                  E-posta Adresi
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#FFFFFF] border border-[#DDD8CE] px-3.5 py-2.5 pl-9 text-xs text-[#222] focus:outline-none focus:border-[#2B382D]"
                  />
                  <Mail className="w-4 h-4 text-[#8C877D] absolute left-3 top-3" />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#6A655C] mb-1.5">
                  Şifre
                </label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-[#FFFFFF] border border-[#DDD8CE] px-3.5 py-2.5 pl-9 text-xs text-[#222] focus:outline-none focus:border-[#2B382D]"
                  />
                  <Lock className="w-4 h-4 text-[#8C877D] absolute left-3 top-3" />
                </div>
              </div>

              <div className="text-[11px] text-[#7A756B] bg-[#F4F1EA] p-3 border border-[#E5E0D5]">
                <p className="font-medium text-[#444]">Varsayılan Giriş Bilgileri:</p>
                <p>E-posta: <code>admin@fizyoblu.com</code></p>
                <p>Şifre: <code>FizyoBlu2024!</code></p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-[#2B382D] text-[#FAF9F5] text-xs font-medium tracking-[0.15em] uppercase hover:bg-[#1E261F] transition-all disabled:opacity-50 flex items-center justify-center"
              >
                <span>{loading ? 'Giriş Yapılıyor...' : 'Panele Giriş Yap'}</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
              </button>
            </form>

            <div className="pt-4 text-center border-t border-[#E8E4DC]">
              <Link to="/" className="text-xs text-[#7A756B] hover:text-[#1B1E1C]">
                ← Ana Sayfaya Dön
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
