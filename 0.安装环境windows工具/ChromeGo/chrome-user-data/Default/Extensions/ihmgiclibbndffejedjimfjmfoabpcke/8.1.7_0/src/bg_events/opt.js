(function (undefined) {

    pl.extend(ke.app.handlers._processEventHandlers.app.opt, {
        generateDropdownHtml: function (data, sendResponse) {
            ke.app.handlers.generateDropdownHtml();
            sendResponse({
                old_data: data
            });
        },

        newTab: function (data, sendResponse) {
            chrome.tabs.create({url: data.url});
        },

        sendEmail: function () {
            let pro_subj = ke.ext.util.storageUtil.isTrueOption('chr_pro_flag') ?
                ' Pro User Support'
                : '';

            chrome.tabs.create({
                url: "mailto:support@matetranslate.com?subject=Mate for "
                + ke.browserName
                + " v" + ke.ext.util.storageUtil.getVal('ext_ver')
                + pro_subj
            }, function (tab) {
                setTimeout(function () {
                    chrome.tabs.remove(tab.id);
                }, 500);
            });
        },

        openHC: function () {
            chrome.tabs.create({
                url: "https://help.gikken.co/hc/"
            });
        },

        showOtherApps: function () {
            chrome.tabs.create({
                url: "https://gikken.co/mate-translate/download?ref=" + ke.browserName
            });
        },

        shareViaEmail: function () {
            chrome.tabs.create({
                url: "mailto:?subject=Mate Translate for "
                + ke.browserName
                + "&body=Hi, check out Mate! It's the best translator extension for "
                + ke.browserName + ": "
                + ke.storeLink
            }, function (tab) {
                setTimeout(function () {
                    chrome.tabs.remove(tab.id);
                }, 500);
            });
        },

        downloadFile: function (data) {
            chrome.tabs.create({
                url: data.url
            }, function (tab) {
                setTimeout(function () {
                    chrome.tabs.remove(tab.id);
                }, 2500); // idk when to close the tab actually
            });
        },

        attactContentFile: function(data, sendResponse, sender) {
            chrome.tabs.executeScript(sender.tab.id, {
                file: data.src
            }, function() {
                sendResponse();
            });
        },

        chainRequestBackgroundOption: function (data, sendResponse) {
            ke.ext.util.storageUtil.chainRequestBackgroundOption(data.calls, sendResponse, true);
        },

        closeLoginPopup: function (data, sendResponse) {
            chrome.tabs.query({}, function (tabs) {
                var to_close_id = null;
                var to_send_ids = [];

                tabs.forEach(function (tab) {
                    if (!tab.url) {
                        return;
                    }

                    if (tab.url.indexOf('pages/public/login.html') > -1) {
                        to_close_id = tab.id;
                    } else if (tab.url.indexOf('pages/public') > -1) {
                        to_send_ids.push(tab.id);
                    }
                });

                if (to_close_id !== null) {
                    chrome.tabs.remove(to_close_id);
                }

                to_send_ids.forEach(function (id) {
                    chrome.tabs.sendMessage(id, {
                        action: ke.processCall('app', 'login', 'done')
                    });
                });
            });
        },

        revokeToken: function (data, sendResponse) {
            $.ajax({
                url: 'https://sync.matetranslate.com/revoke_token',
                type: 'GET',
                dataType: 'json',
                data: {
                    token: ke.ext.util.storageUtil.getVal('account_token')
                },
                success: function (r) {
                    if (r.success) {
                    }

                    ke.app.handlers._processEventHandlers.app.opt.updateUninstallUri();
                }
            });
        },

        updateUninstallUri: function (data, sendResponse) {
            var token = ke.ext.util.storageUtil.getVal('account_token');
            var data = {
                rid: ke.ext.util.storageUtil.getVal('farewell_survey') === ke.ext.const.storage.FAREWELL_NEW
                    ? 1
                    : 2,
                d: ke.PLATFORM_CODE,
                d_id: ke.ext.util.storageUtil.getVal('user_id'),
                l: ke.getLocale('@@ui_locale'),
                id: ke.ext.util.storageUtil.getIntValue('install_date'),
                v: ke.ext.util.storageUtil.getVal('ext_ver'),
                g: ke.ext.util.storageUtil.isTrueOption('gdpr_consent')
            };

            $.extend(data, ke.ext.util.storageUtil.getDecodedVal('all_trans_count'));

            if (token) {
                data.t = token;
                delete data.d;
            }

            // double check it's less than 255 characters,
            // because otherwise the whole extension won't load
            var uninstall_uri = ('https://sync.matetranslate.com/del_dev?' + $.param(data)).substr(0, 255);

            chrome.runtime.setUninstallURL(uninstall_uri);
        },

        saveSettingsPersistently: function (data, sendResponse) {
            if (!ke.IS_SAFARI) {
                var obj = {};
                obj[data.field.toUpperCase()] = data.value;
                chrome.storage.local.set(obj);
            }
        }
    });

})();
