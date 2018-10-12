import { TestBed } from '@angular/core/testing';

import { CharacterMapService } from './character-map.service';

describe('CharacterMapService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CharacterMapService = TestBed.get(CharacterMapService);
    expect(service).toBeTruthy();
  });
});
