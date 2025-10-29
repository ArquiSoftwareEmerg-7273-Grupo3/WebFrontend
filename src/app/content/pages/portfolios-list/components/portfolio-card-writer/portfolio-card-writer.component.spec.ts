import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PortfolioCardWriterComponentComponent } from './portfolio-card-writer.component';

describe('PortfolioCardWriterComponentComponent', () => {
  let component: PortfolioCardWriterComponentComponent;
  let fixture: ComponentFixture<PortfolioCardWriterComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PortfolioCardWriterComponentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PortfolioCardWriterComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
