/**
 * Created by chernikovalexey on 02/11/17.
 */

(function () {
    pl.extend(ke.particles.sync.ui_model, {
        sendSyncRequest: function (method, callback, message, $btn) {
            if ($btn.hasClass('synced') || $btn.hasClass('syncing')) {
                return;
            }

            if (typeof ga != "undefined") ga('send', 'event', 'sync', 'start');

            ke.ext.util.storageUtil.chainRequestBackgroundOption([
                {fn: 'isTrueOption', args: ['chr_pro_flag']},
                {fn: 'getVal', args: ['account_token']}
            ], function (r) {
                var is_pro = r[0].response;
                var token = r[1].response;

                if (!is_pro) {
                    ke.ui.pro_alert.show(message, 'sync');

                    if (typeof ga != "undefined") ga('send', 'event', 'sync', 'pro-shown');
                } else {
                    if (!token) {
                        ke.ui.login.show({is_sync: true});

                        return;
                    }

                    $btn.addClass('syncing');

                    chrome.runtime.sendMessage({
                        action: ke.processCall('app', 'sync', method)
                    }, function (r) {
                        if (!r.error) {
                            $btn
                                .removeClass('syncing')
                                .addClass('synced');

                            setTimeout(function () {
                                $btn.removeClass('synced');
                            }, 5000);

                            callback(true, r.add_rm_changes);
                        } else {
                            $btn.removeClass('syncing');

                            alert(r.message);
                            callback(false);
                        }
                    });
                }
            });
        }
    });
})();