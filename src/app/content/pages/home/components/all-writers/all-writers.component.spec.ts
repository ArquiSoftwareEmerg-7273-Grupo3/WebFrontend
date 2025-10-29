import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllWritersComponent } from './all-writers.component';

describe('AllWritersComponent', () => {
  let component: AllWritersComponent;
  let fixture: ComponentFixture<AllWritersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllWritersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllWritersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
