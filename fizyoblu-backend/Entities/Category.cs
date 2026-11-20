using System.ComponentModel.DataAnnotations;

namespace FizyoBlu.Backend.Entities;

public class Category
{
    public int Id { get; set; }

    [Required]
    [MaxLength(100)]
    public string Name { get; set; } = string.Empty;

    [Required]
    [MaxLength(100)]
    public string Slug { get; set; } = string.Empty;

    [MaxLength(200)]
    public string? Description { get; set; }

    public ICollection<BlogPost> BlogPosts { get; set; } = new List<BlogPost>();
}
