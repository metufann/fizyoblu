using FizyoBlu.Backend.Data;
using FizyoBlu.Backend.DTOs;
using FizyoBlu.Backend.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FizyoBlu.Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ContactMessagesController : ControllerBase
{
    private readonly AppDbContext _context;

    public ContactMessagesController(AppDbContext context)
    {
        _context = context;
    }

    // Public: Submit contact form
    [HttpPost]
    public async Task<IActionResult> Submit([FromBody] CreateContactMessageRequest request)
    {
        var msg = new ContactMessage
        {
            FullName = request.FullName.Trim(),
            Email = request.Email.Trim().ToLowerInvariant(),
            Phone = request.Phone?.Trim() ?? string.Empty,
            InterestedService = request.InterestedService?.Trim(),
            PreferredBranch = request.PreferredBranch?.Trim(),
            Message = request.Message.Trim(),
            IsRead = false,
            CreatedAt = DateTime.UtcNow
        };

        _context.ContactMessages.Add(msg);
        await _context.SaveChangesAsync();

        return Ok(new
        {
            success = true,
            message = "Mesajınız başarıyla iletildi. En kısa sürede sizinle iletişime geçeceğiz."
        });
    }

    // Admin: List messages
    [Authorize]
    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] bool? unreadOnly = null)
    {
        var query = _context.ContactMessages.AsQueryable();

        if (unreadOnly == true)
        {
            query = query.Where(m => !m.IsRead);
        }

        var messages = await query
            .OrderByDescending(m => m.CreatedAt)
            .Select(m => new ContactMessageDto(
                m.Id, m.FullName, m.Email, m.Phone, m.InterestedService,
                m.PreferredBranch, m.Message, m.IsRead, m.AdminNotes, m.CreatedAt
            ))
            .ToListAsync();

        return Ok(new { success = true, data = messages });
    }

    // Admin: Get message detail
    [Authorize]
    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        var msg = await _context.ContactMessages.FindAsync(id);
        if (msg == null)
        {
            return NotFound(new { success = false, message = "Mesaj bulunamadı." });
        }

        return Ok(new { success = true, data = msg });
    }

    // Admin: Toggle read status / add note
    [Authorize]
    [HttpPatch("{id:int}/status")]
    public async Task<IActionResult> UpdateStatus(int id, [FromBody] UpdateContactMessageStatusRequest request)
    {
        var msg = await _context.ContactMessages.FindAsync(id);
        if (msg == null)
        {
            return NotFound(new { success = false, message = "Mesaj bulunamadı." });
        }

        msg.IsRead = request.IsRead;
        if (request.AdminNotes != null)
        {
            msg.AdminNotes = request.AdminNotes.Trim();
        }

        await _context.SaveChangesAsync();

        return Ok(new { success = true, message = "Mesaj durumu güncellendi.", data = msg });
    }

    // Admin: Delete message
    [Authorize]
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var msg = await _context.ContactMessages.FindAsync(id);
        if (msg == null)
        {
            return NotFound(new { success = false, message = "Mesaj bulunamadı." });
        }

        _context.ContactMessages.Remove(msg);
        await _context.SaveChangesAsync();

        return Ok(new { success = true, message = "Mesaj silindi." });
    }
}
