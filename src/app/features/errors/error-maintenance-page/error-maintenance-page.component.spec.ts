import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ErrorMaintenancePageComponent } from './error-maintenance-page.component';

describe('ErrorMaintenancePageComponent', () => {
  let component: ErrorMaintenancePageComponent;
  let fixture: ComponentFixture<ErrorMaintenancePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ErrorMaintenancePageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ErrorMaintenancePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
