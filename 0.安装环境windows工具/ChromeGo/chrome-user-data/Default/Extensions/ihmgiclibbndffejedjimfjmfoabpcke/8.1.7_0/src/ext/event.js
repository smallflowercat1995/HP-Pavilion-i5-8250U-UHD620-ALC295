(function (undefined) {

    var SPECIAL_KEYS = {
        8: 'backspace',
        9: 'tab',
        13: 'enter',
        16: 'shift',
        17: 'ctrl',
        18: 'alt',
        19: 'pause',
        27: 'escape',
        37: 'left arrow',
        39: 'right arrow',
        38: 'up arrow',
        40: 'down arrow',
        46: 'delete',
        91: 'cmd left',
        93: 'cmd right',
        '91-93': 'cmd',
        106: 'multiply',
        107: 'add',
        109: 'subtract',
        110: '^',
        111: '\\',
        186: ';',
        187: '=',
        188: ',',
        189: '-',
        190: '.',
        191: '/',
        192: '`',
        219: '[',
        221: ']',
        222: '\'',
        220: '\\',
        48: '0', 49: '1', 50: '2', 51: '3', 52: '4', 53: '5', 54: '6', 55: '7', 56: '8', 57: '9',
        33: 'pgup', 34: 'pgdown',
        112: 'f1',
        113: 'f2',
        114: 'f3',
        115: 'f4',
        116: 'f5',
        117: 'f6',
        118: 'f7',
        119: 'f8',
        120: 'f9',
        121: 'f10',
        122: 'f11',
        123: 'f12'
    };

    var MAP = {
        enter: 13,
        shift: 16,
        ctrl: 17,
        alt: 18,
        esc: 27,
        space: 32,
        cmd: [91, 93],
        arrowup: 38,
        arrowdown: 40,
        tilde: 192,
        f1: 112,
        f2: 113,
        f3: 114,
        f4: 115,
        f5: 116,
        f6: 117,
        f7: 118,
        f8: 119,
        f9: 120,
        f10: 121,
        f11: 122,
        f12: 123
    };

    var REG_KEYS = {
        '=': 187,
        '-': 189,
        '0': 48, '1': 49, '2': 50,
        '3': 51, '4': 52, '5': 53,
        '6': 54, '7': 55, '8': 56,
        '9': 57
    };

    var start = 65;
    for (var i = start; i <= start + 25; ++i) {
        MAP[String.fromCharCode(i + 32)] = i;
        REG_KEYS[String.fromCharCode(i + 32)] = i;
    }

    var MOD_KEYS = {
        alt: true,
        ctrl: true,
        shift: true,
        cmd: true,
        f1: true, f2: true, f3: true, f4: true, f5: true, f6: true,
        f7: true, f8: true, f9: true, f10: true, f11: true, f12: true,
        win: true
    };

    var isModificationKey = function (key) {
        return key in MOD_KEYS;
    };

    var isRegularKey = function (key) {
        return key in REG_KEYS;
    };

    pl.extend(ke.ext.event, {
        isKeyCodeLetter: function (key_code) {
            key_code = +key_code;
            return key_code >= start && key_code <= start + 25;
        },

        isControlKey: function (key_code) {
            key_code = +key_code;

            for (var key in MAP) {
                var is_arr = $.isArray(MAP[key]);
                if (!this.isKeyCodeLetter(key_code) && (is_arr ? $.inArray(key_code, MAP[key]) > -1 : MAP[key] === key_code)) {
                    return true;
                }
            }
            return false;
        },

        isValidKeyCode: function (key_code) {
            key_code = +key_code;
            return this.isKeyCodeLetter(key_code) || key_code in SPECIAL_KEYS;
        },

        // for mac cmd
        checkMultipleKeyCodes: function (key_code) {
            return key_code in {91: 0, 93: 0} ? '91-93' : key_code;
        },

        getNicePresentationForKeyCode: function (key_code) {
            if (this.isKeyCodeLetter(+key_code)) {
                return String.fromCharCode(+key_code);
            }

            var found = null;
            for (var key in SPECIAL_KEYS) {
                if (typeof key === 'string' && key.indexOf(key_code) > -1 && key.indexOf('-') > -1) {
                    found = SPECIAL_KEYS[key];
                }
            }

            return found || SPECIAL_KEYS[key_code];
        },

        filter: function (combo) {
            combo = combo.toLowerCase();

            var c_arr = combo.split('+');
            var n_arr = [];
            var reg_key = null;
            var has_mod_key = false;

            for (var i = 0, len = c_arr.length; i < len; ++i) {
                if (isModificationKey(c_arr[i])) {
                    has_mod_key = true;
                    n_arr.push(c_arr[i]);
                } else if (isRegularKey(c_arr[i]) && !reg_key) {
                    reg_key = c_arr[i];
                }
            }

            if (reg_key) {
                n_arr.push(reg_key);
            }

            return has_mod_key && reg_key
                ? n_arr.join('+')
                : '';
        },

        is: function (combo, e) {
            var multi = combo.split('+');
            var is = true;
            var keyCodeMatch;

            pl.each(multi, function (k, v) {
                var variants = v.split('-');
                keyCodeMatch = false;

                pl.each(variants, function (k2, v2) {
                    if (e.keyCode === +v2) {
                        keyCodeMatch = true;
                    }
                });

                if (!keyCodeMatch) {
                    is = false;
                }
            });

            return is;
        },

        IN_STR: 1,
        IN_CODES: 2,

        isDown: function (combo, input_type, keys_down) {
            if (!input_type) input_type = this.IN_STR;

            var keys;

            if (input_type === this.IN_STR) {
                keys = this.getKeyCodeCombinationFromName(combo, false);
            } else if (input_type === this.IN_CODES) {
                keys = combo.split('+');
            }

            for (var i = 0, len = keys.length; i < len; ++i) {
                if (!(keys_down || this.keysDown)[keys[i]]) {
                    return false;
                }
            }

            return true;
        },

        getKeyCodeCombinationFromName: function (combination, do_join) {
            var names = combination.split('+');
            var key_code_combo = [];

            for (var i = 0, len = names.length; i < len; ++i) {
                var code = MAP[names[i].toLowerCase()] || REG_KEYS[names[i].toLowerCase()];
                key_code_combo.push($.isArray(code) ? code.join('-') : code);
            }

            return do_join ? key_code_combo.join('+') : key_code_combo;
        },

        getNameFromKeyCodeCombination: function (code_combo) {
            var codes = code_combo.split('+');
            var names = [];

            for (var i = 0, len = codes.length; i < len; ++i) {
                names.push(ke.capitalize(SPECIAL_KEYS[codes[i]] || ke.getKeyByVal(MAP, codes[i]) || ''));
            }

            return names.join('+');
        },

        getNecessaryInfo: function (event) {
            return {
                keyCode: event.keyCode,
                shiftKey: event.shiftKey,
                ctrlKey: event.ctrlKey,
                altKey: event.altKey
            };
        },

        keysDown: {},

        forget: function () {
            $(document).off('keydown');
            $(document).off('keyup');
            this.keysDown = {};
        },

        isModKey: isModificationKey,
        isRegKey: isRegularKey,

        listen: function (checkDeny, removeValidKey, callback, win) {
            var that = this;

            var clearLetters = function (key_code, down_keys) {
                if (that.isKeyCodeLetter(key_code)) {
                    for (var key in down_keys) {
                        if (that.isKeyCodeLetter(key)) {
                            delete down_keys[key];
                        }
                    }
                }
                return down_keys;
            };

            var clearNonControlKeys = function (key_code, down_keys) {
                if (!that.isControlKey(key_code)) {
                    for (var key in down_keys) {
                        if (!that.isControlKey(key)) {
                            delete down_keys[key];
                        }
                    }
                }
                return down_keys;
            };

            $(win || document).on('keydown', function (event) {
                if (that.isValidKeyCode(event.keyCode)) {
                    clearLetters(event.keyCode, that.keysDown);
                    clearNonControlKeys(event.keyCode, that.keysDown);

                    that.keysDown[that.checkMultipleKeyCodes(event.keyCode)] = true;

                    if (event.metaKey) {
                        that.keysDown['91-93'] = true;
                    }

                    checkDeny(that.keysDown);
                    callback();
                }
            });

            $(win || document).on('keyup', function (event) {
                var kc = event.keyCode;
                var mkc = ke.ext.event.checkMultipleKeyCodes(event.keyCode);

                delete that.keysDown[kc];
                delete that.keysDown[mkc];

                removeValidKey(kc, mkc);
            });
        }
    });

})();