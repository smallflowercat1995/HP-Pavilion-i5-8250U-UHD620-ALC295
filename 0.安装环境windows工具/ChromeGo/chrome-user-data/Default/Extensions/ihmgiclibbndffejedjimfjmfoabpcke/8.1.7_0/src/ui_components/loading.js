/**
 * Created by chernikovalexey on 16/11/17.
 */

(function () {
    pl.extend(ke.ui.loading, {
        show: function (callback) {
            $('.loading-screen').fadeIn(150, callback || function () {
            });
            $('body').addClass('stop-scrolling');
        },

        showIdbErrorLayout: function () {
            $('.idb-error-layout').fadeIn(150);
        },

        close: function () {
            $('.loading-screen').fadeOut(250);
            $('body').removeClass('stop-scrolling');
        }
    });
})();