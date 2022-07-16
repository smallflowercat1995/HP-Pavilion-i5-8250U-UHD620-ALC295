/* Kumquat Hub Content Handlers
 * 
 **/

(function (undefined) {

    pl.extend(ke.app.handlers, {
        getListenValue: function (s) {
            if (s === 'orig') {
                return ke.particles.translate_ctt.model.getCurrentSelectedText();
            } else if (s === 'trans') {
                if (ke.app.flags.isCurrentTranslationMulti) {
                    return pl('.' + ke.getPrefix() + 'main-variant .' + ke.getPrefix() + 'mv-text-part').text();
                } else {
                    return pl('.' + ke.getPrefix() + 'padded-single-translation').text();
                }
            }

            return '';
        },

        onResize: function () {
            window.resizeTo(337, 300);
        },

        reverseTranslation: function (event) {
            chrome.runtime.sendMessage({
                action: ke.processCall('app', 'opt', 'newTab'),
                url: chrome.extension.getURL('/pages/public/options.html#3,tooltip')
            });

            chrome.runtime.sendMessage({
                action: ke.processCall('app', 'commands', 'sendAnalyticsEvent'),
                cat: 'pdf',
                event: 'change-langs'
            });

            window.close();
        },

        showTranslation: function (is_offline, data) {
            if (is_offline) {
                $('.' + ke.getPrefix() + 'offline')['show']();
                return;
            }

            $('body').html(ke.ext.tpl.compile(ke.templates.helpSelectedTooltip, {
                prefix: ke.getPrefix(),
                content: data.code,
                ttid: data.old_data.id,
                l_human: ke.getLocale('Human_OrderButton'),
                l_open: ke.getLocale('Kernel_OpenGt'),
                l_reversed: ke.getLocale('Kernel_Reverse'),
                l_original: ke.getLocale('Kernel_Original'),
                l_highlight: ke.getLocale('Kernel_Highlight')
            }));

            $('.' + ke.getPrefix() + 'unpin').remove();
            $('.' + ke.getPrefix() + 'hsw-' + data.old_data.id)
                .addClass(ke.getPrefix() + 'tooltip-' + data.old_data.id);
            $('.' + ke.getPrefix() + 'listen-original')
                .attr('data-from', data.from === 'auto' ? data.detected_lang : data.from);

            ke.particles.translate_ctt.model.display(is_offline, data, true);
        },

        settings: function () {
            chrome.runtime.sendMessage({
                action: ke.processCall('app', 'opt', 'newTab'),
                url: chrome.extension.getURL('/pages/public/options.html#3,pdf')
            });

            chrome.runtime.sendMessage({
                action: ke.processCall('app', 'commands', 'sendAnalyticsEvent'),
                cat: 'pdf',
                event: 'settings'
            });
        },
    });
})();