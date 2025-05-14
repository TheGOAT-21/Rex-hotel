import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeaturedRoomsComponent } from './featured-rooms.component';

describe('FeaturedRoomsComponent', () => {
  let component: FeaturedRoomsComponent;
  let fixture: ComponentFixture<FeaturedRoomsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeaturedRoomsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FeaturedRoomsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
