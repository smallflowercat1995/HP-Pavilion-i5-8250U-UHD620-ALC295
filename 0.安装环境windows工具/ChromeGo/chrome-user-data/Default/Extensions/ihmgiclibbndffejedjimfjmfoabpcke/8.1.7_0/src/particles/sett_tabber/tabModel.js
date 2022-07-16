(function (undefined) {

    ke.import('ext.util.storageUtil');

    pl.extend(ke.particles.sett_tabber.model, {
        setTab: function (e) {
            var tab = +$(this).data('id');
            ke.particles.sett_tabber.view.displayCurrentTab(tab);
        }
    });

})();