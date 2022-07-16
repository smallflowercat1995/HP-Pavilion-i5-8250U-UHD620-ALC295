/* Kumquat Hub History Handlers
 * 
 **/

(function (undefined) {

    pl.extend(ke.app.handlers, {
        _processEventHandlers: {
            app: {
                audio: {}
            }
        },

        onMouseDownOverOption: function () {
            $(this).prev().addClass('option-before-active');
        },

        onMouseUpOverOption: function () {
            $(this).prev().removeClass('option-before-active');
        },

        enableDeleteMode: function () {
            ke.app.render.organize.ctrlOptionsVisibility();
            ke.particles.hist_opt_delete.model.onDeleteSelectionClick();
        },

        registerMouseDown: function () {
            ke.app.flags.isMouseDown = true;
        },

        registerMouseUp: function () {
            ke.app.flags.isMouseDown = false;
        },

        registerKeyDown: function (e) {
            if (e.shiftKey) {
                ke.app.flags.isShiftDown = true;
            }
        },

        registerKeyUp: function (e) {
            // shift up, e.shiftKey doesn't work for some reason...
            if (e.keyCode === 16) {
                ke.app.flags.isShiftDown = false;
            }
        },

        onSelCancel: function () {
            ke.app.render.organize.ctrlOptionsVisibility(function () {
                ke.particles.hist_opt_delete.model.toggleSlidingWrap();
                ke.app.temp.selected = [];
                pl('.active-st').removeClass('active-st');
                pl('.to-delete-label').html("0");
            });

            // Close quick access bar
            ke.app.flags.quick_access_shown = false;
            $('.quick-access-bar').animate({
                top: -59,
                opacity: 0
            }, ke.getAnimSpeed('slide_down') * 2.25, ke.getAnimType('slide_down'));
        },

        scrollOnGoUpButton: function (event) {
            event.preventDefault();

            $('body').animate({
                scrollTop: 0
            }, 275, function () {
                $(window).trigger('scroll');
            });
        },

        cancelCallbacks: {},

        cancelClicks: {},

        addCancelCallback: function (e, c) {
            this.cancelCallbacks[e] = c;
        },

        cancelOptionSelection: function (e, forced) {
            // Avoiding NaN
            ke.app.handlers.cancelClicks[this] = ke.app.handlers.cancelClicks[this] || 0;
            ke.app.handlers.cancelCallbacks[this] = ke.app.handlers.cancelCallbacks[this] || ke.EF;

            ke.app.handlers.cancelCallbacks[this]();
            $(this)
                .parent()
                .slideUp(ke.getAnimSpeed('slide_up'), ke.getAnimType('slide_up'))
                .parent()
                .removeClass('option-active');
            $(this)
                .parent()
                .find('.admit-cancel')
                .slideUp(ke.getAnimSpeed('slide_down'), ke.getAnimType('slide_down'));

            $('body').removeClass('delete-mode');

            e.stopPropagation();
        },

        onWindowResize: function () {
            ke.app.temp.window_height = window.innerHeight;
            ke.app.setPageScrollSize();

            if ($(window).width() >= 1060) {
                $('.up-shortcut').show();
            } else {
                $('.up-shortcut').hide();
            }
        },

        sync: function () {
            ke.particles.sync.ui_model.sendSyncRequest('syncHistory', function (is_success, add_rm_changes) {
                if (is_success && add_rm_changes) {
                    ke.ui.loading.show();

                    setTimeout(function () {
                        ke.app.render.organize.initHistory(true);
                    }, 250);
                }
            }, ke.getLocale('Pro_SyncFeature'), $('.sync-button'));
        }
    });

})();