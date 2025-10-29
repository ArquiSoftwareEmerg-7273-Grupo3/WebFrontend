import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WriterCardComponent } from './writer-card.component';

describe('WriterCardComponent', () => {
  let component: WriterCardComponent;
  let fixture: ComponentFixture<WriterCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WriterCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WriterCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
