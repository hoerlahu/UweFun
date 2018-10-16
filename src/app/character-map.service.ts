import { Injectable } from '@angular/core';
import { PersistanceService } from './persistance.service';
import { Observable, Subject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class CharacterMapService {

  existingCharacterMaps: Array<string> = new Array<string>();
  existingCharacterMapsSubject: Subject<Array<string>> = new Subject<Array<string>>();

  constructor(private persistanceService: PersistanceService,
              private router: Router) {
    this.persistanceService.read('scenario', (dataSnapshot) => {
      this.existingCharacterMaps = JSON.parse(dataSnapshot);
      if (!this.existingCharacterMaps) {
        this.existingCharacterMaps = new Array<string>();
      }
      this.existingCharacterMapsSubject.next(this.existingCharacterMaps);
    });
  }

  createNewCharacterMap(charmapName: string) {
    this.existingCharacterMaps.push('{scenarioName : %1}'.replace(/%1/, charmapName));
    this.persistanceService.write('scenario', JSON.stringify(this.existingCharacterMaps));
    this.existingCharacterMapsSubject.next(this.existingCharacterMaps);

    this.router.navigate(['/editCharacterMap', charmapName]);
  }

  getExistingCharacterMapsObservable(): Subject<Array<String>> {
    return this.existingCharacterMapsSubject;
  }

  getExistingCharacterMaps(): Promise<Array<string>> {
    if (this.existingCharacterMaps) {
      return new Promise<Array<string>>((resolve) => {
        resolve(this.existingCharacterMaps);
      });
    } else {
      return new Promise<Array<string>>((resolve) => {
        this.persistanceService.read('scenario', (dataSnapshot) => {
          this.existingCharacterMaps = JSON.parse(dataSnapshot);
          this.existingCharacterMapsSubject.next(this.existingCharacterMaps);
          resolve(this.existingCharacterMaps);
        });
      }
      );
    }
  }
}
