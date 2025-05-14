import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoomTypeBadgeComponent } from './room-type-badge.component';

describe('RoomTypeBadgeComponent', () => {
  let component: RoomTypeBadgeComponent;
  let fixture: ComponentFixture<RoomTypeBadgeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoomTypeBadgeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RoomTypeBadgeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
