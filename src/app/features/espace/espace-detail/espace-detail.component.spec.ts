import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EspaceDetailComponent } from './espace-detail.component';

describe('EspaceDetailComponent', () => {
  let component: EspaceDetailComponent;
  let fixture: ComponentFixture<EspaceDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EspaceDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EspaceDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
