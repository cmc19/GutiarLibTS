import * as G from '../../out/Index';
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
