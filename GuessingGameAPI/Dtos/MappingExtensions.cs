using GuessingGameAPI.Models;

namespace GuessingGameAPI.Dtos
{
    public static class MappingExtensions
    {
        public static GameDto ToDto(this Game game)
        {
            return new GameDto
            {
                Id = game.Id,
                RangeStart = game.RangeStart,
                RangeEnd = game.RangeEnd,
                MaxAttempts = game.MaxAttempts,
                Status = game.Status,
                Guesses = game.Guesses.Select(g => g.UserGuess).ToList()
            };
        }
    }
}
