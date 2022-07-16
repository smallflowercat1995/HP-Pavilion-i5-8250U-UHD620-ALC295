(function (undefined) {

    pl.extend(ke.app.handlers._processEventHandlers.app.translate, {
        get: function (data, sendResponse) {
            var from = data.from || ke.ext.util.langUtil.getFromLang();
            var to = data.to || ke.ext.util.langUtil.getToLang();

            var fn = sendResponse;

            data.text = ke.ext.string.escapeHtml(data.text);

            var locales = data.identificator === 'window' ? {
                translation: ke.getLocale('Kernel_Listen')
            } : null;

            if (typeof ga != "undefined") ga('send', 'event', 'translation', data.identificator, data.type);
            if (typeof ga != "undefined") ga('send', 'event', 'translation-by-country', ke.ext.util.storageUtil.getVal('user_country'));
            if (typeof ga != "undefined" && (ke.ext.util.storageUtil.getVal('user_country') == 'cn' || navigator.language.indexOf('zh') > -1))  {
                ga('send', 'event', 'translation-country', 'china (locale or ip)');
            }

            //
            // count translations by type

            if (Date.now() - ke.ext.util.storageUtil.getIntValue('last_trans_count_upd') >= ke.TIME.ONE_DAY) {
                ke.app.handlers.sendTranslationsCount();
            }

            if (data.identificator === 'tooltip') {
                ke.ext.util.storageUtil.setJsonField('translations_count', data.type,
                    +ke.ext.util.storageUtil.getJsonField('translations_count', data.type) + 1);
                ke.ext.util.storageUtil.setJsonField('all_trans_count', data.type,
                    +ke.ext.util.storageUtil.getJsonField('all_trans_count', data.type) + 1);
            } else {
                ke.ext.util.storageUtil.setJsonField('translations_count', data.identificator,
                    +ke.ext.util.storageUtil.getJsonField('translations_count', data.identificator) + 1);
                ke.ext.util.storageUtil.setJsonField('all_trans_count', data.identificator,
                    +ke.ext.util.storageUtil.getJsonField('all_trans_count', data.identificator) + 1);
            }

            ke.app.handlers._processEventHandlers.app.opt.updateUninstallUri();

                ke.ext.googleApi.getTextTranslation(from, to, data.text, function (output) {
                    if (output.error) {
                        ke.ext.cache.lookUpInCache(from, to, data.text, function (isEmpty, item) {
                            if (isEmpty) {
                                fn({
                                    offline: true
                                });
                            } else {
                                var json = item.it_resp;
                                var parsed = ke.ext.googleApi.parseReceivedTranslation(json, false, data.prefix, locales, true);

                                parsed[6] = to;

                                fn({
                                    code: parsed[1],
                                    trans_translit: [ke.ext.util.storageUtil.isTrueOption('show_translit'), json[4]],
                                    trans_ipa: [ke.ext.util.storageUtil.isTrueOption('show_ipa'), json[2]],
                                    isMulti: json[0],
                                    detected_lang: json[5],
                                    from: from,
                                    to: to,
                                    json: json
                                });
                            }
                        });
                    } else {
                        var handleTranslation = function (output_it_format, reversed) {
                            if (!output_it_format[3]) {
                                fn({
                                    no_results: true
                                });
                            } else {
                                var correction = output.spell && output.spell.spell_res;
                                var parsed = ke.ext.googleApi.parseReceivedTranslation(output_it_format, false, data.prefix, locales, true);

                                var throwDataBack = function () {
                                    fn({
                                        code: parsed[1],
                                        isMulti: output_it_format[0],
                                        trans_translit: [ke.ext.util.storageUtil.isTrueOption('show_translit'), output_it_format[4]],
                                        trans_ipa: [ke.ext.util.storageUtil.isTrueOption('show_ipa'), output_it_format[2]],
                                        detected_lang: output_it_format[5],
                                        from: reversed ? to : (from === 'auto' ? output_it_format[5] : from),
                                        from_unmodified: from,
                                        to: reversed ? from : to,
                                        reversed: reversed,
                                        correction: correction,
                                        json: output_it_format
                                    });
                                };

                                if (!data.dontSaveInCache && ke.ext.util.storageUtil.isTrueOption('history')) {
                                    // not var `from` to save auto detected langs

                                    ke.ext.cache.saveOrUpdate(output_it_format[5], to, data.text, output_it_format, data.source, throwDataBack);
                                } else {
                                    throwDataBack();
                                }
                            }
                        };

                        var preHandleTranslation = function (output_it_format, reversed) {
                            var ipa_lang = reversed ? from : to;

                            if ((ke.ext.util.storageUtil.isTrueOption('show_ipa') 
                                    || ke.ext.util.storageUtil.isTrueOption('show_articles')) 
                                && ke.ext.util.storageUtil.isTrueOption('chr_pro_flag')
                                && output_it_format[3].length <= ke.ext.googleApi.MAX_IPA_LEN) {

                                    var info_fetcher_req = [];

                                    info_fetcher_req.push({
                                        word: output_it_format[1],
                                        language: output_it_format[5]
                                    });

                                    info_fetcher_req.push({
                                        word: output_it_format[3],
                                        language: output_it_format[6]
                                    });

                                    if (output_it_format[7][1].length > 0) {
                                        output_it_format[7][1].forEach((item) => {
                                            info_fetcher_req.push({
                                                word: item[0],
                                                language: output_it_format[6]
                                            });
                                        });
                                    }

                                    ke.ext.googleApi.getWordsInfo(info_fetcher_req, function (r) {
                                        if ($.isArray(r.words_info)) {
                                            r.words_info.forEach((item) => {
                                                if (item.word === output_it_format[1]) {
                                                    // save stuff for the original
                        
                                                    if (ke.ext.googleApi.IPA_LANGS.indexOf(output_it_format[5]) > -1) {
                                                        output_it_format[10] = item.ipa || '';
                                                    }

                                                    output_it_format[8] = (item.info && item.info.gender) || '';
                                                } else if (item.word === output_it_format[3]) {
                                                    // save stuff for the translation
                        
                                                    if (ke.ext.googleApi.IPA_LANGS.indexOf(output_it_format[6]) > -1) {
                                                        output_it_format[2] = item.ipa || '';
                                                    }
                                                    
                                                    output_it_format[9] = (item.info && item.info.gender) || '';
                                                } else {
                                                    // save stuff for synonyms
                        
                                                    if (output_it_format[7][1].length > 0) {
                                                        for (var j = 0; j < output_it_format[7][1].length; ++j) {
                                                            if (output_it_format[7][1][j][0] === item.word) {
                                                                if (!output_it_format[7][1][j][2] && item.info && item.info.gender) {
                                                                    output_it_format[7][1][j][2] = item.info.gender;
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            });
                                        }
                        
                                        handleTranslation(output_it_format, reversed);
                                    });
                            } else {
                                handleTranslation(output_it_format, reversed);
                            }
                        };

                        var output_it_format = ke.ext.googleApi.getInternalJSONFormat(output, data.text);
                        output_it_format[6] = to;

                        if (output_it_format[5] === to && from !== to && from !== 'auto') {
                            //
                            // reverse translation
                            //
                            ke.ext.googleApi.getTextTranslation(to, from, data.text, function (output) {
                                if (output.error) {
                                    fn({
                                        offline: true
                                    });
                                } else {

                                    var output_it_format = ke.ext.googleApi.getInternalJSONFormat(output, data.text);
                                    output_it_format[6] = to;

                                    preHandleTranslation(output_it_format, true);
                                }
                            });
                        } else {
                            preHandleTranslation(output_it_format, false);
                        }
                    }
                });
        },

        resetMonthlyCounter: function () {
            if (Date.now() - ke.ext.util.storageUtil.getIntValue('last_monthly_reset') >= ke.TIME.ONE_MONTH) {
                ke.ext.util.storageUtil.setIntValue('monthly_trans_count', 0);
                ke.ext.util.storageUtil.setIntValue('last_monthly_reset', Date.now());
            }
        },

        getTranslationPageLink: function (data, sendResponse) {
            sendResponse({
                link: ke.ext.googleApi.getTranslationPageLink(data.text, data.from, data.to)
            });
        }
    });

})();