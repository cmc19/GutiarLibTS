var G = require('../../out/Index');
var myGuitar = G.Guitar.GetNormalGuitar();
var scale = new G.MajorScale(myGuitar);
window['scale'] = scale;
console.log(scale);
require('../../out/Browser');
//
