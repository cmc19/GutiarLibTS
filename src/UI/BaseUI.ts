/// <reference path="../../typings/raphael/raphael" />

import * as R from "Raphael";


export class BaseUI {
    protected draw: RaphaelPaper;
    protected element: HTMLElement;


    constructor(ele: HTMLElement = null) {
        if (ele === null)
            ele = document.createElement('div');

        //ele.tabIndex = 0; //this allows keyboard events
        this.element = ele;
    }
    public appendTo(ele: HTMLElement) {
        ele.appendChild(this.element);
    }
}


export function pathString(mx, my, lx, ly): string {
    return `M${mx},${my} L${lx},${ly}`;
}

export function repeat(times: number, fn: (idx: number) => void) {
    for (let x = 0; x < times; x++) {
        fn(x);
    }
}
