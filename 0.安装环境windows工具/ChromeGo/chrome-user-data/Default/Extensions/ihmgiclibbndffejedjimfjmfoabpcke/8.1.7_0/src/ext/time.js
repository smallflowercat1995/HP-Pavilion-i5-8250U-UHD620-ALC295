(function (undefined) {

    pl.extend(ke.ext.time, {
        beautify: function (stamp) {
            return (new Date(stamp))
                .toLocaleString()
                .replace(/(\:([0-9]+))(\:([0-9]+))/, '$1');
        }
    });

})();