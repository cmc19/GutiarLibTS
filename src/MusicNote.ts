
// Interfaces
export interface IMusicNote {
    nameId: MusicNoteName;
    /** 0-8 */
    octive: number;
}

export interface IMusicNoteAdvanced extends IMusicNote {
    /** ex: A4 */
    fullName: string;
    frequency: number;
    id: number;
    name: string;
}

export enum MusicNoteName {
    C = 0,
    C_,
    D,
    D_,
    E,
    F,
    F_,
    G,
    G_,
    A,
    A_,
    B //11
}
var stringNoteNames = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

/** 2^(1/12) */
const A = Math.pow(2, 1 / 12);


export var MusicNotes: IMusicNoteAdvanced[] = [];


export module noteMath {

    export function getFrequencyOfNoteA4(x: number): number {
        return 440 * Math.pow(A, x);
    }


    export function getNoteNameFromID(id: number): MusicNoteName {
        return MusicNoteName[MusicNoteName[(id + (12 * 4) + 9 + 1) % 12]];
    }


    export function getNoteDiff(name: MusicNoteName, diff: number): MusicNoteName {
        let note = MusicNotes.filter(x=>x.octive == 4 && x.nameId == name)[0];
        let id = note.id + diff;
        return getNoteNameFromID(id);
    }

    export function getOctiveFromId(id: number): number {
        var x = id + (12 * 4) + 9 + 1;
        return Math.floor(x / 12);
    }
    export function getNoteNameAsString(name:MusicNoteName){
        return MusicNotes.filter(x=>x.nameId == name)[0].name;
    }
}

//Build music notes array.

for (var noteID = -57; noteID <= 68; noteID++) {

    var nn = noteMath. getNoteNameFromID(noteID);
    var sname = stringNoteNames[nn];
    let octive = noteMath.getOctiveFromId(noteID);
    if (sname === undefined) debugger;
    MusicNotes.push({
        frequency: noteMath.getFrequencyOfNoteA4(noteID),
        nameId: nn,
        fullName: sname + octive.toString(),
        id: noteID,
        octive: octive,
        name: sname
    });
}




export function getNote(id: number) {
    return MusicNotes.filter(x=> x.id == id)[0]
}
