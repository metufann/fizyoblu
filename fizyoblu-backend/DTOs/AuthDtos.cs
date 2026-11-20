using System.ComponentModel.DataAnnotations;

namespace FizyoBlu.Backend.DTOs;

public record LoginRequest(
    [Required][EmailAddress] string Email,
    [Required] string Password
);

public record AuthUserResponse(
    int Id,
    string FullName,
    string Email,
    string Role
);

public record LoginResponse(
    string Token,
    AuthUserResponse User
);

public record ChangePasswordRequest(
    [Required] string CurrentPassword,
    [Required][MinLength(6)] string NewPassword
);
