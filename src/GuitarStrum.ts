import {Strum} from './Strum';
import {Guitar} from './Guitar';

export class GuitarStrum extends Strum {
    private _gutiar: Guitar;


    constructor(guitar: Guitar, positions: number[]) {
        super(positions);
        this._gutiar = guitar;
    }

    public get guitar(): Guitar {
        return this._gutiar;
    }


    getFullNames(): string[] {
        let g = this.guitar;
        var a = [];
        let idx = 0;
        for (let p of this.positions) {
            if (p != undefined) {
                var s = g.strings[idx];
                a.push(s.noteAtFret(p).fullName);
            } else {
                a.push('x');
            }
            idx++;
        }
        return a;
    }

    getNames():string[]{
        let g = this.guitar;
        var a = [];
        let idx = 0;
        for (let p of this.positions) {
            if (p != undefined) {
                var s = g.strings[idx];
                a.push(s.noteAtFret(p).name);
            } else {
                a.push('x');
            }
            idx++;
        }
        return a;
    }
}
