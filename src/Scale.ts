import {MusicNoteName, noteMath} from './MusicNote';
import {Guitar} from './Guitar';
import {GuitarStrum} from './GuitarStrum';
import {GuitarString, IFretInfo} from './GuitarString';
import {findAllPossibleCombos} from './Util/Array';


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
        var major = this.findStrings(note);
        var p4 = this.findStrings(noteMath.getNoteDiff(note, 4));
        var p7 = this.findStrings(noteMath.getNoteDiff(note, 7));
        return {
            major: major,
            p4: p4,
            p7: p7
        };
    }

    getStrumList(note: MusicNoteName): GuitarStrum[] {
        var results: GuitarStrum[] = [];
        let info = this.getFretInfo(note);

        let max = 12;
        info.major = info.major.filter(x=> x.fretIndex <= max);
        info.p4 = info.p4.filter(x=> x.fretIndex <= max);
        info.p7 = info.p7.filter(x=> x.fretIndex <= max);

        //2 major
        let majors = findAllPossibleCombos(info.major, 2, 3);
        let p7Combos = findAllPossibleCombos(info.p7, 1, 2);

        majors.forEach(m=> {
            let majorFic = new StrumBuilder();
            if (majorFic.addArray(m) == false) return;


            // info.p7.forEach(p7=> {
            //     let fic = majorFic.clone();
            //     if (fic.add(p7) == false) return;
            //
            //     info.p4.forEach(p4=> {
            //         let f = fic.clone();
            //         if (f.add(p4) == false) return;
            //         results.push(f.getChord(this.guitar.stringCount));
            //     });
            // });

            p7Combos.forEach(p7=> {
                let fic = majorFic.clone();
                if (fic.addArray(p7) == false) return;
                info.p4.forEach(p4=> {
                    let f = fic.clone();
                    if (f.add(p4) == false) return;
                    results.push(f.getChord(this.guitar));
                });
            });
        });

        //    console.log(majors);

        return results;
    }
}

export class StrumBuilder {
    private list: IFretInfo[] = [];

    add(f: IFretInfo) {
        if (this.isValid(f)) {
            this.list.push(f);
            return true;
        }
        else return false;
    }

    isValid(f: IFretInfo): boolean {
        return this.list.filter(x=> x.stringIndex == f.stringIndex).length === 0;
    }

    clone(): StrumBuilder {
        let ret = new StrumBuilder();
        this.list.forEach(x=> ret.add(x));

        return ret;
    }
    addArray(a: IFretInfo[]): boolean {
        for (let fi of a) {
            if (this.add(fi) == false) {
                return false;
            }
        }
        return true;
    }

    getChord(g:Guitar): GuitarStrum {
        let u = undefined;
        let stringCount = g.stringCount
        let results = [];
        for (var x = 0; x < stringCount; x++) {
            let fi = this.list.filter(y=> y.stringIndex == x);
            if (fi.length === 0) {
                results.push(u);
            } else {
                results.push(fi[0].fretIndex);
            }

        }

        return new GuitarStrum(g,results);
    }
}
