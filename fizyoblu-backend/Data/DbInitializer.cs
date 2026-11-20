using FizyoBlu.Backend.Entities;
using Microsoft.EntityFrameworkCore;

namespace FizyoBlu.Backend.Data;

public static class DbInitializer
{
    public static async Task SeedAsync(AppDbContext context, IConfiguration config)
    {
        // 1. Seed Admin User
        if (!await context.Users.AnyAsync())
        {
            var adminEmail = config["AdminUser:Email"] ?? "admin@fizyoblu.com";
            var adminPassword = config["AdminUser:Password"] ?? "FizyoBlu2024!";
            var passwordHash = BCrypt.Net.BCrypt.HashPassword(adminPassword);

            context.Users.Add(new User
            {
                FullName = "FizyoBlu Yönetici",
                Email = adminEmail,
                PasswordHash = passwordHash,
                Role = "Admin",
                CreatedAt = DateTime.UtcNow
            });
            await context.SaveChangesAsync();
        }

        // 2. Seed Site Settings
        if (!await context.SiteSettings.AnyAsync())
        {
            var settings = new List<SiteSetting>
            {
                // General
                new() { Key = "site_name", Value = "FizyoBlu", Group = "General" },
                new() { Key = "site_tagline", Value = "Klinik Pilates & Fizyoterapi Stüdyosu", Group = "General" },
                new() { Key = "site_description", Value = "Bütüncül fizyoterapi ve kişiye özel klinik reformer pilates ile omurga sağlığınızı, hareket özgürlüğünüzü ve yaşam kalitenizi geri kazanın.", Group = "General" },
                new() { Key = "logo_text", Value = "FIZYOBLU", Group = "General" },

                // Contact
                new() { Key = "contact_phone", Value = "+90 (212) 444 89 20", Group = "Contact" },
                new() { Key = "contact_whatsapp", Value = "+90 (532) 123 45 67", Group = "Contact" },
                new() { Key = "contact_email", Value = "info@fizyoblu.com", Group = "Contact" },
                new() { Key = "working_hours_weekday", Value = "Pazartesi - Cuma: 08:30 - 20:30", Group = "Contact" },
                new() { Key = "working_hours_weekend", Value = "Cumartesi: 09:00 - 18:00 | Pazar: Dinlenme", Group = "Contact" },

                // Social
                new() { Key = "social_instagram", Value = "https://instagram.com/fizyoblu", Group = "Social" },
                new() { Key = "social_facebook", Value = "https://facebook.com/fizyoblu", Group = "Social" },
                new() { Key = "social_linkedin", Value = "https://linkedin.com/company/fizyoblu", Group = "Social" },
                new() { Key = "social_youtube", Value = "https://youtube.com/@fizyoblu", Group = "Social" },

                // Hero & Home
                new() { Key = "hero_eyebrow", Value = "BİLİMSEL YAKLAŞIM & KLİNİK DENEYİM", Group = "Hero" },
                new() { Key = "hero_title", Value = "Hareketin İyileştirici Gücüyle Bedeninizi Keşfedin", Group = "Hero" },
                new() { Key = "hero_subtitle", Value = "Uzman fizyoterapistler rehberliğinde kişiselleştirilmiş klinik pilates, manuel terapi ve postür rehabilitasyonu.", Group = "Hero" },
                new() { Key = "hero_image", Value = "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1800&q=80", Group = "Hero" },
                new() { Key = "about_preview_title", Value = "Ağrısız, Güçlü ve Dengeli Bir Yaşam İçin Buradayız", Group = "Hero" },
                new() { Key = "about_preview_text", Value = "FizyoBlu olarak klasik egzersiz kalıplarının ötesine geçiyoruz. Her bireyin kas-iskelet yapısı, postür alışkanlıkları ve yaşam biçimi benzersizdir. Detaylı klinik değerlendirmelerle bedeninize özel hazırlanan egzersiz programları ile kalıcı omurga sağlığı ve kondisyon hedefliyoruz.", Group = "Hero" },

                // SEO
                new() { Key = "meta_title", Value = "FizyoBlu | Klinik Pilates & Fizyoterapi Stüdyosu", Group = "SEO" },
                new() { Key = "meta_description", Value = "Uzman fizyoterapistler eşliğinde klinik pilates, reformer, manuel terapi ve skolyoz rehabilitasyonu. Randevu ve detaylı bilgi için bize ulaşın.", Group = "SEO" }
            };

            context.SiteSettings.AddRange(settings);
            await context.SaveChangesAsync();
        }

        // 3. Seed Branches
        if (!await context.Branches.AnyAsync())
        {
            var branches = new List<Branch>
            {
                new()
                {
                    Name = "Kadıköy / Moda Şubesi",
                    District = "Kadıköy",
                    City = "İstanbul",
                    Address = "Caferağa Mah. Moda Cad. No: 42/B, Kadıköy, İstanbul",
                    Phone = "+90 (216) 330 45 10",
                    WhatsApp = "+90 (532) 123 45 67",
                    Email = "kadikoy@fizyoblu.com",
                    WorkingHours = "Hafta İçi: 08:30 - 20:30 | Cts: 09:00 - 18:00",
                    GoogleMapsUrl = "https://maps.google.com/?q=Kadikoy+Istanbul",
                    EmbedMapUrl = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3011.6!2d29.027!3d40.988!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDDCsDU5JzE2LjgiTiAyOcKwMDEnMzcuMiJF!5e0!3m2!1str!2str!4v1",
                    ImageUrl = "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&w=1200&q=80",
                    Order = 1,
                    IsActive = true
                },
                new()
                {
                    Name = "Nişantaşı Şubesi",
                    District = "Şişli",
                    City = "İstanbul",
                    Address = "Teşvikiye Mah. Vali Konağı Cad. No: 88 K:2, Şişli, İstanbul",
                    Phone = "+90 (212) 240 12 30",
                    WhatsApp = "+90 (533) 765 43 21",
                    Email = "nisantasi@fizyoblu.com",
                    WorkingHours = "Hafta İçi: 08:00 - 21:00 | Cts: 09:00 - 18:30",
                    GoogleMapsUrl = "https://maps.google.com/?q=Nisantasi+Istanbul",
                    EmbedMapUrl = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3008.5!2d28.991!3d41.051!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDHCsDAzJzAzLjYiTiAyOMKwNTknMjcuNiJF!5e0!3m2!1str!2str!4v1",
                    ImageUrl = "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1200&q=80",
                    Order = 2,
                    IsActive = true
                }
            };
            context.Branches.AddRange(branches);
            await context.SaveChangesAsync();
        }

        // 4. Seed Services
        if (!await context.Services.AnyAsync())
        {
            var services = new List<ServiceItem>
            {
                new()
                {
                    Title = "Klinik Pilates",
                    Slug = "klinik-pilates",
                    Summary = "Fizyoterapist eşliğinde, omurga rahatsızlıkları ve postür problemlerine yönelik hedefe odaklı medikal egzersiz programı.",
                    Description = @"Klinik Pilates, geleneksel pilates prensiplerinin güncel fizyoterapi ve biyomekanik bilimleriyle harmanlandığı özel bir yaklaşımdır.

Seanslara başlamadan önce her danışanımızın detaylı postür ve kas-iskelet analizi yapılır. Bel fıtığı, boyun düzleşmesi, skolyoz ve eklem kısıtlılıkları gibi problemlerde omurgayı çevreleyen derin kor (core) kaslarını aktive ederek ağrısız ve güvenli bir hareket kabiliyeti kazandırılır.

**Kimler İçin Uygundur?**
- Bel, boyun ve sırt ağrısı yaşayanlar
- Sedanter yaşam sebebiyle kas zayıflığı ve postür bozukluğu olanlar
- Ameliyat sonrası veya fizik tedavi sürecini tamamlayıp güçlenmek isteyenler
- Beden farkındalığını ve esnekliğini artırmak isteyenler",
                    ImageUrl = "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1200&q=80",
                    Order = 1,
                    IsActive = true,
                    IsFeatured = true,
                    MetaDescription = "Fizyoterapist gözetiminde klinik pilates ile omurga sağlığınızı koruyun, bel ve boyun ağrılarınızdan kurtulun."
                },
                new()
                {
                    Title = "Reformer Pilates",
                    Slug = "reformer-pilates",
                    Summary = "Özel yay mekanizmalı Reformer & Cadillac ekipmanları ile tüm vücut kaslarını uzatarak güçlendiren dinamik çalışma.",
                    Description = @"Reformer Pilates, vücut ağırlığı ve yay direncinin hassas dengesiyle çalışan dünyaca kabul görmüş en etkili egzersiz yöntemlerinden biridir.

Ekipman üzerindeki kontrollü hareketler sayesinde eklemlere baskı yapmadan kasların uzayarak güçlenmesi (eksantrik kasılma) sağlanır. Duruş bozukluklarının giderilmesinde, sıkılaşmada, denge ve esneklik artışında üst düzey verim sunar.

Birebir (1:1 Private) veya en fazla 2 kişilik düet seanslar halinde uygulanır.",
                    ImageUrl = "https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?auto=format&fit=crop&w=1200&q=80",
                    Order = 2,
                    IsActive = true,
                    IsFeatured = true,
                    MetaDescription = "Reformer ve Cadillac ile birebir pilates seansları. Eklem yükünü azaltarak güçlü ve dengeli bir kas yapısına kavuşun."
                },
                new()
                {
                    Title = "Manuel Terapi & Fizyoterapi Danışmanlığı",
                    Slug = "manuel-terapi",
                    Summary = "Kas-iskelet sistemi disfonksiyonlarında eklem mobilizasyonu ve yumuşak doku teknikleriyle ağrıyı hafifleten uzman yaklaşım.",
                    Description = @"Manuel Terapi, herhangi bir cihaz ya da ilaç kullanmaksızın yalnızca fizyoterapistin elleriyle uyguladığı kanıta dayalı klinik bir yöntemdir.

Kısıtlanmış eklem hareket açıklıklarını yeniden kazandırmak, kas spazmlarını çözmek ve doku dolaşımını optimize etmek amacıyla uygulanır. Seanslarımız kapsamlı değerlendirme sonrasında hedefe yönelik planlanır.",
                    ImageUrl = "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80",
                    Order = 3,
                    IsActive = true,
                    IsFeatured = true,
                    MetaDescription = "Uzman fizyoterapistlerce uygulanan manuel terapi ile eklem ve kas ağrılarınızdan özgürleşin."
                },
                new()
                {
                    Title = "Skolyoz & Omurga Sağlığı (3 Boyutlu Egzersiz)",
                    Slug = "skolyoz-omurga-sagligi",
                    Summary = "Skolyoz ve kifoz gibi omurga eğriliklerinde 3 boyutlu düzeltici nefes ve asimetrik kor egzersiz protokolleri.",
                    Description = @"Omurganın üç boyutlu deformitesi olan skolyozda ve artmış sırt eğriliği olan kifozda erken ve doğru egzersiz müdahalesi büyük önem taşır.

FizyoBlu'da omurga eğriliğinin derecesi ve yönüne göre asimetrik germe, derotasyon ve özel solunum teknikleri uygulanarak omurga stabilitesi artırılır, eğriliğin ilerlemesi önlenir.",
                    ImageUrl = "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1200&q=80",
                    Order = 4,
                    IsActive = true,
                    IsFeatured = true,
                    MetaDescription = "Skolyoz ve kifoz için kişiye özel omurga rehabilitasyonu ve 3 boyutlu egzersiz protokolleri."
                },
                new()
                {
                    Title = "Hamile (Prenatal) & Doğum Sonrası Pilates",
                    Slug = "hamile-pilatesi",
                    Summary = "Gebelikte değişen ağırlık merkezine uyum sağlayan, pelvik tabanı güçlendiren ve doğuma hazırlayan güvenli seanslar.",
                    Description = @"Gebelik süreci bedende hormonal ve biyomekanik birçok değişimi beraberinde getirir. 

Hamile pilatesi, doktor onayı ile 12-14. haftadan itibaren uygulanabilir. Pelvik taban kaslarını bilinçli kullanmayı öğretir, bel ve kalça ağrılarını minimuma indirir ve doğum sonrası toparlanmayı hızlandırır.",
                    ImageUrl = "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=1200&q=80",
                    Order = 5,
                    IsActive = true,
                    IsFeatured = false,
                    MetaDescription = "Uzman fizyoterapist eşliğinde hamile ve doğum sonrası pilates programları."
                },
                new()
                {
                    Title = "Postür Analizi & Biyomekanik Değerlendirme",
                    Slug = "postur-analizi",
                    Summary = "Omurga dizilimi, basış dinamiği ve kas dengesizliklerinin ayrıntılı klinik testlerle haritalanması.",
                    Description = @"Herhangi bir programa başlamadan önce vücudun statik ve dinamik duruşunu değerlendirmek en kritik adımdır.

Omuz seviyeleri, leğen kemiği eğimi, bacak boyu farkı ve kas kısalıkları tespit edilir. Elde edilen objektif veriler doğrultusunda bireye özel egzersiz reçetesi oluşturulur.",
                    ImageUrl = "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=1200&q=80",
                    Order = 6,
                    IsActive = true,
                    IsFeatured = false,
                    MetaDescription = "Kapsamlı postür analizi ile duruş bozukluklarınızı ve kas dengesizliklerinizi tespit edin."
                }
            };

            context.Services.AddRange(services);
            await context.SaveChangesAsync();
        }

        // 5. Seed Team Members
        if (!await context.TeamMembers.AnyAsync())
        {
            var team = new List<TeamMember>
            {
                new()
                {
                    FullName = "Uzm. Fzt. Elif Deniz",
                    Title = "Kurucu & Baş Fizyoterapist",
                    Bio = "İstanbul Üniversitesi Fizyoterapi ve Rehabilitasyon bölümünden mezun olduktan sonra Ortopedik Rehabilitasyon alanında yüksek lisansını tamamladı. Uluslararası Klinik Pilates ve Schroth Skolyoz sertifikalarına sahip olup 11 yıllık klinik tecrübesi bulunmaktadır.",
                    ImageUrl = "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80",
                    Specialities = "Klinik Pilates, Omurga Rehabilitasyonu, Manuel Terapi",
                    Instagram = "elifdeniz.fzt",
                    LinkedIn = "elif-deniz-fzt",
                    Order = 1,
                    IsActive = true
                },
                new()
                {
                    FullName = "Fzt. Kerem Yılmaz",
                    Title = "Klinik Pilates & Sporcu Rehabilitasyonu Uzmanı",
                    Bio = "Marmara Üniversitesi mezunu olan Kerem Yılmaz, spor biyomekaniği ve reformer pilates odaklı çalışmaktadır. Kas-iskelet sistemi yaralanmaları sonrası spora dönüş ve postür düzeltme süreçlerini yönetmektedir.",
                    ImageUrl = "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=800&q=80",
                    Specialities = "Sporcu Sağlığı, Reformer Pilates, Kinesiyoloji",
                    Instagram = "keremyilmaz.fzt",
                    LinkedIn = "kerem-yilmaz-fzt",
                    Order = 2,
                    IsActive = true
                },
                new()
                {
                    FullName = "Fzt. Selin Aksoy",
                    Title = "Pelvik Taban & Prenatal Pilates Eğitmeni",
                    Bio = "Hacettepe Üniversitesi Fizyoterapi mezunudur. Kadın sağlığı, hamilelik öncesi ve sonrası pilates, pelvik taban rehabilitasyonu alanında uzmanlaşmış ve çok sayıda anne adayına rehberlik etmiştir.",
                    ImageUrl = "https://images.unsplash.com/photo-1594824813511-1a8ca46006e8?auto=format&fit=crop&w=800&q=80",
                    Specialities = "Hamile Pilatesi, Pelvik Taban Terapisi, Postür",
                    Instagram = "selinaksoy.fzt",
                    LinkedIn = "selin-aksoy-fzt",
                    Order = 3,
                    IsActive = true
                }
            };

            context.TeamMembers.AddRange(team);
            await context.SaveChangesAsync();
        }

        // 6. Seed Categories & Blog Posts
        if (!await context.Categories.AnyAsync())
        {
            var cat1 = new Category { Name = "Omurga Sağlığı", Slug = "omurga-sagligi", Description = "Bel, boyun ve sırt sağlığına dair uzman fizyoterapi önerileri." };
            var cat2 = new Category { Name = "Klinik Pilates", Slug = "klinik-pilates", Description = "Reformer ve medikal pilates uygulamaları hakkında merak edilenler." };
            var cat3 = new Category { Name = "Yaşam & Postür", Slug = "yasam-postur", Description = "Günlük yaşam ergonomisi ve sağlıklı hareket alışkanlıkları." };

            context.Categories.AddRange(cat1, cat2, cat3);
            await context.SaveChangesAsync();

            var blogPosts = new List<BlogPost>
            {
                new()
                {
                    Title = "Masa Başı Çalışanlar İçin Boyun ve Sırt Ağrılarını Önleme Rehberi",
                    Slug = "masa-basi-calisanlar-icin-boyun-ve-sirt-agrilari",
                    Summary = "Uzun saatler bilgisayar karşısında çalışırken omurganızı koruyacak ergonomik ipuçları ve basit hareketler.",
                    Content = @"<p>Günümüzde ofis çalışanlarının en sık karşılaştığı şikayetlerin başında kronik boyun tutulmaları, sırt kaslarında gerginlik ve omuz düşüklüğü gelir. Başın öne doğru her 2.5 santimetrelik eğimi, boyun omurlarına binen yükü yaklaşık iki katına çıkarır.</p>
<h3>1. Ekran Seviyenizi Düzenleyin</h3>
<p>Monitörünüzün üst kenarı göz hizanızda olmalıdır. Aşağıya bakmak zorunda kalmak servikal omurgadaki doğal kavisi düzleştirir.</p>
<h3>2. Her 45 Dakikada Bir Pozisyon Değiştirin</h3>
<p>İdeal bir oturuş şekli yoktur; ideal olan, uzun süre aynı pozisyonda kalmamaktır. Kısa bir su molası veya hafif göğüs açma egzersizi kas spazmını engeller.</p>
<h3>3. Derin Kor Kaslarını Güçlendirin</h3>
<p>Klinik reformer pilates ile omurgayı dik tutan derin erektör kaslar ve karın kasları aktive edilir. Böylece gün boyu yorulmadan doğru postürü korumak mümkün hale gelir.</p>",
                    CoverImageUrl = "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=1200&q=80",
                    CategoryId = cat1.Id,
                    Author = "Uzm. Fzt. Elif Deniz",
                    ReadTimeMinutes = 4,
                    MetaTitle = "Masa Başı Çalışanlar İçin Omurga Sağlığı | FizyoBlu",
                    MetaDescription = "Masa başında çalışırken boyun ve sırt ağrılarından korunmanın pratik ve bilimsel yolları.",
                    IsPublished = true,
                    IsFeatured = true,
                    PublishedAt = DateTime.UtcNow.AddDays(-10)
                },
                new()
                {
                    Title = "Klinik Pilates ile Normal Pilates Arasındaki 5 Temel Fark",
                    Slug = "klinik-pilates-ile-normal-pilates-arasindaki-farklar",
                    Summary = "Klinik pilatesin neden bireysel bir sağlık süreci olduğunu ve farklarını mercek altına alıyoruz.",
                    Content = @"<p>Pilates hem fitness dünyasında hem de tıp literatüründe kendine sağlam bir yer edinmiş durumdadır. Ancak 'Klinik Pilates' (Clinical Pilates) ile spor salonlarında yapılan grup pilates seansları arasında belirgin farklar mevcuttur.</p>
<h3>1. Seansı Bir Fizyoterapist Yönetir</h3>
<p>Klinik pilateste eğitmeniniz tıp kökenli lisanslı bir fizyoterapisttir. Bu sayede var olan omurga problemleriniz veya eski sakatlıklarınız göz önünde bulundurulur.</p>
<h3>2. Birebir Değerlendirme ile Başlar</h3>
<p>Her seans öncesinde postürünüz, kas kısalıklarınız ve ağrı eşiğiniz analiz edilir; rastgele bir koreografi yerine kişiye özel hareket seçimi yapılır.</p>
<h3>3. Güvenli Direnç ve Modifikasyon</h3>
<p>Reformer yay dirençleri kas hipertrofisi için değil, eklemi koruyup doğru kas grubunu izole etmek amacıyla hassas biçimde ayarlanır.</p>",
                    CoverImageUrl = "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1200&q=80",
                    CategoryId = cat2.Id,
                    Author = "Fzt. Kerem Yılmaz",
                    ReadTimeMinutes = 5,
                    MetaTitle = "Klinik Pilates ile Normal Pilates Arasındaki Farklar | FizyoBlu",
                    MetaDescription = "Klinik pilates nedir, standart pilatesten nasıl ayrılır? Fizyoterapist bakış açısıyla öğrenin.",
                    IsPublished = true,
                    IsFeatured = true,
                    PublishedAt = DateTime.UtcNow.AddDays(-5)
                },
                new()
                {
                    Title = "Doğru Nefes Almanın Postür ve Omurga Sağlığı Üzerindeki Etkisi",
                    Slug = "dogru-nefes-almanin-postur-uzerindeki-etkisi",
                    Summary = "Diyafram nefesinin göğüs kafesi mobilitesi ve karın içi basıncı regüle ederek omurgayı nasıl desteklediğini keşfedin.",
                    Content = @"<p>Çoğumuz gün içinde sığ ve yalnızca göğüs kafesinin üst kısmını kullanan nefesler alırız. Bu durum boyun kaslarının (skalen ve trapez) aşırı gerilmesine ve boyun ağrılarına yol açar.</p>
<p>Diyafram kasının etkin kullanımı, leğen tabanı ve transversus abdominis kaslarıyla birlikte karın içi basıncı dengeleyerek bel omurlarını korur. Pilates seanslarında nefese verilen önemin temel sebebi bu biyomekanik bağlantıdır.</p>",
                    CoverImageUrl = "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1200&q=80",
                    CategoryId = cat3.Id,
                    Author = "Fzt. Selin Aksoy",
                    ReadTimeMinutes = 3,
                    MetaTitle = "Doğru Nefes ve Omurga Sağlığı İlişkisi | FizyoBlu",
                    MetaDescription = "Diyafram solunumunun postür düzeltmedeki kritik rolü ve dikkat edilmesi gerekenler.",
                    IsPublished = true,
                    IsFeatured = false,
                    PublishedAt = DateTime.UtcNow.AddDays(-2)
                }
            };

            context.BlogPosts.AddRange(blogPosts);
            await context.SaveChangesAsync();
        }

        // 7. Seed Gallery Media
        if (!await context.Media.AnyAsync())
        {
            var galleryItems = new List<MediaItem>
            {
                new()
                {
                    FileName = "reformer-studio-1.jpg",
                    Url = "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1200&q=80",
                    Title = "Aydınlık ve Ferah Reformer Stüdyosu",
                    Category = "Stüdyo",
                    ContentType = "image/jpeg",
                    Order = 1,
                    ShowInGallery = true
                },
                new()
                {
                    FileName = "cadillac-session.jpg",
                    Url = "https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?auto=format&fit=crop&w=1200&q=80",
                    Title = "Cadillac & Trapeze Uygulaması",
                    Category = "Reformer",
                    ContentType = "image/jpeg",
                    Order = 2,
                    ShowInGallery = true
                },
                new()
                {
                    FileName = "spine-stretching.jpg",
                    Url = "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1200&q=80",
                    Title = "Omurga Mobilizasyonu ve Esneme",
                    Category = "Egzersiz",
                    ContentType = "image/jpeg",
                    Order = 3,
                    ShowInGallery = true
                },
                new()
                {
                    FileName = "posture-exercise.jpg",
                    Url = "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=1200&q=80",
                    Title = "Denge ve Kor Güçlendirme",
                    Category = "Egzersiz",
                    ContentType = "image/jpeg",
                    Order = 4,
                    ShowInGallery = true
                },
                new()
                {
                    FileName = "studio-detail.jpg",
                    Url = "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&w=1200&q=80",
                    Title = "Doğal Işık Alan Antrenman Alanı",
                    Category = "Stüdyo",
                    ContentType = "image/jpeg",
                    Order = 5,
                    ShowInGallery = true
                },
                new()
                {
                    FileName = "clinical-consultation.jpg",
                    Url = "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80",
                    Title = "Klinik Değerlendirme & Manuel Terapi Odası",
                    Category = "Stüdyo",
                    ContentType = "image/jpeg",
                    Order = 6,
                    ShowInGallery = true
                }
            };

            context.Media.AddRange(galleryItems);
            await context.SaveChangesAsync();
        }
    }
}
