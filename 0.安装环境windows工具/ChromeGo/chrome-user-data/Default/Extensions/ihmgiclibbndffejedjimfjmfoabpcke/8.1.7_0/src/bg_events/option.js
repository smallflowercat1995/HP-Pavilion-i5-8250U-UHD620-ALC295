(function (undefined) {

    var PROMO_ITEM = '<a class="app-button-link" href="<%=link%>" target="_blank"><%=platform_name%></a>';

    pl.extend(ke.app.handlers._processEventHandlers.app.option, {

        //
        // Mate for Safari debugging
        //

        get_dark_mode_option: function (data, sendResponse) {
            data = data.params;
            console.log('dark mode msg (safari):', data);
            data.value = true;
            sendResponse({});
        },

        get_show_translit_option: function (data, sendResponse) {
            data = data.params;
            console.log('show translit msg (safari):', data);
            data.value = true;
            sendResponse({});
        },


        get_show_netflix_option: function (data, sendResponse) {
            data = data.params;
            console.log('show netflix msg (safari):', data);
            data.value = true;
            sendResponse({});
        },

        get_show_ipa_option: function (data, sendResponse) {
            data = data.params;
            console.log('show ipa msg (safari):', data);
            data.value = true;
            sendResponse({});
        },

        get_double_click_option: function (data, sendResponse) {
            data = data.params;
            console.log('double click msg (safari):', data);
            data.value = true;
            sendResponse({});
        },

        get_selection_option: function (data, sendResponse) {
            data = data.params;
            console.log('selection msg (safari):', data);
            data.value = false;
            sendResponse({});
        },

        run_tts: function (data, sendResponse) {
            console.log('run tts msg (safari):', data);
            ke.app.handlers._processEventHandlers.app.audio.play(data.params, function (dd) {
                dd = dd.old_data;
                dd.finished = true;
                console.log('run tts callback (safari):', dd);
                sendResponse({});
            });
        },

        stop_tts: function (data, sendResponse) {
            ke.app.handlers._processEventHandlers.app.audio.stop(data, function () {
                data = data.params;
                data.finished = true;
                sendResponse({});
            });
        },

        translate: function (data, sendResponse) {
            data = data.params;
            data.from = data.type.indexOf('zendesk') > -1 ? 'auto' : 'en';

            if (!data.to) data.to = 'de';

            ke.ext.googleApi.getTextTranslation(data.from, data.to, data.text, function (output) {
                var output_it_format = ke.ext.googleApi.getInternalJSONFormat(output, data.text);
                output_it_format[6] = data.to;
                data.translation = JSON.stringify(output_it_format);

                //data.offline = true;

                sendResponse({});
            });
        },

        open_from_lang_picker: function (data, sendResponse) {
            console.log("open from lang picker (safari)");
        },

        open_to_lang_picker: function (data, sendResponse) {
            console.log("open to lang picker (safari)");
        },

        //
        // Mate for Safari end
        //

        getPromotionalTableButtons: function (data, sendResponse) {
            var buttons = [];
            var table = ke.ext.util.storageUtil.getVal('promo_table');

            if (table) {
                var parsed_table = JSON.parse(table);
                for (var app in parsed_table) {
                    if (parsed_table[app][0] && app !== ke.PLATFORM_CODE) {
                        buttons.push(ke.ext.tpl.compile(PROMO_ITEM, {
                            link: parsed_table[app][1],
                            platform_name: ke.getLocale('Promo_' + ke.capitalize(app))
                        }));
                    }
                }
            }

            sendResponse({
                buttons_code: buttons.join(', ')
            });
        },

        toggleMonetization: function (data, sendResponse) {
            ke.ext.util.storageUtil.setOptionAsBoolean('monetization', data.state);

            if (typeof ga != "undefined") ga('send', 'event', 'toggle-monetization', '' + data.state);
        },

        getKeyComboOptionActiveness: function (data, sendResponse) {
            sendResponse({
                is_active: ke.ext.util.storageUtil.isTrueOption('key_combo')
            });
        },

        getDoubleClickOptionActiveness: function (data, sendResponse) {
            sendResponse({
                is_active: ke.ext.util.storageUtil.isTrueOption('double_click')
            });
        },

        getTranslateOnSelectActiveness: function (data, sendResponse) {
            sendResponse({
                is_active: ke.ext.util.storageUtil.isTrueOption('selection')
            });
        },

        getCurrentKeyCombo: function (data, sendResponse) {
            sendResponse({
                combo: ke.ext.util.storageUtil.getVal('trans_combination'),
                event: data.event
            });
        },

        isMainKeyCombo: function (data, sendResponse) {
            sendResponse({
                is_active: ke.ext.event.is(ke.ext.util.storageUtil.getVal('trans_combination'), data.event)
            });
        },

        isKeyCombo: function (data, sendResponse) {
            var is_active = false;
            var k, val = {from: '', to: ''};
            var combinations = ke.ext.util.storageUtil.getDecodedVal('add_trans_combinations');

            for (var key in combinations) {
                if (ke.ext.event.isDown(key, ke.ext.event.IN_CODES, data.keys_down)) {
                    is_active = true;
                    k = key;
                    val = combinations[key];
                    break;
                }
            }

            if (!is_active) {
                is_active |= ke.ext.event.isDown(ke.ext.util.storageUtil.getVal('trans_combination'), ke.ext.event.IN_CODES, data.keys_down);

                if (is_active || data.dblclick) {
                    k = ke.ext.util.storageUtil.getVal('trans_combination');
                    val.from = ke.ext.util.langUtil.getFromLang();
                    val.to = ke.ext.util.langUtil.getToLang();
                }
            }

            sendResponse({
                is_active: !!is_active,
                combo: k,
                from: val.from,
                to: val.to
            });
        },

        getMainLanguagePair: function (data, sendResponse) {
            sendResponse({
                from_lang: ke.ext.util.langUtil.getFromLang(),
                to_lang: ke.ext.util.langUtil.getToLang()
            });
        },

        getToLang: function (data, sendResponse) {
            sendResponse({
                to_lang: ke.ext.util.langUtil.getToLang()
            });
        },

        ctrlContextActiveness: function (data, sendResponse) {
            ke.ext.util.storageUtil.setVal('ctx_menu', data.active);
            ke.app.initContextMenu();
        },

        ctrlFullpageActiveness: function (data, sendResponse) {
            ke.ext.util.storageUtil.setVal('fullpage', data.active);
            ke.app.initFullpageContextMenu();
        },

        updateContextMenu: function (data, sendResponse) {
            ke.app.initContextMenu();
            ke.app.initFullpageContextMenu();
        },

        getCurrentSelectedText: function (data, sendResponse) {
            sendResponse({
                selected_text: ke.particles.context.model.currentSelectedText
            });
        },

        enableOption: function (data, sendResponse) {
            ke.ext.util.storageUtil.setVal(data.option, true);
        },

        disableOption: function (data, sendResponse) {
            ke.ext.util.storageUtil.setVal(data.option, false);
        },

        isMonetizationOn: function (data, sendResponse) {
            sendResponse({
                active: ke.ext.util.storageUtil.isTrueOption('monetization'),
                is_cis: ke.ext.util.storageUtil.isTrueOption('mon_is_cis')
            });
        }
    });

})();
