import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyPostulationsComponent } from './my-postulations.component';

describe('MyPostulationsComponent', () => {
  let component: MyPostulationsComponent;
  let fixture: ComponentFixture<MyPostulationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyPostulationsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyPostulationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
