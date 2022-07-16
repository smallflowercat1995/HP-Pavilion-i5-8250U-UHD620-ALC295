(function (undefined) {

    var prev_scroll_y = 0;

    pl.extend(ke.particles.hist_list.model, {
        onItemMouseOver: function (e) {
            if (ke.app.canPerformActions()) {
                //var id = ke.ext.util.selectorsUtil.getHistoryItemId(e.target);
                //pl('.i-' + id).addClass('hovered');
            }
        },

        onItemMouseOut: function (e) {
            //var id = ke.ext.util.selectorsUtil.getHistoryItemId(e.target);
            //pl('.i-' + id).removeClass('hovered');
        },

        prevScrollPos: 0,

        closeItemView: function () {
            $('body').removeClass('view-mode');

            $('.expanded').hide();
            $('.list-view').show();

            $('.back-button').hide();
            $('.list-view-buttons').show();

            $(window).scrollTop(ke.particles.hist_list.model.prevScrollPos);
        },

        onItemClick: function (e, forced) {
            var id = ke.ext.util.selectorsUtil.getHistoryItemId(e.target);

            if (ke.app.canPerformActions() || forced) {
                var s = '.i-' + id;

                ke.particles.hist_list.model.prevScrollPos = $(window).scrollTop();
                $(window).scrollTop(0);

                $('body').addClass('view-mode');

                $('.list-view').hide();
                $('.expanded').html($(s).html());
                $('.expanded').find('.selection-sliding-wrap').remove();
                $('.expanded').show();

                var from = $(this).data('from');
                var to = $(this).data('to');
                var $context = $('.expanded');

                ke.particles.listen.model.ctrlHistoryOrigVisibility(null, from, $context);
                ke.particles.listen.model.ctrlHistoryTransVisibility(null, to, $context);
                ke.particles.listen.model.ctrlSynonymVis(null, to, $context);

                $context.find('.listen-selector').on('click', ke.particles.listen.model.playHistoryItem);
                $context.find('.listen-v-item').on('click', ke.particles.listen.model.playHistorySynonym);

                $context.find('.copy-button').on('click', ke.particles.three_dots.model.copyMain);
                $context.find('.small-copy-button').on('click', ke.particles.three_dots.model.copySynonym);

                ke.particles.three_dots.view.fillContextMenuOnlyWithWordlists($context.find('.add-to-pb-button'), from, to, id);

                ke.ext.util.storageUtil.requestBackgroundOption('isTrueOption', ['show_translit'], function (is_true) {
                    if (is_true && $context.find('.translit-row .translit-main').html() != '') {
                        $context.find('.translit-row').show();
                    } else {
                        $context.find('.translit-row').hide();
                    }
                });

                $('.list-view-buttons').hide();
                $('.back-button').show();
            } else if (ke.app.flags.isTickerWrapActive) {
                ke.particles.hist_opt_delete.model.onTickerClick.call($('.i-' + id).find('.selection-ticker').get(0), e, 'item');
            }
        },

        toggleListenWrap: function (id, forced) {
            var req = '.i-' + id;
            if (pl.type(id, 'undef')) {
                req = '.history-list';
            }

            var is_active = $(req).find('.listen-sliding-wrap').hasClass('active-lsw') || forced;
            var sw = $(req).find('.listen-sliding-wrap').toggleClass('active-lsw');

            // Used only once on scroll loading
            sw.removeClass('invisible-sw');

            if (is_active) {
                sw.animate({
                    width: 0,
                    opacity: 0
                }, ke.getAnimSpeed('slide_up') * 1.755, ke.getAnimType('slide_up'), function () {
                    $(this).fadeOut(1);
                });
            } else {
                sw.animate({
                    width: 41,
                    opacity: 1
                }, ke.getAnimSpeed('slide_up') * 1.255, ke.getAnimType('fast_slide_up'), function () {
                    $(this).fadeIn(1, ke.getAnimType('fade_out'));
                });
            }
        },

        removeItemFromListById: function (id, callback) {
            $('.i-' + id).prev().removeClass('before-expanded');
            $('.i-' + id)
                .find('.main-variant-wrap')
                .slideUp(ke.getAnimSpeed('slide_up'), ke.getAnimType('slide_up'), function () {
                    $(this).parent().parent().remove();
                    callback();
                })
                .fadeOut(ke.getAnimSpeed('fade_out'), ke.getAnimType('fade_out'));

            ke.ext.arr.delete(ke.app.temp.all_items, id);

            if (ke.app.temp.all_items.length === 0) {
                ke.particles.hist_list.model.fadeOutList();
            }
        },

        scrollTop: function () {
            $("html, body").animate({scrollTop: 0}, "fast");
        },

        onPageScroll: function () {
            var y = $(this).scrollTop();
            var max_y = $(document.body).prop('scrollHeight');

            if (y + window.innerHeight + 250 >= max_y) {
                ke.particles.hist_list.model.showMoreItems(y);
            }

            var up_scroll = 15 - y;
            if (up_scroll < 0) {
                up_scroll = 0;
            }

            pl('.up-shortcut').css({
                marginTop: up_scroll
            })[(up_scroll === 0 ? 'add' : 'remove') + 'Class']('sticked-top');

            // When start showing the shortcut / starting at which offset at y axis
            var threshold = 50;

            if (y === 0) {
                $('.up-shortcut').fadeOut(ke.getAnimSpeed('fade_out') * 1.789, ke.getAnimType('fade_out'));
            } else if ((prev_scroll_y < threshold && y >= threshold) || (y < threshold && prev_scroll_y >= threshold)) {
                $('.up-shortcut')[y < threshold ? 'fadeOut' : 'fadeIn'](ke.getAnimSpeed('fade_out') * 1.789, ke.getAnimType('fade_out'));
            }

            ke.particles.hist_list.model.onScrollingStateChange(y);
            prev_scroll_y = y;
        },

        onScrollingStateChange: function (y) {
            var start_pos = 65;
            //var scroll = scroll || ke.particles.scrollbars.model.getScrollInstance('page-scrollbar');
            var top, opacity;

            if (y >= start_pos && ke.app.flags.isTickerWrapActive) {
                top = 0;
                opacity = 1;

                if (ke.app.flags.quick_access_shown) return;
                else ke.app.flags.quick_access_shown = true;
            } else if (!ke.app.flags.isTickerWrapActive || (ke.app.flags.isTickerWrapActive && y < start_pos)) {
                top = -59;
                opacity = 0;

                if (!ke.app.flags.quick_access_shown) return;
                else ke.app.flags.quick_access_shown = false;
            }

            $('.quick-access-bar').animate({
                top: top,
                opacity: opacity
            }, ke.getAnimSpeed('slide_down') * 2.25, ke.getAnimType('slide_down'));
        },

        showMoreItems: function (scrollTo) {
            var last_time = ke.app.temp.item_times[ke.app.temp.item_times.length - 1];

            if (!ke.app.flags.is_searching && last_time) {
                ke.particles.hist_list.view.populateHistoryList(function () {
                    ke.app.initHistoryList(true);
                }, [ke.idb.UPPER_BOUND, 'time', last_time], false);
            }
        },

        getListenValue: function (s) {
            var $where = $('.expanded');
            var text = '';

            if (s === 'orig') {
                text = $where.find('.input-particle .text-part').text();
            } else if (s === 'trans') {
                text = $where.find('.main-output-particle .tpart').text();

                if (!text) {
                    text = $where.find('.main-output-particle .text-part').text();
                }
            }

            return text;
        },

        // Returns whether ec shown or not
        toggleListEndCap: function (locale) {
            var $ec = $('.ec-wrap');
            var $mb = $('.more-button');
            var $cw = $('.content-wrap');
            var $sl = $('.search-layout');

            if (ke.app.temp.all_items.length > 0) {
                $sl.show();
                $cw.show();
                $mb.show();
                $ec.hide();

                return false;
            } else {
                $sl.hide();
                $cw.hide();
                $mb.hide();

                $ec.find('.ec-text').html(ke.getLocale('History_Content_List_OnEmpty'));
                $ec.show();

                return true;
            }
        },

        fadeOutList: function () {
            this.toggleListEndCap('History_Content_List_OnEmpty');
        },

        // Ordinary clear of the list, without any effects
        clear: function () {
            ke.app.temp.expanded = [];
            ke.app.temp.selected = [];
            ke.app.flags.all_loaded_cap_exists = false;

            pl('.history-list').empty();
        },

        downloadHistoryAsCSV: function () {
            var $that = $(this);

            ke.ext.util.storageUtil.requestBackgroundOption('isTrueOption', ['chr_pro_flag'], function (is_pro) {
                if (!is_pro) {
                    ke.ui.pro_alert.show(ke.getLocale('Pro_ExportFeature'), 'history-export');
                } else {
                    if (typeof ga != "undefined") ga('send', 'event', 'history', 'export-history');

                    $that.addClass('downloading');

                    ke.idb.enum('it', 'history', Number.MAX_VALUE, null, false, function (items) {
                        var raw_rows = [[
                            ke.getLocale('Csv_TimeDate'),
                            ke.getLocale('Csv_FromLang'),
                            ke.getLocale('Csv_IntoLang'),
                            ke.getLocale('Csv_Input'),
                            ke.getLocale('Csv_Translation'),
                            ke.getLocale('Csv_Transliteration'),
                            ke.getLocale('Csv_Synonyms'),
                            ke.getLocale('Csv_WhereTranslated')
                        ]];

                        items.forEach(function (v) {
                            var synonyms = [];
                            var sources = [];

                            v.it_resp[7].forEach(function (__) {
                                __.forEach(function (sv) {
                                    synonyms.push(sv[0]);
                                });
                            });

                            for (var key in v.sources) {
                                sources.push(key);
                            }

                            raw_rows.push([
                                '"' + ke.ext.time.beautify(v.time) + '"',
                                ke.getLocale("Kernel_Lang_" + ke.ext.util.langUtil.getLangNameByKey(v.it_resp[5])),
                                ke.getLocale("Kernel_Lang_" + ke.ext.util.langUtil.getLangNameByKey(v.l_to)),
                                '"' + v.input + '"',
                                '"' + v.it_resp[3] + '"',
                                '"' + v.it_resp[4] + '"',
                                '"' + synonyms.join(', ') + '"',
                                '"' + sources.join('\n') + '"'
                            ]);
                        });

                        ke.ext.file.downloadAsCSV(raw_rows, function () {
                            $that.removeClass('downloading');
                        });
                    });
                }
            });
        }
    });

})();