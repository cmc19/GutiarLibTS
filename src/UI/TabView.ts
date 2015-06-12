/// <reference path="../../typings/raphael/raphael" />

import * as R from "Raphael";
import { Guitar } from "../Guitar";
import {BaseUI, pathString, repeat} from './BaseUI';
import {TabViewSize} from './Tab/TabCommon';
import {TabCell} from './Tab/TabCell';
import {TabColumn} from './Tab/TabColumn';
import {SimpleEvent} from '../Util/SimpleEvent';

import {Strum} from '../Strum';
export class TabView extends BaseUI {

    size: TabViewSize = {
        stringSeperation: 20,
        noteSpeperation: 18
    };

    get stringCount(): number {
        return this.guitar.strings.length;
    }

    get selectedCell(): TabCell {
        return this.columns.filter(x=> x.hasSelectedCell)[0].cells
            .filter(x=> x.isSelected)[0];
    }
    public guitar: Guitar;

    protected _columnAdded  = SimpleEvent.New<TabColumn>();

    constructor(ele: HTMLElement, guitar: Guitar) {
        super(ele);
        this.guitar = guitar;
        this.draw = R(this.element, 300, 300);
        this.draw.canvas.onclick = () => {
            console.log('canvas click');
            this.element.focus();
        };
        this._drawAllParts();
    }

    //math

    protected getStringY(idx) {
        let s = this.size;
        return (idx * s.stringSeperation) + s.stringSeperation;
    }

    protected getStringStartX() {
        return 20;
    }

    private _drawAllParts() {
        this._drawStringLines();
        this._drawStringLetters();
        this._drawStringVertLines();
        this._buildTabColumns();
        var firstCell = this.columns[0].cells[0];
        firstCell.setText('0');
        // firstCell.select();
    }

    private _drawStringLines() {
        let d = this.draw;
        let x = this.getStringStartX();
        repeat(this.stringCount, idx=> {
            let y = this.getStringY(idx);
            let line = pathString(x, y, 300, y);
            d.path(line);
        });
    }

    private _drawStringLetters() {
        let d = this.draw;
        let x = this.getStringStartX() / 2;
        let g = this.guitar;
        repeat(this.stringCount, idx=> {
            let y = this.getStringY(idx);
            console.log(y);
            let letter = d.text(x, y, g.strings[idx].OpenNoteName);
        });
    }

    private _drawStringVertLines() {
        let d = this.draw;
        let x = this.getStringStartX();
        let g = this.guitar;
        let length = this.size.stringSeperation / 4;
        repeat(this.stringCount, idx=> {
            let y = this.getStringY(idx);

            let line = pathString(x, y - length, x, y + length);
            d.path(line);

        });
    }

    columns: TabColumn[] = [];

    private _addColumn(c:TabColumn){
        this.columns.push(c);
        this._columnAdded.trigger(c);
    }

    private _buildTabColumns() {
        let d = this.draw;
        let g = this.guitar;
        let ns = this.size.noteSpeperation;
        let x = ns + this.getStringStartX();

        repeat(16, (colIndex) => {
            let column = new TabColumn(this.draw, this, colIndex);
            this._addColumn(column);
            repeat(this.stringCount, idx=> {
                let y = this.getStringY(idx);
                let cell = column.defineCell(x, y, idx);
                // cell.setText('X');

            });
            x = x + ns;
        });

    }

    unselectAll() {
        this.columns.forEach(x=> x.unselectAll());
    }

    toArray(): string[][]{
        let ret: string[][] = [];

        this.columns.forEach(function(c) {
            let col = [];
            c.cells.forEach(function(c) {
                col.push(c.getText());
            }, this);
            ret.push(col);
        }, this);

        return ret;
    }

    toString(){
        return "[object TabView]";
    }
}
