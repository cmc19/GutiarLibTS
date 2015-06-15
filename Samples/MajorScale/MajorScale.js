/// <reference path="../../typings/raphael/raphael.d.ts"/>
var G = require('../../out/Index');
require('../../out/Browser');
var myGuitar = G.Guitar.GetNormalGuitar();
var scale = new G.MajorScale(myGuitar);
window['scale'] = scale;
console.log(scale);
function buildChord(name) {
    console.time(G.noteMath.getNoteNameAsString(name));
    var chordResults = scale.getFretInfo(name);
    console.log(chordResults);
    var div = document.createElement('div');
    document.body.appendChild(div);
    var header = document.createElement('h1');
    header.innerText = G.noteMath.getNoteNameAsString(name);
    div.style.border = 'solid 1px';
    div.appendChild(header);
    header.style.padding = '0px';
    header.style.paddingLeft = '30px';
    header.style.margin = '0px';
    var neck = new G.GuitarNeck(myGuitar, div);
    chordResults.major.forEach(function (x) { return neck.addStrumMarker(x).attr('opacity', .8); });
    chordResults.p4.forEach(function (x) { return neck.addStrumMarker(x).attr('fill', 'blue').attr('opacity', .60); });
    chordResults.p7.forEach(function (x) { return neck.addStrumMarker(x).attr('fill', 'green').attr('opacity', .33); });
    var strums = scale.getStrumList(name);
    strums = strums.filter(function (x) { return x.rate() > 0; });
    strums = G.util.orderBy(strums, function (x) { return 0 - x.rate(); });
    //Comment out below to include chords that skip string.
    strums = strums.filter(function (x) { return x.skipCount == 0; });
    var chordViewSize = G.ChordView.DefaultSize;
    chordViewSize = G.ChordView.scaleSize(1.4);
    strums.forEach(function (strum) {
        var strumDiv = document.createElement('div');
        strumDiv.classList.add('strumDiv');
        var span = document.createElement('span');
        span.innerText = strum.rate().toString();
        div.appendChild(strumDiv);
        var div2 = document.createElement('div');
        strumDiv.appendChild(div2);
        var chord = new G.ChordView(strum, div2, chordViewSize);
        chord.showLetters();
        strumDiv.addEventListener('click', function () {
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
window['buildChordTest'] = function () {
    console.profile();
    buildChord(G.MusicNoteName.D);
    console.profileEnd();
};
//
