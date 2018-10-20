import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ShouldEditCharMapService {

  private isInEditMode: boolean;

  private isInEditModeSubject: Subject<boolean> = new Subject<boolean>();

  constructor() { 
    this.isInEditMode = false;
  }

  getInEditMode(): boolean {
    return this.isInEditMode;
  }

  getIsInEditModeSubject(): Subject<boolean> {
    return this.isInEditModeSubject;
  }

  setInEditMode(inEditMode: boolean) {
    this.isInEditMode = inEditMode;
    this.isInEditModeSubject.next(inEditMode);
  }

}
