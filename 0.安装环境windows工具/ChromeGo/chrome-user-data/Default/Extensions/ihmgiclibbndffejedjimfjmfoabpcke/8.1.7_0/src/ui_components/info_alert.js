/**
 * Created by chernikovalexey on 02/11/17.
 */

(function () {

    const HTML = '\
    <div class="ccw-upgrade-layout info-alert">\
        <div class="popup combo-change-window">\
            <div class="ccw-top">\
                <div class="ccw-headline"><%=title%></div>\
            </div>\
            <div class="ccw-contents">\
                <div class="ccw-alert-message"><%=message%></div>\
                <button class="mw-button wba-s ccw-close"><%=close%></button>\
            </div>\
        </div>\
    </div>';

    pl.extend(ke.ui.info_alert, {
        opened: false,

        getTopPos: function ($alert, $mw) {
            var h = $mw.height()
                + parseInt($mw.css('padding-top')) * 2;

            return $alert.height() / 2 - h / 2;
        },

        show: function (title, message, close_button_label) {
            if (ke.ui.info_alert.opened) {
                return;
            }

            message = message || '';

            $('body').append(ke.ext.tpl.compile(HTML, {
                title: title,
                message: message,
                close: close_button_label
            }));

            var $alert = $('.info-alert');
            var $mw = $alert.find('.combo-change-window');

            $alert.css('top', $(document).scrollTop());
            $('body').addClass('stop-scrolling');

            var top = ke.ui.info_alert.getTopPos($alert, $mw);

            if (top < 0) {
                $alert.addClass('ccw-small');
                top = ke.ui.info_alert.getTopPos($alert, $mw);
            }

            $mw.css('top', top);

            $alert.find('.ccw-close').on('click', ke.ui.info_alert.close);
        },

        close: function () {
            $('.ccw-upgrade-layout').remove();
            $('body').removeClass('stop-scrolling');
        }
    });

})();