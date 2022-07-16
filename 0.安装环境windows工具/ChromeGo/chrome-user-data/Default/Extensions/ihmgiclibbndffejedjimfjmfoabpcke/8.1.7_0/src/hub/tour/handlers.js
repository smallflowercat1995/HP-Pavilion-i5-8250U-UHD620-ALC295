/* Kumquat Hub Tour Handlers
 * 
 **/

(function (undefined) {

    pl.extend(ke.app.handlers, {
        trackShiftT: function () {
            if (ke.ext.event.isDown('shift+t')) {
                ke.ui.info_alert.show(ke.getLocale('Tour_UhHuh'), ke.ext.tpl.compile(ke.getLocale('Tour_NoShiftT'), {
                    browser: ke.browserName
                }), ke.getLocale('Tour_GotIt'));

                if (typeof ga != "undefined") ga('send', 'event', 'tour', 'shift-t');
            }
        },

        onDoubleClick: function (event) {
            if ((event.target.className || '').indexOf(ke.getPrefix()) > -1) {
                return;
            }

            chrome.runtime.sendMessage({
                action: ke.processCall('app', 'option', 'getDoubleClickOptionActiveness'),
                identificator: 'tooltip'
            }, function (activeness_data) {
                if (!activeness_data.is_active || pl.empty(ke.particles.translate_ctt.model.getSelectedText())) {
                    return;
                }

                ke.app.handlers.skipSelectTranslation = true;

                if (typeof ga != "undefined") ga('send', 'event', 'tour', 'double-click');

                chrome.runtime.sendMessage({
                    action: ke.processCall('app', 'option', 'getMainLanguagePair'),
                    identificator: 'tooltip'
                }, function (l_data) {
                    ke.particles.translate_ctt.model.showTranslation(undefined, l_data.from_lang, l_data.to_lang, null, null, 'double-click');
                });
            });
        },

        lastTranslationCallArgs: {},
        skipSelectTranslation: false,

        onSelection: function (event) {
            if (pl.empty(ke.particles.translate_ctt.model.getSelectedText())
                || (event.target.className || '').indexOf(ke.getPrefix()) > -1) {

                //
                // hide button
                $('.' + ke.getPrefix() + 'translate-selection-button').fadeOut(150, function () {
                    $(this).remove();
                });

                //
                // don't execute code below
                return;
            }

            chrome.runtime.sendMessage({
                action: ke.processCall('app', 'option', 'getTranslateOnSelectActiveness'),
                identificator: 'tooltip'
            }, function (activeness_data) {
                /*if (!activeness_data.is_active || pl.empty(ke.particles.translate_ctt.model.getSelectedText())) {
                    return;
                }*/

                chrome.runtime.sendMessage({
                    action: ke.processCall('app', 'option', 'getMainLanguagePair'),
                    identificator: 'tooltip'
                }, function (l_data) {
                    if (ke.app.handlers.skipSelectTranslation) {
                        ke.app.handlers.skipSelectTranslation = false;
                        return;
                    }

                    var selection = ke.particles.translate_ctt.model.getSelection();
                    var params = ke.ui.tooltip.helpSelected._getSelectionParameters(selection);

                    ke.app.handlers.lastTranslationCallArgs.text = selection.toString();
                    ke.app.handlers.lastTranslationCallArgs.selectionBB = params;

                    if (typeof ga != "undefined") {
                        ga('send', 'event', 'tour', 'text-selection');
                    }

                    $('.' + ke.getPrefix() + 'translate-selection-button').remove();

                    $('body').append(
                        $('<div class="' + ke.getPrefix() + 'translate-selection-button"></div>')
                            .css({
                                top: params.top + params.height + 10 + window.pageYOffset,
                                left: params.left + window.pageXOffset
                            })
                            .data('l-from', l_data.from_lang)
                            .data('l-to', l_data.to_lang)
                            .on('click', ke.app.handlers.translateSelection)
                    );
                });
            });
        },

        translateSelection: function (event) {
            event.stopPropagation();
            event.preventDefault();

            var from = $(this).data('l-from');
            var to = $(this).data('l-to');

            ke.particles.translate_ctt.model.showTranslation(undefined, from, to, null, null, 'selection');
        },

        showPreviousCarouselTab: function () {
            var _new_tab = ke.app.temp.currentTab - 1;

            // skip pdf translation tab
            if (!ke.IS_CHROME && _new_tab === ke.app.PDF_TAB_NUM) _new_tab--;

            var new_tab = Math.max(1, _new_tab);

            if (ke.app.temp.currentTab === new_tab) {
                return;
            }

            ke.app.render.organize.showCarouselTab(new_tab);
            ke.app.temp.currentTab = new_tab;
        },

        showNextCarouselTab: function () {
            var _new_tab = ke.app.temp.currentTab + 1;

            // skip pdf translation tab
            if (!ke.IS_CHROME && _new_tab === ke.app.PDF_TAB_NUM) _new_tab++;

            var new_tab = Math.min(ke.app.TABS, _new_tab);

            if (ke.app.temp.currentTab === new_tab) {
                return;
            }

            ke.app.render.organize.showCarouselTab(new_tab);
            ke.app.temp.currentTab = new_tab;
        },

        gotIt: function (event) {
            if (typeof ga != "undefined") ga('send', 'event', 'tour', 'start-using');

            if ($(this).hasClass('gdpr-consent')) {
                if (typeof ga != "undefined") ga('send', 'event', 'gdpr', 'anonymous-gdpr-consent');
            }

            ke.app.handlers.accepted = true;

            chrome.runtime.sendMessage({
                action: ke.processCall('app', 'option', 'enableOption'),
                option: 'gdpr_consent'
            });

            window.close();
        },

        handleLoginStateChange: function (data) {
            var parts = ke.parseProcessCall(data.action);

            if (parts.lib === 'app' && parts.cmd === 'login' && parts.exact === 'done') {
                window.close();
            }
        },

        getListenValue: function (s, event) {
            var $where = !event.target ? event : $(ke.ext.util.selectorsUtil.getTooltipWrapRecursively(event.target));

            if (s === 'orig') {
                var i = $where.find('.' + ke.getPrefix() + 'original-wrap .' + ke.getPrefix() + 'mv-text-part').html();
                if (!i) {
                    return $where.find('.' + ke.getPrefix() + 'original-wrap .' + ke.getPrefix() + 'tpart').html();
                } else {
                    return i;
                }
            } else if (s === 'trans') {
                var i = $where.find('.' + ke.getPrefix() + 'main-variant .' + ke.getPrefix() + 'mv-text-part').html();
                if (!i) {
                    return $where.find('.' + ke.getPrefix() + 'trans-wrap .' + ke.getPrefix() + 'tpart').html();
                } else {
                    return i;
                }
            }

            return '';
        },

        settings: function () {
            chrome.runtime.sendMessage({
                action: ke.processCall('app', 'opt', 'newTab'),
                url: chrome.extension.getURL('/pages/public/options.html#2')
            });

            chrome.runtime.sendMessage({
                action: ke.processCall('app', 'commands', 'sendAnalyticsEvent'),
                cat: 'tour',
                event: 'settings'
            });
        },

        closeInlineOption: function (event) {
            event.stopPropagation();

            var ttid = +$(this).data('ttid');
            var option = $(this).parent().data('option');

            $(this).parent().slideUp(125, 'easeInOutQuint', function () {
                $(this).remove();
                $('.' + ke.getPrefix() + 'hsw-' + ttid).removeClass(ke.getPrefix() + 'with-info-warn');
            });

            chrome.runtime.sendMessage({
                action: ke.processCall('app', 'commands', 'sendAnalyticsEvent'),
                cat: 'tour',
                event: 'inline-option-close',
                subevent: option
            });
        },

        disableInlineOption: function () {
            var option = $(this).data('option');

            chrome.runtime.sendMessage({
                action: ke.processCall('app', 'option', 'disableOption'),
                option: option
            });

            chrome.runtime.sendMessage({
                action: ke.processCall('app', 'commands', 'sendAnalyticsEvent'),
                cat: 'tour',
                event: 'inline-option-disable',
                subevent: option
            });

            $(this)
                .addClass(ke.getPrefix() + 'disabled')
                .find('span')
                .html(ke.getLocale('Tooltip_InlineOptionDisabled'));
        },

        onLanguagePickerOpen: function (index, ot) {
            ke.particles.scrollbars.model.setupComboOptionsDropdownScroll(2, ot);
        },

        onLanguagePickerChange: function (serial, v) {
            ke.ext.util.storageUtil.requestBackgroundOption('setVal', ['to_lang', v]);

            chrome.runtime.sendMessage({
                action: ke.processCall('app', 'commands', 'sendAnalyticsEvent'),
                cat: 'tour',
                event: 'set-lang',
                subevent: v
            });

            chrome.runtime.sendMessage({
                action: ke.processCall('app', 'opt', 'generateDropdownHtml')
            }, ke.app.initLanguagePicker);
        },

        accepted: false,

        onBeforeUnload: function (event) {
            if (!ke.app.handlers.accepted) {
                chrome.runtime.sendMessage({
                    action: ke.processCall('app', 'commands', 'sendAnalyticsEvent'),
                    cat: 'tour',
                    event: 'close',
                    subevent: ke.app.temp.currentTab
                });

                if (typeof event == 'undefined') {
                    event = window.event;
                }

                var msg = "Are you sure? It's really important!";

                event.returnValue = msg;

                return msg;
            }
        },

        openPP: function () {
            chrome.tabs.create({url: 'https://www.matetranslate.com/privacy-policy'});

            chrome.runtime.sendMessage({
                action: ke.processCall('app', 'commands', 'sendAnalyticsEvent'),
                cat: 'tour',
                event: 'open-privacy'
            });
        },

        openToS: function () {
            chrome.tabs.create({url: 'https://www.matetranslate.com/terms-of-use'});

            chrome.runtime.sendMessage({
                action: ke.processCall('app', 'commands', 'sendAnalyticsEvent'),
                cat: 'tour',
                event: 'open-tos'
            });
        },

        hideImportanceAlert: function () {
            $('.importance-alert').fadeOut(250);
        },

        startSafariTrial: function () {
            ke.ext.util.storageUtil.setIntValue('trial_start', Date.now());

            if (typeof ga != "undefined") ga('send', 'event', 'tour', 'start-trial');

            ke.app.handlers.accepted = true;

            chrome.runtime.sendMessage({
                action: ke.processCall('app', 'option', 'enableOption'),
                option: 'trial_started'
            });

            chrome.runtime.sendMessage({
                action: ke.processCall('app', 'option', 'enableOption'),
                option: 'gdpr_consent'
            });

            window.close();
        }
    });

})();