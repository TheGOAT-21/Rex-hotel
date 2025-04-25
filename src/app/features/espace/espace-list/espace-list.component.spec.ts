import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EspaceListComponent } from './espace-list.component';

describe('EspaceListComponent', () => {
  let component: EspaceListComponent;
  let fixture: ComponentFixture<EspaceListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EspaceListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EspaceListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
