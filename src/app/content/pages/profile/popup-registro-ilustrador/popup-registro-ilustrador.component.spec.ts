import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupRegistroIlustradorComponent } from './popup-registro-ilustrador.component';

describe('PopupRegistroIlustradorComponent', () => {
  let component: PopupRegistroIlustradorComponent;
  let fixture: ComponentFixture<PopupRegistroIlustradorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PopupRegistroIlustradorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PopupRegistroIlustradorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
