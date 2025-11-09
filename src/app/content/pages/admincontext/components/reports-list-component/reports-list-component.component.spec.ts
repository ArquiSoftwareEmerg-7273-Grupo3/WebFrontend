import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportsListComponentComponent } from './reports-list-component.component';

describe('ReportsListComponentComponent', () => {
  let component: ReportsListComponentComponent;
  let fixture: ComponentFixture<ReportsListComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportsListComponentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportsListComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
