(function (undefined) {

    pl.extend(ke.ui_views.i18n, {
        init: function () {
            $('.need-html-locale').each(function () {
                var args = [$(this).attr('id')];

                if ($(this).data('storage-locale-placeholder')) {
                    args.push(ke.ext.util.storageUtil.getVal($(this).data('storage-locale-placeholder')));
                }

                $(this).html(ke.getLocale.apply(ke, args));
            });

            $('.need-ph-locale').each(function () {
                pl(this).attr('placeholder', ke.getLocale($(this).attr('id')));
            });

            $('.need-title-locale').each(function () {
                $(this).attr('title', ke.getLocale($(this).attr('id')));
            });
        },

        setSettingsTitle: function () {
            document.title = ke.getLocale('Kernel_SettingsTitle');
        },

        setHistoryTitle: function () {
            document.title = ke.getLocale('Kernel_HistoryTitle');
        }
    });

})();