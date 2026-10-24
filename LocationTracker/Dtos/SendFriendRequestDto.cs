namespace LocationTracker.Dtos
{
    public class SendFriendRequestDto
    {
        public Guid ReceiverId { get; set; }
    }
    public class CancelFriendRequestDto {
        public Guid ReceiverId { get; set; }
    }
    public class AcceptFriendRequestDto{
        public Guid SenderId { get; set; }
    }
    public class RejectFriendRequestDto{
        public Guid SenderId { get; set; }
    }
}
