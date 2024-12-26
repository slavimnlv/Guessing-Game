namespace GuessingGameAPI.Models
{
    public class Game
    {
        public Guid Id { get; set; }
        public int TargetNumber { get; set; }
        public int RangeStart { get; set; }
        public int RangeEnd { get; set; }
        public int MaxAttempts { get; set; } = 3;
        public GameState Status { get; set; } = GameState.Ongoing;

        public List<Guess> Guesses { get; set; } = new();
    }
}