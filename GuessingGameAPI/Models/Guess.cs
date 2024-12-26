namespace GuessingGameAPI.Models
{
    public class Guess
    {
        public Guid Id { get; set; }
        public int UserGuess { get; set; }
        public Guid GameId { get; set; }
    }
}
