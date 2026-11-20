using FizyoBlu.Backend.Data;
using FizyoBlu.Backend.DTOs;
using FizyoBlu.Backend.Entities;
using FizyoBlu.Backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FizyoBlu.Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class MediaController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly IFileStorageService _fileStorageService;

    public MediaController(AppDbContext context, IFileStorageService fileStorageService)
    {
        _context = context;
        _fileStorageService = fileStorageService;
    }

    // Public: Gallery images
    [HttpGet("gallery")]
    public async Task<IActionResult> GetGallery([FromQuery] string? category = null)
    {
        var query = _context.Media.Where(m => m.ShowInGallery);
        if (!string.IsNullOrWhiteSpace(category))
        {
            query = query.Where(m => m.Category == category);
        }

        var list = await query
            .OrderBy(m => m.Order)
            .ThenByDescending(m => m.CreatedAt)
            .Select(m => new MediaItemDto(
                m.Id, m.FileName, m.Url, m.Title, m.Category, m.ContentType,
                m.FileSizeBytes, m.Order, m.ShowInGallery, m.CreatedAt
            ))
            .ToListAsync();

        return Ok(new { success = true, data = list });
    }

    // Admin: List all media
    [Authorize]
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var list = await _context.Media
            .OrderBy(m => m.Order)
            .ThenByDescending(m => m.CreatedAt)
            .Select(m => new MediaItemDto(
                m.Id, m.FileName, m.Url, m.Title, m.Category, m.ContentType,
                m.FileSizeBytes, m.Order, m.ShowInGallery, m.CreatedAt
            ))
            .ToListAsync();

        return Ok(new { success = true, data = list });
    }

    // Admin: Upload single file
    [Authorize]
    [HttpPost("upload")]
    [Consumes("multipart/form-data")]
    public async Task<IActionResult> Upload([FromForm] IFormFile file, [FromForm] string? title = null, [FromForm] string? category = null, [FromForm] bool showInGallery = true)
    {
        var (url, originalFileName, size, contentType) = await _fileStorageService.SaveFileAsync(file, "gallery");

        var mediaItem = new MediaItem
        {
            FileName = originalFileName,
            Url = url,
            Title = string.IsNullOrWhiteSpace(title) ? Path.GetFileNameWithoutExtension(originalFileName) : title.Trim(),
            Category = category?.Trim() ?? "Genel",
            ContentType = contentType,
            FileSizeBytes = size,
            ShowInGallery = showInGallery,
            Order = 0,
            CreatedAt = DateTime.UtcNow
        };

        _context.Media.Add(mediaItem);
        await _context.SaveChangesAsync();

        return Ok(new { success = true, message = "Dosya yüklendi.", data = mediaItem });
    }

    // Admin: Update media meta
    [Authorize]
    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateMediaItemRequest request)
    {
        var item = await _context.Media.FindAsync(id);
        if (item == null)
        {
            return NotFound(new { success = false, message = "Medya kaydı bulunamadı." });
        }

        item.Title = request.Title?.Trim();
        item.Category = request.Category?.Trim();
        item.Order = request.Order;
        item.ShowInGallery = request.ShowInGallery;

        await _context.SaveChangesAsync();

        return Ok(new { success = true, message = "Medya bilgisi güncellendi.", data = item });
    }

    // Admin: Delete media
    [Authorize]
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var item = await _context.Media.FindAsync(id);
        if (item == null)
        {
            return NotFound(new { success = false, message = "Medya kaydı bulunamadı." });
        }

        // If file is stored locally, delete physical file
        if (item.Url.StartsWith("/uploads/"))
        {
            _fileStorageService.DeleteFile(item.Url);
        }

        _context.Media.Remove(item);
        await _context.SaveChangesAsync();

        return Ok(new { success = true, message = "Medya silindi." });
    }
}
