/// <reference path="../../typings/raphael/raphael" />

import * as R from "Raphael";
import { Guitar } from "../Guitar";
import {BaseUI, pathString, repeat} from './BaseUI';
import {TabViewSize} from './Tab/TabCommon';
import {TabCell} from './Tab/TabCell';
import {TabColumn} from './Tab/TabColumn';

import {SimpleEvent, ISimpleEventBase, ISimpleEvent1, ISimpleEvent2, ISimpleEvent3} from '../Util/SimpleEvent';
import {TabDocument, TabPartType, TabStrum} from '../TabDocument';

import {Strum} from '../Strum';


export class TabView extends BaseUI {


    private _document: TabDocument;

    public get document(): TabDocument {
        return this._document;
    }

    size: TabViewSize = {
        stringSeperation: 20,
        noteSpeperation: 20
    };

    get stringCount(): number {
        return this.guitar.strings.length;
    }

    get selectedCell(): TabCell {
        let cols = this.columns.filter(x=> x.hasSelectedCell);
        if (cols.length == 0) return;
        return cols[0].cells.filter(x=> x.isSelected)[0];
    }

    public get guitar(): Guitar {
        return this.document.guitar;
    };

    public get allowSelect() {
        return false;
    }

    protected _columnAdded = SimpleEvent.New<TabColumn>();

    constructor(ele: HTMLElement, doc: TabDocument) {
        super(ele);
        this._document = doc;
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
        // var firstCell = this.columns[0].cells[0];
        //firstCell.setText('0');
        // firstCell.select();

        this._calculateSize();
    }

    private _drawStringLines() {
        //todo: make one path, keep refrence

        let d = this.draw;
        let x = this.getStringStartX();
        repeat(this.stringCount, idx=> {
            let y = this.getStringY(idx);
            let line = pathString(x, y, 1000, y);
            d.path(line);
        });
    }

    /**
     * letters on left side
     */
    private _drawStringLetters() {
        let d = this.draw;
        let x = this.getStringStartX() / 2;
        let g = this.guitar;
        repeat(this.stringCount, idx=> {
            let y = this.getStringY(idx);
            let letter = d.text(x, y, g.strings[idx].OpenNoteName);
        });
    }

    /**
     * Vertical lines at start of tab
     */
    private _drawStringVertLines() {
        //todo: make one path, keep refrence

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

    private _addColumn(c: TabColumn) {
        this.columns.push(c);
        this._columnAdded.trigger(c);
    }

    protected _buildTabColumns() {
        let d = this.draw;
        let g = this.guitar;
        let ns = this.size.noteSpeperation;
        var x = ns + this.getStringStartX();

        console.log(`TabView._buildTabColumns, partCount${this.document.partCount}`);

        repeat(this.document.partCount, (colIndex) => {

            console.log(`   this.columns.length > ${colIndex} = ${this.columns.length > colIndex}`)

            // already created;
            if (this.columns.length > colIndex) {
                console.log(`    Already Created ${colIndex}`)

                let column = this.columns[colIndex];
                column.refresh();
            } else {

                console.log(`    create ${colIndex}`);
                let column = new TabColumn(this.draw, this, colIndex);
                this._addColumn(column);

                let part = this.document.parts.elementAtIndex(colIndex);


                repeat(this.stringCount, idx=> {


                    let y = this.getStringY(idx);
                    let cell = column.defineCell(x, y, idx);
                    console.log(`defineCell(${x},${y},${idx})`);
                    //TODO: the following needs to move to TabCell:
                    if (part.type == TabPartType.Strum) {
                        let p = <TabStrum>part;
                        let pos = p.positions[idx];
                        if (pos != undefined || this.allowSelect) {
                            // we want to add text always if allowSelect is enabled.
                            // This allows us to create the binding boxes for the click events.

                            if (pos == undefined) {
                                cell.setText(" ");
                                if (colIndex == 1) cell.setText('~');
                            }
                            else {
                                cell.setText(pos.toString());
                            }
                        }
                    }

                    // cell.setText('X');

                });
            }//end not already created

            x = x + ns;
        });//end repeat

        this._calculateSize();
    }

    private get rightX() {
        if (this.columns.length == 0) {
            console.warn('TabView.rightX: no columns');
            return 0;
        }
        let x = this.columns[this.columns.length - 1].topCell.x + this.size.noteSpeperation;
        return x;
    }

    private _calculateSize() {
        //note that this points to the position after the last string
        let y = this.getStringY(this.stringCount);

        this.draw.setSize(this.rightX, y);
    }


    unselectAll() {
        this.columns.forEach(x=> x.unselectAll());
    }

    toArray(): string[][] {
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

    toString() {

        let array = this.toArray();

        let lines = [];

        repeat(this.stringCount, idx=> lines[idx] = []);

        array.forEach(a=> {
            let longest = 0;
            a.forEach(x=> {
                if (longest < x.length)
                    longest = x.length;
            });

            repeat(this.stringCount, idx=> {
                let p = a[idx];
                if (p == undefined || p == ' ') p = '';
                lines[idx].push(lpad(longest, '-----', p));
            });

            repeat(this.stringCount, idx=> {
                lines[idx].push('-');
            });
        });
        let lines2 = [];
        lines.forEach(l=> lines2.push(l.join('')));
        return lines2.join('\n');

    }


}


function lpad(length, pad, str: string): string {
    if (length < this.length) return str;

    pad = pad || ' ';

    while (str.length < length) {
        str = pad + str;
    }

    return str.substr(-length);
}
