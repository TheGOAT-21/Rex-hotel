import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AmenitiesPageComponent } from './amenities-page.component';

describe('AmenitiesPageComponent', () => {
  let component: AmenitiesPageComponent;
  let fixture: ComponentFixture<AmenitiesPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AmenitiesPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AmenitiesPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
