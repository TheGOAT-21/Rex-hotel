import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectedRoomSummaryComponent } from './selected-room-summary.component';

describe('SelectedRoomSummaryComponent', () => {
  let component: SelectedRoomSummaryComponent;
  let fixture: ComponentFixture<SelectedRoomSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectedRoomSummaryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectedRoomSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
