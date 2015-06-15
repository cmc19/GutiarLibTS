import { MusicNoteName, IMusicNoteAdvanced, MusicNotes, getNote} from './MusicNote';

/** a single string on the guitar. */
export class GuitarString {
    private _index: number;
    private _note: IMusicNoteAdvanced;

    public get index(): number {
        return this._index;
    }

    public get OpenNoteName(): string {
        return this._note.fullName;
    }

    constructor(index: number, note: IMusicNoteAdvanced) {
        this._index = index;
        this._note = note;
    }

    public frequencyAtFret(fret: number) {
        var id = fret + this._note.id;
        return getNote(id).frequency;
    }

    public noteAtFret(fret: number): IMusicNoteAdvanced {
        var id = fret + this._note.id;
        return getNote(id);
    }

    public getFretsWithNote(noteName: MusicNoteName, fretCount: number): IFretInfo[] {
        let results: IFretInfo[] = [];

        for (let i = 0; i < fretCount; i++) {
            let note = this.noteAtFret(i);
            if (note.nameId == noteName) {
                results.push({
                    stringIndex: this.index,
                    fretIndex: i,
                    note: note
                });
            }
        }

        return results;
    }

    toObject(): IGuitarString {
        return {
            index: this.index,
            note: this._note
        };
    }

    static fromObject(obj: IGuitarString) {
        return new GuitarString(obj.index, obj.note);
    }
}

export function getGuitarStrings(names: string[]): GuitarString[] {
    var strings: GuitarString[] = [];
    let idx = 0;
    for (var name of names) {
        let note = MusicNotes.filter(x=> x.fullName == name)[0];
        if (note == undefined) debugger;
        strings.push(new GuitarString(idx, note));
        idx++;
    }

    return strings;
}

export interface IGuitarString {
    index: number;
    note: IMusicNoteAdvanced;
}


/**
 * Info about a fret on a guitar
 */
export interface IFretInfo {
    stringIndex: number;
    fretIndex: number;
    note: IMusicNoteAdvanced;
}
