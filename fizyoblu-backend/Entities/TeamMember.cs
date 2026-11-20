using System.ComponentModel.DataAnnotations;

namespace FizyoBlu.Backend.Entities;

public class TeamMember
{
    public int Id { get; set; }

    [Required]
    [MaxLength(100)]
    public string FullName { get; set; } = string.Empty;

    [Required]
    [MaxLength(150)]
    public string Title { get; set; } = string.Empty; // e.g. "Uzman Fizyoterapist & Klinik Pilates Eğitmeni"

    public string Bio { get; set; } = string.Empty;

    [MaxLength(500)]
    public string ImageUrl { get; set; } = string.Empty;

    [MaxLength(200)]
    public string? Specialities { get; set; }

    [MaxLength(100)]
    public string? Instagram { get; set; }

    [MaxLength(100)]
    public string? LinkedIn { get; set; }

    public int Order { get; set; } = 0;
    public bool IsActive { get; set; } = true;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
