(function (undefined) {

    const GOOD_GOOGLE_LANGS = ["ar", "bn", "zh-CN", "zh-TW", "cs", "da", "nl", "en", "en-US", "et", "tl", "fi", "fr", "de", "hi", "id",
        "it", "ja", "ko", "la", "pl", "pt", "ru", "sr", "si", "sk", "es", "su", "sv", "th", "uk", "vi", "cy"];

    // iw is here only for checks, the API is actually using he instead of iw
    // Bing TTS stopped working
    const GOOD_BING_LANGS = []; /*["en", "bg", "hu", "vi", "el", "da", "he", 'iw', "id", "es", "it", "yue", "ca", "zh-CN", "zh-TW", "ko", "ms", "de",
        "da", "no", "pl", "ro", "ru", "sk", "sl", "th", "ta", "fi", "fr", "hr", "sv", "ja"];*/

    const BAD_GOOGLE_LANGS = ["af", "sq", "hy", "bs", "ca", "hr", "eo", "el", "hu", "is", "jw", "km", "lv", "mk", "ml",
        "mr", "my", "ne", "no", "ro", "sw", "ta", "te", "tr"];

    const BAD_BING_LANGS = [];//["ar", "pt", "hi", "cs"];

    pl.extend(ke.ext.audio, {
        player: null,
        isPlaying: false,
        preventLoading: false,

        get MAX_TTS_LEN() {
            return 160;
        },

        loadAudio: function (link, on_loaded_callback) {
            // Note: If it's Safari and it's not global page, this `loadAudio` should be delegated to global page
            // It is only in Safari that this `loadAudio` could be called by content scripts and popups,
            // because it is not allowd to play audio in background page not triggered by a user interaction (click)
            //
            // For other browsers, this method could only be called in background page
            //
            if (ke.IS_SAFARI && !chrome.utils.isGlobalPage()) {
                return chrome.runtime.sendMessage({
                    action: ke.processCall('app', 'audio', 'load'),
                    link: link
                }, on_loaded_callback);
            }

            var xhr = new XMLHttpRequest();
            xhr.open('GET', link, true);
            xhr.responseType = 'blob';
            xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
            xhr.onload = function (event) {
                if (this.status === 200) {
                    var blob = new Blob([this.response], {type: 'audio/mpeg'});
                    var reader = new FileReader();

                    reader.addEventListener('loadend', function () {
                        on_loaded_callback(reader.result);
                    });

                    reader.readAsDataURL(blob);
                } else {
                    console.error('Unable to download audio chunk');
                }
            };

            xhr.send();
        },

        isUtterable: function (lang) {
            return GOOD_GOOGLE_LANGS.indexOf(lang) > -1
                || GOOD_BING_LANGS.indexOf(lang) > -1
                || BAD_GOOGLE_LANGS.indexOf(lang) > -1
                || BAD_BING_LANGS.indexOf(lang) > -1;
        },

        playAudio: function (audio, on_end_callback) {
            ke.ext.audio.player = new Audio(audio);

            ke.ext.audio.player.onerror = function () {
                console.log('playback error:', arguments);
            };

            ke.ext.audio.player.onended = function () {
                on_end_callback();
                ke.ext.audio.player = null;
            };

            ke.ext.audio.player.play();
        },

        playText: function (text, lang, on_audio_stop_callback) {
            if (ke.ext.audio.isPlaying) {
                ke.ext.audio.stop();
            }

            var chunks = ke.ext.string.chunkate(text, ke.ext.audio.MAX_TTS_LEN);
            var audios = [];

            var startPlayingChunks = function (i) {
                if (i >= chunks.length) {
                    on_audio_stop_callback();
                    return;
                }

                if (!ke.ext.audio.isPlaying) {
                    console.log('abort?');
                    return;
                }

                while (i >= audios.length) ;

                ke.ext.audio.playAudio(audios[i], function () {
                    startPlayingChunks(i + 1);
                });
            };

            var loadAudios = function (i) {
                if (i >= chunks.length) {
                    return;
                }

                var link;

                if (GOOD_GOOGLE_LANGS.indexOf(lang) > -1) {
                    link = ke.ext.googleApi.getAudioFileLink(lang, chunks[i]);
                } else if (GOOD_BING_LANGS.indexOf(lang) > -1 || BAD_BING_LANGS.indexOf(lang) > -1) {
                    link = ke.ext.googleApi.getBingAudioFileLink(ke.ext.googleApi.googleLangsToBingLangs(lang), chunks[i]);
                } else if (BAD_GOOGLE_LANGS.indexOf(lang) > -1) {
                    link = ke.ext.googleApi.getAudioFileLink(lang, chunks[i]);
                }

                // shouldn't happen because button shouldn't show up if language isn't supported
                // but though if this occurs, don't try to play it
                // because there's no link
                if (!link) {
                    on_audio_stop_callback();
                    return;
                }

                ke.ext.audio.loadAudio(link, function (audio) {
                    audios.push(audio);

                    if (i === 0) {
                        ke.ext.audio.isPlaying = true;
                        startPlayingChunks(0);
                    }

                    loadAudios(i + 1);
                });
            };

            loadAudios(0);
        },

        stop: function () {
            ke.ext.audio.isPlaying = false;

            if (ke.ext.audio.player != null) {
                ke.ext.audio.player.pause();
                ke.ext.audio.player = null;
            }
        }
    });

})();