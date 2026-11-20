using FizyoBlu.Backend.Data;
using FizyoBlu.Backend.DTOs;
using FizyoBlu.Backend.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FizyoBlu.Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SiteSettingsController : ControllerBase
{
    private readonly AppDbContext _context;

    public SiteSettingsController(AppDbContext context)
    {
        _context = context;
    }

    // Public: Get all settings as key-value dictionary
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var settings = await _context.SiteSettings
            .ToDictionaryAsync(s => s.Key, s => s.Value);

        return Ok(new { success = true, data = settings });
    }

    // Admin: Update settings in bulk
    [Authorize]
    [HttpPut]
    public async Task<IActionResult> UpdateBulk([FromBody] UpdateSiteSettingsRequest request)
    {
        if (request.Settings == null || request.Settings.Count == 0)
        {
            return BadRequest(new { success = false, message = "Güncellenecek ayar bulunamadı." });
        }

        foreach (var (key, value) in request.Settings)
        {
            var existing = await _context.SiteSettings.FindAsync(key);
            if (existing != null)
            {
                existing.Value = value ?? string.Empty;
            }
            else
            {
                _context.SiteSettings.Add(new SiteSetting
                {
                    Key = key,
                    Value = value ?? string.Empty,
                    Group = "Custom"
                });
            }
        }

        await _context.SaveChangesAsync();

        var updated = await _context.SiteSettings.ToDictionaryAsync(s => s.Key, s => s.Value);
        return Ok(new { success = true, message = "Site ayarları başarıyla kaydedildi.", data = updated });
    }
}
