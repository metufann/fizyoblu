using FizyoBlu.Backend.Data;
using FizyoBlu.Backend.DTOs;
using FizyoBlu.Backend.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FizyoBlu.Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BranchesController : ControllerBase
{
    private readonly AppDbContext _context;

    public BranchesController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var branches = await _context.Branches
            .Where(b => b.IsActive)
            .OrderBy(b => b.Order)
            .Select(b => new BranchDto(
                b.Id, b.Name, b.Address, b.District, b.City, b.Phone, b.WhatsApp,
                b.Email, b.WorkingHours, b.GoogleMapsUrl, b.EmbedMapUrl, b.ImageUrl,
                b.Order, b.IsActive
            ))
            .ToListAsync();

        return Ok(new { success = true, data = branches });
    }

    [Authorize]
    [HttpGet("admin/all")]
    public async Task<IActionResult> GetAllForAdmin()
    {
        var branches = await _context.Branches
            .OrderBy(b => b.Order)
            .Select(b => new BranchDto(
                b.Id, b.Name, b.Address, b.District, b.City, b.Phone, b.WhatsApp,
                b.Email, b.WorkingHours, b.GoogleMapsUrl, b.EmbedMapUrl, b.ImageUrl,
                b.Order, b.IsActive
            ))
            .ToListAsync();

        return Ok(new { success = true, data = branches });
    }

    [Authorize]
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateBranchRequest request)
    {
        var branch = new Branch
        {
            Name = request.Name.Trim(),
            Address = request.Address.Trim(),
            District = request.District?.Trim() ?? string.Empty,
            City = request.City?.Trim() ?? string.Empty,
            Phone = request.Phone.Trim(),
            WhatsApp = request.WhatsApp?.Trim() ?? string.Empty,
            Email = request.Email?.Trim() ?? string.Empty,
            WorkingHours = request.WorkingHours?.Trim() ?? string.Empty,
            GoogleMapsUrl = request.GoogleMapsUrl?.Trim() ?? string.Empty,
            EmbedMapUrl = request.EmbedMapUrl?.Trim(),
            ImageUrl = request.ImageUrl,
            Order = request.Order,
            IsActive = request.IsActive,
            CreatedAt = DateTime.UtcNow
        };

        _context.Branches.Add(branch);
        await _context.SaveChangesAsync();

        return Ok(new { success = true, message = "Şube eklendi.", data = branch });
    }

    [Authorize]
    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateBranchRequest request)
    {
        var branch = await _context.Branches.FindAsync(id);
        if (branch == null)
        {
            return NotFound(new { success = false, message = "Şube bulunamadı." });
        }

        branch.Name = request.Name.Trim();
        branch.Address = request.Address.Trim();
        branch.District = request.District?.Trim() ?? string.Empty;
        branch.City = request.City?.Trim() ?? string.Empty;
        branch.Phone = request.Phone.Trim();
        branch.WhatsApp = request.WhatsApp?.Trim() ?? string.Empty;
        branch.Email = request.Email?.Trim() ?? string.Empty;
        branch.WorkingHours = request.WorkingHours?.Trim() ?? string.Empty;
        branch.GoogleMapsUrl = request.GoogleMapsUrl?.Trim() ?? string.Empty;
        branch.EmbedMapUrl = request.EmbedMapUrl?.Trim();
        branch.ImageUrl = request.ImageUrl ?? branch.ImageUrl;
        branch.Order = request.Order;
        branch.IsActive = request.IsActive;

        await _context.SaveChangesAsync();

        return Ok(new { success = true, message = "Şube güncellendi.", data = branch });
    }

    [Authorize]
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var branch = await _context.Branches.FindAsync(id);
        if (branch == null)
        {
            return NotFound(new { success = false, message = "Şube bulunamadı." });
        }

        _context.Branches.Remove(branch);
        await _context.SaveChangesAsync();

        return Ok(new { success = true, message = "Şube silindi." });
    }
}
