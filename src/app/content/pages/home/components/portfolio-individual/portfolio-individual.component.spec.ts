import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PortfolioIndividualComponent } from './portfolio-individual.component';

describe('PortfolioIndividualComponent', () => {
  let component: PortfolioIndividualComponent;
  let fixture: ComponentFixture<PortfolioIndividualComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PortfolioIndividualComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PortfolioIndividualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
