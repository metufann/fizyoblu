using System.ComponentModel.DataAnnotations;

namespace FizyoBlu.Backend.Entities;

public class Branch
{
    public int Id { get; set; }

    [Required]
    [MaxLength(100)]
    public string Name { get; set; } = string.Empty;

    [Required]
    [MaxLength(300)]
    public string Address { get; set; } = string.Empty;

    [MaxLength(100)]
    public string District { get; set; } = string.Empty;

    [MaxLength(100)]
    public string City { get; set; } = string.Empty;

    [Required]
    [MaxLength(50)]
    public string Phone { get; set; } = string.Empty;

    [MaxLength(50)]
    public string WhatsApp { get; set; } = string.Empty;

    [MaxLength(100)]
    public string Email { get; set; } = string.Empty;

    [MaxLength(150)]
    public string WorkingHours { get; set; } = string.Empty;

    [MaxLength(1000)]
    public string GoogleMapsUrl { get; set; } = string.Empty;

    [MaxLength(1000)]
    public string? EmbedMapUrl { get; set; }

    [MaxLength(500)]
    public string? ImageUrl { get; set; }

    public int Order { get; set; } = 0;
    public bool IsActive { get; set; } = true;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
