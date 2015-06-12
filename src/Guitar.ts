import { GuitarString, getGuitarStrings, IGuitarString,IFretInfo} from './GuitarString';
import {hasFromObject} from './Util/Decorators';
import {MusicNoteName} from './MusicNote';

@hasFromObject
export class Guitar {
    public strings: GuitarString[] = [];
    public frets: number = 21;

    public get stringCount(): number {
        return this.strings.length;
    }

    constructor() { }


    toObject(): IGuitar {
        return {
            strings: this.strings.map(x=> x.toObject()),
            frets: this.frets
        }
    }


    getFretsWithNote(noteName: MusicNoteName):IFretInfo[]{
        let results :IFretInfo[] = [];
        this.strings.forEach(str =>{
            str.getFretsWithNote(noteName, this.frets).forEach(x=>{results.push(x);});
        });
        return results;
    }

    static fromObject(obj: IGuitar): Guitar {
        var g = new Guitar();
        g.strings = obj.strings.map(x=> GuitarString.fromObject(x));
        return g;
    }

    static GetNormalGuitar(): Guitar {
        var g = new Guitar();
        g.strings = getGuitarStrings(["E4", "B3", "G3", "D3", "A2", "E2"]);
        return g;
    }


}


export interface IGuitar {
    strings: IGuitarString[]
}
