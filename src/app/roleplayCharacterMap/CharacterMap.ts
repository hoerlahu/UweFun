import { CharMapCharacter } from './CharMapCharacter';
import { CharMapCity } from './CharMapCity';
import { CharacterMapService } from '../character-map.service';

export class CharacterMap {

    static DEFAULT_MAP_IMAGE: string = 'https://image.shutterstock.com/image-vector/vintage-physical-world-map-rivers-260nw-726591178.jpg';

    charMapName: string;
    characters: Array<CharMapCharacter>;
    cities: Array<CharMapCity>;
    description: string;
    mapImage = CharacterMap.DEFAULT_MAP_IMAGE;

    constructor() {
        this.characters = new Array<CharMapCharacter>();
        this.cities = new Array<CharMapCity>();
    }

}
