/// <reference path="../../typings/lodash/lodash.d.ts"/>
import {sortBy} from 'lodash';
export function orderBy<T>(arr: T[], fn: (x: T) => any): T[] {
    return sortBy(arr, x=> fn(x));
}

export function findAllPossibleCombos<T>(a: T[], min: number, max: number = null): T[][] {
    if (max === null) max = a.length;
    max += 1;
    var fn = function(n, src, got, all) {
        if (n == 0) {
            if (got.length > 0) {
                all[all.length] = got;
            }
            return;
        }
        for (var j = 0; j < src.length; j++) {
            fn(n - 1, src.slice(j + 1), got.concat([src[j]]), all);
        }
        return;
    }
    var all = [];
    for (var i = min; i < max; i++) {
        fn(i, a, [], all);
    }
    //all.push(a);
    return all;
}
