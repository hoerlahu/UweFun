import { CharacterMap } from './roleplayCharacterMap/CharacterMap';
import { Injectable, NgZone } from '@angular/core';
import { PersistanceService } from './persistance.service';
import { Observable, Subject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class CharacterMapService {

  existingCharacterMaps: Array<CharacterMap>;
  existingCharacterMapsSubject: Subject<Array<CharacterMap>> = new Subject<Array<CharacterMap>>();
  currentlyEditedCharacterMap: CharacterMap;

  constructor(private persistanceService: PersistanceService,
              private router: Router,
              private ngZone: NgZone) {
    this.persistanceService.read('scenario', (dataSnapshot) => {
      this.existingCharacterMaps = JSON.parse(dataSnapshot);
      if (!this.existingCharacterMaps) {
        this.existingCharacterMaps = new Array<CharacterMap>();
      }
      this.existingCharacterMapsSubject.next(this.existingCharacterMaps);
    });
  }

  createNewCharacterMap(charmapName: string) {
    const charMap = new CharacterMap();
    charMap.charMapName = charmapName;
    this.existingCharacterMaps.push(charMap);
    this.propagateChangeInCharMaps();

    this.editCharacterMap(charMap);
  }

  private propagateChangeInCharMaps() {
    this.existingCharacterMapsSubject.next(this.existingCharacterMaps);
  }

  editCharacterMap(charmap: CharacterMap) {
    this.currentlyEditedCharacterMap = charmap;
    this.ngZone.run(() => {
      this.router.navigate(['/editCharacterMap', charmap.charMapName]);
    });
  }

  getExistingCharacterMapsObservable(): Subject<Array<CharacterMap>> {
    return this.existingCharacterMapsSubject;
  }

  getExistingCharacterMaps(): Promise<Array<CharacterMap>> {
    if (this.existingCharacterMaps) {
      return new Promise<Array<CharacterMap>>((resolve) => {
        resolve(this.existingCharacterMaps);
      });
    } else {
      return new Promise<Array<CharacterMap>>((resolve) => {
        this.persistanceService.read('scenario', (dataSnapshot) => {
          this.existingCharacterMaps = JSON.parse(dataSnapshot);
          this.existingCharacterMapsSubject.next(this.existingCharacterMaps);
          resolve(this.existingCharacterMaps);
        });
      }
      );
    }
  }

  updateCharMap(charMap: CharacterMap) {
    let indexToRemove = -1;
    this.existingCharacterMaps.forEach(cm => {
      if (cm.charMapName === charMap.charMapName) {
        indexToRemove = this.existingCharacterMaps.indexOf(charMap);
      }
    });

    this.existingCharacterMaps.splice(indexToRemove);
    this.existingCharacterMaps.push(charMap);

    this.propagateChangeInCharMaps();
  }

  persistMaps() {
    this.persistanceService.write('scenario', JSON.stringify(this.existingCharacterMaps));
  }

  getMap(mapName: string): Promise<CharacterMap> {
    return new Promise<CharacterMap>((resolve) => {
      this.getExistingCharacterMaps().then(
        result => {
          result.forEach(each => {
            if (mapName === each.charMapName) {
              resolve(each);
            }
          });
        }
      );
    });
  }

  getMapObservable(mapName: string): Observable<CharacterMap> {
    return new Observable<CharacterMap>((subscriber) => {
      this.getExistingCharacterMapsObservable().subscribe(
        result => {
          result.forEach(each => {
            if (mapName === each.charMapName) {
              subscriber.next(each);
            }
          });
        }
      );
    });
  }

}
