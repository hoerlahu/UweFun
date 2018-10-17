import { CharMapCharacter } from './../CharMapCharacter';
import { CharacterMapService } from './../../character-map.service';
import { Component, OnInit } from '@angular/core';
import { CharacterMap } from '../CharacterMap';
import { Router } from '@angular/router';

@Component({
  selector: 'app-character',
  templateUrl: './character.component.html',
  styleUrls: ['./character.component.css']
})
export class CharacterComponent implements OnInit {

  charMap: CharacterMap = new CharacterMap();
  newCharacter = false;
  character: CharMapCharacter;

  constructor(private charMapService: CharacterMapService,
              private router: Router) { }

  ngOnInit() {
    const arr = this.router.url.split('/');
    this.charMapService.getMap(arr[arr.length - 1 ]).then(
      (resolve) => {
        this.charMap = resolve;
      });
  }

  onCharacterEdit(character: CharMapCharacter) {
    this.character = character;
    this.newCharacter = character.name == null;
  }

  onNewCharacter() {
    this.onCharacterEdit(new CharMapCharacter());
  }

  onCharacterSave() {
    let removeIndex = -1;

    for (let i = 0; i < this.charMap.characters.length; ++i) {
      if (this.charMap.characters[i].name === this.character.name) {
        removeIndex = i;
      }
    }

    if (removeIndex !== -1) {
      this.charMap.characters.splice(removeIndex);
    }

    this.charMap.characters.push(this.character);

    this.charMapService.saveCharMap(this.charMap);

    this.character = null;
  }

}
