import * as R from "Raphael";
import {TabView} from '../TabView';
import {pathString} from '../BaseUI';
import {TabCell} from './TabCell';
export class TabColumn {
    cells: TabCell[] = [];
    tabView: TabView;
    index: number;

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
        return this.tabView.columns[this.index + 1];
    }


}
