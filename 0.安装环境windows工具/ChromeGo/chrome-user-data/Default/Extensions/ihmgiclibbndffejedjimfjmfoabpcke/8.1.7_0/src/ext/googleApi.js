(function (undefined) {

    ke.import('ext.util.storageUtil');
    ke.import('ui_views.multi_variant');

    const MAX_STR_LEN = 1000; // per one request to the server

    const IPA_LANGS = "en,af,bs,ca,cs,da,de,el,eo,es,fi,fr,hr,hu,it,kn,ku,lv,"
        + "nl,pl,pt,ro,sk,sr,sv,sw,ta,tr,cy,grc,hi,hy,id,is,ka,la,mk,"
        + "no,sq,vi".split(",");

    const ARTICLES_LANGS = 'de,fr,it,pt-br,es'.split(',');

    const YANDEX_LANGS = {
        "zh-CN": "zh",
        "zh-TW": "zh",
        "jw": "jv",
        "iw": "he",
        "auto": "jv" // It does not have an "auto" language but it detects a lang if you supply a wrong one
    };

    Object.defineProperty(document, "referrer", {
        get: function () {
            return "https://deepl.com/translator";
        }
    });

    var positions = {
        '': 0,
        noun: 1,
        verb: 2,
        adjective: 3,
        adverb: 4,
        pronoun: 5,
        preposition: 6,
        conjunction: 7,
        interjection: 8,
        abbreviation: 9,
        phrase: 10,
        suffix: 11,
        auxiliaryverb: 12
    };

    var parts_of_speech = [];

    for (var key in positions) {
        parts_of_speech.push(key);
    }

    var yf = function (a, b) {
        for (var c = 0; c < b.length - 2; c += 3) {
            var d = b[c + 2];
            d = "a" <= d ? d.charCodeAt(0) - 87 : Number(d);
            d = "+" == b[c + 1] ? a >>> d : a << d;
            a = "+" == b[c] ? a + d & 4294967295 : a ^ d;
        }

        return a;
    };

    var tk = function (a) {
        var d = [];

        for (var f = 0, e = 0; f < a.length; ++f) {
            var g = a.charCodeAt(f);

            if (128 > g) {
                d[e++] = g;
            } else {
                if (2048 > g) {
                    d[e++] = g >> 6 | 192;
                } else {
                    d[e++] = g >> 12 | 224;
                    d[e++] = g >> 6 & 63 | 128;
                }
                d[e++] = g & 63 | 128;
            }
        }

        var b = 0;
        var tk = 0;

        for (e = 0; e < d.length; e++) {
            tk += d[e];
            tk = yf(tk, "+-a^+6");
        }

        tk = yf(tk, "+-3^+b+-f");

        if (0 > tk) {
            tk = (tk & 2147483647) + 2147483648;
        }
        tk %= 1E6;

        return tk.toString() + "." + (tk ^ b).toString();
    };

    const BING_AUTH_URL = "https://api.cognitive.microsoft.com/sts/v1.0/issueToken";
    const BING_ocpApimSubscriptionKeyHeader = "Ocp-Apim-Subscription-Key";
    const BING_KEY_ONE = "0484d3977728436681fc369e7a614a43";

    const YT_KEYS = "trnsl.1.1.20181102T213252Z.15973c8fd1497069.dfef0ce2d1d66c4b3a560986cfd349cc27adceef,trnsl.1.1.20181102T213332Z.79148d90f1c6e2d5.c05d93cb4000e5eb194a8cb0302a2577e1786456,trnsl.1.1.20181102T213412Z.b7d99cd224b50875.78b25ec3b559d218c468a15718d62aa9160a6775,trnsl.1.1.20181102T213431Z.541628d09094c1a3.ff27af10a741cd223c176acde97e02d088e5f924,trnsl.1.1.20181102T213450Z.93ccf977a373c675.e773350d58a6b56434efb4e1192683e45462d7e9,trnsl.1.1.20181102T213509Z.f880b66413c0aaf3.9571c4386c6aeb148626ba31ec284691dec1ccaf,trnsl.1.1.20181102T213527Z.eb68115e91aab47f.4da25db7117bff3b15b1dc06fababa6a3c3a8535,trnsl.1.1.20181102T213549Z.ae5a65262a8dcd37.6d7ca0bc28077563a22044c73982101d802110ce,trnsl.1.1.20181102T213613Z.0bad11f72f75fcfa.5a93be6a7aa651b1ef3a36f1fe4ca9af3ac7e32b,trnsl.1.1.20181102T213633Z.a390634b03f595d9.451e188304339141a5c73bcd8b5c25bc0afa4dd9,trnsl.1.1.20181102T213652Z.d9d75034bf77120a.1737bc1c6984c39aeccf2e3581077be809b09b45,trnsl.1.1.20181102T213710Z.8b323dc6d80bba83.f83adcebeaca98ce4445a3d0d328acb59fb577a4,trnsl.1.1.20181102T213729Z.d50920bce790c915.e87f433ef69c108970909acd514734b31556ca4b,trnsl.1.1.20181102T213749Z.3e2b20c226adc8f7.fa0e8f8179d9824864262c0df8d98a222bf06e95,trnsl.1.1.20181102T213808Z.9c3b0910f60f8844.d7a5174868016700c629708e491842a4ff7dfff4,trnsl.1.1.20181102T213936Z.7c005f281fd3959e.a88a3f0411a0b373f941de434e960ec512f1892b,trnsl.1.1.20181102T214014Z.c351b40bd641f99c.114eb8303466d0add7fbca0f7a661d75def7f4c9,trnsl.1.1.20181102T214042Z.77ed3fa8560a999d.9001ccdb59651617814c0720a35dfc1c4ca32bc1,trnsl.1.1.20181102T214151Z.8c6ed1edcf6b527c.7a505097fe32ea5711ff27d44fadd1f84d64e87f,trnsl.1.1.20181102T204954Z.06a524538afb5370.d7c3461460c2e788cb6f67da941b076d65ee49f4,trnsl.1.1.20181102T205629Z.8c5a5671b2c94734.1cebf2b46d03aa6f21a3aada2c6f0dea72b2bb7c,trnsl.1.1.20181102T205740Z.53924bf8bf038b66.1497238b25def89dc7ef38dc919556eb18419aee,trnsl.1.1.20181102T205833Z.6fa2c1193d34ae03.095847fc36981d0abbc9f2d08ff4f2209ce4cbc9,trnsl.1.1.20181102T205859Z.f48f25f673c18de8.2662ca40ff4d9276e19d1a751353976374eb5027,trnsl.1.1.20181102T205922Z.8fcd584cb97e7b7b.96635d8adeb31ac33d8af5f1b84b94bca7785a1b,trnsl.1.1.20181102T205943Z.c107053b80b3da23.33f28db3a836c230ab1fb2ec519c94e6b07f9375,trnsl.1.1.20181102T210007Z.3aba0562159ceb75.5ff0ac290dbd2d01a62023b130581f594c65bd62,trnsl.1.1.20181102T210030Z.48694ecb9d7aef4e.39aa18ca356b09014ce79c7b8cda4f56e7646f58,trnsl.1.1.20181102T210101Z.8ca38ca32d1eeae2.9cf56256c908fd101a9e0bceccaf2ffd729099c4,trnsl.1.1.20181102T210122Z.14226828ff16677d.e64bf54ba3da5fa26a43d522a979e11760cb878a,trnsl.1.1.20181102T210145Z.3ff15c7295b2dec4.252e06955b1265504be710c4871b1b829166f7e9,trnsl.1.1.20181102T210207Z.9c8d671f4e895030.90514dfd6b7cc782e3ff2bcbd046835a661106d1,trnsl.1.1.20181102T210233Z.acd76b1b0033dd87.f0d1034c8b9a9ebd5abd89a0beee582b34a3ee7a,trnsl.1.1.20181102T210309Z.084714f2e6d4c8d6.2113ff52f70e8edb8d15e5dc6b5edc04882d4847,trnsl.1.1.20181102T214252Z.c7d523a692f21cf9.f061c197cf868b9bb22fa1000ed73a131a87a241,trnsl.1.1.20181102T214324Z.68589c5b7b1beaca.4887133744773fe4890cd25061e8619d5817e545,trnsl.1.1.20181102T214351Z.a5f4ec70259dfcdd.e657e0c9a59f33274144633d7cf42475077afb67,trnsl.1.1.20181102T214416Z.cc1f850655586c0f.b6d2866d529d2e001a0318180bc7e9e715f0a5b5,trnsl.1.1.20181102T214444Z.24553e66aa23b466.be6804cb85f09c6f64c5c5f3a17720cf47dc9e86,trnsl.1.1.20181102T214947Z.dfd66bd7b21dd3af.275de56c2ea7a5109ddd1fbc43406a9f485cca65,trnsl.1.1.20181102T215052Z.ec57c48f3cb24691.54a8091b9c8f364af1a9277a7aeb642356476d87,trnsl.1.1.20181102T215122Z.af8710eead58551a.97f86308053dccb2d148577e2c023c0a13489b54,trnsl.1.1.20181102T215154Z.ae797e662ffc0055.af3030fcbd863a5cc71b24afd8a3122b5a6bc2b2,trnsl.1.1.20181102T215230Z.23c8ec80d3d564ee.0285f07c82e3d91e03c274b72d889701a7de7485,trnsl.1.1.20181102T215258Z.3d6142281267b1ee.ef871a7bae00682a9225f34f40c2084aa0cd1f51,trnsl.1.1.20181102T215327Z.b0324d3620775026.f61c65f8c6c31b2f45973397e86eeb4af8ef7bc9,trnsl.1.1.20181102T215356Z.e72ddaaa2e5d3029.fc6d21d8bf367760164caf2073be332b87e558c5,trnsl.1.1.20181102T215421Z.e7bb329825ab40c2.6b4368f077ab1f36aca314f1f5d3855de9b7ffb4,trnsl.1.1.20181102T215447Z.3d4324e2958136ff.8d6085bf3873f653c02d07433ad2f336de64c23f,trnsl.1.1.20181102T215517Z.c17384773f356575.be5756d5d3ede5b0823a865aa8b2a401d5b1cf8d,trnsl.1.1.20181102T215548Z.89db0ce5c7b3bef8.c8407a45bc8655af5ab12da309f504475756371b,trnsl.1.1.20181102T215618Z.c22f22948a0fdbd1.876a5521c7737b41b6a43ca9af0b66e3f8166ab6,trnsl.1.1.20181102T215641Z.fe52de1dc3618d73.740023052cbd6a0bc98bd5bf5ff05a55770350be,trnsl.1.1.20181102T215711Z.9c77c09515106e89.72841b56546a7f19ed8f77b27b91a6dee93a59b1,trnsl.1.1.20181102T215736Z.162caa5087e102a8.6f8bbfcf5ef76652dc6c1b3249c35fc7cd944d19,trnsl.1.1.20181102T215811Z.6e967911b314d9f2.040c8dc577ac16ddea33e33225a2b334b8fd0be3,trnsl.1.1.20181102T215859Z.467b4f132813ab8a.5c04bd040c0ddbccdb9fd1be799384e6826a5635,trnsl.1.1.20181102T220047Z.ad0e4a72ac465775.9f9a21610f30534627db70c35c2c1e453cbc7c36,trnsl.1.1.20181102T220117Z.09ce6c0292c9761c.8cc1dfc8f30b6c3bf30c8e356088ef2685f37d86".split(',');

    const BING_TRANSLATION_URL = "https://api.cognitive.microsofttranslator.com/translate?api-version=3.0";

    pl.extend(ke.ext.googleApi, {
        get MAX_TEXT_LEN() {
            return 20000;
        },

        get MAX_IPA_LEN() {
            return 100;
        },

        get IPA_LANGS() {
            return IPA_LANGS;
        },

        supportsArticles: function(lang) {
            return ARTICLES_LANGS.indexOf(lang) > -1;
        },

        getSourceTranslitFromJson: function(json) {
            return json[10] || json[11];
        },

        getTargetTranslitFromJson: function(json) {
            return json[2] || json[4];
        },

        getBingToken: function (callback) {
            var headers = {};
            headers[BING_ocpApimSubscriptionKeyHeader] = BING_KEY_ONE;

            $.ajax({
                url: BING_AUTH_URL,
                type: 'POST',
                headers: headers,
                success: function (token) {
                    callback(token);
                },
                error: function (e) {
                    callback(null);
                }
            });
        },

        googleLangsToBingLangs: function (lang) {
            lang = lang.replace("auto", "");
            lang = lang.replace("bs", "bs-Latn");
            lang = lang.replace("sr", "sr-Cyrl");
            lang = lang.replace("zh-TW", "zh-CHT");
            lang = lang.replace("zh-CN", "zh-CHS");
            lang = lang.replace("no", "nb");

            return lang;
        },

        getBingTranslation: function (from, to, text, fn) {
            ke.ext.googleApi.getBingToken(function (token) {
                if (!token) {
                    ke.ext.googleApi.getYandexTranslation(from, to, text, fn);
                    return;
                }

                from = ke.ext.googleApi.googleLangsToBingLangs(from);
                to = ke.ext.googleApi.googleLangsToBingLangs(to);

                var bing_from = from === ''
                    ? ''
                    : '&from=' + from;

                $.ajax({
                    url: BING_TRANSLATION_URL + '&to=' + to + bing_from,
                    type: 'POST',
                    //dataType: 'json',
                    contentType: 'application/json',
                    headers: {
                        'Authorization': 'Bearer ' + token
                    },
                    data: JSON.stringify([{
                        'Text': text
                    }]),
                    success: function (d) {
                        if (d) {
                            var translation = d[0].translations[0].text;

                            fn({
                                dict: [],
                                sentences: [{
                                    orig: text,
                                    trans: translation
                                }],
                                ld_result: {
                                    srclangs: [d[0].detectedLanguage ? d[0].detectedLanguage.language : '']
                                }
                            });
                        } else {
                            ke.ext.googleApi.getYandexTranslation(from, to, text, fn);
                        }
                    },
                    error: function (e) {
                        ke.ext.googleApi.getYandexTranslation(from, to, text, fn);
                    }
                });
            });
        },

        getYandexTranslation: function (from, to, text, fn) {
            from = YANDEX_LANGS[from] || from;
            to = YANDEX_LANGS[to] || to;

            let key = YT_KEYS[Math.floor(Math.random() * YT_KEYS.length)];

                $.ajax({
                    url: 'https://translate.yandex.net/api/v1.5/tr.json/translate',
                    type: 'GET',
                    dataType: 'json',
                    contentType: 'application/json',
                    headers: {
                        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
                    },
                    data: {
                        key: key,
                        format: 'plain',
                        options: 1,
                        lang: from + '-' + to,
                        text: text
                    },
                    success: function (d) {
                        console.log(d);
                        if (d.text) {
                            var translation = d.text[0];

                            fn({
                                dict: [],
                                sentences: [{
                                    orig: text,
                                    trans: translation
                                }],
                                ld_result: {
                                    srclangs: [d.detected.lang]
                                }
                            });
                        } else {
                            fn({
                                error: true
                            });
                        }
                    },
                    error: function (e) {
                        fn({
                            error: true
                        });
                    }
                });
        },

        getWordsInfo: function (words, fn) {
            var timeout = null;

            //console.time('get_words_info');
            //console.log('server:', ke.ext.util.storageUtil.getVal('misc_server'));
            //console.log(words);

            var xhr = $.ajax({
                url: ke.ext.util.storageUtil.getVal('misc_server') + '/v3/get_words_info',
                type: 'POST',
                dataType: 'json',
                data: JSON.stringify({
                    words: words
                }),
                success: function (d) {
                    if (timeout !== null) clearTimeout(timeout);
                    //console.timeEnd('get_words_info');
                    fn(d);
                },
                error: function (e) {
                    if (timeout !== null) clearTimeout(timeout);
                    //console.timeEnd('get_words_info');
                    console.log(e);
                    fn({words_info: null});
                }
            });

            timeout = setTimeout(function () {
                xhr.abort();
            }, 1000);
        },

        getGoogleOldTranslation: function (from, to, text, fn) {
            $.ajax({
                url: 'http://clients5.google.com/translate_a/t',
                type: 'GET',
                dataType: 'json',
                headers: {
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
                },
                data: {
                    client: 'dict-chrome-ex',
                    q: text,
                    sl: from,
                    tl: to,
                    tbb: 1,
                    ie: 'UTF-8',
                    oe: 'UTF-8',
                    hl: 'en'
                },
                success: function (d) {
                    fn(d);
                },
                error: function (e) {
                    console.log('Error while translating with Google:', e);
                    console.log('Trying with Bing...');

                    ke.ext.googleApi.getBingTranslation(from, to, text, fn);
                }
            });
        },

        getTextTranslation: function (from, to, text, fn) {
            var chunks = ke.ext.string.chunkate(text, MAX_STR_LEN);
            var translations = new Array(chunks.length);

            var translateChunk = function (i) {
                if (i >= chunks.length) {
                    var response = translations[0];
                    var has_translit = typeof response.sentences[response.sentences.length - 1].translit != "undefined";

                    for (var i = 1, len = translations.length, k = has_translit ? 1 : 0; i < len; ++i) {
                        for (var j = 0; j < translations[i].sentences.length - k; ++j) {
                            response.sentences[response.sentences.length - 1 - k].orig +=
                                " " + translations[i].sentences[j].orig;

                            var whitespace = "";
                            if (j === 0 || (j > 0 && translations[i].sentences[j - 1].trans[translations[i].sentences[j - 1].trans.length - 1] !== " ")) {
                                whitespace = " ";
                            }

                            response.sentences[response.sentences.length - 1 - k].trans +=
                                whitespace + translations[i].sentences[j].trans;
                        }

                        if (has_translit) {
                            response.sentences[response.sentences.length - 1].translit +=
                                " " + translations[i].sentences[translations[i].sentences.length - 1].translit;
                        }
                    }

                    fn(response);

                    return;
                }

                ke.ext.googleApi.getTranslation(from, to, chunks[i], function (response) {
                    if (response.error) {
                        fn(response);
                    } else {
                        translations[i] = response;
                        translateChunk(i + 1);
                    }
                });
            };

            translateChunk(0);
        },

        getTranslation: function (from, to, text, fn) {
            from = from || 'auto';

            //
            // Use Yandex for Chinese users in first hand
            //if (true || ke.ext.util.storageUtil.getVal('user_country') === 'cn') {
                //ke.ext.googleApi.getBingTranslation(from, to, text, fn);
            //} else {
                //
                // Google - Google - Microsoft - Baidu otherwise
                $.ajax({
                    url: 'https://translate.googleapis.com/translate_a/single?dt=t&dt=bd&dt=qc&dt=rm&dt=ex',
                    type: 'GET',
                    dataType: 'json',
                    headers: {
                        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
                    },
                    data: {
                        client: 'gtx',
                        hl: 'en',
                        sl: from,
                        tl: to,
                        q: text,
                        dj: 1,
                        tk: tk(text)
                    },
                    success: function (d) {
                        fn(d);
                    },
                    error: function (e) {
                        console.log('Error while translating with Google:', e);
                        console.log('Trying with older GApi...');

                        ke.ext.googleApi.getGoogleOldTranslation(from, to, text, fn);
                    }
                });
            //}
        },

        /*getIPA: function (text, lang, fn) {
            var timeout = null;
            var xhr = $.ajax({
                url: 'https://' + getIPAServer() + '/v2/get_ipa',
                type: 'GET',
                dataType: 'json',
                headers: {},
                data: {
                    lang: lang,
                    text: text
                },
                success: function (d) {
                    if (timeout !== null) clearTimeout(timeout);
                    fn(d);
                },
                error: function (e) {
                    if (timeout !== null) clearTimeout(timeout);
                    fn({ipa: null});
                }
            });

            timeout = setTimeout(function () {
                xhr.abort();
            }, 1000);
        },*/

        // remove doubling commas
        // ,, => ,0,
        // [, => [0,
        // ,] => ,0]
        parseResponse: function (r) {
            return r
                .replace(/(\,\,)/g, ',"",')
                .replace(/\[\,/g, '["",')
                .replace(/\,\]/g, ',""]');
        },

        getAudioFileLink: function (lang, text) {
            return ke.app.tts_link
                .replace('{{domain}}', ke.app.getCountry())
                .replace('{{text}}', encodeURIComponent(text))
                .replace('{{lang}}', lang)
                .replace('{{textparts}}', text.split(' ').length)
                .replace('{{textlen}}', text.length)
                .replace('{{dictation_speed}}', '0.5');
        },

        getBingAudioFileLink: function (lang, text) {
            if (lang === 'iw') {
                lang = 'he';
            }

            return "https://www.bing.com/tspeak?&format=audio%2Fmp3&language={{lang}}&IG=D5DFBE5EEA97455182D4DEA272551DCD&IID=translator.5036.43&text={{text}}"
                .replace('{{text}}', encodeURIComponent(text))
                .replace('{{lang}}', lang);
        },

        getTranslationPageLink: function (text, from, to) {
            return 'https://translate.google.' + ke.app.getCountry() + '/#%from%|%to%|%text%'
                .replace(/%from%/, from || ke.ext.util.langUtil.getFromLang())
                .replace(/%to%/, to || ke.ext.util.langUtil.getToLang())
                .replace(/%text%/, text);
        },

        getPartOfSpeechByIndex: function (index) {
            return parts_of_speech[index];
        },

        getInternalJSONFormat: function (output, original) {
            var res = typeof(output) == 'object' ? output : JSON.parse(this.parseResponse(output));

            if (typeof res[0] == 'boolean') {
                return res;
            }

            var translations = [
                false,  // 0 - is multi
                '',     // 1 - original
                '',     // 2 - original translit
                '',     // 3 - translation
                '',     // 4 - translit for translation
                '',     // 5 - from lang
                '',     // 6 - to lang
                [
                    [], // no category
                    [], // nouns
                    [], // verbs
                    [], // adjectives
                    [], // adverbs
                    [], // pronouns
                    [], // prepositions
                    [], // conjunctions
                    [], // interjections
                    [], // abbreviations
                    [], // Phrases
                    [], // Suffixes
                    []  // Auxiliary Verbs
                ],
                '',     // 8 - original gender
                '',     // 9 - translated gender
                '',     // 10 - original ipa
                '',     // 11 - translation ipa
            ];

            if (pl.type(res, 'arr') && res[0].Alignment != undefined) {
                translations[0] = false;
                translations[1] = original;
                translations[2] = "";
                translations[3] = res[0].TranslatedText;
                translations[4] = "";
                translations[5] = res[0].From;
            } else if (res.dict || pl.type(res[1], 'arr')) {
                if (res.dict) {
                    translations[0] = true;
                    translations[1] = res.sentences[0].orig;
                    translations[2] = (res.sentences[1] || {}).src_translit || '';
                    translations[3] = res.sentences[0].trans;
                    translations[4] = (res.sentences[1] || {}).translit || '';
                    translations[5] = res.ld_result.srclangs[0];
                    //translations[5] = res.ld_result.srclangs[0];

                    pl.each(res.dict, function (k, v) {
                        pl.each(v.entry, function (k2, v2) {
                            var item = [
                                v2.word,
                                v2.reverse_translation
                            ];

                            if (typeof v2.previous_word == 'string') {
                                item.push(v2.previous_word);
                            } else {
                                item.push('');
                            }

                            translations[7][positions[v.pos.toLowerCase().replace(' ', '')] || 0].push(item);
                        });
                    });
                } else {
                    translations[0] = true;
                    translations[1] = res[0][0][1];
                    translations[2] = (res[0][1] ? res[0][1][0] : '') || '';
                    translations[3] = res[0][0][1];
                    translations[4] = (res[0][1] ? res[0][1][1] : '') || '';
                    translations[5] = res[2];

                    pl.each(res[1], function (k, v) {
                        pl.each(v[2], function (k2, v2) {
                            var item = [
                                v2[0],
                                v2[1]
                            ];

                            if (typeof v2[3] == "string") {
                                item.push(v2[3]);
                            } else {
                                item.push('');
                            }

                            translations[7][positions[v[0]] || 0].push(item);
                        });
                    });
                }
            } else {
                if (typeof res.sentences == 'object') {
                    for (var i = 0, len = res.sentences.length; i < len; ++i) {
                        if (res.sentences[i].orig) {
                            translations[1] += res.sentences[i].orig;
                        }
                        if (res.sentences[i].trans) {
                            translations[3] += res.sentences[i].trans;
                        }
                    }

                    // transliteration for the original
                    translations[11] = (res.sentences[res.sentences.length - 1] || {}).src_translit || '';

                    // transliteration for the translation
                    translations[4] = (res.sentences[res.sentences.length - 1] || {}).translit || '';

                    translations[0] = false;
                    translations[5] = res.ld_result.srclangs[0];
                } else {
                    translations[0] = false;
                    translations[1] = res[0][0][1];
                    translations[2] = (res[0][1] ? res[0][1][0] : '') || '';
                    translations[3] = res[0][0][0];
                    translations[4] = (res[0][1] ? res[0][1][1] : '') || '';
                    translations[5] = res[1];
                }
            }

            return translations;
        },

        // According to current settings (a single word/phrase or a bunch of variants)
        parseReceivedTranslation: function (json, mainAndVariantsSeparately, prefix, locales, complexSingle) {
            if (json[0]) {
                var response = [json[0], ke.ui_views.multi_variant.wrap(true, json, mainAndVariantsSeparately, prefix, locales)];
                if (mainAndVariantsSeparately) {
                    var tmp = response;
                    response = [tmp[0], json[3], tmp[1]];
                    delete tmp;
                }

                return response;
            } else {
                return [false, ke.ui_views.multi_variant.wrap(false, json, mainAndVariantsSeparately, prefix, locales, complexSingle)];
            }
        }
    });

})();
