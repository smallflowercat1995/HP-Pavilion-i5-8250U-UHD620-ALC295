(function (undefined) {
    ke.import('ext.util.storageUtil');

    var isSel = function (n, offset) {
        for (var i = 0 + offset; i <= n; i += 3) {
            if (i === n) {
                return true;
            }
        }
        return false;
    };

    var clearArray = function (a) {
        if (!a) return a;

        var na = [];
        for (var i = 0, len = a.length; i < len; ++i) {
            if (a[i]) na.push(a[i]);
        }

        return na;
    };

    var CCW_COMBO_TPL = '<div class="ccw-combo combo-<%=code%>" data-code="<%=code%>"><%=name%></div>';

    pl.extend(ke.particles.sett_trans_combo.model, {
        onCCheckboxChange: function (flag) {
            ke.ext.util.storageUtil.requestBackgroundOption('setOptionAsBoolean', ['key_combo', flag]);
            ke.particles.sett_trans_combo.model.ctrlComboVisibility('slide' + (flag ? 'Down' : 'Up'));
        },

        onComboDropdownOpen: function (elem_index, ot) {
            ke.particles.scrollbars.model.setupComboOptionsDropdownScroll(elem_index, ot);
        },

        isFromSel: function (n) {
            return isSel(n, -2);
        },

        getCombinationItemData: function (e) {
            e = e.get ? e : pl(e);
            if (!e.hasClass('combo-select')) {
                var i = 0;
                while (!(e = e.parent()).hasClass('combo-select') && ++i < 100) {
                }
            }

            return {
                node: e.get(),
                is_main: e.hasClass('main-combo'),
                from: e.attr('data-from'),
                to: e.attr('data-to'),
                combo: e.attr('data-combo'),
                index1: +e.attr('data-index1'),
                index2: +e.attr('data-index2'),
                index3: +e.attr('data-index3')
            };
        },

        onComboDropdownChange: function (serial, v, prev_val) {
            ke.ext.util.storageUtil.requestBackgroundOption('getDecodedVal', ['add_trans_combinations'], function (combinations) {
                var item = ke.particles.sett_trans_combo.model.getCombinationItemData('.opt-' + serial);
                var int_reinit = false;

                if (item.is_main) {
                    if (ke.particles.sett_trans_combo.model.isFromSel(serial)) {
                        ke.ext.util.storageUtil.requestBackgroundOption('setVal', ['from_lang', v]);

                        $(item.node).attr('data-from', v);
                    } else {
                        ke.ext.util.storageUtil.requestBackgroundOption('setVal', ['to_lang', v]);

                        $(item.node).attr('data-to', v);
                    }

                    int_reinit = true;

                    chrome.runtime.sendMessage({
                        action: ke.processCall('app', 'opt', 'generateDropdownHtml'),
                        serial: serial
                    }, function (data) {
                        ke.app.initCombinationsDropdown(data.old_data.serial);
                    });
                } else {
                    combinations[item.combo] = combinations[item.combo] || {};

                    if (ke.particles.sett_trans_combo.model.isFromSel(serial)) {
                        combinations[item.combo].from = v;
                        $(item.node).attr('data-from', v);
                    } else {
                        combinations[item.combo].to = v;
                        $(item.node).attr('data-to', v);
                    }
                }

                ke.ext.util.storageUtil.requestBackgroundOption('encodeAndSet', ['add_trans_combinations', combinations], function () {
                    chrome.runtime.sendMessage({
                        action: ke.processCall('app', 'option', 'updateContextMenu')
                    });
                });

                if (!int_reinit) {
                    ke.app.initCombinationsDropdown(serial);
                }
            });
        },

        ctrlComboVisibility: function (forced_action, time) {
            ke.ext.util.storageUtil.requestBackgroundOption('isTrueOption', ['key_combo'], function (is_true) {
                ke.ui_views.visibility.ctrl(
                    forced_action,
                    ke.getSelectorConst('settings', 'col_combo'),
                    is_true,
                    ke.particles.sett_trans_combo.model.ctrlComboVisibility,
                    time
                );
            });
        },

        removeCombination: function (event) {
            var item = ke.particles.sett_trans_combo.model.getCombinationItemData(this);

            ke.ext.util.storageUtil.requestBackgroundOption('deleteJsonElementByKey', ['add_trans_combinations', item.combo], function () {
                chrome.runtime.sendMessage({
                    action: ke.processCall('app', 'option', 'updateContextMenu')
                });
            });

            $('.cs-' + item.index3).animate({
                height: 0,
                opacity: 0
            }, ke.getAnimSpeed('fast_slide_up'), 'easeOutQuint', function () {
                $(this).remove();

                --ke.app.temp.combos;
                ke.particles.sett_trans_combo.model.ctrlNewComboClass();
            });
        },

        ctrlNewComboClass: function () {
            pl('.new-combo-button')[ke.app.temp.combos == 0 ? 'addClass' : 'removeClass']('no-combos');
        },

        addCombination: function (event) {
            ke.ext.util.storageUtil.requestBackgroundOption('isTrueOption', ['chr_pro_flag'], function (is_pro) {
                if (!is_pro) {
                    ke.ui.pro_alert.show(ke.getLocale('Pro_ShortcutsFeature'), 'shortcuts');
                } else if (ke.app.temp.combos < 20) {
                    ke.particles.sett_trans_combo.view.renderCombination("", "", false, true, '');
                    ke.app.initCombinationsDropdown('.cs-' + ke.particles.sett_trans_combo.view.getLastIndex());
                    ke.particles.sett_trans_combo.model.ctrlNewComboClass();

                    if (typeof ga != "undefined") ga('send', 'event', 'options', 'shortcuts', 'add');
                } else {
                    if (typeof ga != "undefined") ga('send', 'event', 'options', 'shortcuts', 'max-reached');

                    alert(ke.getLocale('Settings_21max'));
                }
            });
        },

        validDownKeys: {},

        getDownKeysAsCombo: function (downKeys) {
            var keys = [];
            for (var key in downKeys || this.validDownKeys) {
                keys.push(ke.ext.event.getNicePresentationForKeyCode(key));
            }
            return keys.join('+');
        },

        activateKeysDetection: function (event) {
            $(this).addClass('ccw-active');

            var combo = $(this).data('combo');
            ke.particles.sett_trans_combo.model.currentActiveFieldIndex = +$(this).data('combo-id');

            ke.particles.sett_trans_combo.model.validDownKeys = {};

            if (combo) {
                combo.split('+').forEach(function (c) {
                    ke.particles.sett_trans_combo.model.validDownKeys[+c] = true;
                });
            }

            ke.particles.sett_trans_combo.model.listenToCombinations();

            event.stopPropagation();

            $('body').on('click', ke.particles.sett_trans_combo.model.deactivateKeysDetection);
        },

        deactivateKeysDetection: function () {
            $('.combo-' + ke.particles.sett_trans_combo.model.currentActiveFieldIndex).removeClass('ccw-active');

            ke.ext.event.forget();
            ke.particles.sett_trans_combo.model.closeCombinationChange(ke.particles.sett_trans_combo.model.currentActiveFieldIndex);

            $('body').off('click', ke.particles.sett_trans_combo.model.deactivateKeysDetection);
        },

        clearKeys: function (event) {
            event.stopPropagation();

            var id = $(this).data('id');
            var $combo = $('.combo-' + id);

            $combo
                .attr('data-combo', '')
                .parent()
                .attr('data-combo', '');

            if (!ke.particles.sett_trans_combo.model.currentActiveFieldIndex) {
                ke.particles.sett_trans_combo.model.currentActiveFieldIndex = id;
            }

            ke.particles.sett_trans_combo.model.validDownKeys = {};
            ke.particles.sett_trans_combo.model.updateCurrentState(null, $combo);

            ke.particles.sett_trans_combo.model.deactivateKeysDetection();
            ke.particles.sett_trans_combo.model.currentActiveFieldIndex = null;
        },

        listenToCombinations: function () {
            ke.ext.event.listen(function (down_keys) {
                var combo = ke.particles.sett_trans_combo.model.getDownKeysAsCombo(down_keys);
                var filtered = ke.ext.event.filter(combo);

                if (filtered) {
                    var codes = ke.ext.event.getKeyCodeCombinationFromName(filtered);

                    ke.particles.sett_trans_combo.model.validDownKeys = {};

                    codes.forEach(function (c) {
                        ke.particles.sett_trans_combo.model.validDownKeys[c] = true;
                    });

                    $('.combo-' + ke.particles.sett_trans_combo.model.currentActiveFieldIndex)
                        .attr('data-combo', codes.join('+'))
                        .parent()
                        .attr('data-combo', codes.join('+'));

                    ke.particles.sett_trans_combo.model.deactivateKeysDetection();
                }
            }, function (kc, mkc) {
            }, this.updateCurrentState);
        },

        placeholderToggleTimeout: null,

        sortCurrentKeys: function (keys, $parent) {
            var ordered = [];
            var $where = $parent.find('.ccw-keys');

            if (!keys) {
                for (var key in ke.particles.sett_trans_combo.model.validDownKeys) {
                    ordered.push(key);
                }

                ordered.sort(function (a, b) {
                    a = ke.ext.event.getNicePresentationForKeyCode(a);
                    b = ke.ext.event.getNicePresentationForKeyCode(b);

                    if (ke.ext.event.isModKey(a) && !ke.ext.event.isModKey(b)) return -1;
                    if (!ke.ext.event.isModKey(a) && ke.ext.event.isModKey(b)) return 1;

                    return 0;
                });
            } else {
                ordered = keys;
            }

            $where.html('');
            for (var i = 0, len = ordered.length; i < len; ++i) {
                if (!ordered[i]) continue;

                $where.append(
                    ke.ext.tpl.compile(CCW_COMBO_TPL, {
                        code: ke.ext.event.checkMultipleKeyCodes(ordered[i]),
                        name: ke.ext.event.getNicePresentationForKeyCode(ordered[i])
                    })
                );
            }
        },

        currentActiveFieldIndex: null,

        updateCurrentState: function (keys, $where) {
            if (!$where) {
                $where = $('.combo-' + ke.particles.sett_trans_combo.model.currentActiveFieldIndex);
            } else if (!$where && !ke.particles.sett_trans_combo.model.currentActiveFieldIndex) {
                return;
            }

            keys = clearArray(keys);

            if ($.isEmptyObject(ke.particles.sett_trans_combo.model.validDownKeys) && $.isEmptyObject(keys)) {
                $where.find('.not-empty-combo').hide();
                $where.find('.empty-combo').show();
            } else {
                $where.find('.empty-combo').hide();
                $where.find('.not-empty-combo').show();

                ke.particles.sett_trans_combo.model.sortCurrentKeys(keys, $where);
            }
        },

        closeCombinationChange: function (combo_id) {
            var item = ke.particles.sett_trans_combo.model.getCombinationItemData('.combo-' + combo_id);

            if (item.is_main) {
                ke.ext.util.storageUtil.requestBackgroundOption('setVal', ['trans_combination', item.combo], function () {
                    chrome.runtime.sendMessage({
                        action: ke.processCall('app', 'option', 'updateContextMenu')
                    });
                });
            } else {
                var prev_val = $('.combo-' + combo_id).data('combo');

                ke.ext.util.storageUtil.requestBackgroundOption('getDecodedVal', ['add_trans_combinations'], function (combinations) {
                    combinations[prev_val] = combinations[prev_val] || {};
                    try {
                        combinations[prev_val].from = ke.ui.dropdown.getActiveOptionValue(item.index1);
                        combinations[prev_val].to = ke.ui.dropdown.getActiveOptionValue(item.index2);
                    } catch (e) {
                    }
                    combinations[item.combo] = combinations[prev_val];

                    delete combinations[prev_val];

                    ke.ext.util.storageUtil.requestBackgroundOption('encodeAndSet', ['add_trans_combinations', combinations], function () {
                        chrome.runtime.sendMessage({
                            action: ke.processCall('app', 'option', 'updateContextMenu')
                        });
                    });
                });
            }
        }
    });
})();