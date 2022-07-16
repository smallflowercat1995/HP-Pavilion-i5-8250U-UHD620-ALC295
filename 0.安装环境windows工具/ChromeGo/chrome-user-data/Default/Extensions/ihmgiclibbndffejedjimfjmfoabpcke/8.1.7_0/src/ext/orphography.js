(function (undefined) {
    var _declineTransFromPatcher = {
        // Private common modifiers
        _lc: function (l) {
            return l.toLowerCase();
        },

        _ca: function (l) {
            return ke.capitalize(l);
        },

        // Public

        en: function (l) {
            return _declineTransToPatcher._ca(l);
        },

        de: function (l) {
            return _declineTransToPatcher._ca(l);
        },

        ru: function (l) {
            return _declineTransToPatcher._lc(l);
        },

        uk: function (l) {
            return _declineTransToPatcher._lc(l);
        }
    };

    var _declineTransToPatcher = {
        // Private common modifiers
        _lc: function (l) {
            return l.toLowerCase();
        },

        _ca: function (l) {
            return ke.capitalize(l);
        },

        // Public

        en: function (l) {
            return _declineTransToPatcher._ca(l);
        },

        de: function (l) {
            return _declineTransToPatcher._ca(l);
        },

        ru: function (l) {
            return _declineTransToPatcher._lc(l);
        },

        uk: function (l) {
            return _declineTransToPatcher._lc(l);
        }
    };

    pl.extend(ke.ext.orphography, {
        declineTransTo: function (lang) {
            var patcher = _declineTransToPatcher[ke.ext.util.langUtil.getCurrentUiLang(true)] ||
                _declineTransToPatcher.en;

            return patcher(ke.getLocale('Kernel_Lang_' + ke.ext.util.langUtil.getLangNameByKey(lang)));
        },

        getNumDecl: function (number, titles) {
            number = Math.abs(number);
            var cases = [2, 0, 1, 1, 1, 2];
            return titles[(number % 100 > 4 && number % 100 < 20) ? 2 : cases[(number % 10 < 5) ? number % 10 : 5]];
        }
    });

})();