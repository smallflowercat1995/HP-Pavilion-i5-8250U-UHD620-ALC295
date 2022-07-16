// Created by Alexey on 10/7/13 at 2:16 PM

(function (undefined) {
    pl.extend(ke.ext.arr, {
        'delete': function (arr, needle) {
            var pos = pl.inArray(needle, arr);
            if (~pos) {
                arr.splice(pos, 1);
            }
            return false;
        },

        clone: function (arr) {
            var new_arr = new Array(arr.length);
            pl.each(arr, function (k, v) {
                new_arr[k] = v;
            });
            return new_arr;
        },

        pushUnique: function (arr, el) {
            if (!~pl.inArray(el, arr)) {
                arr.push(el);
            }
            return arr;
        }
    });
})();