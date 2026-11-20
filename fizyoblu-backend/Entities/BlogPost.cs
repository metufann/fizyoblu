using System.ComponentModel.DataAnnotations;

namespace FizyoBlu.Backend.Entities;

public class BlogPost
{
    public int Id { get; set; }

    [Required]
    [MaxLength(200)]
    public string Title { get; set; } = string.Empty;

    [Required]
    [MaxLength(200)]
    public string Slug { get; set; } = string.Empty;

    [MaxLength(400)]
    public string Summary { get; set; } = string.Empty;

    public string Content { get; set; } = string.Empty; // HTML from TipTap

    [MaxLength(500)]
    public string CoverImageUrl { get; set; } = string.Empty;

    public int? CategoryId { get; set; }
    public Category? Category { get; set; }

    [MaxLength(100)]
    public string Author { get; set; } = "FizyoBlu Uzman Ekibi";

    public int ReadTimeMinutes { get; set; } = 4;

    [MaxLength(160)]
    public string? MetaTitle { get; set; }

    [MaxLength(250)]
    public string? MetaDescription { get; set; }

    public bool IsPublished { get; set; } = true;
    public bool IsFeatured { get; set; } = false;

    public DateTime PublishedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }
}
