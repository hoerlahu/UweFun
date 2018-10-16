import { Component, OnInit } from '@angular/core';

import { QuillEditorComponent } from 'ngx-quill';

import Quill from 'quill';



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

  description: string;

  constructor() { }

  ngOnInit() {
  }

  onSave() {
    console.log(this.description);
  }

}
