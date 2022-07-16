(function (undefined) {

    var MAX_STEPS = 100;

    pl.extend(ke.ext.util.selectorsUtil, {
        import: [],

        getHistoryItemId: function (e) {
            var steps = 0;
            var currentElement = $(e);

            while (!currentElement.hasClass('history-item-wrap') && ++steps < MAX_STEPS) {
                currentElement = currentElement.parent();
            }

            return +currentElement.data('id');
        },

        isMainVariantPlaque: function (e) {
            var isPlaque = false;

            for (var i = 0; i <= 3; ++i) {
                var currentElement = pl(e).parent(i);
                if (currentElement.hasClass('main-variant-wrap')) {
                    isPlaque = true;
                    break;
                }
            }

            return isPlaque;
        },

        getSwitchFlagId: function (e) {
            return +pl(e).attr('class').split(' ')[1].split('-')[3];
        },

        getHistoryOriginalLang: function (e) {
            return $('.expanded').find('.input-particle').data('langfrom');
        },

        getHistoryToLang: function (e) {
            return $('.expanded').find('.main-output-particle').data('langto');
        },

        getTooltipWrapRecursively: function (target) {
            return $(target).hasClass(ke.getPrefix() + 'tooltip-main-wrap')
                ? target
                : ke.ext.util.selectorsUtil.getTooltipWrapRecursively($(target).parent().get(0));
        }
    })

})();