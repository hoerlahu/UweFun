import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WelcomePleaseLoginComponent } from './welcome-please-login.component';

describe('WelcomePleaseLoginComponent', () => {
  let component: WelcomePleaseLoginComponent;
  let fixture: ComponentFixture<WelcomePleaseLoginComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WelcomePleaseLoginComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WelcomePleaseLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
