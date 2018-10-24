import { CharMapCity } from './../CharMapCity';
import { Component, OnInit } from '@angular/core';
import { CharacterMap } from '../CharacterMap';
import { CharacterMapService } from 'src/app/character-map.service';
import { Router } from '@angular/router';
import { ShouldEditCharMapService } from '../should-edit-char-map.service';
import { RedrawService } from 'src/app/redraw.service';

@Component({
  selector: 'app-city',
  templateUrl: './city.component.html',
  styleUrls: ['./city.component.css']
})
export class CityComponent implements OnInit {

  charMap: CharacterMap = new CharacterMap();
  newCharacter = false;
  city: CharMapCity;
  isEditable: boolean;

  constructor(private charMapService: CharacterMapService,
    private router: Router,
    private shouldEditService: ShouldEditCharMapService,
    private redrawService: RedrawService) { }

  ngOnInit() {
    const arr = this.router.url.split('/');
    this.charMapService.getMap(arr[arr.length - 1]).then(
      (resolve) => {
        this.charMap = resolve;
        this.redrawService.redraw();
      });

    this.charMapService.getMapObservable(arr[arr.length - 1]).subscribe(
      {
        next:
          (next) => {
            this.charMap = next;
            this.redrawService.redraw();
          }
      }
    );

    this.isEditable = this.shouldEditService.getInEditMode();
    this.shouldEditService.getIsInEditModeSubject().subscribe((shouldEdit) => {
      this.isEditable = shouldEdit;
    });
  }

  onCityEdit(city: CharMapCity) {
    if(this.city && city.name == this.city.name){
      this.city = null; 
      this.redrawService.redraw();
      return;
    }
    this.city = city;
    this.newCharacter = city.name == null;
    this.redrawService.redraw();
  }

  onNewCity() {
    this.onCityEdit(new CharMapCity());
  }

  onCitySave() {
    let removeIndex = -1;

    for (let i = 0; i < this.charMap.cities.length; ++i) {
      if (this.charMap.cities[i].name === this.city.name) {
        removeIndex = i;
      }
    }

    if (removeIndex !== -1) {
      this.charMap.cities.splice(removeIndex);
    }

    this.charMap.cities.push(this.city);

    this.charMapService.updateCharMap(this.charMap);

    this.city = null;
  }

}
