(function (undefined) {

    pl.extend(ke.particles.tr_input.view, {
        displaySaveValue: function (callback, text) {
            ke.ext.util.storageUtil.requestBackgroundOption('getVal', ['saved_val'], function (val) {
                if (!(text || val)) {
                    $('.translation-input').focus();
                } else {
                    pl('.translation-input').val(text || val).caretToEnd();
                }
                callback(pl.empty(text || val));
            });
        }
    });

})();