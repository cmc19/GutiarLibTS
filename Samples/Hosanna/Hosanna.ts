import * as G from '../../src/Index';
let guitar = G.Guitar.GetNormalGuitar();
let chorus = new G.TabDocument(guitar);


let gs = x=> guitar.getStrum(x);

(function buildChorus() {
    let x = undefined;

    let s = a => {
        chorus.addStrum(gs(a));
        chorus.addStrum(gs([x, x, x, x, x, x]));
        chorus.addStrum(gs([x, x, x, x, x, x]));
        chorus.addStrum(gs(a));
        chorus.addStrum(gs([x, x, x, x, x, x]));
        chorus.addStrum(gs(a));
        chorus.addStrum(gs(a));
        chorus.addStrum(gs([x, x, x, x, x, x]));
        chorus.addLine();
    }

    let p2 = () => {
        s([7, 8, 0, x, x, x]);
        s([8, 8, 5, x, x, x]);
    };

    let b875 = () => s([x, 8, 7, 5, x, x]);
    b875();
    b875();
    p2();
    b875();
    s([x, 10, 7, 0, x, x]);
    p2();

})();

let ctabView = new G.TabView(document.getElementById('hosanna'), chorus);
