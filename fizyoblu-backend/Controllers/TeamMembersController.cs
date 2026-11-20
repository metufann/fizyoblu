using FizyoBlu.Backend.Data;
using FizyoBlu.Backend.DTOs;
using FizyoBlu.Backend.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FizyoBlu.Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TeamMembersController : ControllerBase
{
    private readonly AppDbContext _context;

    public TeamMembersController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var team = await _context.TeamMembers
            .Where(t => t.IsActive)
            .OrderBy(t => t.Order)
            .Select(t => new TeamMemberDto(
                t.Id, t.FullName, t.Title, t.Bio, t.ImageUrl,
                t.Specialities, t.Instagram, t.LinkedIn, t.Order, t.IsActive
            ))
            .ToListAsync();

        return Ok(new { success = true, data = team });
    }

    [Authorize]
    [HttpGet("admin/all")]
    public async Task<IActionResult> GetAllForAdmin()
    {
        var team = await _context.TeamMembers
            .OrderBy(t => t.Order)
            .Select(t => new TeamMemberDto(
                t.Id, t.FullName, t.Title, t.Bio, t.ImageUrl,
                t.Specialities, t.Instagram, t.LinkedIn, t.Order, t.IsActive
            ))
            .ToListAsync();

        return Ok(new { success = true, data = team });
    }

    [Authorize]
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateTeamMemberRequest request)
    {
        var member = new TeamMember
        {
            FullName = request.FullName.Trim(),
            Title = request.Title.Trim(),
            Bio = request.Bio.Trim(),
            ImageUrl = request.ImageUrl.Trim(),
            Specialities = request.Specialities?.Trim(),
            Instagram = request.Instagram?.Trim(),
            LinkedIn = request.LinkedIn?.Trim(),
            Order = request.Order,
            IsActive = request.IsActive,
            CreatedAt = DateTime.UtcNow
        };

        _context.TeamMembers.Add(member);
        await _context.SaveChangesAsync();

        return Ok(new { success = true, message = "Ekip üyesi eklendi.", data = member });
    }

    [Authorize]
    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateTeamMemberRequest request)
    {
        var member = await _context.TeamMembers.FindAsync(id);
        if (member == null)
        {
            return NotFound(new { success = false, message = "Ekip üyesi bulunamadı." });
        }

        member.FullName = request.FullName.Trim();
        member.Title = request.Title.Trim();
        member.Bio = request.Bio.Trim();
        member.ImageUrl = request.ImageUrl.Trim();
        member.Specialities = request.Specialities?.Trim();
        member.Instagram = request.Instagram?.Trim();
        member.LinkedIn = request.LinkedIn?.Trim();
        member.Order = request.Order;
        member.IsActive = request.IsActive;

        await _context.SaveChangesAsync();

        return Ok(new { success = true, message = "Ekip üyesi güncellendi.", data = member });
    }

    [Authorize]
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var member = await _context.TeamMembers.FindAsync(id);
        if (member == null)
        {
            return NotFound(new { success = false, message = "Ekip üyesi bulunamadı." });
        }

        _context.TeamMembers.Remove(member);
        await _context.SaveChangesAsync();

        return Ok(new { success = true, message = "Ekip üyesi silindi." });
    }
}
