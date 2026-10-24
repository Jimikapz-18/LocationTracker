using LocationTracker.Dtos;
using LocationTracker.Enums;

namespace LocationTracker.Contracts
{
    public interface IFriendService
    {
        Task<bool> SendFriendRequest(Guid senderId, Guid receiverId);
        Task<bool> CancelOrRejectFriendRequst(Guid senderId, Guid receiverId);
        Task<bool> AcceptFriendRequest(Guid senderId, Guid receiverId);
        //Task<bool> ReactToFriendRequestAsync(Guid requestId, FriendRequestStatus response);
        Task<List<UserDto>> SearchUser(string username);
        Task<FriendStatusDto> GetFriendRequestStatus(Guid otherUserId);
        Task<List<IncomingFriendRequestResponse>> GetIncomingRequests(Guid userId);
    }
}
