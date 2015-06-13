import * as G from '../../out/Index';



import '../../out/Browser';



var myGuitar = G.Guitar.GetNormalGuitar();

var scale = new G.MajorScale(myGuitar);

window['scale'] = scale;
console.log(scale);


function buildChord(name: G.MusicNoteName) {
    let chordResults = scale.getChord(name);
    console.log(chordResults);
}

console.log('buildChord');

buildChord(G.MusicNoteName.C);

//
