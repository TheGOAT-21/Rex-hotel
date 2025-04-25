import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsManagerComponent } from './settings-manager.component';

describe('SettingsManagerComponent', () => {
  let component: SettingsManagerComponent;
  let fixture: ComponentFixture<SettingsManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SettingsManagerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SettingsManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
