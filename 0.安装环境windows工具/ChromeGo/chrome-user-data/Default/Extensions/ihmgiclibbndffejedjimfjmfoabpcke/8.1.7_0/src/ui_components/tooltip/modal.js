(function (undefined) {

    ke.import('templates.modalTooltip');
    ke.import('ui_components.tooltip.simple');
    ke.import('s:ui_components.tooltip.modal');

    pl.extend(ke.ui.tooltip.modal, {
        show: function (data, x, y, mw, mh) {
            ke.ui.tooltip.simple.create(ke.ext.tpl.compile(ke.templates.modalTooltip, {
                headline: data[0],
                text: data[1]
            }), x, y, mw, mh, false);
        }
    });

})();