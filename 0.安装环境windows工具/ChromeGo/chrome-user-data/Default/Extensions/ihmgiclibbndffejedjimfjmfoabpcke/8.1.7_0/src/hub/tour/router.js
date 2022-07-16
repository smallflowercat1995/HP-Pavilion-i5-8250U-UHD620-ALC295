/* Kumquat Hub Tour Router
 * 
 **/

(function (undefined) {

    pl.extend(ke.app, {
        import: [
            'ext.const.storage',
            'ext.util.storageUtil',
            'ext.util.langUtil',
            'ext.util.selectorsUtil',

            'ext.const.lang',

            'ext.tpl',
            'ext.event',
            'ext.dom',
            'ext.googleApi',

            'ui_views.i18n',
            'ui_components.dropdown.dropdown',
            'ui_components.ss_selector.ss_selector',
            'ui_components.toggle',
            'ui_components.loading',
            'ui_components.login',
            'ui_components.info_alert',
            'ui_components.tooltip.helpSelected',
            'ui_components.notifications',

            'particles.listen.lModel',
            'particles.translate_ctt.tcModel',
            'particles.3dots_button.3dotsModel',
            'particles.3dots_button.3dotsView',
            'particles.sett_trans_combo.stcView',
            'particles.sett_trans_combo.stcModel',
            'particles.scrollbars.sModel',
            'particles.lang_selectors.lsView',

            'lib.contextMenu',

            's:ui_components.contextMenu',
            's:ui_components.tooltip.simple',
            's:ui_components.tooltip.help',
            's:ui_components.tooltip.helpSelected',
            's:ui_components.tooltip.helpSelected'
        ],

        TABS: 6,
        PDF_TAB_NUM: 4,

        temp: {
            currentBid: 1,
            currentTab: 1
        },

        flags: {
            isTranslating: false
        },

        get bodyScrollLeft() {
            return document.documentElement.scrollLeft || document.body.scrollLeft || 0;
        },

        get bodyScrollTop() {
            return document.documentElement.scrollTop || document.body.scrollTop || 0;
        },

        callbacksInitialization: {},

        init: function () {
            document.title = ke.getLocale("Tour_Title");

            if (!ke.supportsOnlineAnalytics) {
                ke.import('lib.ga', ke.initAnalytics);
            } else {
                ke.loadExternalScript(ke.analyticsScriptLink, ke.initAnalytics);
            }

            ke.app.render.events.gotIt();

            ke.ui.loading.close();

            ke.ui_views.i18n.init();

            ke.app.initCarousel();

            ke.ext.util.storageUtil.requestBackgroundOption('setVal', ['seen_tour', true]);
            ke.ext.util.storageUtil.requestBackgroundOption('setVal', ['selection', true]);

            if (ke.IS_SAFARI) {
                ke.ext.util.storageUtil.setIntValue('trial_start', Date.now());
            }

            chrome.runtime.onMessage.addListener(ke.app.handlers.handleLoginStateChange);

            ke.ext.event.listen(ke.EF, ke.EF, ke.app.handlers.trackShiftT);

            $(window).dblclick(ke.app.handlers.onDoubleClick);
            $(window).on('mouseup', ke.app.handlers.onSelection);

            $('.ia-button').on('click', ke.app.handlers.hideImportanceAlert);

            this.initLanguagePicker();

            window.onbeforeunload = ke.app.handlers.onBeforeUnload;

            if (!ke.IS_CHROME) {
                $('.pdf-tab-related').remove();
            }

            ke.ext.util.storageUtil.chainRequestBackgroundOption([
                {fn: 'getVal', args: ['user_country']},
                {fn: 'getIntValue', args: ['trial_start']},
                {fn: 'isTrueOption', args: ['trial_started']}
            ], function (r) {
                var country = r[0].response;
                var trial_start = r[1].response;
                var trial_started = r[2].response;

                //
                // Safari payment wall
                if (ke.IS_SAFARI) {
                    $('.regular-pro,.gdpr').remove();
                    $('.restore').on('click', ke.particles.pro_block.model.restore);
                    $('.trial-start-button').on('click', ke.app.handlers.startSafariTrial);
                    $('.cbm-6').addClass('c-block-3b-meta');

                    if (trial_started) {
                        ke.app.handlers.hideImportanceAlert();

                        $('.normal-tour').hide();
                        $('.trial-expired').show();

                        if (!ke.hasTrialExpired(trial_start)) {
                            $('.trial-expiration-headline').html(ke.ext.tpl.compile(ke.getLocale('Trial_Expires'), {
                                days: ke.getTrialDaysLeft(trial_start)
                            }));
                        } else {
                            $('.trial-expiration-headline').html(ke.getLocale('Trial_Expired'));
                        }
                    } else {
                        $('.importance-alert').fadeIn(150);
                        $('.trial-expired').hide();
                        $('.normal-tour').show();
                    }
                } else {
                    $('.importance-alert').fadeIn(150);
                    $('.safari-pro').remove();
                    $('.trial-expired').hide();
                    $('.regular-pro').remove();
                }
            });
        },

        initLanguagePicker: function () {
            ke.ui.dropdown.init(
                ke.app.handlers.onLanguagePickerChange,
                [ke.app.handlers.onLanguagePickerOpen, ke.EF],
                function (type, data, callback) {
                    ke.particles.lang_selectors.view.fillDropdown(ke.particles.lang_selectors.view.TYPES.TO, type, null, ke.ext.const.lang.list, callback);
                },
                undefined,
                function () {
                }
            );
        },

        initCarousel: function () {
            for (var i = 1; i <= ke.app.TABS; ++i) {
                if (!ke.IS_CHROME && i === ke.app.PDF_TAB_NUM) continue;

                $('.progress-dots').append($('<div class="progress-dot pd-' + i + '">'));
            }

            var pd_width = $('.progress-dots').css('width');
            $('.progress-dots').css('left', 'calc(50% - ' + pd_width + ' / 2)');

            ke.app.render.organize.showCarouselTab(1);

            $('.to-left').on('click', ke.app.handlers.showPreviousCarouselTab);
            $('.continue, .to-right').on('click', ke.app.handlers.showNextCarouselTab);

            $('.privacy-button').on('click', ke.app.handlers.openPP);
            $('.tos-button').on('click', ke.app.handlers.openToS);
            $('.sign-in').on('click', ke.ui.login.show);
        }
    });

})();