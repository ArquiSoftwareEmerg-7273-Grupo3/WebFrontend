import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PortfolioProfileComponent } from './portfolio-profile.component';

describe('PortfolioProfileComponent', () => {
  let component: PortfolioProfileComponent;
  let fixture: ComponentFixture<PortfolioProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PortfolioProfileComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PortfolioProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
