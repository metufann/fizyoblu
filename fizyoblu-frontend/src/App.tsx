import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { api } from './services/api';
import type { SiteSettings, Branch } from './types';

// Public Pages
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { ServicesPage } from './pages/ServicesPage';
import { ServiceDetailPage } from './pages/ServiceDetailPage';
import { BranchesPage } from './pages/BranchesPage';
import { TeamPage } from './pages/TeamPage';
import { BlogPage } from './pages/BlogPage';
import { BlogDetailPage } from './pages/BlogDetailPage';
import { GalleryPage } from './pages/GalleryPage';
import { ContactPage } from './pages/ContactPage';

// Admin Pages
import { AdminLoginPage } from './pages/admin/AdminLoginPage';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminServicesPage } from './pages/admin/AdminServicesPage';
import { AdminBranchesPage } from './pages/admin/AdminBranchesPage';
import { AdminTeamPage } from './pages/admin/AdminTeamPage';
import { AdminBlogPage } from './pages/admin/AdminBlogPage';
import { AdminGalleryPage } from './pages/admin/AdminGalleryPage';
import { AdminMessagesPage } from './pages/admin/AdminMessagesPage';
import { AdminSettingsPage } from './pages/admin/AdminSettingsPage';

// Scroll to top on navigation
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

// Protected Admin Route
const ProtectedAdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F7F6F2] flex items-center justify-center">
        <p className="text-xs uppercase tracking-wider text-[#736E65]">Oturum kontrol ediliyor...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
};

// Public Layout Wrapper
const PublicLayout: React.FC<{
  settings?: SiteSettings;
  branches?: Branch[];
  children: React.ReactNode;
}> = ({ settings, branches, children }) => {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#FAF9F5]">
      <Navbar settings={settings} />
      <main className="flex-grow">{children}</main>
      <Footer settings={settings} branches={branches} />
    </div>
  );
};

export const AppContent: React.FC = () => {
  const [settings, setSettings] = useState<SiteSettings>({});
  const [branches, setBranches] = useState<Branch[]>([]);

  useEffect(() => {
    Promise.all([api.getSettings(), api.getBranches()])
      .then(([settingsRes, branchesRes]) => {
        if (settingsRes.success) setSettings(settingsRes.data);
        if (branchesRes.success) setBranches(branchesRes.data);
      })
      .catch((err) => console.error('Genel veriler yüklenemedi:', err));
  }, []);

  return (
    <>
      <ScrollToTop />
      <Routes>
        {/* Public Routes */}
        <Route
          path="/"
          element={
            <PublicLayout settings={settings} branches={branches}>
              <HomePage settings={settings} branches={branches} />
            </PublicLayout>
          }
        />
        <Route
          path="/hakkimizda"
          element={
            <PublicLayout settings={settings} branches={branches}>
              <AboutPage settings={settings} />
            </PublicLayout>
          }
        />
        <Route
          path="/hizmetler"
          element={
            <PublicLayout settings={settings} branches={branches}>
              <ServicesPage />
            </PublicLayout>
          }
        />
        <Route
          path="/hizmetler/:slug"
          element={
            <PublicLayout settings={settings} branches={branches}>
              <ServiceDetailPage settings={settings} />
            </PublicLayout>
          }
        />
        <Route
          path="/subeler"
          element={
            <PublicLayout settings={settings} branches={branches}>
              <BranchesPage />
            </PublicLayout>
          }
        />
        <Route
          path="/ekibimiz"
          element={
            <PublicLayout settings={settings} branches={branches}>
              <TeamPage />
            </PublicLayout>
          }
        />
        <Route
          path="/blog"
          element={
            <PublicLayout settings={settings} branches={branches}>
              <BlogPage />
            </PublicLayout>
          }
        />
        <Route
          path="/blog/:slug"
          element={
            <PublicLayout settings={settings} branches={branches}>
              <BlogDetailPage />
            </PublicLayout>
          }
        />
        <Route
          path="/galeri"
          element={
            <PublicLayout settings={settings} branches={branches}>
              <GalleryPage />
            </PublicLayout>
          }
        />
        <Route
          path="/iletisim"
          element={
            <PublicLayout settings={settings} branches={branches}>
              <ContactPage settings={settings} branches={branches} />
            </PublicLayout>
          }
        />

        {/* Admin Login */}
        <Route path="/admin/login" element={<AdminLoginPage />} />

        {/* Protected Admin Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedAdminRoute>
              <AdminDashboardPage />
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="/admin/services"
          element={
            <ProtectedAdminRoute>
              <AdminServicesPage />
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="/admin/branches"
          element={
            <ProtectedAdminRoute>
              <AdminBranchesPage />
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="/admin/team"
          element={
            <ProtectedAdminRoute>
              <AdminTeamPage />
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="/admin/blog"
          element={
            <ProtectedAdminRoute>
              <AdminBlogPage />
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="/admin/gallery"
          element={
            <ProtectedAdminRoute>
              <AdminGalleryPage />
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="/admin/messages"
          element={
            <ProtectedAdminRoute>
              <AdminMessagesPage />
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="/admin/settings"
          element={
            <ProtectedAdminRoute>
              <AdminSettingsPage />
            </ProtectedAdminRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </AuthProvider>
  );
}
