import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AmenityBadgeComponent } from './amenity-badge.component';

describe('AmenityBadgeComponent', () => {
  let component: AmenityBadgeComponent;
  let fixture: ComponentFixture<AmenityBadgeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AmenityBadgeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AmenityBadgeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
