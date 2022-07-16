/* Kumquat Hub Window Handlers
 * 
 **/

(function (undefined) {

    var $input = $('.translation-input');

    pl.extend(ke.app.handlers, {
        onHistoryLinkClick: function () {
            chrome.tabs.create({
                url: chrome.extension.getURL("/pages/public/history.html")
            });

            // Firefox doesn't close the pop-up automatically when a tab
            // in the main window is being opened
            if (!ke.IS_SAFARI) {
                window.close();
            }
        },

        onSettingsLinkClick: function () {
            chrome.tabs.create({
                url: chrome.extension.getURL("/pages/public/options.html")
            });

            if (!ke.IS_SAFARI) {
                window.close();
            }
        },

        onPhrasebookOpen: function () {
            chrome.tabs.create({
                url: chrome.extension.getURL("/pages/public/phrasebook.html")
            });

            if (!ke.IS_SAFARI) {
                window.close();
            }
        },

        onUnpinLinkClick: function () {
            if (ke.IS_EDGE) {
                chrome.windows.create({
                    url: "pages/public/window.html#unpinned_",
                    left: 10,
                    top: 10,
                    width: 550,
                    height: 460,
                    focused: true
                });
            } else {
                window.open(chrome.extension.getURL("/pages/public/window.html#unpinned_"), "_blank", "width=550,height=440");
            }

            if (typeof ga != "undefined") ga('send', 'event', 'window', 'unpin');
        },

        clearInput: function (event) {
            var clear_callback = function () {
                ke.app.handlers.toggleRawControls(true);
                ke.particles.tr_input.model.saveValueOnKeyup();
                ke.particles.translate.model.translateSimple();
                ke.app.handlers.countTextLength();

                $('.translation-input').focus();
            };

            if (ke.app.$input.val().length <= 16) {
                pl('.translation-input').clear(clear_callback);
            } else {
                ke.app.$input.val("");
                clear_callback();
            }

            $('.original-ipa').hide();

            if (typeof ga != "undefined") ga('send', 'event', 'window', 'input-clear', 'window');
        },

        closeAutocorrection: function () {
            $('.autocorrection-layout').hide();
        },

        dontAutocorrect: function (event) {
            var val = $(this).html();

            $('.autocorrection-layout').hide();
            $('.translation-input').val(val);

            if (typeof ga != "undefined") ga('send', 'event', 'window', 'autocorrection', 'do-not');

            ke.app.flags.isAutocorrected = false;
            ke.particles.translate.model.getTranslation(ke.particles.translate.model.routeTranslation, false, val, true);
        },

        onResize: function () {
            var xx = 0;
            var yy = 0;

            if (ke.IS_EDGE) {
                xx = 2;
                yy = 62;
            } else if (ke.IS_FIREFOX) {
                xx = 0;
                yy = 35;

                if (!ke.isMac) {
                    xx += 15;
                    yy += 10;
                }
            } else if (ke.IS_OPERA) {
                xx = 0;
                yy = 35;

                if (!ke.isMac) {
                    xx += 15;
                    yy += 32;
                }
            } else if (!ke.isMac) {
                xx = 16;
                yy = 20;
            }

            if (!ke.IS_SAFARI) {
                window.resizeTo(550 + xx, 463 + yy);
            }
        },

        rateUsNow: function ($mw) {
            $mw.fadeOut(250);
            ke.ext.util.storageUtil.setIntValue("last_rate_show", -1);
            if (typeof ga != "undefined") ga('send', 'event', 'window', 'rate', 'now');
            chrome.tabs.create({url: ke.storeLink});
        },

        rateUsLater: function ($mw) {
            $mw.hide();
            ke.ext.util.storageUtil.setIntValue("last_rate_show", Date.now());
            if (typeof ga != "undefined") ga('send', 'event', 'window', 'rate', 'later');
        },

        rateUsNever: function ($mw) {
            $mw.fadeOut(250);
            ke.ext.util.storageUtil.setIntValue("last_rate_show", -1);
            if (typeof ga != "undefined") ga('send', 'event', 'window', 'rate', 'never');
        },

        countTextLength: function (event) {
            var val = ke.app.$input.val();
            var len = val.length;

            if (len > ke.ext.googleApi.MAX_TEXT_LEN) {
                ke.app.$chars_used.html(ke.ext.googleApi.MAX_TEXT_LEN - len);
            } else {
                ke.app.$chars_used.html("");
            }
        },

        onShortcutsUp: function (event) {
            if (ke.ext.event.isDown('cmd+shift+s', ke.ext.event.IN_STR)
                || ke.ext.event.isDown('ctrl+shift+s', ke.ext.event.IN_STR)) {
                ke.app.handlers.onSwapLang();
            }
        },

        useSynonym: function (event) {
            var word = pl(event.target).html();
            $input.val(word);
            ke.particles.translate.model.translateSimple(null, false);
            if (ke.app.flags.save) {
                ke.particles.tr_input.model.saveValueOnKeyup();
            }
        },

        wereRawControlsEmpty: null,

        toggleRawControls: function (is_empty) {
            ke.particles.stt.model.ctrlMicVisibility(ke.app.getCurrentFromLang());

            ke.app.handlers.closeAutocorrection();
            ke.particles.listen.model.ctrlRawVisibility();

            // Note:
            // Perhaps, will be back in the future
            // For now, to get rid of the clipboard read permission, it won't be shown
            $('.insert').hide();

            if (is_empty) {
                //$('.listen-raw-butt0n').show().addClass('listen-disabled');
                $('.clear-input').slideUp(125, 'easeOutCubic');
                $('.insert').addClass('on-empty');
                $('.original-ipa').hide();
                $('.original-article').slideUp(125);
                $('.translation-input').removeClass('with-article');

                if (!ke.app.flags.instant) {
                    $('.translate-button').fadeOut(125, 'easeOutCubic');
                }

                if (ke.app.temp.currentFromLang === 'auto') {
                    ke.app.initDropdown();
                }
            } else {
                //$('.listen-raw-butt0n').show().removeClass('listen-disabled');
                $('.clear-input').slideDown(125, 'easeOutCubic');

                $('.insert').removeClass('on-empty');

                if (!ke.app.flags.instant && !ke.app.flags.isTranslating) {
                    $('.translate-button').fadeIn(125, 'easeOutCubic');
                }
            }
        },

        onSwapLang: function (event) {
            var from = ke.ui.dropdown.getActiveOptionValue(1);
            var to = ke.ui.dropdown.getActiveOptionValue(2);

            if (from === 'auto' && ke.app.temp.currentDetectedLang) {
                from = ke.app.temp.currentDetectedLang;
            }

            if (from !== 'auto') {
                //
                // Put translation back to the input field
                // only when user clicks the swap button on purpose
                if (event) {
                    $('.translation-input').val(ke.particles.listen.model._getTransValue('window'));
                }

                if (ke.app.flags.save) {
                    ke.particles.tr_input.model.saveValueOnKeyup();
                }

                ke.ui.dropdown.data.callback(1, to, null, true);
                ke.ui.dropdown.data.callback(2, from, null, false);

                ke.app.temp.toLang = from;
            }
        },

        openTrialManagement: function () {
            chrome.tabs.create({
                url: chrome.extension.getURL("/pages/public/tour.html")
            });

            if (!ke.IS_SAFARI) {
                window.close();
            }
        },

        like: function ($mw) {
            $mw.find('.like-window').fadeOut(250, function () {
                $mw.find('.rate-window').fadeIn(250);
            });

            ke.ext.util.storageUtil.setVal("last_rate_show", -1);

            if (typeof ga != "undefined") ga('send', 'event', 'window', 'like-window', 'like');
        },

        dislike: function ($mw) {
            $mw.find('.like-window').fadeOut(250, function () {
                $mw.find('.email-window').fadeIn(250);
            });

            ke.ext.util.storageUtil.setVal("last_rate_show", -1);

            if (typeof ga != "undefined") ga('send', 'event', 'window', 'like-window', 'dislike');
        },

        writeEmail: function ($mw) {
            chrome.runtime.sendMessage({
                action: ke.processCall('app', 'opt', 'sendEmail'),
            });

            $mw.fadeOut(250);

            if (typeof ga != "undefined") ga('send', 'event', 'window', 'like-window', 'email');
        },

        showShareDialog: function ($mw) {
            $mw.find('.share-question-window').fadeOut(250, function () {
                $mw.find('.share-window').fadeIn(250);
            });

            $mw.find('.mate-link')
                .val(ke.storeLink)
                .on('focus', function () {
                    $(this)[0].select();
                    ke.ext.clipboard.copyToClipboard(ke.storeLink);
                    ke.ui.notifications.show(ke.getLocale("Common_Copied"), 2500);

                    if (typeof ga != "undefined") ga('send', 'event', 'window', 'like-window', 'link-copied');
                });

            ke.ext.util.storageUtil.setVal("invite_friends_shown", true);

            if (typeof ga != "undefined") ga('send', 'event', 'window', 'like-window', 'show-share');
        },

        adjustOriginalIpa: function() {
            let vl = $('.translation-input').lines();
            let font_size = parseInt($('.translation-input').css('font-size'), 10);
            let pt = parseInt($('.translation-input').css('padding-top'), 10);

            // article height is included in padding-top of the input field

            $('.original-ipa').css('top', (pt + (font_size + 5) * vl) + 'px');
        },

        closeShareQuestion: function ($mw) {
            $mw.fadeOut(250);
            ke.ext.util.storageUtil.setVal("invite_friends_shown", true);

            if (typeof ga != "undefined") ga('send', 'event', 'window', 'like-window', 'close');
        },
    
        showSponsorship: function (not_shown_callback) {
            ke.ui.login.show({is_sync: true});
            if (typeof ga != "undefined") ga('send', 'event', 'window', 'tips', 'account-interested');
        },

        dismissSponsorship: function (event) {
            event.stopPropagation();
            ke.app.handlers.hideSponsorshipsBar();
            ke.ext.util.storageUtil.setVal('mate_account_tip_dismissed', true);
            if (typeof ga != "undefined") ga('send', 'event', 'window', 'tips', 'account-dismiss');
        },

        hideSponsorshipsBar: function() {
            $('.sponsorship-bar').hide();
            $('html, body').addClass('without-sponsorship');
        },

        showArticleUpgrade: function() {
            ke.ui.pro_alert.show(ke.getLocale('Pro_Articles_Msg'), 'noun-articles');
        },

        showIpaUpgrade: function() {
            // tell IPA or transliteration depending on the language
            ke.ui.pro_alert.show(ke.getLocale('Pro_IPA_Msg'), 'ipa-translit');
        },

        discardEmail: function ($mw) {
            $mw.fadeOut(250);
        },

        closeNetflix: function ($mw) {
            $mw.fadeOut(250);
            ke.ext.util.storageUtil.setVal("netflix_update_shown", true);
        },

        share: function ($mw) {
            window.open(ke.ext.tpl.compile(ke.share_links[$(this).attr('data-source')], {
                link: ke.storeLink,
                text: ke.getLocale('Settings_ShareText').replace('{{platform}}', ke.browserName)
            }), "Share Mate Translate", "fullscreen=no,width=520,height=480");

            if (typeof ga != "undefined") ga('send', 'event', 'window', 'like-window', 'share-social');

            $mw.fadeOut(250);
        },

        toggleDarkMode: function () {
            var enable = !$('body').hasClass('dark-mode');
            $('body').toggleClass('dark-mode');

            if (typeof ga != "undefined") ga('send', 'event', 'window', 'dark-mode', 'try-toggle');

            if (enable && !ke.app.flags.pro) {
                setTimeout(function() {
                    ke.ui.pro_alert.show(ke.getLocale('Pro_DarkMode'), 'dark-mode');
                }, 1000);

                if (typeof ga != "undefined") ga('send', 'event', 'window', 'dark-mode', 'show-upgrade');
            }

            if (!enable || ke.app.flags.pro) {
                ke.ext.util.storageUtil.setVal('dark_mode', enable);

                if (typeof ga != "undefined") ga('send', 'event', 'window', 'dark-mode', 'toggled-ok');
            }
        },

        _processEventHandlers: {
            app: {
                audio: {},

                trans: {
                    translateSelectedText: function (data, sendResponse) {
                        console.log(data);
                    }
                }
            }
        }
    });

})();