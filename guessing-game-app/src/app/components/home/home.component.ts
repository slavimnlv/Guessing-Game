import { Component } from '@angular/core';
import { GameService } from '../../services/game.service';
import { Router } from '@angular/router';
import { Game } from '../../models/game.model';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  gameForm: FormGroup;

  constructor(private gameService: GameService, private router: Router) {
    this.gameForm = new FormGroup({
      rangeStart: new FormControl(1, [
        Validators.required,
        Validators.pattern(/^-?\d+$/),
      ]),
      rangeEnd: new FormControl(100, [
        Validators.required,
        Validators.pattern(/^-?\d+$/),
      ]),
    });
  }

  createGame(): void {
    if (this.gameForm.invalid) {
      console.log('Form is invalid');
      return;
    }

    const { rangeStart, rangeEnd } = this.gameForm.value;

    this.gameService.createGame(rangeStart, rangeEnd).subscribe({
      next: (game: Game) => {
        this.router.navigate(['/game', game.id]);
      },
      error: (error) =>
        console.log(error.error.message || 'Failed to create game.'),
    });
  }
}
