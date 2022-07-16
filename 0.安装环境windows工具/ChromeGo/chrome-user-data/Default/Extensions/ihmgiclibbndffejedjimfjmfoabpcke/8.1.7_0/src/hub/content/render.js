/* Kumquat Hub Content Render
 * 
 **/

(function (undefined) {

    var ALLOWED_KC_TYPES = {
        search: true,
        text: true,
        '': true
    };

    pl.extend(ke.app.render, {
        organize: {},

        events: {
            listen: function () {
                pl('.' + ke.getPrefix() + 'listen-original').unbind().bind('click', ke.particles.listen.model.playTooltip);
                pl('.' + ke.getPrefix() + 'listen-butt0n').unbind().bind('click', ke.particles.listen.model.playTooltip);
            },

            showUpgradeForIpaAndArticles: function() {
                pl('.' + ke.getPrefix() + 'mv-translit').unbind().bind('click', ke.app.handlers.upgradeForIpa);
                pl('.' + ke.getPrefix() + 'article').unbind().bind('click', ke.app.handlers.upgradeForArticle);
            },

            listenSynonym: function () {
                pl('.' + ke.getPrefix() + 'listen-v-item').unbind().bind('click', ke.particles.listen.model.playTooltipSynonym);
            },

            reverseTranslation: function () {
                pl('.' + ke.getPrefix() + 'show-reversed').unbind().bind('click', ke.app.handlers.reverseTranslation);
            },

            highlight: function () {
                pl('.' + ke.getPrefix() + 'highlight-butt0n').unbind().bind('click', ke.app.handlers.highlight);
            },

            unpin: function () {
                pl('.' + ke.getPrefix() + 'unpin').unbind().bind('click', ke.app.handlers.unpin);
            },

            settings: function () {
                pl('.' + ke.getPrefix() + 'settings').unbind().bind('click', ke.app.handlers.settings);
            },

            localizedSiteInfoWarnActions: function (ttid) {
                pl('.' + ke.getPrefix() + 'iw-' + ttid)
                    .find('a')
                    .unbind()
                    .bind('click', ke.app.handlers.useLocalizedInfoWarn);
                pl('.' + ke.getPrefix() + 'close-loc-option')
                    .unbind()
                    .bind('click', ke.app.handlers.closeInlineOption);
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