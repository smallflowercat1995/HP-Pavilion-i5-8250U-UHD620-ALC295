/* Kumquat Hub Content Router
 * 
 **/

(function (undefined) {

    pl.extend(ke.app, {
        import: [
            'ext.tpl',
            'ext.event',
            'ext.audio',
            'ext.dom',
            'ext.string',
            'ext.googleApi',

            'ext.const.lang',

            'ext.util.selectorsUtil',
            'ext.util.langUtil',
            'ext.const.netflix_langs',

            'bg_events.audio',

            'particles.listen.lModel',
            'particles.translate_ctt.tcModel',
            'particles.scrollbars.sModel',
            'particles.3dots_button.3dotsModel',
            'particles.3dots_button.3dotsView',

            'ui_components.scrollbar.scrollbar',
            'ui_components.tooltip.simple',
            'ui_components.tooltip.helpSelected',
            'ui_components.notifications',

            's:ui_components.contextMenu',
            'lib.contextMenu'
        ],

        tts_link: (function () {
            const isHttps = window.location.protocol === 'https:';
            return (isHttps ? 'https' : 'http') + '://translate.google.com/translate_tts?ie=UTF-8&q={{text}}&tl={{lang}}&total={{textparts}}&idx=0&textlen={{textlen}}&client=dict-chrome-ex&prev=input&ttsspeed={{dictation_speed}}';
        })(),
        translation_link: '',
        getCountry: function () {
            return 'com';
        },

        callbacksInitialization: {},

        flags: {
            isCurrentTranslationMulti: false,
            tt_transUtterancePermission: false,
            isPlayingTooltipTrans: false,
            netflix_player_loaded: false,
            dark_mode: false,
            show_netflix: true
        },

        temp: {
            iframes: [],
            windows: [],
            documents: [],
            currentDetectedLang: '',
            to_lang: '',
            netflix_title: '',
            netflix_subtitles_lang: 'auto',
            netflix_subtitles_fontsize: '28px',
            bottom_controls_height: '104px',
            landing_href: '',
            subtitle_update_int: null,
            scale: 0.75,
            wordlist_id: null
        },

        get bodyScrollLeft() {
            return document.documentElement.scrollLeft || document.body.scrollLeft || 0;
        },

        get bodyScrollTop() {
            return document.documentElement.scrollTop || document.body.scrollTop || 0;
        },

        init: function () {
            ke.ext.util.storageUtil.chainRequestBackgroundOption([
                {fn: 'isTrueOption', args: ['gdpr_consent']}, // 0
                {fn: 'isTrueOption', args: ['chr_pro_flag']}, // 1
                {fn: 'getIntValue', args: ['trial_start']}, // 2
                {fn: 'isTrueOption', args: ['trial_started']}, // 3
                {fn: 'isTrueOption', args: ['dark_mode']}, // 4
                {fn: 'isTrueOption', args: ['netflix']}, // 5
                {fn: 'isTrueOption', args: ['zendesk_user']}
            ], function (responses) {
                var is_pro = responses[1].response;
                var trial_start = responses[2].response;
                var trial_started = responses[3].response;
                var zendesk_user = responses[6].response;

                ke.app.flags.dark_mode = responses[4].response;
                ke.app.flags.show_netflix = responses[5].response;

                // TODO
                // replace subtitle capturing with mutation observer, too
                // instead of setIntervals

                ke.app.temp.landing_href = document.location.href;

                if (ke.app.temp.landing_href.indexOf('netflix.com') > -1) {
                    new MutationObserver(function (mutations) {
                        mutations.forEach(function () {
                            ke.app.handlers.netflix.handleNavigation();
                        });
                    }).observe(document.querySelector('body'), {
                        childList: true,
                        subtree: true
                    });
                }

                if (!zendesk_user && document.location.href.indexOf('zendesk.com') > -1) {
                    ke.app.handlers.checkZendeskTickets();
                }

                $(window).dblclick(ke.app.handlers.onDoubleClick);

                ke.ui.tooltip.simple._bindCloseEvent();

                if (ke.IS_SAMSUNG) {
                    $(window).on('touchend',ke.app.handlers.onSelection);
                }

                $(window).on('mouseup', ke.app.handlers.onSelection);

                if (!ke.IS_SAMSUNG) {
                    ke.ext.event.listen(ke.EF, ke.EF, ke.app.handlers.onKeyCombinationClick);
                }

                ke.app.initBackgroundEventListener();

                ke.app.initNetflixSubtitleTranslator();
            });

            window.addEventListener("message", function (event) {
                // We only accept messages from ourselves
                if (event.source != window) {
                    return;
                }

                if (event.data.action && event.data.action === 'goog-loaded') {
                    ke.app.handlers.googleWidgetLoaded(event.data.lang);
                }
            });
        },

        initBackgroundEventListener: function () {
            chrome.runtime.onMessage.addListener(function (data, sender, sendResponse) {
                var parts = ke.parseProcessCall(data.action);
                (ke.app.handlers._processEventHandlers[parts.lib][parts.cmd][parts.exact] || ke.EF)(data, sendResponse);
            });
        },

        initNetflixSubtitleTranslator: function () {
            if (ke.app.flags.show_netflix
                && document.location.href.indexOf('https://www.netflix.com/watch/') > -1
                && !ke.app.flags.netflix_player_loaded) {

                var p = setInterval(function () {
                    var $subtitle_btn = $('.button-nfplayerSubtitles');

                    if ($subtitle_btn.length > 0 && ke.app.flags.netflix_player_loaded) {
                        clearInterval(p);

                        var t = setInterval(function () {
                            // try to open the subtitle language settings
                            document.querySelector('.button-nfplayerSubtitles').dispatchEvent(new Event('click'));

                            var $active_subtitles_lang = $('.track-list-subtitles .track.selected');

                            if ($active_subtitles_lang.length > 0) {
                                clearInterval(t);

                                ke.app.handlers.netflix.setNewParsedSubtitleLang($active_subtitles_lang.text());
                                ke.app.handlers.netflix.fetchWordlistId();

                                // close subtitle settings
                                document.querySelector('.button-nfplayerSubtitles').dispatchEvent(new Event('click'));

                                $subtitle_btn.on('click mouseover', ke.app.handlers.netflix.onSubtitlesLangChange);
                            }
                        }, 1000);
                    }
                }, 1000);

                var i = setInterval(function () {
                    var $subtitle_wrap = $('.VideoContainer .player-timedtext');

                    if ($subtitle_wrap.length > 0) {
                        clearInterval(i);

                        $('body').addClass(ke.getPrefix() + 'with-mate-subtitles');

                        ke.app.temp.netflix_title = $('.video-title h4').text();
                        ke.app.temp.netflix_episode_code = $('.video-title span:eq(0)').text();
                        ke.app.temp.netflix_episode_name = $('.video-title span:eq(1)').text();

                        ke.app.flags.netflix_player_loaded = true;

                        ke.app.temp.subtitle_update_int = setInterval(function () {
                            var $pieces = $subtitle_wrap.find('.player-timedtext-text-container span');

                            // it's correct
                            ke.app.temp.bottom_controls_height = $('.PlayerControlsNeo__bottom-controls').css('height');

                            if ($pieces.length > 0) {
                                ke.app.temp.netflix_subtitles_fontsize = $pieces.css('font-size');
                                ke.app.handlers.netflix.parseAndShowSubtitle($pieces);
                            } else {
                                ke.app.handlers.netflix.showClickableSubtitle(''); // hide titles
                            }
                        }, 100);
                    }
                }, 1000);
            }
        }
    });

})();
