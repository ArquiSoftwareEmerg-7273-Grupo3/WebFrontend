import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllIllustratorsComponent } from './all-illustrators.component';

describe('AllIllustratorsComponent', () => {
  let component: AllIllustratorsComponent;
  let fixture: ComponentFixture<AllIllustratorsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllIllustratorsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllIllustratorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
