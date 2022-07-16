/* Kumquat Kernel Additional Init
 * 
 * To avoid interfering the internal work of ./kernel.js user-init (additional) is passed to
 * another file (this).
 * 
 * It might be useful, if you have something that must initialized on every page or 
 * something like that.
 **/

(function (undefined) {
    if (!ke.IS_SAFARI) {
        var o_gu = chrome.extension.getURL;

        chrome.extension.getURL = function (u) {
            var url = o_gu(u);
            if (url.indexOf("-extension") > -1) {
                url = u;
            }

            return url;
        };
    }

    /*if (ke.IS_FIREFOX) {
        var window_open = window.open;
        window.open = function () {
            var popup_window = window_open.apply(window, arguments);

            try {
                popup_window.focus();
            } catch (e) {
                chrome.windows.create({
                    url: chrome.extension.getURL(arguments[0]),
                    left: 10,
                    top: 10,
                    width: 550,
                    height: 550
                });
            }
        };
    }*/

    if (ke.IS_FIREFOX && ke.section !== 'window') {
        window.close = function () {
            chrome.tabs.getCurrent(function (tab) {
                chrome.tabs.remove(tab.id, function () {
                });
            });
        };
    }

    // Will be fired along with ordinary Kernel Init
    ke.data.kernel.save.user_init = function () {
        ke.idb.def_obj_struct('translation', {
            l_from: '',
            l_to: '',
            input: '',
            it_resp: [],
            time: 0,
            server_id: 0,
            pending_removal: false,
            sources: {}
        });

        ke.idb.def_obj_struct('wordlist', {
            from: '',
            to: '',
            name: '',
            last_update: Date.now(),
            created: Date.now(),
            phrases_count: 0,
            server_id: 0,
            pending_removal: false
        });

        ke.idb.def_obj_struct('phrase', {
            parent_wordlist_key: 0, // id of the parent wordlist
            text: '',               // original text
            translation: '',        // translation
            json: {},               // our native translation json here
            added: Date.now(),      // timestamp, used to sort words
            server_id: '',
            usageExample: '',
            pending_removal: false
        });

        ke.idb.def_obj_struct('langsite', {
            timestamp: 0,
            country: '',
            locale: '',
            site: '',
            is_pro: false,
            count: 0,
            platform: '',
            uploaded: false
        });

        if (ke.section !== 'content') {
            try {
                ke.idb.open('it', {
                    history: {
                        l_from: false,
                        l_to: false,
                        time: false,
                        input: false,    // index for input w/ unique == false
                        server_id: false // index for server_id w/ unique == false
                    },

                    wordlists: {
                        from: false,
                        to: false,
                        last_update: false,
                        server_id: false
                    },

                    phrases: {
                        parent_wordlist_key: false,
                        server_id: false
                    },

                    langsites: {
                        site: false
                    }
                }, 33, function () {
                });
            } catch (e) {
            }
        }

        // Complicated system of extensions
        pl.extend(ke.ext.const, {});
        pl.extend(ke.ext.util, {});
        pl.extend(ke.ext.compatibility, {});

        // Additional kernel parts
        pl.extend(ke, {
            particles: {},
            ui_views: {},
            templates: {}
        });

        // Particles initialization
        var so = {
            view: {},
            model: {}
        };

        pl.extend(ke.particles, {
            lang_selectors: $.extend({}, so),
            lang_swap: $.extend({}, so),
            listen: $.extend({}, so),
            translate: $.extend({}, so),
            stt: $.extend({}, so),
            sync: {model: {}, ui_model: {}},
            three_dots: $.extend({}, so),
            pro_block: $.extend({}, so),
            upgradeTt: $.extend({}, so),
            tr_input: $.extend({}, so),
            translate_ctt: $.extend({}, so),
            scrollbars: $.extend({}, so),
            context: $.extend({}, so),
            sett_int_allvar: $.extend({}, so),
            sett_int_instant: $.extend({}, so),
            sett_int_save: $.extend({}, so),
            sett_trans_combo: $.extend({}, so),
            sett_trans_context: $.extend({}, so),
            sett_trans_history: $.extend({}, so),
            sett_tabber: $.extend({}, so),
            hist_list: $.extend({}, so),
            hist_opt_delete: $.extend({}, so),
            hist_search: $.extend({}, so)
        });

        // UI Views initialization
        pl.extend(ke.ui_views, {
            i18n: {},
            multi_variant: {},
            empty_trans_states: {},
            visibility: {}
        });

        // Extend UI for new components, but not inherited from previous projects
        pl.extend(ke.ui, {
            tooltip: {
                simple: {},      // Core of all underwritten stuff
                modal: {},       // A modal window
                help: {},        // Exactly, a tooltip
                confirm: {},     // A modal window with two yes/no buttons
                helpSelected: {} // A tooltip, appending near the selected text and containing html code inside instead of plain text
            },
            toggle: {},
            pro_alert: {},
            info_alert: {},
            notifications: {},
            loading: {},
            login: {}
        });

        if (ke.is_touch_device()) {
            $('html').addClass('touch');
        } else {
            $('html').addClass('no-touch');
        }
    };

    // Standard empty function as a substitution of undefined callbacks
    pl.extend(ke, {
        EF: function () {
        }
    });

    // Application constants
    const APP_CONST = {
        DB: 'It_DbVault',
        T_HISTORY: 'History',

        CHR_PRO_SKU: 'instant_translate_pro',
        CHR_PRO_OLD_SKU: 'it_pro',

        //
        // Animation constants

        ANIM_TYPE_SLIDE_UP: 'easeInOutQuint',
        ANIM_TYPE_SLIDE_DOWN: 'easeInOutQuint',
        ANIM_TYPE_FADE_OUT: 'easeOutExpo',
        ANIM_TYPE_FADE_IN: 'easeOutExpo',
        ANIM_TYPE_REL_MOVE: 'easeInExpo',

        ANIM_SPEED_SLIDE_UP: 150,
        ANIM_SPEED_SLIDE_DOWN: 150,
        ANIM_SPEED_FAST_SLIDE_UP: 90,
        ANIM_SPEED_FAST_SLIDE_DOWN: 90,
        ANIM_SPEED_FADE_OUT: 115,
        ANIM_SPEED_FADE_IN: 115,
        ANIM_SPEED_FAST_FADE_OUT: 55,
        ANIM_SPEED_FAST_FADE_IN: 55
    };

    const EEA_LIST = {
        at: true,
        be: true,
        bg: true,
        hr: true,
        cy: true,
        cz: true,
        dk: true,
        ee: true,
        fi: true,
        fr: true,
        de: true,
        gr: true,
        hu: true,
        ie: true,
        it: true,
        lv: true,
        lt: true,
        lu: true,
        mt: true,
        nl: true,
        pl: true,
        pt: true,
        ro: true,
        sk: true,
        si: true,
        es: true,
        se: true,
        gb: true
    };

    pl.extend(ke, {
        getAppConst: function (n) {
            return APP_CONST[n.toUpperCase()];
        }
    });

    // ===================
    // Some common methods

    // Add common constants
    pl.extend(ke.data.kernel.const, {
        PREFIX: 'TnITTtw'
    });

    var tracking_codes = {
        "Chrome": "UA-66061856-6",
        "Chrome Pro": "UA-66061856-9",
        "Opera": "UA-66061856-7",
        "Edge": "UA-66061856-8",
        "Firefox": "UA-66061856-10",
        "Safari": "UA-66061856-16",
        "Samsung Internet": "UA-66061856-19"
    };

    pl.extend(ke, {
        DEBUG: false,

        FREE_LIMIT: 500,

        share_links: {
            fb: 'http://www.facebook.com/sharer/sharer.php?u=<%=link%>',
            tw: 'https://twitter.com/intent/tweet?url=<%=link%>&text=<%=text%>&via=MateTranslate',
            vk: 'https://vk.com/share.php?url=<%=link%>'
        },

        get isChrome() {
            return ke.IS_CHROME || ke.IS_CHROME_PRO;
        },

        get isChromePro() {
            return ke.IS_CHROME_PRO
                || ke.ext.util.storageUtil.isTrueOption("chr_pro_flag");
        },

        get canSync() {
            return ke.ext.util.storageUtil.isTrueOption('sync')
                && ke.ext.util.storageUtil.isTrueOption("chr_pro_flag")
                && ke.ext.util.storageUtil.getVal('account_token');
        },

        get storeLink() {
            if (ke.IS_CHROME) {
                return 'https://chrome.google.com/webstore/detail/instant-translate-select/ihmgiclibbndffejedjimfjmfoabpcke';
            } else if (ke.IS_OPERA) {
                return 'https://addons.opera.com/de/extensions/details/instant-translate-2';
            } else if (ke.IS_EDGE) {
                return 'https://www.microsoft.com/store/p/instant-translate-select-and-translate/9pj8vl1pqs7v?rtc=1';
            } else if (ke.IS_FIREFOX) {
                return 'https://addons.mozilla.org/firefox/addon/instant-translate/';
            } else if (ke.IS_SAFARI) {
                return 'https://safari-extensions.apple.com/details/?id=com.matetranslate.app-S8B638MM79';
            } else if (ke.IS_SAMSUNG) {
                return 'http://apps.samsung.com/appquery/appDetail.as?appId=com.gikken.matesamsung';
            }

            return '';
        },

        inRange: function (min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        },

        get analyticsScriptLink() {
            return "https://www.google-analytics.com/analytics.js";
        },

        get supportsOnlineAnalytics() {
            return ke.IS_CHROME || ke.IS_OPERA || ke.IS_EDGE;
        },

        initAnalytics: function () {
            if (typeof ga === 'undefined') {
                return;
            }

            ga('create', ke.getTrackingCode(), 'auto');
            ga('set', 'checkProtocolTask', function () {
            });
            ga('set', 'cAppVersion', chrome.runtime.getManifest().version);
            ga('require', 'displayfeatures');
            ga('send', 'event', 'pageview', ke.section);

            if (ke.section === 'background') {
                ke.app.handlers.sendTranslationsCount();
            }
        },

        getKeyByVal: function (o, v) {
            for (var key in o) {
                if (o[key] == v) return key;
            }
            return null;
        },

        capitalize: function (s) {
            return pl.empty(s) || !s ? '' : s[0].toUpperCase() + s.substr(1).toLowerCase();
        },

        getPrefix: function () {
            return ke.getConst('prefix') + '-';
        },

        getAnimType: function (anim) {
            return ke.getAppConst('anim_type_' + anim);
        },

        getAnimSpeed: function (anim) {
            return ke.getAppConst('anim_speed_' + anim);
        },

        getTrackingCode: function () {
            return tracking_codes[ke.browserName];
        },

        getCurrentLocale: function (simplify) {
            var ul = window.navigator.userLanguage || window.navigator.language;
            return simplify ? ke.simplifyLC(ul) : ul;
        },

        getDeviceData: function (callback) {
            ke.ext.util.storageUtil.chainRequestBackgroundOption([
                {fn: 'getVal', args: ['ext_ver']},
                {fn: 'getVal', args: ['user_id']}
            ], function (r) {
                var ext_ver = r[0].response;
                var user_id = r[1].response;

                callback({
                    d_id: user_id,
                    d_sv: ke.data.kernel.info.ver,
                    d_av: ext_ver,
                    d_platform: ke.PLATFORM_CODE,
                    d_uuid: ke.redirectableExtId
                });
            }, ke.section === 'background');
        },

        // en_GB => en, zh-CW => zh
        simplifyLC: function (c) {
            return c.split('-')[0].split('_')[0];
        },

        isEEA: function (country) {
            return (country in EEA_LIST);
        },

        get TRIAL_DAYS() {
            return 7;
        },

        hasTrialExpired: function (trial_start) {
            return Date.now() - (trial_start || ke.ext.util.storageUtil.getIntValue('trial_start'))
                >= 1000 * 60 * 60 * 24 * ke.TRIAL_DAYS;
        },

        // range = [0, ke.TRIAL_DAYS]
        getTrialDaysLeft: function (trial_start) {
            return Math.max(0, ke.TRIAL_DAYS - Math.trunc((Date.now() - (trial_start || ke.ext.util.storageUtil.getIntValue('trial_start'))) / 1000 / 60 / 60 / 24));
        }
    });

})();