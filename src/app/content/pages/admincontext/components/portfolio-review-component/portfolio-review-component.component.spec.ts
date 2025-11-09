import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PortfolioReviewComponentComponent } from './portfolio-review-component.component';

describe('PortfolioReviewComponentComponent', () => {
  let component: PortfolioReviewComponentComponent;
  let fixture: ComponentFixture<PortfolioReviewComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PortfolioReviewComponentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PortfolioReviewComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
