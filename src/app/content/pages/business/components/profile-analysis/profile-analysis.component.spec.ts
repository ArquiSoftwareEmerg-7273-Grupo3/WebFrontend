import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileAnalysisComponent } from './profile-analysis.component';

describe('ProfileAnalysisComponent', () => {
  let component: ProfileAnalysisComponent;
  let fixture: ComponentFixture<ProfileAnalysisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfileAnalysisComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfileAnalysisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
