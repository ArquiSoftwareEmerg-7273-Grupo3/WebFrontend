import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IllustratorIndividualComponent } from './illustrator-individual.component';

describe('IllustratorIndividualComponent', () => {
  let component: IllustratorIndividualComponent;
  let fixture: ComponentFixture<IllustratorIndividualComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IllustratorIndividualComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IllustratorIndividualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
