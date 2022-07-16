/**
 * Created by chernikovalexey on 24/11/17.
 */

(function (undefined) {

    pl.extend(ke.ext.clipboard, {
        addTextfieldToBody: function () {
            return $('<textarea>')
                .css({
                    position: 'absolute',
                    top: -1000,
                    left: -1000
                })
                .appendTo('body');
        },

        copyToClipboard: function (text) {
            var $cc = ke.ext.clipboard.addTextfieldToBody();
            $cc.val(text).focus().select();
            document.execCommand('Copy');
            $cc.remove();
        },

        getClipboardContents: function () {
            var $cc = ke.ext.clipboard.addTextfieldToBody();
            $cc.val('').focus().select();
            document.execCommand('Paste');

            var val = $cc.val();
            $cc.remove();
            return val;
        }
    });

})();