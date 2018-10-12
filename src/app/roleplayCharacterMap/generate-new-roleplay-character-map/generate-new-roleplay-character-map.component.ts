import { Component, OnInit } from '@angular/core';
import { PersistanceService } from 'src/app/persistance.service';


@Component({
  selector: 'app-generate-new-roleplay-character-map',
  templateUrl: './generate-new-roleplay-character-map.component.html',
  styleUrls: ['./generate-new-roleplay-character-map.component.css']
})
export class GenerateNewRoleplayCharacterMapComponent implements OnInit {

  constructor(private persistanceService : PersistanceService) { }

  ngOnInit() {
  }

  onGenerateClicked(){
    this.persistanceService.read();
  }

}
