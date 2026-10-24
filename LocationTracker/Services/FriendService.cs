using LocationTracker.Contracts;
using LocationTracker.Data;
using LocationTracker.Dtos;
using LocationTracker.Enums;
using LocationTracker.Models;
using Microsoft.EntityFrameworkCore;

namespace LocationTracker.Services
{
    public class FriendService : IFriendService
    {
        private readonly AppDbContext _context;
        private readonly ICurrentUserService _currentUserService;
        public FriendService(AppDbContext context, ICurrentUserService currentUserService)
        {
            _context = context;
            _currentUserService = currentUserService;
        }
        public async Task<bool> SendFriendRequest(Guid senderId, Guid receiverId)
        {
            if (senderId == receiverId) return false;
            var alreadyExists = await _context.FriendRequests
            .AnyAsync(fr =>
                (fr.SenderId == senderId && fr.ReceiverId == receiverId) ||
                (fr.SenderId == receiverId && fr.ReceiverId == senderId));

            if (alreadyExists) return false;

            var request = new FriendRequest
            {
                SenderId = senderId,
                ReceiverId = receiverId,
                RequestedAt = DateTime.UtcNow,
            };

            _context.FriendRequests.Add(request);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> CancelOrRejectFriendRequst(Guid senderId, Guid receiverId)
        {
            if(senderId == receiverId) return false;
            var request = await _context.FriendRequests.FirstOrDefaultAsync(fr => fr.SenderId == senderId && fr.ReceiverId == receiverId && fr.Status == FriendRequestStatus.Pending);
            if (request == null) return false;
            _context.FriendRequests.Remove(request);
            await _context.SaveChangesAsync();
            return true;
        }
        public async Task<bool> AcceptFriendRequest(Guid senderId, Guid receiverId)
        {
            if( senderId == receiverId) return false;
            var request = await _context.FriendRequests.FirstOrDefaultAsync(fr => fr.SenderId == senderId && fr.ReceiverId == receiverId && fr.Status == FriendRequestStatus.Pending);
            if (request == null) return false;
            request.Status = FriendRequestStatus.Accepted;
            request.RespondedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();
            return true;

        }
        public async Task<List<IncomingFriendRequestResponse>> GetIncomingRequests(Guid userId)
        {
            return  await _context.FriendRequests
                .Where(fr => fr.ReceiverId == userId && fr.Status == FriendRequestStatus.Pending)
                .OrderByDescending(fr => fr.RequestedAt)
                .Select(fr => new IncomingFriendRequestResponse
                {
                    SenderId = fr.SenderId,
                    SenderUserName = fr.Sender.UserName,
                    RequestedAt = fr.RequestedAt
                })
                .ToListAsync();
        }

        //public async Task<bool> ReactToFriendRequestAsync(Guid requestId,FriendRequestStatus response)
        //{
        //    var request = await _context.FriendRequests.FirstOrDefaultAsync(fr => fr.Id == requestId);

        //    if (request == null || request.Status != FriendRequestStatus.Pending)
        //        return false;

        //    if (response == FriendRequestStatus.Accepted)
        //    {
        //        request.Status = FriendRequestStatus.Accepted;
        //        request.RespondedAt = DateTime.UtcNow;
        //    }
        //    else if (response == FriendRequestStatus.Rejected)
        //    {
        //        _context.FriendRequests.Remove(request);
        //    }
        //    await _context.SaveChangesAsync();
        //    return true;
        //}

        public async Task<List<UserDto>> SearchUser(string username)
        {
            var currentUserId = _currentUserService.UserId;
            var users = await _context.Users
                .Where(u => u.UserName.Contains(username) && u.Id != currentUserId)
                .Select(u => new UserDto
                {
                    Id = u.Id,
                    UserName = u.UserName
                })
                .ToListAsync();
            return users;
        }
        public async Task<FriendStatusDto> GetFriendRequestStatus(Guid otherUserId)
        {
            var currentUserId = _currentUserService.UserId;
            var friendRequest = await _context.FriendRequests
                .AsNoTracking()
                .FirstOrDefaultAsync(fr => 
                (fr.SenderId == currentUserId && fr.ReceiverId == otherUserId) || 
                (fr.SenderId == otherUserId && fr.ReceiverId == currentUserId)
                );
            if (friendRequest == null) 
            {
                return new FriendStatusDto
                {
                    IsSentRequestToUser = false,
                    IsReceivedRequestFromUser = false,
                    IsFriend = false,
                };
            }
            return new FriendStatusDto
            {
                IsSentRequestToUser = friendRequest.SenderId == currentUserId &&
                    friendRequest.ReceiverId == otherUserId &&
                    friendRequest.Status == FriendRequestStatus.Pending,
                IsReceivedRequestFromUser = friendRequest.SenderId == otherUserId && 
                    friendRequest.ReceiverId == currentUserId &&
                    friendRequest.Status == FriendRequestStatus.Pending,
                IsFriend = friendRequest.Status == FriendRequestStatus.Accepted
            };
        }

        
    }
}
