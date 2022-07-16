(function (undefined) {
    ke.import('ext.event');

    var translateInputTimeout;
    var prevInput = '';

    var $ac_layout = $('.autocorrection-layout');
    var $ac_word = $ac_layout.find('.ac-word');
    var $input = $('.translation-input');

    const MIN_DELAY_BETWEEN_TR = 1000;

    pl.extend(ke.particles.translate.model, {
        ctrlInstantVisibility: function (a) {
            pl('.translate-button')[a]();
            pl('.action-bar').addClass('centerized-ab');
        },

        showLoading: function () {
            $('.translate-button').hide();
            $('.loading').show();
        },

        hideLoading: function () {
            $('.loading').hide();
            $('.translate-button').show();
        },

        getTranslation: function (c, forced, val, retranslation) {
            if (ke.app.flags.isTranslating) {
                return;
            }

            if (!retranslation) {
                ke.ext.util.storageUtil.encodeAndSet('caret_positions', {
                    start: ke.app.$input.get(0).selectionStart,
                    end: ke.app.$input.get(0).selectionEnd
                });
            }

            var currentInput = pl.trim(val !== undefined ? val : $input.val());

            if (currentInput.length > ke.ext.googleApi.MAX_TEXT_LEN) {
                return;
            }

            if (pl.empty(currentInput)) {
                ke.app.prevInput = currentInput;
                ke.ui_views.empty_trans_states.displayEmptiness();
                return;
            } else if (currentInput === prevInput && !forced) {
                return;
            } else {
                ke.app.prevInput = currentInput;
                ke.ui_views.empty_trans_states.displayWorkaround();
            }

            ke.app.flags.isTranslating = true;

            if (!retranslation) {
                ke.particles.translate.model.showLoading();
            }

            ke.ext.util.storageUtil.chainRequestBackgroundOption([
                {fn: 'isTrueOption', args: ['autocorrection']},
                {fn: 'isTrueOption', args: ['autoswap']}
            ], function (r) {
                var autocorrection = r[0].response;
                var autoswap = r[1].response;

                chrome.runtime.sendMessage({
                    action: ke.processCall('app', 'translate', 'get'),
                    identificator: 'window',
                    text: currentInput,
                    source: 'popup'
                }, function (data) {
                    if (!data || data.no_results) {
                        ke.app.$no_results.show();
                        ke.particles.translate.model.hideLoading();

                        return;
                    }

                    ke.app.$no_results.hide();

                    //
                    // lang autoswap

                    if (data.reversed) {
                        ke.ui.dropdown.data.callback(1, data.from, null, true);
                        ke.ui.dropdown.data.callback(2, data.to, null, false);
                    }

                    //
                    // autoswap end

                    ke.app.flags.isTranslating = false;
                    ke.particles.translate.model.hideLoading();

                    $('.offline-cap').hide();

                    if (data.offline) {
                        $('.offline-cap').show();
                        ke.particles.listen.model.ctrlRawVisibility(false, ke.ext.util.langUtil.getToLang());
                    } else if (data.error) {
                        c({
                            network_error: true
                        });
                    } else if (!retranslation && data.correction && autocorrection) {
                        ke.app.flags.isAutocorrected = true;
                        ke.app.temp.valueBeforeAutocorrection = data.old_data.text;

                        $input.val(data.correction);
                        ke.particles.tr_input.model.saveValueOnKeyup();

                        ke.particles.translate.model.getTranslation(c, false, data.correction, true);

                        if (typeof ga != "undefined") ga('send', 'event', 'autocorrection', 'clicked');
                    } else {
                        if (!retranslation) {
                            ke.app.flags.isAutocorrected = false;
                        }

                        data.code = ke.ext.tpl.compile(data.code, {
                            from: ke.ext.util.langUtil.getFromLang(),
                            to: ke.ext.util.langUtil.getToLang()
                        });
                        c(data);
                    }
                });
            });
        },

        routeTranslation: function (d) {
            if (d.network_error) {
                ke.ui_views.empty_trans_states.displayEmptiness();
                ke.particles.listen.model.ctrlRawVisibility(undefined, '');
                ke.particles.listen.model.ctrlTransVisibility();
                return;
            }

            ke.app.flags.isPrevTranslationMulti = ke.app.flags.isCurrentTranslationMulti;
            ke.app.flags.isCurrentTranslationMulti = d.isMulti;
            ke.app.temp.currentDetectedLang = d.detected_lang || '';
            ke.app.temp.currentFromLang = d.from;
            ke.particles.listen.model.ctrlRawVisibility(undefined, d.detected_lang);
            ke.particles.translate.model.displayTranslation(d.code, d);

            if (!ke.app.flags.instant || ke.app.flags.isAutocorrected) {
                var caret_positions = ke.ext.util.storageUtil.getDecodedVal('caret_positions');
                pl('.translation-input').createSelection(caret_positions.start, caret_positions.end);
            }
        },

        displayTranslation: function (code, d) {
            var toggleLayout = function () {
                $('.translation-layout').fadeOut(125, 'easeInOutCirc', function () {
                    $('.translation-layout').html(code).fadeIn(125, 'easeInOutCirc', function () {
                        ke.particles.listen.model.ctrlTransVisibility(false, d.to);
                        ke.particles.listen.model.ctrlSynonymVis(false, d.to);
                        ke.app.render.events.listenTranslation();
                        ke.app.render.events.listenSynonym();
                        ke.app.render.events.useSynonym();
                        ke.app.render.events.showArticleUpgrade();
                        ke.app.render.events.showIpaUpgrade();

                        ke.particles.three_dots.view.fillContextMenu($('.more-butt0n'), d.from == 'auto' ? d.detected_lang : d.from, d.to);

                        if (d.from_unmodified === 'auto') {
                            $('.from-lang .select')
                                .html('')
                                .append(ke.getLocale('Kernel_Lang_' + ke.ext.util.langUtil.getLangNameByKey(d.detected_lang)));
                        }

                        if (!ke.app.flags.isNarrow
                            && ke.app.flags.isAutocorrected) {

                            $ac_word.html(ke.app.temp.valueBeforeAutocorrection);
                            $ac_layout.show();
                        } else {
                            $ac_layout.hide();
                        }

                        if (!d.isMulti && d.json[3].length < 35) {
                            $('.padded-single-translation').addClass('short-padded-single-translation');
                        }

                        // show gender
                        if (d.json[8] && ke.ext.util.storageUtil.isTrueOption('show_articles')) {
                            if (ke.ext.util.storageUtil.isTrueOption('chr_pro_flag')) {
                                $('.original-article')
                                    .html(d.json[8])
                                    .slideDown(125, ke.app.handlers.adjustOriginalIpa);
                                $('.translation-input').addClass('with-article');
                            } else {
                                $('.original-article')
                                    .addClass('blurred-out')
                                    .html('xyz')
                                    .slideDown(125, ke.app.handlers.adjustOriginalIpa);
                                $('.translation-input').addClass('with-article');
                            }
                        } else {
                            $('.original-article').slideUp(125, ke.app.handlers.adjustOriginalIpa);
                            $('.translation-input').removeClass('with-article');
                        }

                        // show ipa/translit for original
                        let orig_translit = ke.ext.googleApi.getSourceTranslitFromJson(d.json);
                        
                        if (ke.ext.util.storageUtil.isTrueOption('chr_pro_flag')) {
                            $('.original-ipa')
                                .removeClass('blurred-out')
                                .html(orig_translit);
                        } else {
                            orig_translit = d.json[1];

                            $('.mv-translit').addClass('blurred-out');

                            $('.original-ipa')
                                .addClass('blurred-out')
                                .html(orig_translit);
                        }

                        if (orig_translit && ke.ext.util.storageUtil.isTrueOption('show_ipa')) {
                            $('.original-ipa').show();
                        } else {
                            $('.original-ipa').hide();
                        }

                        if (!ke.ext.util.storageUtil.isTrueOption('show_ipa')) {
                            $('.mv-translit').hide();
                        }

                        if (ke.ext.util.langUtil.isHieroglyphical(d.to)) {
                            $('.translation-layout').addClass('non-bold-contents');
                        } else {
                            $('.translation-layout').removeClass('non-bold-contents');
                        }

                        var sel = '.main-variant-wrap';

                        if (!d.isMulti) {
                            sel = '.padded-single-translation';
                        }

                        $(sel).dblclick(function () {
                            var text = $(this).find('.mv-text-part').text().trim() || $(this).find('.tpart').text().trim();
                            ke.ext.clipboard.copyToClipboard(text);
                            ke.ui.notifications.show(ke.getLocale("Window_TranslationCopied"), 2500);

                            if (typeof ga != "undefined") ga('send', 'event', 'window', 'double-click-copy');
                        });

                        if (!ke.IS_SAMSUNG) {
                            ke.particles.scrollbars.model.setupTranslationScroll();
                        }
                    });
                });
            };

            if (ke.app.flags.isPrevTranslationMulti) {
                $('.v-closest-wrap').slideUp(50, ke.getAnimType('slide_up')).promise().done(function () {
                    $('.v-pos').fadeOut(25, ke.getAnimType('fade_out')).promise().done(function () {
                        $('.main-variant-wrap').slideUp(75, ke.getAnimType('slide_up')).promise().done(function () {
                            toggleLayout();
                        });
                    });
                });
            } else {
                toggleLayout();
            }
        },

        // ===========================
        //

        translateSimple: function (event, forced, val) {
            ke.particles.translate.model.getTranslation(ke.particles.translate.model.routeTranslation, forced, val);
            ke.particles.translate.model.toggleControls(val);
        },

        toggleControls: function (val) {
            if (!pl.empty(val || $input.val())) {
                ke.app.handlers.toggleRawControls(false);
            } else {
                ke.app.handlers.toggleRawControls(true);
            }
        },

        lastShortcutTranslationtime: Date.now(),

        checkTranslationShortcut: function (event, type) {
            var now = Date.now();
            var is_enter = ke.ext.event.is(ke.ext.event.getKeyCodeCombinationFromName('enter', true), event);
            var nl = (ke.ext.event.isDown('shift') && is_enter)
                || (ke.ext.event.isDown('ctrl') && is_enter)
                || (ke.ext.event.isDown('alt') && is_enter)
                || (ke.ext.event.isDown('cmd') && is_enter);

            if (type == 1 && nl) {
                if (now - ke.particles.translate.model.lastShortcutTranslationtime >= MIN_DELAY_BETWEEN_TR) {
                    ke.particles.translate.model.lastShortcutTranslationtime = now;
                    ke.particles.translate.model.getTranslation(ke.particles.translate.model.routeTranslation);
                }

                event.preventDefault();
            } else if (type == 2 && !nl && is_enter) {
                if (now - ke.particles.translate.model.lastShortcutTranslationtime >= MIN_DELAY_BETWEEN_TR) {
                    ke.particles.translate.model.lastShortcutTranslationtime = now;
                    ke.particles.translate.model.getTranslation(ke.particles.translate.model.routeTranslation);
                }

                event.preventDefault();
            } else if (type == 2 && nl) {
                var val = $input.val();
                $input.val(val + '\n');
            }
        },

        translateOnKeyCombinations: function (event) {
            if (ke.ext.event.isDown((ke.isMac ? 'cmd' : 'ctrl') + '+enter')) {
                event.stopPropagation();
                event.preventDefault();
                ke.particles.translate.model.getTranslation(ke.particles.translate.model.routeTranslation);
            }
        },

        translateOnKeyup: function () {
            clearTimeout(translateInputTimeout);

            ke.particles.translate.model.toggleControls();

            translateInputTimeout = setTimeout(function () {
                translateInputTimeout = null;
                ke.particles.translate.model.getTranslation(ke.particles.translate.model.routeTranslation);
            }, 725);

            return true;
        }
    });
})();
