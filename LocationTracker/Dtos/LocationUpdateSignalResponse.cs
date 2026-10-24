namespace LocationTracker.Dtos
{
    public class LocationUpdateSignalResponse
    {
        public string UserId { get; set; } = null!;
        public string UserName { get; set; } = null!;
        public Coordinate Coordinate { get; set; } = null!;
        public DateTime LastUpdated { get; set; }
    }
}
