/* Kumquat Hub History Handlers
 * 
 **/

(function (undefined) {

    var search_timeout = null;

    // in free version of Mate
    const MAX_WORDLIST_COUNT = 1;

    pl.extend(ke.app.handlers, {
        _processEventHandlers: {
            app: {
                audio: {}
            }
        },

        addWordlist: function () {
            var name = ke.app.$new_wordlist_name.val();
            var lang_from = ke.ui.dropdown.getActiveOptionValue(1);
            var lang_to = ke.ui.dropdown.getActiveOptionValue(2);

            if (pl.empty(name) || pl.empty(lang_from) || pl.empty(lang_to)) {
                return;
            }

            var last_update = Date.now();

            ke.idb.add('it', 'wordlists', {
                from: lang_from,
                to: lang_to,
                name: name,
                last_update: last_update,
                created: last_update,
                phrases_count: 0,
                server_id: null,
                pending_removal: false
            }, 'wordlist', function (new_wordlist_id, new_wordlist) {
                var phrases_count = 0;

                if (ke.app.temp.word_pending_adding) {
                    chrome.runtime.sendMessage({
                        action: ke.processCall('app', 'phrasebook', 'addPhrase'),
                        wl_id: new_wordlist_id,
                        phrase: ke.app.temp.word_pending_adding,
                        from: ke.app.temp.current_wordlist_from_lang,
                        to: ke.app.temp.current_wordlist_to_lang
                    }, function (data) {
                        ke.app.temp.word_pending_adding = '';
                    });

                    ++phrases_count;
                }

                ke.app.render.organize.drawWordlist({
                    id: new_wordlist_id,
                    from: lang_from,
                    to: lang_to,
                    name: name,
                    last_update: last_update,
                    phrases_count: phrases_count
                }, undefined, true);

                $('.wl-' + new_wordlist_id).click();

                ke.app.$new_wordlist_name.val('');
                ke.app.handlers.onWordlistAddClose();
                ke.app.handlers.toggleEmptyWordlistsCap();

                chrome.runtime.sendMessage({
                    action: ke.processCall('app', 'sync', 'uploadWordlist'),
                    id: new_wordlist_id,
                    wordlist: new_wordlist
                }, function () {
                });

                if (typeof ga != "undefined") ga('send', 'event', 'pb', 'wl-create');
            });
        },

        addPhrase: function () {
            var phrase = ke.app.$add_phrase_input.val();

            if (pl.empty(phrase)) {
                return;
            }

            if (!navigator.onLine) {
                alert(ke.getLocale('Pb_NoInternet'));
                return;
            }

            ke.app.$add_phrase_button.hide();
            ke.app.$add_phrase_loading.show();

            chrome.runtime.sendMessage({
                action: ke.processCall('app', 'phrasebook', 'addPhrase'),
                wl_id: ke.app.temp.current_wordlist_id,
                phrase: phrase,
                from: ke.app.temp.current_wordlist_from_lang,
                to: ke.app.temp.current_wordlist_to_lang
            }, function (data) {
                if (data.no_results) {
                    alert(ke.getLocale('Kernel_NoResults'));

                    ke.app.$add_phrase_loading.hide();
                    ke.app.$add_phrase_button.show();

                    return;
                }

                ke.app.render.organize.drawPhrase(data, 'prepend');

                ke.app.$add_phrase_loading.hide();
                ke.app.$add_phrase_button.show();
                ke.app.$add_phrase_input.val('');
                ke.app.handlers.toggleEmptyPhrasesCap();

                if (typeof ga != "undefined") ga('send', 'event', 'pb', 'phrase-add');
            });
        },

        onEnterAddPhrase: function (event) {
            if (event.keyCode === 13 && ke.ext.event.isDown('enter', ke.ext.event.IN_STR)) {
                ke.app.handlers.addPhrase();
            }
        },

        onWordlistAddLangDropdownOpen: function (elem_index, ot) {
            if(ke.is_touch_device()) return;

            ke.particles.scrollbars.model.setupFromWindowDropdownScroll(ot);
            ke.particles.scrollbars.model.setupToWindowDropdownScroll(ot);
        },

        onWordlistAddLangDropdownChange: function (serial, v, prev_val, skipTranslation) {
            if (serial === 1) {
                ke.app.temp.new_wordlist_from_lang = v;
            } else if (serial === 2) {
                ke.app.temp.new_wordlist_to_lang = v;
            }

            ke.app.initDropdown();
        },

        onWordlistAddLangSwap: function () {
            var from = ke.ui.dropdown.getActiveOptionValue(1);
            var to = ke.ui.dropdown.getActiveOptionValue(2);

            ke.ui.dropdown.data.callback(1, to, null, true);
            ke.ui.dropdown.data.callback(2, from, null, false);

            ke.app.initDropdown();
        },

        onWordlistAdd: function (event) {
            var wordlist_count = $('.wordlist').length;

            ke.ext.util.storageUtil.requestBackgroundOption('isTrueOption', ['chr_pro_flag'], function (is_pro) {
                if (!is_pro && wordlist_count >= MAX_WORDLIST_COUNT) {
                    ke.ui.pro_alert.show(ke.getLocale('Pro_PhrasebookFeature'), 'phrasebook');
                } else {
                    $('.new-wordlist-layout').fadeIn(250).css('display', 'flex');

                    if (typeof ga != "undefined") ga('send', 'event', 'pb', 'new-wl-popup-show');
                }
            });
        },

        onWordlistAddOuterClose: function (event) {
            if ($(event.target).hasClass('popup-layout')) {
                ke.app.handlers.onWordlistAddClose();
                ke.app.handlers.onUpgradeClose();
            }
        },

        onWordlistAddClose: function () {
            $('.new-wordlist-layout').hide();
        },

        onUpgradeClose: function () {
            $('.upgrade-layout').hide();

            if (typeof ga != "undefined") ga('send', 'event', 'pb', 'upgrade-close');
        },

        onWordlistOpen: function (event) {
            var id = $(this).attr('id');
            ke.ui.loading.show(function () {
                document.location.hash = 'wl-' + id;
            });
        },

        onWordlistQuit: function (event) {
            if (ke.app.view_mode === ke.app.VM_ITEM) {
                ke.app.view_mode = ke.app.VM_WORDLIST;

                $('body').removeClass('phrase-view-mode');
                $('body').addClass('wl-view-mode');

                $('.expanded').hide();
                $('.phrases').show();
            } else {
                document.location.hash = '';
            }

            $('.search-input').val('');
        },

        onWordlistDelete: function (event) {
            event.stopPropagation();

            var id = +$(this).attr('id');
            var that = this;

            var sure = confirm(ke.getLocale('Pb_SureToDeleteWordlist'));

            if (!sure) {
                return;
            }

            ke.ext.util.storageUtil.requestBackgroundOption('getVal', ['account_token'], function (token) {
                if (token) {
                    ke.idb.update('it', 'wordlists', id, {
                        pending_removal: true
                    }, function (wordlist, id) {
                        ke.idb.findAndUpdate('it', 'phrases', {
                            parent_wordlist_key: id
                        }, {
                            pending_removal: true
                        }, function (updated_phrases) {
                            $(that).parent().remove();

                            --ke.app.temp.wl_amount;
                            ke.app.handlers.toggleEmptyWordlistsCap();

                            chrome.runtime.sendMessage({
                                action: ke.processCall('app', 'sync', 'deleteWordlist'),
                                r_wl: true,
                                wl_id: id,
                                wl_server_id: wordlist.server_id,
                                words: updated_phrases
                            });

                            if (typeof ga != "undefined") ga('send', 'event', 'pb', 'wl-delete');
                        });
                    });
                } else {
                    ke.idb.del('it', 'wordlists', [id], function (ok) {
                        ke.idb.findAndDel('it', 'phrases', {
                            parent_wordlist_key: id
                        }, function () {
                            $(that).parent().remove();

                            --ke.app.temp.wl_amount;
                            ke.app.handlers.toggleEmptyWordlistsCap();

                            if (typeof ga != "undefined") ga('send', 'event', 'pb', 'wl-delete');
                        });
                    });
                }
            });
        },

        onPhrasePreview: function (event) {
            ke.app.view_mode = ke.app.VM_ITEM;

            $('body').removeClass('wl-view-mode');
            $('body').addClass('phrase-view-mode');

            $('.phrases').hide();
            $('.expanded')
                .html($(this).html())
                .show();

            var from = ke.app.temp.current_wordlist_from_lang;
            var to = ke.app.temp.current_wordlist_to_lang;
            var $context = $('.expanded');

            ke.particles.listen.model.ctrlHistoryOrigVisibility(null, from, $context);
            ke.particles.listen.model.ctrlHistoryTransVisibility(null, to, $context);
            ke.particles.listen.model.ctrlSynonymVis(null, to, $context);

            $('.expanded').find('.listen-selector, .listen-v-item').on('click', ke.app.handlers.onPhrasePlayback);
            $('.expanded').find('.copy-button').on('click', ke.particles.three_dots.model.copyMain);
            $('.expanded').find('.small-copy-button').on('click', ke.particles.three_dots.model.copySynonym);

            if (typeof ga != "undefined") {
                ga('send', 'event', 'pb', 'phrase-preview');
            }
        },

        onPhraseDelete: function (event) {
            event.stopPropagation();

            var id = +$(this).attr('id');
            var pid = +$(this).attr('pid');
            var that = this;

            ke.ext.util.storageUtil.requestBackgroundOption('getVal', ['account_token'], function (token) {
                if (token) {
                    ke.idb.update('it', 'phrases', id, {
                        pending_removal: true
                    }, function (phrase, id) {
                        ke.idb.update('it', 'wordlists', pid, {
                            last_update: Date.now(),
                            phrases_count: {update_type: ke.idb.ARITH_ADD_UPDATE_TYPE, value: (-1)}
                        }, function (wordlist) {
                            $(that).parent().remove();

                            --ke.app.temp.phrases_amount;
                            ke.app.handlers.toggleEmptyPhrasesCap();

                            chrome.runtime.sendMessage({
                                action: ke.processCall('app', 'sync', 'deleteWordlist'),
                                r_wl: false,
                                wl_id: pid,
                                wl_server_id: wordlist.server_id,
                                words: [phrase]
                            });

                            if (typeof ga != "undefined") ga('send', 'event', 'pb', 'phrase-delete');
                        });
                    });
                } else {
                    ke.idb.del('it', 'phrases', [id], function (phrase, id) {
                        ke.idb.update('it', 'wordlists', pid, {
                            last_update: Date.now(),
                            phrases_count: {update_type: ke.idb.ARITH_ADD_UPDATE_TYPE, value: (-1)}
                        }, function () {
                            $(that).parent().remove();

                            --ke.app.temp.phrases_amount;
                            ke.app.handlers.toggleEmptyPhrasesCap();

                            if (typeof ga != "undefined") ga('send', 'event', 'pb', 'phrase-delete');
                        });
                    });
                }
            });
        },

        getPlaybackContents: function (source, $where) {
            var $where = $where || $('.expanded');

            if (source === 'orig') {
                return $where.find('.p-orig').html();
            } else if (source === 'trans') {
                return $where.find('.p-trans').html();
            } else if (source === 'synonym') {
                return $where.find('.main-of-item').html();
            }

            return '';
        },

        onPhrasePlayback: function (event) {
            event.stopPropagation();

            var is_orig = $(this).hasClass('listen-original');
            var is_synonym = $(this).hasClass('listen-v-item');
            var phrase;

            if (is_synonym) {
                phrase = ke.app.handlers.getPlaybackContents('synonym', $(this).parent());
            } else if (is_orig) {
                phrase = ke.app.handlers.getPlaybackContents('orig');
            } else {
                phrase = ke.app.handlers.getPlaybackContents('trans');
            }

            var $context = $(this).parent().parent();

            if (is_synonym) {
                ke.particles.listen.model.playPhrasebookSynonym.call($(this), phrase, ke.app.temp.current_wordlist_to_lang, $context);
            } else {
                if (is_orig) {
                    ke.particles.listen.model.playPhrasebookOriginal.call($(this), phrase, ke.app.temp.current_wordlist_from_lang, $context);
                } else {
                    ke.particles.listen.model.playPhrasebookTrans.call($(this), phrase, ke.app.temp.current_wordlist_to_lang, $context);
                }
            }

            if (typeof ga != "undefined") ga('send', 'event', 'pb', 'tts');
        },

        onHashChange: function (event) {
            if (pl.empty(document.location.hash) || document.location.hash.indexOf('wl_create') > -1) {
                ke.app.view_mode = ke.app.VM_WORDLISTS;

                $('body').removeClass('wl-view-mode');

                $('.search').hide();

                ke.app.$phrases
                    .html('')
                    .hide();
                ke.app.$wordlists
                    .html('')
                    .show();
                ke.app.$add_wordlist_button.show();
                ke.app.$quit_wordlist_button.hide();
                ke.app.$add_phrase_layout.hide();
                ke.app.$page_name.html(ke.getLocale('Kernel_PhrasebookTitle'));
                $('.export-button').hide();
                $('.right-action-buttons .sync-button').hide();
                $('.left-action-buttons').show();
                $('.learn-button').hide();
            } else {
                ke.app.view_mode = ke.app.VM_WORDLIST;

                $('body').addClass('wl-view-mode');

                if (ke.app.temp.phrases_amount > 0) {
                    // .show() was assigning it block which is bad
                    $('.search').css('display', 'inline-block');

                    ke.ext.util.storageUtil.requestBackgroundOption('isTrueOption', ['sync'], function (sync) {
                        if (sync) {
                            $('.search').addClass('search-shifted-left');
                        }
                    });
                }

                ke.app.$wordlists
                    .html('')
                    .hide();
                ke.app.$phrases
                    .html('')
                    .show();
                ke.app.$add_phrase_input.val('');
                ke.app.$add_wordlist_button.hide();
                ke.app.$quit_wordlist_button.show();
                ke.app.$add_phrase_layout.show();
                $('.export-button').show();
                $('.right-action-buttons .sync-button').show();
                $('.left-action-buttons').hide();
                $('.learn-button').show();
            }

            ke.app.render.organize.tryShowingWordlist();
        },

        toggleEmptyWordlistsCap: function (is_search) {
            if (ke.app.temp.wl_amount === 0) {
                $('.content-wrap').hide();

                if (is_search) {
                    ke.app.$ec_wrap
                        .addClass('w-search-layout')
                        .show()
                        .find('.ec-text')
                        .html(ke.getLocale('CommonUi_NoResults'));

                    ke.app.$ec_wrap
                        .find('.empty-phrasebook,.empty-wordlist')
                        .hide();
                } else {
                    $('.search-layout').hide();

                    ke.app.$ec_wrap
                        .find('.empty-phrasebook,.empty-wordlist')
                        .hide();

                    ke.app.$ec_wrap
                        .removeClass('w-search-layout')
                        .show()
                        .find('.ec-inside-layout')
                        .hide();

                    ke.app.$ec_wrap
                        .find('.empty-phrasebook')
                        .show();
                }
            } else {
                $('.content-wrap').show();
                $('.search-layout').show();

                ke.app.$ec_wrap.hide();
            }
        },

        toggleEmptyPhrasesCap: function (is_search) {
            if (ke.app.temp.phrases_amount === 0) {
                if (is_search) {
                    //$('.add-phrase-layout').show();
                    //$('.search-layout').hide();
                    //$('.search').hide();
                    $('.export-button').hide();
                    $('.content-wrap').hide();

                    ke.app.$ec_wrap
                        .addClass('w-search-layout')
                        .show()
                        .find('.ec-text')
                        .html(ke.getLocale('CommonUi_NoResults'));

                    ke.app.$ec_wrap
                        .find('.empty-phrasebook,.empty-wordlist')
                        .hide();
                } else {
                    $('.add-phrase-layout').show();
                    $('.export-button').hide();
                    $('.search-layout').hide();
                    $('.search').hide();
                    $('.content-wrap').hide();

                    ke.app.$ec_wrap
                        .find('.empty-phrasebook,.empty-wordlist')
                        .hide();

                    ke.app.$ec_wrap
                        .removeClass('w-search-layout')
                        .show()
                        .find('.ec-inside-layout')
                        .hide();

                    ke.app.$ec_wrap
                        .find('.empty-wordlist')
                        .show();

                    $('.learn-button').hide();
                }
            } else {
                if (ke.app.flags.is_searching) {
                    $('.add-phrase-layout').hide();
                    $('.search').hide();
                    $('.search-layout').show();
                    $('.export-button').hide();
                } else {
                    $('.search-layout').hide();
                    $('.search').show();
                    $('.add-phrase-layout').show();
                    $('.export-button').show();
                    $('.learn-button').show();
                }

                $('.content-wrap').show();

                ke.app.$ec_wrap.hide();
            }
        },

        toggleSearchMode: function () {
            if (ke.app.view_mode !== ke.app.VM_WORDLIST) {
                return;
            }

            if (ke.app.flags.is_searching) {
                ke.app.flags.is_searching = false;

                $('.right-action-buttons .sync-button').show();
                $('.export-button').show();
                $('.search-layout').hide();
                $('.search').show();
                $('.add-phrase-layout').show();
                $('.learn-button').show();
            } else {
                ke.app.flags.is_searching = true;

                $('.right-action-buttons .sync-button').hide();
                $('.export-button').hide();
                $('.add-phrase-layout').hide();
                $('.search').hide();
                $('.search-layout').show();
                $('.learn-button').hide();
            }
        },

        clearSearch: function () {
            $('.search-input').val('');
            ke.app.handlers.search(null, '');
        },

        search: function (event, input) {
            var val = pl.type(input, 'undef') ? $(this).val() : input;

            if (pl.empty(val)) {
                $('.clear-input-tick').hide();
            } else {
                $('.clear-input-tick').show();
            }

            if (search_timeout !== null) {
                clearTimeout(search_timeout);
            }

            search_timeout = setTimeout(function () {
                search_timeout = null;

                if (ke.app.view_mode === ke.app.VM_WORDLISTS) {
                    // search thru wordlists

                    $('.wordlists').html('');
                    ke.app.render.organize.populateWordlists(function () {
                    }, val);
                } else if (ke.app.view_mode === ke.app.VM_WORDLIST) {
                    // search thru phrases

                    $('.phrases').html('');
                    ke.app.render.organize.populatePhrases(ke.app.temp.current_wordlist_id, val, function () {
                    });
                }
            }, 750);
        },

        sync: function () {
            ke.particles.sync.ui_model.sendSyncRequest('syncPhrasebook', function (is_success, add_rm_changes) {
                if (is_success && add_rm_changes) {
                    ke.ui.loading.show();

                    setTimeout(function () {
                        ke.app.handlers.onHashChange();
                    }, 250);
                }
            }, ke.getLocale('Pro_SyncFeature'), $('.sync-button'));
        },

        downloadWordlistAsCSV: function () {
            var $that = $(this);

            ke.ext.util.storageUtil.requestBackgroundOption('isTrueOption', ['chr_pro_flag'], function (is_pro) {
                if (!is_pro) {
                    ke.ui.pro_alert.show(ke.getLocale('Pro_ExportFeature'), 'wordlist-export');
                } else {
                    if (typeof ga != "undefined") ga('send', 'event', 'pb', 'export-wordlist');

                    $that.addClass('downloading');

                    ke.idb.search('it', 'phrases', function (item) {
                        return !item.pending_removal
                            && item.parent_wordlist_key === ke.app.temp.current_wordlist_id;
                    }, function (items) {
                        var raw_rows = [[
                            ke.getLocale('Csv_TimeDate'),
                            ke.getLocale('Csv_Input'),
                            ke.getLocale('Csv_Translation'),
                            ke.getLocale('Csv_Transliteration'),
                            ke.getLocale('Csv_Synonyms')
                        ]];

                        items.forEach(function (v) {
                            var synonyms = [];

console.log(v.json)

                            v.json[7].forEach(function (__) {
                                __.forEach(function (sv) {
                                    synonyms.push(sv[0]);
                                });
                            });

                            raw_rows.push([
                                '"' + ke.ext.time.beautify(v.added) + '"',
                                '"' + v.text + '"',
                                '"' + v.translation + '"',
                                '"' + v.json[4] + '"',
                                '"' + synonyms.join(', ') + '"'
                            ]);
                        });

                        ke.ext.file.downloadAsCSV(raw_rows, function () {
                            $that.removeClass('downloading');
                        });
                    });
                }
            });
        },

        subscribeForReji: function (platform) {
            var email = $('.' + platform + '-email').val();

            if (!ke.ext.string.isValidEmail(email)) {
                alert("Doesn't look like a valid email!");
                return;
            }

            $.ajax({
                url: 'https://reji.me/api/android_subscribe',
                type: 'GET',
                dataType: 'json',
                data: {
                    email: email,
                    platform: platform === 'android' ? platform : ke.PLATFORM_CODE,
                    deck_url_id: ke.app.temp.shared_list_id
                },
                success: function (r) {
                    if (r.success) {
                        alert("It's all set! We'll notify you when Reji comes out!");
                        $('.share-wordlist').fadeOut(250);

                        if (typeof ga != "undefined") ga('send', 'event', 'pb', 'subscribe-reji', platform);
                    }
                }
            });
        },

        showAndroidForm: function () {
            $('.ios-contents').slideUp(250, function () {
                $('.android-contents').slideDown(250);
            });

            $('.request-android').on('click', function () {
                ke.app.handlers.subscribeForReji('android');
            });
        },

        showChromeForm: function () {
            $('.ios-contents').slideUp(250, function () {
                $('.android-contents').slideDown(250);
            });

            $('.request-chrome').on('click', function () {
                ke.app.handlers.subscribeForReji('chrome');
            });
        },

        learnWordlist: function () {
            if ($(this).hasClass('share-loading')) {
                return;
            }

            $('.select-learn-langs-layout').css('display', 'flex').fadeIn(250);

            $('.learn-from-lang')
                .html(ke.getLocale('Kernel_Lang_' + ke.ext.util.langUtil.getLangNameByKey(ke.app.temp.current_wordlist_from_lang)))
                .on('click', function () {
                    ke.app.handlers.learnWordlistFor('from');
                });

            $('.learn-to-lang')
                .html(ke.getLocale('Kernel_Lang_' + ke.ext.util.langUtil.getLangNameByKey(ke.app.temp.current_wordlist_to_lang)))
                .on('click', function () {
                    ke.app.handlers.learnWordlistFor('to');
                });

            $('.learn-cancel').on('click', function () {
                $('.select-learn-langs-layout').fadeOut(250);
            });
        },

        learnWordlistFor: function (dir) {
            $('.select-learn-langs-layout').fadeOut(250);

            $(this).addClass('share-loading').html(ke.getLocale('Pb_Loading'));

            if (!ke.ext.util.storageUtil.isTrueOption('learn_onboarding')) {
                $('.onboarding-contents').show();
                $('.ios-contents').hide();
                $('.proceed-learn-onboarding').on('click', function () {
                    $('.onboarding-contents').slideUp(250, function () {
                        $('.ios-contents').slideDown(250);
                    });
                });

                ke.ext.util.storageUtil.setVal('learn_onboarding', true);
            } else {
                $('.onboarding-contents').hide();
                $('.android-contents').hide();
                $('.chrome-contents').hide();
                $('.ios-contents').show();
            }

            $('.share-close').on('click', function () {
                $('.share-wordlist').fadeOut(250);
            });

            var $that = $(this);

            ke.idb.search('it', 'phrases', function (item) {
                return !item.pending_removal
                    && item.parent_wordlist_key === ke.app.temp.current_wordlist_id;
            }, function (items) {
                var wordlist_as_string = [];

                items.forEach(function (v) {
                    var example = v.usageExample
                        ? '\n' + v.usageExample
                        : '';

                    var original = v.text;
                    var trans = v.translation;

                    if (dir === 'to') {
                        var t = original;
                        original = trans;
                        trans = t;
                    }

                    wordlist_as_string.push(original + '\n' + trans + example);
                });

                var from = ke.app.temp.current_wordlist_from_lang;
                var to = ke.app.temp.current_wordlist_to_lang;

                if (dir === 'to') {
                    var t = to;
                    to = from;
                    from = t;
                }

                console.log(wordlist_as_string.join('\n\n'));

                $.ajax({
                    url: 'https://reji.me/api/share_deck_raw',
                    type: 'POST',
                    processData: false,
                    contentType: 'application/json',
                    data: JSON.stringify({
                        name: ke.app.$page_name.html(),
                        type: 'translation',
                        from: from,
                        to: to,
                        raw_data: wordlist_as_string.join('\n\n')
                    }),
                    success: function (r) {
                        if (r.short_link) {
                            ke.app.temp.shared_list_id = r.url_id;

                            if (typeof ga != "undefined") ga('send', 'event', 'pb', 'export-reji', 'success');

                            var color = "rgba(0, 0, 0, 1.0)";

                            if ($('body').hasClass('dark-mode')) {
                                // light colors aren't perceived by iphone camera for some reason
                                color = "#000";
                            }

                            $('.qr-code').html('');

                            $('.deck-link')
                                .attr('href', r.short_link)
                                .html(r.short_link);

                            new QRCode($('.qr-code')[0], {
                                text: r.firebase_link,
                                width: 192,
                                height: 192,
                                colorDark: color,
                                colorLight: "rgba(0, 0, 0, 0.0)",
                                correctLevel: QRCode.CorrectLevel.H
                            });

                            $('.share-wordlist').fadeIn(250).css('display', 'flex');

                            $that.removeClass('share-loading').html(ke.getLocale('Pb_Learn'));
                        } else {
                            $that.removeClass('share-loading');
                            alert('Some error occurred... Please try again or contact us at support@matetranslate.com.');
                        }
                    },
                    error: function () {
                        $that.removeClass('share-loading').html('learn');
                        alert('Some error occurred... Please try again or contact us at support@matetranslate.com.');

                        if (typeof ga != "undefined") ga('send', 'event', 'pb', 'export-reji', 'failed');
                    }
                });
            });
        }
    });

})();