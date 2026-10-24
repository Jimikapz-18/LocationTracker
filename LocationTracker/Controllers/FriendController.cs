using Azure.Core;
using LocationTracker.Contracts;
using LocationTracker.Dtos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace LocationTracker.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class FriendController : ControllerBase
    {
        private readonly IFriendService _friendService;
        private readonly ICurrentUserService _currentUserService;
        public FriendController(IFriendService friendService, ICurrentUserService currentUserService)
        {
            _friendService = friendService;
            _currentUserService = currentUserService;
        }

        [HttpPost("request/send")]
        public async Task<IActionResult> SendFriendRequest([FromBody] SendFriendRequestDto request)
        {
            try
            {
                var senderId = _currentUserService.UserId;
                var success = await _friendService.SendFriendRequest(senderId, request.ReceiverId);
                return success ? Ok() : BadRequest(new { message = "Friend request already exists or invalid." });
            }
            catch (Exception ex) 
            {
                return StatusCode(500,ex.Message);
            }
        }
        [HttpPost("request/cancel")]
        public async Task<IActionResult> CancelFriendRequest([FromBody] CancelFriendRequestDto request)
        {
            try
            {
                var senderId = _currentUserService.UserId;
                var success = await _friendService.CancelOrRejectFriendRequst(senderId, request.ReceiverId);
                return success ? Ok() : BadRequest(new {message = "Something went wrong"});
            }
            catch (Exception ex) 
            {
                return StatusCode(500,ex.Message);
            }
        }
        [HttpPost("request/reject")]
        public async Task<IActionResult> RejectFriendRequest([FromBody] RejectFriendRequestDto request)
        {
            try
            {
                var userId = _currentUserService.UserId;
                var success = await _friendService.CancelOrRejectFriendRequst(request.SenderId,userId);
                return success ? Ok() : BadRequest(new { message = "Something went wrong" });
            }
            catch(Exception ex)
            {
                return StatusCode(500,ex.Message);
            }
        }
        [HttpPost("request/accept")]
        public async Task<IActionResult> AcceptFriendRequest([FromBody] AcceptFriendRequestDto request)
        {
            try
            {
                var userId = _currentUserService.UserId;
                var success = await _friendService.AcceptFriendRequest(request.SenderId, userId);
                return success ? Ok() : BadRequest(new { message = "Something went wrong" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }
        [HttpGet("incomingrequests")]
        public async Task<IActionResult> GetIncomingRequests()
        {
            try
            {
                var userId = _currentUserService.UserId;
                var incomingRequests = await _friendService.GetIncomingRequests(userId);
                return Ok(incomingRequests);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }
        [HttpGet("search")]
        public async Task<IActionResult> SearchUsers([FromQuery]string username)
        {
            try
            {
                var users = await _friendService.SearchUser(username);
                return Ok(users);
            }
            catch (Exception ex) 
            {
                return StatusCode(500, ex.Message);
            }
        }
        [HttpGet("status")]
        public async Task<IActionResult> GetStatus([FromQuery] Guid userId)
        {
            try
            {
                var users = await _friendService.GetFriendRequestStatus(userId);
                return Ok(users);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }
        //[HttpGet("requests/incoming")]
        //public async Task<IActionResult> GetIncomingRequests()
        //{
        //    var userId = GetUserId();
        //    var requests = await _friendRequestService.GetIncomingRequestsAsync(userId);
        //    return Ok(requests);
        //}

        //[HttpGet("requests/outgoing")]
        //public async Task<IActionResult> GetOutgoingRequests()
        //{
        //    var userId = GetUserId();
        //    var requests = await _friendRequestService.GetOutgoingRequestsAsync(userId);
        //    return Ok(requests);
        //}

        //[HttpPost("requests/respond")]
        //public async Task<IActionResult> RespondToRequest([FromQuery] int requestId, [FromQuery] bool accept)
        //{
        //    var userId = GetUserId();
        //    var success = await _friendRequestService.RespondToRequest(requestId, userId, accept);
        //    return success ? Ok() : BadRequest("Invalid request or already responded.");
        //}

        //[HttpGet]
        //public async Task<IActionResult> GetFriends()
        //{
        //    var userId = GetUserId();
        //    var friends = await _friendRequestService.GetFriendsAsync(userId);
        //    return Ok(friends);
        //}
    }
}
