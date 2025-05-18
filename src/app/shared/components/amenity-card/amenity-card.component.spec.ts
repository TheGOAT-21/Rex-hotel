import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AmenityCardComponent } from './amenity-card.component';

describe('AmenityCardComponent', () => {
  let component: AmenityCardComponent;
  let fixture: ComponentFixture<AmenityCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AmenityCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AmenityCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
