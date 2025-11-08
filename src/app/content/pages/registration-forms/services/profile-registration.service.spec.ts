import { TestBed } from '@angular/core/testing';

import { ProfileRegistrationService } from './profile-registration.service';

describe('ProfileRegistrationService', () => {
  let service: ProfileRegistrationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProfileRegistrationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
