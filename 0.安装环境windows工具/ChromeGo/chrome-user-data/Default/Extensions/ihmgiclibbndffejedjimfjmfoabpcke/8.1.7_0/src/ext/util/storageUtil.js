(function (undefined) {

    ke.import('ext.const.storage');

    var arrayInsertValAction = function (n, v, a) {
        var temp = pl.JSON(localStorage[ke.getStorageConst(n)]);
        temp[a](v);
        localStorage.setItem(ke.getStorageConst(n), pl.stringify(temp));
    };

    var arrayDeleteValAction = function (n, a) {
        var temp = pl.JSON(localStorage[ke.getStorageConst(n)]);
        temp[a]();
        localStorage.setItem(ke.getStorageConst(n), pl.stringify(temp));
    };

    pl.extend(ke.ext.util.storageUtil, {
        initStorage: function (callback) {
            var got_val, def_val;

            var keys = [];
            for (var key in ke.ext.const.storage) {
                keys.push(key);

                if (!localStorage[ke.ext.const.storage[key]]) {
                    got_val = ke.getStorageDefValue(key);

                    if (pl.type(got_val, 'obj') || pl.type(got_val, 'arr')) {
                        def_val = pl.stringify(got_val);
                    } else {
                        def_val = got_val;
                    }

                    // to prevent saving it to the storage.local
                    // it should not use ke.ext.util.storageUtil.setVal method
                    localStorage.setItem(ke.getStorageConst(key), def_val);
                }
            }

            // Firefox fallback on storage.local
            if (!ke.IS_SAFARI) {
                chrome.storage.local.get(keys, function (items) {
                    for (var key in items) {
                        var def_val = ke.getStorageDefValue(key);

                        if (items[key] && items[key] !== def_val) {
                            ke.ext.util.storageUtil.setVal(key, items[key]);
                        }
                    }

                    callback();
                });
            } else {
                callback();
            }
        },

        saveValue: function (n, v) {
            if (ke.IS_SAFARI) {
                return;
            }

            if (ke.section !== 'background') {
                chrome.runtime.sendMessage({
                    action: ke.processCall('app', 'opt', 'saveSettingsPersistently'),
                    field: n,
                    value: v
                });
            } else {
                ke.app.handlers._processEventHandlers.app.opt.saveSettingsPersistently({field: n, value: v});
            }
        },

        requestBackgroundOption: function (fn, args, cb, is_background) {
            ke.ext.util.storageUtil.chainRequestBackgroundOption([{fn: fn, args: args}], function (responses) {
                cb && cb(responses[0].response);
            }, is_background);
        },

        chainRequestBackgroundOption: function (calls, cb, is_background) {
            if (is_background /*|| ke.IS_FIREFOX*/) {
                var responses = [];

                calls.forEach(function (call) {
                    if (typeof call === "object") {
                        var res =
                            ke.ext.util.storageUtil[call.fn].apply(ke.ext.util.storageUtil, call.args);
                        responses.push({response: res});
                    }
                });
                cb && cb(responses);
            } else {
                chrome.runtime.sendMessage({
                    action: ke.processCall('app', 'opt', 'chainRequestBackgroundOption'),
                    calls: calls
                }, function (data) {
                    cb && cb(data);
                });
            }
        },

        isTrueOption: function (n) {
            return localStorage[ke.getStorageConst(n)] == 'true';
        },

        setOptionAsBoolean: function (n, v) {
            var value = pl.type(v, 'bool') ? v : v == 'true';
            localStorage.setItem(ke.getStorageConst(n), value);
            ke.ext.util.storageUtil.saveValue(n, value);
        },

        isActiveJsonOption: function (n) {
            return !!pl.JSON(localStorage[ke.getStorageConst(n)]).active;
        },

        setActiveJsonValueAsBoolean: function (n, v) {
            var temp = pl.JSON(localStorage[ke.getStorageConst(n)]);
            temp.active = v;
            localStorage.setItem(ke.getStorageConst(n), pl.stringify(temp));
        },

        setJsonField: function (n, f, v) {
            var setNest = function (obj, paths, val) {
                if (paths.length > 1) {
                    setNest(obj[paths.shift()], paths, val);
                } else {
                    obj[paths[0]] = val;
                }
            };

            var temp = pl.JSON(localStorage[ke.getStorageConst(n)]);
            var fields = f.split('.');
            setNest(temp, fields, v);

            var value = pl.stringify(temp);
            localStorage.setItem(ke.getStorageConst(n), value);
            ke.ext.util.storageUtil.saveValue(n, value);
        },

        getJsonField: function (n, f) {
            return pl.JSON(localStorage[ke.getStorageConst(n)])[f];
        },

        setJsonVal: function (n, v) {
            ke.ext.util.storageUtil.setJsonField(n, 'value', v);
        },

        getJsonVal: function (n) {
            return ke.ext.util.storageUtil.getJsonField(n, 'value');
        },

        setVal: function (n, v) {
            localStorage.setItem(ke.getStorageConst(n), v);
            ke.ext.util.storageUtil.saveValue(n, v);
        },

        getVal: function (n) {
            return localStorage[ke.getStorageConst(n)];
        },

        encodeAndSet: function (n, o) {
            var value = pl.stringify(o);
            localStorage.setItem(ke.getStorageConst(n), value);
            ke.ext.util.storageUtil.saveValue(n, value);
        },

        deleteJsonElementByKey: function (n, key) {
            var o = this.getDecodedVal(n);
            delete o[key];
            this.encodeAndSet(n, o);
        },

        getArrayValLen: function (n) {
            return ke.ext.util.storageUtil.getDecodedVal(n).length;
        },

        getDecodedVal: function (n) {
            var o;
            try {
                o = pl.JSON(localStorage[ke.getStorageConst(n)]);
            } catch (e) {
                console.log("Failed to get and decode such a JSON object: " + n);
            }
            return o || {};
        },

        pushArrayVal: function (n, v) {
            arrayInsertValAction(n, v, 'push');
        },

        unshiftArrayVal: function (n, v) {
            arrayInsertValAction(n, v, 'unshift');
        },

        addArrayVal: function (n, v) {
            var temp = this.getDecodedVal(n);

            // Init a new array in case it does not exist
            if (pl.empty(temp)) {
                temp = [];
            }

            var pos = pl.inArray(v, temp);

            if (~pos) {
                var temp2 = [];
                temp2.push(temp[pos]);

                pl.each(temp, function (k, v) {
                    if (pos !== k) {
                        temp2.push(v);
                    }
                });

                temp = temp2;
            } else {
                temp.unshift(v);
            }

            var value = pl.stringify(temp);
            localStorage.setItem(ke.getStorageConst(n), value);
            ke.ext.util.storageUtil.saveValue(n, value);
        },

        popArrayVal: function (n) {
            arrayDeleteValAction(n, 'pop');
        },

        shiftArrayVal: function (n) {
            arrayDeleteValAction(n, 'shift');
        },

        spliceBySearch: function (n, v) {
            var spliced;
            var arr = ke.ext.util.storageUtil.getDecodedVal(n);

            for (var i = 0, len = arr.length; i < len; ++i) {
                if (arr[i] === v) {
                    spliced = arr.splice(i, 1)[0];
                    break;
                }
            }

            var value = pl.stringify(arr);
            localStorage.setItem(ke.getStorageConst(n), value);
            ke.ext.util.storageUtil.saveValue(n, value);

            return spliced;
        },

        setIntValue: function (n, v) {
            this.setVal(n, v + "");
        },

        getIntValue: function (n) {
            return +this.getVal(n);
        },

        incrementIntValue: function (n) {
            var new_val = this.getIntValue(n) + 1;
            this.setVal(n, new_val + "");
            return new_val;
        },

        isEmpty: function (n) {
            return pl.empty(this.getVal(n));
        },

        isEmptyArray: function (n) {
            return pl.empty(this.getDecodedVal(n));
        },

        clear: function() {
            for(var key in localStorage) {
                delete localStorage[key];
            }
        },

        isIntlMonetizationOn: function () {
            return this.isTrueOption('monetization') && ke.getCurrentLocale() !== 'ru';
        }
    })

})();
