import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OffersListComponentComponent } from './offers-list-component.component';

describe('OffersListComponentComponent', () => {
  let component: OffersListComponentComponent;
  let fixture: ComponentFixture<OffersListComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OffersListComponentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OffersListComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
