import { ComponentFixture, TestBed, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { TileComponent } from '../tile/tile.component';

import { BoardComponent } from './board.component';

describe('BoardComponent', () => {
  let component: BoardComponent;
  let fixture: ComponentFixture<BoardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BoardComponent, TileComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    spyOn(component, 'newGame').and.callThrough();
    spyOn(component, 'onMove').and.callThrough();
    spyOn(component, 'validate').and.callThrough();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should start a game', () => {
    expect(component.player).toBe('X');
    expect(component.winner).toBe(false);
    expect(component.grid.length).toBe(9);
    expect(component.grid.every(x => x === null)).toBe(true);
  });

  it('should start new game', () => {
    component.onMove(0);
    expect(component.onMove).toHaveBeenCalled();
    expect(component.player).toBe('O');
    component.newGame();
    expect(component.newGame).toHaveBeenCalled();
  });

  describe('move', () => {
    const testingPosition = 4;

    it('should execute move on a valid play', () => {
      const allTiles = fixture.debugElement.queryAll(By.directive(TileComponent));
      const aTile = allTiles[testingPosition];
      expect(allTiles.length).toBe(9)
      expect(aTile).not.toBeUndefined();
      expect(aTile.nativeElement.textContent).toBe('');

      aTile.nativeElement.querySelector('button').click();
      expect(component.onMove).toHaveBeenCalledOnceWith(testingPosition);
      expect(component.grid[testingPosition]).toBe('X');
      expect(component.player).toBe('O');
      expect(component.winner).toBe(false);
    });

    it('should insert play in grid on a valid move', () => {
      component.onMove(testingPosition);
      expect(component.onMove).toHaveBeenCalledOnceWith(testingPosition);
      expect(component.grid[testingPosition]).toBe('X');

      const anotherTestPosition = 6;
      component.onMove(anotherTestPosition);
      expect(component.onMove).toHaveBeenCalledWith(anotherTestPosition);
      expect(component.grid[anotherTestPosition]).toBe('O');
    });

    it('should not insert play in grid on an invalid move', () => {
      component.onMove(testingPosition);
      component.onMove(testingPosition);
      expect(component.onMove).not.toHaveBeenCalledOnceWith(testingPosition);
      expect(component.grid[testingPosition]).not.toBe('O');
    });

    it('should not insert play when game is won', () => {
      component.onMove(0);// X
      component.onMove(3);// O
      component.onMove(1);// X
      component.onMove(4);// O
      component.onMove(2);// X
      component.onMove(5);// O
      expect(component.onMove).toHaveBeenCalledTimes(6);
      expect(component.grid[5]).not.toEqual('O');
      expect(component.grid[5]).toBeNull();
      expect(component.player).toBe('X');
      expect(component.winner).toBe(true);
    });
  });

  describe('validate', () => {
    function validateTestHelper(plays: number[][]) {
      plays.forEach((play: number[]) => {
        const previousMoves = [...play];
        play.forEach((position: number) => {
          component.onMove(position);
          const nextMove = getRandomPlayOutsideOfArray(previousMoves);
          previousMoves.push(nextMove);
          component.onMove(nextMove);
        });

        expect(component.winner).toBe(true);
        expect(component.player).toBe('X');
      });
    }

    it('should find horizontal winner', () => {
      validateTestHelper([[0, 1, 2]/*, [3, 4, 5], [6, 7, 8]*/]);
    });

    it('should find vertical winner', () => {
      validateTestHelper([[0, 3, 6], [1, 4, 7], [2, 5, 8]]);
    });

    it('should find diagonal winner', () => {
      validateTestHelper([[0, 4, 8], [2, 4, 6]]);
    });
  })
});

/**
 * Returns a play outside played moves.
 * @param arr
 */
function getRandomPlayOutsideOfArray(arr: number[]): number {
  let position;
  do {
    position = Math.floor(Math.random() * 9);
  } while (arr.indexOf(position) >= 0)
  return position;
}
