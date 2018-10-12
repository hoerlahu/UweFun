import { CharacterMapService } from './../../character-map.service';
import { PersistanceService } from 'src/app/persistance.service';
import { Component, OnInit, OnChanges, SimpleChanges, ApplicationRef } from '@angular/core';

@Component({
  selector: 'app-roleplay-character-map',
  templateUrl: './roleplay-character-map.component.html',
  styleUrls: ['./roleplay-character-map.component.css']
})
export class RoleplayCharacterMapComponent implements OnInit {

  currentMaps: Array<string> = new Array<string>();

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

  onClick() {
    console.log(this.currentMaps);
  }

}
