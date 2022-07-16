(function (undefined) {

    pl.extend(ke.ext.const.selectors, {
        'window': {
            FROM_SEL: '#from-language-selector',
            TO_SEL: '#to-language-selector'
        },

        settings: {
            A_CHECK: '#all-variants',
            I_CHECK: '#instant-translation',
            K_CHECK: '#key-combo',
            C_CHECK: '#context',
            S_CHECK: '#save',
            H_CHECK: '#history',
            P_CHECK: '#pamazon',

            COL_COMBO: '.cw-combo',
            COL_CONTEXT: '.cw-context'
        }
    });

    pl.extend(ke, {
        getSelectorConst: function (p, n) {
            return ke.ext.const.selectors[p][n.toUpperCase()];
        }
    });

})();