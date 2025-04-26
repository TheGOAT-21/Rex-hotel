import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReservationCancelComponent } from './reservation-cancel.component';

describe('ReservationCancelComponent', () => {
  let component: ReservationCancelComponent;
  let fixture: ComponentFixture<ReservationCancelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReservationCancelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReservationCancelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
