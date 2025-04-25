import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EspaceManagementComponent } from './espace-management.component';

describe('EspaceManagementComponent', () => {
  let component: EspaceManagementComponent;
  let fixture: ComponentFixture<EspaceManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EspaceManagementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EspaceManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
