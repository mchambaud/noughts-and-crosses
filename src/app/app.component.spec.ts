import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { BoardComponent } from './board/board.component';
import { TileComponent } from './tile/tile.component';

describe('AppComponent', () => {
  let app: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        BoardComponent,
        TileComponent
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    app = fixture.componentInstance;
  });

  it('should create the app', () => {
    expect(app).toBeTruthy();
  });

  it(`should have as title 'Noughts & Crosses'`, () => {
    expect(app.title).toEqual('Noughts & Crosses');
  });

  it('should render title', () => {
    fixture.detectChanges();
    const title = fixture.nativeElement.querySelector('h1') as HTMLElement;
    expect(title?.textContent).toContain('Noughts & Crosses');
  });
});
