(function (undefined) {

    ke.import('ext.const.lang');

    var i18n_removeFromRecent = ke.getLocale('Kernel_RemoveFromRecent');

    $.extend(ke.particles.lang_selectors.view, {
        TYPES: {
            FROM: 1,
            TO: 2
        },

        fillDropdown: function (type, num, data, lang_list, callback) {
            if (data) {
                ke.particles.lang_selectors.view.getDropdownHtml(type, num, data, callback, false, lang_list);
            } else {
                ke.ext.util.storageUtil.requestBackgroundOption('getJsonField', ['dropdown_html', ([null, 'from', 'to'])[type]], callback);
            }
        },

        getDropdownHtml: function (type, num, data, callback, is_background, lang_list) {
            lang_list = lang_list || ke.ext.const.lang.list;

            var customized = !!data;

            var isCurrent = function (lang) {
                return customized
                    ? ((type === 1 && lang === data.from) || (type === 2 && lang === data.to))
                    : ke.ext.util.langUtil['is' + (type === 1 ? 'From' : 'To') + 'Lang'](lang);
            };

            var getLiClass = function (val) {
                return isCurrent(val) ? 'option_selected' : 'option';
            };

            var listTempItem, _key;
            var df = document.createDocumentFragment();
            var orderedLangList = [];
            var recentlyUsedList = [];
            var excludes = data ? (data.excludes || []) : [];

            ke.ext.util.storageUtil.requestBackgroundOption('getDecodedVal', ['recently_used_lang'], function (recentlyUsedRaw) {
                for (var key in lang_list) {
                    if (lang_list[key] === 'auto') {
                        continue;
                    }

                    listTempItem = {
                        key: key,
                        value: lang_list[key],
                        i18n: ke.getLocale('Kernel_Lang_' + key)
                    };

                    orderedLangList.push(listTempItem);
                }

                if (!customized || (customized && data.is_main)) {
                    pl.each(recentlyUsedRaw, function (k, v) {
                        _key = ke.ext.util.langUtil.getLangNameByKey(v);
                        listTempItem = {
                            key: _key,
                            value: v,
                            i18n: ke.getLocale('Kernel_Lang_' + _key)
                        };

                        recentlyUsedList.push(listTempItem);
                        excludes.push(listTempItem.value);
                    });
                }

                orderedLangList.sort(function (a, b) {
                    if (a.i18n < b.i18n) {
                        return -1;
                    } else if (a.i18n > b.i18n) {
                        return 1;
                    }

                    return 0;
                }).reverse();

                if (!~pl.inArray('auto', excludes)) {
                    orderedLangList.push({
                        key: 'Auto',
                        value: 'auto',
                        i18n: ke.getLocale('Kernel_Lang_Auto')
                    });
                }

                var total_length = orderedLangList.length + recentlyUsedList.length;
                var current;

                pl.each(orderedLangList, function (k, v) {
                    if (v.value === 'auto' && num === 2) {
                        return;
                    }

                    if (isCurrent(v.value)) {
                        current = v.value;
                    }

                    $(df).prepend(
                        $('<li>')
                            .addClass('lang-' + v.value)
                            .addClass(getLiClass(v.value))
                            .addClass(~pl.inArray(v.value, excludes) ? 'hidden' : '')
                            .attr({
                                index: total_length
                            })
                            .html(
                            $('<span>')
                                .attr({
                                    id: 'lang-' + v.value,
                                    val: v.value
                                })
                                .addClass('lang-' + v.value)
                                .html(v.i18n)
                                .get(0)
                        )
                            .get(0)
                    );

                    --total_length;
                });

                if (!pl.empty(recentlyUsedList)) {
                    total_length += 2;

                    $(df).prepend(
                        $('<li>')
                            .addClass('group')
                            .attr('index', --total_length)
                            .html(
                            $('<span>')
                                .addClass('group-title')
                                .html(ke.getLocale('Window_Content_AllLang'))
                                .get()
                        )
                            .get()
                    );

                    pl.each(recentlyUsedList.reverse(), function (k, v) {
                        if (v.value === 'auto' && num === 2) {
                            return;
                        }

                        if (isCurrent(v.value)) {
                            current = v.value;
                        }

                        $(df).prepend(
                            $('<li>')
                                .addClass('lang-' + v.value)
                                .addClass(getLiClass(v.value))
                                .attr('index', total_length)
                                .append(
                                $('<span>')
                                    .addClass('group-element')
                                    .attr({
                                        id: 'lang-' + v.value,
                                        val: v.value
                                    })
                                    .html(v.i18n)
                                    .get(0)
                            )
                                .append(
                                $('<div>')
                                    .addClass('rm-recent')
                                    .attr('title', i18n_removeFromRecent)
                                    .get()
                            )
                                .get()
                        );

                        --total_length;
                    });

                    $(df).prepend(
                        $('<li>')
                            .addClass('group')
                            .attr('index', --total_length)
                            .html(
                            $('<span>')
                                .addClass('group-title')
                                .html(ke.getLocale('Window_Content_RecentlyUsedLang'))
                                .get()
                        )
                            .get()
                    );
                }

                callback({
                    num: num,
                    code: pl('<div>').append(df).html(),
                    select: ke.getLocale('Kernel_Lang_' + ke.ext.util.langUtil.getLangNameByKey(current))
                });
            }, is_background);
        }
    });

})();