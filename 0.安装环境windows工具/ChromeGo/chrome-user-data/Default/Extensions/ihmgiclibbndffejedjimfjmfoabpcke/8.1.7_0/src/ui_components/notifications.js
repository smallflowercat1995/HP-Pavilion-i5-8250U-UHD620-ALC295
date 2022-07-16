/**
 * Created by chernikovalexey on 02/11/17.
 */

(function () {

    const TIMEOUT = 1400;
    const HTML = '<div class="notification"><%=text%></div>';
    const HTML_CLICKABLE = '<div class="notif-text"><%=text%></div><div class="notif-arrow"></div>';

    pl.extend(ke.ui.notifications, {
        opened: false,

        show: function (text, timeout) {
            if (ke.ui.notifications.opened || ke.section === 'content') {
                return;
            }

            timeout = timeout || TIMEOUT;
            ke.ui.notifications.opened = true;

            $('body').append(ke.ext.tpl.compile(HTML, {
                text: text
            }));

            setTimeout(function () {
                $('.notification').fadeOut(150, function () {
                    $(this).remove();

                    ke.ui.notifications.opened = false;
                })
            }, timeout);
        },

        showClickable: function (text, callback, timeout) {
            ke.ui.notifications.show(ke.ext.tpl.compile(HTML_CLICKABLE, {
                text: text
            }), timeout);

            $('.notification').addClass('clickable').on('click', function () {
                if (callback.link) {
                    chrome.tabs.create({
                        url: callback.link
                    });
                }

                if (callback.fn) {
                    callback.fn();
                }

                if (typeof ga != "undefined") ga('send', 'event', 'clickable-notif', callback.link || 'unknown', 'clicked');
            });

            if (typeof ga != "undefined") ga('send', 'event', 'clickable-notif', callback.link || 'unknown', 'shown');
        }
    });

})();