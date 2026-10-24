namespace LocationTracker.Models;

public class UserLocation
{
    public Guid UserId { get; set; }
    public double Latitude { get; set; }
    public double Longitude { get; set; }
    public DateTime LastUpdated { get; set; }

    //Navigation Properties
    public User User { get; set; } = null!;
}
