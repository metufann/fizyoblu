using FizyoBlu.Backend.Entities;
using Microsoft.EntityFrameworkCore;

namespace FizyoBlu.Backend.Data;

public static class DbInitializer
{
    public static async Task SeedAsync(AppDbContext context, IConfiguration config)
    {
        // 1. Seed Admin User (Idempotent)
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

        // 2. Seed / Update Site Settings (Idempotent: preserves existing keys, adds missing)
        var defaultSettings = new List<SiteSetting>
        {
            // General & Branding
            new() { Key = "site_name", Value = "FizyoBlu", Group = "General" },
            new() { Key = "site_tagline", Value = "Sağlıklı Yaşam Merkezi • By Fizyoterapist", Group = "General" },
            new() { Key = "site_slogan", Value = "Dün olduğundan daha iyi ol", Group = "General" },
            new() { Key = "site_founder", Value = "Fzt. Selçuk Atakan Şener", Group = "General" },
            new() { Key = "site_founded_year", Value = "2018", Group = "General" },
            new() { Key = "site_founded_location", Value = "Çukurambar, Ankara", Group = "General" },
            new() { Key = "founder_quote", Value = "10 derste farkı hissedecek, 20 derste farkı görecek ve 30 derste farklı bir bedene sahip olacaksınız. — Joseph Pilates", Group = "General" },
            new() { Key = "site_description", Value = "FizyoBlu Sağlıklı Yaşam Merkezi, 2018 yılında Ankara Çukurambar'da Fzt. Selçuk Atakan Şener tarafından 'Dün olduğundan daha iyi ol' vizyonuyla kurulmuştur. Kişiye özel klinik pilates, reformer, hamile pilatesi ve manuel terapi sunmaktadır.", Group = "General" },
            new() { Key = "logo_text", Value = "FIZYOBLU", Group = "General" },
            new() { Key = "site_logo", Value = "/logo/fizyoblu-logo-complete.svg", Group = "General" },
            new() { Key = "site_logo_dark", Value = "/logo/fizyoblu-logo-complete.svg", Group = "General" },

            // Contact
            new() { Key = "contact_phone", Value = "+90 (312) 284 89 20", Group = "Contact" },
            new() { Key = "contact_whatsapp", Value = "+90 (532) 123 45 67", Group = "Contact" },
            new() { Key = "contact_email", Value = "bilgi@fizyoblu.com", Group = "Contact" },
            new() { Key = "contact_address", Value = "Çukurambar Mah. 1424. Cad. No: 12, Çankaya, Ankara", Group = "Contact" },
            new() { Key = "working_hours_weekday", Value = "Pazartesi - Cuma: 08:30 - 20:30", Group = "Contact" },
            new() { Key = "working_hours_weekend", Value = "Cumartesi: 09:00 - 18:00 | Pazar: Dinlenme", Group = "Contact" },

            // Social
            new() { Key = "social_instagram", Value = "https://instagram.com/fizyoblucukurambar", Group = "Social" },
            new() { Key = "social_facebook", Value = "https://facebook.com/fizyoblu", Group = "Social" },
            new() { Key = "social_youtube", Value = "https://youtube.com/@fizyoblu", Group = "Social" },

            // Hero & Home Narrative
            new() { Key = "hero_eyebrow", Value = "BİLİMSEL YAKLAŞIM & FİZYOTERAPİST GÖZETİMİ", Group = "Hero" },
            new() { Key = "hero_title", Value = "Dün Olduğundan Daha İyi Bir Bedene Adım Atın", Group = "Hero" },
            new() { Key = "hero_subtitle", Value = "Fizyoterapist Selçuk Atakan Şener öncülüğünde, kişiye özel klinik postür analizi ve medikal reformer pilates yaklaşımları.", Group = "Hero" },
            new() { Key = "hero_image", Value = "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1800&q=80", Group = "Hero" },
            new() { Key = "about_preview_title", Value = "Dün Olduğundan Daha İyi Ol", Group = "Hero" },
            new() { Key = "about_preview_text", Value = "FizyoBlu Sağlıklı Yaşam Merkezi, Fizyoterapist Selçuk Atakan Şener tarafından 'Dün olduğundan daha iyi ol' sloganıyla 2018 yılında Çukurambar, Ankara’da kurulmuştur. Deneyimli ve konusunda uzman fizyoterapistlerimiz; öncelikle kişisel postür analizi ile bireylerin yaşam koşullarını ve rahatsızlıklarını göz önüne alarak vücut yapılarına en uygun programı belirlemektedirler. Belirlenen bu program ile kişiler, hedeflerine daha kısa sürede ve bilinçli bir şekilde ulaşmaktadır.", Group = "Hero" },

            // SEO
            new() { Key = "meta_title", Value = "FizyoBlu | Sağlıklı Yaşam Merkezi - Çukurambar Ankara", Group = "SEO" },
            new() { Key = "meta_description", Value = "Ankara Çukurambar'da uzman fizyoterapist eşliğinde klinik pilates, reformer, hamile pilatesi, manuel terapi ve postür analizi." }
        };

        foreach (var s in defaultSettings)
        {
            var existing = await context.SiteSettings.FindAsync(s.Key);
            if (existing == null)
            {
                context.SiteSettings.Add(s);
            }
        }
        await context.SaveChangesAsync();

        // 3. Seed Branches (Idempotent: Ensure Çukurambar Headquarters exists)
        if (!await context.Branches.AnyAsync(b => b.Name.Contains("Çukurambar")))
        {
            context.Branches.Add(new Branch
            {
                Name = "Çukurambar Merkez Şubesi",
                District = "Çukurambar / Çankaya",
                City = "Ankara",
                Address = "Çukurambar Mah. 1424. Cad. No: 12, Çankaya, Ankara",
                Phone = "+90 (312) 284 89 20",
                WhatsApp = "+90 (532) 123 45 67",
                Email = "cukurambar@fizyoblu.com",
                WorkingHours = "Hafta İçi: 08:30 - 20:30 | Cts: 09:00 - 18:00",
                GoogleMapsUrl = "https://maps.google.com/?q=Cukurambar+Cankaya+Ankara",
                EmbedMapUrl = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d12242.0!2d32.812!3d39.904!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14d34f0e5b7c7b8d%3A0x6b80145cbe24c4d!2s%C3%87ukurambar%2C%20%C3%87ankaya%2FAnkara!5e0!3m2!1str!2str!4v1",
                ImageUrl = "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&w=1200&q=80",
                Order = 1,
                IsActive = true
            });
            await context.SaveChangesAsync();
        }

        // 4. Seed Founder & Team Members (Idempotent: Ensure Fzt. Selçuk Atakan Şener exists)
        if (!await context.TeamMembers.AnyAsync(t => t.FullName.Contains("Selçuk Atakan Şener")))
        {
            context.TeamMembers.Add(new TeamMember
            {
                FullName = "Fzt. Selçuk Atakan Şener",
                Title = "Kurucu & Fizyoterapist",
                Bio = "FizyoBlu Sağlıklı Yaşam Merkezi'nin kurucusudur. 2018 yılında Ankara Çukurambar'da 'Dün olduğundan daha iyi ol' felsefesiyle yola çıkan Şener, klinik pilates, reformer pilates, kişisel postür analizi, manuel terapi ve nörolojik rehabilitasyon alanlarında danışanlarına kanıta dayalı fizyoterapi yaklaşımlarıyla rehberlik etmektedir.",
                ImageUrl = "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=800&q=80",
                Specialities = "Klinik Pilates, Postür Analizi, Manuel Terapi, Nörolojik Rehabilitasyon, Sporcu Sağlığı",
                Instagram = "fizyoblucukurambar",
                LinkedIn = null,
                Order = 1,
                IsActive = true
            });
            await context.SaveChangesAsync();
        }

        // 5. Seed Services from Hizmetlerimiz.docx (Idempotent: Checks by Slug)
        var realServices = new List<ServiceItem>
        {
            new()
            {
                Title = "Klinik Pilates",
                Slug = "klinik-pilates",
                Summary = "Kişilerin rahatsızlıkları göz önüne alınarak belirlenen, alanında uzman fizyoterapistler gözetiminde uygulanan hedefe yönelik medikal egzersizler.",
                Description = @"Klinik pilates, kişilerin rahatsızlıkları göz önüne alınarak belirlenmiş özel egzersizleri içerir. Amacı, yaşam kalitesini arttırmak için ağrı, sızı ve hareket kısıtlarını azaltmaktır. Sakatlıkların ve incinmelerin önlenmesi için sadece alanında uzman fizyoterapistler gözetiminde uygulanması gerekir.

Aşağıdaki durumlarda ve kas-iskelet problemlerinde başarılı bir şekilde uygulanmaktadır:
- Ankilozan Spondilit, Romatoid Artrit ve Fibromiyalji gibi romatizmal rahatsızlıkların ilerlemesinin yavaşlatılmasında ve ağrıların hafifletilmesinde,
- Skolyoz ve kifoz gibi omurga eğriliklerinin dengelenmesinde,
- Bel ve boyun fıtığı, kanal daralması ve omurga düzleşmesi gibi disk dejenerasyonlarının desteklenmesinde ve ağrıların azaltılmasında,
- Masa başında çalışanlarda zamanla gelişen duruş bozukluklarının giderilmesinde,
- Taban düşüklüğü, zayıf ayak bileği, şişlik ve burkulma durumlarında diz, el ve ayak bileği ağrılarının hafifletilmesinde,
- Kalça problemlerinin çözülmesinde,
- Osteoporozda kemik yoğunluğunun korunmasında,
- Osteoartrit (kireçlenme) problemlerinde,
- Uzun yıllar hareketsiz kalmış kişilerin kas-iskelet sistemlerinin güçlendirilmesinde.",
                ImageUrl = "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1200&q=80",
                Order = 1,
                IsActive = true,
                IsFeatured = true,
                MetaDescription = "Klinik pilates, alanında uzman fizyoterapistler gözetiminde omurga ve kas-iskelet rahatsızlıklarına özel uygulanan medikal egzersizlerdir."
            },
            new()
            {
                Title = "Reformer Pilates",
                Slug = "reformer-pilates",
                Summary = "Özel tasarlanmış reformer aleti ve kontrollü direnç yayları yardımıyla tüm vücudu eşit çalıştıran dinamik egzersiz.",
                Description = @"Reformer pilates, özel tasarlanmış bir alet yardımıyla vücudunuzun belirli ağırlıklarda dirençlere maruz bırakılarak çalışmasını sağlayan bir egzersiz şeklidir.

Temel Faydaları:
- Kasların geliştirilmesi ile vücudun istenilen forma hızlıca ulaşmasını sağlar.
- Tüm vücudu eşit şekilde çalıştırarak asimetrileri dengeler.
- Eklem bölgelerini güçlendirip kasları sıkıştırarak kan dolaşımının hızlanması ile daha düzenli nefes alınmasını sağlar.
- Vücuda esneklik, denge ve dinçlik kazandırır.
- Beden farkındalığını ve konsantrasyonu artırarak stresin azaltılmasına katkı sunar.
- Sporcuların performans grafiğini yükseltmek için kullanılır.
- Tüm kasların eşit ve dengeli çalışmasını sağlayarak hücre sağlığını destekler.",
                ImageUrl = "https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?auto=format&fit=crop&w=1200&q=80",
                Order = 2,
                IsActive = true,
                IsFeatured = true,
                MetaDescription = "Reformer pilates, yay direnci mekanizmasıyla vücudu simetrik çalıştırarak kas kuvveti ve esneklik kazandırır."
            },
            new()
            {
                Title = "Hamile Pilatesi",
                Slug = "hamile-pilatesi",
                Summary = "Gebelikte dolaşım ve sindirimi düzenleyen, dayanıklılığı artıran ve güvenli doğum sürecini destekleyen seanslar.",
                Description = @"Hamile pilatesi, anne adaylarının gebelik sürecini daha konforlu ve sağlıklı geçirmeleri için fizyoterapistler tarafından kişiye özel planlanan egzersizlerdir.

Önemli Faydaları:
- Dolaşım ve sindirim işlevlerini düzenler.
- Gebelik süresince anne sağlığını koruyarak dayanıklılık ve gücün artırılmasını sağlar.
- Annenin kilo kontrolünü destekler, gebelik diyabeti olasılığını düşürür.
- Düzenli nefes egzersizleri ile doğum sırasında oluşabilecek gerilim ve kaygıyı azaltır.
- Normal doğum sürecini destekler ve pelvik taban kaslarını güçlendirir.
- Doğum sonrası en kısa sürede hamilelik öncesi forma dönüşü kolaylaştırır.",
                ImageUrl = "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=1200&q=80",
                Order = 3,
                IsActive = true,
                IsFeatured = true,
                MetaDescription = "Hamile pilatesi gebelik süresince anne sağlığını korur, pelvik tabanı güçlendirir ve doğuma hazırlar."
            },
            new()
            {
                Title = "Manuel Terapi",
                Slug = "manuel-terapi",
                Summary = "Kas, bağ ve eklem bölümlerindeki hareket kısıtlarının mobilizasyon ve manipülasyon teknikleriyle, yalnızca eller kullanılarak giderilmesi.",
                Description = @"Manuel Terapi, vücudumuzda hareket sistemi elemanlarından kas, bağ ve eklem bölümlerinin etkilenmesiyle ortaya çıkan ağrı ve hareket kısıtlarının mobilizasyon ve manipülasyon teknikleri ile giderilmesini sağlayan ve yalnızca eller kullanılarak yapılan bir yöntemdir.

Danışanın detaylı postüral analizinden sonra kişiye özel olarak alanında eğitim almış uzman fizyoterapistler tarafından bilimselliği kanıtlanmış teknikler ile uygulanır.

Özellikleri:
- Problemli bölgeye doğrudan yapıldığı için klasik uygulamalara göre daha kısa sürede yanıt verir.
- Vücudun kendi mekanizmaları kullanılarak yalnızca el uygulamaları ile gerçekleştirildiği için doğaldır.

Uygulandığı Alanlar ve Rahatsızlıklar:
- Bel fıtığı, bel kayması ve faset eklem blokajları gibi bel rahatsızlıklarında,
- Boyun fıtığı, boyun düzleşmesi ve buna bağlı baş ağrılarının giderilmesinde,
- Donuk omuz ve impingement (sıkışma) sendromu gibi omuz rahatsızlıklarında,
- Karpal tünel sendromu, tarsal tünel sendromu, morton sendromu ve topuk dikeni gibi el ve ayak bileği problemlerinde,
- Kalça çıkığı, piriformis sendromu gibi kalça rahatsızlıklarında ve kalça protezi sonrası rehabilitasyonda,
- Tenisçi dirseği, golfçü dirseği, menisküs yırtılmaları, çapraz bağ yırtıkları gibi diz ve dirsek rahatsızlıklarında ve diz protezi sonrası rehabilitasyonda başarıyla uygulanmaktadır.",
                ImageUrl = "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80",
                Order = 4,
                IsActive = true,
                IsFeatured = true,
                ComplianceNotes = "Mevzuat İnceleme Notu: Metin içerisindeki 'başarı oranı çok yüksek' ve 'tedavi sağlandığı için' gibi sağlık mevzuatı ve reklam denetimi açısından değerlendirilmesi gereken ifadeler mevzuat ve hekim kontrolü gerektirmektedir.",
                MetaDescription = "Manuel terapi, eklem ve kas kısıtlılıklarında alanında uzman fizyoterapistler tarafından yalnızca eller kullanılarak uygulanan bilimsel yöntemdir."
            },
            new()
            {
                Title = "Postür Analizi",
                Slug = "postur-analizi",
                Summary = "Vücut diziliş ve duruşunun optimum olup olmadığının kontrolü ve mevcut postüral deviasyonlara uygun düzeltici program belirlenmesi.",
                Description = @"Postür (duruş) analizi, vücudun diziliş ve düzeninin optimum olup olmadığının kontrolü ile kişinin minimum çaba ile maksimum yeterliliği sağlayan duruşa sahip olmasını amaçlar.

Vücudumuzun duruşu; duygusal durum, vücut tipi, günlük alışkanlıklar, kalıtım ve kas dengesi gibi birçok faktör tarafından belirlenir. Anormal postürün korunması için vücut gereğinden fazla gerildiğinden zamanla spazmlar ve kronik ağrılar ortaya çıkar.

Postür analizinin temel amacı, danışanda mevcut postüral deviasyonların saptanarak buna uygun kişisel egzersiz ve düzeltme programlarının planlanabilmesidir.

FizyoBlu Sağlıklı Yaşam Merkezi'nde uzman fizyoterapistlerimiz tarafından detaylı postür analizi gerçekleştirilmektedir.",
                ImageUrl = "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=1200&q=80",
                Order = 5,
                IsActive = true,
                IsFeatured = true,
                MetaDescription = "Postür analizi ile omurga dizilimi ve duruş deviasyonları tespit edilerek kişiye en uygun hareket programı belirlenir."
            },
            new()
            {
                Title = "Kinezyolojik Bantlama",
                Slug = "kinezyolojik-bantlama",
                Summary = "Kas ve iskelet sistemine destek sağlayarak ağrının hafifletilmesi ve yaralanmaların önlenmesi amacıyla uygulanan terapi tekniği.",
                Description = @"Yaklaşık 50 yıl önce Japonya’da geliştirilen Kinezyolojik bantlama tekniği, kas ve iskelet sistemine destek olarak ağrının hafifletilmesi ve spor yaralanmaları gibi sorunların önüne geçilmesini hedefler.

Fizyoterapistler tarafından kullanılan bu terapi tekniği geniş bir kullanım alanına sahiptir:
- Yumuşak doku ağrıları
- Miyofasyal ağrı sendromu
- Bölgesel kas spazmları
- Kas iskelet sisteminde yumuşak doku travmaları
- Spor yaralanmaları
- Eklem burkulma ve zorlanmaları
- Postür bozuklukları
- Eklem instabiliteleri
- Skolyoz desteği
- Bazı ortopedik cerrahi girişimler sonrası rehabilitasyon (artroplasti, bağ tamirleri vb.)",
                ImageUrl = "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1200&q=80",
                Order = 6,
                IsActive = true,
                IsFeatured = false,
                MetaDescription = "Kinezyolojik bantlama, kas ve eklem stabilitesini destekleyerek ağrıyı hafifleten fizyoterapi tekniğidir."
            },
            new()
            {
                Title = "Sporcu Sağlığı",
                Slug = "sporcu-sagligi",
                Summary = "Amatör ve profesyonel sporcularda aşırı zorlanma ve antrenman yaralanmalarına karşı kişiselleştirilmiş koruyucu ve rehabilite edici protokoller.",
                Description = @"Doğru yapılan spor, insan bedenine ve ruhuna sağlıklı bir yaşam sürmek için pozitif katkı yapar. Gerek profesyonel gerekse amatör sporcularda aşırı zorlamalar, ısınma egzersizleri yapılmadan başlanan antrenmanlar veya spordan sonra soğuma yapılmaması gibi durumlarda vücut sağlığını tehdit eden yaralanmalar ortaya çıkabilir.

Karşılaşılan Problemler:
- Futbol: Menisküs lezyonları, çapraz bağ yaralanmaları, kas yırtıkları (rüptür), yumuşak doku zedelenmesi, tendon kopmaları, kas krampları, ayak bileği burkulmaları, bel ve sırt incinmeleri.
- Basketbol: Bağ lezyonları, menisküs problemleri, omuz çıkıkları, hematom, lif kopmaları ve kramplar.
- Koşu: Kas ve tendon zorlanmaları, eklem ve bağ yaralanmaları, menisküs problemleri.

FizyoBlu'da bu problemlerin çözümü ve önlenmesi için yapılan spor dalı ve sporcunun biyomekanik özellikleri göz önünde bulundurularak kişiye özel program hazırlanır.",
                ImageUrl = "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1200&q=80",
                Order = 7,
                IsActive = true,
                IsFeatured = false,
                MetaDescription = "Sporcu sağlığı kapsamında amatör ve profesyonel sporculara yönelik kişisel fizyoterapi ve koruyucu egzersiz planları sunulur."
            },
            new()
            {
                Title = "Nörolojik Rehabilitasyon",
                Slug = "norolojik-rehabilitasyon",
                Summary = "MS (Multipl Skleroz), Parkinson ve diğer nörolojik hastalıklara yönelik uzman fizyoterapistler eşliğinde rehabilitasyon hizmeti.",
                Description = @"FizyoBlu Sağlıklı Yaşam Merkezi bünyesinde; MS (Multipl Skleroz), Parkinson ve diğer nörolojik hastalıkların rehabilitasyonu hizmetleri uzman fizyoterapistlerimiz eşliğinde verilmektedir.

Kişiye özel değerlendirme ve seans planlaması hakkında ayrıntılı bilgi almak için lütfen merkezimizle iletişime geçiniz.",
                ImageUrl = "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&w=1200&q=80",
                Order = 8,
                IsActive = true,
                IsFeatured = false,
                MetaDescription = "MS, Parkinson ve diğer nörolojik hastalıkların rehabilitasyonu hizmeti FizyoBlu Sağlıklı Yaşam Merkezi'nde uzman kadro ile sunulmaktadır."
            }
        };

        foreach (var svc in realServices)
        {
            var existingSvc = await context.Services.FirstOrDefaultAsync(s => s.Slug == svc.Slug);
            if (existingSvc == null)
            {
                context.Services.Add(svc);
            }
            else
            {
                // Update with real content if it previously had empty or placeholder text
                existingSvc.Title = svc.Title;
                existingSvc.Summary = svc.Summary;
                existingSvc.Description = svc.Description;
                existingSvc.Order = svc.Order;
                existingSvc.IsActive = svc.IsActive;
                existingSvc.IsFeatured = svc.IsFeatured;
                existingSvc.ComplianceNotes = svc.ComplianceNotes;
                existingSvc.MetaDescription = svc.MetaDescription;
            }
        }
        await context.SaveChangesAsync();

        // 6. Seed Categories (Idempotent: Checks by Slug)
        var categories = new List<Category>
        {
            new() { Name = "Kadın Sağlığı & Pilates", Slug = "kadin-sagligi", Description = "Hamilelik, doğum öncesi ve sonrası medikal pilates yaklaşımları." },
            new() { Name = "Klinik Pilates", Slug = "klinik-pilates", Description = "Omurga sağlığı, fıtık, postür ve medikal egzersiz bilgileri." },
            new() { Name = "Manuel Terapi & Fizyoterapi", Slug = "manuel-terapi", Description = "Kas-iskelet sistemi, eklem mobilizasyonu ve manuel yöntemler." }
        };

        foreach (var cat in categories)
        {
            if (!await context.Categories.AnyAsync(c => c.Slug == cat.Slug))
            {
                context.Categories.Add(cat);
            }
        }
        await context.SaveChangesAsync();

        var kadinSagligiCat = await context.Categories.FirstOrDefaultAsync(c => c.Slug == "kadin-sagligi");
        var klinikCat = await context.Categories.FirstOrDefaultAsync(c => c.Slug == "klinik-pilates");
        var manuelCat = await context.Categories.FirstOrDefaultAsync(c => c.Slug == "manuel-terapi");

        // 7. Seed Blog Posts from Word Docs (Idempotent: Checks by Slug)
        // 7.1. Hamile Pilatesi (from BLOG-hamile pilatesi.docx) -> Published
        var hamilePost = await context.BlogPosts.FirstOrDefaultAsync(b => b.Slug == "hamile-pilatesi");
        if (hamilePost == null)
        {
            context.BlogPosts.Add(new BlogPost
            {
                Title = "Hamile Pilatesi: Gebelik Sürecinde Güvenli Hareket ve Faydaları",
                Slug = "hamile-pilatesi",
                Summary = "Gebelikte hormon ve ağırlık değişimlerinin pelvik taban ve omurgaya etkileri, pilatese başlama zamanı ve doğuma hazırlayıcı faydaları.",
                Content = @"<p>Gebelik; kadının fiziksel, hormonal ve psikolojik açıdan birçok değişiklik yaşadığı uzun ve özel bir süreçtir. Gebelikte salgılanan hormonlar ve büyüyen bebeğin ağırlığı, annenin kas ve iskelet sisteminde belirgin değişiklikler yaratır.</p>
<p>Bu süreçte annede bel ve sırt ağrıları görülebilir, bağ dokusu gevşer, eklemler zorlanmaya daha açık hale gelir. Özellikle el ve ayak bileklerinde oluşan ödem, karpal tünel ve tarsal tünel sendromuna yol açabilir. Hamilelik boyunca bebeğin ağırlığının rahme yaptığı baskı ve yerçekiminin etkisiyle pelvik taban yaklaşık 2.5 cm kadar aşağıya çöker. Pelvik taban kaslarındaki bu durum, idrar kaçırma gibi yaşam kalitesini düşüren sıkıntılara yol açabilir. Güçlü pelvik taban kasları doğum sırasında ve sonrasında anne adayları için hayati önem taşır. Hamile pilatesi bu kasları kuvvetlendirmek için en güvenli egzersizleri sunar.</p>
<h3>Hamilelikte Pilatese Ne Zaman Başlanmalıdır?</h3>
<p>Hamilelikte pilatese, kadın doğum uzmanı izin verdiği sürece ve gebelik süreci onaylandığı andan itibaren başlanabilir. Ortalama olarak haftada 2 veya 3 defa doğuma kadar güvenle devam edilebilir. Gebelik süreci eşit zaman aralıklı üç trimester olarak ele alınır ve her döneme göre hedefler, pozisyonlar ve yardımcı materyaller belirlenir.</p>
<p>Program gebenin kişisel sağlık durumu gözetilerek fizyoterapist eşliğinde hazırlanır. Yoğunluk doğuma yakın dönemde kontrollü biçimde ayarlanır; solunum ve gevşeme pozisyonlarına ağırlık verilir. Anne adayının doğuma hazırlanması desteklenir.</p>
<h3>Pilatesin Gebelik ve Doğum Konusundaki Faydaları</h3>
<ul>
<li><strong>Fiziksel ve Ruhsal Rahatlama:</strong> Egzersiz sırasında salgılanan endorfin hormonu sayesinde anne adayı hem bedensel hem de psikolojik olarak daha dinç ve rahat hisseder.</li>
<li><strong>Bel ve Sırt Ağrılarının Azalması:</strong> Omurga çevresindeki destekleyici kasları güçlendirerek en sık görülen sırt ve bel ağrılarını hafifletir.</li>
<li><strong>Pelvik Taban ve Karın Desteği:</strong> Karın ve pelvik taban kaslarını kuvvetlendirir; denge ve konsantrasyonu artırarak normal doğum sürecine katkı sağlar.</li>
<li><strong>Doğru Soluma ve Gevşeme:</strong> Düzenli nefes çalışmaları ile doğum anında gerekli gevşemeleri ve kontrollü solumayı kolaylaştırır.</li>
<li><strong>Doğum Sonrası Hızlı Toparlanma:</strong> Doğumun ardından vücudun ve karın bölgesinin hamilelik öncesi formuna dönmesini hızlandırır.</li>
<li><strong>Ödem Kontrolü:</strong> Kol ve bacaklardaki dolaşımı destekleyerek ödem ve şişlik şikayetlerini minimuma indirir.</li>
<li><strong>Zihin-Beden Farkındalığı:</strong> Bireysel farkındalığı artırarak gebelik sürecindeki stresi hafifletir.</li>
</ul>",
                CoverImageUrl = "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=1200&q=80",
                CategoryId = kadinSagligiCat?.Id,
                Author = "Fzt. Selçuk Atakan Şener",
                ReadTimeMinutes = 5,
                MetaTitle = "Hamile Pilatesi Nedir? Ne Zaman Başlanmalı? | FizyoBlu",
                MetaDescription = "Gebelikte pelvik tabanı güçlendiren, bel ağrılarını azaltan ve doğumu kolaylaştıran hamile pilatesi hakkında fizyoterapist rehberi.",
                IsPublished = true,
                IsFeatured = true,
                ComplianceNotes = null,
                PublishedAt = DateTime.UtcNow.AddDays(-3)
            });
        }

        // 7.2. Klinik Pilates Nedir? (from BLOG-klinik pilates nedir.docx) -> Draft (Health claims compliance check)
        var klinikPost = await context.BlogPosts.FirstOrDefaultAsync(b => b.Slug == "klinik-pilates-nedir");
        if (klinikPost == null)
        {
            context.BlogPosts.Add(new BlogPost
            {
                Title = "Klinik Pilates Nedir? Kimler İçin Uygundur?",
                Slug = "klinik-pilates-nedir",
                Summary = "Kişinin omurga sağlığını korumak ve kas-iskelet sistemi disfonksiyonlarına karşı uzman fizyoterapist eşliğinde uygulanan kişiye özel egzersizler.",
                Content = @"<p>Klinik pilates, kişinin omurga sağlığını iyileştirmek, kas-iskelet sistemi ile ilgili problemlerden (skolyoz ve kifoz gibi omurga sorunları, kas spazmları, fibromiyalji, bel ve boyun fıtıkları, donuk omuz, omuz eklemi, kas ve tendon yaralanmaları, menisküs, ön çapraz bağ yaralanması gibi diz ve kalça problemleri) korumak ve desteklemek amacıyla uygulanan kişiye özel egzersizler bütünüdür.</p>
<p>Pilates toplumda yalnızca genel sıkılaşma egzersizi olarak bilinse de, alanında uzman bir <strong>fizyoterapist</strong> eşliğinde uygulanan klinik pilates; duruş bozukluklarından eklem ağrılarına, kronik bel, boyun ve sırt ağrılarından solunum sıkıntısına yol açan durumlara kadar birçok tabloda büyük öneme sahip kişiselleştirilmiş bir yaklaşımdır.</p>
<p>Klinik pilates standart fizik tedavi süreçlerinin ardından tamamlayıcı ve koruyucu olarak da değerlendirilmektedir. Herhangi bir belirgin rahatsızlığı olmayan ancak güvenli ve bilinçli bir biçimde egzersize başlamak isteyen sağlıklı bireylere de detaylı postür muayenesi sonrasında klinik pilates uygulanabilmektedir. 30–60 yaş arası uzun süre hareketsiz kalmış bireyler de kas-iskelet sistemlerini geliştirmek amacıyla programa alınmaktadır.</p>
<h3>Klinik Pilates Uygulaması Nasıl Yapılır?</h3>
<p>Tüm günü masa başında geçiren ofis çalışanlarında, omurganın yanlış kullanımı nedeniyle gelişen sırt ve bel ağrılarında klinik pilates etkili bir yöntemdir. Ancak uzman olmayan kişilerin yönlendirmesiyle bilinçsiz hareket edilmesi sakatlanmalara yol açabilir. Klinik pilates, reformer adı verilen özel yaylı ekipmanlar veya zemin üzerinde yapılmakta olup, tüm kasların aynı anda ve dengeli çalışması temeline dayanır.</p>
<p>Programda karın, sırt, bel, kalça ve bacak kasları kuvvetlendirilirken özel solunum teknikleri eşliğinde denge çalışmaları uygulanır. En yüksek faydayı elde etmek için seanslara düzenli devam etmek, ergonomiye özen göstermek ve vücut mekaniğini doğru kullanmak gerekir.</p>
<h3>Seans Süresi ve Sıklığı</h3>
<p>Klinik pilates seansları genellikle 60 dakikalık sürelerle planlanır. Programın verimli olabilmesi için haftada iki veya üç gün uygulanması tavsiye edilir. Bireyin sağlık durumuna ve ihtiyaçlarına göre bir uzman fizyoterapist tarafından kişiye özel yapılandırılır.</p>",
                CoverImageUrl = "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1200&q=80",
                CategoryId = klinikCat?.Id,
                Author = "Fzt. Selçuk Atakan Şener",
                ReadTimeMinutes = 4,
                MetaTitle = "Klinik Pilates Nedir? Nasıl Uygulanır? | FizyoBlu",
                MetaDescription = "Klinik pilates nedir, klasik pilatesten farkı nedir, hangi omurga rahatsızlıklarında uygulanır? Fizyoterapist bakış açısı.",
                IsPublished = false, // Sağlık mevzuatı ve tedavi iddiaları incelemesi bekleyen TASLAK
                IsFeatured = false,
                ComplianceNotes = "Mevzuat İnceleme Uyarısı: Belgede yer alan 'korumak ve tedavi etmek amacıyla', 'birçok rahatsızlığın tedavisinde' ve 'obezite hastaları da pilates ile tedavi edilebilmektedir' gibi doğrudan tıbbi tedavi ve garanti içeren ifadeler 1219 sayılı Kanun ve Sağlık Hizmetlerinde Tanıtım ve Bilgilendirme Yönetmeliği uyarınca doğrudan yayınlanamaz. Metin uzman hekim/mevzuat kontrolü tamamlanana kadar taslak statüsünde tutulmalıdır.",
                PublishedAt = DateTime.UtcNow.AddDays(-2)
            });
        }

        // 7.3. Manuel Terapi Nedir? (from BLOG-manuel terapi nedir.docx) -> Draft (Health claims compliance check)
        var manuelPost = await context.BlogPosts.FirstOrDefaultAsync(b => b.Slug == "manuel-terapi-nedir");
        if (manuelPost == null)
        {
            context.BlogPosts.Add(new BlogPost
            {
                Title = "Manuel Terapi Nedir? Amaçları ve Uygulama Esasları",
                Slug = "manuel-terapi-nedir",
                Summary = "Fizyoterapistlerin ellerini kullanarak omurga, kas ve iskelet sistemi üzerinde uyguladığı eklem mobilizasyon ve manipülasyon teknikleri.",
                Content = @"<p>Fizyoterapistlerin ellerini kullanarak omurga, kas ve iskelet sistemi üzerinde belirli manevralar ve hareketler yaparak uyguladığı klinik yaklaşımlara manuel terapi denir.</p>
<h3>Manuel Terapinin Amacı Nedir?</h3>
<p>Manuel terapinin temel amacı; bozulmuş olan eklem dizilimini ve kas disfonksiyonlarını tespit etmek, tespit edilen bu biyomekanik bozuklukları bilimsel el uygulamaları ile normalize etmektir.</p>
<p>Manuel terapi; omurga ve çevre dokulardaki kaslara, tendonlara, bağlara, eklem kapsüllerine ve kemik-kıkırdak yapılarına çeşitli kontrollü kuvvetler uygulayarak omurga ve eklemlerin doğal hareket yeteneğini yeniden kazanması, biyomekanik dengenin kurulması ve buna bağlı ağrıların hafifletilmesi amacıyla gerçekleştirilir.</p>
<h3>Uygulama Aşamaları Nelerdir?</h3>
<p>Seans süreci; danışanın doğru pozisyonlanması, kas gevşemesinin sağlanması, eklem mobilizasyonu ve gerekli durumlarda manipülasyon işlemlerinin ardından tamamlanır.</p>
<h3>Kimler Tarafından Uygulanabilir?</h3>
<p>Manuel terapi, yalnızca bu alanda özel akademik ve klinik eğitim almış lisanslı fizyoterapistler veya uzman hekimler tarafından uygulanmalıdır.</p>",
                CoverImageUrl = "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80",
                CategoryId = manuelCat?.Id,
                Author = "Fzt. Selçuk Atakan Şener",
                ReadTimeMinutes = 3,
                MetaTitle = "Manuel Terapi Nedir? Kimler Uygulayabilir? | FizyoBlu",
                MetaDescription = "Manuel terapi nedir, hangi amaçlarla uygulanır ve aşamaları nelerdir? Fizyoterapist bakış açısıyla manuel terapi.",
                IsPublished = false, // Sağlık mevzuatı incelemesi bekleyen TASLAK
                IsFeatured = false,
                ComplianceNotes = "Mevzuat İnceleme Uyarısı: 'Tedavi edilmesini sağlayan' ve 'elle tedavi sağlandığı için' gibi kesin tedavi edicilik bildiren sağlık iddiaları mevzuat denetimi ve uzman hekim kontrolü gerektirdiğinden taslak olarak işaretlenmiştir.",
                PublishedAt = DateTime.UtcNow.AddDays(-1)
            });
        }

        await context.SaveChangesAsync();
    }
}
