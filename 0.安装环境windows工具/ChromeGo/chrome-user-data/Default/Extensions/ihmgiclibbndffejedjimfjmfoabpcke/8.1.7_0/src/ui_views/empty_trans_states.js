(function (undefined) {

    var S_CONTENT = '.right-part-content-wrap';
    var S_TRANS = '.translation-layout';
    var S_CAP = '.translation-empty-cap';

    pl.extend(ke.ui_views.empty_trans_states, {
        displayEmptiness: function () {
            $(S_CAP).show();

            //if (!ke.app.flags.instant) $('.translate-button').fadeOut(300, 'easeOutCubic');
            //$('.listen-raw-button').fadeOut(300, 'easeOutCubic');

            $(S_CONTENT).fadeOut(ke.getAnimSpeed('fast_fade_out') / 1.75, ke.getAnimType('fast_fade_out'), function () {
                $(S_TRANS).empty();

                if (!ke.IS_SAMSUNG) {
                    ke.particles.scrollbars.model.setupTranslationScroll();
                }
            });

            $('.clear-input').fadeOut(ke.getAnimSpeed('fade_out'), ke.getAnimType('fade_out'));

            $('.original-article').slideUp(125);
            $('.translation-input').removeClass('with-article');

            ke.app.flags.clearFadedOut = true;
        },

        displayWorkaround: function () {
            $(S_CAP).hide();

            //if (!ke.app.flags.instant) $('.translate-button').fadeIn(300, 'easeOutCubic');
            //$('.listen-raw-button').fadeIn(300, 'easeOutCubic');

            $(S_CONTENT).fadeIn(ke.getAnimSpeed('fade_out'), ke.getAnimType('fade_out'));
        }
    });

})();