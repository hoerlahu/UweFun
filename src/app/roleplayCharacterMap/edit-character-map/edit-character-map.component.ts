import { RedrawService } from './../../redraw.service';
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
    private router: Router,
    private redrawService: RedrawService) {
  }

  ngOnInit() {
    this.charMapService.getCurrentMap().then(
      (resolve) => {
        this.charMap = resolve;
        this.redraw();
      });

    this.charMapService.getCurrentMapObserable().subscribe(
      {
        next: (next) => {
          this.charMap = next;
          this.redraw();
        }
      }
    );
  }

  onPropertyChanged() {
    this.charMapService.updateCharMap(this.charMap);
  }

  onSave() {
    this.charMapService.updateCharMap(this.charMap);
    this.charMapService.persistMaps();
  }

  redraw() {
    this.redrawService.redraw();
  }

}
