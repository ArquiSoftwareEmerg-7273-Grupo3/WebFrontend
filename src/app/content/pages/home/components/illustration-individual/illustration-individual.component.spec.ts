import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IllustrationIndividualComponent } from './illustration-individual.component';

describe('IllustrationIndividualComponent', () => {
  let component: IllustrationIndividualComponent;
  let fixture: ComponentFixture<IllustrationIndividualComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IllustrationIndividualComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IllustrationIndividualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
