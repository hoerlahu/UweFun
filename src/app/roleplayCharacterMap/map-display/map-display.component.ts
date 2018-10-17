import { Component, OnInit, HostListener } from '@angular/core';

@Component({
  selector: 'app-map-display',
  templateUrl: './map-display.component.html',
  styleUrls: ['./map-display.component.css']
})
export class MapDisplayComponent implements OnInit {
  mouseCurrentlyDown: boolean;
  canvas: HTMLCanvasElement;
  constructor() { }

  ngOnInit() {
    const height = window.innerHeight;
    const width = window.innerWidth;

    this.canvas = <HTMLCanvasElement>document.getElementById('myCanvas');
    const parent = this.canvas.parentElement.parentElement;

    this.canvas.height = parent.offsetHeight;
    this.canvas.width = parent.offsetWidth;

    const context = this.canvas.getContext('2d');
    const image = new Image();
    image.src = 'https://cdn1.iconfinder.com/data/icons/ninja-things-1/1772/ninja-simple-512.png';
    image.height = 100;
    image.width = 100;
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

}
