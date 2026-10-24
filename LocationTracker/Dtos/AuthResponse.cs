namespace LocationTracker.Dtos;

public class AuthResponse
{
    public string Token { get; set; } = null!;
    public string Name { get; set; } = null!;
    public Guid UserId { get; set; }
}
