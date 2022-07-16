/* Kumquat Hub History Router
 * 
 **/

(function (undefined) {

    pl.extend(ke.app, {
        import: [
            'ext.const.lang',
            'ext.util.langUtil',
            'ext.const.selectors',
            'ext.const.storage',
            'ext.util.selectorsUtil',
            'ext.util.storageUtil',

            'ext.dom',
            'ext.event',
            'ext.tpl',
            'ext.googleApi',
            'ext.time',
            'ext.string',
            'ext.errorManager',
            'ext.cache',
            'ext.arr',
            'ext.file',

            'bg_events.audio',

            'ui_components.tooltip.help',

            'templates.historyListItem',
            'templates.historyEmptyCap',
            'templates.deleteSelectedButton',

            'particles.hist_search.hsView',
            'particles.hist_search.hsModel',
            'particles.hist_list.hlView',
            'particles.hist_list.hlModel',
            'particles.hist_opt_delete.hodModel',
            'particles.listen.lModel',
            'particles.scrollbars.sModel',
            'particles.upgrade_tooltip.upgradeTtModel',
            'particles.sync.syncUiModel',
            'particles.3dots_button.3dotsModel',
            'particles.3dots_button.3dotsView',

            'ui_components.tooltip.modal',
            'ui_components.pro_alert',
            'ui_components.loading',
            'ui_components.login',
            'ui_components.notifications',

            'ui_views.i18n',
            'ui_views.multi_variant',

            's:ui_components.contextMenu',
            'lib.contextMenu'
        ],

        temp: {
            window_height: 0,

            all_items: [],
            expanded: [],
            item_ids: [],
            item_times: [],
            selected: []
        },

        callbacksInitialization: {},

        flags: {
            is_searching: false,
            quick_access_shown: false,
            delete_mode: false,
            all_loaded_cap_exists: false,
            isPlayingTrans: false,
            isPlayingOriginal: false,
            isTickerWrapActive: true,
            isMouseDown: false,
            isShiftDown: false
        },

        tts_link: (function () {
            const isHttps = window.location.protocol === 'https:';
            return (isHttps ? 'https' : 'http') + '://translate.google.com/translate_tts?ie=UTF-8&q={{text}}&tl={{lang}}&total={{textparts}}&idx=0&textlen={{textlen}}&client=dict-chrome-ex&prev=input&ttsspeed={{dictation_speed}}';
        })(),
        translation_link: '',

        getCountry: function () {
            return 'com';
        },

        init: function () {
            if (!ke.supportsOnlineAnalytics) {
                ke.import('lib.ga', ke.initAnalytics);
            } else {
                ke.loadExternalScript(ke.analyticsScriptLink, ke.initAnalytics);
            }

            //ke.app.render.organize.ctrlOptionsVisibility();
            ke.particles.hist_search.model.toggleClearTick();

            ke.ui_views.i18n.init();
            ke.ui_views.i18n.setHistoryTitle();

            ke.app.render.organize.initHistory(false);

            $('.back-button').on('click', ke.particles.hist_list.model.closeItemView);

            ke.ext.util.storageUtil.requestBackgroundOption('isTrueOption', ['sync'], function (sync) {
                if (sync) {
                    $('.sync-button').on('click', ke.app.handlers.sync);

                    if (ke.canSync) {
                        ke.app.handlers.sync();
                    }
                } else {
                    $('.sync-button').hide();
                }
            });

            ke.ext.util.storageUtil.requestBackgroundOption('isTrueOption', ['dark_mode'], function (dark_mode) {
                if (dark_mode) {
                    $('body').addClass('dark-mode');
                }
            });

            ke.app.render.events.onPageScroll();
            ke.app.render.events.toggleMouseOverOption();
            ke.app.render.events.enableDeleteMode();
            ke.app.render.events.onClearHistoryClick();
            ke.app.render.events.onDeleteSelectionClick();
            ke.app.render.events.onClearTickClick();
            ke.app.render.events.onSearchKeyRelease();
            ke.app.render.events.bindDeleteSelectionActions();
            ke.app.render.events.bindQuickAccessBarActions();
            ke.app.render.events.bindScrollingOnGoUpButton();
            ke.app.render.events.bindExport();
            ke.app.render.events.bindDownFastSelection();

            $('.search-options').hide();
        },

        initHistoryList: function (noRetoggle) {
            pl('.listen-layout').remove();

            ke.app.render.events.onItemMouseOver();
            ke.app.render.events.onItemMouseOut();
            ke.app.render.events.onItemClick();
            ke.app.render.events.onDeleteClick();
            ke.app.render.events.onTickerClick();

            if (!noRetoggle) {
                ke.particles.hist_opt_delete.model.toggleSlidingWrap();
            }

            ke.app.render.events.onWindowResize();
            ke.app.handlers.onWindowResize();
        },

        setPageScrollSize: function () {
            pl('#page-vis-scroll').css('height', this.temp.window_height);
            pl('#page-track').css('height', this.temp.window_height - 8);
            pl('#page-scrollbar').css('height', this.temp.window_height);

            ke.particles.scrollbars.model.setupHistoryPageScroll();
        },

        canPerformActions: function () {
            return !this.flags.isTickerWrapActive;
        }
    });

})();