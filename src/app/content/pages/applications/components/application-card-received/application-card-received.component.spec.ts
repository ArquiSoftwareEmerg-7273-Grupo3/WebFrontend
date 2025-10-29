import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicationCardReceivedComponent } from './application-card-received.component';

describe('ApplicationCardReceivedComponent', () => {
  let component: ApplicationCardReceivedComponent;
  let fixture: ComponentFixture<ApplicationCardReceivedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApplicationCardReceivedComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApplicationCardReceivedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
