/* Kumquat Hub Options Render
 * 
 **/

(function (undefined) {

    pl.extend(ke.app.render, {
        organize: {
            renderOptionCheckboxes: function () {
                $('.ios-toggle').each(function () {
                    var $toggle = $(this);
                    var option = $toggle.attr('id');

                    ke.ext.util.storageUtil.requestBackgroundOption('isTrueOption', [option], function (is_true) {
                        if (is_true) {
                            $toggle.attr('checked', '');
                        } else {
                            $toggle.removeAttr('checked');
                        }
                    });
                });
            },

            showOtherPlatforms: function () {
                chrome.runtime.sendMessage({
                    action: ke.processCall('app', 'option', 'getPromotionalTableButtons')
                }, function (data) {
                    if (data.buttons_code) {
                        $('.platforms').html(data.buttons_code);
                    } else {
                        $('.cp-block').remove();
                    }
                });
            },

            showPopupShortcuts: function () {
                ke.ext.util.storageUtil.requestBackgroundOption('getIntValue', ['win_trans_type'], function (type) {
                    var $s1 = $('.shortcuts-1');
                    var $s2 = $('.shortcuts-2');

                    if (type === 2 && $s1.hasClass('shifted-right')) {
                        $s1.animate({left: 0}, 600);
                        $s2.animate({left: 0}, 600);
                        $s1.removeClass('shifted-right');
                        $s2.removeClass('shifted-left');
                    } else if (type === 1 && !$s1.hasClass('shifted-right')) {
                        $s1.animate({left: 364}, 600);
                        $s2.animate({left: -364}, 600);
                        $s1.addClass('shifted-right');
                        $s2.addClass('shifted-left');
                    }
                });
            }
        },

        events: {
            bindBeforeUnload: function () {
                window.addEventListener("beforeunload", ke.app.handlers.beforeUnload);
            },

            tabChange: function () {
                $('.tab').on('click', ke.particles.sett_tabber.model.setTab);
            },

            bindCombinationAddition: function () {
                pl('.new-combo-button').bind('click', ke.particles.sett_trans_combo.model.addCombination);
            }
        }
    });

})();