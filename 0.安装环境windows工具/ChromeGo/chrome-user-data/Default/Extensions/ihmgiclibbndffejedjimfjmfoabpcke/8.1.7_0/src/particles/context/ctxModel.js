(function (undefined) {

    var getLangSetByMenuId = function (id) {
        return ke.app.temp.menus[id];
    };

    pl.extend(ke.particles.context.model, {
        onMenuClick: function (info, tab) {
            var data = getLangSetByMenuId(info.menuItemId);

            if (data != null) {
                var to_check = [];
                if (info) to_check.push(info.srcUrl);
                if (tab) to_check.push(tab.url);

                var pdf = false;
                var local_file = false;
                pl.each(to_check, function (k, v) {
                    if (v && v.indexOf('.pdf') >= 0) {
                        pdf = true;
                    }
                });

                if (!pdf && info.srcUrl && info.srcUrl.indexOf("about:blank") > -1) {
                    local_file = true;
                }

                if (pdf || local_file) {
                    window.open("../public/pdf_tooltip.html#" + data.from + "|" + data.to + "|" + info.selectionText, "_blank", "width=337, height=300, top=185, left=235");
                } else {
                    chrome.tabs.sendMessage(tab.id, {
                        action: ke.processCall('app', 'trans', 'displayAsTooltip'),
                        message: info.selectionText,
                        from: data.from,
                        to: data.to
                    });
                }
            }
        }
    });

})();