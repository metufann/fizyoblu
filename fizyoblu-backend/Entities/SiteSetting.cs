using System.ComponentModel.DataAnnotations;

namespace FizyoBlu.Backend.Entities;

public class SiteSetting
{
    [Key]
    [MaxLength(100)]
    public string Key { get; set; } = string.Empty;

    public string Value { get; set; } = string.Empty;

    [MaxLength(100)]
    public string? Group { get; set; } // General, Contact, Hero, SEO, Social
}
