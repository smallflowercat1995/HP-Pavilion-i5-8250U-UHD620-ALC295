(function (undefined) {
    ke.import('s:ui_components.ss_selector');

    pl.extend(ke.ui, {
        ss_selector: {}
    });

    pl.extend(ke.ui.ss_selector, {
        ON_STATE: 1,
        OFF_STATE: 2,

        callbackList: {},

        init: function (callbacks) {
            this.callbackList = callbacks;
            var that = this;
            pl('.ss-button').unbind().bind('click', function () {
                that.toggleState.call(this);
            });
        },

        getClass: function (e) {
            return pl(e).attr('class').split(' ')[1];
        },

        toggleState: function (isActive) {
            var isActive = !pl.type(isActive, 'undef') ? isActive : pl(this).hasClass('active-ss');
            var _class = ke.ui.ss_selector.getClass(this);

            pl(this).find('.sign').html(ke.getLocale('Kernel_Option' + (!isActive ? 'Enabled' : 'Disabled')));

            if (isActive) {
                pl(this).removeClass('active-ss');
                $('.' + _class + '-selection').slideUp(100, 'easeInOutQuint');
            } else {
                pl(this).addClass('active-ss');
                $('.' + _class + '-selection').slideDown(100, 'easeInOutQuint');
            }

            if (ke.ui.ss_selector.callbackList[_class]) {
                ke.ui.ss_selector.callbackList[_class](!isActive);
            } else {
                ke.ui.ss_selector.callbackList.DEFAULT_CALLBACK(_class, !isActive);
            }
        }
    });
})();