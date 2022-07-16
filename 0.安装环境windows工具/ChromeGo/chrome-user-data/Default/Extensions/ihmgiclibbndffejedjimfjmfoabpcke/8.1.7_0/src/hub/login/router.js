/* Kumquat Hub HT Router
 * 
 **/

(function (undefined) {

    pl.extend(ke.app, {
        import: [
            'ext.const.storage',

            'ext.util.langUtil',
            'ext.util.storageUtil',

            'ext.tpl',
            'ext.event',
            'ext.string',
            'ext.input',

            'ui_views.i18n'
        ],

        temp: {
            checked_email: '',
            device_id: ''
        },

        flags: {
            checking: false,
            signing_in: false,
            signing_up: false
        },

        init: function () {
            ke.ui_views.i18n.init();
            document.title = 'Mate Translate Sign-In';

            if (!ke.supportsOnlineAnalytics) {
                ke.import('lib.ga', ke.initAnalytics);
            } else {
                ke.loadExternalScript(ke.analyticsScriptLink, ke.initAnalytics);
            }

            ke.ext.event.listen(ke.EF, ke.EF, ke.EF);

            chrome.runtime.onMessage.addListener(ke.app.handlers.handleLoginResponses);

            ke.ext.util.storageUtil.chainRequestBackgroundOption([
                {fn: 'isTrueOption', args: ['gdpr_consent']},
                {fn: 'getVal', args: ['user_country']},
                {fn: 'isTrueOption', args: ['dark_mode']}
            ], function (r) {
                var is_gdpr = r[0].response;
                var country = r[1].response;
                var dark_mode = r[2].response;

                if (dark_mode) {
                    $('body').addClass('dark-mode');
                }

                if (document.location.hash === '#gdpr' || (!is_gdpr && ke.isEEA(country))) {
                    $('.check-user-screen').hide();
                    $('.gdpr-consent-screen').show();

                    chrome.runtime.sendMessage({
                        action: ke.processCall('app', 'commands', 'sendAnalyticsEvent'),
                        cat: 'gdpr',
                        event: 'window-open'
                    });

                    window.onbeforeunload = ke.app.handlers.onGDPRBeforeUnload;
                } else if (document.location.hash === '#restore') {
                    $('.skip').remove();
                    $('.promo-text').remove();
                    $('.restore-text').show();
                } else if (document.location.hash === '#sync') {
                    $('.skip').remove();
                    $('.promo-text').remove();
                    $('.sync-text').show();
                }
            });

            $(window).resize(ke.app.handlers.onResize);

            if (ke.IS_EDGE) {
                ke.app.handlers.onResize();
            }

            $('.show-info').on('click', ke.app.handlers.showLoginInfo);
            $('.info-window .close').on('click', ke.app.handlers.closeLoginInfo);
            $('.skip').on('click', ke.app.handlers.skip);
            $('.check-user').on('click', ke.app.handlers.checkUser);
            $('.sign-in').on('click', ke.app.handlers.signIn);
            $('.sign-up').on('click', ke.app.handlers.signUp);

            $('.back-button').on('click', ke.app.handlers.back);
            $('.checkbox').on('click', ke.app.handlers.toggleCheckbox);
            $('.agree').on('click', ke.app.handlers.agreeGDPR);
            $('.open-pp').on('click', ke.app.handlers.openPrivacyPolicy);

            $('.fb-button').on('click', ke.app.handlers.loginWithFB);
            $('.g-button').on('click', ke.app.handlers.loginWithGoogle);

            $('.email').on('keyup', ke.app.handlers.onEmailEnter);
            $('.si-pwd').on('keyup', ke.app.handlers.onSignInEnter);
            $('.su-pwd').on('keyup', ke.app.handlers.onSignUpPwdEnter);
            $('.name').on('keyup', ke.app.handlers.onSignUpNameEnter);
        }
    });

})();