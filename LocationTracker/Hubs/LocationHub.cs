using LocationTracker.Data;
using LocationTracker.Dtos;
using LocationTracker.Models;
using Microsoft.AspNetCore.SignalR;
using System.Security.Claims;

namespace LocationTracker.Hubs;

public class LocationHub:Hub
{
    private readonly AppDbContext _context;
    public LocationHub(AppDbContext context)
    {
        _context = context;
    }
    public override Task OnConnectedAsync()
    {
        string userId = Context.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value!;
        string username = Context.User?.FindFirst(ClaimTypes.Name)?.Value!;
        Console.WriteLine($"User {username} ,id: {userId} with connectionID: {Context.ConnectionId}");
        return base.OnConnectedAsync();
    }
    public async Task SendLocation(double latitude, double longitude)
    {
        try
        {
            string userId = Context.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value!;
            if (userId == null) return;
            string userName = Context.User?.FindFirst(ClaimTypes.Name)?.Value!;
            Guid userGuid = Guid.Parse(userId);
            var now = DateTime.UtcNow;
            var location = await _context.UserLocations.FindAsync(userGuid);
            if (location == null)
            {
                location = new UserLocation
                {
                    UserId = userGuid,
                    Latitude = latitude,
                    Longitude = longitude,
                    LastUpdated = now
                };
                _context.UserLocations.Add(location);
            }
            else
            {
                location.Latitude = latitude;
                location.Longitude = longitude;
                location.LastUpdated = now;
            }
            await _context.SaveChangesAsync();
            await Clients.All.SendAsync("FriendsLocationsUpdated", new LocationUpdateSignalResponse
            {
                UserId = userId,
                UserName = userName,
                Coordinate = new Coordinate
                {
                    Latitude = latitude,
                    Longitude = longitude,
                },
                LastUpdated = now
            });
            Console.WriteLine($"FriendsLocationsUpdated : ${userName} - {latitude} {longitude}");
        }
        catch (Exception ex) 
        {
            Console.WriteLine(ex.Message);
        }
    }
}
