import { RedrawService } from './../../redraw.service';
import { CharacterMap } from './../CharacterMap';
import { CharacterMapService } from './../../character-map.service';
import { Component, OnInit } from '@angular/core';

import { QuillEditorComponent } from 'ngx-quill';

import Quill from 'quill';
import { Router } from '@angular/router';
import { ShouldEditCharMapService } from '../should-edit-char-map.service';



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
  isEditable: boolean;

  constructor(private charMapService: CharacterMapService,
    private router: Router,
    private redrawService: RedrawService,
    private shouldEditService: ShouldEditCharMapService) {
  }

  ngOnInit() {
    this.charMapService.getCurrentMap().then(
      (resolve) => {
        this.charMap = resolve;
        console.log(this.charMap.description);
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

    this.isEditable = this.shouldEditService.getInEditMode();
    this.shouldEditService.getIsInEditModeSubject().subscribe((shouldEdit) => {
      this.isEditable = shouldEdit;
    });

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

  onEditClicked(){
    this.shouldEditService.setInEditMode(true);
  }

  onMapImageChanged(event: Event) {
    const inputField = <HTMLInputElement>event.target;
    if (inputField.files[0]) {
      const reader = new FileReader();
      reader.readAsDataURL(inputField.files[0]);
      reader.onload = (ev) => {
        const dataUrl = (<FileReader>ev.target).result;
        this.charMap.mapImage = dataUrl.toString();
        this.redraw();
        this.onPropertyChanged();
      }
    }
  }

}
