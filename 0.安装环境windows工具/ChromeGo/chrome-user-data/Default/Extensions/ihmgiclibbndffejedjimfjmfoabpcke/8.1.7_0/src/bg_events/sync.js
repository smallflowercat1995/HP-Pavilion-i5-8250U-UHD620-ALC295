/**
 * Created by chernikovalexey on 30/10/17.
 */

(function () {
    pl.extend(ke.app.handlers._processEventHandlers.app.sync, {
        syncHistory: function (data, sendResponse) {
            ke.particles.sync.model.syncHistory(sendResponse);
        },

        uploadWordlist: function (data, sendResponse) {
            if (!ke.canSync) {
                return;
            }

            data.wordlist.id = data.id;
            data.wordlist.timestamp = data.wordlist.created;
            data.wordlist.words = [];

            delete data.wordlist.created;
            delete data.wordlist.phrases_count;
            delete data.wordlist.server_id;
            delete data.wordlist.pending_removal;

            ke.particles.sync.model.uploadWordlists([data.wordlist], function (r) {
                if (r.error) console.log(r.message);
            });
        },

        deleteHistoryItems: function (data, sendResponse) {
            ke.ext.cache.deleteFewById(data.ids, sendResponse);
        },

        syncPhrasebook: function (data, sendResponse) {
            ke.particles.sync.model.syncPhrasebook(sendResponse);
        },

        uploadWord: function (data, sendResponse) {
            if (!ke.canSync) {
                return;
            }

            ke.particles.sync.model.uploadWords([{
                id: data.wl_id,
                server_id: data.wl_server_id,
                last_update: data.word.added,
                words: [{
                    id: data.id,
                    added: data.word.added,
                    json: data.word.json
                }]
            }], function (r) {
                if (r.error) console.log(r.message);
            });
        },

        deleteWordlist: function (data, sendResponse) {
            if (!ke.canSync) {
                return;
            }

            var words_ids = [];
            var _words_ids = [];

            data.words.forEach(function (word) {
                words_ids.push(word.server_id);
                _words_ids.push(word.id);
            });

            ke.particles.sync.model.deleteWordlists([{
                r: data.r_wl,
                id: data.wl_server_id,
                _id: data.wl_id,
                words: words_ids,
                _words: _words_ids
            }], function (r) {
                if (r.error) console.log(r.message);
            });
        }
    });
})();