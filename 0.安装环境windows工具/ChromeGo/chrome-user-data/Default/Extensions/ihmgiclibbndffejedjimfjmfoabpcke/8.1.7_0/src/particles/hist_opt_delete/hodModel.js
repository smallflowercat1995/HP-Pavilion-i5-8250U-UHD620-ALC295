(function (undefined) {

    var i18n_deleteHeadline = ke.getLocale('History_Options_Delete_AllHeadline');
    var i18n_deleteProposal = ke.getLocale('History_Options_Delete_AllProposal');
    var i18n_deletePositive = ke.getLocale('History_Options_Delete_AllPos');
    var i18n_deleteNegative = ke.getLocale('History_Options_Delete_AllNeg');

    var currentOverElement;
    var previousTickerClicked;

    var firstToggleCall = true;

    var isTicked = function (e) {
        return pl(e).hasClass('active-st');
    };

    var tick = function (element, event) {
        if (!isTicked(element)) {
            ke.particles.hist_opt_delete.model.onTickerClick.call(element, event);
        }
    };

    var untick = function (element, event) {
        if (isTicked(element)) {
            ke.particles.hist_opt_delete.model.onTickerClick.call(element, event);
        }
    };

    pl.extend(ke.particles.hist_opt_delete.model, {
        onClearHistoryClick: function () {
            ke.ui.tooltip.confirm.ask([i18n_deleteHeadline, i18n_deleteProposal, i18n_deletePositive, i18n_deleteNegative], function (f) {
                if (f) {
                    ke.idb.clear('it', 'history', function () {
                        ke.particles.hist_list.model.fadeOutList();
                    });
                }
            });
        },

        onDeleteSelectionClick: function () {
            $('body').toggleClass('delete-mode');
            ke.particles.hist_opt_delete.model.toggleSlidingWrap();
        },

        onTickerClick: function (e, exact_tick) {
            currentOverElement = $(this).find('.box').get();
            $(this).toggleClass('active-st');

            var id = +$(this).data('id');
            var added = false;

            if (pl(this).hasClass('active-st')) {
                ke.ext.arr.pushUnique(ke.app.temp.selected, id);
                added = true;
            } else {
                ke.ext.arr.delete(ke.app.temp.selected, id);
            }

            if (e !== null && e.stopPropagation) e.stopPropagation();

            if (previousTickerClicked !== null && ke.app.flags.isShiftDown) {
                var that = this;
                var elements = [];

                var forthDirection = +$(this).data('id') < +$(previousTickerClicked).data('id');
                var canAdd = false;

                pl('.selection-ticker').each(function () {
                    if (!forthDirection) {
                        if (this.isEqualNode(that)) {
                            canAdd = true;
                            return;
                        } else if (this.isEqualNode(previousTickerClicked)) {
                            canAdd = false;
                        }
                    } else {
                        if (this.isEqualNode(previousTickerClicked)) {
                            canAdd = true;
                            return;
                        } else if (this.isEqualNode(that)) {
                            canAdd = false;
                        }
                    }

                    if (canAdd) {
                        elements.push(this);
                    }
                });

                pl.each(elements, function () {
                    tick(this, e);
                });
            }

            previousTickerClicked = added ? this : null;

            ke.particles.hist_opt_delete.model.updateAmountBadge();
        },

        toggleSlidingWrap: function () {
            ke.app.flags.isTickerWrapActive = !ke.app.flags.isTickerWrapActive;

            pl('.history-list').toggleClass('i-hoverable');

            $('.selection-sliding-wrap').each(function () {
                if (ke.ext.dom.isVisible((this))) {
                    $(this).animate({width: 0 + (ke.app.flags.isTickerWrapActive ? 28 + 24 : 0)}, ke.getAnimSpeed('fast_slide_up') / (firstToggleCall ? ke.getAnimSpeed('fast_slide_up') : 1), ke.getAnimType('fast_slide_up'), function () {
                        $(this)['fade' + (ke.app.flags.isTickerWrapActive ? 'In' : 'Out')](ke.getAnimSpeed('fade_out'), ke.getAnimType('fade_out'), function () {
                        });
                    });
                } else {
                    $(this).css({
                        width: 0 + (ke.app.flags.isTickerWrapActive ? 28 + 24 : 0),
                        display: 'none'
                    });
                }
            });

            if (ke.app.flags.isTickerWrapActive) {
                ke.app.render.events.bindDownFastSelection();
                $('.selection-sliding-wrap').removeClass('invisible-sw');
            }

            firstToggleCall = false;
        },

        //
        // Not available temporarily
        registerMouseMoving: function (e) {
            if (pl(e.target).hasClass('box') && !ke.app.flags.isShiftDown && ke.app.flags.isMouseDown && !e.target.isEqualNode(currentOverElement)) {
                currentOverElement = e.target;
                //tick(pl(e.target).parent(2).get(), e);
            }
        },

        selectAll: function () {
            console.time('select');
            ke.app.temp.selected = ke.ext.arr.clone(ke.app.temp.all_items);
            pl('.selection-ticker').each(function () {
                tick(this, null);
            });
            console.timeEnd('select');
        },

        deselectAll: function () {
            console.time('deselect');
            ke.app.temp.selected = [];
            pl('.selection-ticker').each(function () {
                untick(this, null);
            });
            console.timeEnd('deselect');
        },

        deleteSelected: function () {
            ke.ext.cache.deleteFewByIdOnClient(ke.app.temp.selected, function (success) {
                if (success) {
                    pl.each(ke.app.temp.selected, function (k, v) {
                        ke.particles.hist_list.model.removeItemFromListById(v, ke.particles.hist_list.view.toggleEmptyHistoryCap);
                    });

                    ke.app.temp.selected = [];
                    ke.particles.hist_opt_delete.model.updateAmountBadge();
                    //ke.particles.hist_list.view.toggleEmptyHistoryCap();
                    ke.particles.hist_opt_delete.model.onDeleteSelectionClick();
                }
            });
        },

        updateAmountBadge: function () {
            pl('.to-delete-label').html(ke.app.temp.selected.length);
        },

        // Using `event` instead of `e` starting from now?
        qaCancel: function (event) {
            //ke.app.handlers.cancelOptionSelection.call(pl('.selection-cancel').get(), event, true);

            ke.particles.hist_list.model.onScrollingStateChange();
        }
    });

})();