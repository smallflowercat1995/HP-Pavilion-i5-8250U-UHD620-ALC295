/**
 * Created by chernikovalexey on 12/10/17.
 */

(function () {

    pl.extend(ke.ui.toggle, {
        initToggles: function () {
            this.renderOptionCheckboxes();
            $('.ios-toggle').on('change', ke.ui.toggle.onOptionCheckboxChange);
        },

        renderOptionCheckboxes: function () {
            $('.ios-toggle').each(function () {
                var $toggle = $(this);
                var option = $toggle.attr('id');

                ke.ext.util.storageUtil.requestBackgroundOption('isTrueOption', [option], function (is_true) {
                    if (is_true) {
                        $toggle.attr('checked', '');
                        $('.' + option + '-selection').slideDown(100, 'easeInOutQuint');
                    } else {
                        $toggle.removeAttr('checked');
                        $('.' + option + '-selection').slideUp(100, 'easeInOutQuint');
                    }
                });
            });
        },

        onOptionCheckboxChange: function (event) {
            event.stopPropagation();
            event.preventDefault();

            var option = $(this).attr('id');
            var is_true = $(this).is(':checked');

            if (!is_true) {
                $('.' + option + '-selection').slideUp(100, 'easeInOutQuint');
            } else {
                $('.' + option + '-selection').slideDown(100, 'easeInOutQuint');
            }

            if (option in ke.ui.toggle.stateChangeCallbacks) {
                ke.ui.toggle.stateChangeCallbacks[option](is_true, $(this));
            } else {
                ke.ui.toggle.stateChangeCallbacks.DEFAULT_CALLBACK(option, is_true, $(this));
            }
        },

        stateChangeCallbacks: {
            DEFAULT_CALLBACK: function (n, f, source) {
                ke.ext.util.storageUtil.requestBackgroundOption('setOptionAsBoolean', [n, f]);

                if (typeof ga != "undefined") ga('send', 'event', source || 'options', n, '' + f);
            },

            dark_mode: function (f) {
                $('body').toggleClass('dark-mode');

                ke.ext.util.storageUtil.requestBackgroundOption('isTrueOption', ['chr_pro_flag'], function (is_pro) {
                    if (!is_pro && f) {
                        setTimeout(function () {
                            ke.ui.pro_alert.show(ke.getLocale('Pro_DarkMode'), 'dark-mode');
                        }, 1000);
                    }

                    if (!f || is_pro) {
                        ke.ext.util.storageUtil.requestBackgroundOption('setOptionAsBoolean', ['dark_mode', f]);
                    }
                });
            },

            key_combo: function (f) {
                ke.particles.sett_trans_combo.model.onCCheckboxChange(f);
            },

            ctx_menu: function (f) {
                chrome.runtime.sendMessage({
                    action: ke.processCall('app', 'option', 'ctrlContextActiveness'),
                    active: f
                });

                if (typeof ga != "undefined") ga('send', 'event', 'options', 'ctx_menu', '' + f);
            },

            fullpage: function (f) {
                chrome.runtime.sendMessage({
                    action: ke.processCall('app', 'option', 'ctrlFullpageActiveness'),
                    active: f
                });

                if (typeof ga != "undefined") ga('send', 'event', 'options', 'fullpage', '' + f);
            },

            monetization: function (f) {
                chrome.runtime.sendMessage({
                    action: ke.processCall('app', 'option', 'toggleMonetization'),
                    state: f
                });
            }
        }
    });

})();