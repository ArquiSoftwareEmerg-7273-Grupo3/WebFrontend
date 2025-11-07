import { TestBed } from '@angular/core/testing';

import { MiniTutorialService } from './mini-tutorial.service';

describe('MiniTutorialService', () => {
  let service: MiniTutorialService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MiniTutorialService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
