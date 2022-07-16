/* Kumquat Hub Window Router
 *
 **/

(function (undefined) {
    pl.extend(ke.app, {
        import: [
            'ext.const.lang',
            'ext.const.selectors',
            'ext.const.storage',
            'ext.util.langUtil',
            'ext.util.selectorsUtil',
            'ext.util.storageUtil',

            'ext.tpl',
            'ext.event',
            'ext.audio',
            'ext.input',
            'ext.errorManager',
            'ext.dom',
            'ext.string',
            'ext.googleApi',
            'ext.clipboard',
            'ext.compatibility.storage',

            'bg_events.audio',

            'particles.lang_selectors.lsView',
            'particles.lang_selectors.lsModel',
            'particles.listen.lModel',
            'particles.translate.tModel',
            'particles.tr_input.trView',
            'particles.tr_input.trModel',
            'particles.scrollbars.sModel',
            'particles.stt.sttModel',
            'particles.3dots_button.3dotsModel',
            'particles.3dots_button.3dotsView',

            'ui_views.i18n',
            'ui_views.empty_trans_states',

            'ui_components.tooltip.modal',
            'ui_components.dropdown.dropdown',
            'ui_components.scrollbar.scrollbar',
            'ui_components.pro_alert',
            'ui_components.loading',
            'ui_components.login',
            'ui_components.notifications',

            'lib.siriwave',

            's:ui_components.contextMenu',
            'lib.contextMenu'
        ],

        temp: {
            currentDetectedLang: '',
            valueBeforeAutocorrection: '',
            account_token: '',

            // compatibility with buggy FF
            prev_window_size: {
                w: null,
                h: null
            }
        },

        SHORTCUTS: {
            SEL_FROM: 'ctrl+alt',
            SEL_TO: 'ctrl+space',
            CLEAR: 'alt+c',
            SWAP: 'alt+s',
            LISTEN_RAW: 'alt+q',
            LISTEN_TRANS: 'alt+a'
        },

        // Will be extended on init
        flags: {
            isPrevTranslationMulti: false,
            isCurrentTranslationMulti: false,
            rawUtterancePermission: false,
            transUterrancePermission: false,

            isTranslating: false,
            isPlayingRaw: false,
            isPlayingTrans: false,
            shortcutsProceeding: false,
            isAutocorrected: false,

            clearFadedOut: false,

            forceShowKeysSettingTooltip: false,

            shownTSL: false,
            isNarrow: false,

            shouldHideSttButtonAfterEnd: false,

            pro: false
        },

        prevInput: '',
        $chars_used: $('.used-chars'),
        $input: $('.translation-input'),
        $main_wrap: $('#main-wrap'),
        siriWave: null,
        $stt_button: $('.toggle-stt'),
        $email_layout: $('.email-layout'),
        $no_results: $('.no-results-cap'),

        // It will initialized directly from binding functions
        callbacksInitialization: {},

        tts_link: (function () {
            const isHttps = window.location.protocol === 'https:';
            return (isHttps ? 'https' : 'http') + '://translate.google.com/translate_tts?ie=UTF-8&q={{text}}&tl={{lang}}&total={{textparts}}&idx=0&textlen={{textlen}}&client=dict-chrome-ex&prev=input&ttsspeed={{dictation_speed}}';
        })(),
        translation_link: '',

        getCountry: function () {
            return 'com';
        },

        init: function () {
            if (ke.IS_FIREFOX && document.location.hash === "#unpinned_") {
                document.location.hash = "#unpinned";
                document.location.reload();
            }

            if (ke.IS_SAMSUNG) {
                $('.dark-mode-switcher').remove();
                $('.right-part').css('height', ($('body').height() - ($('.left-part').height() + $('.top-wrap').height())) + 'px')
            }

            ke.ext.util.storageUtil.chainRequestBackgroundOption([
                {fn: 'isTrueOption', args: ['gdpr_consent']}, 
                {fn: 'isTrueOption', args: ['seen_tour']},
                {fn: 'getVal', args: ['account_token']},
                {fn: 'isTrueOption', args: ['supress_signin']},
                {fn: 'isTrueOption', args: ['chr_pro_flag']},
                {fn: 'getVal', args: ['user_country']},
                {fn: 'getIntValue', args: ['trial_start']},
                {fn: 'isTrueOption', args: ['trial_started']},
                {fn: 'isTrueOption', args: ['dark_mode']},
                {fn: 'isTrueOption', args: ['instant']},
                {fn: 'isTrueOption', args: ['save']}
            ], function (r) {
                var is_gdpr = r[0].response;
                var is_pro = r[4].response;
                var dark_mode = r[8].response;
                
                ke.app.temp.account_token = r[2].response;

                ke.app.flags.instant = r[9].response;
                ke.app.flags.save = r[10].response;

                ke.app.render.organize.tryShowSponsorshipBar();

                ke.app.initInstant();
                ke.app.initValues();

                ke.app.flags.pro = is_pro;

                if (dark_mode) {
                    $('body').addClass('dark-mode');
                }
            });

            document.title = "Mate Translate Unpinned";
            ke.app.render.organize.toggleUnpinLink();

            ke.app.render.organize.adjustSwapWidth();

            this.siriWave = new SiriWave({
                container: $('.stt-layout').get(0),
                width: ke.IS_SAMSUNG ? parseInt($('.action-bar').css('width')) - 43 : 249,
                height: 19,
                speed: 0.1,
                color: '#01E9AF',
                amplitude: 0
            });

            ke.ext.event.listen(ke.EF, ke.EF, ke.EF);

            if (!ke.supportsOnlineAnalytics) {
                ke.import('lib.ga', ke.initAnalytics);
            } else {
                ke.loadExternalScript(ke.analyticsScriptLink, ke.initAnalytics);
            }

            ke.app.render.organize.ctrlHistoryLinkVisibility();

            this.initDropdown();

            ke.particles.listen.model.ctrlRawVisibility();
            ke.particles.listen.model.ctrlTransVisibility();

            if (!ke.is_touch_device()) {
                ke.particles.scrollbars.model.setupTranslationScroll();
            } else {
                $('#tr-scrollbar').remove();
            }

            ke.app.render.events.swap();
            ke.app.render.events.toggleTextareaFocus();
            ke.app.render.events.enableRawListen();
            ke.app.render.events.listen();
            //ke.app.render.events.listenTranslation();
            ke.app.render.events.onHistoryLinkClick();
            ke.app.render.events.onSettingsLinkClick();
            ke.app.render.events.onUnpinLinkClick();
            $('.ht').on('click', ke.app.handlers.onHtLinkClick);
            ke.app.render.events.shortcuts();
            ke.app.render.events.clearInput();
            ke.app.render.events.dontAutocorrect();
            ke.app.render.events.countTextLength();
            //ke.app.render.events.fetchUserEmailWindowEvents();

            ke.app.render.events.showArticleUpgrade();
            ke.app.render.events.showIpaUpgrade();

            $('.open-phrasebook').on('click', ke.app.handlers.onPhrasebookOpen);
            $('.ac-close').on('click', ke.app.handlers.closeAutocorrection);
            $('.toggle-stt').on('click', ke.particles.stt.model.toggle);
            $('.lang-swap').attr('title', ke.isMac ? 'Cmd+Shift+S' : 'Ctrl+Shift+S');
            $('.dark-mode-switcher').on('click', ke.app.handlers.toggleDarkMode);
            $('.translation-input').keyup(ke.app.handlers.adjustOriginalIpa);

            ke.app.render.organize.fadeInElements();

            if (!ke.IS_SAMSUNG) {
                ke.app.render.events.onResize();
            }

            ke.ext.util.storageUtil.chainRequestBackgroundOption([
                {fn: 'isTrueOption', args: ['chr_pro_flag']},
                {fn: 'getVal', args: ['to_lang']},
                {fn: 'isTrueOption', args: ['window_shortcut_shown']},
            ], function (r) {
                ke.app.flags.pro = r[0].response;
                ke.app.temp.toLang = r[1].response;
            });

            ke.app.handlers.onResize();

            ke.ui_views.i18n.init();
        },

        initValues: function () {
            //
            // try retrieving selected text on the active page
            //

            chrome.tabs.query({active: true}, function (tabs) {
                var tab = tabs.shift();

                if (tab && tab.id) {
                    if (tab.url.indexOf('.pdf') > -1) {
                        ke.ext.util.storageUtil.requestBackgroundOption('getIntValue', ['no_pdf_shows'], function (no_pdf_shows) {
                            if (no_pdf_shows < 2) {
                                if (ke.IS_CHROME) {
                                    ke.ui.notifications.show(ke.getLocale('Window_CannotTranslatePDFChrome'), 3500);
                                } else {
                                    ke.ui.notifications.show(ke.getLocale('Window_CannotTranslatePDF').replace('{{browser}}', ke.browserName), 3500);
                                }

                                ke.ext.util.storageUtil.requestBackgroundOption('setVal', ['no_pdf_shows', no_pdf_shows + 1]);

                                if (typeof ga != "undefined") ga('send', 'event', 'window', 'cannot-translate-pdf');
                            }
                        });

                        ke.app.initSavedValue(ke.app.initEmptyCap);
                    } else {
                        chrome.tabs.sendMessage(tab.id, {
                            action: ke.processCall('app', 'trans', 'getSelectedText')
                        }, function (text) {
                            ke.app.initSavedValue(ke.app.initEmptyCap, text);

                            if (typeof ga != "undefined") ga('send', 'event', 'translation', 'window', 'selected-on-page');
                        });
                    }
                }
            });
        },

        initInstant: function () {
            if (this.flags.instant) {
                ke.particles.translate.model.ctrlInstantVisibility('hide');
                ke.app.render.events.translateOnKeyup();
            } else {
                ke.app.render.events.translateOnClick();
                ke.app.render.events.translateOnKeyCombinations();
            }
        },

        initDropdown: function () {
            ke.ui.dropdown.init(
                ke.particles.lang_selectors.model.onLangDropdownChange,
                [ke.particles.lang_selectors.model.onOpen, ke.EF],
                function (type, data, callback) {
                    ke.particles.lang_selectors.view.fillDropdown(type, type, data, ke.ext.const.lang.list, callback);
                },
                '',
                function () {
                    $('.rm-recent').unbind().bind('click', ke.particles.lang_selectors.model.removeRecentLanguage);
                }
            );
        },

        // preserve value on window close
        // if user selected something on a web page,
        // pick it up and translate in this window, too
        initSavedValue: function (callback, text) {
            if (this.flags.save) {

                ke.app.render.events.saveValueOnKeyup();

                // enable saving value by listening to keystrokes
                // on init, show either the selected text picked up on a page (higher priority)
                // or the previously saved input value
                ke.particles.tr_input.view.displaySaveValue(function (is_empty) {
                    callback(is_empty);
                    ke.app.handlers.countTextLength();
                    ke.particles.translate.model.translateSimple();
                    ke.app.handlers.adjustOriginalIpa();
                }, text);
            } else if (text) {
                // don't listen to keystrokes
                // condition points to the not empty selection
                // so, only picked up selection will be shown
                ke.particles.tr_input.view.displaySaveValue(function (is_empty) {
                    callback(is_empty);
                    ke.app.handlers.countTextLength();
                    ke.particles.translate.model.translateSimple();
                    ke.app.handlers.adjustOriginalIpa();
                }, text);
            } else {
                // empty input
                // because no value is saved
                // show only the controls needed
                // focus the field and put the caret at the end anyways
                ke.app.handlers.countTextLength();
                $('.translation-input').focus();
                callback(true);
            }
        },

        initEmptyCap: function (isEmpty) {
            if (isEmpty) {
                setTimeout(function () {
                    ke.ui_views.empty_trans_states.displayEmptiness();
                    ke.app.handlers.toggleRawControls(true);
                }, 10);
            }
        },

        getCurrentFromLang: function () {
            return ke.ext.util.langUtil.getFromLang() === 'auto'
                ? ke.app.temp.currentDetectedLang
                : ke.ext.util.langUtil.getFromLang();
        }
    });
})();
