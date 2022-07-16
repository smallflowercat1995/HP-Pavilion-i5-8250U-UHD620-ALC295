/* Checkboxes
 *
 **/

(function (undefined) {

    ke.import('s:ui_components.checkbox');

    var EF = function () {
    };

    pl.extend(ke.ui, {
        checkbox: {}
    });

    pl.extend(ke.ui.checkbox, {
        data: {
            sprite_left_padding: '-70px',
            sprite_top_padding: 200,
            height: 18,
            callback: {}
        },

        init: function (c_check, c_md, c_ext) {
            pl('input[type=checkbox]').each(function () {
                var spanReplace = pl('<span>', {className: 'ui_checkbox'}),
                    cur_cb = pl(this);

                if (cur_cb.get().checked == true) {
                    spanReplace
                        .css('background-position', ke.ui.checkbox.data.sprite_left_padding + ' ' + (ke.ui.checkbox.data.sprite_top_padding - ke.ui.checkbox.data.height * 2) + 'px')
                        .addClass('checked');
                }

                if (cur_cb.attr('disabled')) {
                    spanReplace.addClass('disabled');
                }

                cur_cb
                    .bind('change', ke.ui.checkbox.superVision)
                    .before(spanReplace.get())
                    .hide();
            });

            pl('span.ui_checkbox')
                .bind({
                    click: ke.ui.checkbox.check,
                    mousedown: ke.ui.checkbox.mouseEvt.mousedown
                })
                .each(function () {
                    var el = pl(this);

                    if (el.parent().tag('label')) {
                        el.parent().bind('click', ke.ui.checkbox.labelClick);
                    }
                });

            pl(document).bind('click', ke.ui.checkbox.mouseEvt.external);

            ke.ui.checkbox.data.callback.change = c_check || EF;
            ke.ui.checkbox.data.callback.mousedown = c_md || EF;
            ke.ui.checkbox.data.callback.external = c_ext || EF;
        },

        mouseEvt: {
            mousedown: function () {
                var el = pl(this);
                el.css('background-position', ke.ui.checkbox.data.sprite_left_padding + ' ' + (ke.ui.checkbox.data.sprite_top_padding - ke.ui.checkbox.data.height * (el.hasClass('checked') ? 3 : 1)) + 'px').addClass('intermediate');
                ke.ui.checkbox.data.callback.mousedown(this);
            },

            external: function () {
                pl('span.ui_checkbox').each(function () {
                    var el = pl(this);

                    if (el.hasClass('intermediate')) {
                        el.css('background-position', el.hasClass('checked') ? ke.ui.checkbox.data.sprite_left_padding + ' ' + (ke.ui.checkbox.data.sprite_top_padding - ke.ui.checkbox.data.height * 2) + 'px' : ke.ui.checkbox.data.sprite_left_padding + ' ' + ke.ui.checkbox.data.sprite_top_padding).removeClass('intermediate');
                    }
                });

                ke.ui.checkbox.data.callback.external();
            }
        },

        superVision: function () {
            var el = pl(this.previousSibling);

            if (this.checked == true) {
                el.css('background-position', ke.ui.checkbox.data.sprite_left_padding + ' ' + (ke.ui.checkbox.data.sprite_top_padding - ke.ui.checkbox.data.height * 2) + 'px').addClass('checked');
            } else {
                el.css('background-position', ke.ui.checkbox.data.sprite_left_padding + ' ' + ke.ui.checkbox.data.sprite_top_padding).removeClass('checked');
            }
        },

        commonClick: function (el, _el) {
            var flag;

            _el.removeClass('intermediate');

            if (_el.hasClass('checked')) {
                flag = false;
                el.checked = flag;
                _el.css('background-position', ke.ui.checkbox.data.sprite_left_padding + ' ' + ke.ui.checkbox.data.sprite_top_padding + 'px').removeClass('checked');
            } else {
                flag = true;
                el.checked = flag;
                _el.css('background-position', ke.ui.checkbox.data.sprite_left_padding + ' ' + (ke.ui.checkbox.data.sprite_top_padding - ke.ui.checkbox.data.height * 2) + 'px').addClass('checked');
            }

            ke.ui.checkbox.data.callback.change(el, flag);
        },

        labelClick: function () {
            var cb = this.querySelector('input[type=checkbox]');
            ke.ui.checkbox.commonClick(cb, pl(cb.previousSibling));
        },

        check: function () {
            ke.ui.checkbox.commonClick(this.nextSibling, pl(this));
        },

        externalElementClicked: function (cb) {
            cb = pl(cb).get(0);
            ke.ui.checkbox.commonClick(cb, pl(cb.previousSibling));
        }
    });

})();