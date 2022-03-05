import { Component, OnInit } from '@angular/core';

const GRID_DIMENSION = 3;
@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit {
  grid: string[];
  player: 'X' | 'O';
  winner: boolean;
  isDraw: boolean;

  ngOnInit(): void {
    this.newGame()
  }

  /**
   * Starts a new game
   */
  newGame(): void {
    this.player = 'X';
    this.winner = false;
    this.isDraw = false;
    this.grid = Array(GRID_DIMENSION ** 2).fill(null);
  }

  /**
   * Execute player move
   * @param position
   */
  onMove(position: number): void {
    // Do not allow plays when a player won
    if (this.winner) return;

    // Player cannot move on played position
    if (this.grid[position]) return;

    this.grid[position] = this.player;
    this.winner = this.validate();

    if (!this.winner) {
      this.player = this.player === 'X' ? 'O' : 'X';
      this.isDraw = !this.grid.some((x: string) => x === null);
    }
  }

  /**
   * This function validates the board for a winning combination.
   *
   * NOTE: In a real world situation and to keep the code as simple as possible,
   *       I would have created an array of winning combination as there are only 8 possible scenarios.
   */
  validate(): boolean {
    let rows: string[][] = [];
    for (let i = 0; i < this.grid.length; i += GRID_DIMENSION) {
      rows.push(this.grid.slice(i, GRID_DIMENSION + i));
    }

    // Search for a winning row
    if (rows.some((row: string[]) => row.every((x: string) => x && x === row[0]))) {
      return true;
    }

    // Search for a winning column
    const cols = [...Array(GRID_DIMENSION).keys()].map(c => rows.map(x => x[c]));
    if (cols.some(col => col.every(x => x && x === col[0]))) {
      return true;
    }

    const diagonals = [
      rows.map((row: string[], i: number) => row[i]),
      rows.map((row: string[], i: number) => row[GRID_DIMENSION-i-1])
    ];

    // Search for a winning diagonal
    return diagonals.some((diagonal: string[]) => diagonal.every(x => x && x === diagonal[0]));
  }
}
