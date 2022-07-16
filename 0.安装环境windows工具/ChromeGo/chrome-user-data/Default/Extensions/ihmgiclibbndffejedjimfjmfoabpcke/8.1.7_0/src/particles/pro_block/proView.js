/**
 * Created by chernikovalexey on 07/11/17.
 */

(function () {
    pl.extend(ke.particles.pro_block.view, {
        init: function (callback) {
            if (typeof Paddle !== 'undefined') {
                Paddle.Setup({
                    vendor: 11759
                });
            }

            if (!ke.IS_CHROME && !ke.IS_SAMSUNG) {
                $('.stt-feature').remove();
            }

            $('.pro-version-button').on('click', ke.particles.pro_block.model.upgrade);
            $('.restore').on('click', ke.particles.pro_block.model.restore);

            $('.login-button').on('click', ke.particles.pro_block.model.showLogin);
            $('.signout').on('click', ke.particles.pro_block.model.signOut);

            this.showSyncState();
            this.showProState();

            if (callback) {
                callback();
            }
        },

        showProState: function () {
            ke.ext.util.storageUtil.chainRequestBackgroundOption([
                {fn: 'getVal', args: ['account_token']},
                {fn: 'isTrueOption', args: ['chr_pro_flag']}
            ], function (r) {
                var token = r[0].response;
                var is_pro = r[1].response;

                if (is_pro) {
                    $('.usage-block').hide();
                    $('.no-pro-layout').hide();
                    $('.pro-layout').show();
                    $('.trial-expiration').hide();
                } else {
                    $('.usage-block').show();
                    $('.pro-layout').hide();
                    $('.no-pro-layout').show();

                    if (!token) {
                        $('.restore').show();
                    } else {
                        $('.restore').hide();
                    }
                }
            });
        },

        showSyncState: function () {
            ke.ext.util.storageUtil.chainRequestBackgroundOption([
                {fn: 'getVal', args: ['account_token']},
                {fn: 'isTrueOption', args: ['chr_pro_flag']},
                {fn: 'getVal', args: ['account_email']}
            ], function (r) {
                var token = r[0].response;
                var is_pro = r[1].response;
                var email = r[2].response;

                if (!token) {
                    $('.signed-in-layout').hide();
                    $('.signed-out-layout').show();
                } else {
                    $('.login-email').html(email);
                    $('.signed-out-layout').hide();
                    $('.signed-in-layout').show();

                    if (is_pro) {
                        $('.sync-option-disabled').hide();
                    } else {
                        $('.sync-option-disabled').show();
                    }
                }
            });
        }
    });
})();