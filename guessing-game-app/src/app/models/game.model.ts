import { GameStatus } from './status.enum';

export interface Game {
  id: string;
  rangeStart: number;
  rangeEnd: number;
  maxAttempts: number;
  status: GameStatus;
  guesses: number[];
}
