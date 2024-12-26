using GuessingGameAPI.Data;
using GuessingGameAPI.Dtos;
using GuessingGameAPI.Models;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddDbContext<GameDbContext>(opt => opt.UseSqlite("Data Source=Data/db/app.db"));

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors();

using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<GameDbContext>();
    dbContext.Database.EnsureCreated();
}

app.MapPost("/games", async (GameDbContext db, CreateGameDto dto) =>
{
    if (dto.RangeStart >= dto.RangeEnd) 
    {
        return Results.BadRequest(new { Message = "Invalid range." });
    }

    var targetNumber = new Random().Next(dto.RangeStart, dto.RangeEnd + 1);

    var game = new Game
    {
        RangeStart = dto.RangeStart,
        RangeEnd = dto.RangeEnd,
        TargetNumber = targetNumber
    };

    db.Games.Add(game);
    await db.SaveChangesAsync();

    return Results.Created($"/games/{game.Id}", game.ToDto());
});

app.MapGet("/games/{id}", async (GameDbContext db, Guid id) =>
{
    var game = await db.Games.Include(g => g.Guesses).FirstOrDefaultAsync(g => g.Id == id);
    if (game == null)
        return Results.NotFound(new { Message = "Game not found." });

    return Results.Ok(game.ToDto());
});

app.MapPost("/games/{id}/guess", async (GameDbContext db,Guid id, CreateGuessDto dto) =>
{
    var game = await db.Games.Include(g => g.Guesses).FirstOrDefaultAsync(g => g.Id == id);
    if (game == null)
        return Results.NotFound(new { Message = "Game not found." });

    if (game.Status != GameState.Ongoing)
        return Results.BadRequest(new { Message = "Game is not active." });

    if (dto.UserGuess < game.RangeStart || dto.UserGuess > game.RangeEnd)
    {
        return Results.BadRequest(new { Message = $"Guess must be between {game.RangeStart} and {game.RangeEnd}." });
    }

    var guess = new Guess
    {
        GameId = id,
        UserGuess = dto.UserGuess,
    };

    game.Guesses.Add(guess);

    if (dto.UserGuess == game.TargetNumber)
    {
        game.Status = GameState.Won;
    }
    else if (game.Guesses.Count >= game.MaxAttempts)
    {
        game.Status = GameState.Lost;
    }

    await db.SaveChangesAsync();

    return Results.Ok(game.ToDto());
});


app.Run();

