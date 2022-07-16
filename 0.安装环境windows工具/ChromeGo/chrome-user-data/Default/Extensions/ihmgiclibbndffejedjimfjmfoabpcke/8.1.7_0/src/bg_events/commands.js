/**
 * Created by chernikovalexey on 8/23/15.
 */
(function (undefined) {

    pl.extend(ke.app.handlers._processEventHandlers.app.commands, {
        sendAnalyticsEvent: function (data, sendResponse) {
            if (typeof ga != "undefined") {
                ga("send", "event", data.cat, data.event, data.subevent);
            }
        }
    });

})();