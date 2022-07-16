/**
 * Created by chernikovalexey on 07/11/17.
 */

(function (undefined) {

    pl.extend(ke.particles.three_dots.view, {
        current_from_lang: null,
        current_to_lang: null,

        // For pop-up and content scripts
        fillContextMenu: function ($button, from, to, tid) {
            this.current_from_lang = from;
            this.current_to_lang = to;

            chrome.runtime.sendMessage({
                action: ke.processCall('app', 'phrasebook', 'getWordlistsByLang'),
                from: from,
                to: to
            }, function (wordlists) {
                var sub_menu_items = [];

                if (!wordlists || wordlists.length === 0) {
                    var from_name = ke.getLocale('Kernel_Lang_' + ke.ext.util.langUtil.getLangNameByKey(ke.particles.three_dots.view.current_from_lang));
                    var to_name = ke.getLocale('Kernel_Lang_' + ke.ext.util.langUtil.getLangNameByKey(ke.particles.three_dots.view.current_to_lang));

                    sub_menu_items.push({
                        name: ke.getLocale('TD_NoWordlists') + from_name + ' → ' + to_name + '...',
                        disable: true
                    });
                } else {
                    wordlists.forEach(function (wordlist) {
                        sub_menu_items.push({
                            name: wordlist.name,
                            className: 'wl-' + wordlist.id + ' t-' + tid,
                            fun: ke.particles.three_dots.model.addToWordlist
                        });
                    });
                }

                sub_menu_items.push({
                    name: ke.getLocale('TD_Create'),
                    className: 't-' + tid,
                    fun: ke.particles.three_dots.model.createWordlist
                });

                var menu = [{
                    name: ke.getLocale('TD_AddPB'),
                    subMenu: sub_menu_items
                }, {
                    name: ke.getLocale('TD_Copy'),
                    className: 't-' + tid,
                    fun: ke.particles.three_dots.model.copyTranslation
                }];

                var options = {};

                if (ke.section === 'content') {
                    //options.containment = '.TnITTtw-tooltip-' + tid;
                    //options.top = 10;
                    //options.left = 300 - 60 * 3;
                    options.onOpen = function (data) {
                        var maxZ = Math.max.apply(null,
                            $.map($('body *'), function (e, n) {
                                if ($(e).css('position') != 'static')
                                    return parseInt($(e).css('z-index')) || 1;
                            }));

                        data.menu.css('z-index', maxZ + 1);

                        if (ke.app.flags.dark_mode
                            || document.location.href.indexOf('https://www.netflix.com/watch') > -1) {

                            data.menu.addClass('TnITTtw-dark-mode');
                        }
                    };
                }

                $button.contextMenu(menu, options);
            });
        },

        // For history only
        fillContextMenuOnlyWithWordlists: function ($button, from, to, tid) {
            this.current_from_lang = from;
            this.current_to_lang = to;

            chrome.runtime.sendMessage({
                action: ke.processCall('app', 'phrasebook', 'getWordlistsByLang'),
                from: from,
                to: to
            }, function (wordlists) {
                var menu_items = [];

                if (!wordlists || wordlists.length === 0) {
                    var from_name = ke.getLocale('Kernel_Lang_' + ke.ext.util.langUtil.getLangNameByKey(from));
                    var to_name = ke.getLocale('Kernel_Lang_' + ke.ext.util.langUtil.getLangNameByKey(to));

                    menu_items.push({
                        name: ke.getLocale('TD_NoWordlists') + from_name + ' -> ' + to_name + '...',
                        disable: true
                    });
                } else {
                    wordlists.forEach(function (wordlist) {
                        menu_items.push({
                            name: wordlist.name,
                            className: 'wl-' + wordlist.id + ' t-' + tid,
                            fun: ke.particles.three_dots.model.addToWordlist
                        });
                    });
                }

                menu_items.push({
                    name: ke.getLocale('TD_Create'),
                    className: 't-' + tid,
                    fun: ke.particles.three_dots.model.createWordlist
                });

                $button.contextMenu(menu_items);
            });
        }
    });

})();