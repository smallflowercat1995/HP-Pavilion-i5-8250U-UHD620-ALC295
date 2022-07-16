/**
 * Created by chernikovalexey on 24/11/17.
 */

(function () {

    const INTERNAL_PAGES = {
        window: true,
        background: true
    };

    pl.extend(ke.ui.login, {
        show: function (data) {
            var hash = '';

            if (data.is_restore) {
                hash = '#restore';
            } else if (data.is_sync) {
                hash = '#sync';
            } else if (data.is_gdpr) {
                hash = '#gdpr';
            }

            if (ke.IS_EDGE && ke.section in INTERNAL_PAGES) {
                chrome.windows.create({
                    url: chrome.extension.getURL('/pages/public/login.html' + hash),
                    left: 10,
                    top: 10,
                    width: 550,
                    height: 460,
                    focused: true
                });
            } else {
                window.open(chrome.extension.getURL('/pages/public/login.html' + hash), '_blank', 'width=550,height=440');
            }
        }
    });
})();