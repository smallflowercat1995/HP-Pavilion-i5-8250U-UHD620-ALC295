/* Kumquat Hub Background Router
 * 
 **/

(function (undefined) {

    pl.extend(ke.app, {
        import: [
            'ext.const.lang',
            'ext.const.storage',
            'ext.util.langUtil',
            'ext.util.storageUtil',

            'ext.compatibility.db',
            'ext.compatibility.storage',

            'ext.googleApi',
            'ext.cache',
            'ext.audio',
            'ext.orphography',
            'ext.event',
            'ext.tpl',
            'ext.money',
            'ext.string',

            'lib.ping',

            'particles.context.ctxModel',
            'particles.sync.syncModel',

            'bg_events.translate',
            'bg_events.audio',
            'bg_events.option',
            'bg_events.opt',
            'bg_events.commands',
            'bg_events.sync',
            'bg_events.phrasebook',

            'particles.lang_selectors.lsView',

            'ui_components.login'
        ],

        temp: {
            menus: {},
            fullpage_menu: null
        },
        callbacksInitialization: {},
        flags: {
            newlyInstalled: false
        },
        country: 'com', // com by default

        tts_link: 'http://translate.google.com/translate_tts?ie=UTF-8&q={{text}}&tl={{lang}}&total={{textparts}}&idx=0&textlen={{textlen}}&client=dict-chrome-ex&prev=input&ttsspeed={{dictation_speed}}',
        translation_link: '',

        getCountry: function () {
            return this.country;
        },

        init: function () {
            if (ke.ext.util.storageUtil.isEmpty('user_id')) {
                var user_id = ke.generateUserId(5, 4);
                ke.ext.util.storageUtil.setVal('user_id', user_id);
            }

            var app_version = chrome.runtime.getManifest().version;

            // v7.0.1 update: Edge doesn't support it either
            if (!ke.IS_SAFARI && !ke.IS_EDGE) {
                chrome.runtime.onUpdateAvailable.addListener(chrome.runtime.reload);
            }

            if (!ke.supportsOnlineAnalytics) {
                ke.import('lib.ga', ke.initAnalytics);
            } else {
                ke.loadExternalScript(ke.analyticsScriptLink, ke.initAnalytics);
            }

            chrome.runtime.onMessage.addListener(ke.app.handlers.onCommandReceived);

            ke.ext.util.storageUtil.initStorage(function () {
                ke.app.handlers.generateDropdownHtml();

                ke.app.initContextMenu();
                ke.app.initFullpageContextMenu();
                ke.app.handlers.checkLangSites(ke.app.initPreviouslyOpenedTabs);

                ke.app.handlers.getProPrice(function () {
                    if (!ke.IS_SAFARI && !ke.IS_SAMSUNG && ke.ext.compatibility.storage.isNewUser()) {
                        // try not to show any kind of onboarding to new users
                        
                        //chrome.tabs.create({url: chrome.extension.getURL('/pages/public/tour.html')});
                    }
                });

                // Don't resend install events from old users
                if (ke.ext.util.storageUtil.getVal('ext_ver')) {
                    ke.ext.util.storageUtil.setVal('install_event', true);
                } else {
                    ke.ext.util.storageUtil.setVal('new_settings_counter', 10);
                }

                ke.ext.util.storageUtil.setVal('ext_ver', app_version);

                ke.app.handlers.sendInstallEvent();

                ke.app.handlers._processEventHandlers.app.translate.resetMonthlyCounter();

                // farewell survey for fresh users on first launch
                ke.app.handlers._processEventHandlers.app.opt.updateUninstallUri();

                // farewell survey for long-term users
                // if they have the app installed for over 4 hours
                setTimeout(function () {
                    ke.ext.util.storageUtil.setVal('farewell_survey', 'https://docs.google.com/forms/d/e/1FAIpQLSeO53ksILQ0Pg6crEdJ5nUiqfaJ_TekJyd1iRfzXYVMXRbgrg/viewform');
                    ke.app.handlers._processEventHandlers.app.opt.updateUninstallUri();
                }, 1000 * 60 * 60 * 4); // 4 hours
            });

            // starting from v8.0.0, no migration anymore
            // it was breaking things
            // not worth spending time to make it work again anyways
            // no people use the super old version
            ke.app.handlers.runSync();

            ke.app.handlers.pickFastestMateServer(function () {
                ke.app.handlers.detectCountry();
                ke.app.handlers.getTTSLink();
            });

            if (!ke.IS_SAFARI) {
                chrome.tabs.onUpdated.addListener(ke.app.handlers.checkInternalPagesRedirectSafari);
            } else {
                safari.application.addEventListener('navigate', ke.app.handlers.checkInternalPagesRedirectSafari, true);
                this.initSafari();
            }
        },

        initSafari: function () {
            // Note: bind events for click on extension icon, and show popover once clicked
            safari.application.addEventListener('command', function (event) {
                if (event.command === 'open-panel') {
                    safari.extension.toolbarItems.forEach(function (item) {
                        if (item.browserWindow === safari.application.activeBrowserWindow) {
                            item.showPopover();

                            // Note: reload popover every time it is shown
                            // so that behaviour is same as Chrome and Firefox
                            if (item.popover) {
                                item.popover.contentWindow.location.reload();
                            }
                        } else {
                            if (item.popover) {
                                item.popover.hide();
                            }
                        }
                    });
                }
            }, false);

            const RESIZE_BAR_ID = 'resizebar';
            // Note: hide extension bar (it's added for resizing windows)
            safari.extension.bars.forEach(function (bar) {
                if (bar.identifier === RESIZE_BAR_ID) {
                    bar.hide();
                }
            });
        },

        initContextMenu: function () {
            for (var menu_id in this.temp.menus) {
                chrome.contextMenus.remove(menu_id);
                delete this.temp.menus[menu_id];
            }

            if (ke.ext.util.storageUtil.isTrueOption('ctx_menu')) {
                var that = this;
                var addContextItem = function (combo, from, to) {
                    var title = ke.getLocale('Kernel_Lang_' + ke.ext.util.langUtil.getLangNameByKey(from))
                        + ' ' + ke.getLocale("Kernel_Context_Into")
                        + ' '
                        + ke.ext.orphography.declineTransTo(to);

                    var id = chrome.contextMenus.create({
                        id: ke.extId + (Math.random() * 1000),
                        title: title,
                        contexts: ['selection'],
                        onclick: ke.particles.context.model.onMenuClick
                    });

                    that.temp.menus[id] = {
                        combo: combo,
                        from: from,
                        to: to
                    };
                };

                var combinations = ke.ext.util.storageUtil.getDecodedVal('add_trans_combinations');
                addContextItem('main', ke.ext.util.langUtil.getFromLang(), ke.ext.util.langUtil.getToLang());

                for (var key in combinations) {
                    if (!pl.empty(combinations[key].from) && !pl.empty(combinations[key].to)) {
                        addContextItem(key, combinations[key].from, combinations[key].to);
                    }
                }
            }
        },

        initFullpageContextMenu: function () {
            if (this.temp.fullpage_menu) {
                chrome.contextMenus.remove(this.temp.fullpage_menu);
                this.temp.fullpage_menu = null;
            }

            if (ke.ext.util.storageUtil.isTrueOption('fullpage')) {
                var lang_name = ke.getLocale('Kernel_Lang_' + ke.ext.util.langUtil.getLangNameByKey(ke.ext.util.langUtil.getToLang()));

                this.temp.fullpage_menu = chrome.contextMenus.create({
                    id: ke.extId + (Math.random() * 1000),
                    title: ke.ext.tpl.compile(ke.getLocale('ContextMenu_FullPage'), {
                        lang: lang_name
                    }),
                    onclick: ke.app.handlers.loadGoogleWidget
                });
            }
        },

        initPreviouslyOpenedTabs: function () {
            if (ke.IS_SAFARI) {
                return;
            }

            var injectIntoTab = function (tab) {
                var content_scripts = chrome.runtime.getManifest().content_scripts[0];
                var scripts = content_scripts.js;

                for (var i = 0, s = scripts.length; i < s; i++) {
                    chrome.tabs.executeScript(tab.id, {
                        file: scripts[i]
                    });
                }

                var styles = content_scripts.css;

                for (var i = 0, s = styles.length; i < s; i++) {
                    chrome.tabs.insertCSS(tab.id, {
                        file: styles[i]
                    });
                }
            };

            chrome.windows.getAll({
                populate: true
            }, function (windows) {
                for (let i = 0, w = windows.length; i < w; i++) {
                    let currentWindow = windows[i];

                    for (let j = 0, t = currentWindow.tabs.length; j < t; j++) {
                        let currentTab = currentWindow.tabs[j];
                        let discarded = typeof currentTab.discarded === 'boolean' && currentTab.discarded;

                        //ms-browser-extension
                        if (!currentTab.url.match(/chrome(-extension)?:\/\//gi) 
                            && !currentTab.url.match(/edge:\/\//gi)
                            && !currentTab.url.match(/ms-browser-extension:\/\//gi)
                            && !currentTab.url.match(/moz-extension:\/\//gi)
                            && !discarded) {

                            injectIntoTab(currentTab);
                        }
                    }
                }
            });
        }
    });

})();