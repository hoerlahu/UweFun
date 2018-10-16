import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditCharacterMapComponent } from './edit-character-map.component';

describe('EditCharacterMapComponent', () => {
  let component: EditCharacterMapComponent;
  let fixture: ComponentFixture<EditCharacterMapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditCharacterMapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditCharacterMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
