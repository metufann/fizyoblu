using System.ComponentModel.DataAnnotations;

namespace FizyoBlu.Backend.Entities;

public class MediaItem
{
    public int Id { get; set; }

    [Required]
    [MaxLength(250)]
    public string FileName { get; set; } = string.Empty;

    [Required]
    [MaxLength(500)]
    public string Url { get; set; } = string.Empty;

    [MaxLength(200)]
    public string? Title { get; set; }

    [MaxLength(100)]
    public string? Category { get; set; } // e.g. "Stüdyo", "Reformer", "Egzersiz", "Ekip"

    [MaxLength(50)]
    public string? ContentType { get; set; }

    public long FileSizeBytes { get; set; }

    public int Order { get; set; } = 0;
    public bool ShowInGallery { get; set; } = true;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
