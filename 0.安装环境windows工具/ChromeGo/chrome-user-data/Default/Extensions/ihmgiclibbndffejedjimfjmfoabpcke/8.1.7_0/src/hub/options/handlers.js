/* Kumquat Hub Options Handlers
 * 
 **/

(function (undefined) {

    pl.extend(ke.app.handlers, {
        onLabelClick: function (e) {
            var _class = $(this).data('option');
            ke.ui.checkbox.externalElementClicked(ke.getSelectorConst('settings', _class[0].toUpperCase() + '_CHECK'));
        },

        // Remove all empty or partially filled combinations
        beforeUnload: function (event) {
            ke.ext.util.storageUtil.requestBackgroundOption('getDecodedVal', ['add_trans_combinations'], function (c) {
                for (var key in c) {
                    if (key != 'main' && (pl.empty(key) || (pl.empty(c[key]) || !c[key].from || !c[key].to))) {
                        ke.ext.util.storageUtil.requestBackgroundOption('deleteJsonElementByKey', ['add_trans_combinations', key]);
                    }
                }
            });
        },

        showSharingWindow: function (event) {
            var platform = $(this).data('pl');

            if (platform === 'email') {
                chrome.runtime.sendMessage({
                    action: ke.processCall('app', 'opt', 'shareViaEmail'),
                });
            } else {
                window.open(ke.ext.tpl.compile(ke.share_links[platform], {
                    link: ke.storeLink,
                    text: ke.getLocale('Settings_ShareText')
                }), "Share Mate Translate", "fullscreen=no,width=520,height=480");
            }

            if (typeof ga != "undefined") ga('send', 'event', 'options', 'feedback', 'share-' + platform);
        },

        copyLink: function () {
            $(this)[0].select();
            ke.ext.clipboard.copyToClipboard(ke.storeLink);
            ke.ui.notifications.show(ke.getLocale('Common_Copied'), 2500);

            if (typeof ga != "undefined") ga('send', 'event', 'options', 'feedback', 'link-copied');
        },

        handleLoginStateChange: function (data) {
            var parts = ke.parseProcessCall(data.action);

            if (parts.lib === 'app' && parts.cmd === 'login' && parts.exact === 'done') {
                ke.particles.pro_block.view.showSyncState();
                ke.particles.pro_block.view.showProState();
            }
        },

        openPhrasebook: function () {
            chrome.tabs.create({
                url: chrome.extension.getURL("/pages/public/phrasebook.html")
            });
        },

        onSubscribe: function () {
            chrome.tabs.create({url: 'http://eepurl.com/drXl6T'});

            if (typeof ga != "undefined") ga('send', 'event', 'options', 'feedback', 'subscribe');
        },

        onEmailUs: function () {
            chrome.runtime.sendMessage({
                action: ke.processCall('app', 'opt', 'sendEmail'),
            });

            if (typeof ga != "undefined") ga('send', 'event', 'options', 'feedback', 'email');
        },

        onHC: function () {
            chrome.runtime.sendMessage({
                action: ke.processCall('app', 'opt', 'openHC'),
            });

            if (typeof ga != "undefined") ga('send', 'event', 'options', 'feedback', 'help-center');
        },

        showOtherApps: function () {
            chrome.runtime.sendMessage({
                action: ke.processCall('app', 'opt', 'showOtherApps'),
            });

            if (typeof ga != "undefined") ga('send', 'event', 'options', 'feedback', 'show-other-apps');
        },

        onFacebookOpen: function () {
            chrome.tabs.create({url: 'https://facebook.com/MateTranslate'});

            if (typeof ga != "undefined") ga('send', 'event', 'options', 'feedback', 'facebook');
        },

        onTwitterOpen: function () {
            chrome.tabs.create({url: 'https://twitter.com/MateTranslate'});

            if (typeof ga != "undefined") ga('send', 'event', 'options', 'feedback', 'twitter');
        },

        onSiteOpen: function () {
            chrome.tabs.create({url: 'https://gikken.co/mate-translate/?ref=' + ke.browserName + 'Settings'});

            if (typeof ga != "undefined") ga('send', 'event', 'options', 'feedback', 'site');
        },

        saveTooltipSize: function () {
            var new_scale = +$(this).data('scale');

            $('.sel-tt').removeClass('sel-tt');
            $(this).addClass('sel-tt');

            ke.ext.util.storageUtil.requestBackgroundOption('setVal', ['tooltip_scale', new_scale]);

            if (typeof ga != "undefined") ga('send', 'event', 'options', 'set-tooltip-size', '' + new_scale);
        },

        onShortcutSwap: function () {
            ke.ext.util.storageUtil.requestBackgroundOption('getIntValue', ['win_trans_type'], function (win_trans_type) {
                ke.ext.util.storageUtil.requestBackgroundOption('setIntValue', ['win_trans_type', (2 + 1) - win_trans_type], function () {
                    ke.app.render.organize.showPopupShortcuts();
                });
            });

            if (typeof ga != "undefined") ga('send', 'event', 'options', 'shortcuts', 'change-window-shortcut');
        },

        openPrivacyPolicy: function () {
            chrome.tabs.create({url: 'https://gikken.co/mate-translate/privacy/?ref=' + ke.browserName});
        },

        openToS: function () {
            chrome.tabs.create({url: 'https://www.matetranslate.com/terms-of-use'});
        },

        revokeConsent: function () {
            ke.ext.util.storageUtil.requestBackgroundOption('setVal', ['gdpr_consent', false]);

            alert('Okay!');

            ke.ext.util.storageUtil.requestBackgroundOption('getVal', ['account_token'], function (token) {
                $.ajax({
                    url: 'https://sync.matetranslate.com/accept_gdpr',
                    type: 'GET',
                    dataType: 'json',
                    data: {
                        token: token,
                        accept: false
                    },
                    success: function (r) {
                    },
                    error: function () {
                    }
                });
            });

            if (typeof ga != "undefined") ga('send', 'event', 'gdpr', 'revoke');

            // Let user to use settings further until he closes it by himself
        },

        eraseUserData: function () {
            var sure = confirm(ke.getLocale('Settings_EraseConfirm'));

            if (typeof ga != "undefined") ga('send', 'event', 'gdpr', 'erase');

            if (sure) {
                ke.ext.util.storageUtil.requestBackgroundOption('getVal', ['account_token'], function (token) {
                    $.ajax({
                        url: "https://sync.matetranslate.com/erase_all_user_data",
                        type: "GET",
                        dataType: 'json',
                        data: {
                            token: token
                        },
                        success: function (r) {
                            if (r.success) {
                                alert(ke.getLocale('Settings_DataErased'));

                                ke.ext.util.storageUtil.chainRequestBackgroundOption([
                                    {fn: 'setVal', args: ['account_email', '']},
                                    {fn: 'setVal', args: ['account_token', '']},
                                    {fn: 'setVal', args: ['account_name', '']}
                                ]);

                                ke.particles.pro_block.view.showProState();
                                ke.particles.pro_block.view.showSyncState();

                                if (typeof ga != "undefined") ga('send', 'event', 'gdpr', 'erase-successful');
                            } else {
                                alert(r.reason);

                                if (typeof ga != "undefined") ga('send', 'event', 'gdpr', 'erase-failed');
                            }
                        },
                        error: function () {
                            alert(ke.getLocale('Settings_DataEraseError'));

                            if (typeof ga != "undefined") ga('send', 'event', 'gdpr', 'erase-failed-ajax');
                        }
                    });
                });
            }
        }
    });

})();