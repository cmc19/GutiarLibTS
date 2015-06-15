var G = require('../../out/Index');
window['G'] = G;
var guitar = window['guitar'] = G.Guitar.GetNormalGuitar();
var neckDiv = document.createElement('div');
var neck = new G.GuitarNeck(guitar, neckDiv);
neck.showAllNoteLetters();
