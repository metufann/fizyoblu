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
public class ServicesController : ControllerBase
{
    private readonly AppDbContext _context;

    public ServicesController(AppDbContext context)
    {
        _context = context;
    }

    private static string GenerateSlug(string title)
    {
        var str = title.ToLowerInvariant()
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

    // Public: List active services
    [HttpGet]
    public async Task<IActionResult> GetAllActive()
    {
        var services = await _context.Services
            .Where(s => s.IsActive)
            .OrderBy(s => s.Order)
            .Select(s => new ServiceDto(
                s.Id, s.Title, s.Slug, s.Summary, s.Description, s.ImageUrl,
                s.Order, s.IsActive, s.IsFeatured, s.MetaDescription, s.ComplianceNotes
            ))
            .ToListAsync();

        return Ok(new { success = true, data = services });
    }

    // Public: Single service by slug
    [HttpGet("{slug}")]
    public async Task<IActionResult> GetBySlug(string slug)
    {
        var service = await _context.Services
            .Where(s => s.IsActive && s.Slug == slug)
            .Select(s => new ServiceDto(
                s.Id, s.Title, s.Slug, s.Summary, s.Description, s.ImageUrl,
                s.Order, s.IsActive, s.IsFeatured, s.MetaDescription, s.ComplianceNotes
            ))
            .FirstOrDefaultAsync();

        if (service == null)
        {
            return NotFound(new { success = false, message = "Hizmet bulunamadı." });
        }

        return Ok(new { success = true, data = service });
    }

    // Admin: List all services
    [Authorize]
    [HttpGet("admin/all")]
    public async Task<IActionResult> GetAllForAdmin()
    {
        var services = await _context.Services
            .OrderBy(s => s.Order)
            .Select(s => new ServiceDto(
                s.Id, s.Title, s.Slug, s.Summary, s.Description, s.ImageUrl,
                s.Order, s.IsActive, s.IsFeatured, s.MetaDescription, s.ComplianceNotes
            ))
            .ToListAsync();

        return Ok(new { success = true, data = services });
    }

    // Admin: Create service
    [Authorize]
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateServiceRequest request)
    {
        var slug = string.IsNullOrWhiteSpace(request.Slug) ? GenerateSlug(request.Title) : GenerateSlug(request.Slug);

        // Ensure unique slug
        var baseSlug = slug;
        var counter = 1;
        while (await _context.Services.AnyAsync(s => s.Slug == slug))
        {
            slug = $"{baseSlug}-{counter++}";
        }

        var service = new ServiceItem
        {
            Title = request.Title.Trim(),
            Slug = slug,
            Summary = request.Summary?.Trim() ?? string.Empty,
            Description = request.Description,
            ImageUrl = request.ImageUrl ?? "",
            Order = request.Order,
            IsActive = request.IsActive,
            IsFeatured = request.IsFeatured,
            MetaDescription = request.MetaDescription,
            ComplianceNotes = request.ComplianceNotes?.Trim(),
            CreatedAt = DateTime.UtcNow
        };

        _context.Services.Add(service);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetBySlug), new { slug = service.Slug }, new { success = true, data = service });
    }

    // Admin: Update service
    [Authorize]
    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateServiceRequest request)
    {
        var service = await _context.Services.FindAsync(id);
        if (service == null)
        {
            return NotFound(new { success = false, message = "Güncellenecek hizmet bulunamadı." });
        }

        var targetSlug = GenerateSlug(request.Slug);
        if (targetSlug != service.Slug && await _context.Services.AnyAsync(s => s.Slug == targetSlug && s.Id != id))
        {
            return BadRequest(new { success = false, message = "Bu slug ile başka bir hizmet mevcut." });
        }

        service.Title = request.Title.Trim();
        service.Slug = targetSlug;
        service.Summary = request.Summary?.Trim() ?? string.Empty;
        service.Description = request.Description;
        service.ImageUrl = request.ImageUrl ?? service.ImageUrl;
        service.Order = request.Order;
        service.IsActive = request.IsActive;
        service.IsFeatured = request.IsFeatured;
        service.MetaDescription = request.MetaDescription;
        service.ComplianceNotes = request.ComplianceNotes?.Trim();
        service.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return Ok(new { success = true, message = "Hizmet başarıyla güncellendi.", data = service });
    }

    // Admin: Delete service
    [Authorize]
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var service = await _context.Services.FindAsync(id);
        if (service == null)
        {
            return NotFound(new { success = false, message = "Silinecek hizmet bulunamadı." });
        }

        _context.Services.Remove(service);
        await _context.SaveChangesAsync();

        return Ok(new { success = true, message = "Hizmet silindi." });
    }
}
