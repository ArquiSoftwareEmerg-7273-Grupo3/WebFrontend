import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateIlustrationComponent } from './create-ilustration.component';

describe('CreateIlustrationComponent', () => {
  let component: CreateIlustrationComponent;
  let fixture: ComponentFixture<CreateIlustrationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateIlustrationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateIlustrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
