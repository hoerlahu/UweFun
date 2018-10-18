import { CharacterMapService } from './../../character-map.service';
import { Component, OnInit, ApplicationRef } from '@angular/core';
import { CharacterMap } from '../CharacterMap';

@Component({
  selector: 'app-roleplay-character-map',
  templateUrl: './roleplay-character-map.component.html',
  styleUrls: ['./roleplay-character-map.component.css']
})
export class RoleplayCharacterMapComponent implements OnInit {

  currentMaps: Array<CharacterMap> = new Array<CharacterMap>();

  constructor(private charMapService: CharacterMapService, private appRef: ApplicationRef) {
  }

  ngOnInit() {
    this.charMapService.getExistingCharacterMaps().then( resolve => {
      this.currentMaps = resolve;
      this.appRef.tick();
    });
    this.charMapService.existingCharacterMapsSubject.subscribe(
      newMaps => {
        this.currentMaps = newMaps;
        this.appRef.tick();
      }
    );
  }

  onMapClick(characterMap: CharacterMap) {
    this.charMapService.editCharacterMap(characterMap);
  }

}
