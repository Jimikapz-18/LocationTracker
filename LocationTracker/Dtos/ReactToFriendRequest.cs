using LocationTracker.Enums;

namespace LocationTracker.Dtos
{
    public class ReactToFriendRequest
    {
        public Guid RequestId { get; set; }
        public FriendRequestStatus Reaction {  get; set; }
    }
}
