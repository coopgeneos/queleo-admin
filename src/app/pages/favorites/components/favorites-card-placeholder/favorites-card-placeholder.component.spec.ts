import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FavoritesCardPlaceholderComponent } from './favorites-card-placeholder.component';

describe('FavoritesCardPlaceholderComponent', () => {
  let component: FavoritesCardPlaceholderComponent;
  let fixture: ComponentFixture<FavoritesCardPlaceholderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FavoritesCardPlaceholderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FavoritesCardPlaceholderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
