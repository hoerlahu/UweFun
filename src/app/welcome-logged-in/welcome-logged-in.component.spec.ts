import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WelcomeLoggedInComponent } from './welcome-logged-in.component';

describe('WelcomeLoggedInComponent', () => {
  let component: WelcomeLoggedInComponent;
  let fixture: ComponentFixture<WelcomeLoggedInComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WelcomeLoggedInComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WelcomeLoggedInComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
