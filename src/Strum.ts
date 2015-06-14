import {Guitar} from './Guitar';


export class Strum {
    get stringCount(): number { return this.positions.length; }
    get maxFret(): number {
        return Math.max(...this.positions.filter(x=> x !== undefined));
    }
    get minFret():number{
        return Math.min(...this.positions.filter(x=>x !== undefined));
    }

    get stringsUsed() : number{
        return this.positions.filter(x=>x !== undefined).length;
    }

    get maxFretDistence(): number{
        return this.maxFret - this.minFret;
    }

    get firstUsedStringIndex():number{
        let idx = 0;
        let result = null;
        this.positions.forEach(x=>{
            if(result!== null) return;
            if(x!== undefined) {
                result = idx;
            }
            idx++;
        });
        return result;
    }
    positions: number[];

    constructor() { }

    average(g: Guitar): number {
        var a = [];
        let idx = 0;
        for (let p of this.positions) {
            if (p != undefined) {
                var s = g.strings[idx];
                a.push(s.frequencyAtFret(p));
            }
            idx++;
        }
        return getAverage(a);
    }

    names(g: Guitar): string[] {
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

    rate():number{
let ret = 100;
if(this.maxFretDistence > 5) ret-=1000;
return ret;
    }

    static New(fretPositions: number[]) {
        var s = new Strum();

        s.positions = fretPositions;

        return s;
    }
}

export module WellKnownChords {
    let x = undefined;
    export var D = Strum.New([2, 3, 2, 0, x, x]);
    export var A = Strum.New([0, 2, 2, 2, 0, x]);
    export var C = Strum.New([0, 1, 0, 2, 3, x]);
    export var E = Strum.New([0, 0, 1, 2, 2, 0]);
}



function getAverage(arry: number[]): number {
    var sum = 0, count = 0;
    sum = arry.reduce(function(previousValue, currentValue, index, array) {
        if (isFinite(currentValue)) {
            count++;
            return previousValue + currentValue;
        }
        return previousValue;
    }, sum);
    return count ? sum / count : 0;
}
