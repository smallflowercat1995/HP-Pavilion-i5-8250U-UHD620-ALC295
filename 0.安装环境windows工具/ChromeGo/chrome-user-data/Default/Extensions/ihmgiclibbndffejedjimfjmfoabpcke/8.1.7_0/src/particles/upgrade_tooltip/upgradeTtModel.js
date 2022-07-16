/**
 * Created by chernikovalexey on 24/10/16.
 */

//
// Not used anymore

(function () {

    var $body = $('body');

    pl.extend(ke.particles.stt.model, {
        createTemplate: function (strings, is_arrow_white) {
            strings = $.extend(strings, {
                head: ke.getLocale('Window_Stt_OnlyPro'),
                upgrade: ke.getLocale('Window_Stt_ProUpgrade', ke.ext.util.storageUtil.getVal('pro_inapp_price')),
                later: ke.getLocale('Window_Stt_MaybeLater')
            });

            return $('<div>', {class: 'pro-tooltip'})
                .append($('<div>', {class: 'pt-arrow'}).addClass(is_arrow_white ? 'pt-white' : ''))
                .append($('<div>', {class: 'pt-head'}).html(strings.head))
                .append($('<div>', {class: 'pt-desc'}).html(strings.desc))
                .append($('<button>', {class: 'pt-button pro-version-button'}).html(strings.upgrade))
                .append($('<button>', {class: 'pt-button pt-cancel-button'}).html(strings.later));
        },

        show: function (el, strings, offsets, is_arrow_white) {
            offsets = offsets || {x: 0, y: 12 + 5};

            var $el = $(el);
            var $tooltip = this.createTemplate(strings, is_arrow_white).appendTo($body);

            $tooltip.css({
                left: $el.offset().left + parseInt($el.css('width')) / 2 - (200 + 20) / 2,
                top: $el.offset().top + parseInt($el.css('height')) + offsets.y
            });

            $tooltip.fadeIn(125, 'easeInCubic', function () {
                var close = function () {
                    $tooltip.fadeOut(125, 'easeInCubic', function () {
                        $(this).remove();
                    });
                    if (typeof ga != "undefined") ga('send', 'event', 'monetization-close', 'stt-tooltip');
                };

                var closeOnAsideClick = function () {
                    if (!$(event.target).parent().hasClass('pro-tooltip')) {
                        close();
                        pl('body').unbind('click', closeOnAsideClick);
                    }
                };

                $tooltip.find('.pt-cancel-button').on('click', close);

                pl('body').bind('click', closeOnAsideClick);

                $tooltip.find('.pro-version-button').on('click', function () {
                    chrome.runtime.sendMessage({
                        action: ke.processCall('app', 'opt', 'buy')
                    });

                    if (typeof ga != "undefined") ga('send', 'event', 'upgrade-pro', 'stt-tooltip');
                });
            });
        }
    });
})();