import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable } from 'rxjs';
import { Game } from '../models/game.model';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  private apiUrl = 'https://localhost:7035';

  constructor(private http: HttpClient) {}

  createGame(rangeStart: number, rangeEnd: number): Observable<Game> {
    return this.http.post<Game>(`${this.apiUrl}/games`, {
      rangeStart,
      rangeEnd,
    });
  }

  getGame(gameId: string): Observable<Game> {
    return this.http.get<Game>(`${this.apiUrl}/games/${gameId}`);
  }

  makeGuess(gameId: string, guess: number): Observable<Game> {
    return this.http.post<Game>(`${this.apiUrl}/games/${gameId}/guess`, {
      userGuess: guess,
    });
  }
}
