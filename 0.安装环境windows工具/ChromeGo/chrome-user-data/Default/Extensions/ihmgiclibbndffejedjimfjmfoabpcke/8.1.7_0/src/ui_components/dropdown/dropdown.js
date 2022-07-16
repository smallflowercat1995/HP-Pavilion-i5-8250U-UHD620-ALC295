(function (undefined) {
    ke.import('s:ui_components.dropdown');

    ke.import('ext.input');
    ke.import('ext.string');
    ke.import('ext.event');
    ke.import('ext.dom');

    var EF = function () {
    };

    pl.extend(ke.ui, {
        dropdown: {}
    });

    var MOUSE_MODE = 1;
    var KEYS_MODE = 2;

    var first = true;

    pl.extend(ke.ui.dropdown, {
        data: {
            isOpened: false,
            isFocused: true, // Due to integral auto-focus
            overOption: false,

            ind: 999,
            callback: EF,
            callbacksOnOpenClose: [EF, EF],

            ui_search: {},

            openedOptionsSerial: 0,

            mouseX: 0,
            mouseY: 0,
            changeMode: MOUSE_MODE,

            applied: 0
        },

        init: function (fn, callbacks, filler, opt, final_cb) {
            opt = opt || '';

            pl(document).unbind().bind({
                click: ke.ui.dropdown.externalClick,
                keydown: ke.ui.dropdown.arrowsNavigation,
                mousemove: ke.ui.dropdown.mouseMove
            });

            ke.ui.dropdown.applySelects(filler, opt, function () {
                pl('.options .list li[index]').unbind().bind({
                    click: ke.ui.dropdown.optionClick,
                    mouseover: ke.ui.dropdown.optionHover,
                    mouseout: ke.ui.dropdown.optionOut
                });

                final_cb();
            });
            if (!pl.empty(callbacks)) {
                ke.ui.dropdown.data.callbacksOnOpenClose = callbacks;
            }

            pl('.select').unbind().bind('click', ke.ui.dropdown.dropdownClick);

            ke.ui.dropdown.data.callback = fn;
        },

        mouseMove: function (e) {
            if (e.pageX !== ke.ui.dropdown.data.mouseX || e.pageY !== ke.ui.dropdown.data.mouseY) {
                ke.ui.dropdown.data.mouseX = e.pageX;
                ke.ui.dropdown.data.mouseY = e.pageY;
                ke.ui.dropdown.data.changeMode = MOUSE_MODE;
            }
        },

        optionHover: function () {
            if (ke.ui.dropdown.data.changeMode !== MOUSE_MODE) {
                return;
            }
            ke.ui.dropdown.data.overOption = true;
            pl(this).addClass('whenHover');
        },

        optionOut: function () {
            if (ke.ui.dropdown.data.changeMode !== MOUSE_MODE) {
                return;
            }
            ke.ui.dropdown.data.overOption = false;
            pl(this).parent().find('.whenHover').removeClass('whenHover');
        },

        arrowsNavigation: function (e) {
            if (!ke.ui.dropdown.data.isOpened) {
                return true; // Allow typing
            }

            ke.ui.dropdown.data.changeMode = KEYS_MODE;

            var current_opt = $('.opt-' + ke.ui.dropdown.data.openedOptionsSerial);
            var over_item = current_opt.find('.whenHover');
            var selected_item = current_opt.find('.option_selected');

            if ($.isEmptyObject(over_item.get())) {
                over_item = selected_item;
            }

            var getProperItem = function (item, func) {
                var next_item = item;
                while ((next_item = next_item[func]()) && !$.isEmptyObject(next_item.get())) {
                    if (!next_item.hasClass('search-li') && !next_item.hasClass('group') && next_item.is(':visible')) {
                        item = next_item;
//                        console.log(item.text());
                        break;
                    }
                }
                return item;
            };

            if (ke.ext.event.is('enter', e)) {
                ke.ui.dropdown.optionClick.call(over_item);
            } else {
                over_item.removeClass('whenHover');

                var init_item = over_item;
                var up = false;

                if (ke.ext.event.is('arrowdown', e)) {
                    over_item = getProperItem(over_item, 'next');
                } else if (ke.ext.event.is('arrowup', e)) {
                    up = true;
                    over_item = getProperItem(over_item, 'prev');
                }

                over_item.addClass('whenHover');
            }
        },

        externalClick: function (evt, forced) {
            if (forced !== true
                && (pl(evt.target).hasClass('option')
                    || pl(evt.target).parent().hasClass('option')
                    || pl(evt.target).hasClass('option_selected')
                    || pl(evt.target).parent().hasClass('option_selected')
                    || pl(evt.target).hasClass('options')
                    || pl(evt.target).hasClass('search-li')
                    || pl(evt.target).hasClass('dd-search')
                    || pl(evt.target).hasClass('dd-input')
                    || pl(evt.target).hasClass('select')
                    || pl(evt.target).parent().hasClass('select')
                    || pl(evt.target).hasClass('group')
                    || pl(evt.target).parent().hasClass('group')
                    || (evt.target != document.body && pl(evt.target).parent(4).hasClass('options'))))
                return;

            ke.ui.dropdown.data.openedOptionsSerial = 0;
            ke.ui.dropdown.data.callbacksOnOpenClose[1]();

            $('.ui_selector .options').slideUp(ke.getAnimSpeed('fast_slide_up') / 2.5, ke.getAnimType('slide_up'));
            pl('.ui_selector .select').removeClass('active');
            pl('.options .whenHover').removeClass('whenHover');

            ke.ui.dropdown.data.isOpened = false;
        },

        dropdownClick: function () {
            var serial = +$(this).parent().find('.options').data('serial');

            if (pl(this).hasClass('active')) {
                ke.ui.dropdown.externalClick(null, true);
            } else {
                ke.ui.dropdown.data.openedOptionsSerial = serial;

                pl('.ui_selector .options').hide();
                pl('.ui_selector .select').removeClass('active');
                pl(this).addClass('active');

                var that = this;

                var sel_width = $('.select.active').width() + parseInt($('.select.active').css('padding-left')) * 2;
                var opt_width = $('.options').width() + parseInt($('.options').css('padding-left')) * 2;
                var x = $('.select.active').offset().left;

                if (x + opt_width > $(window).width()) {
                    x = $('.select.active').offset().left + sel_width - opt_width;
                }

                $(this).parent().find('.options').css('left', x + 'px').slideDown(ke.getAnimSpeed('fast_slide_down') * 1.5, ke.getAnimType('slide_down'), function () {
                    var offsetTop = pl(that).parent().find('.options .option_selected').get().offsetTop - 34;

                    ke.ui.dropdown.data.isOpened = true;
                    ke.ui.dropdown.data.callbacksOnOpenClose[0](serial, offsetTop);

                    if (!ke.IS_SAMSUNG) {
                        $(this).find('.dd-input').focus();
                    }
                });
            }
        },

        applySelects: function (filler, opt, final_cb) {
            var selNumber;

            var isValidContext = function (s) {
                return pl.type(s, 'str') && !pl.empty(s);
            };

            var e = pl(pl.type(opt, 'int') ? '.opt-' + opt : ((isValidContext(opt) ? opt + ' ' : '') + '.options'));
            var len = e.len();

            var index = 0;
            e.each(function () {
                selNumber = +$(this).data('serial');

                if (isNaN(selNumber)) {
                    --len;
                    return;
                }

                var that = this;
                filler(selNumber, null, function (filling) {
                    $(that)
                        .css('z-index', --ke.ui.dropdown.data.ind)
                        .find('.list')
                        .html(filling.code);

                    if (first) {
                        ke.ui.dropdown.data.applied++;
                    }

                    if (!pl.empty(filling.select)) {
                        var sel = $('.opt-' + filling.num).parent().find('.select');
                        sel
                            .removeClass('just-added')
                            .html(ke.ui.dropdown.cropCaption(filling.select, sel.get()));
                    }

                    $(that).find('.dd-input').unbind().bind({
                        keyup: ke.ui.dropdown.onSearchKeyUp
                    }).attr('data-width', parseInt($(this).find('.dd-input').css('width')));

                    ++index;
                    if (index === len) {
                        final_cb && final_cb();
                    }
                });
            })
                .hide();

            first = false;
        },

        // not used anymore
        cropCaption: function (text, sel) {
            return text;
        },

        globalRecrop: function () {
            $('.select').each(function () {
                $(this).html(ke.ui.dropdown.cropCaption($(this).text(), this));
            });
        },

        onSearchFocus: function () {
            $(this).animate({
                'background-position-x': 5,
                width: parseInt($(this).data('width')) + 2,
                paddingLeft: 20
            }, 1, ke.getAnimType('fast_slide_down'));
        },

        onSearchBlur: function () {
            if (pl.empty($(this).val())) {
                var input_width = $(this).width();
                var input_pl = parseInt($(this).css('padding-left'));
                var placeholder_width = $(this).placeholderWidth();
                var paddingLeft = input_pl / 2 + input_width / 2 - placeholder_width / 2 + 6;

                $(this).animate({
                    'background-position-x': paddingLeft - 6,
                    width: input_width - paddingLeft / 2 - input_pl + 2,
                    paddingLeft: paddingLeft + 6 + 3
                }, ke.getAnimSpeed('fast_slide_down') / 2, ke.getAnimType('fast_slide_down'));
            }
        },

        onSearchKeyUp: function (evt) {
            if (!pl.type(ke.ui.dropdown.data.searchTimeout, 'null')) {
                clearTimeout(ke.ui.dropdown.data.searchTimeout);
            }

            if (ke.ext.event.is('ctrl', evt) || ke.ext.event.is('alt', evt)) {
                return true;
            }

            if (evt.keyCode === 13) {
                ke.ui.dropdown.selectFirst();
            }

            var that = this;
            ke.ui.dropdown.data.searchTimeout = setTimeout(function () {
                ke.ui.dropdown.applySearch(pl(that).val());
            }, 525);
        },

        selectFirst: function () {
            var sel_lang = $('.opt-' + ke.ui.dropdown.data.openedOptionsSerial).find('.option:visible span').attr('val');
            var $sel = $('.opt-' + ke.ui.dropdown.data.openedOptionsSerial).parent().find('.select');

            // don't apply if no results

            if (sel_lang) {
                ke.ui.dropdown.data.callback(
                    ke.ui.dropdown.data.openedOptionsSerial,
                    sel_lang
                );

                ke.ui.dropdown.dropdownClick.call($sel.get(0));
            }
        },

        applySearch: function (val) {
            var serial = ke.ui.dropdown.data.openedOptionsSerial;
            var contents;
            var all_elements = 0;
            var all_hidden_elements = 0;
            var group_hidden_elements = -1;
            var group_elements = -2;
            var animations = 0;

            var decrementAnimations = function () {
                --animations;
            };

            var toggleGroup = function (group, anim_dir) {
                ++animations;
                $('.opt-' + serial + ' .group:eq(' + (group - 1) + ')')['slide' + ke.capitalize(anim_dir)](ke.getAnimSpeed('slide_up'), ke.getAnimType('slide_up'), decrementAnimations);
            };

            val = val.toLowerCase();

            var last_el = pl('.opt-' + serial + ' li').last().get();
            var current_group = 0;
            $('.opt-' + serial + ' li').each(function () {
                if ($(this).hasClass('search-li')) return;
                if ($(this).hasClass('group')) {
                    if (group_elements == group_hidden_elements) {
                        toggleGroup(current_group, 'up');
                    }

                    group_elements = 0;
                    group_hidden_elements = 0;
                    ++current_group;
                    return;
                }

                ++all_elements;
                ++group_elements;
                contents = $(this).find('span:eq(0)').text();

                if (!~contents.toLowerCase().indexOf(val)) {
                    ++group_hidden_elements;
                    ++all_hidden_elements;
                    ++animations;

                    $(this).slideUp(ke.getAnimSpeed('slide_up'), ke.getAnimType('slide_up'), decrementAnimations);
                } else {
                    ++animations;

                    if (!pl.empty(val)) {
                        contents = ke.ext.string.highlight(contents, val);
                        $(this).find('span').html(contents);
                    } else {
                        $(this).find('span').html(contents);
                    }

                    $(this).slideDown(ke.getAnimSpeed('slide_down'), ke.getAnimType('slide_down'), decrementAnimations);
                }

                if (this.isEqualNode(last_el) && group_elements == group_hidden_elements) {
                    toggleGroup(current_group, 'up');
                } else if (pl.empty(val) || group_elements != group_hidden_elements) {
                    toggleGroup(current_group, 'down');
                }
            });

            var int = setInterval(function () {
                if (animations == 0) {
                    clearInterval(int);

                    pl('.opt-' + serial).find('.search-failed-plaque').remove();
                    if (all_elements == all_hidden_elements) {
                        pl('.opt-' + serial + ' .inner-options-layout')
                            .append(pl('<div>').addClass('search-failed-plaque').html(ke.getLocale('CommonUi_NoResults')).get());
                    }

                    ke.ui.dropdown.data.callbacksOnOpenClose[0](serial);
                }
            }, 10);
        },

        optionClick: function () {
            if (pl(this).hasClass('group')) {
                return;
            }

            var p = $(this).parent().parent().parent().parent().parent().parent();
            var select = p.find('.select');

            if (select.parent().find('.option_selected').length > 0) {
                var prev_val = select.parent().find('.option_selected').find('span').attr('val');
                pl(this).parent().find('.option_selected').removeClass('option_selected');
            }
            pl(this).addClass('option_selected');

            ke.ui.dropdown.data.callback(
                ke.ui.dropdown.data.openedOptionsSerial,
                pl(this).parent().find('.option_selected').find('span').attr('val'),
                prev_val
            );

            ke.ui.dropdown.dropdownClick.call(select.get(0));
        },

        getActiveOptionValue: function (serial) {
            return $('.opt-' + serial).find('.option_selected span').attr('val');
        }
    });
})();