using FizyoBlu.Backend.Entities;
using Microsoft.EntityFrameworkCore;

namespace FizyoBlu.Backend.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<User> Users => Set<User>();
    public DbSet<ServiceItem> Services => Set<ServiceItem>();
    public DbSet<Branch> Branches => Set<Branch>();
    public DbSet<TeamMember> TeamMembers => Set<TeamMember>();
    public DbSet<BlogPost> BlogPosts => Set<BlogPost>();
    public DbSet<Category> Categories => Set<Category>();
    public DbSet<MediaItem> Media => Set<MediaItem>();
    public DbSet<ContactMessage> ContactMessages => Set<ContactMessage>();
    public DbSet<SiteSetting> SiteSettings => Set<SiteSetting>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasIndex(u => u.Email).IsUnique();
        });

        modelBuilder.Entity<ServiceItem>(entity =>
        {
            entity.HasIndex(s => s.Slug).IsUnique();
        });

        modelBuilder.Entity<BlogPost>(entity =>
        {
            entity.HasIndex(b => b.Slug).IsUnique();
            entity.HasOne(b => b.Category)
                  .WithMany(c => c.BlogPosts)
                  .HasForeignKey(b => b.CategoryId)
                  .OnDelete(DeleteBehavior.SetNull);
        });

        modelBuilder.Entity<Category>(entity =>
        {
            entity.HasIndex(c => c.Slug).IsUnique();
        });
    }
}
