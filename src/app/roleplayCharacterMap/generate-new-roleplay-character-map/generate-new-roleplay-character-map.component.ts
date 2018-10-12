import { CharacterMapService } from './../../character-map.service';
import { Component, OnInit } from '@angular/core';
import { PersistanceService } from 'src/app/persistance.service';


@Component({
  selector: 'app-generate-new-roleplay-character-map',
  templateUrl: './generate-new-roleplay-character-map.component.html',
  styleUrls: ['./generate-new-roleplay-character-map.component.css']
})
export class GenerateNewRoleplayCharacterMapComponent implements OnInit {

  constructor(private characterMapService: CharacterMapService) { }

  ngOnInit() {
  }

  onGenerateClicked() {
    const inputElement = (<HTMLInputElement>document.getElementById('scenarioName'));
    const scenarioName: string = inputElement.value;
    inputElement.value = '';
    this.characterMapService.createNewCharacterMap(scenarioName);
  }

}
