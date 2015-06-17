import * as G from '../../src/Index';
window['G'] = G;
let uu = undefined;

let streetsDiv = document.getElementById('wtshnn');
let guitar = G.Guitar.GetNormalGuitar();

let gs = x=> guitar.getStrum(x);

let streets = window['streets'] = new G.TabDocument(guitar);

function part1() {
    streets.addStrum(gs([10, uu, uu, uu, uu, uu]));
    streets.addStrum(gs([uu, 10, uu, uu, uu, uu]));
    streets.addStrum(gs([uu, uu, 12, uu, uu, uu]));
    streets.addStrum(gs([uu, uu, 11, uu, uu, uu]));
    streets.addStrum(gs([uu, uu, 12, uu, uu, uu]));
    streets.addStrum(gs([uu, 10, uu, uu, uu, uu]));
}
part1();
part1();
part1();

let tabView = window['tabview'] = new G.TabView(streetsDiv, streets);


let agDiv = document.getElementById('tiag');

let ag = window['ag'] = new G.TabDocument(guitar);

function commonPart(){
    ag.addStrum(gs([uu, 16, uu, uu, uu, uu]));
    ag.addStrum(gs([uu, 15, uu, uu, uu, uu]));
    ag.addStrum(gs([uu, 13, uu, uu, uu, uu]));
    ag.addStrum(gs([uu, 15, uu, uu, uu, uu]));
    ag.addStrum(gs([uu, uu, uu, uu, uu, uu]));
    ag.addStrum(gs([uu, 15, uu, uu, uu, uu]));
    ag.addStrum(gs([uu, 13, uu, uu, uu, uu]));
    ag.addStrum(gs([uu, 15, uu, uu, uu, uu]));
    ag.addStrum(gs([uu, uu, uu, uu, uu, uu]));
    ag.addStrum(gs([uu, uu, 15, uu, uu, uu]));
    ag.addStrum(gs([uu, 13, uu, uu, uu, uu]));
    ag.addStrum(gs([uu, 15, uu, uu, uu, uu]));
}

commonPart();

ag.addStrum(gs([13, uu, uu, uu, uu, uu]));
ag.addStrum(gs([15, uu, uu, uu, uu, uu]));

ag.addStrum(gs([uu, uu, uu, uu, uu, uu]));

commonPart();

ag.addStrum(gs([uu, uu, 12, uu, uu, uu]));
ag.addStrum(gs([uu, uu, 10, uu, uu, uu]));


let tabView2 = window['tabview2'] = new G.TabView(agDiv, ag);
