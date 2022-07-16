(function (undefined) {
    ke.import('ext.googleApi');

    pl.extend(ke.particles.hist_list.view, {
        populateHistoryList: function (callback, bounds, descending_order, no_retoggle) {
            ke.idb.search('it', 'history', {
                pending_removal: false
            }, function (items, idb_error) {
                if (!items && idb_error) {
                    return;
                }

                ke.particles.hist_list.view.toggleEmptyHistoryCap();

                if (items.length > 0) {
                    items.forEach(function (item) {
                        ke.particles.hist_list.view.drawHistoryItem(item, undefined, descending_order);
                    });
                }
                callback(no_retoggle || false, items.length);

            }, ke.idb.COMP_AND, bounds, 50, descending_order, 'time');
        },

        drawHistoryItem: function (item, hl, descending_order) {

            //console.log(item);

            if (~pl.inArray(item.time, ke.app.temp.item_times)) {
                return;
            } else {
                ke.app.temp.item_times[descending_order ? 'unshift' : 'push'](item.time);
            }

            var input = item.input;
            var json = item.it_resp;
            var output = ke.ext.googleApi.parseReceivedTranslation(json, true, '', false);
            var emptyVariants = output[0] ? '' : ' ' + 'collapsed';
            var time = ke.ext.time.beautify(item.time);

console.log(output);

            output[2] = output[2] || '';

            if (!output[0]) {
                output[2] = '';
                //output[1] = json[3];
            }

            if (!pl.type(hl, 'undef')) {
                input = ke.ext.string.highlight(input, hl);
                output[1] = ke.ext.string.highlight(output[1], hl);
            }

            var add_info = '';
            if (item.sources) {
                var sources = item.sources;

                for (var source in sources) {
                    var source_copy;

                    if (source === 'popup') {
                        source_copy = ke.getLocale('History_InPopup');
                    } else if (source === 'adev') {
                        source_copy = ke.getLocale('History_AnotherDevice');
                    } else {
                        source_copy = '<a class="source-link" href="' + source + '" target="_blank">' + decodeURI(source) + '</a>';
                    }

                    add_info += '<div class="source-item"><div class="source">' + source_copy + '</div><div class="time-small">' + ke.ext.time.beautify(sources[source]) + '</div></div>';
                }
            } else {
                add_info = '<div class="time">' + time + '</div>';
            }

            pl('.history-list')[descending_order ? 'prepend' : 'append'](
                ke.ext.tpl.compile(ke.templates.historyListItem, {
                    id: item.id,
                    input: input,
                    main_output: output[1],
                    collapse_variants: emptyVariants,
                    variants: ke.ext.tpl.compile(output[2], {
                        from: item.l_from,
                        to: item.l_to
                    }),
                    sliding_wrap_visibility: !ke.app.flags.isTickerWrapActive ? 'invisible-sw' : '',
                    listen_wrap_visibility: pl.inArray(item.id, ke.app.temp.expanded) === -1 ? 'invisible-sw' : '',
                    selected: ~pl.inArray(item.id, ke.app.temp.selected) ? 'active-st' : '',
                    from_lang: item.l_from,
                    to_lang: item.l_to,
                    translit_original: ke.ext.googleApi.getSourceTranslitFromJson(json),
                    translit_translation: ke.ext.googleApi.getTargetTranslitFromJson(json),
                    gender_original: json[8] ? json[8] : '',
                    gender_translation: json[9] ? json[9] : '',
                    time: time,
                    sources: add_info,
                    lang_from: ke.getLocale("Kernel_Lang_" + ke.ext.util.langUtil.getLangNameByKey(item.l_from)),
                    lang_to: ke.getLocale("Kernel_Lang_" + ke.ext.util.langUtil.getLangNameByKey(item.l_to))
                })
            );
        },

        toggleEmptyHistoryCap: function () {
            return ke.particles.hist_list.model.toggleListEndCap('History_Content_List_OnEmpty');
        }
    });

})();