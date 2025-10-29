import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllIllustrationsComponent } from './all-illustrations.component';

describe('AllIllustrationsComponent', () => {
  let component: AllIllustrationsComponent;
  let fixture: ComponentFixture<AllIllustrationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllIllustrationsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllIllustrationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
