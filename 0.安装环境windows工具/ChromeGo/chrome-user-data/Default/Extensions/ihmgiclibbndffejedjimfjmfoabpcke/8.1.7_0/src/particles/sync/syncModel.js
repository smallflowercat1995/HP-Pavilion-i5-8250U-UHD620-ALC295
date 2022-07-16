/**
 * Created by chernikovalexey on 28/10/17.
 */

// Used only in background
// Thus, no local storage requests forwarding required

(function () {

    function getSyncServer() {
        return ke.ext.util.storageUtil.getVal('user_country') === 'cn' 
            ? 'asia.gikken.co/matesync'
            : 'sync.matetranslate.com';
    }

    const MAX_DB_REQ_TIME = 7500;
    
    pl.extend(ke.particles.sync.model, {
        syncHistory: function (callback) {
            var token = ke.ext.util.storageUtil.getVal('account_token');

            if (!token) {
                callback({error: true, message: ke.getLocale('Sync_NotSignedInError')});
                return;
            }

            ke.idb.enum('it', 'history', Number.MAX_VALUE, null, true, function (items) {
                var to_del = [];
                var server_ids = [];
                var translations = [];

                var timestamp_to_id = {};
                var to_del_ids = [];

                items.forEach(function (translation) {
                    timestamp_to_id[translation.time] = translation.id;

                    if (pl.type(translation.server_id, 'int')) {
                        if (translation.pending_removal) {
                            to_del.push(translation.server_id);
                            to_del_ids.push(translation.id);
                        } else {
                            server_ids.push(translation.server_id);
                        }
                    } else if (!translation.pending_removal) {
                        translations.push({
                            timestamp: translation.time,
                            json: translation.it_resp
                        });
                    }
                });

                //console.log('Items pending removal:', to_del.length);
                //console.log('Synchronized items:', server_ids.length);
                //console.log('Items pending upload:', translations.length);

                $.ajax({
                    url: 'https://' + getSyncServer() + '/hist_sync',
                    type: 'POST',
                    dataType: 'JSON',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    data: JSON.stringify({
                        lang: ke.browserLang,
                        token: token,
                        ids_to_delete: to_del,
                        local_server_ids: server_ids,
                        translations: translations
                    }),
                    success: function (r) {
                        var pending_requests = 0;
                        var finished_requests = 0;
                        var enabled_count = 0;
                        var add_rm_changes = false;

                        if (!r.deletion.error && r.deletion.deletion_succeeded) {
                            if (to_del_ids.length > 0) ++pending_requests;

                            // delete items from the db forever
                            ke.idb.del('it', 'history', to_del_ids, function () {
                                ++finished_requests;
                            });

                            ++enabled_count;
                        } else {
                            callback({error: true, message: ke.getLocale('Sync_SyncFailedError') + r.deletion.reason});
                            return;
                        }

                        if (!r.download.error) {

                            // save items
                            r.download.translations.forEach(function (downloaded_item) {
                                ++pending_requests;
                                add_rm_changes = true;

                                ke.ext.cache.saveOrUpdate(
                                    downloaded_item.json[5],
                                    downloaded_item.json[6],
                                    downloaded_item.json[1],
                                    downloaded_item.json,
                                    'adev',
                                    function () {
                                        ++finished_requests;
                                    },
                                    downloaded_item
                                );
                            });

                            ++enabled_count;

                            // remove items
                            r.download.deleted.forEach(function (deleted_id) {
                                ++pending_requests;
                                add_rm_changes = true;

                                ke.idb.exists('it', 'history', ['server_id', deleted_id], {}, function (exists, primaryKey) {
                                    if (exists) {
                                        ke.idb.del('it', 'history', [primaryKey], function () {
                                            ++finished_requests;

                                            //console.log(primaryKey, 'deleted ok..');
                                        });
                                    } else {
                                        ++finished_requests;

                                        //console.log(primaryKey, 'does not exist!');
                                    }
                                });
                            });

                            ++enabled_count;
                        } else {
                            callback({error: true, message: ke.getLocale('Sync_SyncFailedError') + r.download.reason});
                            return;
                        }

                        if (!r.upload.error) {
                            r.upload.server_ids.forEach(function (uploaded_item) {
                                ++pending_requests;

                                ke.idb.update('it', 'history', timestamp_to_id[uploaded_item.timestamp], {
                                    server_id: uploaded_item.server_id
                                }, function () {
                                    ++finished_requests;

                                    //console.log('updated item (server_id)');
                                });
                            });

                            ++enabled_count;
                        } else {
                            callback({error: true, message: ke.getLocale('Sync_SyncFailedError') + r.upload.reason});
                            return;
                        }

                        var start_time = Date.now();
                        var i = setInterval(function () {
                            if ((enabled_count === 4 && finished_requests >= pending_requests)
                                || Date.now() - start_time >= MAX_DB_REQ_TIME) {

                                clearInterval(i);
                                callback({
                                    error: false,
                                    downloaded: r.download.translations.length,
                                    uploaded: r.upload.server_ids.length,
                                    add_rm_changes: add_rm_changes
                                });
                            }
                        }, 10);
                    },
                    error: function (r) {
                        callback({error: true, message: ke.getLocale('Sync_NetworkError')});
                    }
                });
            });
        },

        uploadHistoryItems: function (items, callback) {
            var token = ke.ext.util.storageUtil.getVal('account_token');

            if (!token) {
                callback({error: true, message: ke.getLocale('Sync_NotSignedInError')});
                return;
            }

            if (items.length === 0) {
                callback({error: true, message: ke.getLocale('Sync_NoItemsError')});
                return;
            }

            var timestamp_to_ids = {};
            for (var i = 0, len = items.length; i < len; ++i) {
                timestamp_to_ids[items[i].timestamp] = items[i].id;
                delete items[i].id;
            }

            $.ajax({
                url: 'https://' + getSyncServer() + '/hist_upload',
                type: 'POST',
                dataType: 'JSON',
                headers: {
                    'Content-Type': 'application/json'
                },
                data: JSON.stringify({
                    lang: ke.browserLang,
                    token: token,
                    translations: items
                }),
                success: function (r) {
                    var pending_requests = 0;
                    var finished_requests = 0;

                    if (!r.error) {
                        r.server_ids.forEach(function (item) {
                            ++pending_requests;

                            ke.idb.update('it', 'history', timestamp_to_ids[item.timestamp], {
                                server_id: item.server_id
                            }, function () {
                                ++finished_requests;
                            });
                        });

                        var start_time = Date.now();
                        var i = setInterval(function () {
                            if ((finished_requests === pending_requests)
                                || Date.now() - start_time >= MAX_DB_REQ_TIME) {

                                clearInterval(i);
                                callback({error: false});
                            }
                        }, 10);
                    } else {
                        callback({error: true, message: ke.getLocale('Sync_SyncFailedError')});
                    }
                },
                error: function (r) {
                    callback({error: true, message: ke.getLocale('Sync_NetworkError')});
                }
            });
        },

        deleteHistoryItems: function (items, callback) {
            var token = ke.ext.util.storageUtil.getVal('account_token');

            if (!token) {
                callback({error: true, message: ke.getLocale('Sync_NotSignedInError')});
                return;
            }

            if (items.length === 0) {
                callback({error: true, message: ke.getLocale('Sync_NoItemsError')});
                return;
            }

            var ids = [];
            var server_ids = [];
            for (var i = 0, len = items.length; i < len; ++i) {
                ids.push(items[i].id);
                server_ids.push(items[i].server_id);
            }

            $.ajax({
                url: 'https://' + getSyncServer() + '/hist_delete',
                type: 'POST',
                dataType: 'JSON',
                headers: {
                    'Content-Type': 'application/json'
                },
                data: JSON.stringify({
                    lang: ke.browserLang,
                    token: token,
                    ids_to_delete: server_ids
                }),
                success: function (r) {
                    if (!r.error && r.deletion_succeeded) {
                        ke.idb.del('it', 'history', ids, function () {
                            callback({error: false});
                        });
                    } else {
                        callback({error: true, message: ke.getLocale('Sync_SyncFailedError')});
                    }
                },
                error: function (r) {
                    callback({error: true, message: ke.getLocale('Sync_NetworkError')});
                }
            });
        },

        syncPhrasebook: function (callback) {
            var token = ke.ext.util.storageUtil.getVal('account_token');

            if (!token) {
                callback({error: true, message: ke.getLocale('Sync_NotSignedInError')});
                return;
            }

            ke.idb.enum('it', 'wordlists', Number.MAX_VALUE, null, true, function (items) {
                var to_del = [];
                var local_wl_ids = [];
                var wordlists = [];

                var wl_to_del_local_ids = [];
                var words_to_del_local_ids = [];

                var timestamp_to_word = {};
                var timestamp_to_id = {};

                var overshoot = 0;

                items.forEach(function (wordlist) {
                    if (wordlist.server_id) {
                        timestamp_to_id[wordlist.last_update] = wordlist.id;
                    } else {
                        timestamp_to_id[wordlist.created] = wordlist.id;
                    }

                    ke.idb.search('it', 'phrases', {
                        parent_wordlist_key: wordlist.id
                    }, function (words) {
                        if (wordlist.server_id) {
                            var word_server_ids = [];
                            var words_to_upload = [];
                            var words_to_del = [];

                            words.forEach(function (word) {
                                timestamp_to_word[word.added] = word.id;

                                if (word.server_id) {
                                    if (word.pending_removal) {
                                        words_to_del_local_ids.push(word.id);
                                        words_to_del.push(word.server_id);
                                    } else {
                                        word_server_ids.push(word.server_id);
                                    }
                                } else {
                                    words_to_upload.push({
                                        id: word.id,
                                        added: word.added,
                                        json: word.json
                                    });
                                }
                            });

                            if (wordlist.pending_removal) {
                                wl_to_del_local_ids.push(wordlist.id);
                                to_del.push({
                                    r: true,
                                    id: wordlist.server_id,
                                    words: word_server_ids.concat(words_to_del)
                                });
                            } else {
                                local_wl_ids.push({
                                    id: wordlist.server_id,
                                    words: word_server_ids
                                });
                            }

                            if (words_to_del.length > 0) {
                                ++overshoot;

                                to_del.push({
                                    r: false,
                                    id: wordlist.server_id,
                                    words: words_to_del
                                });
                            }

                            if (words_to_upload.length > 0) {
                                ++overshoot;

                                wordlists.push({
                                    id: wordlist.id,
                                    server_id: wordlist.server_id,
                                    last_update: wordlist.last_update,
                                    words: words_to_upload
                                });
                            }
                        } else if (!wordlist.pending_removal) {
                            var word_items = [];
                            words.forEach(function (word) {
                                timestamp_to_word[word.added] = word.id;

                                word_items.push({
                                    added: word.added,
                                    json: word.json
                                });
                            });

                            wordlists.push({
                                timestamp: wordlist.created,
                                last_update: wordlist.last_update,

                                from: wordlist.from,
                                to: wordlist.to,
                                name: wordlist.name,

                                words: word_items
                            });
                        } else {
                            --overshoot;
                        }
                    });
                });

                var start_time = Date.now();
                var i = setInterval(function () {
                    if (to_del.length + local_wl_ids.length + wordlists.length - overshoot === items.length) {
                        clearInterval(i);
                        ke.particles.sync.model.sendAndHandlePhrasebookSyncRequest(
                            token, to_del, local_wl_ids,
                            wordlists, wl_to_del_local_ids,
                            words_to_del_local_ids, timestamp_to_id,
                            timestamp_to_word,
                            callback
                        );
                    } else if (Date.now() - start_time >= MAX_DB_REQ_TIME) {
                        clearInterval(i);
                        callback({error: true, message: ke.getLocale('Sync_UnknownError')});
                    }
                });
            });
        },

        sendAndHandlePhrasebookSyncRequest: function (token, to_del, local_wl_ids,
                                                      wordlists, wl_to_del_local_ids, words_to_del_local_ids,
                                                      timestamp_to_id, timestamp_to_word, callback) {

            //console.log('Local data (to delete, local WL ids, ununploaded wordlists):');
            //console.log(to_del);
            //console.log(local_wl_ids);
            //console.log(wordlists);
            //console.log('-=-=-');

            $.ajax({
                url: 'https://' + getSyncServer() + '/pb_sync',
                type: 'POST',
                dataType: 'JSON',
                headers: {
                    'Content-Type': 'application/json'
                },
                data: JSON.stringify({
                    lang: ke.browserLang,
                    token: token,
                    to_del: to_del,
                    local_wl_ids: local_wl_ids,
                    wordlists: wordlists
                }),
                success: function (r) {
                    var pending_requests = 0;
                    var finished_requests = 0;
                    var enabled_count = 0;
                    var dynamic_enabled_count = 0;
                    var add_rm_changes = false;

                    if (r.error) {
                        callback({error: true, message: ke.getLocale('Sync_PbGeneralError')});

                        return;
                    }

                    if (r.deleted.success) {
                        if (wl_to_del_local_ids.length > 0) ++pending_requests;

                        ke.idb.del('it', 'wordlists', wl_to_del_local_ids, function () {
                            ++finished_requests;
                        });

                        if (words_to_del_local_ids.length > 0) ++pending_requests;

                        ke.idb.del('it', 'phrases', words_to_del_local_ids, function () {
                            ++finished_requests;
                        });
                    } else {
                        callback({error: true, message: ke.getLocale('Sync_PbDeleteError')});
                        return;
                    }

                    if (pl.type(r.to_delete, 'arr')) {
                        r.to_delete.forEach(function (to_del_item) {
                            ++pending_requests;
                            add_rm_changes = true;

                            ke.idb.exists('it', 'wordlists', ['server_id', to_del_item.id], {}, function (exists, primaryKey) {
                                if (exists) {
                                    if (to_del_item.r) {
                                        ++pending_requests;
                                        ke.idb.del('it', 'wordlists', [primaryKey], function () {
                                            ++finished_requests;
                                        });

                                        ++pending_requests;
                                        ke.idb.findAndDel('it', 'phrases', {
                                            parent_wordlist_key: primaryKey
                                        }, function () {
                                            ++finished_requests;
                                        });
                                    } else {
                                        ++dynamic_enabled_count;
                                        to_del_item.words.forEach(function (word_server_id) {
                                            ++pending_requests;

                                            ke.idb.findAndDel('it', 'phrases', {
                                                server_id: word_server_id
                                            }, function () {
                                                ++finished_requests;
                                            });
                                        });
                                        ++enabled_count;

                                        ++pending_requests;
                                        ke.idb.update('it', 'wordlists', primaryKey, {
                                            phrases_count: {
                                                update_type: ke.idb.ARITH_ADD_UPDATE_TYPE,
                                                value: -to_del_item.words.length
                                            }
                                        }, function () {
                                            ++finished_requests;
                                        });
                                    }

                                } else {
                                }

                                ++finished_requests;
                            });
                        });

                        ++enabled_count; // normal
                    } else {
                        callback({error: true, message: ke.getLocale('Sync_SyncFailedError')});
                        return;
                    }

                    if (!r.to_download.error) {
                        var saveWords = function (wl_id, words) {
                            words.forEach(function (word) {
                                ++pending_requests;

                                ke.idb.add('it', 'phrases', {
                                    parent_wordlist_key: wl_id,
                                    text: word.json[1],
                                    translation: word.json[3],
                                    json: word.json,
                                    added: word.added,
                                    server_id: word.server_id,
                                    usageExample: '',
                                    pending_removal: false
                                }, 'phrase', function (new_phrase_id, new_phrase) {
                                    ++finished_requests;
                                });
                            });

                            ++enabled_count;
                        };

                        r.to_download.items.forEach(function (wordlist) {
                            ++pending_requests;
                            add_rm_changes = true;

                            if (wordlist.timestamp) {
                                // create new wordlist

                                ke.idb.add('it', 'wordlists', {
                                    from: wordlist.from,
                                    to: wordlist.to,
                                    name: wordlist.name,
                                    last_update: wordlist.last_update,
                                    created: wordlist.timestamp,
                                    phrases_count: wordlist.words.length,
                                    server_id: wordlist.server_id,
                                    pending_removal: false
                                }, 'wordlist', function (wl_id, new_wordlist) {
                                    ++finished_requests;
                                    ++dynamic_enabled_count;

                                    saveWords(wl_id, wordlist.words);
                                });
                            } else {
                                // update old wordlist

                                ke.idb.findAndUpdate('it', 'wordlists', {
                                    server_id: wordlist.server_id
                                }, {
                                    last_update: wordlist.last_update,
                                    phrases_count: {
                                        update_type: ke.idb.ARITH_ADD_UPDATE_TYPE,
                                        value: +wordlist.words.length
                                    }
                                }, function (upd_items) {
                                    if (upd_items.length === 0) {
                                        ++finished_requests;
                                        return;
                                    }

                                    ++finished_requests;
                                    ++dynamic_enabled_count;

                                    saveWords(upd_items[0].id, wordlist.words);
                                });
                            }
                        });

                        ++enabled_count;
                    } else {
                        callback({error: true, message: ke.getLocale('Sync_SyncFailedError')});
                        return;
                    }

                    ++pending_requests;
                    ke.particles.sync.model.handleUploadWordlistsResponse(timestamp_to_id, timestamp_to_word, r.uploaded, function (o) {
                        if (o.error) {
                            callback(o);
                        } else {
                            ++finished_requests;
                        }
                    });

                    var start_time = Date.now();
                    var i = setInterval(function () {
                        if ((enabled_count === 2 + dynamic_enabled_count && finished_requests === pending_requests)
                            || Date.now() - start_time >= MAX_DB_REQ_TIME) {
                            clearInterval(i);
                            callback({
                                error: false,
                                add_rm_changes: add_rm_changes
                            });
                        }
                    }, 10);
                },
                error: function (r) {
                    callback({error: true, message: ke.getLocale('Sync_NetworkError')});
                }
            });
        },

        uploadWordlists: function (items, callback) {
            var token = ke.ext.util.storageUtil.getVal('account_token');

            if (!token) {
                callback({error: true, message: ke.getLocale('Sync_NotSignedInError')});
                return;
            }

            if (items.length === 0) {
                callback({error: true, message: ke.getLocale('Sync_NoItemsError')});
                return;
            }

            var ids_mapped = ke.particles.sync.model.mapPhrasebookUploadIds(items);

            $.ajax({
                url: 'https://' + getSyncServer() + '/wl_upload',
                type: 'POST',
                dataType: 'JSON',
                headers: {
                    'Content-Type': 'application/json'
                },
                data: JSON.stringify({
                    lang: ke.browserLang,
                    token: token,
                    wordlists: items
                }),
                success: function (r) {
                    ke.particles.sync.model.handleUploadWordlistsResponse(ids_mapped.t2ids, ids_mapped.t2words, r, callback);
                },
                error: function (r) {
                    callback({error: true, message: ke.getLocale('Sync_NetworkError')});
                }
            });
        },

        mapPhrasebookUploadIds: function (items) {
            var timestamp_to_id = {};
            var timestamp_to_word_id = {};

            for (var i = 0, len = items.length; i < len; ++i) {
                timestamp_to_id[items[i].timestamp || items[i].last_update] = items[i].id;
                delete items[i].id;

                for (var j = 0, len2 = items[i].words.length; j < len2; ++j) {
                    timestamp_to_word_id[items[i].words[j].added] = items[i].words[j].id;
                    delete items[i].words[j].id;
                }
            }

            return {
                t2ids: timestamp_to_id,
                t2words: timestamp_to_word_id
            };
        },

        handleUploadWordlistsResponse: function (timestamp_to_id, timestamp_to_word_id, r, callback) {
            var pending_requests = 0;
            var finished_requests = 0;
            var dynamic_enables_count = 0;
            var enabled_count = 0;

            var updateWordlistAndWords = function (wordlist, wl_update_obj, wl_id_name, words_name) {
                ke.idb.update('it', 'wordlists', timestamp_to_id[wordlist[wl_id_name]], wl_update_obj, function () {
                    ++finished_requests;
                });

                wordlist[words_name].forEach(function (word) {
                    ++pending_requests;

                    ke.idb.update('it', 'phrases', timestamp_to_word_id[word.added], {
                        server_id: word.server_id
                    }, function () {
                        ++finished_requests;
                    });
                });

                ++enabled_count;
            };

            if (r.new_lists) {
                r.new_lists.forEach(function (wordlist) {
                    if (wordlist.error) {
                        return;
                    }

                    ++pending_requests;
                    ++dynamic_enables_count;

                    updateWordlistAndWords(wordlist, {
                        server_id: wordlist.server_id
                    }, 'timestamp', 'words');
                });

                ++enabled_count;
            }

            if (r.updated_lists) {
                r.updated_lists.forEach(function (wordlist) {
                    if (wordlist.error) {
                        return;
                    }

                    ++pending_requests;
                    ++dynamic_enables_count;

                    updateWordlistAndWords(wordlist, {
                        server_id: wordlist.server_id,
                        last_update: wordlist.last_update
                    }, 'last_update', 'words_ids');
                });

                ++enabled_count;
            }

            var start_time = Date.now();
            var i = setInterval(function () {
                if ((enabled_count === 2 + dynamic_enables_count && finished_requests === pending_requests)
                    || Date.now() - start_time >= MAX_DB_REQ_TIME) {

                    clearInterval(i);
                    callback({error: false});
                }
            }, 10);
        },

        uploadWords: function (items, callback) {
            var token = ke.ext.util.storageUtil.getVal('account_token');

            if (!token) {
                callback({error: true, message: ke.getLocale('Sync_NotSignedInError')});
                return;
            }

            if (items.length === 0) {
                callback({error: true, message: ke.getLocale('Sync_NoItemsError')});
                return;
            }

            var ids_mapped = ke.particles.sync.model.mapPhrasebookUploadIds(items);

            $.ajax({
                url: 'https://' + getSyncServer() + '/wl_upload',
                type: 'POST',
                dataType: 'JSON',
                headers: {
                    'Content-Type': 'application/json'
                },
                data: JSON.stringify({
                    lang: ke.browserLang,
                    token: token,
                    wordlists: items
                }),
                success: function (r) {
                    if (r.error) {
                        console.error(r.reason);
                        return;
                    }

                    ke.particles.sync.model.handleUploadWordlistsResponse(ids_mapped.t2ids, ids_mapped.t2words, r);
                }
            });
        },

        deleteWordlists: function (items, callback) {
            var token = ke.ext.util.storageUtil.getVal('account_token');

            if (!token) {
                callback({error: true, message: ke.getLocale('Sync_NotSignedInError')});
                return;
            }

            if (items.length === 0) {
                callback({error: true, message: ke.getLocale('Sync_NoItemsError')});
                return;
            }

            var wl_ids = [];
            var words_ids = [];

            for (var i = 0, len = items.length; i < len; ++i) {
                if (items[i].r) {
                    wl_ids.push(items[i]._id);
                }
                words_ids.push(items[i]._words);

                delete items[i]._id;
                delete items[i]._words;
            }

            $.ajax({
                url: 'https://' + getSyncServer() + '/wl_delete',
                type: 'POST',
                dataType: 'JSON',
                headers: {
                    'Content-Type': 'application/json'
                },
                data: JSON.stringify({
                    lang: ke.browserLang,
                    token: token,
                    to_del: items
                }),
                success: function (r) {
                    if (r.success) {
                        ke.idb.del('it', 'wordlists', wl_ids, function () {
                            ke.idb.del('it', 'phrases', words_ids, function () {
                                callback({error: false});
                            });
                        });
                    } else {
                        callback({error: true, message: ke.getLocale('Sync_SyncFailedError')});
                    }
                }
            });
        }
    });
})();