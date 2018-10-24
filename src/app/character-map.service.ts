import { CharacterMap } from './roleplayCharacterMap/CharacterMap';
import { Injectable, NgZone } from '@angular/core';
import { PersistanceService } from './persistance.service';
import { Observable, Subject } from 'rxjs';
import { Router } from '@angular/router';
import { HashGenerator } from './helper/HashGenerator';

@Injectable({
  providedIn: 'root'
})
export class CharacterMapService {
  existingCharacterMaps: Array<CharacterMap> = new Array<CharacterMap>();
  existingCharacterMapsSubject: Subject<Array<CharacterMap>> = new Subject<Array<CharacterMap>>();


  constructor(private persistanceService: PersistanceService,
    private router: Router,
    private ngZone: NgZone) {
    this.persistanceService.read('scenario', (dataSnapshot) => {
      this.existingCharacterMaps = JSON.parse(dataSnapshot);
      if (!this.existingCharacterMaps) {
        this.existingCharacterMaps = new Array<CharacterMap>();
      }

      this.loadAndReplaceHashedImages(this.existingCharacterMaps);

      this.existingCharacterMapsSubject.next(this.existingCharacterMaps);
    });
  }

  getCurrentMapObserable(): Observable<CharacterMap> {
    const arr = this.router.url.split('/');
    return this.getMapObservable(arr[arr.length - 1]);
  }

  getCurrentMap(): Promise<CharacterMap> {
    const arr = this.router.url.split('/');
    return this.getMap(arr[arr.length - 1]);
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

    let charMaps = this.existingCharacterMaps.slice();

    this.saveAndReplaceImagesWithHash(charMaps);

    this.persistanceService.write('scenario', JSON.stringify(charMaps));
  }

  saveAndReplaceImagesWithHash(characterMaps: CharacterMap[]): any {

    characterMaps.forEach(
      each => {
        const hash = HashGenerator.calculateHashForString(each.mapImage);
        this.persistanceService.write('ImageHashes/' + hash, each.mapImage);
        localStorage.setItem('ImageHashes/' + hash, each.mapImage)
        each.mapImage = hash.toString();
      }
    );



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


  loadAndReplaceHashedImages(charMaps: Array<CharacterMap>): void {
    charMaps.forEach(element => {
      if ( !this.successfullyLoadImageFromLocalStorage(element)) {
        this.persistanceService.readOnce('ImageHashes/' + element.mapImage).then(
          value => {
            element.mapImage = value.val();
          });
      }
    });
  }

  successfullyLoadImageFromLocalStorage(element: CharacterMap): boolean {
    const answer = localStorage.getItem('ImageHashes/' + element.mapImage)
    if (answer) { 
      element.mapImage = answer;
      return true;
    }
    return false;
  }
}

