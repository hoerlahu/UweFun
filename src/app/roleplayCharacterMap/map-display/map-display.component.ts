import { callbackify } from 'util';
import { CharacterMap } from './../CharacterMap';
import { CharacterMapService } from './../../character-map.service';
import { Component, OnInit, HostListener, ApplicationRef } from '@angular/core';
import { CharMapCity } from '../CharMapCity';

const CITY_ICON_HEIGHT = 2;
const CITY_ICON_WIDTH = 2;

@Component({
  selector: 'app-map-display',
  templateUrl: './map-display.component.html',
  styleUrls: ['./map-display.component.css']
})
export class MapDisplayComponent implements OnInit {
  mouseCurrentlyDown: boolean;
  canvas: HTMLCanvasElement;

  contextMenu: HTMLDivElement;

  currentCharMap: CharacterMap = new CharacterMap();

  canvasContents: Array<{ x: number, y: number, image: HTMLImageElement }> = new Array<{ x: number, y: number, image: HTMLImageElement }>();
  lastMousePosition: { x: number, y: number } = { x: 0, y: 0 };

  mapPositionDuringRightClick: { x: number, y: number } = { x: 0, y: 0 };
  rightClickPosition: { x: number, y: number } = { x: 0, y: 0 };
  constructor(private characterMapService: CharacterMapService) { }

  ngOnInit() {
    this.initializeCanvas();
    this.fetchCharMap();
    this.overrideRightClick();
    this.findContextMenuDiv();
  }

  findContextMenuDiv(): any {
    this.contextMenu = <HTMLDivElement>document.getElementById('contextMenu');
    this.hideContextMenu();
  }

  hideContextMenu() {
    this.contextMenu.setAttribute('style', 'position: absolute; left: -9999px');
    this.mapPositionDuringRightClick.x = 0;
    this.mapPositionDuringRightClick.y = 0;
  }

  showContextMenu(event: MouseEvent) {
    this.contextMenu.setAttribute('style', 'position: fixed; left: ' + event.x + 'px; top: ' + event.y + 'px;');
    this.mapPositionDuringRightClick = this.canvasContents[0];
    const rect = this.canvas.getBoundingClientRect();
    this.rightClickPosition.x = event.x - rect.left;
    this.rightClickPosition.y = event.y - rect.top;
  }

  private overrideRightClick() {
    this.canvas.oncontextmenu = (ev: MouseEvent) => {
      ev.preventDefault();
      this.showContextMenu(ev);
    }
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

  onCityClicked(city: CharMapCity) {
    const cityIcon = new Image();

    cityIcon.src = 'https://banner2.kisspng.com/20180329/yiq/kisspng-computer-icons-location-symbol-map-clip-art-location-5abc97a1cb8bf6.0992497615223090258337.jpg';

    cityIcon.width = 5;
    cityIcon.height = 5;

    this.canvasContents.push(
      {
        x: this.mapPositionDuringRightClick.x + this.rightClickPosition.x,
        y: this.mapPositionDuringRightClick.y + this.rightClickPosition.y,
        image: cityIcon
      }
    );

    cityIcon.onload = () => {
      this.canvas.getContext('2d').drawImage(cityIcon, 0, 0, CITY_ICON_WIDTH, CITY_ICON_HEIGHT);
    };

    this.hideContextMenu();
  }

}
