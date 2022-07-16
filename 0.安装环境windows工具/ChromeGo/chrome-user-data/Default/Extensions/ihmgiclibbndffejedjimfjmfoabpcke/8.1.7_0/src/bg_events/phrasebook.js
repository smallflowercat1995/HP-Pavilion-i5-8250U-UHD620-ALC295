/**
 * Created by chernikovalexey on 03/11/17.
 */

(function () {
    pl.extend(ke.app.handlers._processEventHandlers.app.phrasebook, {
        getWordlistsByLang: function (data, sendResponse) {
            ke.idb.search('it', 'wordlists', {
                pending_removal: false,
                from: data.from,
                to: data.to
            }, function (wordlists) {
                sendResponse(wordlists);
            }, ke.idb.COMP_AND);
        },

        getWordlistIdByName: function (data, sendResponse) {
            ke.idb.search('it', 'wordlists', {
                pending_removal: false,
                name: data.wl_name,
                from: data.from,
                to: data.to
            }, function (wordlists) {
                if (wordlists.length > 0) {
                    sendResponse(wordlists[0].id);
                } else {
                    sendResponse(null);
                }
            }, ke.idb.COMP_AND);
        },

        addPhrase: function (data, sendResponse) {
            ke.app.handlers._processEventHandlers.app.translate.get({
                identificator: 'phrasebook',
                dontSaveInCache: true,
                text: data.phrase,
                from: data.from,
                to: data.to
            }, function (translation) {
                if (translation.no_results) {
                    sendResponse({no_results: true});
                    return;
                }

                var callback = function (wl_id) {

                    if (!data.wl_id) {
                        data.wl_id = wl_id;
                    }

                    ke.idb.add('it', 'phrases', {
                        parent_wordlist_key: data.wl_id,
                        text: data.phrase,
                        translation: translation.json[3],
                        json: translation.json,
                        added: Date.now(),
                        server_id: null,
                        pending_removal: false,
                        usageExample: data.usageExample || ''
                    }, 'phrase', function (new_phrase_id, new_phrase) {
                        var last_update = Date.now();
                        ke.idb.update('it', 'wordlists', data.wl_id, {
                            phrases_count: {update_type: ke.idb.ARITH_ADD_UPDATE_TYPE, value: (+1)},
                            last_update: last_update
                        }, function (parent_wordlist, parent_wordlist_id) {
                            if (parent_wordlist.server_id) {
                                ke.app.handlers._processEventHandlers.app.sync.uploadWord({
                                    id: new_phrase_id,
                                    wl_id: parent_wordlist_id,
                                    wl_server_id: parent_wordlist.server_id,
                                    word: new_phrase
                                }, function () {
                                });
                            }

                            sendResponse({
                                id: new_phrase_id,
                                parent_wordlist_key: data.wl_id,
                                text: data.phrase,
                                translation: translation.json[3],
                                json: translation.json
                            });
                        });
                    });
                };

                if (!data.wl_id && data.wl_name) {

                    //
                    // For Netflix:
                    // Find word list by name and language pair
                    //

                    if (data.from === 'auto') {
                        //
                        // word lists with from=auto is non comme il faut
                        //
                        data.from = translation.detected_lang;
                    }

                    ke.idb.search('it', 'wordlists', {
                        pending_removal: false,
                        name: data.wl_name,
                        from: data.from,
                        to: data.to
                    }, function (wordlists) {
                        if (wordlists.length > 0) {
                            callback(wordlists[0].id);
                        } else {
                            var last_update = Date.now();

                            ke.idb.add('it', 'wordlists', {
                                from: data.from,
                                to: data.to,
                                name: data.wl_name,
                                last_update: last_update,
                                created: last_update,
                                phrases_count: 0,
                                server_id: null,
                                //usageExample: data.usageExample || '',
                                pending_removal: false
                            }, 'wordlist', function (new_wordlist_id, new_wordlist) {
                                callback(new_wordlist_id);
                            });
                        }
                    }, ke.idb.COMP_AND);
                } else {
                    callback();
                }
            });
        }
    });
})();