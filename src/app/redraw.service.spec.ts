import { TestBed } from '@angular/core/testing';

import { RedrawService } from './redraw.service';

describe('RedrawService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RedrawService = TestBed.get(RedrawService);
    expect(service).toBeTruthy();
  });
});
