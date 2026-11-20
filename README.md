# FizyoBlu — Full Stack Web Projesi

FizyoBlu pilates ve fizyoterapi işletmesi için modern, SEO uyumlu, mobil destekli tanıtım web sitesi ve entegre yönetim paneli.

---

## Proje Mimarisi

Monorepo yapısında iki bağımsız modülden oluşmaktadır:

```
fizyoblu/
├── fizyoblu-frontend/    # React 19 + TypeScript + Vite + Tailwind CSS v4 + TipTap
├── fizyoblu-backend/     # ASP.NET Core 10 Web API + EF Core + PostgreSQL / SQLite
├── docker-compose.yml    # PostgreSQL ve Backend orkestrasyonu
└── README.md
```

### Tasarım İlkeleri
- **Minimalist & Zarif:** Kırık beyaz, doğal taş, adaçayı ve sıcak toprak tonları.
- **Sade Tipografi:** Başlıklarda editoryal `Cormorant Garamond`, metinlerde `Plus Jakarta Sans`.
- **Gereksiz Öğelerden Arındırılmış:** Sahte kartlar, abartılı gölgeler, yapay zekâ klişeleri veya anlamsız istatistikler içermez.
- **Dinamik İçerik:** Tüm başlıklar, hizmetler, blog yazıları, şube bilgileri ve fotoğraflar admin panelinden yönetilir ve anında sitede güncellenir.

---

## Sayfalar

### Ziyaretçi Sayfaları
1. **Ana Sayfa (`/`):** Hero, klinik felsefe özeti, öne çıkan hizmetler, stüdyolar, uzman kadro, en son blog yazıları, seçki galeri ve danışma çağrısı.
2. **Hakkımızda (`/hakkimizda`):** Bütüncül fizyoterapi standartları, kişiye özel egzersiz metodolojisi ve stüdyo hijyen prensipleri.
3. **Hizmetler (`/hizmetler`):** Klinik Pilates, Reformer Pilates, Manuel Terapi, Skolyoz & Omurga Egzersizleri, Hamile Pilatesi, Postür Analizi.
4. **Hizmet Detayı (`/hizmetler/:slug`):** Dinamik içerik, endikasyonlar, faydalar ve doğrudan WhatsApp bilgi butonu.
5. **Şubeler (`/subeler`):** Kadıköy/Moda ve Nişantaşı stüdyoları; açık adres, telefon, WhatsApp ve Google Haritalar yönlendirmeleri.
6. **Ekibimiz (`/ekibimiz`):** Lisanslı fizyoterapistler, akademik geçmiş, biyografi ve uzmanlık alanları.
7. **Blog (`/blog`):** Kategori filtreleme, arama çubuğu ve okuma süreleri ile omurga sağlığı rehberleri.
8. **Blog Detayı (`/blog/:slug`):** TipTap editörü ile hazırlanmış zengin makale içeriği, yazar ve tarih bilgisi.
9. **Galeri (`/galeri`):** Kategori filtreli stüdyo ve egzersiz fotoğrafları, tam ekran modal lightbox.
10. **İletişim (`/iletisim`):** Doğrudan veritabanına kaydedilen iletişim/danışma formu, WhatsApp hattı ve merkez telefon bilgileri.

### Yönetim Paneli (`/admin`)
- Giriş Sayfası: `/admin/login`
- **HttpOnly Cookie** ve JWT tabanlı güvenli kimlik doğrulama.
- Yönetim Özeti (Dashboard): İstatistik sayaçları ve son gelen mesajlar.
- **Hizmetler (CRUD):** Yeni hizmet ekleme, düzenleme, silme, öne çıkarma, sıra değiştirme.
- **Şubeler (CRUD):** Şube adı, ilçe, adres, telefon, WhatsApp, çalışma saatleri, Google Maps linki.
- **Ekip Üyeleri (CRUD):** Fizyoterapist bilgileri, unvan, biyografi, uzmanlıklar ve fotoğraf.
- **Blog Yazıları (CRUD):** TipTap WYSIWYG zengin metin editörü (kalın, italik, H2, H3, alıntı, listeler), SEO meta başlık/açıklama girişleri.
- **Kategoriler:** Blog kategorilerini yönetme.
- **Galeri & Medya:** Sunucuya dosya yükleme (JPG, PNG, WEBP), başlık, kategori ve silme işlemleri.
- **Gelen Mesajlar:** Ziyaretçilerin ilettiği formları görüntüleme, okundu işaretleme, WhatsApp ve e-posta ile tek tıkla yanıtlama, silme.
- **Site Ayarları:** Hero başlığı, alt metni, görseli, telefon, WhatsApp, e-posta, sosyal medya ve SEO varsayılanlarını dinamik güncelleme.

---

## Hızlı Başlangıç

### 1. Varsayılan Yönetici Bilgileri
- **E-posta:** `admin@fizyoblu.com`
- **Şifre:** `FizyoBlu2024!`

*(İlk çalıştırmada veritabanı otomatik olarak bu kullanıcıyı ve başlangıç içeriklerini seed eder).*

---

### 2. Backend Kurulumu ve Çalıştırma

Gereksinimler: `.NET 10 SDK`

```bash
cd fizyoblu-backend

# Bağımlılıkları yükle
dotnet restore

# Geliştirme sunucusunu başlat (Port 5005)
dotnet run --urls "http://127.0.0.1:5005"
```

> **Veritabanı Notu:** 
> - Yerel ortamda PostgreSQL çalışmıyorsa sistem otomatik olarak sıfır yapılandırmayla `fizyoblu.db` (SQLite) oluşturur ve seed verilerini yükler.
> - PostgreSQL kullanmak istediğinizde `appsettings.json` içindeki `ConnectionStrings:DefaultConnection` veya ortam değişkeni olarak `DATABASE_URL` tanımlamanız yeterlidir. PostgreSQL için EF Core migration'ları hazırdır.

#### EF Core Migration Komutları (PostgreSQL)
```bash
cd fizyoblu-backend

# Yeni migration oluşturma
dotnet ef migrations add <MigrationAdi> -- --DatabaseProvider=PostgreSQL

# Veritabanına uygulama
dotnet ef database update -- --DatabaseProvider=PostgreSQL
```

---

### 3. Frontend Kurulumu ve Çalıştırma

Gereksinimler: `Node.js v18+` (Önerilen: v20 veya v24)

```bash
cd fizyoblu-frontend

# Bağımlılıkları yükle
npm install

# Geliştirme sunucusunu başlat (Port 5173)
npm run dev
```

Tarayıcınızda açın:
- **Web Sitesi:** [http://localhost:5173](http://localhost:5173)
- **Admin Girişi:** [http://localhost:5173/admin/login](http://localhost:5173/admin/login)

---

### 4. Docker ile Çalıştırma

PostgreSQL veritabanı ve ASP.NET Core API'yi tek komutla başlatmak için:

```bash
docker compose up -d --build
```

---

## Deployment (Dağıtım) Rehberi

### Frontend: Vercel
1. Vercel dashboard'unda yeni proje oluşturun ve reponuzu bağlayın.
2. Root Directory: `fizyoblu-frontend`
3. Framework Preset: `Vite`
4. Build Command: `npm run build`
5. Output Directory: `dist`
6. `fizyoblu-frontend/vercel.json` SPA yönlendirmeleri için halihazırda yapılandırılmıştır.

### Backend: Render
1. Render üzerinde yeni bir **Web Service** oluşturun.
2. Root Directory: `fizyoblu-backend`
3. Environment: `Docker` (veya Dockerfile yolu: `fizyoblu-backend/Dockerfile`)
4. Render PostgreSQL veritabanı ekleyin ve `DATABASE_URL` ortam değişkenini backend servisine bağlayın.
5. Ortam Değişkenleri:
   - `ASPNETCORE_ENVIRONMENT`: `Production`
   - `DATABASE_URL`: `postgres://...` (Render dahili bağlantı dizesi)
   - `FrontendUrl`: `https://siteniz.vercel.app`
   - `Jwt__Secret`: `GucluVeUzunBirSecretAnahtari123!`

---

## Eksik Kalan / Canlıya Geçiş Öncesi Yapılandırmalar
- Canlı alan adı (örneğin `fizyoblu.com`) bağlandığında `appsettings.Production.json` ve `Program.cs` CORS listesindeki domain kontrol edilmelidir.
- Prodüksiyonda Render veya bulut sunucu üzerinde kalıcı görsel depolaması için persistent disk mount edilmelidir (`/app/wwwroot/uploads`).
- İsteğe bağlı olarak iletişim formu gönderimlerinde yöneticiye anlık e-posta uyarısı için SendGrid veya SMTP entegrasyonu eklenebilir.
