(function (undefined) {

    var SEARCH_TIMEOUT;
    var PREV_VAL;

    pl.extend(ke.particles.hist_search.model, {
        toggleClearTick: function () {
            var val = pl('.search-input').val();
            pl('.clear-input-tick')[pl.empty(val) ? 'hide' : 'show']();
        },

        onClearTickClick: function () {
            pl('.search-input').val('');
            ke.particles.hist_search.model.toggleClearTick();
            ke.particles.hist_search.model.execSearch();
        },

        onSearchKeyRelease: function () {
            ke.particles.hist_search.model.toggleClearTick();

            SEARCH_TIMEOUT = setTimeout(function () {
                clearTimeout(SEARCH_TIMEOUT);
                ke.particles.hist_search.model.execSearch();
            }, 725);
        },

        execSearch: function () {
            ke.app.flags.is_searching = true;
            ke.app.temp.item_times = [];
            ke.app.temp.selected = [];

            ke.particles.hist_opt_delete.model.updateAmountBadge();

            var val = pl('.search-input').val();

            if (val === PREV_VAL) {
                return;
            } else {
                PREV_VAL = val;
            }

            if (pl.empty(val)) {
                ke.app.flags.is_searching = false;
                ke.particles.hist_list.model.clear();
                $('.history-list').show();
                ke.particles.hist_list.view.populateHistoryList(function () {
                    ke.app.initHistoryList(true);
                    //ke.particles.hist_list.model.collapseAll();
                    if (!ke.particles.hist_list.view.toggleEmptyHistoryCap()) {
                        ke.particles.hist_search.view.toggleNotFoundCap();
                    }
                }, null, true);

                return;
            }

            if (typeof ga != "undefined") ga('send', 'event', 'history', 'search');

            if (ke.app.temp.all_items.length > 250) {
                if (typeof ga != "undefined") ga('send', 'event', 'history', 'search-too-large');
                return;
            }

            ke.idb.search('it', 'history', {
                input: val,
                it_resp: function (it_resp) {
                    var main = it_resp[3].indexOf(val) > -1;
                    var synonyms = false;

                    o: for (var i = 0; i < it_resp[6].length; ++i) {
                        for (var j = 0; j < it_resp[6][i]; ++j) {
                            if (it_resp[6][i][j][0].indexOf(val) > -1) {
                                synonyms = true;
                                break o;
                            }
                        }
                    }

                    return main || synonyms;
                }
            }, function (items) {
                var len = items.length;

                if (len > 0) {
                    ke.particles.hist_list.model.clear();
                    for (var i = 0; i < len; ++i) {
                        ke.particles.hist_list.view.drawHistoryItem(items[i], val);
                    }

                    pl('.v-item div').each(function () {
                        if (!$(this).hasClass('translit-pos') && !$(this).hasClass('translit-main')) {
                            pl(this).html(ke.ext.string.highlight(pl(this).text(), val));
                        }
                    });
                } else {
                    ke.particles.hist_list.model.clear();
                    ke.particles.hist_search.view.toggleNotFoundCap();
                }

                setTimeout(function () {
                    ke.app.initHistoryList(true);
                }, 15);
            }, ke.idb.COMP_AND, null, 100, false, 'time');
        }
    });

})();