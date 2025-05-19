import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReservationCtaComponent } from './reservation-cta.component';

describe('ReservationCtaComponent', () => {
  let component: ReservationCtaComponent;
  let fixture: ComponentFixture<ReservationCtaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReservationCtaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReservationCtaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
