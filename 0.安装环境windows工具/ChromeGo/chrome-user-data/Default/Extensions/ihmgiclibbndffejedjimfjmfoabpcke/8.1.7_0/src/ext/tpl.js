/* Kumquat Extension - Tpl
 * 
 **/

(function (undefined) {

    var parseHtml = function (h) {
        return h.replace(/&lt;/gi, '<').replace(/&gt;/gi, '>');
    };

    pl.extend(ke.ext.tpl, {
        compile: function (str, data) {
            data = data || {};
            str = parseHtml(str);

            for (var key in data) {
                str = str
                    .replace(new RegExp("<%=" + key + "%>", 'g'), data[key])
                    .replace(new RegExp("<%= " + key + " %>", 'g'), data[key]);
            }

            return str;
        }
    });

})();