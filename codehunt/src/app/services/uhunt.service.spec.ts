import { TestBed } from '@angular/core/testing';

import { UhuntService } from './uhunt.service';

describe('UhuntService', () => {
  let service: UhuntService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UhuntService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
