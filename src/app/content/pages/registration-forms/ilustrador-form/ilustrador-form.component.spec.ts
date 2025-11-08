import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IlustradorFormComponent } from './ilustrador-form.component';

describe('IlustradorFormComponent', () => {
  let component: IlustradorFormComponent;
  let fixture: ComponentFixture<IlustradorFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IlustradorFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IlustradorFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
