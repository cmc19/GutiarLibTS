
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
    name:string;
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


var baseFrequencys = [16.35, 17.32, 18.35, 19.45, 20.60, 21.83, 23.12, 24.5, 25.96, 27.5, 29.14, 30.87];
export var MusicNotes: IMusicNoteAdvanced[] = [];

export function getFrequencyOfNoteA4(x: number): number {
    return 440 * Math.pow(A, x);
}

export function getNoteNameFromID(id: number): MusicNoteName {
    return MusicNoteName[MusicNoteName[(id + (12 * 4) + 9 + 1) % 12]];
}

export function getOctiveFromId(id: number): number {
    var x = id + (12 * 4) + 9 + 1;
    return Math.floor(x / 12);
}

//Build music notes array.

for (var noteID = -57; noteID <= 68; noteID++) {

    var nn = getNoteNameFromID(noteID);
    var sname = stringNoteNames[nn];
    let octive = getOctiveFromId(noteID);
    if (sname === undefined) debugger;
    MusicNotes.push({
        frequency: getFrequencyOfNoteA4(noteID),
        nameId: nn,
        fullName: sname + octive.toString(),
        id: noteID,
        octive: octive,
        name: sname
    });
}

//let idx = 0;
//for (let octive = 0; octive <= 8; octive++) {
//    for (var i = 0; i < stringNoteNames.length; i++) {
//        let element = stringNoteNames[i];
//
//        let baseF = baseFrequencys[i];
//        let freq = baseF;
//        for (let x = 0; x < octive; x++) {
//            freq = freq + freq;
//        }
//        MusicNotes.push({
//            fullName: stringNoteNames[i] + octive.toString(),
//            frequency: freq,
//            octive: octive,
//            name: MusicNoteName[MusicNoteName[i]],
//            id: idx
//        });
//        idx++;
//    }
//
//}


export function getNote(id: number) {
    return MusicNotes.filter(x=> x.id == id)[0]
}
