import {MusicNoteName} from './MusicNote';
import {Guitar} from './Guitar';
import {Strum} from './Strum';

export class Scale {

    constructor(protected guitar: Guitar) {

    }
    protected findStrings(note: MusicNoteName) {
        let g = this.guitar;
        let results : StringLocation[] = [];
        g.strings.forEach(str=> {

        });
    }
}

export class MajorScale extends Scale {
    constructor(guitar: Guitar) {
        super(guitar);
    }

    getChord(note:MusicNoteName): Strum {
        throw "";
    }
}


interface StringLocation {
    stringIndex: number;
    fretIndex: number;
}
