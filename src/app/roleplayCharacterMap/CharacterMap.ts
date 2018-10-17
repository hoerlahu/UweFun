import { CharMapCharacter } from './CharMapCharacter';
import { CharMapCity } from './CharMapCity';

export class CharacterMap {

    charMapName: string;
    characters: Array<CharMapCharacter>;
    cities: Array<CharMapCity>;

    constructor() {
        this.characters = new Array<CharMapCharacter>();
        this.cities = new Array<CharMapCity>();
    }

}
