using System.ComponentModel.DataAnnotations;

namespace FizyoBlu.Backend.DTOs;

// Services
public record ServiceDto(
    int Id,
    string Title,
    string Slug,
    string Summary,
    string Description,
    string ImageUrl,
    int Order,
    bool IsActive,
    bool IsFeatured,
    string? MetaDescription
);

public record CreateServiceRequest(
    [Required][MaxLength(150)] string Title,
    string? Slug,
    [MaxLength(300)] string? Summary,
    [Required] string Description,
    string? ImageUrl,
    int Order = 0,
    bool IsActive = true,
    bool IsFeatured = false,
    string? MetaDescription = null
);

public record UpdateServiceRequest(
    [Required][MaxLength(150)] string Title,
    [Required][MaxLength(150)] string Slug,
    [MaxLength(300)] string? Summary,
    [Required] string Description,
    string? ImageUrl,
    int Order,
    bool IsActive,
    bool IsFeatured,
    string? MetaDescription
);

// Branches
public record BranchDto(
    int Id,
    string Name,
    string Address,
    string District,
    string City,
    string Phone,
    string WhatsApp,
    string Email,
    string WorkingHours,
    string GoogleMapsUrl,
    string? EmbedMapUrl,
    string? ImageUrl,
    int Order,
    bool IsActive
);

public record CreateBranchRequest(
    [Required][MaxLength(100)] string Name,
    [Required][MaxLength(300)] string Address,
    string District,
    string City,
    [Required][MaxLength(50)] string Phone,
    string WhatsApp,
    string Email,
    string WorkingHours,
    string GoogleMapsUrl,
    string? EmbedMapUrl,
    string? ImageUrl,
    int Order = 0,
    bool IsActive = true
);

public record UpdateBranchRequest(
    [Required][MaxLength(100)] string Name,
    [Required][MaxLength(300)] string Address,
    string District,
    string City,
    [Required][MaxLength(50)] string Phone,
    string WhatsApp,
    string Email,
    string WorkingHours,
    string GoogleMapsUrl,
    string? EmbedMapUrl,
    string? ImageUrl,
    int Order,
    bool IsActive
);

// Team Members
public record TeamMemberDto(
    int Id,
    string FullName,
    string Title,
    string Bio,
    string ImageUrl,
    string? Specialities,
    string? Instagram,
    string? LinkedIn,
    int Order,
    bool IsActive
);

public record CreateTeamMemberRequest(
    [Required][MaxLength(100)] string FullName,
    [Required][MaxLength(150)] string Title,
    [Required] string Bio,
    [Required] string ImageUrl,
    string? Specialities,
    string? Instagram,
    string? LinkedIn,
    int Order = 0,
    bool IsActive = true
);

public record UpdateTeamMemberRequest(
    [Required][MaxLength(100)] string FullName,
    [Required][MaxLength(150)] string Title,
    [Required] string Bio,
    [Required] string ImageUrl,
    string? Specialities,
    string? Instagram,
    string? LinkedIn,
    int Order,
    bool IsActive
);

// Blog Posts & Categories
public record CategoryDto(
    int Id,
    string Name,
    string Slug,
    string? Description,
    int PostCount
);

public record CreateCategoryRequest(
    [Required][MaxLength(100)] string Name,
    string? Slug,
    string? Description
);

public record BlogPostDto(
    int Id,
    string Title,
    string Slug,
    string Summary,
    string Content,
    string CoverImageUrl,
    int? CategoryId,
    string? CategoryName,
    string? CategorySlug,
    string Author,
    int ReadTimeMinutes,
    string? MetaTitle,
    string? MetaDescription,
    bool IsPublished,
    bool IsFeatured,
    DateTime PublishedAt
);

public record BlogPostSummaryDto(
    int Id,
    string Title,
    string Slug,
    string Summary,
    string CoverImageUrl,
    int? CategoryId,
    string? CategoryName,
    string? CategorySlug,
    string Author,
    int ReadTimeMinutes,
    bool IsPublished,
    bool IsFeatured,
    DateTime PublishedAt
);

public record CreateBlogPostRequest(
    [Required][MaxLength(200)] string Title,
    string? Slug,
    [MaxLength(400)] string Summary,
    [Required] string Content,
    [Required] string CoverImageUrl,
    int? CategoryId,
    string? Author,
    int ReadTimeMinutes = 4,
    string? MetaTitle = null,
    string? MetaDescription = null,
    bool IsPublished = true,
    bool IsFeatured = false
);

public record UpdateBlogPostRequest(
    [Required][MaxLength(200)] string Title,
    [Required][MaxLength(200)] string Slug,
    [MaxLength(400)] string Summary,
    [Required] string Content,
    [Required] string CoverImageUrl,
    int? CategoryId,
    string? Author,
    int ReadTimeMinutes,
    string? MetaTitle,
    string? MetaDescription,
    bool IsPublished,
    bool IsFeatured
);

// Contact Message
public record ContactMessageDto(
    int Id,
    string FullName,
    string Email,
    string Phone,
    string? InterestedService,
    string? PreferredBranch,
    string Message,
    bool IsRead,
    string? AdminNotes,
    DateTime CreatedAt
);

public record CreateContactMessageRequest(
    [Required][MaxLength(100)] string FullName,
    [Required][EmailAddress][MaxLength(150)] string Email,
    [MaxLength(30)] string Phone,
    string? InterestedService,
    string? PreferredBranch,
    [Required][MaxLength(2000)] string Message
);

public record UpdateContactMessageStatusRequest(
    bool IsRead,
    string? AdminNotes
);

// Media
public record MediaItemDto(
    int Id,
    string FileName,
    string Url,
    string? Title,
    string? Category,
    string? ContentType,
    long FileSizeBytes,
    int Order,
    bool ShowInGallery,
    DateTime CreatedAt
);

public record UpdateMediaItemRequest(
    string? Title,
    string? Category,
    int Order,
    bool ShowInGallery
);

// Site Settings
public record SiteSettingDto(
    string Key,
    string Value,
    string? Group
);

public record UpdateSiteSettingsRequest(
    Dictionary<string, string> Settings
);
