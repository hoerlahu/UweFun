import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RoleplayCharacterMapComponent } from './roleplay-character-map.component';

describe('RoleplayCharacterMapComponent', () => {
  let component: RoleplayCharacterMapComponent;
  let fixture: ComponentFixture<RoleplayCharacterMapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RoleplayCharacterMapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoleplayCharacterMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
