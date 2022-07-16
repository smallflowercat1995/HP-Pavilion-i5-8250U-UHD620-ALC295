/*
 * Kumquat Kernel
 * 
 * Copyright, 2012, Chernikov Alexey - http://github.com/chernikovalexey
 * 
 * Provides routing and managing of all in-extension processes, a few useful
 * APIs, such as User-storage, Web SQL DB API Wrap, Cache.
 * 
 * For its proper work requires Prevel
 * (http://github.com/chernikovalexey/Prevel).
 */

(function (win, doc, undefined) {

    // PRIVATE

    // Common variables
    // Template for extending storages
    var ext_o_storage = {
        current: '',
        cl: [],
        list: {}
    };

    // Empty function
    var ef = function () {
    };

    // Do not create separate data storage for them
    var excludes = 'data,ext,ui'.split(',');

    // Common functions
    // Length of the given object
    // Examples: getObjectLength({a: 2, b: 3}) => 2
    var getObjectLength = function (o) {
        if (pl.type(o, 'obj')) {
            var l = 0;
            for (var key in o) {
                ++l;
            }
            return l;
        } else {
            return o.length;
        }
    };

    // ======
    // PUBLIC

    // Extend window with `ke`
    // General structure of `ke`;
    // perhaps, some properties will be reassigned
    win.ke = {
        data: {},     // Data container

        app: {},      // Object with mvc of the current hub
        ui: {},       // User-Interface

        import: {},   // Import given script/style

        ext: {},      // Object with user-created extensions
        utils: {},
        db: {},       // Wrapper for Web SQL DB API
        idb: {},
        us: {},       // User-storage with objects
        nav: {}       // Navigation on ordinary pages
    };

    for (var key in win.ke) {
        if (!~pl.inArray(key, excludes)) {
            ke.data[key] = {};
        }
    }

    var ALPHABET = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';

    function getRandomString(length) {
        var result = '';
        for (var i = length; i > 0; --i) {
            result += ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
        }
        return result;
    }

    win.indexedDB = win.indexedDB || win.mozIndexedDB || win.webkitIndexedDB || win.msIndexedDB;
    win.speechRecognition = win.SpeechRecognition || win.mozSpeechRecognition || win.webkitSpeechRecognition || win.msSpeechRecognition;

    if (typeof win.msBrowser !== 'undefined') {
        win.chrome = msBrowser;
    } else if (typeof browser !== 'undefined') {
        win.chrome = browser;
    }

    var PROTOCOLS = {
        "chrome": "chrome-extension://",
        "opera": "chrome-extension://",
        "edge": "ms-browser-extension://",
        "firefox": "moz-extension://",
        "safari": "safari-extension://",
        "samsung": "internet-extension://"
    };

    var IDB_RW = "readwrite";
    var IDB_RO = "readonly";

    ke.loadExternalScript = function (src, callback) {
        var script = document.createElement("script");
        script.setAttribute("src", src);
        script.setAttribute("type", "text/javascript");
        script.addEventListener("load", function () {
            callback(true);
        });
        var e = document.getElementsByTagName("script")[0];
        e.parentNode.insertBefore(script, e);
    };

    /*
     * Module: import (inherently, it's an analogue of `import` in Java)
     *
     * Provides: - Organizing queues of files to be loaded; - Loading queue after
     * Dom ready; - Supports .js and .css; - Storing history of loaded files; -
     * Reacting with firing callback when queue is loaded.
     */

    ke.import = (function () {
        return function (src, callback) {
            return new ke.import.add(src, callback || ef);
        };
    })();

    pl.extend(ke.import, {
        ready: [],

        // Prefix before the path to file (e.g. root:kernel.kernel)
        // Now root is the only supported prefix
        get prefix() {
            return ~pl.inArray(ke.section, ke.data.kernel.save.internal_pages) ? ke.getConst('ROOT_PREFIX') : '';
        },

        // JS or CSS
        parseType: function (src) {
            src = src.replace(/\./g, '/');

            var response;

            if (src.substr(0, 2) === ke.getConst('STYLE_PREFIX')) {
                response = src.substr(2) + '.css';
            } else if (src.substr(5, 2) === ke.getConst('STYLE_PREFIX')) {
                response = 'root:' + src.substr(7) + '.css';
            } else {
                response = src + '.js';
            }

            return response;
        },

        addRes: function (src) {
            var prefix = '';
            var slash = '/';

            // Note: safari extension base uri is something like safari-extension://com.matetranslate.app-8Z3C7JGUA6/c182555d/
            // using absolute url will remove the last hash in base uri, and cause a 404 for that url
            // so make sure all urls are prefixed with ke.pathToExt
            if (ke.IS_SAFARI) {
                prefix = ke.pathToExt;
                slash = '';
            }

            if (src.substr(0, 5) === ke.getConst('ROOT_PREFIX')) {
                prefix = ke.pathToExt;
                slash = '';
                src = src.substr(5);
            }

            return prefix + (src.substr(src.length - 4) === '.css' ? slash + 'res/styles/' : slash + 'src/') + src;
        },

        add: function (src, callback) {
            src = ke.import.prefix + src;

            var root = src.substr(0, 5) === ke.getConst('ROOT_PREFIX');

            src = ke.import.addRes(ke.import.parseType(src));

            var file_name = src.split('/').pop().split('.')[0];
            var parent = src.replace(ke.pathToExt, '/').split('/')[2];

            if (~pl.inArray(src, ke.data.import.loaded)) {
                return;
            }

            if (ke.deploy[parent] && ke.deploy[parent].before) {
                ke.deploy[parent].before(file_name, src.split('/').splice(-2, 1)[0]);
            } else {
                ke.deploy[parent] = {after: ef};
            }

            ke.import.ready.push(0);

            if (root) {
                if (ke.IS_FIREFOX) {
                    chrome.runtime.sendMessage({
                        action: ke.processCall('app', 'opt', 'attactContentFile'),
                        src: src
                    }, function () {
                        ke.deploy[parent].after(file_name, src.split('/').splice(-2, 1)[0]);
                        callback();
                        ke.import.ready.pop();
                    });
                } else {
                    pl.ajax({
                        url: src,
                        type: 'GET',
                        success: function (data) {
                            if (src.substr(src.length - 4) === '.css') {
                                pl('<style>', {
                                    type: 'text/css'
                                }).html(data).appendTo('head');
                            } else {
                                // Mozilla!
                                // Please note eval is only used in non-Firefox browsers
                                // There's an `if` statement above
                                // Firefox sends request to the background page that subsequently injects required scripts via WebExtensions API
                                win.eval(data);
                            }

                            ke.deploy[parent].after(file_name, src.split('/').splice(-2, 1)[0]);
                            callback();
                            ke.import.ready.pop();
                        },
                        error: function (err_code, err_text) {
                        }
                    });
                }
            } else {
                pl.attach({
                    url: src,
                    load: function (u, t) {
                        if (!pl.type(u, 'str')) {
                            callback();
                            ke.import.ready.pop();
                            return;
                        }

                        ke.data.import.loaded.push(
                            !pl.empty(ke.data.import.queue_name) ?
                                [ke.data.import.queue_name, u] :
                                u
                        );

                        ke.import.ready.pop();
                        ke.deploy[parent].after(file_name, src.split('/').splice(-2, 1)[0]);
                        callback();
                    }
                });
            }

            return ke.import;
        },

        // Optional for import: fire callback when everything is loaded
        onDone: function (callback) {
            var int = setInterval(function () {
                if (pl.empty(ke.import.ready)) {
                    clearInterval(int);
                    callback && callback();
                }
            }, 10);
        },

        // Loaded files as an array
        getLoaded: function () {
            return ke.data.import.loaded;
        }
    });

    /*
     * Module: data (based on basic objects)
     *
     * Provides storing: - kernel settings; - current flags (dom loaded, ...); -
     * user containers (`ke.storage`).
     */

    pl.extend(ke.data.import, {
        loaded: []
    });

    pl.extend(ke.data.db, ext_o_storage);
    pl.extend(ke.data.idb, ext_o_storage);
    pl.extend(ke.data.us, ext_o_storage);

    var navigator_name = navigator.appVersion.match('Chrome/([0-9\.]+)')
        || navigator.userAgent.match('Firefox/([0-9\.]+)');

    pl.extend(ke.data, {

        // Kernel storage
        kernel: {
            'const': {
                STYLE_PREFIX: 's:',
                ROOT_PREFIX: 'root:',
                KERNEL_DB: 'KE_Kernel',

                VERBOSE: true
            },

            flags: {
                dom_loaded: false,
                kumquat_ready: false
            },

            info: {
                url: doc.location.href,
                ver: navigator_name ? navigator_name[1] : "(?)",
                lang: navigator.language,

                get id() {
                    if (ke.IS_FIREFOX) return chrome.i18n.getMessage("@@extension_id");
                    // Note: have to copy some code from `safari_browser.js`
                    // Because it's the only code that uses extension API and also run before `safari_browser.js` is loaded
                    if (ke.IS_SAFARI) return safari.extension.baseURI.replace(/^safari-extension:\/\/|\/$/g, '');

                    return chrome.runtime.id;
                }
            },

            // Public kernel data
            save: {
                internal_pages: ['content']
            }
        }
    });

    pl.extend(ke.data.kernel.info, {
        get section() {
            return ke.data.kernel.info.url.match(PROTOCOLS[ke.PLATFORM_CODE])
                ? ke.data.kernel.info.url.match(/([A-z0-9]+)\.html/)[1]
                : (win.KumquatSection || 'content');
        }
    });

    /*
     * Public kernel functions and getters
     *
     */

    pl.extend(ke, {
        // A logger, which can be easily turned off
        log: function () {
            if (ke.getConst('VERBOSE')) {
                console.log.apply(console, arguments);
            }
        },

        // Main init
        init: function () {
            if (ke.getFlag('kumquat_ready')) {
                return;
            }

            // Get and execute additional init
            ke.import('kernel.init').onDone(function () {
                ke.loadCurrentHub();
                ke.data.kernel.save.user_init();
            });

            // Flags
            ke.setFlagTrue('kumquat_ready');
        },

        get section() {
            return ke.data.kernel.info.section;
        },

        get extId() {
            return ke.data.kernel.info.id;
        },

        get staticExtId() {
            if (ke.IS_SAFARI) return this.extId.split('/')[0];
            if (ke.IS_FIREFOX) return chrome.runtime.getManifest().applications.gecko.id;

            return this.extId;
        },

        get redirectableExtId() {
            if (ke.IS_SAFARI) return this.staticExtId;

            return this.extId;
        },

        get browserLang() {
            var ul = window.navigator.language;
            return ul.split('-')[0].split('_')[0];
        },

        // en_GB => en, zh-CW => zh
        simplifyLC: function (c) {
            return c.split('-')[0].split('_')[0];
        },

        isMac: window.navigator.platform.indexOf('Mac') > -1,
        isWindows: window.navigator.platform.indexOf('Win') > -1,
        //isAndroid: window.navigator.platform.indexOf('Win') > -1,

        IS_CHROME: true,      // Is Chrome
        IS_OPERA: false,       // Is Opera
        IS_SAFARI: false,      // Is Safari
        IS_EDGE: false,        // Is Edge
        IS_FIREFOX: false,     // Is Firefox
        IS_SAMSUNG: false,     // Is Samsung Internet

        PLATFORM_CODE: 'chrome',

        get browserName() {
            if (ke.IS_CHROME) {
                return "Chrome";
            } else if (ke.IS_OPERA) {
                return "Opera";
            } else if (ke.IS_FIREFOX) {
                return "Firefox";
            } else if (ke.IS_EDGE) {
                return "Edge";
            } else if (ke.IS_SAFARI) {
                return "Safari";
            } else if (ke.IS_SAMSUNG) {
                return "Samsung Internet";
            }

            return "Unknown";
        },

        get currentBrowser() {
            return ke.browserName + ' ' + ke.data.kernel.info.ver;
        },

        // Where `chrome.extension.getURL` does not fit
        get pathToExt() {
            // New Chromium-based Edge is pretending to be Chrome
            if (window.navigator.userAgent.toLowerCase().indexOf('edg/') > -1) {
                return PROTOCOLS.chrome + ke.extId + '/';
            } else {
                return PROTOCOLS[ke.PLATFORM_CODE] + ke.extId + '/';
            }
        },

        TIME: {
            ONE_DAY: 86400000,
            ONE_MONTH: 2629746000
        },

        is_touch_device: function () {
            try {
                document.createEvent("TouchEvent");
                return true;
            } catch (e) {
                return false;
            }
        },

        generateUserId: function (part_len, parts_amount) {
            var parts = [];
            for (var i = 0; i < parts_amount; ++i) {
                parts.push(getRandomString(part_len));
            }
            return parts.join("-");
        },

        getFlag: function (n) {
            return ke.data.kernel.flags[n];
        },

        // Create a new flag, if it does not exist
        createFlag: function (n, def_val) {
            if (pl.type(ke.data.kernel.flags[n], 'undef')) {
                ke.data.kernel.flags[n] = !pl.type(def_val, 'undef') ? def_val : false;
            }
        },

        setFlagTrue: function (n) {
            if (!pl.type(ke.data.kernel.flags[n], 'undef')) {
                ke.data.kernel.flags[n] = true;
            }
        },

        setFlagFalse: function (n) {
            if (!pl.type(ke.data.kernel.flags[n], 'undef')) {
                ke.data.kernel.flags[n] = false;
            }
        },

        getConst: function (where, n) {
            if (!n) {
                n = where;
                where = 'data.kernel';
            }

            var tmp = ke;
            var p = where.split('.');
            pl.each(p, function (k, v) {
                tmp = tmp[v];
            });

            return tmp['const'][n.toUpperCase()];
        },

        loadCurrentHub: function () {
            // Scripts
            // Note: Whatever hub it is, import safari_browser.js to polyfill chrome extension api
            if (ke.IS_SAFARI) {
                ke.import('ext.const.safari_locales');
                ke.import('ext.compatibility.safari_browser');
            }
            ke.import('hub.' + ke.section + '.router');
            ke.import('hub.' + ke.section + '.render');
            ke.import('hub.' + ke.section + '.handlers').onDone(function () {
                var ready = [];

                (ke.app.asyncInit || ke.EF)();

                var toImport = ke.app.import || [];

                pl.each(toImport, function (k, v) {
                    ready.push(0);
                    ke.import(v).onDone(function () {
                        ready.pop();
                    });
                });

                var int = setInterval(function () {
                    if (pl.empty(ready)) {
                        clearInterval(int);
                        ke.app.init();

                        // Styles
                        if (ke.section !== 'background') {
                            var path = (ke.section === 'content' || ke.section === window.KumquatSection ? 'internal' : 'public') + '.' + ke.section;
                            ke.import('s:pages.common.main');
                            ke.import('s:pages.' + path);
                        }
                    }
                }, 10);
            });
        },

        getResource: function (p) {
            return '/res/' + p;
        },

        getImage: function (n) {
            return this.getResource('images/' + n + '.png');
        },

        getInternalPage: function (n) {
            return '/pages/internal/' + n + '.html';
        },

        isProcessCall: function () {
            // Converting arguments from object to an array
            var args = Array.prototype.slice.call(arguments, 0);
            var action = args[0];
            args.splice(0, 1);
            return action === ke.processCall.call(ke, args);
        },

        processCall: function () {
            var p = [];
            pl.each(arguments, function (k, v) {
                p.push(v);
            });
            return p.join(',');
        },

        parseProcessCall: function (command) {
            if (!command) {
                return {
                    lib: '',
                    cmd: '',
                    exact: ''
                };
            }

            var tmp = command.split(',');
            var f = {
                lib: tmp[0],
                cmd: tmp[1],
                exact: tmp[2]
            };
            return f;
        },

        getLocale: function () {
            var message = chrome.i18n.getMessage.apply(chrome, arguments);

            if (ke.IS_SAFARI) {
                message = decodeURIComponent(message);

                if (window._locales) {
                    var locale = ke.getCurrentLocale(true);
                    var string_obj = (window._locales[locale] || window._locales['en'])[arguments[0]];

                    if (string_obj && string_obj.placeholders) {
                        for (var key in string_obj.placeholders) {
                            message = message.replace('$' + key + '$', arguments[parseInt(string_obj.placeholders[key].content.replace('$', ''), 10)]);
                        }
                    }
                }
            }

            return message;
        },

        // Two variants which fires..:
        // - before loading the script/style
        // - after its loading
        deploy: {
            hub: {
                before: function (n) {
                    if (n === 'router') {
                        pl.extend(ke.app, {
                            render: {},    // Attach events, organize ui
                            handlers: {}  // Function called by events, render
                        });
                    }
                },

                after: ef
            },

            ext: {
                before: function (n, prev) {
                    if (prev !== 'ext') {
                        ke.ext[prev] = ke.ext[prev] || {};
                        ke.ext[prev][n] = {};
                    } else {
                        ke.ext[n] = {};
                    }
                },

                after: function (n, prev) {
                    pl.each((ke.ext[prev] ? ke.ext[prev][n].import : ke.ext[n].import) || [], function (k, v) {
                        ke.import(v);
                    });
                }
            },

            // UI is not ready yet, but let it be here...
            ui: {
                before: ef,
                after: ef
            }
        }
    });

    /*
     * Module: utils
     *
     * Provides: utils
     */

    pl.extend(ke.utils, {
        getObjectSize: function (obj) {
            var c = 0;
            for (var i in obj) ++c;
            return c;
        }
    });

    /*
     * Module: db (useful api for web sql database)
     *
     * Provides: - Adding new databases - Executing requests to the selected db -
     * Deleting db
     */

    // Simple size parsing from a string (5 mb => 5242880)
    var parseSize = function (s) {
        if (pl.type(s, 'int') || pl.type(s, 'undef')) {
            return s;
        }

        var t = s.split(' ');
        var to = t.pop().toLowerCase();

        return t[0] * Math.pow(1024, to === 'mb' ? 2 : 1);
    };

    pl.extend(ke.db, {
        choose: function (name, size) {
            ke.data.db.current = name;
            size = parseSize(size) || 5 * Math.pow(1024, 2);

            if (!ke.data.db.list[name]) {
                ke.data.db.list[name] = openDatabase(name, '1.0.0', name + ' database', size);

                if (!ke.data.db.list[name]) {
                    pl.error('Could not connect to the database.');
                }
            }

            return ke.data.db.list[name];
        },

        get selected() {
            return ke.data.db.current;
        },

        get currentDb() {
            return !pl.empty(ke.data.db.list) ?
                ke.data.db.list[ke.data.db.current] :
                null;
        },

        execSql: function (req, s, o, f) {
            ke.db.currentDb.transaction(function (tx) {
                tx.executeSql(req, s, function (tx, res) {
                    (o || ef)(res);
                }, function (tx, err) {
                    (f || ef)(err);
                });
            });
        }
    });

    pl.extend(ke.idb, {
        structs: {},

        def_obj_struct: function (name, struct) {
            this.structs[name] = struct;
        },

        open: function (db_name, tables_and_indices, ver, callback) {
            try {
                var request = win.indexedDB.open(db_name, ver);

                ke.idb.cache[db_name] = {};

                request.onupgradeneeded = function (e) {
                    var this_db = e.target.result;

                    for (var table in tables_and_indices) {
                        if (!this_db.objectStoreNames.contains(table)) {
                            this_db.createObjectStore(table, {autoIncrement: true});
                        }

                        var store = e.target.transaction.objectStore(table);
                        for (var index in tables_and_indices[table]) {
                            if (!store.indexNames.contains(index)) {
                                store.createIndex(index, index, {unique: tables_and_indices[table][index]});
                            }
                        }
                    }
                };

                request.onsuccess = function (e) {
                    ke.data.idb.list[db_name] = e.target.result;
                    callback();
                };

                request.onerror = function (e) {
                    console.log("Could not open IDB...");
                    console.dir(request.error);
                };
            } catch (e) {
                console.log('Indexed DB Open Error:', e);
            }
        },

        check_struct: function (obj, struct_name) {
            for (var key in this.structs[struct_name]) {
                if (!(key in obj)) return false;
            }

            for (var key in obj) {
                if (!(key in this.structs[struct_name])) return false;
            }

            return true;
        },

        add: function (db_name, table, obj, obj_struct_name, callback) {
            var db = ke.data.idb.list[db_name];

            if (db && this.structs[obj_struct_name] && this.check_struct(obj, obj_struct_name)) {
                var request = db.transaction([table], IDB_RW)
                    .objectStore(table)
                    .add(obj);

                request.onsuccess = function (e) {
                    callback(e.target.result, obj);
                };

                request.onerror = function (e) {
                    console.log('error add:', obj, e);
                };
            } else {
                callback(null, null);
                console.error("Db not found or obj_struct_name not defined");
            }
        },

        "get": function (name, table, id, callback) {
            var db = ke.data.idb.list[name];

            if (db) {
                var request = db.transaction([table], IDB_RO)
                    .objectStore(table)
                    .get(id);

                request.onsuccess = function (event) {
                    callback(event.target.result);
                };
            }
        },

        ARITH_ADD_UPDATE_TYPE: 1,
        DEFAULT_UPDATE_TYPE: -1,
        ADD_FIELD_UPDATE_TYPE: 2,

        update: function (db_name, table, primaryKey, values, callback) {
            var db = ke.data.idb.list[db_name];

            if (db) {
                var store = db.transaction([table], IDB_RW)
                    .objectStore(table);

                store.get(primaryKey).onsuccess = function (e) {
                    var v = e.target.result;

                    for (var key in values) {
                        if (v[key] !== undefined) {
                            if (pl.type(values[key], 'obj') && values[key].update_type && values[key].update_type !== ke.idb.DEFAULT_UPDATE_TYPE) {
                                if (values[key].update_type === ke.idb.ARITH_ADD_UPDATE_TYPE) {
                                    v[key] += values[key].value;
                                }
                            } else {
                                v[key] = values[key];
                            }
                        } else if (values[key].update_type === ke.idb.ADD_FIELD_UPDATE_TYPE
                            && ke.idb.structs[values[key].struct]
                            && ke.idb.structs[values[key].struct].hasOwnProperty(key)) {
                            v[key] = values[key].value;
                        }
                    }

                    var put_request = store.put(v, primaryKey);

                    put_request.onsuccess = function (event) {
                        callback(v, event.target.result);
                    };
                };
            }
        },

        findAndDel: function (db_name, table, search_values, callback, comp_type) {
            ke.idb.search(db_name, table, search_values, function (items) {
                var ids = [];
                items.forEach(function (v) {
                    ids.push(v.id);
                });
                ke.idb.del(db_name, table, ids, callback);
            }, comp_type);
        },

        findAndUpdate: function (db_name, table, search_values, update_values, callback, comp_type) {
            ke.idb.search(db_name, table, search_values, function (items) {
                var updated_items = [];
                items.forEach(function (v) {
                    ke.idb.update(db_name, table, v.id, update_values, function (obj, id) {
                        obj.id = id;
                        updated_items.push(obj);
                    });
                });

                var i = setInterval(function () {
                    if (updated_items.length === items.length) {
                        clearInterval(i);
                        callback(updated_items);
                    }
                }, 10);
            }, comp_type);
        },

        del: function (db_name, table, keys, callback) {
            if (keys.length === 0) {
                callback(false);
                return;
            }

            var db = ke.data.idb.list[db_name];

            if (db) {
                var transaction = db.transaction([table], IDB_RW);
                var store = transaction.objectStore(table);

                keys.forEach(function (key) {
                    store.delete(key);
                });

                transaction.oncomplete = function (e) {
                    callback(true);
                };
            }
        },

        clear: function (db_name, table, callback) {
            var db = ke.data.idb.list[db_name];

            if (db) {
                var request = db.transaction([table], IDB_RW)
                    .objectStore(table)
                    .clear();

                request.onsuccess = function (e) {
                    callback();
                };
            }
        },

        "enum": function (db_name, table, max_len, bounds, descending_order, callback) {
            var db = ke.data.idb.list[db_name];

            if (db) {
                var transaction = db.transaction([table], IDB_RO);
                var object_store = transaction.objectStore(table);
                var cursor_request = object_store.openCursor(bounds, 'prev');

                var items = [];

                cursor_request.onerror = function (e) {
                    console.log('cursor error', e);
                };

                cursor_request.onsuccess = function (e) {
                    var cursor = e.target.result;

                    if (cursor && items.length <= max_len) {
                        var v = cursor.value;
                        v.id = cursor.primaryKey;

                        items.push(v);
                        cursor.continue();
                    }
                };

                transaction.oncomplete = function () {
                    if (descending_order) {
                        items.reverse();
                    }

                    callback(items);
                };
            }
        },

        COMP_OR: 1,
        COMP_AND: 2,

        UPPER_BOUND: 1,
        LOWER_BOUND: 2,

        cache: {},

        search: function (db_name, table, search_values, callback, comp_type, bounds, max_len, descending_order, order_by) {
            var db = ke.data.idb.list[db_name];

            comp_type = comp_type || ke.idb.COMP_OR;
            max_len = max_len || Number.MAX_VALUE;

            if (db) {
                ke.idb.cache[db_name][table] = ke.idb.cache[db_name][table] || {};

                var key = JSON.stringify(search_values);
                var items = [];

                var oncomplete = function (from_cache) {
                    // TODO
                    // Enable manual cache control
                    if (!from_cache && items.length > 150) {
                        ke.idb.cache[db_name][table][key] = items;
                    }

                    if (bounds && order_by) {
                        var res = [];

                        items.forEach(function (item) {
                            if (bounds[0] === ke.idb.UPPER_BOUND && item[bounds[1]] < bounds[2]) {
                                res.push(item);
                            } else if (bounds[0] === ke.idb.LOWER_BOUND && item[bounds[1]] > bounds[2]) {
                                res.push(item);
                            }
                        });

                        items = res;
                    }

                    if (order_by) {
                        items.sort(function (a, b) {
                            if (!a[order_by] || !b[order_by]) return 0;
                            return b[order_by] - a[order_by];
                        });
                    }

                    if (descending_order) {
                        items.reverse();
                    }

                    if (max_len) {
                        items = items.slice(0, max_len);
                    }

                    callback(items);
                };

                if (ke.idb.cache[db_name][table][key]) {
                    items = ke.idb.cache[db_name][table][key];
                    oncomplete(true);
                } else {
                    var transaction = db.transaction([table], IDB_RO);
                    var store = transaction.objectStore(table);
                    var cursor_request = store.openCursor(null, 'prev');

                    cursor_request.onsuccess = function (e) {
                        var cursor = e.target.result;

                        if (cursor) {
                            if (pl.type(search_values, 'fn')) {
                                if (search_values(cursor.value)) {
                                    var v = cursor.value;
                                    v.id = cursor.primaryKey;
                                    items.push(v);
                                }
                            } else {
                                var or_ok = false;
                                var and_ok = true;

                                for (var key in search_values) {
                                    if ((pl.type(search_values[key], 'str') && cursor.value[key].toLowerCase().indexOf(search_values[key].toLowerCase()) > -1)
                                        || (pl.type(search_values[key], 'int') && cursor.value[key] === search_values[key])
                                        || (pl.type(search_values[key], 'fn') && search_values[key](cursor.value[key]))
                                        || (pl.type(search_values[key], 'bool') && cursor.value[key] === search_values[key])) {

                                        or_ok = true;
                                    } else {
                                        and_ok = false;
                                    }
                                }

                                if ((comp_type === ke.idb.COMP_AND && and_ok)
                                    || (comp_type === ke.idb.COMP_OR && or_ok)) {

                                    var v = cursor.value;
                                    v.id = cursor.primaryKey;
                                    items.push(v);
                                }
                            }

                            cursor.continue();
                        }
                    };

                    transaction.oncomplete = function () {
                        oncomplete(false);
                    };
                }
            } else {
                callback(null, true);
            }
        },

        exists: function (db_name, table, key_val, values, callback, pass_obj) {
            var db = ke.data.idb.list[db_name];

            if (db) {
                var transaction = db.transaction([table], IDB_RO);
                var store = transaction.objectStore(table);

                var request;
                if (key_val.length === 2) {
                    var index = store.index(key_val[0]);
                    request = index.openCursor(IDBKeyRange.only(key_val[1]));
                } else {
                    request = store.openCursor(null, 'prev');
                }

                request.onsuccess = function (e) {
                    var cursor = e.target.result;

                    if (cursor) {
                        var has = true;
                        for (var key in values) {
                            if (!((key === 'id' && cursor.primaryKey === values[key]) || values[key] === cursor.value[key])) {
                                has = false;
                                break;
                            }
                        }

                        if (has) {
                            callback(true, cursor.primaryKey, cursor.value, pass_obj);
                            transaction.abort();
                        } else {
                            cursor.continue();
                        }
                    }
                };

                transaction.oncomplete = function () {
                    callback(false, null, null, pass_obj);
                };

                request.onerror = function (e) {
                    callback(false, null, null, pass_obj);
                    console.log('exists check error:', e);
                };
            } else {
                callback(false, null, null, pass_obj);
            }
        }
    });

    /*
     * Module: nav (navigation between ordinary pages)
     *
     * Provides: - Redirecting to the given page.
     */

    pl.extend(ke.nav, {
        go: function (pagename, delay) {
            setTimeout(function () {
                doc.location = '/pages/public/' + pagename + '.html';
            }, delay || 0);
        }
    });

// Initialize Kumquat (immediately, on dom is ready, on window is loaded)
    if (!ke.getFlag('kumquat_ready')) {
        ke.init();
    }

    pl(function () {
        ke.setFlagTrue('dom_loaded');
        ke.init();
    });

    $(window).on('load', function () {
        if (!ke.getFlag('kumquat_ready')) {
            ke.init();
        }
    });

})(this, document);