import { Component, OnInit } from '@angular/core';
import { Game } from '../../models/game.model';
import { GameService } from '../../services/game.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { GameStatus } from '../../models/status.enum';

@Component({
  selector: 'app-game',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss',
})
export class GameComponent implements OnInit {
  game: Game | null = null;
  message: string = '';
  gameStatus = GameStatus;
  guess!: FormControl;

  constructor(
    private gameService: GameService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const gameId = this.route.snapshot.paramMap.get('id');
    if (gameId) {
      this.loadGame(gameId);
    } else {
      this.router.navigate(['/']);
    }
  }

  makeGuess(): void {
    if (
      !this.game ||
      this.game.guesses.length >= 3 ||
      this.game.status !== GameStatus.Ongoing ||
      this.guess.invalid
    ) {
      console.log('Form is invalid.');
      return;
    }

    this.gameService.makeGuess(this.game.id, this.guess.value).subscribe({
      next: (game) => {
        this.game = game;
        this.updateMessage();
        this.checkInput();
      },
      error: (error) =>
        console.log(error.error.message || 'Failed to make guess.'),
    });
  }

  startNewGame(): void {
    this.router.navigate(['/']);
  }

  private loadGame(gameId: string): void {
    this.gameService.getGame(gameId).subscribe({
      next: (game) => {
        this.game = game;
        this.updateMessage();
        this.initializeGuessControl();
        this.checkInput();
      },
      error: (error) => {
        console.log(error.error.message || 'Game not found.');
        this.router.navigate(['/']);
      },
    });
  }

  private updateMessage(): void {
    if (!this.game) {
      return;
    }

    switch (this.game.status) {
      case GameStatus.Ongoing:
        this.message = `Game is ongoing. You have ${
          3 - this.game.guesses.length
        } attempts left.`;
        break;
      case GameStatus.Won:
        this.message = 'Congratulations, you won!';
        break;
      case GameStatus.Lost:
        this.message = `Game over, you lost! You've used all your attempts.`;
        break;
      default:
        this.message = 'Game Over.';
    }
  }

  private initializeGuessControl(): void {
    if (this.game) {
      this.guess = new FormControl(this.game.rangeStart, [
        Validators.required,
        Validators.min(this.game.rangeStart),
        Validators.max(this.game.rangeEnd),
        Validators.pattern(/^-?\d+$/),
      ]);
    }
  }

  private checkInput(): void {
    if (this.game && this.game.status !== GameStatus.Ongoing) {
      this.guess.disable();
      this.guess.setValue(null);
    }
  }
}
