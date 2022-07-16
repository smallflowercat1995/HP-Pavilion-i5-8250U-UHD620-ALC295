/* Kumquat Hub History Render
 * 
 **/

(function (undefined) {

    pl.extend(ke.app.render, {
        organize: {
            fillAddLangDropdown: function (num, data, callback) {
                var langSelType = num === 1
                    ? ke.particles.lang_selectors.view.TYPES.FROM
                    : ke.particles.lang_selectors.view.TYPES.TO;

                ke.particles.lang_selectors.view.fillDropdown(langSelType, num, {
                    is_main: false,
                    excludes: ['auto'],
                    from: ke.app.temp.new_wordlist_from_lang,
                    to: ke.app.temp.new_wordlist_to_lang
                }, ke.ext.const.lang.list, callback);
            },

            tryShowingWordlist: function () {
                var opened_wordlist = +document.location.hash.split('-')[1];
                ke.app.render.organize.showPhrasesOrWordlists(opened_wordlist, function () {
                    ke.app.render.organize.populateWordlists(function () {
                        if (ke.app.temp.wl_amount > 0) {
                            $('.search-layout').show();
                        } else {
                            $('.search-layout').hide();
                        }

                        ke.ui.loading.close();
                    }, '');
                });
            },

            showPhrasesOrWordlists: function (id, failure_callback) {
                if (!id) {
                    failure_callback();
                    return;
                }

                ke.idb.exists('it', 'wordlists', [], {id: id}, function (exists, primaryKey, existing_obj) {
                    if (exists) {
                        ke.app.temp.current_wordlist_id = primaryKey;
                        ke.app.temp.current_wordlist_from_lang = existing_obj.from;
                        ke.app.temp.current_wordlist_to_lang = existing_obj.to;

                        ke.app.$page_name.html(existing_obj.name).attr('title', existing_obj.name);

                        ke.app.$wl_from_img.attr('src', '../../res/images/flags/' + ke.app.temp.current_wordlist_from_lang + '@2x.png');
                        ke.app.$wl_to_img.attr('src', '../../res/images/flags/' + ke.app.temp.current_wordlist_to_lang + '@2x.png');

                        ke.app.render.organize.populatePhrases(id, '', function () {
                            if (ke.app.temp.phrases_amount > 0) {
                                //$('.search').show();

                                ke.ext.util.storageUtil.requestBackgroundOption('isTrueOption', ['sync'], function (sync) {
                                    if (sync) {
                                        $('.search').addClass('search-shifted-left');
                                    }
                                });
                            }

                            setTimeout(function () {
                                ke.ui.loading.close();
                            }, 500);
                        });
                    } else {
                        failure_callback();
                    }
                })
            },

            populateWordlists: function (callback, search_query) {
                ke.idb.search('it', 'wordlists', {
                    name: search_query,
                    pending_removal: false
                }, function (items, idb_error) {

                    if (!items && idb_error && ke.IS_FIREFOX) {
                        ke.app.flags.error = true;
                        ke.ui.loading.showIdbErrorLayout();
                        return;
                    }

                    ke.app.temp.wl_amount = 0;

                    items.forEach(function (item) {
                        ke.app.render.organize.drawWordlist(item, undefined);
                    });

                    ke.app.handlers.toggleEmptyWordlistsCap(!pl.empty(search_query));

                    callback(items.length);
                }, ke.idb.COMP_AND, null, Number.MAX_VALUE, true, 'last_update');
            },

            drawWordlist: function (item, hl) {
                ++ke.app.temp.wl_amount;

                // Thanks to Mozilla's Policies
                try {
                    ke.app.$wordlists.prepend(
                        ke.ext.tpl.compile(ke.templates.wordlistItem, {
                            id: item.id,
                            from_lang_code: item.from,
                            to_lang_code: item.to,
                            from_lang: ke.getLocale("Kernel_Lang_" + ke.ext.util.langUtil.getLangNameByKey(item.from)),
                            to_lang: ke.getLocale("Kernel_Lang_" + ke.ext.util.langUtil.getLangNameByKey(item.to)),
                            name: item.name,
                            time: ke.ext.time.beautify(item.last_update),
                            phrases_count: item.phrases_count,
                            l_phrases: ke.ext.orphography.getNumDecl(item.phrases_count, [
                                ke.getLocale('Phrasebook_Phrases1'),
                                ke.getLocale('Phrasebook_Phrases2'),
                                ke.getLocale('Phrasebook_Phrases3')
                            ])
                        })
                    );
                } catch (e) {
                }

                var $wl = $('.wl-' + item.id);
                $wl.on('click', ke.app.handlers.onWordlistOpen);
                $wl.find('.wl-delete').on('click', ke.app.handlers.onWordlistDelete);
            },

            populatePhrases: function (id, search_query, callback) {
                ke.idb.search('it', 'phrases', function (item) {
                    return !item.pending_removal
                        && item.parent_wordlist_key === id
                        && (item.text.toLowerCase().indexOf(search_query) > -1
                            || item.translation.toLowerCase().indexOf(search_query) > -1);
                }, function (items) {
                    ke.app.temp.phrases_amount = 0;

                    items.forEach(function (item) {
                        ke.app.render.organize.drawPhrase(item);
                    });

                    ke.app.handlers.toggleEmptyPhrasesCap(!pl.empty(search_query));

                    callback(items.length);
                }, ke.idb.COMP_AND, null, Number.MAX_VALUE, false, 'added');
            },

            drawPhrase: function (item, append_method) {
                ++ke.app.temp.phrases_amount;

                var output = ke.ext.googleApi.parseReceivedTranslation(item.json, true, '', false);

                console.log(output);

                // Thanks to Mozilla's Policies
                try {
                    ke.app.$phrases[append_method || 'append'](
                        ke.ext.tpl.compile(ke.templates.phraseItem, {
                            id: item.id,
                            pid: item.parent_wordlist_key,
                            text: item.text,
                            translation: item.translation,

                            translit_original: ke.ext.googleApi.getSourceTranslitFromJson(item.json),
                            translit_translation: ke.ext.googleApi.getTargetTranslitFromJson(item.json),

                            lang_orig: ke.getLocale('Kernel_Lang_' + ke.ext.util.langUtil.getLangNameByKey(ke.app.temp.current_wordlist_from_lang)),
                            lang_trans: ke.getLocale('Kernel_Lang_' + ke.ext.util.langUtil.getLangNameByKey(ke.app.temp.current_wordlist_to_lang)),

                            preview: ke.ext.tpl.compile(output[2] || '', {
                                to: ke.app.temp.current_wordlist_to_lang
                            })
                        })
                    );
                } catch (e) {
                }

                var $p = $('.p-' + item.id);

                if (!output[2]) {
                    $p.find('.p-trans-layout').addClass('last');
                }

                $p.on('click', ke.app.handlers.onPhrasePreview);
                $p.find('.p-delete').on('click', ke.app.handlers.onPhraseDelete);
            }
        },

        events: {}
    });

})();