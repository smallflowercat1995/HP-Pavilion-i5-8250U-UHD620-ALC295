/**
 * Created by chernikovalexey on 02/11/17.
 */

(function () {

    const HTML = '\
    <div class="ccw-upgrade-layout pro-alert">\
        <div class="popup combo-change-window">\
            <div class="ccw-top">\
                <div class="ccw-logo"></div>\
            </div>\
            <div class="ccw-contents">\
                <div class="ccw-more"><%=message%></div>\
                <div class="features">\
                    <div class="feature rm-5 stt-feature">\
                        <span><%=l_feature2%></span>\
                        <span class="more-feature-info">\
                            <span class="more-feature-info-icon"></span>\
                            <span class="more-feature-tooltip"><%=l_feature2_tooltip%></span>\
                        </span>\
                    </div>\
                    <div class="feature ipa-translit-feature">\
                        <span><%=l_feature_ipa%></span>\
                        <span class="more-feature-info">\
                            <span class="more-feature-info-icon"></span>\
                            <span class="more-feature-tooltip"><%=l_feature_ipa_tooltip%></span>\
                        </span>\
                    </div>\
                    <div class="feature articles-feature">\
                        <span><%=l_feature_articles%></span>\
                        <span class="more-feature-info">\
                            <span class="more-feature-info-icon"></span>\
                            <span class="more-feature-tooltip"><%=l_feature_articles_tooltip%></span>\
                        </span>\
                    </div>\
                    <div class="feature rm-1 phrasebook-feature">\
                        <span><%=l_feature4%></span>\
                        <span class="more-feature-info">\
                            <span class="more-feature-info-icon"></span>\
                            <span class="more-feature-tooltip"><%=l_feature1_tooltip%></span>\
                        </span>\
                    </div>\
                    <div class="feature export-feature rm-4">\
                        <span><%=l_feature7%></span>\
                    </div>\
                    <div class="feature shortcuts-feature rm-3">\
                        <span><%=l_feature3%></span>\
                        <span class="more-feature-info">\
                            <span class="more-feature-info-icon"></span>\
                            <span class="more-feature-tooltip"><%=l_feature3_tooltip%></span>\
                        </span>\
                    </div>\
                </div>\
                \
                <button class="mw-button high-cta ccw-upgrade"><%=upgrade_button%></button>\
                <button class="mw-button wba-s ccw-restore"><%=l_restore%></button>\
                <button class="mw-button wba-s ccw-close"><%=l_not_now%></button>\
            </div>\
        </div>\
    </div>';

    pl.extend(ke.ui.pro_alert, {
        opened: false,

        getTopPos: function ($alert, $mw) {
            var h = $mw.height()
                + parseInt($mw.css('padding-top')) * 2;

            return $alert.height() / 2 - h / 2;
        },

        show: function (message, short_id, add_html) {
            ke.ext.util.storageUtil.chainRequestBackgroundOption([
                {fn: 'getVal', args: ['pro_inapp_price']},
                {fn: 'getVal', args: ['account_token']},
                {fn: 'isTrueOption', args: ['chr_pro_flag']}
            ], function (r) {
                var price = r[0].response;
                var token = r[1].response;
                var is_pro = r[2].response;

                if (ke.ui.pro_alert.opened || is_pro) {
                    return;
                }

                ke.ui.pro_alert.opened = true;

                message = message || '';

                $('body').append(ke.ext.tpl.compile(HTML, {
                    message: '<b>' + message + '</b> ' + ke.getLocale('Pro_ComesAlong'),
                    upgrade_button: ke.getLocale('Window_Mw_UpgradeButton', price),

                    l_more: ke.getLocale('Pro_UnlockMore'),

                    l_feature1: ke.getLocale('Tour_ProFeature1'),
                    l_feature1_tooltip: ke.getLocale('Pro_PhrasebookFeature'),

                    l_feature7: ke.getLocale('Tour_ProFeature7'),

                    l_feature2: ke.getLocale('Tour_ProFeature2'),
                    l_feature2_tooltip: ke.getLocale('Pro_STTFeature'),

                    l_feature3: ke.getLocale('Tour_ProFeature3'),
                    l_feature3_tooltip: ke.getLocale('Pro_ShortcutsFeature'),

                    l_feature4: ke.getLocale('Tour_ProFeature4'),

                    l_restore: ke.getLocale('Settings_Restore'),
                    l_not_now: ke.getLocale('Window_Mw_NotChromeNotNow'),

                    l_feature_ipa: ke.getLocale('Pro_IPA'),
                    l_feature_ipa_tooltip: ke.getLocale('Pro_IPA_Desc'),

                    l_feature_articles: ke.getLocale('Pro_Articles'),
                    l_feature_articles_tooltip: ke.getLocale('Pro_Articles_Desc'),
                }));

                var $alert = $('.pro-alert');
                var $mw = $alert.find('.combo-change-window');

                if (add_html) {
                    $alert.append(add_html);
                }

                if (!message) {
                    $alert.find('.ccw-more').remove();
                }

                if (!ke.IS_CHROME && !ke.IS_SAMSUNG) {
                    $alert.find('.stt-feature').remove();
                }

                if (ke.IS_SAMSUNG){
                    $alert.find('.shortcuts-feature').remove();
                }

                $('.' + short_id + '-feature').remove();

                // 7.0.20 -- don't remove the feature which triggered this alert from the list
                //$alert.find('.' + short_id + '-feature').remove();

                $alert.css('top', $(document).scrollTop());
                $('body').addClass('stop-scrolling');

                if (typeof ga != "undefined") ga('send', 'event', 'pro', 'shown', short_id);

                $alert.find('.ccw-restore').attr('data-id', short_id);
                $alert.find('.ccw-close').attr('data-id', short_id);

                if (token) {
                    $alert.find('.ccw-restore').remove();
                } else {
                    $alert.find('.ccw-restore').on('click', ke.ui.pro_alert.restore);
                }

                var top = ke.ui.pro_alert.getTopPos($alert, $mw);
                var rm = 0;

                console.log(top);

                while (top < 5 || $mw.height() > $(window).height()) {

                    console.log('upd', $mw.height(), top, rm);
                    if (rm === 0) {
                        $alert.addClass('ccw-small');
                    } else {
                        console.log($alert.find('.rm-' + rm));
                        $alert.find('.rm-' + rm).remove();
                    }

                    top = ke.ui.pro_alert.getTopPos($alert, $mw);
                    ++rm;
                }

                $mw.css('top', top);

                $alert
                    .find('.ccw-upgrade')
                    .attr('data-id', short_id)
                    .on('click', ke.ui.pro_alert.upgrade);
                $alert.find('.ccw-close').on('click', ke.ui.pro_alert.close);
            });
        },

        upgrade: function (event, short_id) {
            var id = $(this).data('id');

            if (ke.section === 'options') {
                ke.particles.pro_block.model.upgrade();
            } else {
                chrome.tabs.create({
                    url: chrome.extension.getURL('/pages/public/options.html#start_purchase,' + id)
                });
            }

            if (typeof ga != "undefined") ga('send', 'event', 'pro', 'upgrade-clicked', id);
        },

        restore: function () {
            ke.ui.login.show({is_restore: true});

            var id = $(this).data('id');
            if (typeof ga != "undefined") ga('send', 'event', 'pro', 'restore-clicked', id);
        },

        close: function () {
            $('.ccw-upgrade-layout').remove();
            $('body').removeClass('stop-scrolling');

            var id = $(this).data('id');

            ke.ui.pro_alert.opened = false;
            
            if (typeof ga != "undefined") ga('send', 'event', 'pro', 'alert-closed', id);
        }
    });

})();