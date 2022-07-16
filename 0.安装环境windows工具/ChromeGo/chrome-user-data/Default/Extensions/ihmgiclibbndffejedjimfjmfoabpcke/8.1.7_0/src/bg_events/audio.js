(function (undefined) {

    pl.extend(ke.app.handlers._processEventHandlers.app.audio, {
        // Note: this handler is for content scripts / popups to load audio files (in Safari),
        // because loading audios in themselves will lead to request preflight error, probably due to CORS
        load: function (data, sendResponse) {
            ke.ext.audio.loadAudio(data.link, sendResponse)
        },

        play: function (data, sendResponse) {
            var lang = data.lang;

            var callback = function () {
                sendResponse({
                    old_data: data
                });
            };

            if (lang === 'auto') {
                ke.ext.util.langUtil.getDetectedLang(data.text, function (dlang) {
                    if (ke.ext.audio.isUtterable(dlang)) {
                        ke.ext.audio.playText(data.text, dlang, callback);
                    } else {
                        callback();
                    }
                });
            } else {
                if (ke.ext.audio.isUtterable(lang)) {
                    ke.ext.audio.playText(data.text, lang, callback);
                } else {
                    callback();
                }
            }
        },

        stop: function (data, sendResponse) {
            ke.ext.audio.stop();
            sendResponse({
                old_data: data
            });
        }
    });
})();