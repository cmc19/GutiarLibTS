import * as R from "Raphael";
import {TabView} from '../TabView';
import {pathString} from '../BaseUI';
import {TabColumn} from './TabColumn';



export class TabCell {

    private textElement: RaphaelElement = null;
    private backgroundElement: RaphaelElement = null;
    private clickElement: RaphaelElement = null;
    private selectElement: RaphaelElement = null;

    private get elements(): RaphaelSet {
        return this.draw.set([
            this.textElement,
            this.backgroundElement,
            this.clickElement,
            this.selectElement
        ]);
    }


    private col: TabColumn;


    private get tabView(): TabView {
        return this.col.tabView;
    }

    get rowIndex(): number {
        return this.index;
    }

    get colIndex(): number {
        return this.col.index;
    }

    constructor(
        private x: number,
        private y: number,
        private draw: RaphaelPaper,
        c: TabColumn,
        private index: number) {
        this.col = c;

        this.createElements();
    }

    private createElements() {
        if (this.textElement !== null) return;

        let d = this.draw;
        let x = this.x;
        let y = this.y;


        let text = this.textElement = d.text(x, y, " ").attr({
            "font-size": 14
        });
        let box = text.getBBox();
        this.backgroundElement = d.rect(box.x, box.y, box.width, box.height)
            .attr('fill', 'white')
            .attr('stroke', 'white');
        text.toFront();


        this.createClickElement();
        this.createSelectElement();
        this._bindEvents();
    }



    private _bindEvents() {
        if(this.tabView.allowSelect == false) return;
        let onClick = () => this.click();
        this.elements.click(onClick);
    }

    private createClickElement() {
        let d = this.draw;
        let x = this.x;
        let y = this.y;
        let s = this.col.tabView.size;

        let diffNote = s.noteSpeperation / 2;
        let diffString = s.stringSeperation / 2;

        this.clickElement = d.rect(x - diffNote, y - diffString, s.noteSpeperation, s.stringSeperation)
            .attr({
                stroke: 'rgba(0,0,0,0)',
                fill: 'white'
            });
        this.clickElement.toBack();
        //this.clickElement.click(() => { this.click() });
    }

    private createSelectElement() {
        let d = this.draw;
        let x = this.x;
        let y = this.y;
        let s = this.col.tabView.size;

        let diffNote = s.noteSpeperation / 2;
        let diffString = s.stringSeperation / 2;
        diffString -= 1;

        let path = pathString(x - diffNote, y + diffString, x + diffNote, y + diffString);
        this.selectElement = d.path(path)
            .attr({ stroke: 'rgb(255,0,0)' })
            .attr('opacity', .1);
    }

    private recalcBackground() {
        let box = this.textElement.getBBox();

        this.backgroundElement.attr({
            x: box.x,
            y: box.y,
            width: box.width,
            height: box.height
        });
    }

    setText(str: string) {
        this.textElement.attr({
            text: str
        });
        this.recalcBackground();
    }

    getText(): string {
        return this.textElement.attr('text');
    }

    appendText(s: string) {
        this.setText(this.getText() + s);
    }


    isSelected: boolean = false;
    select() {
        this.tabView.unselectAll();
        this.isSelected = true;
        this.backgroundElement.attr('stroke', 'blue');
        this.selectElement.attr('opacity', 1);
    }

    unselect() {
        this.isSelected = false;
        this.backgroundElement.attr('stroke', 'white');
        this.selectElement.attr('opacity', '0');
    }

    private click() {
        console.log(this);
        console.log('click');
        this.select();
    }

    up(): TabCell {
        if (this.index == 0) {
            return this.col.cells[this.col.cells.length - 1];
        }
        return this.col.cells[this.index - 1];
    }

    down(): TabCell {
        if (this.index == this.col.cells.length - 1) {
            return this.col.cells[0];
        }
        return this.col.cells[this.index + 1];
    }

    left(): TabCell {
        return this.col.getLeft().cells[this.index];
    }

    right(): TabCell {
        return this.col.getRight().cells[this.index];
    }

}
