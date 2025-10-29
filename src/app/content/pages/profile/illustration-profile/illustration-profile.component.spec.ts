import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IllustrationProfileComponent } from './illustration-profile.component';

describe('IllustrationProfileComponent', () => {
  let component: IllustrationProfileComponent;
  let fixture: ComponentFixture<IllustrationProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IllustrationProfileComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IllustrationProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
