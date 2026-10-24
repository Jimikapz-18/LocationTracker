using LocationTracker.Enums;
using System.ComponentModel.DataAnnotations.Schema;

namespace LocationTracker.Models
{
    public class FriendRequest
    {
        public Guid Id { get; set; } = new Guid();
        public Guid SenderId { get; set; }
        public Guid ReceiverId { get; set; }
        public FriendRequestStatus Status { get; set; } = FriendRequestStatus.Pending;
        public DateTime RequestedAt { get; set; }
        public DateTime? RespondedAt { get; set; }

        //Navigation Properties
        public User Sender { get; set; } = null!;
        public User Receiver { get; set; } = null!;
    }
}
