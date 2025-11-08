import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessMiniVentanaComponent } from './business-mini-ventana.component';

describe('BusinessMiniVentanaComponent', () => {
  let component: BusinessMiniVentanaComponent;
  let fixture: ComponentFixture<BusinessMiniVentanaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BusinessMiniVentanaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BusinessMiniVentanaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
