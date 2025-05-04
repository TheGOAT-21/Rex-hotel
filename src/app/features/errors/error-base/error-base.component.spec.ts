import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ErrorBaseComponent } from './error-base.component';

describe('ErrorBaseComponent', () => {
  let component: ErrorBaseComponent;
  let fixture: ComponentFixture<ErrorBaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ErrorBaseComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ErrorBaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
