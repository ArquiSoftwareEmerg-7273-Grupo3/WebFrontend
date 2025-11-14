import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HireStaffComponent } from './hire-staff.component';

describe('HireStaffComponent', () => {
  let component: HireStaffComponent;
  let fixture: ComponentFixture<HireStaffComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HireStaffComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HireStaffComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
