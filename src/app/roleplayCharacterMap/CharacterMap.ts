import { CharMapCharacter } from './CharMapCharacter';
import { CharMapCity } from './CharMapCity';

export class CharacterMap {

    charMapName: string;
    characters: Array<CharMapCharacter>;
    cities: Array<CharMapCity>;
    description: string;
    mapImage = 'https://image.shutterstock.com/image-vector/vintage-physical-world-map-rivers-260nw-726591178.jpg';

    constructor() {
        this.characters = new Array<CharMapCharacter>();
        this.cities = new Array<CharMapCity>();
    }

}
