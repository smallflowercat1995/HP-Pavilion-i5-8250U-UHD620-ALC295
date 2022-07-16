(function (undefined) {

    var i18n_dataErrorHeadline = ke.getLocale('Kernel_Network_Error');
    var i18n_dataErrorContents = ke.getLocale('Kernel_Network_Error_DataLoading');

    pl.extend(ke.ext.errorManager, {
        showNetworkError: function () {
            ke.ui.tooltip.modal.show(
                [i18n_dataErrorHeadline, i18n_dataErrorContents],
                'center', 15, 290, 200
            );
        }
    });

})();