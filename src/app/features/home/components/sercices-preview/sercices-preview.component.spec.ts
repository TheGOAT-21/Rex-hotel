import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SercicesPreviewComponent } from './sercices-preview.component';

describe('SercicesPreviewComponent', () => {
  let component: SercicesPreviewComponent;
  let fixture: ComponentFixture<SercicesPreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SercicesPreviewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SercicesPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
