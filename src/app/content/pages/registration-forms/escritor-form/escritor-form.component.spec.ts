import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EscritorFormComponent } from './escritor-form.component';

describe('EscritorFormComponent', () => {
  let component: EscritorFormComponent;
  let fixture: ComponentFixture<EscritorFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EscritorFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EscritorFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
