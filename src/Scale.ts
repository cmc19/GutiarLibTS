import {MusicNoteName, noteMath} from './MusicNote';
import {Guitar} from './Guitar';
import {Strum} from './Strum';
import {GuitarString, IFretInfo} from './GuitarString';

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

    getStrumList(note: MusicNoteName): Strum[] {
        var results: Strum[] = [];
        let info = this.getFretInfo(note);

        info.major = info.major.filter(x=> x.fretIndex <= 6);
        info.p4 = info.p4.filter(x=> x.fretIndex <= 6);
        info.p7 = info.p7.filter(x=> x.fretIndex <= 6);

        //2 major
        let majors = findAllPossibleCombos(info.major, 2, 2);

        majors.forEach(m=> {

        });

        console.log(majors);

        return results;
    }
}

class FretInfoCollection {
    private list: IFretInfo[] = [];

    add(f: IFretInfo) {
        this.list.push(f);
    }

    isValid(f: IFretInfo): boolean {
        return this.list.filter(x=> x.stringIndex == f.stringIndex).length === 0
    }
}


function findAllPossibleCombos(a: any[], min: number, max: number = null) {
    if (max === null) max = a.length;
    max += 1;
    var fn = function(n, src, got, all) {
        if (n == 0) {
            if (got.length > 0) {
                all[all.length] = got;
            }
            return;
        }
        for (var j = 0; j < src.length; j++) {
            fn(n - 1, src.slice(j + 1), got.concat([src[j]]), all);
        }
        return;
    }
    var all = [];
    for (var i = min; i < max; i++) {
        fn(i, a, [], all);
    }
    //all.push(a);
    return all;
}
