import { CharacterMap } from './../CharacterMap';
import { CharacterMapService } from './../../character-map.service';
import { Component, OnInit } from '@angular/core';

import { QuillEditorComponent } from 'ngx-quill';

import Quill from 'quill';
import { Router } from '@angular/router';



// override p with div tag
const Parchment = Quill.import('parchment');
const Block = Parchment.query('block');

Block.tagName = 'DIV';
// or class NewBlock extends Block {}; NewBlock.tagName = 'DIV';
Quill.register(Block /* or NewBlock */, true);

// Add fonts to whitelist
const Font = Quill.import('formats/font');
// We do not add Aref Ruqaa since it is the default
Font.whitelist = ['mirza', 'aref', 'sans-serif', 'monospace', 'serif'];
Quill.register(Font, true);

@Component({
  selector: 'app-edit-character-map',
  templateUrl: './edit-character-map.component.html',
  styleUrls: ['./edit-character-map.component.css']
})
export class EditCharacterMapComponent implements OnInit {

  charMap: CharacterMap = new CharacterMap();

  constructor(private charMapService: CharacterMapService,
              private router: Router) {
  }

  ngOnInit() {
    const arr = this.router.url.split('/');
    this.charMapService.getMap(arr[arr.length - 1]).then(
      (resolve) => {
        this.charMap = resolve;
      });

    this.charMapService.getMapObservable(arr[arr.length - 1]).subscribe(
      { next: (next) => { this.charMap = next; } }
    );
  }

  onSave() {
    this.charMapService.updateCharMap(this.charMap);
    this.charMapService.persistMaps();
  }

}
