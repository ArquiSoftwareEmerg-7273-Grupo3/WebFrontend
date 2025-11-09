import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RolesManagmentComponentComponent } from './roles-managment-component.component';

describe('RolesManagmentComponentComponent', () => {
  let component: RolesManagmentComponentComponent;
  let fixture: ComponentFixture<RolesManagmentComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RolesManagmentComponentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RolesManagmentComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
