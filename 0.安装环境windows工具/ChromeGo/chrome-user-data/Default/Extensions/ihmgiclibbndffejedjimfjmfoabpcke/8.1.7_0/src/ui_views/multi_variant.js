(function (undefined) {
    var max_synonyms = 3;

    var SINGLE_HTML = '\
        <div class="<%=prefix%>original-wrap <%=prefix%>padded-single-translation">\
        <div class="<%=prefix%>mv-text-part"><%=original%></div>\
        <div class="<%=prefix%>mv-translit <%=prefix%>original-translit"><%=translit_original%></div>\
        <div class="<%=prefix%>ico-listen <%=prefix%>listen-butt0n <%=prefix%>listen-original" data-from="<%=from%>"></div>\
        </div>\
        <div class="<%=prefix%>padded-single-translation <%=prefix%>trans-wrap">\
        <div class="<%=prefix%>tpart"><%=translation%></div>\
        <div class="<%=prefix%>mv-translit <%=prefix%>translation-translit"><%=translit_translation%></div>\
        <div class="<%=prefix%>more-butt0n" data-to="<%=to%>"></div>\
        <div class="<%=prefix%>ico-listen <%=prefix%>listen-butt0n <%=prefix%>listen-translation" data-to="<%=to%>"></div>\
        </div>';

    pl.extend(ke.ui_views.multi_variant, {
        TRANSLIT_TYPE: 1,
        IPA_TYPE: 2,
        SYNONYMS_TYPE: 3,

        _singleWrap: function (translations, type, prefix, lang) {
            prefix = prefix || '';

            var translit_blur_class = '';
            var gender_original = translations[8] ? translations[8] : '';
            var gender_translation = translations[9] ? translations[9] : '';
            var translit_original = ke.ext.googleApi.getSourceTranslitFromJson(translations);
            var translit_translation = ke.ext.googleApi.getTargetTranslitFromJson(translations);

            if (!ke.ext.util.storageUtil.isTrueOption('show_ipa')) {
                translit_original = 'gikken';
                translit_translation = 'gikken';
            }

            if (!ke.ext.util.storageUtil.isTrueOption('chr_pro_flag')) {
                translit_blur_class = prefix + 'blurred-out';

                // no request is made for non-pro users
                // show a blurred out placeholder to encourage them update instead
                if (ke.ext.googleApi.supportsArticles(translations[5]) 
                    && translations[1].split(' ').length <= 1) {
                    gender_original = 'das';
                }
                if (ke.ext.googleApi.supportsArticles(translations[6]) 
                    && translations[3].split(' ').length <= 1) {
                    gender_translation = 'das';
                }
            }

            if (gender_original && ke.ext.util.storageUtil.isTrueOption('show_articles')) {
                gender_original = '<span class="' + prefix + 'article ' + translit_blur_class + '">' + gender_original + '</span>';
            } else {
                gender_original = '';
            }

            if (gender_translation && ke.ext.util.storageUtil.isTrueOption('show_articles')) {
                gender_translation = '<span class="' + prefix + 'article ' + translit_blur_class + '">' + gender_translation + '</span>';
            } else {
                gender_translation = '';
            }

            return ke.ext.tpl.compile(SINGLE_HTML, {
                prefix: prefix,
                original: gender_original + translations[1],
                translation: gender_translation + translations[3],
                to: lang,
                translit_original: translit_original,
                translit_translation: translit_translation
            });
        },

        _complexSingleWrap: function (translations, ov, prefix, locales, lang) {
            return this._singleWrap(translations, ke.ui_views.multi_variant.SYNONYMS_TYPE, prefix, locales, lang);
        },

        _multiWrap: function (translations, onlyVariants, prefix, lang) {
            var df_local, df_local_items;
            var df = document.createDocumentFragment();

            if (!pl.type(prefix, 'str')) {
                prefix = '';
            }

            for (var i = 0; i < translations[7].length; ++i) {
                if (pl.empty(translations[7][i])) {
                    continue;
                }

                var len = translations[7][i].length;
                df_local = document.createDocumentFragment();

                pl.each(translations[7][i], function (k, v) {
                    df_local_items = document.createDocumentFragment();

                    // Hotfix
                    if (v[2] && pl.type(v[1], 'str') && pl.type(v[2], 'arr')) {
                        var t = v[1];
                        v[1] = v[2];
                        v[2] = t;
                    }

                    pl.each(v[1] || [], function (k2, v2) {
                        if (k2 >= max_synonyms) return;
                        if (v2) {
                            $(df_local_items)
                                .append($('<div>', {class: prefix + 'synonym'}).html(v2))
                                .append(k2 < v[1].length - 1 && k2 < max_synonyms - 1 ? ', ' : '');
                        }
                    });
                    
                    var gender = '';

                    if (v[2] && ke.ext.util.storageUtil.isTrueOption('show_articles')) {
                        var blur_class = '';
                        if (!ke.ext.util.storageUtil.isTrueOption('chr_pro_flag')) {
                            blur_class = ' ' + prefix + 'blurred-out';
                        }
                        gender = '<span class="' + prefix + 'article ' + blur_class + '">' + v[2] + '</span> ';
                    }

                    $(df_local)
                        .append($('<div>', {class: prefix + 'v-item'})
                            .append($('<div>', {
                                class: prefix + 'small-copy-button',
                                'data-langto': '<%=to%>'
                            }))
                            .append($('<div>', {
                                class: prefix + 'listen-v-item',
                                'data-langto': '<%=to%>'
                            }))
                            .append($('<div>', {class: prefix + 'v-texts'})
                                .append($('<div>', {class: prefix + 'main-of-item'}).html(gender + v[0])))
                            .append($('<div>', {class: prefix + 'synonyms'}).append(df_local_items)));
                });

                var key = ke.ext.googleApi.getPartOfSpeechByIndex(i);
                var empty_pos = pl.empty(key);

                pl(df).append(
                    pl('<div>')
                        .addClass(prefix + 'variant-row')
                        .append(
                        pl('<div>')
                            .addClass(prefix + 'v-pos')
                            .html(!empty_pos ? ke.getLocale('CommonUi_LangPart_' + ke.capitalize(key)) : '')
                            .addClass(empty_pos ? prefix + 'empty-pos' : '')
                            .get()
                    )
                        .append(
                        pl('<div>')
                            .addClass(prefix + 'v-closest-wrap')
                            .append(df_local)
                            .get()
                    )
                        .get()
                );
            }

            // Do not include different wrappers and a main variant to the final HTML code
            if (onlyVariants === true) {
                return pl('<div>').append(df).html();
            }

            var translit_blur_class = '';
            var gender_original = translations[8] ? translations[8] : '';
            var gender_translation = translations[9] ? translations[9] : '';
            var translit_original = ke.ext.googleApi.getSourceTranslitFromJson(translations);
            var translit_translation = ke.ext.googleApi.getTargetTranslitFromJson(translations);

            if (!ke.ext.util.storageUtil.isTrueOption('show_ipa')) {
                translit_original = 'gikken';
                translit_translation = 'gikken';
            }

            if (!ke.ext.util.storageUtil.isTrueOption('chr_pro_flag')) {
                translit_blur_class = prefix + 'blurred-out';

                // no request is made for non-pro users
                // show a blurred out placeholder to encourage them update instead
                if (ke.ext.googleApi.supportsArticles(translations[5])) {
                    gender_original = 'das';
                }
                if (ke.ext.googleApi.supportsArticles(translations[6])) {
                    gender_translation = 'das';
                }
            }

            if (gender_original && ke.ext.util.storageUtil.isTrueOption('show_articles')) {
                gender_original = '<span class="' + prefix + 'article ' + translit_blur_class + '">' + gender_original + '</span>';
            } else {
                gender_original = '';
            }

            if (gender_translation && ke.ext.util.storageUtil.isTrueOption('show_articles')) {
                gender_translation = '<span class="' + prefix + 'article ' + translit_blur_class + '">' + gender_translation + '</span>';
            } else {
                gender_translation = '';
            }

            var bunch = $('<div>').addClass(prefix + 'variant-bunch-wrap').append(
                $('<div>')
                    .addClass(prefix + 'vbw-inside-layout')
                    .append(
                        $('<div>')
                            .addClass(prefix + 'original-wrap')
                            .append(
                                $('<div>')
                                    .addClass(prefix + 'original')
                                    .html('<div class="' + prefix + 'mv-text-part">' + gender_original + translations[1] + '</div><div class="' + prefix + 'add-pb-butt0n"></div><div class="' + prefix + 'mv-translit ' + prefix + 'original-translit ' + translit_blur_class + ' ' + prefix + 'ipa">' + translit_original + '</div><div class="' + prefix + 'copy-butt0n"></div><div class="' + prefix + 'ico-listen ' + prefix + 'listen-butt0n ' + prefix + 'listen-original" data-from="<%=from%>">' +
                                        '</div>')
                                    .get()
                            )
                            .get()
                    )
                    .append(
                        $('<div>')
                            .addClass(prefix + 'main-variant-wrap')
                            .append(
                                $('<div>')
                                    .addClass(prefix + 'main-variant')
                                    .html('<div class="' + prefix + 'mv-text-part">' + gender_translation + translations[3] + '</div><div class="' + prefix + 'mv-translit ' + prefix + 'original-translit ' + translit_blur_class + ' ' + prefix + 'ipa">' + translit_translation + '</div><div class="' + prefix + 'more-butt0n"></div><div class="' + prefix + 'ico-listen ' + prefix + 'listen-butt0n ' + prefix + 'listen-translation" data-to="' + lang + '">' +
                                        '</div>')
                                    .get()
                            )
                            .get()
                    )
                    .append(
                        $('<div>')
                            .addClass(prefix + 'variants-by-pos')
                            .append(df)
                            .get()
                    )
                    .get()
            );

            return $('<div>').append(bunch.get()).html();
        },

        wrap: function (multi, items, ov, prefix, locales, complexSingle) {
            return ke.ui_views.multi_variant['_' + (multi ? 'multi' : (!complexSingle ? 'single' : 'complexSingle')) + 'Wrap'](items, ov, prefix, items[6]);
        }
    });
})();