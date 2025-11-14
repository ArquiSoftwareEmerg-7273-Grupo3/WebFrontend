import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PortfolioCardWriterComponent } from './portfolio-card-writer.component';

describe('PortfolioCardWriterComponentComponent', () => {
  let component: PortfolioCardWriterComponent;
  let fixture: ComponentFixture<PortfolioCardWriterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PortfolioCardWriterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PortfolioCardWriterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
