import { CharacterMap } from './../CharacterMap';
import { CharacterMapService } from './../../character-map.service';
import { Component, OnInit, HostListener, ApplicationRef } from '@angular/core';

@Component({
  selector: 'app-map-display',
  templateUrl: './map-display.component.html',
  styleUrls: ['./map-display.component.css']
})
export class MapDisplayComponent implements OnInit {
  mouseCurrentlyDown: boolean;
  canvas: HTMLCanvasElement;

  currentCharMap: CharacterMap = new CharacterMap();

  constructor(private characterMapService: CharacterMapService) { }

  ngOnInit() {
    this.initializeCanvas();
    this.fetchCharMap();
  }

  private fetchCharMap() {
    this.characterMapService.getCurrentMap().then((charMap) => {
      this.currentCharMap = charMap;
      this.updateCanvas();
    });
    this.characterMapService.getCurrentMapObserable().subscribe({
      next: (newCharMap) => {
        this.currentCharMap = newCharMap;
        this.updateCanvas();
      }
    });
  }

  updateCanvas(): void {
    const context = this.canvas.getContext('2d');
    const image = new Image();
    image.src = this.currentCharMap.mapImage;
    image.onload = () => {
      context.drawImage(image, 0, 0);
    };
  }

  @HostListener('mousemove', ['$event'])
  onClick(event) {
    if (this.mouseCurrentlyDown) {
    }
  }

  @HostListener('mousedown')
  onMouseDown(event) {
    this.mouseCurrentlyDown = true;
  }

  @HostListener('mouseup')
  onMouseUp(event) {
    this.mouseCurrentlyDown = false;
  }

  initializeCanvas() {
    this.canvas = <HTMLCanvasElement>document.getElementById('myCanvas');
    const parent = this.canvas.parentElement.parentElement;

    this.canvas.height = parent.offsetHeight;
    this.canvas.width = parent.offsetWidth;

    this.updateCanvas();
  }

}
