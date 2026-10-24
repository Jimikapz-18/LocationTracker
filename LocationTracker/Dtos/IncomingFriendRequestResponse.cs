namespace LocationTracker.Dtos
{
    public class IncomingFriendRequestResponse
    {
        public Guid SenderId { get; set; }
        public string SenderUserName { get; set; } = null!;
        public DateTime RequestedAt { get; set; }
    }
}
