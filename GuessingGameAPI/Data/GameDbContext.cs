using GuessingGameAPI.Models;
using Microsoft.EntityFrameworkCore;

namespace GuessingGameAPI.Data
{
    public class GameDbContext : DbContext
    {
        public DbSet<Game> Games { get; set; } = null!;
        public DbSet<Guess> Guesses { get; set; } = null!;

        public GameDbContext(DbContextOptions<GameDbContext> options) : base(options) { }

    }
}
