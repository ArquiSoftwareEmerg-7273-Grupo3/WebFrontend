import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookIndividualComponent } from './book-individual.component';

describe('BookIndividualComponent', () => {
  let component: BookIndividualComponent;
  let fixture: ComponentFixture<BookIndividualComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookIndividualComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BookIndividualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
