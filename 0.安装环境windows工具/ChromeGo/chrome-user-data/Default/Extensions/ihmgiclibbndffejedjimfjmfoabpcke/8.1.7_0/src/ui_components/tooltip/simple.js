(function () {

    ke.import('templates.simpleTooltip');

    if (ke.section !== 'content') {
        ke.import('s:ui_components.tooltip.simple');
    }

    var SEL = '#' + ke.getPrefix() + 'tooltip-wrap';

    // The frame of all forth tooltips, because exactly these methods provides showing simple tooltips
    // and adjusting its position.

    pl.extend(ke.ui.tooltip.simple, {
        temp: {
            openCounter: 0
        },

        get Id() {
            return SEL;
        },

        _createElement: function (ic, ttid) {
            return pl(pl('<div>')
                .append(ke.ext.tpl.compile(ke.templates.simpleTooltip, {
                    content: ic,
                    prefix: ke.getPrefix(),
                    ttid: ttid
                })).get().childNodes[1]);
        },

        _applyStyles: function (el, mw, mh) {
            var maxZ = Math.max.apply(null,
                $.map($('body *'), function (e, n) {
                    if ($(e).css('position') != 'static')
                        return parseInt($(e).css('z-index')) || 1;
                }));

            el.css({
                "z-index": maxZ + 1,
                maxWidth: mw,
                maxHeight: mh
            });
        },

        _computeAndAdjustPosition: function (el, xo, yo) {
            var xCenter = xo === 'center';
            if (xCenter) {
                xo = 0;
            }

            var yCenter = yo === 'center';
            if (yCenter) {
                yo = 0;
            }

            el.css({
                left: xo,
                top: yo
            });

            if (xCenter) {
                var k = 0;
                var aw = parseInt(el.css('width'));
                var pw = parseInt(pl('body').css('width')) / 2 - aw / 2;
                el.css('left', pw + k);
            }

            if (yCenter) {
                var k = 0;
                var ah = parseInt(el.css('height'));
                var ph = parseInt(pl('body').css('height')) / 2 - ah / 2 + parseInt(el.find('.conf-tooltip-wrap').css('padding-top')) + parseInt(el.find('.conf-tooltip-wrap').css('padding-bottom'));
                el.css('top', ph + k);
            }
        },

        _bindCloseEvent: function (doc) {
            $(window).on('click', ke.ui.tooltip.simple.close);
            $('body').on('click', ke.ui.tooltip.simple.close);
        },

        create: function (inner_code, ttid, xo, yo, mw, mh, doc, precompute_position) {
            this.close(true);

            var element = this._createElement(inner_code, ttid);
            this._applyStyles(element, mw, mh);

            if (precompute_position) {
                this._computeAndAdjustPosition(element, xo, yo);
            }

            //this._bindCloseEvent(doc);

            return element;
        },

        close: function (e) {
            if ((typeof e === 'boolean' && e) || (typeof e !== 'boolean' && !$(e.target).hasClass(ke.getPrefix() + 't'))) {
                //pl('body').unbind();

                var tooltip = $('.' + ke.getPrefix() + 'tooltip-main-wrap');

                if (tooltip.length > 0) {
                    tooltip.each(function () {
                        if (!$(this).hasClass(ke.getPrefix() + 'unpinned')) {
                            $(this).remove();
                        }
                    });
                }
            }
        }
    });

})();