import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OptionsIconComponent } from './options-icon.component';

describe('OptionsIconComponent', () => {
  let component: OptionsIconComponent;
  let fixture: ComponentFixture<OptionsIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OptionsIconComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OptionsIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
