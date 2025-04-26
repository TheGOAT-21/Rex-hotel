import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileReservationsComponent } from './profile-reservations.component';

describe('ProfileReservationsComponent', () => {
  let component: ProfileReservationsComponent;
  let fixture: ComponentFixture<ProfileReservationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfileReservationsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfileReservationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
