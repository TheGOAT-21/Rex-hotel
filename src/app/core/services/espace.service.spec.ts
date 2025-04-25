import { TestBed } from '@angular/core/testing';

import { EspaceService } from './espace.service';

describe('EspaceService', () => {
  let service: EspaceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EspaceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
