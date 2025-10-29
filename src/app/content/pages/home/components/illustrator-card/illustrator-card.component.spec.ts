import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IllustratorCardComponent } from './illustrator-card.component';

describe('IllustratorCardComponent', () => {
  let component: IllustratorCardComponent;
  let fixture: ComponentFixture<IllustratorCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IllustratorCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IllustratorCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
