(function (undefined) {

    pl.extend(ke.ext.compatibility.db, {
        switchToIDB: function (callback) {
            if (!window.openDatabase) {
                return;
            }

            ke.db.choose(ke.getAppConst('db'), '100 mB');

            ke.db.execSql('SELECT * FROM ' + ke.getAppConst('t_history'), [], function (tx) {
                var sql_items_len = tx.rows.length;
                var idb_items_len = 0;

                for (var i = 0; i < tx.rows.length; ++i) {
                    var item = tx.rows.item(i);

                    ke.idb.exists('it', 'history', ['input', item.input], {
                        l_from: item.l_from,
                        l_to: item.l_to
                    }, function (exists, primaryKey, existing_obj, pass_obj) {
                        if (!exists) {
                            ke.idb.add('it', 'history', pass_obj, 'translation', function () {
                            });
                        }

                        ++idb_items_len;
                    }, {
                        l_from: item.l_from,
                        l_to: item.l_to,
                        input: item.input,
                        it_resp: JSON.parse(item.output),
                        time: item.time,
                        sources: JSON.parse(item.sources)
                    });
                }

                var i = setInterval(function () {
                    if (idb_items_len === sql_items_len) {
                        clearInterval(i);
                        ke.db.execSql('DROP TABLE ' + ke.getAppConst('t_history'), [], callback);
                    }
                }, 10);
            }, callback);
        },

        updateIDBv4: function (callback) {
            callback();
            return;

            //
            // It corrupts the whole thing
            // No one's using the super old version anymore anyways 
            //

            var enabled_count = 0;
            var req_len = 0;
            var finished_len = 0;

            ke.idb.enum('it', 'history', Number.MAX_VALUE, null, true, function (items) {
                items.forEach(function (item) {
                    if (item.it_resp.length === 8) {
                        return;
                    }

                    ++req_len;

                    var new_it_resp = item.it_resp;
                    new_it_resp.splice(6, 0, item.l_to);

                    for (var i = 0; i < new_it_resp[7].length; ++i) {
                        for (var j = 0; j < new_it_resp[7][i].length; ++j) {
                            if (new_it_resp[7][i][j].length === 2) {
                                new_it_resp[7][i][j].push('');
                            }
                        }
                    }

                    ke.idb.update('it', 'history', item.id, {
                        it_resp: new_it_resp
                    }, function () {
                        ++finished_len;
                    });
                });

                ++enabled_count;
            });

            ke.idb.enum('it', 'wordlists', Number.MAX_VALUE, null, true, function (items) {
                items.forEach(function (item) {
                    if (item.created) {
                        return;
                    }

                    ++req_len;

                    var v = item.last_update;
                    ke.idb.update('it', 'wordlists', item.id, {
                        created: {update_type: ke.idb.ADD_FIELD_UPDATE_TYPE, value: v},
                        created: v
                    }, function () {
                        ++finished_len;
                    });
                });

                ++enabled_count;
            });

            ke.idb.enum('it', 'phrases', Number.MAX_VALUE, null, true, function (items) {
                var wl_langs = {};

                items.forEach(function (item) {
                    if (item.json.length === 8) {
                        return;
                    }

                    ++req_len;

                    var update_word = function (item) {
                        item.json.splice(6, 0, wl_langs[item.parent_wordlist_key]);

                        ke.idb.update('it', 'phrases', item.id, {
                            json: item.json
                        }, function () {
                            ++finished_len;
                        });
                    };

                    if (!wl_langs[item.parent_wordlist_key]) {
                        ke.idb.get('it', 'wordlists', item.parent_wordlist_key, function (i) {
                            wl_langs[item.parent_wordlist_key] = i.to;
                            update_word(item);
                        });
                    } else {
                        update_word(item);
                    }
                });

                ++enabled_count;
            });

            // callback
            var start_time = Date.now();
            var i = setInterval(function () {
                if (enabled_count === 3 && finished_len === req_len) {
                    clearInterval(i);
                    callback({error: false});
                } else if (Date.now() - start_time >= 10000) {
                    clearInterval(i);
                    callback({error: true});
                }
            }, 10);
        }
    });

})();