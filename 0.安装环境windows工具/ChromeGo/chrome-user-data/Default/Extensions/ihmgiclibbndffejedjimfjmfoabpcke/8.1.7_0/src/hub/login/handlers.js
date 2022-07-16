/* Kumquat Hub HT Handlers
 * 
 **/

(function (undefined) {

    function getSyncServer() {
        return ke.ext.util.storageUtil.getVal('user_country') === 'cn'
            ? 'asia.gikken.co/matesync'
            : 'sync.matetranslate.com';
    }
    
    pl.extend(ke.app.handlers, {
        checkUser: function () {
            var email = $('.email').val();

            if (!ke.ext.string.isValidEmail(email)) {
                pl('.email').highlightErrorFor(200);
                return;
            }

            if (ke.app.flags.checking) {
                return;
            }

            if (typeof ga != "undefined") ga('send', 'event', 'login', 'check-user');

            ke.app.flags.checking = true;
            $('.check-user').hide();
            $('.check-user-loading').show();

            $.ajax({
                url: 'https://' + getSyncServer() + '/check_user',
                type: 'GET',
                dataType: 'json',
                data: {
                    lang: ke.browserLang,
                    email: email
                },
                success: function (r) {
                    ke.app.temp.checked_email = email;

                    $('.check-user-loading').hide();
                    $('.check-user').show();

                    if (r.error) {
                        if (typeof ga != "undefined") ga('send', 'event', 'login', 'check-user-failed');

                        alert(ke.ext.string.safeResponse.cleanDomString(r.reason));
                        return;
                    }

                    if (typeof ga != "undefined") ga('send', 'event', 'login', 'check-user-success');

                    ke.app.flags.checking = false;
                    $('.checked-email').html(email);
                    $('.check-user-screen').hide();

                    if (r.registered) {
                        $('.sign-in-screen').show();
                        $('.si-pwd').focus();
                    } else {
                        $('.sign-up-screen').show();
                        $('.su-pwd').focus();
                    }
                },
                error: function (r) {
                    $('.check-user-loading').hide();
                    $('.check-user').show();

                    if (typeof ga != "undefined") ga('send', 'event', 'login', 'check-user-failed');

                    alert('Unknown error.');
                }
            });
        },

        close: function () {
            ke.ext.util.storageUtil.requestBackgroundOption('setVal', ['supress_signin', true]);

            chrome.runtime.sendMessage({
                action: ke.processCall('app', 'opt', 'closeLoginPopup')
            });
        },

        handleLoginResponses: function (data) {
            var parts = ke.parseProcessCall(data.action);

            if (parts.lib === 'app' && parts.cmd === 'login' && parts.exact === 'finish') {
                ke.app.handlers.finishLoginWithSocials(data.data);
            }
        },

        loginWithFB: function () {
            if (typeof ga != "undefined") ga('send', 'event', 'login', 'with-fb');

            ke.app.handlers.getFBRedirectUri(function (uri) {
                window.open('https://www.facebook.com/dialog/oauth?client_id=110273559687513&redirect_uri=' + uri + '&scope=email,public_profile', '_blank', 'width=550,height=440');
            });
        },

        loginWithGoogle: function () {
            if (typeof ga != "undefined") ga('send', 'event', 'login', 'with-g');

            ke.app.handlers.getGoogleRedirectUri(function (uri) {
                window.open('https://accounts.google.com/o/oauth2/v2/auth?access_type=offline&response_type=code&scope=email%20profile&redirect_uri=' + uri + '&client_id=48217846146-jtog68ciirati27t6p2mn3q8u33pnphu.apps.googleusercontent.com', '_blank', 'width=550,height=440');
            });
        },

        openPrivacyPolicy: function () {
            window.open('https://gikken.co/mate-translate/privacy/?ref=' + ke.browserName, '_blank', 'width=800,height=640');
        },

        finishLoginWithSocials: function (data) {
            if (!data.error) {
                if (typeof ga != "undefined") ga('send', 'event', 'login', 'with-fb-g-success');

                ke.ext.util.storageUtil.chainRequestBackgroundOption([
                    {fn: 'setVal', args: ['account_name', data.name]},
                    {fn: 'setVal', args: ['account_email', data.email]},
                    {fn: 'setVal', args: ['account_token', data.token]},
                    {fn: 'setVal', args: ['chr_pro_flag', !!data.has_pro]}
                ]);

                chrome.runtime.sendMessage({
                    action: ke.processCall('app', 'opt', 'updateUninstallUri')
                });

                ke.app.handlers.close();
            } else {
                if (typeof ga != "undefined") ga('send', 'event', 'login', 'with-fb-g-failed');

                alert(data.reason);
            }
        },

        signIn: function () {
            var password = $('.si-pwd').val();

            if (!password) {
                pl('.si-pwd').highlightErrorFor(200);
                return;
            }

            if (ke.app.flags.signing_in) {
                return;
            }

            if (typeof ga != "undefined") ga('send', 'event', 'login', 'sign-in');

            ke.app.flags.signing_in = true;

            var $btn = $('.sign-in');

            $btn.hide();
            $('.sign-up-loading').show();

            ke.getDeviceData(function (device_data) {
                $.ajax({
                    url: 'https://' + getSyncServer() + '/login',
                    type: 'GET',
                    dataType: 'JSON',
                    data: $.extend({
                        lang: ke.browserLang,
                        method: 'e',
                        email: ke.app.temp.checked_email,
                        pwd: password
                    }, device_data),
                    success: function (r) {
                        $('.sign-up-loading').hide();
                        $btn.show();

                        ke.app.flags.signing_in = false;

                        if (!r.error) {
                            if (typeof ga != "undefined") ga('send', 'event', 'login', 'sign-in-success');

                            ke.ext.util.storageUtil.chainRequestBackgroundOption([
                                {fn: 'setVal', args: ['account_name', r.name]},
                                {fn: 'setVal', args: ['account_email', ke.app.temp.checked_email]},
                                {fn: 'setVal', args: ['account_token', r.token]}
                            ]);

                            // don't downgrade
                            // only upgrade if it's not pro locally
                            // but pro remotely
                            if (r.has_pro) {
                                ke.ext.util.storageUtil.requestBackgroundOption('isTrueOption', ['chr_pro_flag'], function (is_locally_pro) {
                                    if (!is_locally_pro) {
                                        ke.ext.util.storageUtil.requestBackgroundOption('setVal', ['chr_pro_flag', true]);
                                    }
                                });
                            }

                            chrome.runtime.sendMessage({
                                action: ke.processCall('app', 'opt', 'updateUninstallUri')
                            });

                            ke.app.handlers.close();
                        } else {
                            if (typeof ga != "undefined") ga('send', 'event', 'login', 'sign-in-failed');

                            alert(r.reason);
                        }
                    },
                    error: function (r) {
                        $('.sign-up-loading').hide();
                        $btn.show();

                        if (typeof ga != "undefined") ga('send', 'event', 'login', 'sign-in-failed');

                        alert('Unknown error.');
                    }
                });
            });
        },

        signUp: function () {
            var password = $('.su-pwd').val();
            var name = $('.name').val();

            if (password.length < 8) {
                alert(ke.getLocale('Login_PasswordMin8'));
                return;
            }

            if (ke.app.flags.signing_up) {
                return;
            }

            if (typeof ga != "undefined") ga('send', 'event', 'login', 'sign-up');

            ke.app.flags.signing_up = true;

            var $btn = $('.sign-up');

            $btn.hide();
            $('.sign-up-loading').show();

            ke.ext.util.storageUtil.requestBackgroundOption('isTrueOption', ['chr_pro_flag'], function (is_pro) {
                ke.getDeviceData(function (device_data) {
                    $.ajax({
                        url: 'https://' + getSyncServer() + '/register_user',
                        type: 'GET',
                        dataType: 'JSON',
                        data: $.extend({
                            lang: ke.browserLang,
                            email: ke.app.temp.checked_email,
                            pwd: password,
                            name: name,
                            has_not_empty_history: is_pro
                        }, device_data),
                        success: function (r) {
                            ke.app.flags.signing_up = false;
                            $('.sign-up-loading').hide();
                            $btn.show();

                            if (!r.error) {
                                if (typeof ga != "undefined") ga('send', 'event', 'login', 'sign-up-success');

                                ke.ext.util.storageUtil.chainRequestBackgroundOption([
                                    {fn: 'setVal', args: ['account_name', r.name]},
                                    {fn: 'setVal', args: ['account_email', ke.app.temp.checked_email]},
                                    {fn: 'setVal', args: ['account_token', r.token]},
                                    {fn: 'setVal', args: ['chr_pro_flag', !!r.has_pro]}
                                ]);

                                ke.app.handlers.close();
                            } else {
                                if (typeof ga != "undefined") ga('send', 'event', 'login', 'sign-up-failed');

                                alert(r.reason);
                            }
                        },
                        error: function (r) {
                            $('.sign-up-loading').hide();
                            $btn.show();

                            if (typeof ga != "undefined") ga('send', 'event', 'login', 'sign-up-failed');

                            alert('Unknown error.');
                        }
                    });
                });
            });
        },

        back: function () {
            $('.sign-in-screen').hide();
            $('.sign-up-screen').hide();
            $('.check-user-screen').show();
        },

        toggleCheckbox: function () {
            $(this).toggleClass('checked');
            $('.agree').prop('disabled', function (i, v) {
                return !v;
            });
        },

        agreeGDPR: function () {
            ke.ext.util.storageUtil.requestBackgroundOption('setVal', ['gdpr_consent', true]);

            $('.agree').hide();
            $('.gdpr-loading').show();

            ke.app.handlers.accepted = true;

            ke.ext.util.storageUtil.requestBackgroundOption('getVal', ['account_token'], function (token) {
                if (token) {
                    // save this user's consent on the server
                    $.ajax({
                        url: 'https://' + getSyncServer() + '/accept_gdpr',
                        type: 'GET',
                        dataType: 'json',
                        data: {
                            token: token,
                            accept: true
                        },
                        success: function (r) {
                            window.close();
                        },
                        error: function () {
                            window.close();
                        }
                    });

                    if (typeof ga != "undefined") ga('send', 'event', 'gdpr', 'signed-in-user-accept');
                } else {
                    if (typeof ga != "undefined") ga('send', 'event', 'gdpr', 'anonymous-user-accept');

                    //window.close();

                    // don't ask to sign up right after
                    // too many people don't notice it can be skipped
                    // -> remove the extension and complain too much

                    // if it was opened for the GDPR stuff initially, 
                    // that's it, we're done
                    // if not but gdpr got in the way, proceed to the original thing
                    if (document.location.hash === '#gdpr') {
                        window.close();
                    } else {
                        document.location.reload();
                    }
                }
            });
        },

        skip: function () {
            if (typeof ga != "undefined") ga('send', 'event', 'login', 'skip');

            ke.app.handlers.close();
        },

        showLoginInfo: function () {
            $('.info-window').fadeIn(200);

            if (typeof ga != "undefined") ga('send', 'event', 'login', 'show-login-info');
        },

        closeLoginInfo: function () {
            $('.info-window').fadeOut(200);
        },

        onEmailEnter: function (event) {
            if (event.keyCode === 13 && ke.ext.event.isDown('enter', ke.ext.event.IN_STR)) {
                ke.app.handlers.checkUser();
            }
        },

        onSignInEnter: function (event) {
            if (event.keyCode === 13 && ke.ext.event.isDown('enter', ke.ext.event.IN_STR)) {
                ke.app.handlers.signIn();
            }
        },

        onSignUpPwdEnter: function (event) {
            if (event.keyCode === 13 && ke.ext.event.isDown('enter', ke.ext.event.IN_STR)) {
                $('.name').focus();
            }
        },

        onSignUpNameEnter: function (event) {
            if (event.keyCode === 13 && ke.ext.event.isDown('enter', ke.ext.event.IN_STR)) {
                ke.app.handlers.signUp();
            }
        },

        onResize: function () {
            window.resizeTo(550, 470);
        },

        getGoogleRedirectUri: function (callback) {
            ke.ext.util.storageUtil.requestBackgroundOption('isTrueOption', ['chr_pro_flag'], function (is_pro) {
                callback(encodeURIComponent('https://' + getSyncServer() + '/login_with_g?browser='
                    + ke.PLATFORM_CODE + '&uuid='
                    + ke.staticExtId + '&has_not_empty_history='
                    + is_pro));
            });
        },

        getFBRedirectUri: function (callback) {
            ke.ext.util.storageUtil.requestBackgroundOption('isTrueOption', ['chr_pro_flag'], function (is_pro) {
                callback(encodeURIComponent('https://' + getSyncServer() + '/login_with_fb?browser='
                    + ke.PLATFORM_CODE + '&uuid='
                    + ke.staticExtId + '&has_not_empty_history='
                    + is_pro));
            });
        },

        accepted: false,

        onGDPRBeforeUnload: function () {
            if (!ke.app.handlers.accepted) {
                chrome.runtime.sendMessage({
                    action: ke.processCall('app', 'commands', 'sendAnalyticsEvent'),
                    cat: 'gdpr',
                    event: 'window-close'
                });
            }
        }
    });

})();