import { TestBed } from '@angular/core/testing';

import { OptionsIconService } from './options-icon.service';

describe('OptionsIconService', () => {
  let service: OptionsIconService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OptionsIconService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
