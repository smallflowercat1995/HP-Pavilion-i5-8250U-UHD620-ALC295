/* Kumquat Hub Options Render
 * 
 **/

(function (undefined) {

    pl.extend(ke.app.render, {
        organize: {
            showCarouselTab: function (tab) {
                $('.c-block').hide();
                $('.cb-' + tab).fadeIn(500);

                // To restart GIFs
                var $img = $('.cb-' + tab).find('img');
                $img.attr('src', $img.attr('src'));

                $('.c-block-meta').hide();
                $('.cbm-' + tab).fadeIn(500);

                $('.progress-dot').removeClass('active');
                $('.pd-' + tab).addClass('active');

                if (tab === 1) {
                    $('.to-left').hide();
                } else {
                    $('.to-left').show();
                }

                if (tab === ke.app.TABS) {
                    $('.to-right').hide();
                } else {
                    $('.to-right').show();
                }
            }
        },

        events: {
            gotIt: function () {
                pl('.got-it').bind('click', ke.app.handlers.gotIt);
            },

            listen: function () {
                pl('.' + ke.getPrefix() + 'listen-original').unbind().bind('click', ke.particles.listen.model.playTooltip);
                pl('.' + ke.getPrefix() + 'listen-butt0n').unbind().bind('click', ke.particles.listen.model.playTooltip);
            },

            listenSynonym: function () {
                pl('.' + ke.getPrefix() + 'listen-v-item').unbind().bind('click', ke.particles.listen.model.playTooltipSynonym);
            },

            reverseTranslation: function () {
                //pl('.' + ke.getPrefix() + 'show-reversed').unbind().bind('click', ke.app.handlers.reverseTranslation);
            },

            highlight: function () {
                //pl('.' + ke.getPrefix() + 'highlight-butt0n').unbind().bind('click', ke.app.handlers.highlight);
            },

            unpin: function () {
                //pl('.' + ke.getPrefix() + 'unpin').unbind().bind('click', ke.app.handlers.unpin);
            },

            settings: function () {
                pl('.' + ke.getPrefix() + 'settings').unbind().bind('click', ke.app.handlers.settings);
            },

            doubleClickOptionActions: function (ttid) {
                pl('.' + ke.getPrefix() + 'ddopt-' + ttid)
                    .unbind()
                    .bind('click', ke.app.handlers.disableInlineOption);
                pl('.' + ke.getPrefix() + 'close-dd-option')
                    .unbind()
                    .bind('click', ke.app.handlers.closeInlineOption);
            },

            selectionOptionActions: function (ttid) {
                pl('.' + ke.getPrefix() + 'selopt-' + ttid)
                    .unbind()
                    .bind('click', ke.app.handlers.disableInlineOption);
                pl('.' + ke.getPrefix() + 'close-sel-option')
                    .unbind()
                    .bind('click', ke.app.handlers.closeInlineOption);
            }
        }
    });

})();