import * as R from "Raphael";
import {TabView} from '../TabView';
import {pathString} from '../BaseUI';
import {TabCell} from './TabCell';
import {TabPart} from '../../TabDocument';

export class TabColumn {
    cells: TabCell[] = [];
    tabView: TabView;
    index: number;

    get part(): TabPart {
        return this.tabView.document.parts.elementAtIndex(this.index);
    }

    get hasSelectedCell(): boolean {
        return this.cells.filter(x=> x.isSelected).length !== 0;
    }

    constructor(private draw: RaphaelPaper, tv: TabView, idx: number) {
        this.index = idx;
        this.tabView = tv;
    }

    defineCell(x, y, idx): TabCell {
        let tc = new TabCell(x, y, this.draw, this, idx);
        this.cells.push(tc);
        return tc;
    }

    unselectAll() {
        this.cells.forEach(x=> x.unselect());
    }

    getLeft(): TabColumn {
        return this.tabView.columns[this.index - 1];
    }

    getRight(): TabColumn {
        let col =  this.tabView.columns[this.index + 1];
        if(col === undefined){
            this.tabView.document.addStrum(this.tabView.guitar.getBlankStrum());
            return this.tabView.columns[this.index + 1];
        }
        return col;
    }

    get topCell(): TabCell {
        return this.cells[0];
    }

    refresh() {

    }

}
