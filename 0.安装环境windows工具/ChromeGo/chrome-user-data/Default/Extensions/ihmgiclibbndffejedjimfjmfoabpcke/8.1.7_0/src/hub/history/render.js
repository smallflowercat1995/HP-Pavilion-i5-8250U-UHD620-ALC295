/* Kumquat Hub History Render
 * 
 **/

(function (undefined) {

    var OPTIONS_VIS_MAP = {
        slideDown: 'slideUp',
        slideUp: 'slideDown'
    };

    pl.extend(ke.app.render, {
        organize: {
            ctrlOptionsVisibility: function (cb) {
                return;

                var op = parseInt($('.options-wrap').css('opacity'));
                var time = 300;

                if (op === 0.0) {
                    $('.top-wrap').animate({
                        'opacity': 0.0
                    }, time, 'easeInOutQuint');

                    setTimeout(function () {
                        $('.options-wrap').animate({
                            'top': 4,
                            'opacity': 1.0
                        }, time, 'easeInOutQuint', cb);
                    }, time / 2);
                } else {
                    $('.options-wrap').animate({
                        'top': -54,
                        'opacity': 0.0
                    }, time, 'easeInOutQuint');

                    setTimeout(function () {
                        $('.top-wrap').animate({
                            'opacity': 1.0
                        }, time, 'easeInOutQuint', cb);
                    }, time / 2);
                }
            },

            initHistory: function (no_retoggle) {
                ke.ext.cache.getIdListOfAll(function (ids) {
                    ke.app.temp.all_items = ids;
                });

                ke.particles.hist_list.view.populateHistoryList(function () {
                    ke.app.initHistoryList(no_retoggle);
                    $(window).trigger('scroll');
                    setTimeout(ke.ui.loading.close, 150);
                }, null, false);
            }
        },

        events: {
            onItemMouseOver: function () {
                pl('.history-item-wrap').unbind().bind('mouseover', ke.particles.hist_list.model.onItemMouseOver);
            },

            onItemMouseOut: function () {
                pl('.history-item-wrap').unbind().bind('mouseout', ke.particles.hist_list.model.onItemMouseOut);
            },

            onItemClick: function () {
                $('.history-item-wrap').off('click').on('click', ke.particles.hist_list.model.onItemClick);
            },

            onDeleteClick: function () {
                //pl('.ab-delete', '.history-item-wrap').unbind().bind('click', ke.particles.hist_list.model.onItemDeleteClick);
            },

            enableDeleteMode: function () {
                $('.more-button').unbind().bind('click', ke.app.handlers.enableDeleteMode);
                $('.cancel').unbind().bind('click', ke.app.handlers.cancelOptionSelection);
            },

            toggleMouseOverOption: function () {
                pl('.option-item').unbind().bind({
                    mousedown: ke.app.handlers.onMouseDownOverOption,
                    mouseup: ke.app.handlers.onMouseUpOverOption
                });
            },

            onDeleteSelectionClick: function () {
                pl('.delete-selection').unbind().bind('click', ke.particles.hist_opt_delete.model.onDeleteSelectionClick);
            },

            bindDeleteSelectionActions: function () {
                pl('.select-all').unbind().bind('click', ke.particles.hist_opt_delete.model.selectAll);
                pl('.deselect-all').unbind().bind('click', ke.particles.hist_opt_delete.model.deselectAll);
                pl('.delete-selected').unbind().bind('click', ke.particles.hist_opt_delete.model.deleteSelected);
                ke.app.handlers.addCancelCallback(pl('.selection-cancel').get(), ke.app.handlers.onSelCancel);
            },

            onClearHistoryClick: function () {
                pl('.clear-history').unbind().bind('click', ke.particles.hist_opt_delete.model.onClearHistoryClick);
            },

            onClearTickClick: function () {
                pl('.clear-input-tick').unbind().bind('click', ke.particles.hist_search.model.onClearTickClick);
            },

            onSearchKeyRelease: function () {
                pl('.search-input').unbind().bind('keyup', ke.particles.hist_search.model.onSearchKeyRelease);
            },

            onPageScroll: function () {
                $(window).scroll(ke.particles.hist_list.model.onPageScroll);
            },

            onTickerClick: function () {
                pl('.selection-ticker').unbind().bind('click', function (event) {
                    ke.particles.hist_opt_delete.model.onTickerClick(event, 'ticker');
                });
            },

            bindDownFastSelection: function () {
                $(document).on({
                    mousedown: ke.app.handlers.registerMouseDown,
                    mouseup: ke.app.handlers.registerMouseUp,
                    mousemove: ke.particles.hist_opt_delete.model.registerMouseMoving,
                    keydown: ke.app.handlers.registerKeyDown,
                    keyup: ke.app.handlers.registerKeyUp
                });
            },

            bindQuickAccessBarActions: function () {
                pl('.up-shortcut').unbind().bind('click', ke.particles.hist_list.model.scrollTop);
                pl('.qa-cancel').unbind().bind('click', ke.particles.hist_opt_delete.model.onDeleteSelectionClick);
            },

            bindScrollingOnGoUpButton: function () {
                $('.up-shortcut').on('click', ke.app.handlers.scrollOnGoUpButton);
            },

            onWindowResize: function () {
                $(window).resize(ke.app.handlers.onWindowResize);
            },

            bindExport: function () {
                $('.export-button').on('click', ke.particles.hist_list.model.downloadHistoryAsCSV);
            }
        }
    });

})();