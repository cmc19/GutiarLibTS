import * as G from '../../out/Index';

var myGuitar = G.Guitar.GetNormalGuitar();

var scale = new G.MajorScale(myGuitar);

window['scale'] = scale;
console.log(scale);

import '../../out/Browser';
//
