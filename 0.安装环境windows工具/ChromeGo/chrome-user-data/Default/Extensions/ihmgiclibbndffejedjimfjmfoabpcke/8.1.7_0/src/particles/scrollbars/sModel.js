(function (undefined) {

    ke.import('ui_components.scrollbar.scrollbar');

    var setupScroll = function (he, h, vis, ent, db, t, trs, ot, speed) {
        var __h = parseInt($(he).css('height'))
            + parseInt($(he).css('padding-top'))
            + parseInt($(he).css('padding-bottom'));
        var willShow = __h >= h;

        pl('#' + trs)[pl(he).get(0) ? (willShow ? 'show' : 'hide') : 'hide']();

        var scrollInstance = new dw_scrollObj(vis, ent);
        scrollInstance.setUpScrollbar(db, t, 'v', 1, 1);
        scrollInstance.setUpScrollControls(trs);

        ke.particles.scrollbars.model.addScrollInstance(trs, scrollInstance);

        if (!pl.type(ot, 'undef')) {
            dw_scrollObj.scrollTo(vis, 1, ot, speed || ke.getAnimSpeed('slide_down'));
        }

        return willShow;
    };

    var scrollbars = {};

    pl.extend(ke.particles.scrollbars.model, {
        addScrollInstance: function (scrollbar_name, instance) {
            scrollbars[scrollbar_name] = instance;
        },

        getScrollInstance: function (scrollbar_name) {
            return scrollbars[scrollbar_name] || null;
        },

        scrollTo: function (scrollbar_name, pos_y, callback) {
            dw_scrollObj.scrollTo(this.getScrollInstance(scrollbar_name).id, 1, pos_y, ke.getAnimSpeed('slide_down'));
            setTimeout(callback, ke.getAnimSpeed('slide_down') + 25); // weird
        },

        setupTranslationScroll: function () {
            return setupScroll('.translation-layout', 298, 'trVisibleScroll', 'trEntireScroll', 'dragBar', 'track', 'tr-scrollbar');
        },

        setupHistoryPageScroll: function (scrolling) {
            //setupScroll('body', 598, 'page-vis-scroll', 'page-entire-scroll', 'page-drag', 'page-track', 'page-scrollbar', scrolling, 0);
            //ke.app.render.events.onPageScroll();
        },

        setupHelpSelectedScroll: function (ttid, shift) {
            ttid = ttid || ke.ui.tooltip.helpSelected.tooltipId;

            var prefix = ke.getPrefix();
            return setupScroll('.' + prefix + 'content-layout-' + ttid, 238 * ke.app.temp.scale - (shift || 0), prefix + 'trVisibleLayout-' + ttid, prefix + 'trEntireLayout-' + ttid, prefix + 'dragBar-' + ttid, prefix + 'track-' + ttid, prefix + 'tr-scrollbar-' + ttid);
        },

        setupFromWindowDropdownScroll: function (ot) {
            return setupScroll('.opt-1 .list', 250, 'selVisibleScroll-1', 'selEntireScroll-1', 'sel-dragBar-1', 'sel-track-1', 'sel-scrollbar-1', ot, 165);
        },

        setupToWindowDropdownScroll: function (ot) {
            return setupScroll('.opt-2 .list', 250, 'selVisibleScroll-2', 'selEntireScroll-2', 'sel-dragBar-2', 'sel-track-2', 'sel-scrollbar-2', ot, 165);
        },

        setupComboOptionsDropdownScroll: function (i, ot) {
            return setupScroll('.opt-' + i, 100, 'selVisibleScroll-' + i, 'selEntireScroll-' + i, 'sel-db-' + i, 'sel-tr-' + i, 'sel-scr-' + i, ot, 165);
        }
    });

})();