import { CharMapCity } from './../CharMapCity';
import { Component, OnInit } from '@angular/core';
import { CharacterMap } from '../CharacterMap';
import { CharacterMapService } from 'src/app/character-map.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-city',
  templateUrl: './city.component.html',
  styleUrls: ['./city.component.css']
})
export class CityComponent implements OnInit {

  charMap: CharacterMap = new CharacterMap();
  newCharacter = false;
  city: CharMapCity;

  constructor(private charMapService: CharacterMapService,
              private router: Router) { }

  ngOnInit() {
    const arr = this.router.url.split('/');
    this.charMapService.getMap(arr[arr.length - 1 ]).then(
      (resolve) => {
        this.charMap = resolve;
      });

    this.charMapService.getMapObservable(arr[arr.length - 1 ]).subscribe(
      { next: (next) => { this.charMap = next; }}
    );
  }

  onCityEdit(city: CharMapCity) {
    this.city = city;
    this.newCharacter = city.name == null;
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
