import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WriterIndividualComponent } from './writer-individual.component';

describe('WriterIndividualComponent', () => {
  let component: WriterIndividualComponent;
  let fixture: ComponentFixture<WriterIndividualComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WriterIndividualComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WriterIndividualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
