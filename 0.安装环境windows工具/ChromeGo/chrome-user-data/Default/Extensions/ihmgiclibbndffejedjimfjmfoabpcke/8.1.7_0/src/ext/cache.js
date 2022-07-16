(function (undefined) {

    ke.import("ext.string");

    pl.extend(ke.ext.cache, {
        saveOrUpdate: function (from, to, input, output, source, callback, server_item) {
            callback = callback || ke.EF;

            ke.idb.exists('it', 'history', ['input', input], {
                l_from: from,
                l_to: to
            }, function (exists, primaryKey, existing_obj) {
                if (exists) {
                    var updated_sources = existing_obj.sources || {};
                    updated_sources[source] = Date.now();

                    var updated_obj = {
                        it_resp: output,
                        sources: updated_sources
                    };

                    if (server_item) {
                        updated_obj.server_id = server_item.server_id;
                    }

                    ke.idb.update('it', 'history', primaryKey, updated_obj, function () {
                        callback();
                    });
                } else {
                    var sources = {};
                    sources[source] = Date.now();

                    var translation_time = server_item
                        ? server_item.timestamp
                        : Date.now();

                    ke.idb.add('it', 'history', {
                        l_from: from,
                        l_to: to,
                        input: input,
                        it_resp: output,
                        sources: sources,
                        server_id: server_item ? server_item.server_id : null,
                        pending_removal: false,
                        time: translation_time
                    }, 'translation', function (id) {
                        callback();

                        if (id && !server_item && ke.canSync) {

                            // try to upload the item to the server
                            ke.particles.sync.model.uploadHistoryItems([{
                                id: id,
                                timestamp: translation_time,
                                json: output
                            }], function () {
                            });
                        }
                    });
                }
            });
        },

        lookUpInCache: function (from, to, input, callback) {
            ke.idb.exists('it', 'history', ['input', input], {
                pending_removal: false,
                l_from: from,
                l_to: to
            }, function (exists, primaryKey, existing_obj) {
                if (!exists) {
                    callback(true);
                } else {
                    callback(false, existing_obj);
                }
            });
        },

        getIdListOfAll: function (callback) {
            ke.idb.search('it', 'history', {
                pending_removal: false
            }, function (items, idb_error) {

                if (!items && idb_error && ke.IS_FIREFOX) {
                    ke.ui.loading.showIdbErrorLayout();
                    return;
                }

                var ids = [];
                for (var i = 0, len = items.length; i < len; ++i) {
                    ids.push(items[i].id);
                }
                callback(ids);
            });
        },

        deleteFewByIdOnClient: function (ids, callback) {
            chrome.runtime.sendMessage({
                action: ke.processCall('app', 'sync', 'deleteHistoryItems'),
                ids: ids
            }, callback);
        },

        deleteFewById: function (ids, callback) {
            var items = [];

            if (!ke.ext.util.storageUtil.getVal('account_token')) {
                ke.idb.del('it', 'history', ids, function () {
                    callback(true);
                });
            } else {
                ids.forEach(function (id) {
                    ke.idb.update('it', 'history', id, {
                        pending_removal: true
                    }, function (item, local_id) {
                        items.push({
                            id: local_id,
                            server_id: item.server_id
                        });
                    });
                });

                var i = setInterval(function () {
                    if (items.length === ids.length) {
                        clearInterval(i);
                        callback(true);

                        if (ke.canSync) {
                            ke.particles.sync.model.deleteHistoryItems(items, function (r) {
                                if (r.error) console.log(r.message);
                            });
                        }
                    }
                }, 10);
            }
        }
    });

})();