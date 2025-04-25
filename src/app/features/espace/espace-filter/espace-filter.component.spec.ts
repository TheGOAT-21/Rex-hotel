import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EspaceFilterComponent } from './espace-filter.component';

describe('EspaceFilterComponent', () => {
  let component: EspaceFilterComponent;
  let fixture: ComponentFixture<EspaceFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EspaceFilterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EspaceFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
