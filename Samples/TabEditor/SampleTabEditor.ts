import * as G from '../../src/Index';
window['G'] = G;

let tabEditordiv = document.getElementById('tabEditor');

let tabDocument = window['tabDocument'] = new G.TabDocument(G.Guitar.GetNormalGuitar());

let editor = window['editor'] = new G.TabEditor(tabEditordiv, tabDocument);
