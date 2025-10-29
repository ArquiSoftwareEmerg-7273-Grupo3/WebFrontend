import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IllustrationCardComponent } from './illustration-card.component';

describe('IllustrationCardComponent', () => {
  let component: IllustrationCardComponent;
  let fixture: ComponentFixture<IllustrationCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IllustrationCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IllustrationCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
