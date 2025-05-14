import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GuestInfoFormComponent } from './guest-info-form.component';

describe('GuestInfoFormComponent', () => {
  let component: GuestInfoFormComponent;
  let fixture: ComponentFixture<GuestInfoFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GuestInfoFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GuestInfoFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
