(function (undefined) {
    ke.import('ext.util.storageUtil');

    var COMBOS = 'Shift+T,Alt+T'.split(',').reverse();

    // Names of keys which require localization
    // E.g., Ctrl => Strg
    var LOCALIZABLE = {
        de: ['Ctrl']
    };

    if (~window.navigator.appVersion.indexOf('Mac')) {
    }

    // Will be changed
    var langSelType = 2;
    var index = 1;

    pl.extend(ke.particles.sett_trans_combo.view, {
        getLastIndex: function () {
            return index - 1;
        },

        getCurrentIndex: function () {
            return index;
        },

        renderCombination: function (from, to, main, is_new, combo) {
            pl('.combination-list').append(
                ke.ext.tpl.compile(pl('.t-combinations').html(), {
                    from: from,
                    to: to,
                    combo: combo,
                    index1: index++,
                    index2: index++,
                    index3: index++,
                    number: ke.app.temp.combos + 1,
                    main_class: main ? 'main-combo' : '',
                    new_identifier: is_new ? 'just-added' : ''
                })
            );

            for (var i = index - 2; i <= index; ++i) {
                pl('.opt-' + i).removeClass('templated');
            }

            var $parent = $('.cs-' + (index - 1));

            ke.particles.sett_trans_combo.model.updateCurrentState(('' + combo).split('+'), $parent);

            $parent.find('.combo').on('click', ke.particles.sett_trans_combo.model.activateKeysDetection);
            $parent.find('.combo-del-tick').on('click', ke.particles.sett_trans_combo.model.removeCombination);
            $parent.find('.clear-combo').on('click', ke.particles.sett_trans_combo.model.clearKeys);

            if (!main) {
                ke.app.temp.combos++;
            }
        },

        renderAllCombinations: function (callback) {
            var that = this;

            ke.ext.util.storageUtil.chainRequestBackgroundOption([
                {fn: 'getDecodedVal', args: ['add_trans_combinations']},
                {fn: 'getVal', args: ['trans_combination']},
                {fn: 'getVal', args: ['from_lang']},
                {fn: 'getVal', args: ['to_lang']}
            ], function (responses) {
                if (responses) {
                    var from = responses[2].response;
                    var to = responses[3].response;

                    that.renderCombination(from, to, true, false, responses[1].response, responses[0].response["main"]);

                    for (var key in responses[0].response) {
                        if (key != 'main') {
                            that.renderCombination(
                                responses[0].response[key].from,
                                responses[0].response[key].to,
                                false,
                                false,
                                key,
                                responses[0].response[key]
                            );
                        }
                    }
                }

                callback();

                ke.particles.sett_trans_combo.model.ctrlNewComboClass();
            });
        },

        // 1 2 4 5 7 8 ... - languages
        // 3 6 9 ... - combinations
        getComboVariants: function (num, data, callback) {
            var current_data = ke.particles.sett_trans_combo.model.getCombinationItemData(pl('.opt-' + num));
            langSelType = ke.particles.sett_trans_combo.model.isFromSel(num)
                ? ke.particles.lang_selectors.view.TYPES.FROM
                : ke.particles.lang_selectors.view.TYPES.TO;
            ke.particles.lang_selectors.view.fillDropdown(langSelType, num, current_data, ke.ext.const.lang.list, callback);
        }
    });
})();