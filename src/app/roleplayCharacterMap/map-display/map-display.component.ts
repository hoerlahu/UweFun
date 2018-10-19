import { callbackify } from 'util';
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

  canvasContents: Array<{ x: number, y: number, image: HTMLImageElement }> = new Array<{ x: number, y: number, image: HTMLImageElement }>();
  lastMousePosition: { x: number, y: number } = { x: 0, y: 0 };


  constructor(private characterMapService: CharacterMapService) { }

  ngOnInit() {
    this.initializeCanvas();
    this.fetchCharMap();
  }

  private fetchCharMap() {
    this.characterMapService.getCurrentMap().then((charMap) => {
      this.currentCharMap = charMap;
      this.canvasContents = new Array<{ x: number, y: number, image: HTMLImageElement }>();
      this.cleanCanvas();
      this.addCharMapImages();
      this.updateCanvas();
    });
    this.characterMapService.getCurrentMapObserable().subscribe({
      next: (newCharMap) => {
        this.currentCharMap = newCharMap;
        this.canvasContents = new Array<{ x: number, y: number, image: HTMLImageElement }>();
        this.cleanCanvas();
        this.addCharMapImages();
        this.updateCanvas();
      }
    });
  }

  cleanCanvas() {
    const context = this.canvas.getContext('2d');

    context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  updateCanvas(): void {
    const context = this.canvas.getContext('2d');
    this.canvasContents.forEach((each) => {
      context.drawImage(each.image, each.x, each.y);
    });
  }

  @HostListener('mousemove', ['$event'])
  onClick(event) {
    if (this.mouseCurrentlyDown) {

      const dx = event.x - this.lastMousePosition.x;
      const dy = event.y - this.lastMousePosition.y;

      this.lastMousePosition.x = event.x;
      this.lastMousePosition.y = event.y;

      this.canvasContents.forEach(element => {
        element.x += dx;
        element.y += dy;
      });
      this.cleanCanvas();
      this.updateCanvas();
    }
  }

  @HostListener('mousedown', ['$event'])
  onMouseDown(event: MouseEvent) {
    if (!this.isClickOnCanvas(event)) { return; }
    this.mouseCurrentlyDown = true;
    this.lastMousePosition.x = event.x;
    this.lastMousePosition.y = event.y;
  }

  isClickOnCanvas(event: MouseEvent): boolean {
    const rect = this.canvas.getBoundingClientRect();
    if (rect.left > event.x || rect.right < event.x) {
      return false;
    }
    if (rect.bottom < event.y || rect.top > event.y) {
      return false;
    }
    return true;
  }

  @HostListener('mouseup')
  onMouseUp(event) {
    this.mouseCurrentlyDown = false;
    this.lastMousePosition.x = 0;
    this.lastMousePosition.y = 0;
  }

  initializeCanvas() {
    this.canvas = <HTMLCanvasElement>document.getElementById('myCanvas');
    const parent = this.canvas.parentElement.parentElement;

    this.canvas.height = parent.offsetHeight;
    this.canvas.width = parent.offsetWidth;

    this.addCharMapImages();
  }

  addCharMapImages(): any {

    const mapBackground = new Image();

    mapBackground.src = this.currentCharMap.mapImage;

    this.canvasContents.push(
      {
        x: 0,
        y: 0,
        image: mapBackground
      }
    );

    mapBackground.onload = () => {
      this.canvas.getContext('2d').drawImage(mapBackground, 0, 0);
    };
  }

}
