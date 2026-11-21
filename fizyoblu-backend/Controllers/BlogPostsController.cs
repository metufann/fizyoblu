using System.Text.RegularExpressions;
using FizyoBlu.Backend.Data;
using FizyoBlu.Backend.DTOs;
using FizyoBlu.Backend.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FizyoBlu.Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BlogPostsController : ControllerBase
{
    private readonly AppDbContext _context;

    public BlogPostsController(AppDbContext context)
    {
        _context = context;
    }

    private static string GenerateSlug(string text)
    {
        var str = text.ToLowerInvariant()
            .Replace("ç", "c")
            .Replace("ğ", "g")
            .Replace("ı", "i")
            .Replace("ö", "o")
            .Replace("ş", "s")
            .Replace("ü", "u");

        str = Regex.Replace(str, @"[^a-z0-9\s-]", "");
        str = Regex.Replace(str, @"\s+", " ").Trim();
        str = Regex.Replace(str, @"\s", "-");
        return str;
    }

    // Public: List published posts
    [HttpGet]
    public async Task<IActionResult> GetAllPublished([FromQuery] string? category = null, [FromQuery] string? q = null)
    {
        var query = _context.BlogPosts
            .Include(b => b.Category)
            .Where(b => b.IsPublished);

        if (!string.IsNullOrWhiteSpace(category))
        {
            query = query.Where(b => b.Category != null && b.Category.Slug == category);
        }

        if (!string.IsNullOrWhiteSpace(q))
        {
            var search = q.Trim().ToLower();
            query = query.Where(b => b.Title.ToLower().Contains(search) || b.Summary.ToLower().Contains(search));
        }

        var posts = await query
            .OrderByDescending(b => b.PublishedAt)
            .Select(b => new BlogPostSummaryDto(
                b.Id, b.Title, b.Slug, b.Summary, b.CoverImageUrl,
                b.CategoryId, b.Category != null ? b.Category.Name : null,
                b.Category != null ? b.Category.Slug : null,
                b.Author, b.ReadTimeMinutes, b.IsPublished, b.IsFeatured,
                b.ComplianceNotes, b.PublishedAt
            ))
            .ToListAsync();

        return Ok(new { success = true, data = posts });
    }

    // Public: Get post by slug
    [HttpGet("{slug}")]
    public async Task<IActionResult> GetBySlug(string slug)
    {
        var post = await _context.BlogPosts
            .Include(b => b.Category)
            .Where(b => b.IsPublished && b.Slug == slug)
            .Select(b => new BlogPostDto(
                b.Id, b.Title, b.Slug, b.Summary, b.Content, b.CoverImageUrl,
                b.CategoryId, b.Category != null ? b.Category.Name : null,
                b.Category != null ? b.Category.Slug : null,
                b.Author, b.ReadTimeMinutes, b.MetaTitle, b.MetaDescription,
                b.IsPublished, b.IsFeatured, b.ComplianceNotes, b.PublishedAt
            ))
            .FirstOrDefaultAsync();

        if (post == null)
        {
            return NotFound(new { success = false, message = "Blog yazısı bulunamadı." });
        }

        return Ok(new { success = true, data = post });
    }

    // Admin: List all posts (including drafts awaiting review)
    [Authorize]
    [HttpGet("admin/all")]
    public async Task<IActionResult> GetAllForAdmin()
    {
        var posts = await _context.BlogPosts
            .Include(b => b.Category)
            .OrderByDescending(b => b.PublishedAt)
            .Select(b => new BlogPostDto(
                b.Id, b.Title, b.Slug, b.Summary, b.Content, b.CoverImageUrl,
                b.CategoryId, b.Category != null ? b.Category.Name : null,
                b.Category != null ? b.Category.Slug : null,
                b.Author, b.ReadTimeMinutes, b.MetaTitle, b.MetaDescription,
                b.IsPublished, b.IsFeatured, b.ComplianceNotes, b.PublishedAt
            ))
            .ToListAsync();

        return Ok(new { success = true, data = posts });
    }

    // Admin: Create blog post
    [Authorize]
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateBlogPostRequest request)
    {
        var slug = string.IsNullOrWhiteSpace(request.Slug) ? GenerateSlug(request.Title) : GenerateSlug(request.Slug);

        var baseSlug = slug;
        var counter = 1;
        while (await _context.BlogPosts.AnyAsync(b => b.Slug == slug))
        {
            slug = $"{baseSlug}-{counter++}";
        }

        var post = new BlogPost
        {
            Title = request.Title.Trim(),
            Slug = slug,
            Summary = request.Summary?.Trim() ?? string.Empty,
            Content = request.Content,
            CoverImageUrl = request.CoverImageUrl.Trim(),
            CategoryId = request.CategoryId,
            Author = string.IsNullOrWhiteSpace(request.Author) ? "FizyoBlu Uzman Ekibi" : request.Author.Trim(),
            ReadTimeMinutes = request.ReadTimeMinutes > 0 ? request.ReadTimeMinutes : 4,
            MetaTitle = request.MetaTitle?.Trim(),
            MetaDescription = request.MetaDescription?.Trim(),
            IsPublished = request.IsPublished,
            IsFeatured = request.IsFeatured,
            ComplianceNotes = request.ComplianceNotes?.Trim(),
            PublishedAt = DateTime.UtcNow
        };

        _context.BlogPosts.Add(post);
        await _context.SaveChangesAsync();

        return Ok(new { success = true, message = "Blog yazısı oluşturuldu.", data = post });
    }

    // Admin: Update blog post
    [Authorize]
    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateBlogPostRequest request)
    {
        var post = await _context.BlogPosts.FindAsync(id);
        if (post == null)
        {
            return NotFound(new { success = false, message = "Blog yazısı bulunamadı." });
        }

        var targetSlug = GenerateSlug(request.Slug);
        if (targetSlug != post.Slug && await _context.BlogPosts.AnyAsync(b => b.Slug == targetSlug && b.Id != id))
        {
            return BadRequest(new { success = false, message = "Bu slug ile başka bir blog yazısı mevcut." });
        }

        post.Title = request.Title.Trim();
        post.Slug = targetSlug;
        post.Summary = request.Summary?.Trim() ?? string.Empty;
        post.Content = request.Content;
        post.CoverImageUrl = request.CoverImageUrl.Trim();
        post.CategoryId = request.CategoryId;
        post.Author = string.IsNullOrWhiteSpace(request.Author) ? post.Author : request.Author.Trim();
        post.ReadTimeMinutes = request.ReadTimeMinutes;
        post.MetaTitle = request.MetaTitle?.Trim();
        post.MetaDescription = request.MetaDescription?.Trim();
        post.IsPublished = request.IsPublished;
        post.IsFeatured = request.IsFeatured;
        post.ComplianceNotes = request.ComplianceNotes?.Trim();
        post.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return Ok(new { success = true, message = "Blog yazısı güncellendi.", data = post });
    }

    // Admin: Delete blog post
    [Authorize]
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var post = await _context.BlogPosts.FindAsync(id);
        if (post == null)
        {
            return NotFound(new { success = false, message = "Blog yazısı bulunamadı." });
        }

        _context.BlogPosts.Remove(post);
        await _context.SaveChangesAsync();

        return Ok(new { success = true, message = "Blog yazısı silindi." });
    }
}
