import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MiniTutorialComponent } from './mini-tutorial.component';

describe('MiniTutorialComponent', () => {
  let component: MiniTutorialComponent;
  let fixture: ComponentFixture<MiniTutorialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MiniTutorialComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MiniTutorialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
