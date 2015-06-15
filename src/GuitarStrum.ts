import {Strum} from './Strum';
import {Guitar} from './Guitar';

export class GuitarStrum extends Strum {
    private _gutiar: Guitar;


    constructor(guitar: Guitar, positions: number[]) {
        super(positions);

    }

    public get guitar(): Guitar {
        return this._gutiar;
    }


    names(): string[] {
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
}
