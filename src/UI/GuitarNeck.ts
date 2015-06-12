/// <reference path="../../typings/raphael/raphael" />
/// <reference path="../Guitar"/>

import * as R from "Raphael";
import { GuitarString,IFretInfo } from '../GuitarString';
import {BaseUI, pathString, repeat} from './BaseUI';
import {Strum} from '../Strum';
import { Guitar } from "../Guitar";

export interface IGuitarNeckSizing {
    startStringLine: number;
    firstStringHeight: number
    stringSeperation: number
    fretSeperation: number;
    opacityToggleTime: number;
    fingerPositionRadius: number;
}

export class GuitarNeck extends BaseUI {


    private size: IGuitarNeckSizing = {
        firstStringHeight: 25,
        stringSeperation: 25,
        fretSeperation: 40,
        startStringLine: 40,
        opacityToggleTime: 500,
        fingerPositionRadius: 5
    };

    private _maxFrets: number = 25;

    /**
     * the strum circles
     * @type {RaphaelElement[]}
     */
    private _strumElements: RaphaelElement[] = [];

    get fretCount(): number {
        return Math.min(this._maxFrets, this.guitar.frets);
    }

    get stringCount(): number {
        return this.guitar.strings.length;
    }


    constructor(public guitar: Guitar, ele: HTMLElement = document.createElement('div')) {
        super(ele);
        let size = this.size;
        this.element = ele;
        document.body.appendChild(this.element);
        this.draw = R(ele, 1024, (this.size.firstStringHeight * 2) + (guitar.strings.length * size.stringSeperation));
        this.drawParts();
    }

    //Maths
    private getStringY(idx: number) {
        return (idx * this.size.stringSeperation) + this.size.firstStringHeight;
    }

    private getLastStringY(): number {
        return this.getStringY(this.stringCount - 1);
    }

    private getFretX(idx: number): number {
        let s = this.size;
        return s.fretSeperation * (idx + 1);
    }

    private getLastFretX() {
        return this.getFretX(this.fretCount);
    }

    private getStringLength(): number {
        let s = this.size;
        return this.getFretX(this.fretCount - 1) + s.fretSeperation;
        return s.fretSeperation * (this.fretCount + 1);
    }

    private getPointOfStringFret(str: number, fret: number): IPoint {
        let size = this.size;
        return {
            x: 20 + (fret * size.fretSeperation),
            y: size.firstStringHeight + (str * size.stringSeperation)
        };
    }

    private getFretHorizontalCenter(fret: number): number {
        let size = this.size;

        return size.startStringLine + (size.fretSeperation * fret) - (size.fretSeperation / 2);
    }

    private drawParts() {
        this.drawDoubleFretLine();
        this.drawStrings();
        this.drawFrets();
        this.drawFretBubbles();
        this.drawNoteLetters();
        this.resize();
    }

    private resize() {
        this.draw.setSize(this.getLastFretX() + this.size.fretSeperation, this.getLastStringY() + this.size.stringSeperation);
    }


    private drawStrings() {
        let g = this.guitar;
        let d = this.draw;
        let size = this.size;
        let stringLength = this.getStringLength();
        repeat(this.stringCount, idx=> {
            let height = this.getStringY(idx);
            let pth = pathString(size.startStringLine, height, stringLength, height);
            d.path(pth).attr('stroke', 'solid');
        });
    }



    private drawDoubleFretLine() {
        let g = this.guitar;
        let d = this.draw;
        let size = this.size;
        //Double Starting Line
        let x = size.startStringLine - 5;
        let lastString = this.getLastStringY();
        let path = pathString(x, size.firstStringHeight, x, lastString);
        d.path(path).attr('stroke', 'solid');
    }


    private drawFrets() {
        let g = this.guitar;
        let d = this.draw;
        let size = this.size;

        let lastString = this.getLastStringY();

        //Draw each fret Line
        repeat(g.frets + 1, f=> {
            let y = size.startStringLine + (f * size.fretSeperation);
            let path = pathString(y, size.firstStringHeight, y, lastString);
            d.path(path).attr('stroke', 'solid');

        });

    }



    private drawFretBubbles() {
        let d = this.draw;
        let g = this.guitar;
        let size = this.size;

        let applyStyles = (ele: RaphaelElement) => { ele.attr('fill', 'solid'); };

        let single = (fret: number) => {
            if (this.fretCount < fret) return;
            let c = d.circle(this.getFretHorizontalCenter(fret), size.firstStringHeight + (size.stringSeperation * (g.strings.length / 2)) - (size.stringSeperation / 2), 5);
            applyStyles(c);
        }


        let double = (fret: number) => {
            if (this.fretCount < fret) return;
            let c = d.circle(this.getFretHorizontalCenter(fret), size.firstStringHeight + (size.stringSeperation * (1)) - (size.stringSeperation / 2), 5)
            applyStyles(c);
            c = d.circle(this.getFretHorizontalCenter(fret), size.firstStringHeight + (size.stringSeperation * (g.strings.length - 1)) - (size.stringSeperation / 2), 5)
            applyStyles(c);
        };

        single(3);
        single(5);
        single(7);
        single(9);
        double(12);
        single(15);
        single(17);
        single(19);
        single(21);
        double(24);

    }

    private _noteLetters: NoteLetterElement[] = [];
    private _noteLettersSet: RaphaelSet = null;

    /** Clears all of the letters from the neck */
    hideAllNoteLetters() {
        let s = this.size;
        let nls = this._noteLettersSet;
        nls.attr({ opacity: 0 });

        //    nls.animate({ opacity: 0 }, s.opacityToggleTime);

    }

    /**
     * Makes all note letters visible
     */
    showAllNoteLetters() {
        let s = this.size;
        let nls = this._noteLettersSet;
        nls.attr({ opacity: 1 });
        //    nls.animate({ opacity: 1 }, s.opacityToggleTime);
    }

    /**
     * Draw all note letters on fret board
     */
    private drawNoteLetters() {
        let d = this.draw;
        let g = this.guitar;

        if (this._noteLettersSet === null) {
            this._noteLettersSet = d.set();
        }

        let nls = this._noteLettersSet;

        let sIdx = 0;
        for (var s of g.strings) {

            for (var f = 0; f < g.frets + 1; f++) {


                var noteAtFret = s.noteAtFret(f);



                let point = this.getPointOfStringFret(sIdx, f);

                let text = d.text(point.x, point.y, noteAtFret.name).attr({
                    "font-size": 12,
                    "fill": "green",
                    "font-weight": "bold",
                    opacity: 0
                });

                //create white background for text, uses the text to calculate size.
                let box = text.getBBox();
                let rect = d.rect(box.x, box.y, box.width, box.height)
                    .attr('fill', 'white')
                    .attr('stroke', 'white')
                    .attr('opacity', 0);
                text.toFront();


                this._noteLetters.push(new NoteLetterElement(s, f, text, rect));
                nls.push(rect, text);
            }


            sIdx++;
        }

    }




    clearStrum() {
        for (let e of this._strumElements) {
            e.remove();
        }
        this._strumElements = [];
    }

    drawStrum(s: Strum, clearStrum: boolean = true) {
        let d = this.draw;
        let g = this.guitar;
        let size = this.size;
        if (clearStrum) {
            this.clearStrum();
        }

        let idx = 0;
        var added = [];
        for (let p of s.positions) {
            if (p !== undefined) {
                let point = this.getPointOfStringFret(idx, p);
                let ele = d.circle(point.x, point.y, size.fingerPositionRadius)
                    .attr('fill', 'red');
                this._strumElements.push(ele);
                added.push(ele);
            }
            idx++;
        }
        return added;
    }

    addStrumMarker(fi:IFretInfo){
        let arr = [];
        repeat(this.stringCount, idx=> arr.push(undefined));
        arr[fi.stringIndex] = fi.fretIndex;
        return this.drawStrum( Strum.New(arr),false)[0];
    }

    removeBar() {

    }

    barFret(fret: number) {
        let h = this.getFretHorizontalCenter(fret);
        let d = this.draw;
        //todo
    }

    scale(x: number) {
        let s = this.size;
        s.startStringLine *= x;
        s.firstStringHeight *= x;
        s.stringSeperation *= x;
        s.fretSeperation *= x;
        s.opacityToggleTime *= x;
        s.fingerPositionRadius *= x;
        this.draw.clear();
        this.drawParts();

    }

    setMaxFrets(n: number) {
        this._maxFrets = n;
        this.drawParts();
    }
}


module GuitarStringMath {
    /**
     * @param stringLength in pixels
     * @param frets total frets
     */
    export function getFretLengths(stringLength: number, frets: number): number[] {
        var l = stringLength;
        var ret = [];
        for (var i = 0; i < frets; i++) {
            var c = l / 18;
            l = l - c;
            ret.push(c);
        }
        return ret;
    }
}

interface IPoint {
    x: number;
    y: number;
}

interface INoteLetterElement {
    text: RaphaelElement;
    background: RaphaelElement;
    note: IFretPosition;
}

interface IFretPosition {
    fret: number;
    stringIndex: number;
}


class NoteLetterElement {
    constructor(private s: GuitarString, private fret: number, private text: RaphaelElement, private bg: RaphaelElement) {
        text.click(() => this.click());
        bg.click(() => this.click());
    }

    click() {
        console.log('click', this);
    }
}
