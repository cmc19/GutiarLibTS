/// <reference path="../../typings/raphael/raphael" />

import * as R from "Raphael";
import { Guitar } from "../Guitar";
import {BaseUI, pathString, repeat} from './BaseUI';
import {GuitarStrum} from '../GuitarStrum';


export interface IChordViewSize {
    stringSeperation: number;
    fretSeperation: number;
    circleRadius: number;
}

export class ChordView extends BaseUI {

    public static get DefaultSize(): IChordViewSize {
        return {
            stringSeperation: 8,
            fretSeperation: 10,
            circleRadius: 3
        };
    }

    /**
     * @param  {number}            x [description]
     * @param  {IChordViewSize} s defaults to the chord view.
     * @return {IChordViewSize}      [description]
     */
    static scaleSize(x: number, s: IChordViewSize = ChordView.DefaultSize): IChordViewSize {
        s.circleRadius *= x;
        s.fretSeperation *= x;
        s.stringSeperation *= x;

        return s;
    }

    private _showLetters: boolean = false;

    private _size: IChordViewSize; // = ChordView.DefaultSize;

    private get stringCount(): number {
        return this.strum.positions.length;
    }

    private get fretCount(): number {
        let r = Math.max(5, this.strum.maxFret);
        //    console.log(r);
        return r + 1 /* open fret */;
    }

    constructor(private strum: GuitarStrum, ele: HTMLElement = null, size: IChordViewSize = ChordView.DefaultSize) {
        super(ele);
        this._size = size;
        this.draw = Raphael(this.element, 1, 1);

        this._drawParts();
    }

    private _drawParts() {

        let d = this.draw;
        let ps = [];
        this._drawStrings(ps);
        this._drawFrets(ps);
        d.path(ps.join(' '));

        this._drawFingerPositions();
        this._drawLetters();

        //Sizes SVG from 1x1 to correct size based on size data
        this._resize();
    }

    private _resize() {
        let s = this.lastStringX() + this._size.stringSeperation
        let f = this.lastFretY() + this._size.fretSeperation;
        if (this._showLetters) {
            f += this._size.fretSeperation;
        }
        this.draw.setSize(s, f);
    }

    private _drawStrings(ps: string[]) {
        let size = this._size;
        let strum = this.strum;
        let f = size.fretSeperation;
        repeat(this.stringCount, s=> {
            let x = this.stringX(s);
            let line = pathString(x, f, x, this.lastFretY());
            ps.push(line);
        });
    }

    private _drawFrets(ps: string[]) {
        let size = this._size;
        let strum = this.strum;

        repeat(this.fretCount, f=> {
            let y = this.fretY(f);
            ps.push(pathString(size.stringSeperation, y, this.lastStringX(), y));
        });
        //d.path(ps.join(' '));

    }

    private lastStringX() {
        return this.stringX(0);
    }

    private stringX(strIdx: number) {
        strIdx = (this.stringCount - 1) - strIdx;
        return this._size.stringSeperation * (strIdx + 1)
    }

    private fretY(fretIdx: number): number {
        return this._size.fretSeperation * (fretIdx + 1)
    }
    private fretYMiddle(fretIdx: number): number {
        return this.fretY(fretIdx) - (this._size.fretSeperation / 2);
    }

    private lastFretY() {
        return this.fretY(this.fretCount - 1);
    }

    private _drawFingerPositions() {
        let d = this.draw;

        repeat(this.stringCount, s=> {
            let f = this.strum.positions[s];
            if (f === undefined) return;
            let x = this.stringX(s);
            let circle = d.circle(x, this.fretYMiddle(f), this._size.circleRadius);
            if (f !== 0) {
                circle.attr('fill', 'black');
            }
        });
    }

    private _drawLetters() {
        if (this._showLetters) {

            let d = this.draw;
            let strum = this.strum;

            let names = strum.getNames();
            repeat(this.stringCount, s=> {
                let x = this.stringX(s);
                let y = this.fretYMiddle(this.fretCount + 1);

                d.text(x, y - this._size.fretSeperation, names[s]);

            });

        }
    }

    showLetters() {
        this._showLetters = true;
        this._drawLetters();
        this._resize();
    }

    /**
     * Scales all contents. Note that this is expensive. Try to do this in the constructor.
     * @param  {number} x [description]
     */
    scale(x: number) {
        if (x === 1) return;
        this.draw.clear();
        let s = this._size;
        this._size = ChordView.scaleSize(x, s);
        this._drawParts();
    }



}
