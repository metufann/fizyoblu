using System.Text;
using FizyoBlu.Backend.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FizyoBlu.Backend.Controllers;

[ApiController]
public class SitemapController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly IConfiguration _config;

    public SitemapController(AppDbContext context, IConfiguration config)
    {
        _context = context;
        _config = config;
    }

    [HttpGet("sitemap.xml")]
    [Produces("application/xml")]
    public async Task<IActionResult> GetSitemap()
    {
        var baseUrl = _config["FrontendUrl"]?.TrimEnd('/') ?? "https://fizyoblu.com";

        var services = await _context.Services
            .Where(s => s.IsActive)
            .Select(s => s.Slug)
            .ToListAsync();

        var posts = await _context.BlogPosts
            .Where(b => b.IsPublished)
            .Select(b => new { b.Slug, b.PublishedAt, b.UpdatedAt })
            .ToListAsync();

        var sb = new StringBuilder();
        sb.AppendLine("<?xml version=\"1.0\" encoding=\"UTF-8\"?>");
        sb.AppendLine("<urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\">");

        // Static routes
        var staticPages = new[]
        {
            "",
            "/hakkimizda",
            "/hizmetler",
            "/subeler",
            "/ekibimiz",
            "/blog",
            "/galeri",
            "/iletisim"
        };

        foreach (var page in staticPages)
        {
            sb.AppendLine("  <url>");
            sb.AppendLine($"    <loc>{baseUrl}{page}</loc>");
            sb.AppendLine($"    <lastmod>{DateTime.UtcNow:yyyy-MM-dd}</lastmod>");
            sb.AppendLine("    <changefreq>weekly</changefreq>");
            sb.AppendLine("    <priority>0.9</priority>");
            sb.AppendLine("  </url>");
        }

        // Service pages
        foreach (var slug in services)
        {
            sb.AppendLine("  <url>");
            sb.AppendLine($"    <loc>{baseUrl}/hizmetler/{slug}</loc>");
            sb.AppendLine($"    <lastmod>{DateTime.UtcNow:yyyy-MM-dd}</lastmod>");
            sb.AppendLine("    <changefreq>monthly</changefreq>");
            sb.AppendLine("    <priority>0.8</priority>");
            sb.AppendLine("  </url>");
        }

        // Blog posts
        foreach (var post in posts)
        {
            var date = (post.UpdatedAt ?? post.PublishedAt).ToString("yyyy-MM-dd");
            sb.AppendLine("  <url>");
            sb.AppendLine($"    <loc>{baseUrl}/blog/{post.Slug}</loc>");
            sb.AppendLine($"    <lastmod>{date}</lastmod>");
            sb.AppendLine("    <changefreq>monthly</changefreq>");
            sb.AppendLine("    <priority>0.7</priority>");
            sb.AppendLine("  </url>");
        }

        sb.AppendLine("</urlset>");

        return Content(sb.ToString(), "application/xml", Encoding.UTF8);
    }

    [HttpGet("robots.txt")]
    [Produces("text/plain")]
    public IActionResult GetRobots()
    {
        var baseUrl = _config["FrontendUrl"]?.TrimEnd('/') ?? "https://fizyoblu.com";

        var sb = new StringBuilder();
        sb.AppendLine("User-agent: *");
        sb.AppendLine("Allow: /");
        sb.AppendLine("Disallow: /admin");
        sb.AppendLine("Disallow: /api/");
        sb.AppendLine();
        sb.AppendLine($"Sitemap: {baseUrl}/sitemap.xml");

        return Content(sb.ToString(), "text/plain", Encoding.UTF8);
    }
}
