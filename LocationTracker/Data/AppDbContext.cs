using LocationTracker.Models;
using Microsoft.EntityFrameworkCore;

namespace LocationTracker.Data;

public class AppDbContext : DbContext
{
    public DbSet<User> Users { get; set; }
    public DbSet<UserLocation> UserLocations { get; set; }
    public DbSet<FriendRequest> FriendRequests { get; set; }
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<User>(entity =>
        {
            entity.HasIndex(u => u.UserName).IsUnique();
        });
        modelBuilder.Entity<UserLocation>(entity =>
        {
            entity.HasKey(ul => ul.UserId);
            entity.HasOne(ul => ul.User)
                  .WithOne()
                  .HasForeignKey<UserLocation>(ul => ul.UserId);
        });
        modelBuilder.Entity<FriendRequest>(entity => {
            entity.HasKey(fr =>fr.Id);

            entity.HasOne(fr => fr.Sender)
                .WithMany(u => u.SentFriendRequests)
                .HasForeignKey(fr => fr.SenderId)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(fr => fr.Receiver)
                .WithMany(u => u.ReceivedFriendRequests)
                .HasForeignKey(fr => fr.ReceiverId)
                .OnDelete(DeleteBehavior.Restrict);
            
            entity.HasIndex(fr => new { fr.SenderId, fr.ReceiverId })
        .   IsUnique();
        });
        base.OnModelCreating(modelBuilder);
    }
}
