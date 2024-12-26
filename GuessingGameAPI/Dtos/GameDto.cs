using GuessingGameAPI.Models;

namespace GuessingGameAPI.Dtos
{
    public class GameDto
    {
        public Guid Id { get; set; }
        public int RangeStart { get; set; }
        public int RangeEnd { get; set; }
        public int MaxAttempts { get; set; }
        public GameState Status { get; set; }
        public List<int> Guesses { get; set; } = new();
    }
}
