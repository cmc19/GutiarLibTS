/// <reference path="../../typings/raphael/raphael.d.ts"/>

import * as G from '../../out/Index';
import '../../out/Browser';



var myGuitar = G.Guitar.GetNormalGuitar();

var scale = new G.MajorScale(myGuitar);


window['scale'] = scale;
console.log(scale);


function buildChord(name: G.MusicNoteName) {
    let chordResults = scale.getFretInfo(name);
    console.log(chordResults);

    let div = document.createElement('div');
    document.body.appendChild(div);

    let header = document.createElement('h1');
    header.innerText = G.noteMath.getNoteNameAsString(name);
    div.style.border = 'solid 1px';
    div.appendChild(header);

    header.style.padding = '0px';
    header.style.margin = '0px';

    let neck = new G.GuitarNeck(myGuitar, div);
    chordResults.major.forEach(x=> neck.addStrumMarker(x).attr('opacity', .8));
    chordResults.p4.forEach(x=> neck.addStrumMarker(x).attr('fill', 'blue').attr('opacity', .60));
    chordResults.p7.forEach(x=> neck.addStrumMarker(x).attr('fill', 'green').attr('opacity', .33));
}

console.log('buildChord');

buildChord(G.MusicNoteName.D);
buildChord(G.MusicNoteName.A);
buildChord(G.MusicNoteName.E);

buildChord(G.MusicNoteName.C);
buildChord(G.MusicNoteName.F);
buildChord(G.MusicNoteName.G);
buildChord(G.MusicNoteName.B);


//
