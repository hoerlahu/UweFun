import { callbackify } from 'util';
import { CharacterMap } from './../CharacterMap';
import { CharacterMapService } from './../../character-map.service';
import { Component, OnInit, HostListener, ApplicationRef } from '@angular/core';
import { CharMapCity } from '../CharMapCity';
import { MapDrawable } from './MapDrawable';
import { HashGenerator } from 'src/app/helper/HashGenerator';
import { ShouldEditCharMapService } from '../should-edit-char-map.service';

const CITY_ICON_HEIGHT = 100;
const CITY_ICON_WIDTH = 100;

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

  canvasContents: Array<MapDrawable> = new Array<MapDrawable>();
  lastMousePosition: { x: number, y: number } = { x: 0, y: 0 };

  mapPositionDuringRightClick: { x: number, y: number } = { x: 0, y: 0 };
  rightClickPosition: { x: number, y: number } = { x: 0, y: 0 };
  isEditable: boolean;

  constructor(private characterMapService: CharacterMapService,
    private editableService: ShouldEditCharMapService) { }

  ngOnInit() {

    this.isEditable = this.editableService.getInEditMode();
    this.editableService.getIsInEditModeSubject().subscribe(
      next => {
        this.isEditable = next;
      }
    );

    this.initializeCanvas();
    this.fetchCharMap();
    this.overrideRightClick();
    this.findContextMenuDiv();
  }

  findContextMenuDiv(): any {
    this.contextMenu = <HTMLDivElement>document.getElementById('contextMenu');
    this.hideContextMenu();
  }

  private overrideRightClick() {
    this.canvas.oncontextmenu = (ev: MouseEvent) => {
      ev.preventDefault();
      this.showContextMenu(ev);
    }
  }

  private fetchCharMap() {
    this.characterMapService.getCurrentMap().then((charMap) => {
      this.preventAddingImagesThatAreCurrentlyLoading();
      this.currentCharMap = charMap;
      this.canvasContents = new Array<MapDrawable>();
      this.cleanCanvas();
      this.addCharMapImages();
      this.updateCanvas();
    });
    this.characterMapService.getCurrentMapObserable().subscribe({
      next: (newCharMap) => {
        this.preventAddingImagesThatAreCurrentlyLoading();
        this.currentCharMap = newCharMap;
        this.canvasContents = new Array<MapDrawable>();
        this.cleanCanvas();
        this.addCharMapImages();
        this.updateCanvas();
      }
    });
  }

  private preventAddingImagesThatAreCurrentlyLoading() {
    this.canvasContents.forEach(each => { each.image.onload = () => {} });
  }

  cleanCanvas() {
    const context = this.canvas.getContext('2d');
    context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  updateCanvas(): void {
    const context = this.canvas.getContext('2d');
    this.canvasContents.forEach((each) => {
      context.drawImage(each.image, each.x, each.y, each.width, each.height);
    });
    let val = this.canvasContents[0];
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
    if (event.button == 0) {
      if(this.isClickOnElement(event, this.contextMenu) == false){
        this.hideContextMenu();
      }
    } 
    if (!this.isClickOnElement(event, this.canvas)) { return; }
    this.mouseCurrentlyDown = true;
    this.lastMousePosition.x = event.x;
    this.lastMousePosition.y = event.y;
  }

  isClickOnElement(event: MouseEvent, htmlElement: HTMLElement): boolean {
    const rect = htmlElement.getBoundingClientRect();
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
    this.addBackgroundImage();
  }

  private addBackgroundImage() {
    const mapBackground = new Image();
    mapBackground.src = this.currentCharMap.mapImage;
    console.log(mapBackground.width + " " + mapBackground.height + " " + mapBackground.src);
    mapBackground.onload = () => {
      this.canvas.getContext('2d').drawImage(mapBackground, 0, 0);
      this.canvasContents.push({
        x: 0,
        y: 0,
        image: mapBackground,
        height: mapBackground.height,
        width: mapBackground.width,
        cityName: mapBackground.src
      });
    };
  }

  onCityClicked(city: CharMapCity) {
    const cityIcon = new Image();

    cityIcon.src = 'https://image.flaticon.com/icons/svg/67/67347.svg';

    const cityCanvasContent = {
      x: this.rightClickPosition.x - CITY_ICON_WIDTH / 2,
      y: this.rightClickPosition.y - CITY_ICON_HEIGHT,
      image: cityIcon,
      height: CITY_ICON_HEIGHT,
      width: CITY_ICON_WIDTH,
      cityName: city.name
    };

    this.removeCityIconIfExists(city.name);

    this.canvasContents.push(
      cityCanvasContent
    );

    cityIcon.onload = () => {
      this.updateCanvas();
    };

    this.hideContextMenu();
  }

  removeCityIconIfExists(name: string): void {

    let remove;

    this.canvasContents.forEach((each) => {
      if (each.cityName == name) {
        remove = each;
      }
    });

    if (remove) {
      this.canvasContents.splice(this.canvasContents.indexOf(remove));
    }

  }

  hideContextMenu() {
    this.contextMenu.setAttribute('style', 'position: absolute; left: -9999px');
    this.mapPositionDuringRightClick.x = 0;
    this.mapPositionDuringRightClick.y = 0;
  }

  showContextMenu(event: MouseEvent) {

    if (this.isEditable == false) { 
      return; 
    }

    this.contextMenu.setAttribute('style', 'position: fixed; left: ' + event.x + 'px; top: ' + event.y + 'px;');
    this.mapPositionDuringRightClick.x = this.canvasContents[0].x;
    this.mapPositionDuringRightClick.y = this.canvasContents[0].y;
    const rect = this.canvas.getBoundingClientRect();
    this.rightClickPosition.x = event.x - rect.left;
    this.rightClickPosition.y = event.y - rect.top;
  }

}
