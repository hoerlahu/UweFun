import { Injectable, ApplicationRef } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RedrawService {

  constructor(private appref: ApplicationRef) { }

  redraw() {
    this.appref.tick();
  }
}
