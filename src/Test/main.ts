import * as G from '../Index';
import {GuitarNeck} from '../UI/GuitarNeck';
import {ChordView} from '../UI/ChordView';

import '../Browser';


var myGuitar = G.Guitar.GetNormalGuitar();

var neck = new GuitarNeck(myGuitar, document.getElementById('gneck'));

//neck.drawStrum(G.WellKnownChords.A);
window['neck'] = neck;


var myBass = new G.Guitar();
// myBass.strings = G.src.GuitarString.getGuitarStrings(['G2', 'D2', 'A1', 'E1']);
// var bNeck = new GuitarNeck(myBass);
//bNeck.drawNoteLetters();


(() => {
    var current = false;
    setInterval(function() {
        if (!current) {
            neck.showAllNoteLetters();
            // bNeck.hideAllNoteLetters();
        } else {
            neck.hideAllNoteLetters();
            // bNeck.showAllNoteLetters();

        }
        current = !current;
    }, 3000);
})();



module Tests {
    window['t'] = Tests;

    module A {

        var wkc = G.WellKnownChords;
        var chords = [wkc.A, wkc.C, wkc.D, wkc.E];
        var idx = 0;
        function repeat() {
            neck.drawStrum(chords[idx % chords.length]);
            idx++;
        }


        //setInterval(repeat, 1000);
    }




    export module chord {
        export var cv: ChordView;

        function init() {

            cv = new ChordView(G.WellKnownChords.A);
            cv.appendTo(document.body);

            new ChordView(G.WellKnownChords.C).appendTo(document.body);
            new ChordView(G.WellKnownChords.E).appendTo(document.body);
            new ChordView(G.WellKnownChords.D).appendTo(document.body);
        }
        init();
    }

}

// var te = window['te'] = new G.TabEditor(<HTMLTextAreaElement>document.getElementById('tabEditor'));
// te.initBlank();

let tv = new G.TabEditor(document.getElementById('tabView'),myGuitar);

window['tv']  = tv;

var td = window ['td'] = new G.TabDocument(myGuitar);

td.addStrum(G.WellKnownChords.A);

var m = window['m'] = new G.MajorScale(myGuitar);

var results = m.getChord(G.MusicNoteName.A);

results.major.forEach(x=>neck.addStrumMarker(x).attr('opacity',.50));
results.p4.forEach(x=>neck.addStrumMarker(x).attr('fill','blue').attr('opacity',.50));
results.p7.forEach(x=>neck.addStrumMarker(x).attr('fill','green').attr('opacity',.50));
