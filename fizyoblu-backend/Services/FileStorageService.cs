namespace FizyoBlu.Backend.Services;

public interface IFileStorageService
{
    Task<(string url, string fileName, long size, string contentType)> SaveFileAsync(IFormFile file, string? subFolder = null);
    bool DeleteFile(string relativePath);
}

public class FileStorageService : IFileStorageService
{
    private readonly IWebHostEnvironment _env;
    private readonly IHttpContextAccessor _httpContextAccessor;

    private static readonly string[] AllowedExtensions = [".jpg", ".jpeg", ".png", ".webp", ".svg"];
    private static readonly string[] AllowedMimeTypes = ["image/jpeg", "image/png", "image/webp", "image/svg+xml"];

    public FileStorageService(IWebHostEnvironment env, IHttpContextAccessor httpContextAccessor)
    {
        _env = env;
        _httpContextAccessor = httpContextAccessor;
    }

    public async Task<(string url, string fileName, long size, string contentType)> SaveFileAsync(IFormFile file, string? subFolder = null)
    {
        if (file == null || file.Length == 0)
        {
            throw new ArgumentException("Yüklenecek dosya seçilmedi.");
        }

        // Limit size: 10MB
        if (file.Length > 10 * 1024 * 1024)
        {
            throw new ArgumentException("Dosya boyutu en fazla 10MB olabilir.");
        }

        var ext = Path.GetExtension(file.FileName).ToLowerInvariant();
        if (!AllowedExtensions.Contains(ext))
        {
            throw new ArgumentException("Yalnızca JPG, JPEG, PNG, WEBP ve SVG görselleri yüklenebilir.");
        }

        if (!AllowedMimeTypes.Contains(file.ContentType.ToLowerInvariant()))
        {
            throw new ArgumentException("Geçersiz dosya içerik tipi.");
        }

        var webRoot = _env.WebRootPath ?? Path.Combine(_env.ContentRootPath, "wwwroot");
        var uploadsDir = Path.Combine(webRoot, "uploads", subFolder ?? "");

        if (!Directory.Exists(uploadsDir))
        {
            Directory.CreateDirectory(uploadsDir);
        }

        var uniqueFileName = $"{Guid.NewGuid():N}{ext}";
        var filePath = Path.Combine(uploadsDir, uniqueFileName);

        using (var stream = new FileStream(filePath, FileMode.Create))
        {
            await file.CopyToAsync(stream);
        }

        var request = _httpContextAccessor.HttpContext?.Request;
        var baseUrl = request != null ? $"{request.Scheme}://{request.Host}" : "";

        var relativePath = string.IsNullOrEmpty(subFolder)
            ? $"/uploads/{uniqueFileName}"
            : $"/uploads/{subFolder}/{uniqueFileName}";

        return (relativePath, file.FileName, file.Length, file.ContentType);
    }

    public bool DeleteFile(string relativePath)
    {
        if (string.IsNullOrWhiteSpace(relativePath)) return false;

        var cleanPath = relativePath.TrimStart('/');
        var webRoot = _env.WebRootPath ?? Path.Combine(_env.ContentRootPath, "wwwroot");
        var fullPath = Path.Combine(webRoot, cleanPath);

        if (File.Exists(fullPath))
        {
            File.Delete(fullPath);
            return true;
        }

        return false;
    }
}
