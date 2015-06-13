import {MusicNoteName,noteMath} from './MusicNote';
import {Guitar} from './Guitar';
import {Strum} from './Strum';
import {GuitarString,IFretInfo} from './GuitarString';

export class Scale {

    constructor(protected guitar: Guitar) {

    }
    protected findStrings(note: MusicNoteName) {
        let g = this.guitar;
        return g.getFretsWithNote(note);
    }
}

export class MajorScale extends Scale {
    constructor(guitar: Guitar) {
        super(guitar);
    }

    getFretInfo(note: MusicNoteName) {
        var major  = this.findStrings(note);
        var p4 = this.findStrings(noteMath.getNoteDiff(note,4));
        var p7 = this.findStrings(noteMath.getNoteDiff(note,7));
        return {
            major:major,
            p4:p4,
            p7:p7
        }
    }
}
