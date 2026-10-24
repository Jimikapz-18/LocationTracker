using System.ComponentModel.DataAnnotations;

namespace LocationTracker.Dtos;

public class RegisterRequest
{
    [Required]
    public string Name { get; set; } = null!;
    [Required]
    public string UserName { get; set; } = null!;
    [Required]
    [EmailAddress]
    public string Email { get; set; } = null!;
    [Required]
    public string Password { get; set; } = null!;
}
