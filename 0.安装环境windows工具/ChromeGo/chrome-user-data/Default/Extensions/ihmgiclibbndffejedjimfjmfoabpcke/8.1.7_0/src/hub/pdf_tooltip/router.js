/* Kumquat Hub Content Router
 * 
 **/

(function (undefined) {

    pl.extend(ke.app, {
        import: [
            'ext.tpl',
            'ext.audio',
            'ext.dom',
            'ext.googleApi',

            'ext.const.lang',
            'ext.util.langUtil',
            'ext.util.selectorsUtil',

            'particles.listen.lModel',
            'particles.translate_ctt.tcModel',
            'particles.scrollbars.sModel',
            'particles.3dots_button.3dotsModel',
            'particles.3dots_button.3dotsView',

            'ui_components.scrollbar.scrollbar',
            'ui_components.tooltip.helpSelected',

            'templates.helpSelectedTooltip',

            's:ui_components.contextMenu',
            'lib.contextMenu'
        ],

        callbacksInitialization: {},

        flags: {
            isCurrentTranslationMulti: false,
            isTranslating: false
        },

        temp: {
            currentDetectedLang: '',
            scale: 1.0
        },

        lastTranslationCallArgs: {},

        init: function () {
            if (pl.empty(document.location.hash)) {
                window.close();
                return;
            }

            var hash_parts = document.location.hash.substr(1).split('|');
            this.lastTranslationCallArgs.from = decodeURIComponent(hash_parts[0]);
            this.lastTranslationCallArgs.to = decodeURIComponent(hash_parts[1]);
            this.lastTranslationCallArgs.text = decodeURIComponent(hash_parts.splice(2).join(''));

            document.title = "Mate Translate PDF";

            $('body').css('overflow', 'hidden');

            ke.ext.util.storageUtil.chainRequestBackgroundOption([
                {fn: 'isTrueOption', args: ['dark_mode']}
            ], function (responses) {
                var dark_mode = responses[0].response;

                if (dark_mode) {
                    $('body').addClass(ke.getPrefix() + 'dark-mode');
                }
            });

            $(window).resize(ke.app.handlers.onResize);

            ke.particles.translate_ctt.model.currentSelectedText = this.lastTranslationCallArgs.text;

            ke.particles.translate_ctt.model.getTranslation(
                this.lastTranslationCallArgs.text,
                ke.app.handlers.showTranslation,
                this.lastTranslationCallArgs.from,
                this.lastTranslationCallArgs.to,
                null, 'pdf');
        }
    });

})();