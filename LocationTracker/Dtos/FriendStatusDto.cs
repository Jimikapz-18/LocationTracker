namespace LocationTracker.Dtos
{
    public class FriendStatusDto
    {
        public bool IsSentRequestToUser { get; set; }
        public bool IsReceivedRequestFromUser {  get; set; }
        public bool IsFriend {  get; set; }
        //public Guid? RequestId { get; set; }
    }
}
