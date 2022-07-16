(function (undefined) {

    const INLINE_OPT_MAX_SHOWS = 2;

    pl.extend(ke.particles.translate_ctt.model, {
        currentSelectedText: '',

        getCurrentSelectedText: function () {
            return ke.particles.translate_ctt.model.currentSelectedText;
        },

        setCurrentSelectedText: function (text) {
            ke.particles.translate_ctt.model.currentSelectedText = text;
        },

        getSelection: function (win) {
            win = win || window;

            var selection = null;
            if (win.getSelection) {
                selection = win.getSelection();
            } else if (document.getSelection) {
                selection = document.getSelection();
            }

            return selection;
        },

        getSelectedText: function (win) {
            var sel = this.getSelection(win);
            if (sel) {
                return pl.trim(sel.toString());
            }

            return '';
        },

        getTranslation: function (t, c, from, to, id, type) {
            if (pl.empty(t) || ke.app.flags.isTranslating) {
                return;
            }

            // cut off the rest if the text is too long
            t = t.substr(0, ke.ext.googleApi.MAX_TEXT_LEN);

            ke.app.flags.isTranslating = true;

            chrome.runtime.sendMessage({
                action: ke.processCall('app', 'translate', 'get'),
                identificator: 'tooltip',
                type: type,
                text: t,
                from: from,
                to: to,
                prefix: ke.getPrefix(),
                id: id,
                source: document.location.href
            }, function (data) {
                ke.app.flags.isCurrentTranslationMulti = data.isMulti;
                ke.app.flags.isTranslating = false;

                if (data.offline) {
                    c(true, data);
                } else {
                    data.code = ke.ext.tpl.compile(data.code, {
                        from: data.from === 'auto' ? data.detected_lang : data.from,
                        to: data.to
                    });

                    c(false, data);

                    ke.app.temp.currentDetectedLang = data.detected_lang || '';
                }
            });
        },

        display: function (is_offline, data, manual_show) {
            if (ke.section === 'pdf_tooltip') {
                data.old_data.id = 'null';
            }

            var $tt = $('.' + ke.getPrefix() + 'tooltip-' + data.old_data.id);
            var with_info_wrap = false;

            ke.ext.util.storageUtil.chainRequestBackgroundOption([
                {fn: 'getIntValue', args: ['double_click_inline_shows']},
                {fn: 'getIntValue', args: ['selection_inline_shows']},
                {fn: 'getIntValue', args: ['new_settings_counter']},
                {fn: 'isTrueOption', args: ['show_ipa']},
                {fn: 'isTrueOption', args: ['show_articles']},
                {fn: 'isTrueOption', args: ['chr_pro_flag']}
            ], function (r) {
                var dd_shows = r[0].response;
                var sel_shows = r[1].response;
                var sett_shows = r[2].response;
                var ipa = r[3].response;
                var articles = r[4].response;
                var pro = r[5].response;

            if (!pro) {
                ke.app.render.events.showUpgradeForIpaAndArticles();
            }

                if (data.old_data.type === 'double-click' && dd_shows < INLINE_OPT_MAX_SHOWS) {
                    $tt.find('.' + ke.getPrefix() + 'ddopt-' + data.old_data.id + '.' + ke.getPrefix() + 'hide').removeClass(ke.getPrefix() + 'hide');
                    with_info_wrap = true;

                    // increment inline option shows
                    ke.ext.util.storageUtil.requestBackgroundOption('setVal', ['double_click_inline_shows', dd_shows + 1]);
                } else {
                    $tt.find('.' + ke.getPrefix() + 'ddopt-' + data.old_data.id + ':not(.' + ke.getPrefix() + 'hide)').addClass(ke.getPrefix() + 'hide');
                }

                if (data.old_data.type === 'selection' && sel_shows < INLINE_OPT_MAX_SHOWS) {
                    $tt.find('.' + ke.getPrefix() + 'selopt-' + data.old_data.id + '.' + ke.getPrefix() + 'hide').removeClass(ke.getPrefix() + 'hide');
                    with_info_wrap = true;

                    // increment inline option shows
                    ke.ext.util.storageUtil.requestBackgroundOption('setVal', ['selection_inline_shows', sel_shows + 1]);
                } else {
                    $tt.find('.' + ke.getPrefix() + 'selopt-' + data.old_data.id + ':not(.' + ke.getPrefix() + 'hide)').addClass(ke.getPrefix() + 'hide');
                }

                if (!ipa) {
                    $tt.find('.' + ke.getPrefix() + 'mv-translit').remove();
                }

                if (with_info_wrap) {
                    $tt.find('.' + ke.getPrefix() + 'help-selected-wrap').addClass(ke.getPrefix() + 'with-info-warn');
                } else {
                    $tt.find('.' + ke.getPrefix() + 'help-selected-wrap').removeClass(ke.getPrefix() + 'with-info-warn');
                }
            });

            if (!manual_show) {
                ke.ui.tooltip.helpSelected.toggleLoadingInTooltip(data.old_data.id, false);

                if (is_offline) {
                    ke.ui.tooltip.helpSelected.toggleOfflineInTooltip(data.old_data.id, true);
                    return;
                }

                ke.ui.tooltip.helpSelected.setTooltipContents(data.old_data.id, data.code);
            }

            var tt_y_crop = 0;

            if ($tt.find('.' + ke.getPrefix() + 'top-arr0w').is(':visible')) {
                $tt.find('#' + ke.getPrefix() + 'tr-scrollbar').addClass(ke.getPrefix() + 'top-scroll');
            }

            $tt.find('.' + ke.getPrefix() + 'from-flag').attr('src', ke.pathToExt + 'res/images/flags/' + data.from + '@2x.png');
            $tt.find('.' + ke.getPrefix() + 'to-flag').attr('src', ke.pathToExt + 'res/images/flags/' + data.to + '@2x.png');

            if (!data.isMulti && data.json[3].length < 35) {
                $tt.find('.' + ke.getPrefix() + 'padded-single-translation').addClass(ke.getPrefix() + 'short-padded-single-translation');
            }

            if (ke.ext.util.langUtil.isHieroglyphical(data.to)) {
                $tt.find('.' + ke.getPrefix() + 'content-layout').addClass(ke.getPrefix() + 'non-bold-contents');
            } else {
                $tt.find('.' + ke.getPrefix() + 'content-layout').removeClass(ke.getPrefix() + 'non-bold-contents');
            }

            ke.particles.listen.model.ctrlTooltipOrigVisibility(false, data.from, $tt);
            ke.particles.listen.model.ctrlTooltipTransVisibility(false, data.to, $tt);
            ke.particles.listen.model.ctrlSynonymVis(false, data.to, $tt);

            ke.app.render.events.listen();
            ke.app.render.events.listenSynonym();
            ke.app.render.events.reverseTranslation();
            ke.app.render.events.settings();

            // check for that unpinned window translator in pdf files
            if (ke.app.render.events.unpin) {
                ke.app.render.events.unpin();
            }

            if (data.json[1].length <= ke.ext.googleApi.MAX_IPA_LEN) {
                $('.' + ke.getPrefix() + 'original-wrap').show();
            }

            $tt.find('.' + ke.getPrefix() + 'small-copy-button').on('click', ke.particles.three_dots.model.copySynonym);

            if (ke.app.flags.netflix_player_loaded) {
                $tt.find('.' + ke.getPrefix() + 'help-selected-wrap')
                    .addClass(ke.getPrefix() + 'with-netflix-buttons');
                $tt.find('.' + ke.getPrefix() + 'netflix-buttons').show();

                $tt.find('.' + ke.getPrefix() + 'netflix-save').on('click', ke.app.handlers.netflix.save);
                $tt.find('.' + ke.getPrefix() + 'netflix-continue').on('click', ke.app.handlers.netflix.continue);

                if (ke.app.temp.wordlist_id) {
                    $tt.find('.' + ke.getPrefix() + 'netflix-words').on('click', ke.app.handlers.netflix.viewSavedWords);
                } else {
                    $tt.find('.' + ke.getPrefix() + 'netflix-buttons')
                        .css('display', 'flex')
                        .css('align-items', 'center');
                    $tt.find('.' + ke.getPrefix() + 'netflix-words').remove();
                }
            }

            if (data.old_data.type === 'double-click') {
                ke.app.render.events.doubleClickOptionActions(data.old_data.id);
            }

            if (data.old_data.type === 'selection') {
                ke.app.render.events.selectionOptionActions(data.old_data.id);
            }


            ke.ui.tooltip.helpSelected.fadeInTooltip(data.old_data.id, function () {
                ke.particles.three_dots.view.fillContextMenu($('.' + ke.getPrefix() + 'more-butt0n'), data.from, data.to, data.old_data.id);

                if (!ke.is_touch_device()) {
                    ke.particles.scrollbars.model.setupHelpSelectedScroll(data.old_data.id, tt_y_crop);
                }
            });

            setTimeout(ke.app.handlers.hideSelectionButton, 250);
        },

        showTranslation: function (text, from, to, win, iframe, type) {
            var that = this;

            ke.ext.util.storageUtil.chainRequestBackgroundOption([
                {fn: 'isTrueOption', args: ['dark_mode']},
                {fn: 'getVal', args: ['tooltip_scale']}
            ], function (r) {
                ke.app.flags.dark_mode = r[0].response;

                if (!ke.IS_SAMSUNG) {
                    ke.app.temp.scale = r[1].response;
                }

                var id;

                var selection = that.getSelection(win);
                var selected_text = selection.toString();

                if (selected_text) {
                    ke.app.handlers.lastTranslationCallArgs.selectionBB = selection.getRangeAt(0).getBoundingClientRect();
                    ke.app.handlers.lastTranslationCallArgs.text = selected_text;
                    ke.app.handlers.lastTranslationCallArgs.from = from;
                    ke.app.handlers.lastTranslationCallArgs.to = to;

                    id = ke.ui.tooltip.helpSelected.showTooltip(selection, win, iframe);
                    ke.ui.tooltip.helpSelected.toggleLoadingInTooltip(id, true);

                } else if (ke.app.handlers.lastTranslationCallArgs.selectionBB && ke.app.handlers.lastTranslationCallArgs.text) {
                    ke.app.handlers.lastTranslationCallArgs.from = from;
                    ke.app.handlers.lastTranslationCallArgs.to = to;

                    id = ke.ui.tooltip.helpSelected.showTooltip(ke.app.handlers.lastTranslationCallArgs.selectionBB, win, iframe);
                    ke.ui.tooltip.helpSelected.toggleLoadingInTooltip(id, true);

                    selected_text = ke.app.handlers.lastTranslationCallArgs.text;
                } else {
                    return;
                }

                that.getTranslation(selected_text, function (is_offline, data) {
                    $('.' + ke.getPrefix() + 'tooltip-' + id)
                        .find('.' + ke.getPrefix() + 'listen-original')
                        .attr('data-from', data.from === 'auto' ? data.detected_lang : data.from);

                    $('.' + ke.getPrefix() + 'tooltip-' + id)
                        .find('.' + ke.getPrefix() + 'listen-translation')
                        .attr('data-to', data.to);

                    that.display(is_offline, data);
                }, from, to, id, type);
            });
        }
    });

})();