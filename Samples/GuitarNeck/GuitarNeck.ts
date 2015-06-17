import * as G from '../../src/Index';
window['G'] = G;


var guitar = window['guitar'] = G.Guitar.GetNormalGuitar();

let neckDiv = document.createElement('div');

var neck = new G.GuitarNeck(guitar, neckDiv);

neck.showAllNoteLetters();
