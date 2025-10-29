import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectIndividualComponent } from './project-individual.component';

describe('ProjectIndividualComponent', () => {
  let component: ProjectIndividualComponent;
  let fixture: ComponentFixture<ProjectIndividualComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectIndividualComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectIndividualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
