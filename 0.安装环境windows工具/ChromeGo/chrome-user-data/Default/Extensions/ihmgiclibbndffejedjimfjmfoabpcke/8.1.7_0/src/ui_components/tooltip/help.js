(function (undefined) {

    ke.import('templates.helpTooltip');
    ke.import('ui_components.tooltip.simple');

    if (ke.section !== 'content') {
        ke.import('s:ui_components.tooltip.help');
    }

    var Y_OFFSET = 10;
    var arrowXOffset = 0;

    pl.extend(ke.ui.tooltip.help, {
        setXOffset: function (offset) {
            arrowXOffset = offset;
        },

        show: function (text, e) {
            var elementPosition = ke.ext.dom.getPosition(e);
            var left = elementPosition[0];
            var top = elementPosition[1];
            var params = ke.ui.tooltip.help.getOParamsInstance(e);

            ke.ui.tooltip.simple.create(ke.ext.tpl.compile(ke.templates.helpTooltip, {
                content: text
            }), -100, -100, 250, 200, document);

            setTimeout(function () {
                ke.ui.tooltip.help.attachArrows();

                var ap = ke.ui.tooltip.help.computeArrowPosition(left, top, params);
                ke.ui.tooltip.help.computeTooltipPosition(left, top, params, function (tp) {
                    ke.ui.tooltip.help.applyArrowPosition(ap);
                    ke.ui.tooltip.help.applyTooltipPosition(tp);
                });
            }, 25);
        },

        getOParamsInstance: function (g) {
            g.width = g.width || 0;
            g.height = g.height || 0;
            g.pl = g.pl || 0;
            g.pr = g.pr || 0;
            g.pt = g.pt || 0;
            g.pb = g.pb || 0;
            return g;
        },

        getAllParams: function (e) {
            return pl.extend(ke.ui.tooltip.help.computeOParams(e), {
                left: ke.ext.dom.getPosition(e)[0],
                top: ke.ext.dom.getPosition(e)[1]
            });
        },

        computeOParams: function (e) {
            return ke.ui.tooltip.help.getOParamsInstance({
                width: parseInt(pl(e).css('width')),
                height: parseInt(pl(e).css('height')),
                pl: parseInt(pl(e).css('padding-left')),
                pr: parseInt(pl(e).css('padding-right')),
                pt: parseInt(pl(e).css('padding-top')),
                pb: parseInt(pl(e).css('padding-bottom'))
            });
        },

        attachArrows: function (ttid) {
            $('.' + ke.getPrefix() + 'tooltip-' + ttid).prepend(
                $('<div>')
                    .addClass(ke.getPrefix() + 't').addClass(ke.getPrefix() + 'arr0w').addClass(ke.getPrefix() + 'top-arr0w')
                    .get()
            );

            $('.' + ke.getPrefix() + 'tooltip-' + ttid).append(
                $('<div>')
                    .addClass(ke.getPrefix() + 't').addClass(ke.getPrefix() + 'arr0w').addClass(ke.getPrefix() + 'bottom-arr0w')
                    .get()
            );
        },


        // returns [pos x, pos y, 'top' / 'bottom']
        computeTooltipPosition: function (el, ix, iy, oparams, scale, callback) {
            var pos = [0, 0];

            var tooltip_width = 0;
            var tooltip_height = 0;

            $(el.get()).measure(function () {
                tooltip_width = this.width();
                tooltip_height = this.height();

                var absolute_selection_left_scroll = ix + ke.app.bodyScrollLeft;
                var absolute_selection_top_scroll = iy + ke.app.bodyScrollTop;

                var selection_absolute_width = oparams.width + oparams.pl + oparams.pr;
                var selection_absolute_height = oparams.height + oparams.pt + oparams.pb;

                pos[0] = absolute_selection_left_scroll - tooltip_width / 2 + selection_absolute_width / 2;
                pos[1] = absolute_selection_top_scroll - tooltip_height - Y_OFFSET * scale;
                pos[2] = 'bottom'; // tooltip is above, arrow is on bottom

                // Horizontal alignment
                if (pos[0] - ke.app.bodyScrollLeft < 1) {

                    // stick to the left side

                    pos[0] = ke.app.bodyScrollLeft + 1 - tooltip_width * (1 - scale) / 2;
                } else if (pos[0] + tooltip_width > document.body.clientWidth) {

                    // stick to the right side

                    pos[0] = document.body.clientWidth - tooltip_width - 1 + tooltip_width * (1 - scale) / 2;
                }

                // A vertical one
                if (pos[1] - ke.app.bodyScrollTop < 1) {
                    pos[1] = absolute_selection_top_scroll + selection_absolute_height + Y_OFFSET * scale;

                    // tooltip below the selection
                    // if scale != 1
                    pos[1] -= tooltip_height * (1 - scale) / 2;

                    pos[2] = 'top'; // tooltip is below, arrow is on top
                } else {
                    pos[1] += tooltip_height * (1 - scale) / 2;
                }

                callback(pos);
            });
        },

        applyArrowPosition: function ($el, tp, sel_ix, sel_iy, scale, oparams) {
            var tt_ix = tp[0];
            var cursor_type = tp[2];
            var cursor_width = 32;

            var absolute_selection_left_scroll = sel_ix + ke.app.bodyScrollLeft;
            var selection_absolute_width = oparams.width + oparams.pl + oparams.pr;
            var sel_center = absolute_selection_left_scroll + selection_absolute_width / 2;

            var cursorLeftMargin = sel_center - tt_ix - cursor_width * scale / 2;

            $el.find('.' + ke.getPrefix() + 'help-selected-wrap').addClass(ke.getPrefix() + 'has-' + cursor_type + '-arr0w');

            $el.find('.' + ke.getPrefix() + cursor_type + '-arr0w')
                .css('margin-left', cursorLeftMargin)
                .show();
        },

        applyTooltipPosition: function (el, pos) {
            var $el = $(el.get());
            var real_y = pos[1] - 5;

            $el.css({
                left: pos[0],
                top: real_y
            });
        }
    });

})();