(function (undefined) {

    ke.import('ext.audio');

    pl.extend(ke.particles.listen.model, {
        _getTransValue: function (source, s2, e) {
            if (source === 'window') {
                if (ke.app.flags.isCurrentTranslationMulti) {
                    return ke.ext.string.removeHtml($('.translation-layout .main-variant .mv-text-part').html());
                } else {
                    return ke.ext.string.removeHtml($('.trans-wrap').find('.tpart').html());
                }
            } else if (source === 'history') {
                return ke.particles.hist_list.model.getListenValue(s2);
            } else if (source === 'tooltip') {
                return ke.app.handlers.getListenValue(s2, e);
            }
        },

        target_id: 0,
        targets: {},

        _playPrototype: function ($button, dir, input, vis_fns, dl, ctx) {
            if (pl.empty(input) || $button.is('[class$="listen-disabled"]')) {
                return;
            }

            var lang = dl || ( dir.substr(0, 5) === 'lang:' ?
                    dir.substr(5) :
                    ke.ext.util.langUtil['get' + ke.capitalize(dir) + 'Lang']());

            var audio_callback = function (data) {
                if (!data) {
                    return;
                }

                $button.removeClass('stop-audio');

                data.old_data.vis_fns.forEach(function (vis_fn) {
                    ke.particles.listen.model[vis_fn](
                        false,
                        dl || lang,
                        ke.particles.listen.model.targets[data.old_data.target_id]
                    );
                });

                delete ke.particles.listen.model.targets[data.old_data.target_id];
            };

            if ($button.hasClass('stop-audio')) {
                // Note: same as logic for play-audio,  check the notes below in the other `else` branch
                if (ke.IS_SAFARI) {
                    ke.app.handlers._processEventHandlers.app.audio.stop({
                        vis_fns: vis_fns,
                        target_id: +$button.data('tid')
                    }, audio_callback)
                } else {
                    chrome.runtime.sendMessage({
                        action: ke.processCall('app', 'audio', 'stop'),
                        vis_fns: vis_fns,
                        target_id: +$button.data('tid')
                    }, audio_callback);
                }
            } else {
                $button.addClass('stop-audio');

                vis_fns.forEach(function (vis_fn) {
                    ke.particles.listen.model[vis_fn](true, lang, ctx);
                });

                var target_id = ++ke.particles.listen.model.target_id;
                $button.data('tid', target_id);
                ke.particles.listen.model.targets[target_id] = ctx;

                // Note: Two different approaches here:
                // 1. For browsers other than Safari, just let background page play translation audio
                // 2. For Safari, play audio right in this page itself. And ensure there is an audio played syncronously
                if (ke.IS_SAFARI) {
                    // Note: IMPORTANT, must play something syncronously after a click
                    var emptyAudio = new Audio('data:audio/mpeg;')
                    emptyAudio.play().catch(e => {})

                    ke.app.handlers._processEventHandlers.app.audio.play({
                        lang: lang,
                        text: input.trim(),
                        vis_fns: vis_fns,
                        target_id: target_id
                    }, audio_callback)
                } else {
                    chrome.runtime.sendMessage({
                        action: ke.processCall('app', 'audio', 'play'),
                        vis_fns: vis_fns,
                        text: input.trim(),
                        lang: lang,
                        target_id: target_id
                    }, audio_callback);
                }
            }
        },

        ctrlRawVisibility: function (playing) {
            var is_empty = pl.empty(pl('.translation-input').val());

            if (is_empty || !ke.ext.audio.isUtterable(ke.app.getCurrentFromLang())) {
                $('.listen-raw-butt0n').slideUp(75);
            } else {
                $('.listen-raw-butt0n').slideDown(75, function () {
                    if (playing) {
                        $(this).addClass('listen-disabled');
                    } else {
                        $(this).removeClass('listen-disabled');
                    }
                });
            }
        },

        ctrlTransVisibility: function (playing, lang) {
            if (!ke.ext.audio.isUtterable(ke.app.temp.toLang)) {
                $('.translation-layout').addClass('no-tts');
            } else {
                $('.translation-layout').removeClass('no-tts');
            }

            if (playing) {
                pl('.listen-translation').addClass('listen-disabled');
            } else {
                pl('.listen-translation').removeClass('listen-disabled');
            }

            ke.app.flags.transUtterancePermission = !playing;
        },

        ctrlSynonymVis: function (playing, lang, event) {
            if (!event) {
                event = $("body");
            }

            var $context = event.target ? $(event.target)
                .parent()
                .parent()
                .parent()
                .parent() : event;

            var allowed = !playing;
            var prefix = ke.data.kernel.info.section === 'content' || ke.data.kernel.info.section === 'pdf_tooltip'
                ? ke.getPrefix()
                : '';

            if (!ke.ext.audio.isUtterable(ke.app.temp.toLang || lang)) {
                $context.addClass(prefix + 'no-tts');
            } else {
                $context.removeClass(prefix + 'no-tts');
            }

            $('.' + prefix + 'listen-v-item').each(function () {
                var $this = $(this);
                if (!$this.hasClass('stop-audio')) {
                    $this[(allowed ? 'remove' : 'add') + 'Class'](prefix + 'listen-disabled');
                }
            });

            ke.app.flags.transUtterancePermission = allowed;
        },

        ctrlTooltipOrigVisibility: function (playing, lang, e) {
            var $context;

            if (e.target) {
                $context = $(ke.ext.util.selectorsUtil.getTooltipWrapRecursively(e.target));
            } else if (e.innerHTML) {
                $context = $(e);
            } else {
                $context = e;
            }

            var from_lang = $context.find('.' + ke.getPrefix() + 'listen-original').data('from');

            if (!ke.ext.audio.isUtterable(from_lang)) {
                $context.addClass(ke.getPrefix() + 'no-orig-tts');
            } else {
                $context.removeClass(ke.getPrefix() + 'no-orig-tts');
            }

            var allowed = !playing
                && !pl.empty(ke.particles.listen.model._getTransValue('tooltip', 'orig', e));

            $context.find('.' + ke.getPrefix() + 'listen-original')[(allowed ? 'remove' : 'add') + 'Class'](ke.getPrefix() + 'listen-disabled');
            ke.app.flags.tt_transUtterancePermission = allowed;
        },

        ctrlTooltipTransVisibility: function (playing, lang, e) {
            var $context;
            if (e.target) {
                $context = $(ke.ext.util.selectorsUtil.getTooltipWrapRecursively(e.target));
            } else if (e.innerHTML) {
                $context = $(e);
            } else {
                $context = e;
            }

            var to_lang = $context.find('.' + ke.getPrefix() + 'listen-translation').data('to');

            if (!ke.ext.audio.isUtterable(to_lang)) {
                $context.addClass(ke.getPrefix() + 'no-trans-tts');
            } else {
                $context.removeClass(ke.getPrefix() + 'no-trans-tts');
            }

            var allowed = !playing
                && !pl.empty(ke.particles.listen.model._getTransValue('tooltip', 'trans', e));

            $context.find('.' + ke.getPrefix() + 'listen-translation')[(allowed ? 'remove' : 'add') + 'Class'](ke.getPrefix() + 'listen-disabled');
            ke.app.flags.tt_transUtterancePermission = allowed;
        },

        ctrlHistoryOrigVisibility: function (is_playing, lang, $context) {
            if (!$context) {
                return;
            }

            if (!ke.ext.audio.isUtterable(lang)) {
                $context.addClass('no-orig-tts');
            } else {
                $context.removeClass('no-orig-tts');
            }

            $('.listen-original')[(is_playing ? 'add' : 'remove') + 'Class']('listen-disabled');
        },

        ctrlHistoryTransVisibility: function (is_playing, lang, $context) {
            if (!$context) {
                return;
            }

            if (!ke.ext.audio.isUtterable(lang)) {
                $context.addClass('no-trans-tts');
            } else {
                $context.removeClass('no-trans-tts');
            }

            $('.listen-translation')[(is_playing ? 'add' : 'remove') + 'Class']('listen-disabled');
        },

        playRaw: function (event) {
            ke.particles.listen.model._playPrototype(
                $(this),
                'from',
                pl('.translation-input').val(),
                ['ctrlTransVisibility', 'ctrlSynonymVis'],
                ke.app.temp.currentDetectedLang,
                event
            );
        },

        playTranslation: function (event) {
            ke.particles.listen.model._playPrototype(
                $(this),
                'to',
                ke.particles.listen.model._getTransValue('window'),
                ['ctrlRawVisibility', 'ctrlSynonymVis'],
                null,
                event
            );
        },

        playTooltip: function (e) {
            e.stopPropagation();

            if (pl(this).hasClass(ke.getPrefix() + 'listen-original')) {
                ke.particles.listen.model.playTooltipOriginal.call(this, e, $(this).data('from'));
            } else {
                ke.particles.listen.model.playTooltipTranslation.call(this, e, $(this).data('to'));
            }
        },

        playTooltipOriginal: function (event, lang) {
            ke.particles.listen.model._playPrototype(
                $(this),
                'lang:' + lang,
                ke.particles.listen.model._getTransValue('tooltip', 'orig', event),
                ['ctrlTooltipTransVisibility', 'ctrlSynonymVis'],
                ke.app.temp.currentDetectedLang,
                event
            );
        },

        playTooltipTranslation: function (event, lang) {
            ke.particles.listen.model._playPrototype(
                $(this),
                'lang:' + lang,
                ke.particles.listen.model._getTransValue('tooltip', 'trans', event),
                ['ctrlTooltipOrigVisibility', 'ctrlSynonymVis'],
                null,
                event
            );
        },

        playHistoryItem: function (event) {
            event.stopPropagation();

            var $item = $('.expanded');

            if (pl(this).hasClass('listen-original')) {
                ke.particles.listen.model.playHistoryOriginal.call(this, event, $item);
            } else {
                ke.particles.listen.model.playHistoryTranslation.call(this, event, $item);
            }
        },

        playHistoryOriginal: function (e, $context) {
            ke.particles.listen.model._playPrototype(
                $(this),
                'lang:' + ke.ext.util.selectorsUtil.getHistoryOriginalLang(e),
                ke.particles.listen.model._getTransValue('history', 'orig', e),
                ['ctrlHistoryTransVisibility', 'ctrlSynonymVis'],
                null,
                $context
            );
        },

        playHistoryTranslation: function (e, $context) {
            ke.particles.listen.model._playPrototype(
                $(this),
                'lang:' + ke.ext.util.selectorsUtil.getHistoryToLang(e),
                ke.particles.listen.model._getTransValue('history', 'trans', e),
                ['ctrlHistoryOrigVisibility', 'ctrlSynonymVis'],
                null,
                $context
            );
        },

        playSynonym: function (event) {
            var val = ke.ext.string.removeHtml($(this).parent().find('.main-of-item').html());

            ke.particles.listen.model._playPrototype(
                $(this),
                'lang:' + $(this).data('langto'),
                val,
                ['ctrlSynonymVis', 'ctrlRawVisibility',
                    'ctrlTransVisibility'],
                null,
                event
            );
        },

        playHistorySynonym: function (event) {
            var val = $(this).next().find('.main-of-item').html();
            var $context = $('.i-' + ke.ext.util.selectorsUtil.getHistoryItemId(event.target));

            ke.particles.listen.model._playPrototype(
                $(this),
                'lang:' + $(this).data('langto'),
                val,
                ['ctrlSynonymVis', 'ctrlHistoryOrigVisibility',
                    'ctrlHistoryTransVisibility'],
                null,
                $context
            );
        },

        playTooltipSynonym: function (event) {
            var val = ke.ext.string.removeHtml($(this).parent().find('.' + ke.getPrefix() + 'main-of-item').html());

            ke.particles.listen.model._playPrototype(
                $(this),
                'lang:' + $(this).data('langto'),
                val,
                ['ctrlSynonymVis', 'ctrlTooltipOrigVisibility',
                    'ctrlTooltipTransVisibility'],
                null,
                event
            );
        },

        //
        // v4.0: PHRASEBOOK

        playPhrasebookOriginal: function (phrase, lang, $context) {
            ke.particles.listen.model._playPrototype(
                $(this),
                'lang:' + lang,
                phrase,
                ['ctrlHistoryTransVisibility', 'ctrlSynonymVis'],
                null,
                $context
            );
        },

        playPhrasebookTrans: function (phrase, lang, $context) {
            ke.particles.listen.model._playPrototype(
                $(this),
                'lang:' + lang,
                phrase,
                ['ctrlHistoryOrigVisibility', 'ctrlSynonymVis'],
                null,
                $context
            );
        },

        playPhrasebookSynonym: function (phrase, lang, $context) {
            ke.particles.listen.model._playPrototype(
                $(this),
                'lang:' + lang,
                phrase,
                ['ctrlHistoryOrigVisibility', 'ctrlHistoryTransVisibility', 'ctrlSynonymVis'],
                null,
                $context
            );
        }
    });

})();