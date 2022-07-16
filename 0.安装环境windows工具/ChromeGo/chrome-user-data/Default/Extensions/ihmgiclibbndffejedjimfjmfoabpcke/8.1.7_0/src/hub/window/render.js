/* Kumquat Hub Window Render
 *
 **/

(function (undefined) {

    const ONE_DAY = 86400000;

    function validateSponsorships() {
        return typeof ke.app.temp.sponsorships.active === "boolean"
            && typeof ke.app.temp.sponsorships.service_name === "string"
            && typeof ke.app.temp.sponsorships.service_id === "string"
            && typeof ke.app.temp.sponsorships.percentage_off === "string"
            && typeof ke.app.temp.sponsorships.links === "object"
            && typeof ke.app.temp.sponsorships.learn_langs === "object"
            && typeof ke.app.temp.sponsorships.expires_in === "number"
            && typeof ke.app.temp.sponsorships.important_locales === "object"
            && typeof ke.app.temp.last_claim_click[ke.app.temp.sponsorships.service_id] === "number";
    }

    pl.extend(ke.app.render, {

        get ONE_DAY() {
            return ONE_DAY;
        },

        organize: {
            ctrlHistoryLinkVisibility: function () {
                ke.ext.util.storageUtil.requestBackgroundOption('isTrueOption', ['history'], function (is_true) {
                    $('.collapsable-history').css('display', is_true ? 'inline-block' : 'none');
                });
            },

            fadeInElements: function () {
                $('.complex-wrap')
                    .fadeIn(175, ke.getAnimType('slide_up'), function () {
                        $(this).addClass('unfaded-cw');
                        pl('.translation-input').caretToEnd();
                    });
            },

            toggleUnpinLink: function () {
                if (document.location.hash.indexOf("unpinned") > -1 || ke.IS_SAMSUNG) {
                    $('.unpin').fadeOut(300, ke.getAnimType('fade_out'));
                }
            },

            tryShowingRateUs: function (not_shown_callback) {
                //
                // 3 days
                // 30+ translations
                //
                ke.idb.enum('it', 'history', Number.MAX_SAFE_INTEGER, null, true, function (items) {
                    if (!ke.IS_SAFARI
                        && items.length >= 30
                        && ke.ext.util.storageUtil.getIntValue("last_rate_show") != -1
                        && Date.now() - ke.ext.util.storageUtil.getIntValue("install_date") >= ONE_DAY * 3) {

                        var $mw = $('.rate-layout');

                        $mw.fadeIn(250).css('display', 'flex');
                        $mw.find('.like-button').on('click', function () {
                            ke.app.handlers.like($mw);
                        });
                        $mw.find('.dislike-button').on('click', function () {
                            ke.app.handlers.dislike($mw);
                        });
                        $mw.find('.write-email').on('click', function () {
                            ke.app.handlers.writeEmail($mw);
                        });
                        $mw.find('.email-discard').on('click', function () {
                            ke.app.handlers.discardEmail($mw);
                        });
                        $mw.find('.rate-now').on('click', function () {
                            ke.app.handlers.rateUsNow($mw);
                        });
                        $mw.find('.discard-rating').on('click', function () {
                            ke.app.handlers.rateUsNever($mw);
                        });

                        if (typeof ga != "undefined") ga('send', 'event', 'window', 'rate', 'showed');
                    } else {
                        not_shown_callback();
                    }
                });
            },

            tryShowingNetflixUpdate: function (not_shown_callback) {

                if (ke.IS_SAMSUNG) return;

                // show netflix update only to older users (7+ days)
                // because new users will see it in the onboarding tutorial anyways
                // don't show two times
                if (ke.ext.util.storageUtil.isTrueOption("netflix_update_shown")
                    ||  Date.now() - ke.ext.util.storageUtil.getIntValue("install_date") < ONE_DAY * 7) {
                    not_shown_callback();
                    return;
                }

                var $mw = $('.netflix-layout');

                $mw.fadeIn(250).css('display', 'flex');
                $mw.find('.ok-button').on('click', function () {
                    ke.app.handlers.closeNetflix($mw);
                });

                if (typeof ga != "undefined") ga('send', 'event', 'window', 'netflix-update', 'show');
            },

            tryShowingInviteFriends: function (not_shown_callback) {

                if (ke.IS_SAMSUNG) return;

                //
                // if shown or user doesn't like mate, don't show
                //
                if (ke.ext.util.storageUtil.isTrueOption("invite_friends_shown")
                    || ke.ext.util.storageUtil.getIntValue("like_mate") !== 1) {
                    not_shown_callback();
                    return;
                }

                // user likes mate (one of the prev questions)
                // not shown yet
                // 7+ days in use
                // 60+ translations
                ke.idb.enum('it', 'history', Number.MAX_SAFE_INTEGER, null, true, function (items) {
                    if (items.length >= 60
                        && Date.now() - ke.ext.util.storageUtil.getIntValue("install_date") >= ONE_DAY * 7) {
                        var $mw = $('.invite-layout');

                        $mw.fadeIn(250).css('display', 'flex').css('display', 'flex');
                        $mw.find('.know-button').on('click', function () {
                            ke.app.handlers.showShareDialog($mw);
                        });
                        $mw.find('.dunno-button').on('click', function () {
                            ke.app.handlers.closeShareQuestion($mw);
                        });

                        if (ke.ext.util.storageUtil.getVal('user_country') !== 'ru') {
                            $mw.find('.share-button[data-source="vk"]').remove();
                        }

                        $mw.find('.share-button').on('click', function () {
                            ke.app.handlers.share.call(this, $mw);
                        });
                        $mw.find('.share-discard').on('click', function () {
                            ke.app.handlers.closeShareQuestion($mw);
                        });

                        if (typeof ga != "undefined") ga('send', 'event', 'window', 'like-window', 'showed');
                    } else {
                        not_shown_callback();
                    }
                });
            },

            tryShowSponsorshipBar: function() {
                if (ke.ext.util.storageUtil.isTrueOption('mate_account_tip_dismissed')
                    || ke.app.temp.account_token !== '') {

                    ke.app.handlers.hideSponsorshipsBar();
                } else {
                    $('.sponsorship-bar').on('click', ke.app.handlers.showSponsorship);
                    $('.sponsorship-bar .close').on('click', ke.app.handlers.dismissSponsorship);
                }
            },

            adjustSwapWidth: function () {
                let $lang_sel = $('.lang-selectors');
                let $from_sel = $('.from-lang');
                let $lang_swap = $('.lang-swap');
                let iterations = 0;

                // if the entire picker layout's height is bigger than the one of one picker,
                // it probably means the layout got fucked up, and the picker and below one another
                // min swap button width so it doesn't look ugly = 35px
                // prevent an infinite loop with `iterations`, anyway
                while ($lang_sel.height() > $from_sel.height() && $lang_swap.width() >= 35 && ++iterations <= 30) {
                    $lang_swap.width($lang_swap.width() - 1);
                }
            }
        },

        events: {
            showArticleUpgrade: function() {
                if (!ke.app.flags.pro) {
                    $('.article').click(ke.app.handlers.showArticleUpgrade);
                }
            },

            showIpaUpgrade: function() {
                if (!ke.app.flags.pro) {
                    $('.ipa').click(ke.app.handlers.showIpaUpgrade);
                }
            },

            swap: function () {
                $('.lang-swap').bind('click', ke.app.handlers.onSwapLang);
            },

            toggleTextareaFocus: function () {
                $(document).off('focus').on('focus', '.translation-input', ke.particles.tr_input.model.onTextareaFocus);
                $(document).off('blur').on('blur', '.translation-input', ke.particles.tr_input.model.onTextareaBlur);
            },

            listenRaw: function () {
                $('.listen-raw-butt0n').bind('click', ke.particles.listen.model.playRaw);
            },

            listenTranslation: function () {
                $('.listen-translation').bind('click', ke.particles.listen.model.playTranslation);
            },

            listenSynonym: function () {
                $('.listen-v-item').bind('click', ke.particles.listen.model.playSynonym);
                $('.small-copy-button').bind('click', ke.particles.three_dots.model.copySynonym);
            },

            useSynonym: function () {
                $('.synonym').bind('click', ke.app.handlers.useSynonym);
            },

            listen: function () {
                this.listenRaw();
                //this.listenTranslation();
            },

            clearInput: function () {
                $('.clear-input').bind('click', ke.app.handlers.clearInput);
                //$('.translation-input').bind('keyup', ke.app.handlers.ctrlClearInputVisibility);
            },

            enableRawListen: function () {
                //$('.translation-input').bind('keyup', ke.particles.listen.model.ctrlRawVisibility);
            },

            onHistoryLinkClick: function () {
                $('.history-button').bind('click', ke.app.handlers.onHistoryLinkClick);
            },

            onSettingsLinkClick: function () {
                $('.settings-button').bind('click', ke.app.handlers.onSettingsLinkClick);
            },

            onUnpinLinkClick: function () {
                $('.unpin').bind('click', ke.app.handlers.onUnpinLinkClick);
            },

            translateOnClick: function () {
                $('.translate-button').bind('click', ke.particles.translate.model.translateSimple);
            },

            onResize: function () {
                $(window).resize(ke.app.handlers.onResize);
            },

            // in this method
            translateOnKeyCombinations: function () {
                ke.ext.util.storageUtil.requestBackgroundOption('getVal', ['win_trans_type'], function (type) {
                    ke.app.$input.bind('keydown', function (event) {
                        ke.particles.translate.model.checkTranslationShortcut(event, type);
                    });
                });

                ke.app.$input.bind('keyup', function (event) {
                    ke.particles.translate.model.toggleControls();
                });
            },

            translateOnKeyup: function () {
                $('.translation-input').bind('keyup', ke.particles.translate.model.translateOnKeyup);
            },

            saveValueOnKeyup: function () {
                ke.app.$input.bind('keyup', ke.particles.tr_input.model.saveValueOnKeyup);
            },

            countTextLength: function () {
                ke.app.$input.bind('keyup', ke.app.handlers.countTextLength);
            },

            shortcuts: function () {
                $(document.body).bind('keyup', ke.app.handlers.onShortcutsUp);
                $('.translation-input').bind('keyup', ke.app.handlers.onShortcutsUp);
            },

            dontAutocorrect: function () {
                $('.autocorrection-layout .ac-word').on('click', ke.app.handlers.dontAutocorrect);
            }
        }
    });

})();
