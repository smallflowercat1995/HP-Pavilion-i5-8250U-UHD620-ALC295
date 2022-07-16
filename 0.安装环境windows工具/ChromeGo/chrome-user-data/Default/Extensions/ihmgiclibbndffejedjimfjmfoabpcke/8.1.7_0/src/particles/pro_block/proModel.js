/**
 * Created by chernikovalexey on 07/11/17.
 */


(function () {
    pl.extend(ke.particles.pro_block.model, {
        callback: null,

        upgrade: function () {
            var source = ke.app.temp.source || ke.section;

            /*if (ke.IS_SAMSUNG) {
                window.open('https://buy.paddle.com/product/573344');
                return;
            }*/

            ke.ext.util.storageUtil.chainRequestBackgroundOption([
                {fn: 'getVal', args: ['account_email']},
                {fn: 'getVal', args: ['user_country']},
                {fn: 'isTrueOption', args: ['gdpr_consent']}
            ], function (r) {
                var is_gdpr = r[2].response;

                /*if (!is_gdpr) {
                    alert(ke.getLocale('Settings_NoConsentPro'));
                    ke.ui.login.show({is_gdpr: true});
                } else {*/
                    var email = r[0].response;
                    var country = r[1].response;

                    Paddle.Checkout.open({
                        product: 519679,
                        email: email,
                        country: country,
                        allowQuantity: false,
                        referrer: ke.browserName,
                        passthrough: ke.browserName + " v" + ke.ext.util.storageUtil.getVal('ext_ver') + " (" + source + ")",
                        message: ke.IS_SAFARI
                            ? ke.getLocale('MatePro_Description_Safari')
                            : ke.getLocale('MatePro_Description'),
                        successCallback: function (data) {
                            ke.ext.util.storageUtil.requestBackgroundOption('setVal', ['chr_pro_flag', true]);

                            if (ke.section === 'tour') {
                                window.close();
                            } else {

                                alert(ke.getLocale('Settings_ProActivated'));

                                if (ke.ui.pro_alert.opened) {
                                    ke.ui.pro_alert.close();
                                }

                                ke.particles.pro_block.view.showProState();
                                ke.particles.pro_block.view.showSyncState();
                            }

                            if (typeof ga != "undefined") ga('send', 'event', 'pro', 'purchased', source);
                        },
                        closeCallback: function (data) {
                            if (typeof ga != "undefined") ga('send', 'event', 'pro', 'pro-checkout-closed', source);
                        }
                    });
                //}
            });

            if (typeof ga != "undefined") ga('send', 'event', 'options', 'pro-checkout-shown', source);
        },

        showLogin: function () {
            ke.ui.login.show({is_restore: false});

            if (typeof ga != "undefined") ga('send', 'event', 'options', 'login-clicked');
        },

        restore: function () {
            ke.ui.login.show({is_restore: true});

            if (typeof ga != "undefined") ga('send', 'event', 'options', 'restore-clicked');
        },

        signOut: function () {
            ke.ext.util.storageUtil.requestBackgroundOption('setVal', ['account_email', '']);
            ke.ext.util.storageUtil.requestBackgroundOption('setVal', ['account_token', '']);
            ke.ext.util.storageUtil.requestBackgroundOption('setVal', ['account_name', '']);

            ke.particles.pro_block.view.showProState();
            ke.particles.pro_block.view.showSyncState();

            chrome.runtime.sendMessage({
                action: ke.processCall('app', 'opt', 'revokeToken')
            });

            if (typeof ga != "undefined") ga('send', 'event', 'login', 'sign-out');
        }
    });
})();