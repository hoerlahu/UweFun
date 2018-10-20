import { TestBed } from '@angular/core/testing';

import { ShouldEditCharMapService } from './should-edit-char-map.service';

describe('ShouldEditCharMapService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ShouldEditCharMapService = TestBed.get(ShouldEditCharMapService);
    expect(service).toBeTruthy();
  });
});
