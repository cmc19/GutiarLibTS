var G = require('../../out/Index');
require('../../out/Browser');
var myGuitar = G.Guitar.GetNormalGuitar();
var scale = new G.MajorScale(myGuitar);
window['scale'] = scale;
console.log(scale);
function buildChord(name) {
    var chordResults = scale.getChord(name);
    console.log(chordResults);
    var div = document.createElement('div');
    document.body.appendChild(div);
    var header = document.createElement('h1');
    header.innerText = name;
    div.style.border = 'solid 1px';
    div.appendChild(header);
    var neck = new G.GuitarNeck(myGuitar, div);
    chordResults.major.forEach(function (x) { return neck.addStrumMarker(x).attr('opacity', .50); });
    chordResults.p4.forEach(function (x) { return neck.addStrumMarker(x).attr('fill', 'blue').attr('opacity', .50); });
    chordResults.p7.forEach(function (x) { return neck.addStrumMarker(x).attr('fill', 'green').attr('opacity', .50); });
}
console.log('buildChord');
buildChord(G.MusicNoteName.C);
buildChord(G.MusicNoteName.D);
buildChord(G.MusicNoteName.E);
buildChord(G.MusicNoteName.F);
buildChord(G.MusicNoteName.G);
buildChord(G.MusicNoteName.A);
buildChord(G.MusicNoteName.B);
//
