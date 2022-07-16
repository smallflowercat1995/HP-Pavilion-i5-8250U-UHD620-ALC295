(function (undefined) {
    ke.import('templates.helpSelectedTooltip');
    ke.import('ui_components.tooltip.simple');
    ke.import('ui_components.tooltip.help');

    pl.extend(ke.ui.tooltip.helpSelected, {
        _getSelectionParameters: function (s) {
            return s.getRangeAt ? $.extend({
                scrollX: window.pageXOffset,
                scrollY: window.pageYOffset
            }, s.getRangeAt(0).getBoundingClientRect()) : {
                left: s.x || s.left,
                top: s.y || s.top,
                width: s.width,
                height: s.height
            };
        },

        _createTooltip: function (c, doc, ttid) {
            ke.ui.tooltip.help.setXOffset(3);
            return ke.ui.tooltip.simple.create(ke.ext.tpl.compile(ke.templates.helpSelectedTooltip, {
                content: c,
                prefix: ke.getPrefix(),
                ttid: ttid,
                l_human: ke.getLocale('Human_OrderButton'),
                l_original: ke.getLocale('Kernel_Original'),
                l_open: ke.getLocale('Kernel_OpenGt'),
                l_reversed: ke.getLocale('Kernel_Reverse'),
                l_unpin: ke.getLocale('Kernel_Unpin'),
                l_highlight: ke.getLocale('Kernel_Highlight'),
                l_loading: ke.getLocale('Kernel_Loading'),
                l_offline: ke.getLocale('Window_Offline'),
                title_highlight_button: ke.getLocale('Tooltip_Highlight'),
                title_open_link: ke.getLocale('Tootip_OpenLink'),
                title_listen_original: ke.getLocale('Tooltip_ListenOriginal'),
                title_show_reversed: ke.getLocale('Tooltip_ShowReversed'),
                title_unpin: ke.getLocale('Tooltip_Unpin'),
                ti_localized: ke.getLocale("There_Is_Localised_Site"),
                ti_localized_desc: ke.getLocale("There_Is_Localised_Site_Desc"),
                title_settings: ke.getLocale('Kernel_SettingsTitle'),
                dd_localized: ke.getLocale('Tooltip_DisableDoubleClick'),
                dd_localized_desc: ke.getLocale('Tooltip_DisableDoubleClickDesc'),
                sel_localized: ke.getLocale('Tooltip_DisableSelection'),
                sel_localized_desc: ke.getLocale('Tooltip_DisableSelectionDesc'),
                netflix_save: 'SAVE',
                netflix_continue: 'CONTINUE'
            }), ttid, 0, 0, 450, 325, doc, true);
        },

        _createLoadingTooltip: function (doc) {
            ke.ui.tooltip.help.setXOffset(3);
            return ke.ui.tooltip.simple.create('<div class="' + ke.getPrefix() + 'loading">LOADING...</div>', 0, 0, 0, 450, 325, doc, true);
        },

        _addToggleClasses: function () {
            pl(ke.ui.tooltip.simple.Id + ' *').addClass('TnITTtw-t');
        },

        tooltipId: 0,

        toggleLoadingInTooltip: function (ttid, is_loading) {
            //
            // remove previous loadings
            //
            $('.' + ke.getPrefix() + 'translate-loading').fadeOut(250, function () {
                $(this).remove();
            });

            if (is_loading) {
                var selection = ke.particles.translate_ctt.model.getSelection();
                var params = selection.toString()
                    ? ke.ui.tooltip.helpSelected._getSelectionParameters(selection)
                    : ke.app.handlers.lastTranslationCallArgs.selectionBB;

                var $dest = $('body');
                var is_netflix = false;

                if (document.location.href.indexOf('https://www.netflix.com/watch') > -1) {
                    $dest = $('.nf-player-container');
                    is_netflix = true;
                } else if ($dest.length === 0) {
                    $dest = $('html');
                }

                var height = 70;
                var width = height;
                var x = params.left + params.width / 2 + window.pageXOffset - width / 2;
                var y;

                if (params.top + params.height + 10 + height > window.innerHeight || is_netflix) {
                    y = params.top - 10 - height + window.pageYOffset; // loading is above
                } else {
                    y = params.top + params.height + 10 + window.pageYOffset; // loading is below
                }

                $dest.append(
                    $('<div class="' + ke.getPrefix() + 'translate-loading"></div>')
                        .addClass(ke.app.flags.dark_mode || is_netflix ? ke.getPrefix() + 'dark-mode' : '')
                        .html('<div class="' + ke.getPrefix() + 'mate-loading"></div>')
                        .css({
                            top: y,
                            left: x
                        })
                );
            }
        },

        toggleOfflineInTooltip: function (ttid, is_offline) {
            if (is_offline) {
                $('.' + ke.getPrefix() + 'tooltip-' + ttid)
                    .find('.' + ke.getPrefix() + 'offline')
                    .css('display', 'flex');
            } else {
                $('.' + ke.getPrefix() + 'tooltip-' + ttid)
                    .find('.' + ke.getPrefix() + 'offline')
                    .fadeOut(250, function () {
                        $(this).remove();
                    });
            }
        },

        fadeInTooltip: function (ttid, callback) {
            $('.' + ke.getPrefix() + 'tooltip-' + ttid).fadeIn(400, callback);
        },

        showTooltip: function (selection, doc, iframe) {
            var ttid = ++ke.ui.tooltip.helpSelected.tooltipId;

            var sel_params = this._getSelectionParameters(selection);
            var tooltip = this._createTooltip('', doc, ttid);

            var left = 0;
            var top = 0;
            var params;

            if (iframe) {
                var iframePos = ke.ext.dom.getPosition(iframe);
                left = iframePos[0];
                top = iframePos[1];
            }

            left += sel_params.left; //- (window.scrollX - sel_params.scrollX);
            top += sel_params.top; //- (window.scrollY - sel_params.scrollY);
            params = ke.ui.tooltip.help.getOParamsInstance(sel_params);

            var scale = ke.app.temp.scale;

            tooltip.css('transform', 'scaleX(' + scale + ') scaleY(' + scale + ')');

            ke.ui.tooltip.help.computeTooltipPosition(tooltip, left, top, params, scale, function (tp) {
                ke.ui.tooltip.help.applyTooltipPosition(tooltip, tp);

                var $dest = $('body');
                var dark_mode = ke.app.flags.dark_mode;

                if (document.location.href.indexOf('https://www.netflix.com/watch') > -1) {
                    $dest = $('.nf-player-container');
                    dark_mode = true;
                } else if ($dest.length === 0) {
                    $dest = $('html');
                }

                $(tooltip).data('ttid', ttid);

                if (dark_mode) {
                    tooltip.addClass(ke.getPrefix() + 'dark-mode');
                }

                $dest.append(tooltip.get());

                ke.ui.tooltip.help.attachArrows(ttid);
                ke.ui.tooltip.help.applyArrowPosition(tooltip, tp, left, top, scale, params);

                ke.ui.tooltip.helpSelected._addToggleClasses();
            });

            return ttid;
        },

        setTooltipContents: function (ttid, code) {
            $('.' + ke.getPrefix() + 'content-layout-' + ttid).html(code);
            ke.ui.tooltip.helpSelected._addToggleClasses();
        },

        get MAX_HEIGHT() {
            return 253;
        },

        resizeTooltip: function (ttid, unpinned, pullup_px, vl_shift) {
            pullup_px = pullup_px || 0;
            vl_shift = vl_shift || 0;

            var was_above = $('.' + ke.getPrefix() + 'hsw-' + ttid).hasClass(ke.getPrefix() + 'has-bottom-arr0w');

            var has_sw_warn = !$('.' + ke.getPrefix() + 'iw-' + ttid).hasClass(ke.getPrefix() + 'hide')
                || $('.' + ke.getPrefix() + 'nf-' + ttid).is(':visible');
            var sw_warn_height = ($('.' + ke.getPrefix() + 'iw-' + ttid).height() + parseInt($('.' + ke.getPrefix() + 'iw-' + ttid).css("padding")) * 2) || 0;

            var content_height = vl_shift + parseInt($('.' + ke.getPrefix() + 'content-layout-' + ttid).css('height'));

            if (content_height > ke.ui.tooltip.helpSelected.MAX_HEIGHT) {
                content_height = ke.ui.tooltip.helpSelected.MAX_HEIGHT;
            }

            var tt_height = $('.' + ke.getPrefix() + 'hil-' + ttid).height();
            var new_height = content_height
                + 11
                + 10
                + parseInt($('.' + ke.getPrefix() + 'tooltip-' + ttid)
                    .find('.' + ke.getPrefix() + (unpinned ? 'unpinned-' : '') + 'utils')
                    .css('height'));

            $('#' + ke.getPrefix() + 'trVisibleLayout-' + ttid).css('height', content_height - vl_shift);
            $('.' + ke.getPrefix() + 'hil-' + ttid).css('height', new_height);

            $('.' + ke.getPrefix() + 'tooltip-' + ttid)
                .animate({
                    'top': parseInt($('.' + ke.getPrefix() + 'tooltip-' + ttid).css('top'))
                    - (has_sw_warn && was_above ? sw_warn_height + pullup_px : 0)
                    + (was_above ? tt_height - new_height : 0)
                }, 125);
        }
    });
})();