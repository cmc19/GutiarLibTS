import {Guitar} from './Guitar';
import {GuitarStrum} from './GuitarStrum';

export module WellKnownChords {

    let standardGuitar = Guitar.GetNormalGuitar();


    let s = (y) =>  standardGuitar.getStrum(y);
    let x = undefined;

    export var D = s([2, 3, 2, 0, x, x]);
    export var A = s([0, 2, 2, 2, 0, x]);
    export var C = s([0, 1, 0, 2, 3, x]);
    export var E = s([0, 0, 1, 2, 2, 0]);
}
