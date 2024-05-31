using Microsoft.EntityFrameworkCore;
using TreningApp.Models;

namespace TreningApp.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<User> Users { get; set; }
        public DbSet<Training> Trainings { get; set; }

        public DbSet<Exercises> Exercises { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
                optionsBuilder.UseSqlite("Data Source=trainingTracker.db");
            }
        }
    }
}
