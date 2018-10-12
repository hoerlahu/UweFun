import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerateNewRoleplayCharacterMapComponent } from './generate-new-roleplay-character-map.component';

describe('GenerateNewRoleplayCharacterMapComponent', () => {
  let component: GenerateNewRoleplayCharacterMapComponent;
  let fixture: ComponentFixture<GenerateNewRoleplayCharacterMapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GenerateNewRoleplayCharacterMapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GenerateNewRoleplayCharacterMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
