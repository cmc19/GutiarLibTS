/// <reference path="../../typings/raphael/raphael.d.ts"/>

import * as G from '../../out/Index';
import '../../out/Browser';



var myGuitar = G.Guitar.GetNormalGuitar();

var scale = new G.MajorScale(myGuitar);


window['scale'] = scale;
console.log(scale);


function buildChord(name: G.MusicNoteName) {

    console.time(G.noteMath.getNoteNameAsString(name));
    let chordResults = scale.getFretInfo(name);
    console.log(chordResults);

    let div = document.createElement('div');
    document.body.appendChild(div);

    let header = document.createElement('h1');
    header.innerText = G.noteMath.getNoteNameAsString(name);
    div.style.border = 'solid 1px';
    div.appendChild(header);

    header.style.padding = '0px';
    header.style.paddingLeft = '30px';
    header.style.margin = '0px';

    var neck = new G.GuitarNeck(myGuitar, div);
    chordResults.major.forEach(x=> neck.addStrumMarker(x).attr('opacity', .8));
    chordResults.p4.forEach(x=> neck.addStrumMarker(x).attr('fill', 'blue').attr('opacity', .60));
    chordResults.p7.forEach(x=> neck.addStrumMarker(x).attr('fill', 'green').attr('opacity', .33));

    let strums = scale.getStrumList(name);

    strums = strums.filter(x=> x.rate() > 0);
    strums = G.util.orderBy(strums, x=> 0 - x.rate());

    //Comment out below to include chords that skip string.
    strums = strums.filter(x=> x.skipCount == 0);



    let chordViewSize = G.ChordView.DefaultSize;
    chordViewSize = G.ChordView.scaleSize(1.4);

    strums.forEach(strum=> {
        let strumDiv = document.createElement('div');
        strumDiv.classList.add('strumDiv');
        let span = document.createElement('span');
        span.innerText = strum.rate().toString();
        div.appendChild(strumDiv);

        let div2 = document.createElement('div');
        strumDiv.appendChild(div2);
        let chord = new G.ChordView(strum, div2,chordViewSize);

        chord.showLetters();
        strumDiv.addEventListener('click', () => {
            neck.clearStrum();
            neck.drawStrum(strum);
        });

        strumDiv.appendChild(span);

    });

    var clearFix = document.createElement('div');
    clearFix.classList.add('clearfix');
    div.appendChild(clearFix);
    console.timeEnd(G.noteMath.getNoteNameAsString(name));
}

console.log('buildChord');

buildChord(G.MusicNoteName.D);
buildChord(G.MusicNoteName.A);
buildChord(G.MusicNoteName.G);
buildChord(G.MusicNoteName.E);

buildChord(G.MusicNoteName.C);
buildChord(G.MusicNoteName.F);
buildChord(G.MusicNoteName.B);

window['buildChord'] = buildChord;
window['buildChordTest'] = () => {
    console.profile();
    buildChord(G.MusicNoteName.D);
    console.profileEnd();
}


//
