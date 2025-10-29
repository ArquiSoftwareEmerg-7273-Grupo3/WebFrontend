import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookProfileComponent } from './book-profile.component';

describe('BookProfileComponent', () => {
  let component: BookProfileComponent;
  let fixture: ComponentFixture<BookProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookProfileComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BookProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
