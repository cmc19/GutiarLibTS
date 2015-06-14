/// <reference path="../../typings/raphael/raphael" />

import * as R from "Raphael";
import { Guitar } from "../Guitar";
import {Strum} from '../Strum';
import {BaseUI, pathString, repeat} from './BaseUI';

interface ISize {
    stringSeperation: number;
    fretSeperation: number;
    circleRadius: number;
}

export class ChordView extends BaseUI {

    private size: ISize = {
        stringSeperation: 8,
        fretSeperation: 10,
        circleRadius: 3
    };

    private get stringCount(): number {
        return this.strum.positions.length;
    }

    private get fretCount(): number {
        let r =  Math.max( 5, this.strum.maxFret);
    //    console.log(r);
        return r + 1 /* open fret */;
    }

    constructor(private strum: Strum, ele: HTMLElement = null) {
        super(ele);
        this.draw = Raphael(this.element, 1, 1);

        this._drawParts();
    }

    private _drawParts() {
        this._drawStrings();
        this._drawFrets();
        this._drawFingerPositions();
        this._resize();
    }

    private _resize() {
        let s = this.lastStringX() + this.size.stringSeperation
        let f = this.lastFretY() + this.size.fretSeperation;
        this.draw.setSize(s, f);
    }

    private _drawStrings() {
        let size = this.size;
        let strum = this.strum;
        let d = this.draw;
        let f = size.fretSeperation;
        repeat(this.stringCount, s=> {
            let x = this.stringX(s);
            let line = pathString(x, f, x, this.lastFretY());
            d.path(line);
        });
    }

    private _drawFrets() {
        let size = this.size;
        let strum = this.strum;
        let d = this.draw;
        repeat(this.fretCount, f=> {
            let y = this.fretY(f);
            let line = pathString(size.stringSeperation, y, this.lastStringX(), y);
            d.path(line);
        });
    }

    private lastStringX() {
        return this.stringX(0);
    }

    private stringX(strIdx: number) {
        strIdx = (this.stringCount - 1) - strIdx;
        return this.size.stringSeperation * (strIdx + 1)
    }

    private fretY(fretIdx: number): number {
        return this.size.fretSeperation * (fretIdx + 1)
    }
    private fretYMiddle(fretIdx: number): number {
        return this.fretY(fretIdx) - (this.size.fretSeperation / 2);
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
            let circle = d.circle(x, this.fretYMiddle(f), this.size.circleRadius);
            if (f !== 0) {
                circle.attr('fill', 'black');
            }
        });
    }

    scale(x: number) {
        this.draw.clear();
        let s = this.size;
        s.circleRadius *= x;
        s.fretSeperation *= x;
        s.stringSeperation *= x;
        this._drawParts();
    }
}
