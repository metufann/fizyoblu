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
public class CategoriesController : ControllerBase
{
    private readonly AppDbContext _context;

    public CategoriesController(AppDbContext context)
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

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var categories = await _context.Categories
            .Select(c => new CategoryDto(
                c.Id,
                c.Name,
                c.Slug,
                c.Description,
                c.BlogPosts.Count(b => b.IsPublished)
            ))
            .ToListAsync();

        return Ok(new { success = true, data = categories });
    }

    [Authorize]
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateCategoryRequest request)
    {
        var slug = string.IsNullOrWhiteSpace(request.Slug) ? GenerateSlug(request.Name) : GenerateSlug(request.Slug);

        if (await _context.Categories.AnyAsync(c => c.Slug == slug))
        {
            return BadRequest(new { success = false, message = "Bu kategori adı veya bağlantısı zaten mevcut." });
        }

        var category = new Category
        {
            Name = request.Name.Trim(),
            Slug = slug,
            Description = request.Description?.Trim()
        };

        _context.Categories.Add(category);
        await _context.SaveChangesAsync();

        return Ok(new { success = true, message = "Kategori eklendi.", data = category });
    }

    [Authorize]
    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, [FromBody] CreateCategoryRequest request)
    {
        var category = await _context.Categories.FindAsync(id);
        if (category == null)
        {
            return NotFound(new { success = false, message = "Kategori bulunamadı." });
        }

        var slug = string.IsNullOrWhiteSpace(request.Slug) ? GenerateSlug(request.Name) : GenerateSlug(request.Slug);

        if (slug != category.Slug && await _context.Categories.AnyAsync(c => c.Slug == slug && c.Id != id))
        {
            return BadRequest(new { success = false, message = "Bu kategori bağlantısı başka bir kategori tarafından kullanılıyor." });
        }

        category.Name = request.Name.Trim();
        category.Slug = slug;
        category.Description = request.Description?.Trim();

        await _context.SaveChangesAsync();

        return Ok(new { success = true, message = "Kategori güncellendi.", data = category });
    }

    [Authorize]
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var category = await _context.Categories.Include(c => c.BlogPosts).FirstOrDefaultAsync(c => c.Id == id);
        if (category == null)
        {
            return NotFound(new { success = false, message = "Kategori bulunamadı." });
        }

        _context.Categories.Remove(category);
        await _context.SaveChangesAsync();

        return Ok(new { success = true, message = "Kategori silindi." });
    }
}
