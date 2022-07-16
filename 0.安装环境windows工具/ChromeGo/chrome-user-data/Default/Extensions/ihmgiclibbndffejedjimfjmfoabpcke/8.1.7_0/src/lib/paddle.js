window.PaddleScriptLocation = null;
try {
    var loadedScripts = document.getElementsByTagName("script");
    window.PaddleScriptLocation = (document.currentScript || loadedScripts[loadedScripts.length - 1]).src;
    window.PaddleScriptLocation = window.PaddleScriptLocation.split('?')[0];
} catch (ignore) {
}
var _Paddle = (function Paddle(_window, libraryVersion) {
    function isFirefox() {
        var userAgent = navigator.userAgent || navigator.vendor || window.opera;
        return userAgent.match(/Firefox/i) ? true : false;
    }

    return function PaddleConstruct(_window, libraryVersion) {
        var _this = this;
        var _options = {
            debug: false,
            enableTracking: true,
            poweredByBadge: true,
            loadMethod: 'Direct',
            vendor: null,
            eventCallback: null,
            sdk: false,
            sdkAttributes: null,
            completeDetails: false,
            checkoutVariant: null,
            upsellCheckbox: false
        };
        var _prices = {};
        var _activeCheckout = {};
        var _checkoutVariants = [{control: true, variant: 'multipage', weight: 1}, {
            control: false,
            variant: 'multipage-compact-payment',
            weight: 1
        }, {control: false, variant: 'multipage-radio-payment', weight: 1}, {
            control: false,
            variant: 'multipage-radio-payment-selected',
            weight: 1
        }];
        var _env = {
            current: 'production',
            defaults: {
                local: {
                    checkoutBase: 'https://checkout.paddle.local:8443/checkout/product/',
                    internalCheckoutBase: 'https://checkout.paddle.local:8443/checkout/tool/',
                    pricesApi: 'https://checkout.paddle.local:8443/api/1.0/prices',
                    dataApi: 'https://checkout.paddle.local:8443/api/1.0/data',
                    orderApi: 'https://checkout.paddle.local:8443/api/1.0/order',
                    audienceApi: 'https://checkout.paddle.local:8443/api/1.0/audience/{vendor_id}/add',
                    userHistoryApi: 'https://checkout.paddle.com:8443/api/2.0/user/history',
                    analyticsKey: '8b03159305e2c0f49bf7481c073a4819',
                    affiliateAnalyticsKey: '8be7b8d69526697e7ae22aff30d34603',
                    consentMessageTranslationAPI: 'https://checkout.paddle.local:8443/ajax/consent-message'
                },
                dev: {
                    checkoutBase: 'https://dev-checkout.paddle.com/checkout/product/',
                    internalCheckoutBase: 'https://dev-checkout.paddle.com/checkout/tool/',
                    pricesApi: 'https://dev-checkout.paddle.com/api/1.0/prices',
                    dataApi: 'https://dev-checkout.paddle.com/api/1.0/data',
                    orderApi: 'https://dev-checkout.paddle.com/api/1.0/order',
                    audienceApi: 'https://dev-checkout.paddle.com/api/1.0/audience/{vendor_id}/add',
                    userHistoryApi: 'https://dev-checkout.paddle.com/api/2.0/user/history',
                    analyticsKey: '8b03159305e2c0f49bf7481c073a4819',
                    affiliateAnalyticsKey: '8be7b8d69526697e7ae22aff30d34603',
                    consentMessageTranslationAPI: 'https://dev-checkout.paddle.com/ajax/consent-message'
                },
                staging: {
                    checkoutBase: 'https://staging-checkout.paddle.com/checkout/product/',
                    internalCheckoutBase: 'https://staging-checkout.paddle.com/checkout/tool/',
                    pricesApi: 'https://staging-checkout.paddle.com/api/1.0/prices',
                    dataApi: 'https://staging-checkout.paddle.com/api/1.0/data',
                    orderApi: 'https://staging-checkout.paddle.com/api/1.0/order',
                    audienceApi: 'https://staging-checkout.paddle.com/api/1.0/audience/{vendor_id}/add',
                    userHistoryApi: 'https://staging-checkout.paddle.com/api/2.0/user/history',
                    analyticsKey: '8b03159305e2c0f49bf7481c073a4819',
                    affiliateAnalyticsKey: '8be7b8d69526697e7ae22aff30d34603',
                    consentMessageTranslationAPI: 'https://staging-checkout.paddle.com/ajax/consent-message'
                },
                production: {
                    checkoutBase: 'https://checkout.paddle.com/checkout/product/',
                    internalCheckoutBase: 'https://checkout.paddle.com/checkout/tool/',
                    pricesApi: 'https://checkout.paddle.com/api/1.0/prices',
                    dataApi: 'https://checkout.paddle.com/api/1.0/data',
                    orderApi: 'https://checkout.paddle.com/api/1.0/order',
                    audienceApi: 'https://checkout.paddle.com/api/1.0/audience/{vendor_id}/add',
                    userHistoryApi: 'https://checkout.paddle.com/api/2.0/user/history',
                    analyticsKey: '3cca81641d7d36dd0223d8a5615ae36a',
                    affiliateAnalyticsKey: '05150e015258048ddbc1aa7188718750',
                    consentMessageTranslationAPI: 'https://checkout.paddle.com/ajax/consent-message'
                }
            }
        };
        var _defaults = {
            includeBrowserInCampaignSummary: false,
            analyticsCookie: 'paddlejs_checkout',
            affiliateAnalyticsCookie: 'paddlejs_affiliate_analytics',
            devmateCookie: '_dmsid',
            popupCookie: 'paddlejs_popup',
            campaignCookiePrefix: 'paddlejs_campaign_',
            campaignCookieExpiresDays: 30,
            checkoutVariantCookie: 'paddlejs_checkout_variant',
            checkoutVariantCookieExpiresDays: 90,
            paddleCssFile: chrome.extension.getURL('/res/styles/lib/paddle.css'),
            animationCssFile: chrome.extension.getURL('/res/styles/lib/paddle.css'),
            popupWindow: {
                width: 370,
                height: 470,
                location: 'yes',
                menubar: 'no',
                resizable: 'yes',
                scrollbars: 'yes',
                status: 'no',
                toolbar: 'no'
            },
            domainCategories: {
                'paddle.com': {name: 'Paddle', type: 'Marketplace'},
                'creatable': {name: 'Creatable', type: 'Marketplace'},
                'facebook.com': {name: 'Facebook', type: 'Social'},
                'fb.com': {name: 'Facebook', type: 'Social'},
                't.co': {name: 'Twitter', type: 'Social'},
                'twitter.com': {name: 'Twitter', type: 'Social'},
                'reddit.com': {name: 'Reddit', type: 'Social'},
                'medium.com': {name: 'Medium', type: 'Social'},
                'news.ycombinator.com': {name: 'Hacker News', type: 'Social'},
                'designernews.com': {name: 'Designer News', type: 'Social'},
                'producthunt.com': {name: 'Product Hunt', type: 'Social'},
                'paypal.com': {name: 'Paddle', type: 'Marketplace'},
                'my.paddle.com': {name: 'Paddle', type: 'Marketplace'},
                'cultofmac.com': {name: 'Cult of Mac', type: 'Article'},
                'mail.yahoo': {name: 'Yahoo Mail', type: 'Email'},
                'mail.google': {name: 'Gmail', type: 'Email'},
                'gmail': {name: 'Gmail', type: 'Email'},
                'mail.google.com': {name: 'Gmail', type: 'Email'},
                'mail.live': {name: 'Live Mail', type: 'Email'},
                'mail.aol.com': {name: 'Aol Mail', type: 'Email'},
                'mail.qq.com': {name: 'QQ Mail', type: 'Email'},
                'mail.comcast.net': {name: 'Comcast Mail', type: 'Email'},
                'earthlink.net': {name: 'Earthlink Mail', type: 'Email'},
                'bing': {name: 'Bing', type: 'Search'},
                'yahoo': {name: 'Yahoo', type: 'Search'},
                'google': {name: 'Google', type: 'Search'},
                'localhost': {name: 'Localhost', type: 'Local'}
            }
        };
        var _status = {};
        this.Environment = {
            detect: function () {
                if (typeof _util.urlParam('paddle_env') != 'undefined' && _util.urlParam('paddle_env') != '') {
                    _this.Debug('Environment Detected: ' + _util.urlParam('paddle_env'));
                    this.set(_util.urlParam('paddle_env'));
                } else {
                    _this.Debug('Environment Detected: ' + this.get());
                }
            }, get: function () {
                return _env.current;
            }, set: function (environment) {
                _this.Debug('Changing environment to: ' + environment);
                _env.current = environment;
            }, defaults: function () {
                return _env.defaults[_env.current];
            }
        };
        this.Status = {
            loadedAnalytics: false,
            loadedAffiliateAnalytics: false,
            failedLoadingAnalytics: false,
            failedLoadingAffiliateAnalytics: false,
            loadedButtonStylesheet: false,
            loadedAnimationStylesheet: false,
            libraryVersion: libraryVersion
        };
        this.Options = function (options) {
            if (typeof options == 'object') {
                for (var option in options) {
                    if (options.hasOwnProperty(option)) {
                        if (_options.hasOwnProperty(option)) {
                            if (option == 'vendor') {
                                if (options[option] !== parseInt(options[option], 10)) {
                                    throw new Error("[PADDLE] The option parameter 'vendor' must be an integer.");
                                }
                                if (options[option] == 1234567) {
                                    throw new Error("[PADDLE] You must specify a valid Paddle Vendor ID as the 'vendor' attribute of passed to Paddle.Setup() or Paddle.Options(). The provided Vendor ID '1234567' is invalid and used for example purposes. You can get your Paddle Vendor ID from the 'Integrations' tab of the following page: https://vendors.paddle.com/account");
                                }
                            } else if (option == 'sdkAttributes') {
                                _options.sdkAttributes = options.sdkAttributes;
                            }
                            _this.Debug("Set option '" + option + "' to '" + options[option] + "'.");
                            if (option != 'sdkAttributes') {
                                _options[option] = options[option];
                            }
                        } else {
                            throw new Error("[PADDLE] Unknown option parameter '" + option + "'");
                        }
                    }
                }
            } else {
                throw new Error("[PADDLE] The Options() method accepts an object of options values.");
            }
        };
        this.Setup = function (options) {
            if (!window.PaddleCompletedSetup) {
                if (typeof options != 'undefined' && typeof options == 'object') {
                    if (typeof options.vendor != 'undefined') {
                        _this.Options(options);
                    } else {
                        throw new Error("[PADDLE] You must specify your Paddle Vendor ID during within the Paddle.Setup(); method. See 'Basic Setup' in the Paddle.js documentation: https://www.paddle.com/docs/paddle-js-overlay-checkout");
                    }
                }
                if (!_options.checkoutVariant) {
                    if (_util.getCookie(_defaults.checkoutVariantCookie) && _util.getCookie(_defaults.checkoutVariantCookie) != '') {
                        _options.checkoutVariant = JSON.parse(_util.getCookie(_defaults.checkoutVariantCookie));
                    } else {
                        var variantData = _util.chooseCheckoutVariant();
                        _options.checkoutVariant = {
                            inTest: true,
                            controlGroup: variantData.control,
                            variant: variantData.variant
                        };
                        _util.setCookie(_defaults.checkoutVariantCookie, JSON.stringify(_options.checkoutVariant), _defaults.checkoutVariantCookieExpiresDays);
                    }
                } else {
                    _options.checkoutVariant = {
                        inTest: false,
                        controlGroup: false,
                        variant: _options.checkoutVariant || 'multipage'
                    };
                }
                _this.Analytics.track('Paddle.Library.Loaded', {'Script.Location': window.PaddleScriptLocation || null}, {});
                _this.Affiliate.Event('Visit');
                _this.Analytics.trackPageview();
                _this.Animation.addStylesheet();
                _this.Button.addStylesheet();
                if (_util.isMobile()) {
                    _this.Debug('Mobile session detected.');
                }
                _this.Button.load();
                _this.Download.load();
                window.PaddleCompletedSetup = true;
                _this.Debug('Completed library setup.');
                _util.listen();
                _this.Environment.detect();
                _util.campaignAttributes();
                _util.detectAutoOpen();
            } else {
                _this.Debug('Cannot call Paddle.Setup() more than once per page, the call was ignored.', 'warning');
            }
        };
        this.User = {
            History: function (email, product_id, callback) {
                var product_id = typeof product_id == 'undefined' ? null : product_id;
                if (email != '') {
                    _this.Analytics.track('Paddle.User.History', {}, {'ProductID': product_id || null});
                    var productFilter = '';
                    if (product_id) {
                        productFilter = '&product_id=' + product_id;
                    }
                    _util.jsonp(_this.Environment.defaults().userHistoryApi + '?email=' + encodeURIComponent(email) + '&vendor_id=' + _options.vendor + productFilter, function (data) {
                        if (typeof callback == 'function') {
                            callback(data);
                        } else {
                            alert(data.message);
                        }
                    });
                } else {
                    if (typeof callback == 'function') {
                        callback({
                            "success": false,
                            "error": {"code": 107, "message": "A valid email address is required, please try again"}
                        });
                    } else {
                        alert('You must enter a valid email address.');
                    }
                }
            }
        };
        this.Product = {
            Price: function (amountType, productId, quantity, callback) {
                _this.Analytics.track('Paddle.Prices.SinglePrice', {}, {
                    'ProductID': productId,
                    'AmountType': amountType
                });
                if (typeof quantity == 'undefined') {
                    var quantity = 1;
                } else if (quantity <= 0) {
                    var quantity = 1;
                }
                var priceData = _util.getPrices(productId, quantity, function (priceData) {
                    if (typeof callback != 'undefined') {
                        if (typeof priceData.price != 'undefined') {
                            if (amountType == 'gross') {
                                callback(priceData.price.gross || false);
                            } else if (amountType == 'tax') {
                                callback(priceData.price.tax || false);
                            } else if (amountType == 'net') {
                                callback(priceData.price.net || false);
                            } else if (amountType == 'tax_included') {
                                callback(priceData.price.tax_included || false);
                            } else {
                                callback(false);
                            }
                        } else {
                            callback(false);
                        }
                    }
                });
            }, Prices: function (productId, quantity, callback) {
                _this.Analytics.track('Paddle.Prices.MultiPrice', {}, {'ProductID': productId});
                if (typeof quantity == 'function') {
                    var callback = quantity;
                    var quantity = 1;
                }
                var priceData = _util.getPrices(productId, quantity, function (priceData) {
                    if (typeof callback != 'undefined' && typeof callback == 'function') {
                        callback(priceData);
                    }
                });
            }
        };
        this.Order = {
            _pollAttempts: [],
            _maxPollAttempts: 10,
            _polling: [],
            DetailsPopup: function (checkoutHash, processingMessage) {
                var popupInstance = '_' + Math.ceil(Math.random() * 10000000);
                var processingMessage = typeof processingMessage != 'undefined' ? processingMessage : 'Fetching Order Details...';
                var popupHtml = '<div class="paddle-popup paddle-animated paddle-bounceIn">';
                popupHtml += '<div class="paddle-popup-close paddle-inset-close">';
                popupHtml += '<a class="paddle-popup-close-image" href="javascript:;"><img src="https://cdn.paddle.com/paddle/assets/images/close-dark.png" border="0" /></a>';
                popupHtml += '</div>';
                popupHtml += '<div class="paddle-popup-inner paddle-no-padding" style="background-color: #FFFFFF !important;">';
                popupHtml += '<div class="paddle-popup-order-loading paddle-popup-order-loading_' + popupInstance + '">';
                popupHtml += '<div class="paddle-popup-order-spinner"><img src="https://cdn.paddle.com/paddle/assets/images/loading.gif" style="width: 50px; height: 50px;" /></div>';
                popupHtml += '<div class="paddle-popup-order-loading-text paddle-order-loading-text_' + popupInstance + '">' + processingMessage + '</div>';
                popupHtml += '</div>';
                popupHtml += '<div class="paddle-popup-order-error paddle-popup-order-error_' + popupInstance + ' paddle-fadeInDown paddle-hidden">';
                popupHtml += 'Your receipt and purchase information have been sent to the email address used during purchase.';
                popupHtml += '</div>';
                popupHtml += '<div class="paddle-popup-order paddle-popup-order_' + popupInstance + ' paddle-fadeInDown paddle-hidden">';
                popupHtml += 'Order details go here...';
                popupHtml += '</div>';
                popupHtml += '</div>';
                popupHtml += '</div>';
                _util.ready(function () {
                    var body = document.getElementsByTagName('body')[0];
                    var orderPopup = document.createElement('div');
                    orderPopup.setAttribute('class', 'paddle-reset paddle-popup-container paddle-popup-instance_' + popupInstance + ' paddle-animated paddle-fadeIn paddle-hidden');
                    orderPopup.innerHTML = popupHtml;
                    body.appendChild(orderPopup);
                    var close = document.getElementsByClassName('paddle-popup-instance_' + popupInstance)[0].getElementsByClassName('paddle-popup-close-image')[0];
                    close.onclick = function (e) {
                        e.preventDefault();
                        _this.Popup.hide(popupInstance, 'order');
                    };
                    _this.Popup.show(popupInstance, 'Order', 'order');
                    _this.Order.details(checkoutHash, function (data) {
                        if (data) {
                            if (data.state == 'processed') {
                                var popupContent = '<div class="paddle-popup-order-details">';
                                popupContent += '<div class="paddle-popup-order-top">';
                                popupContent += '<div class="paddle-popup-order-icon">';
                                popupContent += '<img src="' + data.checkout.image_url + '" border="0" />';
                                popupContent += '</div>';
                                popupContent += '<div class="paddle-popup-order-product">';
                                popupContent += data.checkout.title;
                                popupContent += '</div>';
                                popupContent += '<div style="clear:both;"></div>';
                                popupContent += '</div>';
                                popupContent += '<div class="paddle-popup-order-summary">';
                                popupContent += '<div class="paddle-popup-order-number">';
                                popupContent += 'Order #' + data.order.order_id;
                                popupContent += '</div>';
                                popupContent += '<div class="paddle-popup-order-amount">';
                                popupContent += data.order.formatted_total;
                                popupContent += '</div>';
                                popupContent += '<div class="paddle-popup-order-receipt">';
                                popupContent += '<a href="' + data.order.receipt_url + '" target="_blank" class="paddle-popup-order-receipt-button paddle-popup-order-receipt-button_' + popupInstance + '">View Receipt</a>';
                                popupContent += '</div>';
                                popupContent += '<div style="clear:both;"></div>';
                                popupContent += '</div>';
                                if (data.order.has_locker) {
                                    popupContent += '<div class="paddle-popup-order-locker">';
                                    if (data.lockers.length > 1) {
                                        popupContent += '<div class="paddle-popup-order-nolocker">';
                                        popupContent += "<strong>Thanks for your purchase!</strong><br /><br />";
                                        popupContent += "We've emailed your receipt and details of how to access your products to <strong>" + data.order.customer.email + "</strong>.";
                                        popupContent += '</div>';
                                    } else {
                                        data.lockers.forEach(function (locker) {
                                            popupContent += '<div class="paddle-popup-locker-item">';
                                            if (typeof locker.download != 'undefined' && locker.download != '') {
                                                popupContent += '<div class="paddle-popup-locker-row-button">';
                                                popupContent += '<a href="' + locker.download + '" target="_blank" class="paddle-popup-locker-row-button-link paddle-popup-order-download-button_' + popupInstance + '">Download</a>';
                                                popupContent += '</div>';
                                            }
                                            if (typeof locker.license_code != 'undefined' && locker.license_code != '') {
                                                popupContent += '<div class="paddle-popup-locker-row">';
                                                popupContent += '<div class="paddle-popup-locker-row-top">';
                                                popupContent += '<div class="paddle-popup-locker-row-heading">License Code</div>';
                                                popupContent += '<div style="clear:both;"></div>';
                                                popupContent += '</div>';
                                                popupContent += '<div class="paddle-popup-locker-license">';
                                                popupContent += '<pre class="paddle-popup-pre">' + locker.license_code + '</pre>';
                                                popupContent += '</div>';
                                                popupContent += '</div>';
                                            }
                                            if (typeof locker.instructions != 'undefined' && locker.instructions != '') {
                                                locker.instructions = locker.instructions.replace(/\\"/g, '"').trim();
                                                popupContent += '<div class="paddle-popup-locker-row">';
                                                popupContent += '<div class="paddle-popup-locker-row-top">';
                                                popupContent += '<div class="paddle-popup-locker-row-heading">Instructions &amp; Information</div>';
                                                popupContent += '<div style="clear:both;"></div>';
                                                popupContent += '</div>';
                                                popupContent += '<div class="paddle-popup-locker-instructions">';
                                                popupContent += _util.nl2br(locker.instructions);
                                                popupContent += '</div>';
                                                popupContent += '</div>';
                                            }
                                            popupContent += '</div>';
                                        });
                                    }
                                    popupContent += '</div>';
                                } else {
                                    popupContent += '<div class="paddle-popup-order-nolocker">';
                                    popupContent += "We've emailed details of how to access your purchases, as well as the information above to <strong>" + data.order.customer.email + "</strong>.";
                                    popupContent += '</div>';
                                }
                                popupContent += '<div class="paddle-popup-order-problem">';
                                popupContent += 'Something wrong? <a href="mailto:help+pjs_' + data.order.order_id + '_' + checkoutHash + '_order@paddle.com" class="paddle-popup-order-problem-link paddle-popup-order-problem-link_' + popupInstance + '">Contact Support</a>';
                                popupContent += '<div class="paddle-popup-order-emailed-reminder">We\'ve also emailed the above information to: <strong>' + data.order.customer.email + '</strong></div>';
                                popupContent += '</div>';
                                var orderPopupContent = document.getElementsByClassName('paddle-popup-order_' + popupInstance)[0];
                                orderPopupContent.innerHTML = ke.IS_OPERA
                                    ? ke.ext.string.safeResponse.cleanDomString(popupContent)
                                    : popupContent;
                                _util.hide(document.getElementsByClassName('paddle-popup-order-loading_' + popupInstance)[0]);
                                if (typeof document.getElementsByClassName('paddle-popup-order-problem-link_' + popupInstance)[0] != 'undefined') {
                                    document.getElementsByClassName('paddle-popup-order-problem-link_' + popupInstance)[0].onclick = function (e) {
                                        _this.Analytics.track('Paddle.Order.Details.Contact', {}, {});
                                    };
                                }
                                if (typeof document.getElementsByClassName('paddle-popup-order-download-button_' + popupInstance)[0] != 'undefined') {
                                    document.getElementsByClassName('paddle-popup-order-download-button_' + popupInstance)[0].onclick = function (e) {
                                        _this.Analytics.track('Paddle.Download.Start', {}, {'ViaOrderDetails': true});
                                    };
                                }
                                if (typeof document.getElementsByClassName('paddle-popup-order-receipt-button_' + popupInstance)[0] != 'undefined') {
                                    document.getElementsByClassName('paddle-popup-order-receipt-button_' + popupInstance)[0].onclick = function (e) {
                                        _this.Analytics.track('Paddle.Order.Details.Receipt', {}, {});
                                    };
                                }
                                _util.show(orderPopupContent);
                            } else {
                                _util.hide(document.getElementsByClassName('paddle-popup-order-loading_' + popupInstance)[0]);
                                _util.show(document.getElementsByClassName('paddle-popup-order-error_' + popupInstance)[0]);
                            }
                        } else {
                            _util.hide(document.getElementsByClassName('paddle-popup-order-loading_' + popupInstance)[0]);
                            _util.show(document.getElementsByClassName('paddle-popup-order-error_' + popupInstance)[0]);
                        }
                    }, false);
                });
            },
            details: function (checkoutHash, callback, showLoader) {
                _this.Order._polling[checkoutHash] = typeof _this.Order._polling[checkoutHash] != 'undefined' ? _this.Order._polling[checkoutHash] : false;
                if (!_this.Order._polling[checkoutHash]) {
                    _this.Analytics.track('Paddle.Order.Details', {}, {'CheckoutID': checkoutHash});
                    if (typeof showLoader == 'undefined') {
                        var showLoader = true;
                    }
                    if (showLoader) {
                        _this.Spinner.show();
                    }
                    _this.Order.poll(checkoutHash, function (data) {
                        if (showLoader) {
                            _this.Spinner.hide();
                        }
                        if (typeof callback == 'function') {
                            _this.Debug('Order details API response successfully passed to callback: ' + callback);
                            callback(data);
                        } else {
                            _this.Debug('No callback specified for Order Data success.', 'warning', true);
                        }
                    });
                } else {
                    _this.Debug('Call to Order.details() rejected as a call is already in progress.', 'error', true);
                }
            },
            poll: function (checkoutHash, callback) {
                if (_this.Order._polling[checkoutHash] !== true) {
                    _this.Analytics.track('Paddle.Order.Details.Poll.Start', {}, {'CheckoutID': checkoutHash});
                }
                _this.Order._polling[checkoutHash] = true;
                _util.jsonp(_this.Environment.defaults().orderApi + '?checkout_id=' + checkoutHash, function (data) {
                    if (typeof data.success != 'undefined' && !data.success) {
                        _this.Order._polling[checkoutHash] = false;
                        _this.Spinner.hide();
                        _this.Debug(data.error.message, 'error', true);
                        _this.Analytics.track('Paddle.Order.Details.Poll.Error', {}, {Message: data.error.message});
                        if (typeof callback == 'function') {
                            callback(false);
                        } else {
                            alert('Sorry, there was an error retrieving the requested order details.');
                        }
                    } else {
                        if (data.state != 'processed') {
                            _this.Order._pollAttempts[checkoutHash] = typeof _this.Order._pollAttempts[checkoutHash] != 'undefined' ? _this.Order._pollAttempts[checkoutHash] : 0;
                            if (_this.Order._pollAttempts[checkoutHash] <= _this.Order._maxPollAttempts) {
                                _this.Order._pollAttempts[checkoutHash]++;
                                setTimeout(function () {
                                    _this.Order.poll(checkoutHash, callback);
                                }, 600);
                            } else {
                                _this.Order._polling[checkoutHash] = false;
                                _this.Spinner.hide();
                                _this.Debug('Order stopped polling as maximum attempts of ' + _this.Order._maxPollAttempts + ' reached.', 'error', true);
                                _this.Analytics.track('Paddle.Order.Details.Poll.NoResult', {}, {});
                                if (typeof callback == 'function') {
                                    callback(false);
                                } else {
                                    alert('Your order has been completed, please check your email for further information.');
                                }
                            }
                        } else {
                            _this.Order._polling[checkoutHash] = false;
                            _this.Analytics.track('Paddle.Order.Details.Poll.Completed', {}, {'CheckoutID': checkoutHash});
                            _this.Debug('Order details retrieved successfully from Paddle API.');
                            if (typeof callback == 'function') {
                                callback(data);
                            } else {
                                _this.Debug('Callback passed to details() is not a function.', 'warning');
                            }
                        }
                    }
                });
            }
        };
        this.Download = {
            load: function () {
                _util.ready(function () {
                    var buttonCounter = 0;
                    _util.each('paddle_download', function (buttonElement) {
                        var _buttonHasInit = (buttonElement.getAttribute('data-init') == 'true');
                        if (!_buttonHasInit) {
                            buttonElement.setAttribute('data-init', 'true');
                            var downloadProductId = buttonElement.getAttribute('data-download') || false;
                            var downloadUrl = buttonElement.getAttribute('data-download-url') || false;
                            var prompt = (buttonElement.getAttribute('data-download-prompt') == 'false') ? false : true;
                            var heading = buttonElement.getAttribute('data-download-heading') || false;
                            var subHeading = buttonElement.getAttribute('data-download-subheading') || false;
                            var cta = buttonElement.getAttribute('data-download-cta') || false;
                            var popupAttributes = {heading: heading, subHeading: subHeading, cta: cta};
                            buttonElement.onclick = function (e) {
                                e.preventDefault();
                                if (downloadProductId || downloadUrl) {
                                    if (downloadProductId) {
                                        var productDownloadUrl = _this.Download.GetURLFromID(downloadProductId);
                                        if (productDownloadUrl) {
                                            if (prompt) {
                                                _this.Download.StartWithPrompt(productDownloadUrl, downloadProductId, popupAttributes);
                                            } else {
                                                _this.Download.Start(productDownloadUrl, downloadProductId);
                                            }
                                        }
                                    } else if (downloadUrl) {
                                        if (prompt) {
                                            _this.Download.StartWithPrompt(downloadUrl, false, popupAttributes);
                                        } else {
                                            _this.Download.Start(downloadUrl);
                                        }
                                    }
                                }
                            };
                        }
                    });
                });
            }, StartWithPrompt: function (url, product_id, popupAttributes) {
                var product_id = typeof product_id != 'undefined' ? product_id : false;
                _this.Analytics.track('Paddle.Download.Prompt.Start', {}, {
                    'ProductID': product_id || false,
                    'DownloadUrl': url
                });
                var downloadPopup = _this.Audience.Popup({
                    triggers: {timed: false, exitIntent: false, scrollDepth: false},
                    strings: {
                        heading: (popupAttributes.heading) ? popupAttributes.heading : "Enter your email to download!",
                        subHeading: (popupAttributes.subHeading) ? popupAttributes.subHeading : "Enter your email address to begin the download.",
                        cta: (popupAttributes.cta) ? popupAttributes.cta : "Download!",
                        successMessage: null
                    },
                    callback: function (data) {
                        if (data.success) {
                            _this.Analytics.track('Paddle.Download.Prompt.Success', {}, {
                                'ProductID': product_id || false,
                                'DownloadUrl': url
                            });
                            _this.Download.Start(url, product_id);
                        }
                    }
                });
                _this.Popup.show(downloadPopup, 'Download', 'download');
            }, GetURLFromID: function (product_id) {
                if (typeof product_id != 'undefined' && product_id != '') {
                    return 'https://vendors.paddle.com/download/product/' + product_id;
                } else {
                    return false;
                }
            }, Start: function (url, product_id) {
                var product_id = typeof product_id != 'undefined' ? product_id : false;
                if (typeof url != 'undefined' && url != '') {
                    _this.Debug('Download started.');
                    _this.Analytics.track('Paddle.Download.Start', {}, {
                        'ProductID': product_id || false,
                        'DownloadUrl': url
                    });
                    _this.Affiliate.Event('Download');
                    window.location = url;
                } else {
                    _this.Debug('Unable to start download, no URL specified.', 'warning');
                }
            }
        };
        this.Popup = {
            show: function (popupInstance, method, type) {
                type = type || 'popup';
                method = method || 'Manual';
                if (method == 'Manual' || method == 'Download' || method == 'Order' || _this.Audience.AllowPopup()) {
                    _this.Debug("Popup triggered. (Method: " + method + " | Type: " + type + ")");
                    var popup = document.getElementsByClassName('paddle-popup-instance_' + popupInstance)[0] || false;
                    if (popup) {
                        if (method != 'Manual' && method != 'Download' && method != 'Order') {
                            _this.Audience.LogPopup();
                        }
                        _util.show(popup);
                    }
                    if (type == 'audience') {
                        _this.Analytics.track('Paddle.Audience.Popup.Show', {}, {'PopupMethod': method});
                    } else if (type == 'order') {
                        _this.Analytics.track('Paddle.Order.Popup.Show', {}, {});
                    } else if (type == 'download') {
                        _this.Analytics.track('Paddle.Download.Popup.Show', {}, {});
                    } else {
                        _this.Analytics.track('Paddle.Popup.Generic.Show', {}, {});
                    }
                } else {
                    _this.Debug("Popup trigger ignored, user has seen a popup recently.", "warning");
                }
            }, hide: function (popupInstance, type) {
                var type = typeof type != 'undefined' ? type : 'popup';
                var popup = document.getElementsByClassName('paddle-popup-instance_' + popupInstance)[0] || false;
                var popupBox = document.getElementsByClassName('paddle-popup-instance_' + popupInstance)[0].getElementsByClassName('paddle-popup')[0] || false;
                if (popup && popupBox) {
                    _this.Debug("Popup dismissed. (Type: " + type + ")");
                    _util.addClass(popupBox, 'paddle-fadeOutUpBig');
                    _util.addClass(popup, 'paddle-fadeOut');
                    setTimeout(function () {
                        _util.removeClass(popup, 'paddle-fadeOut');
                        _util.removeClass(popupBox, 'paddle-fadeOutUpBig')
                        _util.hide(popup);
                    }, 600);
                }
                if (type == 'audience') {
                    _this.Analytics.track('Paddle.Audience.Popup.Dismiss', {}, {});
                } else if (type == 'order') {
                    _this.Analytics.track('Paddle.Order.Popup.Dismiss', {}, {});
                } else if (type == 'download') {
                    _this.Analytics.track('Paddle.Download.Popup.Dismiss', {}, {});
                } else {
                    _this.Analytics.track('Paddle.Popup.Generic.Dismiss', {}, {});
                }
            }
        };
        this.Audience = {
            consentMessageTranslationHasLoaded: false,
            consentMessages: {base: '', translated: ''},
            LogPopup: function () {
                _util.setCookie(_defaults.popupCookie, '1', 6);
            },
            AllowPopup: function () {
                var popup = _util.getCookie(_defaults.popupCookie);
                if (!_this.Audience.consentMessageTranslationHasLoaded || (popup && popup == '1')) {
                    return false;
                }
                return true;
            },
            GeneratePopupHTML: function (attributes) {
                var popupHtml = '<div class="paddle-popup paddle-animated paddle-' + attributes.view.animations.show + '">';
                if (attributes.allowDismiss) {
                    popupHtml += '<div class="paddle-popup-close">';
                    popupHtml += '<a class="paddle-popup-close-image" href="#!"><img src="https://cdn.paddle.com/paddle/assets/images/close-' + attributes.dismissColor + '.png" border="0" /></a>';
                    popupHtml += '</div>';
                }
                var popupBackground = '';
                if (attributes.view.styles.popup.backgroundImage) {
                    popupBackground += 'background-image: url(\'' + attributes.view.styles.popup.backgroundImage + '\');';
                    if (attributes.view.styles.popup.backgroundSize) {
                        popupBackground += 'background-size: ' + attributes.view.styles.popup.backgroundSize + ';';
                    }
                    if (attributes.view.styles.popup.backgroundPosition) {
                        popupBackground += 'background-position: ' + attributes.view.styles.popup.backgroundPosition + ';';
                    }
                    if (attributes.view.styles.popup.backgroundRepeat) {
                        popupBackground += 'background-repeat: ' + attributes.view.styles.popup.backgroundRepeat + ';';
                    }
                }
                popupHtml += '<div class="paddle-popup-inner" style="background-color: ' + attributes.view.styles.popup.backgroundColor + '; ' + popupBackground + '">';
                if (attributes.strings.heading) {
                    popupHtml += '<div class="paddle-popup-heading" style="color: ' + attributes.view.styles.heading.textColor + ';">' + attributes.strings.heading + '</div>';
                }
                if (attributes.strings.subHeading) {
                    popupHtml += '<div class="paddle-popup-subheading" style="color: ' + attributes.view.styles.subHeading.textColor + ';">' + attributes.strings.subHeading + '</div>';
                }
                popupHtml += '<div class="paddle-popup-form">';
                popupHtml += '<input type="text" class="paddle-popup-field paddle-popup-email" placeholder="' + attributes.strings.emailPlaceholder + '" />';
                popupHtml += '<label class="paddle-popup-checkbox" for="newsletter-consent-input">';
                popupHtml += '<input class="paddle-popup-checkbox-input" id="newsletter-consent-input" type="checkbox">';
                popupHtml += '<span id="paddle-popup-marketing-consent-message" class="paddle-popup-checkbox-label">' + attributes.marketingConsentMessage + '</span>';
                popupHtml += '</label>';
                popupHtml += '<input type="button" class="paddle-popup-cta" value="' + attributes.strings.cta + '" style="color: ' + attributes.view.styles.cta.textColor + '; background-color: ' + attributes.view.styles.cta.backgroundColor + ';" />';
                popupHtml += '</div>';
                popupHtml += '</div>';
                popupHtml += '</div>';
                return popupHtml;
            },
            Popup: function (inputAttributes) {
                inputAttributes = inputAttributes || {};
                var vendorName = inputAttributes.vendorName || null;
                var popupInstance = '_' + Math.ceil(Math.random() * 10000000);
                var marketingConsentMessage = '';
                if (!vendorName) {
                    marketingConsentMessage = 'We can send you product ' +
                        'updates and offers via email. It is possible to opt-out ' +
                        'at any time.';
                    _this.Debug('You have not supplied "vendorName". This ' +
                        'will become a required parameter on May 9th 2018 ' +
                        'and will stop the audience popup showing if not ' +
                        'supplied.');
                }
                var attributes = {
                    vendorName: vendorName,
                    marketingConsentMessage: marketingConsentMessage,
                    triggers: {
                        exitIntent: (typeof(inputAttributes.triggers || {}).exitIntent != 'undefined') ? inputAttributes.triggers.exitIntent : true,
                        scrollDepth: (typeof(inputAttributes.triggers || {}).scrollDepth != 'undefined') ? inputAttributes.triggers.scrollDepth : false,
                        timed: (typeof(inputAttributes.triggers || {}).timed != 'undefined') ? inputAttributes.triggers.timed : false
                    },
                    allowDismiss: (typeof inputAttributes.allowDismiss != 'undefined') ? inputAttributes.allowDismiss : true,
                    dismissColor: (typeof inputAttributes.dismissColor != 'undefined') ? inputAttributes.dismissColor : 'dark',
                    strings: {
                        heading: (typeof(inputAttributes.strings || {}).heading != 'undefined') ? inputAttributes.strings.heading : "Subscribe for updates!",
                        subHeading: (typeof(inputAttributes.strings || {}).subHeading != 'undefined') ? inputAttributes.strings.subHeading : "Subscribe to our email newsletter, and stay updated with our latest products, developments and offers.",
                        emailPlaceholder: (typeof(inputAttributes.strings || {}).emailPlaceholder != 'undefined') ? inputAttributes.strings.emailPlaceholder : "Email Address...",
                        cta: (typeof(inputAttributes.strings || {}).cta != 'undefined') ? inputAttributes.strings.cta : "Subscribe!",
                        successMessage: (typeof(inputAttributes.strings || {}).successMessage != 'undefined') ? inputAttributes.strings.successMessage : "Success! You are now subscribed!"
                    },
                    view: {
                        animations: {
                            show: (typeof((inputAttributes.view || {}).animations || {}).show != 'undefined') ? inputAttributes.view.animations.show : "bounceIn",
                            hide: (typeof((inputAttributes.view || {}).animations || {}).hide != 'undefined') ? inputAttributes.view.animations.hide : "fadeOutUpBig"
                        },
                        styles: {
                            heading: {textColor: (typeof(((inputAttributes.view || {}).styles || {}).heading || {}).textColor != 'undefined') ? inputAttributes.view.styles.heading.textColor : "#000000"},
                            subHeading: {textColor: (typeof(((inputAttributes.view || {}).styles || {}).subHeading || {}).textColor != 'undefined') ? inputAttributes.view.styles.subHeading.textColor : "#666666"},
                            popup: {
                                backgroundColor: (typeof(((inputAttributes.view || {}).styles || {}).popup || {}).backgroundColor != 'undefined') ? inputAttributes.view.styles.popup.backgroundColor : "#FFFFFF",
                                backgroundImage: (typeof(((inputAttributes.view || {}).styles || {}).popup || {}).backgroundImage != 'undefined') ? inputAttributes.view.styles.popup.backgroundImage : false,
                                backgroundSize: (typeof(((inputAttributes.view || {}).styles || {}).popup || {}).backgroundSize != 'undefined') ? inputAttributes.view.styles.popup.backgroundSize : false,
                                backgroundPosition: (typeof(((inputAttributes.view || {}).styles || {}).popup || {}).backgroundPosition != 'undefined') ? inputAttributes.view.styles.popup.backgroundPosition : false,
                                backgroundRepeat: (typeof(((inputAttributes.view || {}).styles || {}).popup || {}).backgroundRepeat != 'undefined') ? inputAttributes.view.styles.popup.backgroundRepeat : false
                            },
                            cta: {
                                backgroundColor: (typeof(((inputAttributes.view || {}).styles || {}).cta || {}).backgroundColor != 'undefined') ? inputAttributes.view.styles.cta.backgroundColor : "#4CAF50",
                                textColor: (typeof(((inputAttributes.view || {}).styles || {}).cta || {}).textColor != 'undefined') ? inputAttributes.view.styles.cta.textColor : "#FFFFFF"
                            }
                        }
                    },
                    callback: (typeof inputAttributes.callback != 'undefined') ? inputAttributes.callback : false
                };
                if (vendorName) {
                    _util.ajaxRequest(_this.Environment.defaults().consentMessageTranslationAPI, 'GET', {}, function processConsentMessageTranslation(response) {
                        try {
                            var parsedResponse = JSON.parse(response);
                            var parsedResponseData = parsedResponse.data || {};
                            var vendorNameMatcher = /<var(.*?)var>/;
                            var rawConsentMessage = parsedResponseData.message || '';
                            var consentMessageWithVendorName = rawConsentMessage.replace(vendorNameMatcher, vendorName);
                            var rawBaseConsentMessage = parsedResponseData.base || '';
                            var baseConsentMessage = consentMessageWithVendorName.replace(vendorNameMatcher, vendorName);
                            _this.Audience.consentMessages = {
                                base: baseConsentMessage,
                                translated: consentMessageWithVendorName
                            }
                            var marketingConsentMessageWrapper = document.getElementById('paddle-popup-marketing-consent-message');
                            if (!marketingConsentMessageWrapper) {
                                attributes.marketingConsentMessage = _this.Audience.consentMessages.translated;
                            } else {
                                marketingConsentMessageWrapper.innerHTML = ke.ext.string.escapeHtml(_this.Audience.consentMessages.translated);
                            }
                            _this.Audience.consentMessageTranslationHasLoaded = true;
                        } catch (error) {
                            _this.Debug('There has been an error when ' +
                                'fetching the translated consent message: ' +
                                error.message);
                        }
                    });
                } else {
                    _this.Audience.consentMessageTranslationHasLoaded = true;
                }
                _util.ready(function () {
                    var body = document.getElementsByTagName('body')[0];
                    var audiencePopup = document.createElement('div');
                    audiencePopup.setAttribute('class', 'paddle-reset paddle-popup-container paddle-popup-instance_' + popupInstance + ' paddle-animated paddle-fadeIn paddle-hidden');
                    audiencePopup.innerHTML = _this.Audience.GeneratePopupHTML(attributes);
                    body.appendChild(audiencePopup);
                    var marketingConsentCheckboxElement = document.getElementById('newsletter-consent-input');
                    var marketingConsentLabelElement = document.getElementById('paddle-popup-marketing-consent-message');
                    marketingConsentCheckboxElement.onchange = function () {
                        if (marketingConsentCheckboxElement.checked) {
                            marketingConsentLabelElement.style.color = '#666666';
                        }
                    };
                    var close = document.getElementsByClassName('paddle-popup-instance_' + popupInstance)[0].getElementsByClassName('paddle-popup-close-image')[0];
                    close.onclick = function (e) {
                        e.preventDefault();
                        _this.Popup.hide(popupInstance, 'audience');
                    };
                    var submit = document.getElementsByClassName('paddle-popup-instance_' + popupInstance)[0].getElementsByClassName('paddle-popup-cta')[0];
                    submit.onclick = function () {
                        if (marketingConsentCheckboxElement.checked) {
                            _this.Audience.popupSubmit(popupInstance, attributes.strings.successMessage, attributes.callback);
                        } else {
                            marketingConsentLabelElement.style.color = 'red';
                        }
                    };
                    var input = document.getElementsByClassName('paddle-popup-instance_' + popupInstance)[0].getElementsByClassName('paddle-popup-email')[0];
                    input.onkeyup = function (e) {
                        if (e.keyCode == 13) {
                            e.preventDefault();
                            _this.Audience.popupSubmit(popupInstance, attributes.strings.successMessage, attributes.callback);
                        }
                    };
                    if (attributes.triggers.exitIntent) {
                        var mouseLeaveOffset = 0;
                        var elementToListen = document;
                        if (isFirefox()) {
                            mouseLeaveOffset = 30;
                            elementToListen = body;
                        }
                        var checkPopupTrigger = function (e) {
                            if (e.clientY <= mouseLeaveOffset) {
                                _this.Popup.show(popupInstance, 'ExitIntent', 'audience');
                            }
                        }
                        _this.Debug("Exit-intent audience popup enabled, will pop upon users moust entering browser address bar/tabs.");
                        elementToListen.addEventListener('mouseleave', checkPopupTrigger);
                    }
                    if (attributes.triggers.scrollDepth !== false) {
                        if (attributes.triggers.scrollDepth === true) {
                            _this.Debug("Scroll-depth audience popup enabled, will pop with any scroll activity.");
                        } else {
                            _this.Debug("Scroll-depth audience popup enabled, will pop after scrolling " + attributes.triggers.scrollDepth + "px.");
                        }
                        _status.AudienceHasPopped = false;
                        _status.AudienceLoadScrollDepth = window.scrollY;
                        if (_status.AudienceLoadScrollDepth <= 100) {
                            window.onscroll = function (e) {
                                clearTimeout(_status.AudienceCheckScrollDepth);
                                window.checkScrollDepth = setTimeout(function () {
                                    var scrollDepth = window.scrollY;
                                    if (scrollDepth >= attributes.triggers.scrollDepth) {
                                        if (!_status.AudienceHasPopped) {
                                            _status.AudienceHasPopped = true;
                                            _this.Popup.show(popupInstance, 'ScrollDepth', 'audience');
                                        }
                                    }
                                }, 300);
                            };
                        }
                    }
                    if (attributes.triggers.timed) {
                        _this.Debug("Timed audience popup enabled, popping in " + attributes.triggers.timed + " seconds.");
                        setTimeout(function () {
                            _this.Popup.show(popupInstance, 'Timed', 'audience');
                        }, attributes.triggers.timed * 1000);
                    }
                });
                return popupInstance;
            },
            emailFromPopup: function (popupInstance) {
                var email = document.getElementsByClassName('paddle-popup-instance_' + popupInstance)[0].getElementsByClassName('paddle-popup-email')[0] || false;
                if (email) {
                    return email.value;
                } else {
                    return false;
                }
            },
            popupSubmit: function (popupInstance, successMessage, callback) {
                _this.Debug("Audience popup submitted.");
                var email = _this.Audience.emailFromPopup(popupInstance);
                var newAudienceMemberAttributes = {
                    marketing_consent: 1,
                    email: email,
                    marketing_consent_message_base: _this.Audience.consentMessages.base,
                    marketing_consent_message_localised: _this.Audience.consentMessages.translated
                };
                if (email && email != '') {
                    _this.Spinner.show();
                    _this.Audience.addUserToAudience(newAudienceMemberAttributes, function (data) {
                        _this.Spinner.hide();
                        if (data.success) {
                            if (typeof callback == 'function') {
                                callback(data);
                            }
                            if (successMessage) {
                                alert(successMessage);
                            }
                            _this.Popup.hide(popupInstance, 'audience');
                        } else {
                            if (typeof callback == 'function') {
                                callback(data);
                            }
                            alert('Error: ' + data.error);
                        }
                    });
                } else {
                    alert('Please enter a valid email address.');
                }
            },
            addUserToAudience: function (userAttributes, callback) {
                _this.Debug("Audience subscription API triggered.");
                _this.Analytics.track('Paddle.Audience.Subscribe.Submit', {}, {});
                var audienceApiUrl = _this.Environment.defaults().audienceApi.replace('{vendor_id}', _options.vendor);
                if (!userAttributes.email) {
                    return false;
                }
                userAttributes.source = 'Import';
                userAttributes.medium = 'Paddle.js';
                _util.ajaxRequest(audienceApiUrl, 'POST', userAttributes, function (data) {
                    data = JSON.parse(data);
                    if (typeof data.success != 'undefined' && data.success === false) {
                        _this.Analytics.track('Paddle.Audience.Subscribe.Error', {}, {'Error.Message': data.error.message});
                        var callbackArguments = {success: false, error: data.error.message};
                        if (typeof callback == 'function') {
                            callback(callbackArguments);
                        } else if (typeof window[callback] == 'function') {
                            window[callback](callbackArguments);
                        } else {
                            alert(data.error.message);
                        }
                    } else {
                        if (data.user_id) {
                            _this.Analytics.track('Paddle.Audience.Subscribe.Success', {
                                user: {
                                    id: data.user_id,
                                    email: userAttributes.email
                                }
                            }, {});
                            _this.Affiliate.Event('Audience.Subscribe');
                            var callbackArguments = {success: true, email: userAttributes.email, user_id: data.user_id};
                            if (typeof callback == 'function') {
                                callback(callbackArguments);
                            } else if (typeof window[callback] == 'function') {
                                window[callback](callbackArguments);
                            } else {
                                alert("You've been subscribed successfully!");
                            }
                        }
                    }
                });
            },
            subscribe: function (email, marketingConsent, callback) {
                if (typeof callback === 'undefined' && typeof marketingConsent === 'function') {
                    callback = marketingConsent;
                    marketingConsent = true;
                }
                var newAudienceMemberAttributes = {marketing_consent: marketingConsent ? 1 : 0, email: email};
                _this.Audience.addUserToAudience(newAudienceMemberAttributes, callback);
            }
        };
        this.Devmate = {
            Active: function () {
                var devmateCookieValue = _util.getCookie(_defaults.devmateCookie);
                return devmateCookieValue && devmateCookieValue != '' ? true : false;
            }, Session: function () {
                if (_this.Devmate.Active()) {
                    return _util.getCookie(_defaults.devmateCookie) || null;
                } else {
                    return null;
                }
            }
        };
        this.Checkout = {
            open: function (checkoutAttributes, invocationMethod) {
                _util.closeCheckout(null, false, false);
                if (!window.PaddleCompletedSetup) {
                    _this.Debug("You haven't called Paddle.Setup(), using Paddle.js without calling Paddle.Setup() is unsupported and may result in unwanted issues. Docs: https://www.paddle.com/docs/paddle-js-overlay-checkout", 'warning', true);
                }
                if (typeof invocationMethod == 'undefined') {
                    var invocationMethod = 'function';
                }
                if (typeof checkoutAttributes == 'object') {
                    if (typeof checkoutAttributes.method != 'undefined') {
                        if (checkoutAttributes.method == 'overlay') {
                            var checkoutMethod = 'overlay';
                        } else if (checkoutAttributes.method == 'window') {
                            var checkoutMethod = 'window';
                        } else if (checkoutAttributes.method == 'inline') {
                            var checkoutMethod = 'inline';
                        } else {
                            checkoutAttributes.method = 'overlay';
                            var checkoutMethod = 'overlay';
                        }
                    } else {
                        checkoutAttributes.method = 'overlay';
                        var checkoutMethod = 'overlay';
                    }
                    if (typeof checkoutAttributes.prices == 'object') {
                        checkoutAttributes.prices.forEach(function (price) {
                            checkoutAttributes['price_' + price.currency.toLowerCase()] = price.price.toString();
                            checkoutAttributes['price_' + price.currency.toLowerCase() + '_auth'] = price.auth;
                            if (typeof price.price != 'string') {
                                _this.Debug('The price override "price" value is specified as a float/integer. It is recommended that you pass prices as strings to ensure the precision of the number is retained when calculating the authentication hash.', 'warning', true);
                            }
                        });
                        delete checkoutAttributes.prices;
                    }
                    if (typeof checkoutAttributes.recurringPrices == 'object') {
                        checkoutAttributes.recurringPrices.forEach(function (price) {
                            checkoutAttributes['recurring_price_' + price.currency.toLowerCase()] = price.price.toString();
                            checkoutAttributes['recurring_price_' + price.currency.toLowerCase() + '_auth'] = price.auth;
                            if (typeof price.price != 'string') {
                                _this.Debug('The recurring price override "price" value is specified as a float/integer. It is recommended that you pass prices as strings to ensure the precision of the number is retained when calculating the authentication hash.', 'warning', true);
                            }
                        });
                        delete checkoutAttributes.recurringPrices;
                    }
                    if (_options.sdk) {
                        checkoutAttributes.method = 'sdk';
                        var checkoutMethod = 'sdk';
                    } else {
                    }
                    _activeCheckout = checkoutAttributes;
                    if (_activeCheckout.isUpsell) {
                        _this.Analytics.track('Paddle.Checkout.Upsell.Click', {}, {'Upsell.Product': _activeCheckout.product});
                        setTimeout(function () {
                            var original = document.getElementById('paddle_upsell_original');
                            if (original) {
                                original.style.display = "block";
                            }
                        }, 1850);
                    }
                    if (checkoutAttributes.referring_domain != null && checkoutAttributes.referring_domain != '' && checkoutAttributes.referring_domain) {
                        _util.setPaddleCampaign(checkoutAttributes.referring_domain);
                    }

                    checkoutAttributes.referring_domain = ke.PLATFORM_CODE;//_util.buildPaddleReferrerString();

                    if (typeof checkoutAttributes.passthrough == 'object') {
                        checkoutAttributes.passthrough = JSON.stringify(checkoutAttributes.passthrough);
                    }
                    if (typeof checkoutAttributes.marketingConsent != 'undefined') {
                        if (checkoutAttributes.marketingConsent == true || checkoutAttributes.marketingConsent == 'true' || checkoutAttributes.marketingConsent == '1' || checkoutAttributes.marketingConsent == 1) {
                            checkoutAttributes.marketing_consent = '1';
                        } else {
                            checkoutAttributes.marketing_consent = '0';
                        }
                        delete checkoutAttributes.marketingConsent;
                    }
                    if (typeof checkoutAttributes.email != 'undefined') {
                        checkoutAttributes.guest_email = checkoutAttributes.email;
                        delete checkoutAttributes.email;
                    }
                    if (typeof checkoutAttributes.country != 'undefined') {
                        checkoutAttributes.guest_country = checkoutAttributes.country;
                        delete checkoutAttributes.country;
                    }
                    if (typeof checkoutAttributes.postcode != 'undefined') {
                        checkoutAttributes.guest_postcode = checkoutAttributes.postcode;
                        delete checkoutAttributes.postcode;
                    }
                    if (typeof checkoutAttributes.trialDays != 'undefined') {
                        checkoutAttributes.trial_days = checkoutAttributes.trialDays;
                        delete checkoutAttributes.trialDays;
                    }
                    if (typeof checkoutAttributes.trialDaysAuth != 'undefined') {
                        checkoutAttributes.trial_days_auth = checkoutAttributes.trialDaysAuth;
                        delete checkoutAttributes.trialDaysAuth;
                    }
                    if (typeof checkoutAttributes.allowQuantity != 'undefined') {
                        if (checkoutAttributes.allowQuantity == true || checkoutAttributes.allowQuantity == 'true' || checkoutAttributes.allowQuantity == '1' || checkoutAttributes.allowQuantity == 1) {
                            checkoutAttributes.quantity_variable = '1';
                        } else {
                            checkoutAttributes.quantity_variable = '0';
                        }
                        delete checkoutAttributes.allowQuantity;
                    }
                    if (typeof checkoutAttributes.message != 'undefined') {
                        checkoutAttributes.custom_message = checkoutAttributes.message;
                        delete checkoutAttributes.message;
                    }
                    if (typeof checkoutAttributes.disableLogout != 'undefined') {
                        checkoutAttributes.disable_logout = checkoutAttributes.disableLogout;
                        delete checkoutAttributes.disableLogout;
                    }
                    delete checkoutAttributes.theme;
                    checkoutAttributes.checkout_layout = _options.checkoutVariant ? typeof _options.checkoutVariant.variant != 'undefined' ? _options.checkoutVariant.variant : 'multipage' : 'multipage';
                    _this.Debug('Checkout Variant: ' + checkoutAttributes.checkout_layout);
                    _this.Debug('Creating checkout with attributes: ' + JSON.stringify(checkoutAttributes));
                    if (checkoutMethod == 'overlay' && typeof checkoutAttributes.upsell != 'undefined' && checkoutAttributes.upsell != '') {
                        var hasUpsell = true;
                        _util.jsonp(_this.Environment.defaults().dataApi + '?product_id=' + checkoutAttributes.upsell, function (data) {
                            var imageUrl = data.image;
                            var title = (typeof checkoutAttributes.upsellTitle != 'undefined') ? checkoutAttributes.upsellTitle : 'Upgrade to ' + data.name + '!';
                            var description = (typeof checkoutAttributes.upsellText != 'undefined') ? checkoutAttributes.upsellText : 'Why not upgrade your purchase to ' + data.name + '?';
                            var ctaText = (typeof checkoutAttributes.upsellAction != 'undefined') ? checkoutAttributes.upsellAction : 'Upgrade to ' + data.name + '!';
                            var orginalCheckout = function () {
                                _util.renderCheckoutFrame(checkoutAttributes.product, checkoutAttributes, false);
                            };
                            var passthrough = (typeof checkoutAttributes.upsellPassthrough != 'undefined' && checkoutAttributes.upsellPassthrough != false && checkoutAttributes.upsellPassthrough != '') ? checkoutAttributes.upsellPassthrough : (typeof checkoutAttributes.passthrough != 'undefined' && checkoutAttributes.passthrough != '' && checkoutAttributes.passthrough != false) ? checkoutAttributes.passthrough : '' || '';
                            var upsellCoupon = (typeof checkoutAttributes.upsellCoupon != 'undefined') ? checkoutAttributes.upsellCoupon : '';
                            _this.Upsell.create(checkoutAttributes.upsell, imageUrl, title, description, ctaText, orginalCheckout, passthrough, upsellCoupon);
                        });
                    } else {
                        var hasUpsell = false;
                    }
                    if (_this.Devmate.Active()) {
                        _this.Debug("DevMate Session Active: " + _this.Devmate.Session());
                        if (typeof checkoutAttributes.passthrough == 'undefined' || checkoutAttributes.passthrough == '') {
                            checkoutAttributes.passthrough = _this.Devmate.Session() || checkoutAttributes.passthrough || "";
                            _this.Debug("DevMate tracking parameter set as passthrough value.");
                        } else {
                            _this.Debug("DevMate tracking parameter NOT SET as passthrough value, as an existing passthrough was already in use. Sales won't be fully attributed within DevMate.");
                        }
                    }
                    if (checkoutMethod == 'sdk') {
                        checkoutAttributes.display_mode = 'sdk';
                        _util.renderCheckoutFrame(checkoutAttributes.product, checkoutAttributes, false);
                    } else if (checkoutMethod == 'overlay') {
                        checkoutAttributes.display_mode = 'overlay';
                        _util.renderCheckoutFrame(checkoutAttributes.product, checkoutAttributes, false);
                    } else if (checkoutMethod == 'inline') {
                        checkoutAttributes.display_mode = 'inline';
                        _util.renderCheckoutFrame(checkoutAttributes.product, checkoutAttributes, true);
                    } else {
                        checkoutAttributes.display_mode = 'popup';
                        _util.renderCheckoutWindow(checkoutAttributes.product, checkoutAttributes);
                    }
                    if (_options.enableTracking) {
                        _this.Analytics.track('Paddle.Checkout.Open', {}, {
                            'OpenMethod': checkoutMethod,
                            'InvokedVia': invocationMethod,
                            'Upsell.HasUpsell': hasUpsell,
                            'Upsell.IsUpsell': _activeCheckout.isUpsell,
                            'Devmate.Active': _this.Devmate.Active()
                        });
                    }
                    _this.Affiliate.Event('Checkout.Open');
                } else {
                    throw new Error("[PADDLE] An object of checkout parameters must be passed to Paddle.Checkout.open()");
                }
            }
        };
        this.Upsell = {
            css: function (leftPosition) {
                var leftPosition = (typeof leftPosition != 'undefined') ? leftPosition : '-300px';
                return 'position: fixed; z-index: 999999; top: 140px; left: ' + leftPosition + '; background: #FFFFFF; padding: 17px; border-radius: 3px; width: 265px; box-shadow: 0px 1px 4px 1px rgba(0,0,0,0.13); box-sizing: content-box;';
            },
            create: function (productId, imageUrl, title, description, ctaText, orginalCheckoutFunction, passthrough, upsellCoupon) {
                window.UpsellPosition = -350;
                var ctaText = (typeof ctaText != 'undefined') ? ctaText : 'Buy Now!';
                var upsellCoupon = (typeof upsellCoupon != 'undefined') ? upsellCoupon : '';
                var body = document.getElementsByTagName('body')[0];
                var upsell = document.createElement('div');
                upsell.setAttribute('id', 'paddle_upsell_' + productId);
                upsell.setAttribute('class', 'paddle_upsell');
                upsell.setAttribute('style', _this.Upsell.css());
                if (_options.upsellCheckbox) {
                    window.upsellType = 'Checkbox';
                    var upsellAction = '<div class="paddle_upsell-cta-checkbox-container"><div class="paddle_upsell-cta paddle_upsell-cta-checkbox"><input type="checkbox" class="paddle_upsell-checkbox" id="paddle_upsell-checkbox" onchange="javascript:document.getElementsByClassName(\'paddle_upsell_button\')[0].click();" /> <label for="paddle_upsell-checkbox">' + ctaText + '</label><a href="#!" class="paddle_button paddle_upsell_button" style="visibility:none;" data-theme="none" data-product="' + productId + '" data-upsell-button="true" data-referrer="Upsell" data-passthrough="' + passthrough + '" data-coupon="' + upsellCoupon + '" data-marketing-consent="' + (_activeCheckout.marketing_consent || "") + '" data-email="' + (_activeCheckout.guest_email || "") + '" data-country="' + (_activeCheckout.guest_country || "") + '" data-postcode="' + (_activeCheckout.guest_postcode || "") + '"></a></div></div>';
                } else {
                    window.upsellType = 'Button';
                    var upsellAction = '<div class="paddle_upsell-cta"><a href="#" class="paddle_upsell_button paddle_button" data-product="' + productId + '" data-upsell-button="true" data-referrer="Upsell" data-passthrough="' + passthrough + '" data-coupon="' + upsellCoupon + '" data-marketing-consent="' + (_activeCheckout.marketing_consent || "") + '" data-email="' + (_activeCheckout.guest_email || "") + '" data-country="' + (_activeCheckout.guest_country || "") + '" data-postcode="' + (_activeCheckout.guest_postcode || "") + '">' + ctaText + '</a></div>';
                }
                upsell.innerHTML = '<div class="paddle_upsell-wrapper"><div class="paddle_upsell-icon" style="background-image: url(\'' + imageUrl + '\');"></div><div class="paddle_upsell-data"><div class="paddle_upsell-title">' + title + '</div><div class="paddle_upsell-text">' + description + '</div>' + upsellAction + '</div></div>';
                body.appendChild(upsell);
                var original = document.createElement('div');
                original.setAttribute('id', 'paddle_upsell_original');
                original.setAttribute('class', 'paddle_upsell_original');
                original.style.display = "none";
                original.innerHTML = '<span class="paddle_upsell_original_link">&lsaquo; Back to Original Checkout</span>';
                original.onclick = function () {
                    _util.closeCheckout(null);
                    orginalCheckoutFunction();
                }
                body.appendChild(original);
                _this.Button.load();
            },
            display: function (productId) {
                var upsell = document.getElementById('paddle_upsell_' + productId);
                if (upsell) {
                    upsell.setAttribute('style', _this.Upsell.css('calc(50% + 245px)'));
                }
                _this.Analytics.track('Paddle.Checkout.Upsell.Impression', {}, {
                    'Upsell.OriginalProduct': _activeCheckout.product,
                    'Upsell.UpsoldProduct': productId,
                    'Upsell.Type': window.upsellType || null
                });
            },
            close: function (productId) {
                var upsell = document.getElementById('paddle_upsell_' + productId);
                if (upsell) {
                    upsell.setAttribute('style', _this.Upsell.css('-350px'));
                }
            }
        };
        this.Spinner = {
            show: function () {
                _util.showLoading();
            }, hide: function () {
                _util.hideLoading();
            }
        };
        this.Animation = {
            addStylesheet: function () {
                if (!_this.Status.loadedAnimationStylesheet) {
                    var head = document.getElementsByTagName('head')[0];
                    var link = document.createElement('link');
                    link.rel = 'stylesheet';
                    link.type = 'text/css';
                    link.href = _defaults.animationCssFile;
                    link.media = 'all';
                    head.appendChild(link);
                    _this.Status.loadedAnimationStylesheet = true;
                }
            }
        };
        this.Button = {
            addStylesheet: function () {
                if (!_this.Status.loadedButtonStylesheet) {
                    var head = document.getElementsByTagName('head')[0];
                    var link = document.createElement('link');
                    link.rel = 'stylesheet';
                    link.type = 'text/css';
                    link.href = _defaults.paddleCssFile;
                    link.media = 'all';
                    head.appendChild(link);
                    _this.Status.loadedButtonStylesheet = true;
                }
            },
            addTheme: function (buttonElement, theme) {
                if (theme != 'none') {
                    _util.addClass(buttonElement, 'paddle_styled_button');
                    if (theme == 'green') {
                        _util.addClass(buttonElement, 'green');
                    } else if (theme == 'light') {
                        _util.addClass(buttonElement, 'light');
                    } else if (theme == 'dark') {
                        _util.addClass(buttonElement, 'dark');
                    }
                }
            },
            attribute: function (attributesObject, attributesObjectKey, buttonElement, attributeName, attributeDefault) {
                if (typeof attributeDefault == 'undefined') {
                    var attributeDefault = false;
                }
                var attributeValue = (buttonElement.getAttribute(attributeName) != '' && buttonElement.getAttribute(attributeName) != null) ? buttonElement.getAttribute(attributeName) : attributeDefault;
                if (attributeValue) {
                    attributesObject[attributesObjectKey] = attributeValue;
                }
                return attributesObject;
            },
            getButtonAttributes: function (buttonElement) {
                var buttonAttributes = {};
                buttonAttributes = _this.Button.attribute(buttonAttributes, 'theme', buttonElement, 'data-theme', 'green');
                buttonAttributes = _this.Button.attribute(buttonAttributes, 'product', buttonElement, 'data-product');
                buttonAttributes = _this.Button.attribute(buttonAttributes, 'successCallback', buttonElement, 'data-success-callback', null);
                buttonAttributes = _this.Button.attribute(buttonAttributes, 'loadCallback', buttonElement, 'data-load-callback', null);
                buttonAttributes = _this.Button.attribute(buttonAttributes, 'closeCallback', buttonElement, 'data-close-callback', null);
                buttonAttributes = _this.Button.attribute(buttonAttributes, 'success', buttonElement, 'data-success');
                buttonAttributes = _this.Button.attribute(buttonAttributes, 'price', buttonElement, 'data-price', '');
                buttonAttributes = _this.Button.attribute(buttonAttributes, 'auth', buttonElement, 'data-auth', '');
                buttonAttributes = _this.Button.attribute(buttonAttributes, 'trial_days', buttonElement, 'data-trial-days', '');
                buttonAttributes = _this.Button.attribute(buttonAttributes, 'trial_days_auth', buttonElement, 'data-trial-days-auth', '');
                if (buttonElement.hasAttribute('data-marketing-consent')) {
                    var isMarketingConsentEnabled = buttonElement.getAttribute('data-marketing-consent') == 'true' || buttonElement.getAttribute('data-marketing-consent') == '1';
                    buttonAttributes.marketing_consent = isMarketingConsentEnabled ? '1' : '0';
                }
                buttonAttributes = _this.Button.attribute(buttonAttributes, 'guest_email', buttonElement, 'data-email', '');
                buttonAttributes = _this.Button.attribute(buttonAttributes, 'guest_country', buttonElement, 'data-country', '');
                buttonAttributes = _this.Button.attribute(buttonAttributes, 'guest_postcode', buttonElement, 'data-postcode', '');
                buttonAttributes = _this.Button.attribute(buttonAttributes, 'passthrough', buttonElement, 'data-passthrough', '');
                buttonAttributes = _this.Button.attribute(buttonAttributes, 'upsellPassthrough', buttonElement, 'data-upsell-passthrough', false);
                buttonAttributes = _this.Button.attribute(buttonAttributes, 'coupon', buttonElement, 'data-coupon', '');
                buttonAttributes = _this.Button.attribute(buttonAttributes, 'locale', buttonElement, 'data-locale', '');
                buttonAttributes = _this.Button.attribute(buttonAttributes, 'quantity', buttonElement, 'data-quantity', '');
                buttonAttributes = _this.Button.attribute(buttonAttributes, 'custom_message', buttonElement, 'data-message', '');
                buttonAttributes = _this.Button.attribute(buttonAttributes, 'referring_domain', buttonElement, 'data-referrer', '');
                buttonAttributes = _this.Button.attribute(buttonAttributes, 'title', buttonElement, 'data-title', '');
                buttonAttributes = _this.Button.attribute(buttonAttributes, 'disable_logout', buttonElement, 'data-disable-logout', '');
                buttonAttributes = _this.Button.attribute(buttonAttributes, 'upsell', buttonElement, 'data-upsell', '');
                buttonAttributes = _this.Button.attribute(buttonAttributes, 'upsellText', buttonElement, 'data-upsell-text', false);
                buttonAttributes = _this.Button.attribute(buttonAttributes, 'upsellTitle', buttonElement, 'data-upsell-title', false)
                buttonAttributes = _this.Button.attribute(buttonAttributes, 'upsellAction', buttonElement, 'data-upsell-action', false)
                buttonAttributes = _this.Button.attribute(buttonAttributes, 'upsellCoupon', buttonElement, 'data-upsell-coupon', '')
                buttonAttributes = _this.Button.attribute(buttonAttributes, 'isUpsell', buttonElement, 'data-upsell-button', false);
                if (buttonElement.getAttribute('data-allow-quantity') != '' && (buttonElement.getAttribute('data-allow-quantity') == 'false' || buttonElement.getAttribute('data-allow-quantity') === false || buttonElement.getAttribute('data-allow-quantity') == '0')) {
                    buttonAttributes.quantity_variable = '0';
                } else {
                    buttonAttributes.quantity_variable = '1';
                }
                buttonAttributes = _this.Button.attribute(buttonAttributes, 'override', buttonElement, 'data-override', '');
                buttonAttributes = _this.Button.attribute(buttonAttributes, 'internal', buttonElement, 'data-internal', '');
                buttonAttributes = _this.Button.attribute(buttonAttributes, 'vendor', buttonElement, 'data-vendor', '');
                buttonAttributes = _this.Button.attribute(buttonAttributes, 'plan', buttonElement, 'data-plan', '');
                return buttonAttributes;
            },
            load: function () {
                _util.ready(function () {
                    var buttonCounter = 0;
                    _util.each('paddle_button', function (buttonElement) {
                        var _buttonHasInit = (buttonElement.getAttribute('data-init') == 'true');
                        if (_buttonHasInit) {
                            var buttonClone = buttonElement.cloneNode(true);
                            buttonElement.parentNode.replaceChild(buttonClone, buttonElement);
                            buttonElement = buttonClone;
                        }
                        var buttonAttributes = _this.Button.getButtonAttributes(buttonElement);
                        if (buttonAttributes.theme != 'none') {
                            var buttonTheme = buttonAttributes.theme;
                            _this.Button.addTheme(buttonElement, buttonAttributes.theme);
                        } else {
                            var buttonTheme = 'none';
                        }
                        buttonElement.setAttribute('data-init', 'true');
                        var bodyRect = document.body.getBoundingClientRect(),
                            elemRect = buttonElement.getBoundingClientRect(),
                            offset = (elemRect.bottom - (elemRect.top - elemRect.bottom)) - bodyRect.top,
                            bodyBound = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
                        var aboveFold = (bodyBound > offset) ? true : false;
                        _this.Analytics.track('Paddle.Button.Impression', {}, {
                            'Button.Theme': buttonTheme,
                            'Button.Text': buttonElement.innerHTML.replace(/(<([^>]+)>)/ig, "") || buttonElement.value || 'Unknown',
                            'Button.AboveFold': aboveFold
                        });
                        buttonElement.addEventListener("click", function (event) {
                            event.preventDefault();
                            var buttonAttributes = _this.Button.getButtonAttributes(buttonElement);
                            _this.Checkout.open(buttonAttributes, 'click');
                        });
                        buttonCounter++;
                        if (buttonAttributes.override) {
                            _this.Debug('Loaded and initiated checkout button for override URL: ' + buttonAttributes.override + ' (Paddle Button #' + buttonCounter + ')');
                        } else if (buttonAttributes.product) {
                            _this.Debug('Loaded and initiated checkout button for product: ' + buttonAttributes.product + ' (Paddle Button #' + buttonCounter + ')');
                        } else {
                            _this.Debug('Initiated a checkout button without an override URL or Product. (Paddle Button #' + buttonCounter + ')', 'warning');
                        }
                    });
                    _util.each('paddle-gross', function (grossElement) {
                        var productId = grossElement.getAttribute('data-product') || false;
                        var quantity = grossElement.getAttribute('data-quantity') || 1;
                        if (!productId) {
                            productId = grossElement.parentNode.getAttribute('data-product') || false;
                        }
                        if (productId) {
                            var grossPrice = _this.Product.Price('gross', productId, quantity, function (amount) {
                                grossElement.innerHTML = ke.ext.string.escapeHtml(amount);
                            });
                        }
                    });
                    _util.each('paddle-tax', function (taxElement) {
                        var productId = taxElement.getAttribute('data-product') || false;
                        var quantity = taxElement.getAttribute('data-quantity') || 1;
                        if (!productId) {
                            productId = taxElement.parentNode.getAttribute('data-product') || false;
                        }
                        if (productId) {
                            var taxPrice = _this.Product.Price('tax', productId, quantity, function (amount) {
                                taxElement.innerHTML = ke.ext.string.escapeHtml(amount);
                            });
                        }
                    });
                    _util.each('paddle-net', function (netElement) {
                        var productId = netElement.getAttribute('data-product') || false;
                        var quantity = netElement.getAttribute('data-quantity') || 1;
                        if (!productId) {
                            productId = netElement.parentNode.getAttribute('data-product') || false;
                        }
                        if (productId) {
                            var netPrice = _this.Product.Price('net', productId, quantity, function (amount) {
                                netElement.innerHTML = ke.ext.string.escapeHtml(amount);
                            });
                        }
                    });
                });
            }
        };
        this.Affiliate = {
            analyticsStart: function () {
                if (!_this.Status.failedLoadingAffiliateAnalytics) {
                    if (!_this.Status.loadedAffiliateAnalytics) {
                        (function (e, t) {
                            if (!t.__SV) {
                                window.paddleAffiliateAnalytics = t;
                                var n = e.createElement("script");
                                n.type = "text/javascript";
                                n.src = chrome.extension.getURL("/src/lib/paddle/affiliate.js");
                                n.async = !0;
                                var r = e.getElementsByTagName("script")[0];
                                r.parentNode.insertBefore(n, r);
                                t.init = function (e, o) {
                                    t.writeKey = e;
                                    t._initOptions = o;
                                    t._execQueue = [];
                                    m = "action.track action.trackSale action.trackHTMLLink action.setGlobalProperty user.profile user.identify user.clear".split(" ");
                                    for (var n = 0; n < m.length; n++) {
                                        var f = function () {
                                            var r = m[n];
                                            var s = function () {
                                                t._execQueue.push({m: r, args: arguments})
                                            };
                                            var i = r.split(".");
                                            if (i.length == 2) {
                                                if (!t[i[0]]) {
                                                    t[i[0]] = []
                                                }
                                                t[i[0]][i[1]] = s
                                            } else {
                                                t[r] = s
                                            }
                                        }();
                                    }
                                };
                                t.__SV = 1
                            }
                        })(document, window.paddleAffiliateAnalytics || []);
                        try {
                            paddleAffiliateAnalytics.init(_this.Environment.defaults().affiliateAnalyticsKey, {cookieName: _defaults.affiliateAnalyticsCookie});
                        } catch (error) {
                            _this.Status.failedLoadingAffiliateAnalytics = true;
                            _this.Debug('Failed to start affiliate analytics with key: ' + _this.Environment.defaults().affiliateAnalyticsKey, 'warning');
                        }
                        if (!_this.Status.failedLoadingAffiliateAnalytics) {
                            _this.Status.loadedAffiliateAnalytics = true;
                            _this.Debug('Affiliate Analytics Started');
                        }
                    }
                } else {
                    _this.Debug('Won\'t attempt to initiate affiliate analytics after previous failure in same session.', 'warning');
                }
            }, EndSession: function () {
                _this.Debug('Ending analytics session due to conversion taking place.');
                _util.setCookie(_defaults.campaignCookiePrefix + 'affiliate_ignore', _this.Affiliate.affiliateToken(), 3);
                _util.removeCookie(_defaults.campaignCookiePrefix + 'affiliate');
            }, Event: function (event, additionalAttributes) {
                if (_this.Affiliate.isAffiliate()) {
                    var affiliateToken = _this.Affiliate.affiliateToken() || false;
                    var vendorId = _options.vendor || false;
                    var linkId = _this.Affiliate.linkId() || false;
                    var affiliateId = _this.Affiliate.affiliateId() || false;
                    var sellerId = _this.Affiliate.sellerId() || false;
                    if (!_this.Status.loadedAffiliateAnalytics) {
                        _this.Affiliate.analyticsStart();
                        paddleAffiliateAnalytics.user.identify(affiliateToken);
                        paddleAffiliateAnalytics.user.profile({
                            Context: {
                                AffiliateToken: affiliateToken,
                                VendorId: vendorId,
                                LinkId: linkId,
                                AffiliateId: affiliateId,
                                SellerId: sellerId
                            },
                            Campaign: {
                                Campaign: _util.campaignAttributes().Campaign,
                                Source: _util.campaignAttributes().Source,
                                Medium: _util.campaignAttributes().Medium,
                                Term: _util.campaignAttributes().Term,
                                Referrer: _util.campaignAttributes().Referrer,
                                ReferrerCategory: _util.campaignAttributes().ReferrerCategory
                            },
                            Attributes: {Mobile: _util.isMobile(), Browser: _util.analyticsContext().browser}
                        });
                    }
                    if (affiliateToken) {
                        paddleAffiliateAnalytics.action.track(event, {
                            CheckoutID: typeof additionalAttributes != 'undefined' && typeof additionalAttributes.CheckoutID != 'undefined' ? additionalAttributes.CheckoutID : null,
                            Request: {
                                Domain: window.location.host.replace(/www\./, ''),
                                Path: window.location.origin + window.location.pathname,
                                Secure: (window.location.protocol == 'https') ? true : false,
                            },
                            Context: {
                                AffiliateToken: affiliateToken,
                                VendorId: vendorId,
                                LinkId: linkId,
                                AffiliateId: affiliateId,
                                SellerId: sellerId
                            },
                            Campaign: {
                                Campaign: _util.campaignAttributes().Campaign,
                                Source: _util.campaignAttributes().Source,
                                Medium: _util.campaignAttributes().Medium,
                                Term: _util.campaignAttributes().Term,
                                Referrer: _util.campaignAttributes().Referrer,
                                ReferrerCategory: _util.campaignAttributes().ReferrerCategory
                            },
                            Attributes: {Mobile: _util.isMobile(), Browser: _util.analyticsContext().browser}
                        });
                        _this.Debug('Fired affiliate event: ' + event);
                    }
                } else {
                    _this.Debug('Ignoring "' + event + '" as this isn\'t an affiliate visit.', 'warning');
                }
            }, isAffiliate: function () {
                return _util.isAffiliate();
            }, affiliateToken: function () {
                if (_util.isAffiliate()) {
                    return _util.affiliateToken();
                } else {
                    return false;
                }
            }, linkId: function () {
                var campaignData = _util.campaignAttributes();
                return campaignData.AffiliateData.link;
            }, affiliateId: function () {
                var campaignData = _util.campaignAttributes();
                return campaignData.AffiliateData.affiliate;
            }, sellerId: function () {
                var campaignData = _util.campaignAttributes();
                return campaignData.AffiliateData.seller;
            }
        };
        this.Analytics = {
            start: function () {
                if (!_this.Status.failedLoadingAnalytics) {
                    if (_options.enableTracking && !_this.Status.loadedAnalytics) {
                        (function (e, t) {
                            if (!t.__SV) {
                                var debug = '';
                                if (0 == 1) {
                                    debug = '-debug';
                                    window.AnalyticsDebug = true;
                                } else {
                                    window.AnalyticsDebug = false;
                                }
                                window.paddleAnalytics = t;
                                var n = e.createElement("script");
                                n.type = "text/javascript";
                                n.src = chrome.extension.getURL("/src/lib/paddle-analytics.js");
                                n.async = !0;
                                var r = e.getElementsByTagName("script")[0];
                                r.parentNode.insertBefore(n, r);
                                t.init = function (e, o) {
                                    t.writeKey = e;
                                    t._initOptions = o;
                                    t._execQueue = [];
                                    m = "action.track action.trackSale action.trackHTMLLink action.setGlobalProperty user.profile user.identify user.clear".split(" ");
                                    for (var n = 0; n < m.length; n++) {
                                        var f = function () {
                                            var r = m[n];
                                            var s = function () {
                                                t._execQueue.push({m: r, args: arguments})
                                            };
                                            var i = r.split(".");
                                            if (i.length == 2) {
                                                if (!t[i[0]]) {
                                                    t[i[0]] = []
                                                }
                                                t[i[0]][i[1]] = s
                                            } else {
                                                t[r] = s
                                            }
                                        }();
                                    }
                                };
                                t.__SV = 1
                            }
                        })(document, window.paddleAnalytics || []);
                        try {
                            paddleAnalytics.init(_this.Environment.defaults().analyticsKey, {cookieName: _defaults.analyticsCookie});
                        } catch (error) {
                            _this.Status.failedLoadingAnalytics = true;
                            _this.Debug('Failed to start analytics with key: ' + _this.Environment.defaults().analyticsKey, 'warning');
                        }
                        if (!_this.Status.failedLoadingAnalytics) {
                            _this.Status.loadedAnalytics = true;
                            _this.Debug('Analytics Started');
                        }
                    }
                } else {
                    _this.Debug('Won\'t attempt to initiate analytics after previous failure in same session.', 'warning');
                }
            }, track: function (action, eventParams, definedParams, blocking) {
                blocking = blocking != null ? blocking : false;
                if (_options.enableTracking) {
                    if (!_this.Status.loadedAnalytics) {
                        _this.Analytics.start();
                    }
                    if (_this.Status.loadedAnalytics && !_this.Status.failedLoadingAnalytics) {
                        var action = (typeof action == 'undefined') ? null : action;
                        var eventParams = (typeof eventParams == 'undefined') ? {} : eventParams;
                        var definedParams = (typeof definedParams == 'undefined') ? {} : definedParams;
                        var properties = _util.analyticsDefaults();
                        properties._EventParams = eventParams;
                        properties._DefinedParams = definedParams;
                        if (properties._EventParams && properties._EventParams.user && typeof properties._EventParams.user.id != 'undefined' && properties._EventParams.user.id != null) {
                            paddleAnalytics.user.identify(properties._EventParams.user.id);
                            paddleAnalytics.user.profile({
                                "$full_name": properties._EventParams.user.email,
                                "$email": properties._EventParams.user.email,
                                "$country": (typeof properties._EventParams.user.country != 'undefined') ? properties._EventParams.user.country : null,
                                "User.ID": properties._EventParams.user.id
                            });
                        }
                        if (properties._EventParams && properties._EventParams.checkout && properties._EventParams.checkout.created_at) {
                            delete properties._EventParams.checkout.created_at;
                        }
                        paddleAnalytics.action.track(action, properties, blocking);
                        _this.Debug('Fired analytics action: ' + action);
                    } else {
                        _this.Debug('Unable to send ' + action + ' analytics action as we were previously unable to initiate the analytics library.', 'warning');
                    }
                }
            }, trackPageview: function () {
                if (_options.vendor != null) {
                    _this.Debug('Vendor is identified, tracking pageviews...');
                    var params = {};
                    params["$view_url"] = document.URL.replace(/#.*$/, "");
                    params["$view_name"] = document.title || "No Title";
                    this.track('Website.PageView', params, false);
                } else {
                    _this.Debug('Vendor not identified, skipping pageview tracking.');
                }
            }
        };
        this.Conversation = {
            Create: function () {
                _this.Debug('The Conversation API in Paddle.js is no longer available.', 'warning');
            }, CreatePopup: function () {
                _this.Debug('The Conversation API in Paddle.js is no longer available.', 'warning');
            }
        };
        var _util = {
            ajaxRequest: function (url, method, data, callback) {
                if (!window.XMLHttpRequest) {
                    return false;
                }
                method = method || 'GET';
                data = data || {};
                callback = callback || function () {
                };
                var httpRequest = new XMLHttpRequest();
                httpRequest.open(method, url, true);
                httpRequest.setRequestHeader("Content-Type", "application/json");
                httpRequest.onreadystatechange = function (data) {
                    if (httpRequest.readyState === XMLHttpRequest.DONE && httpRequest.status === 200) {
                        try {
                            callback(httpRequest.responseText);
                        } catch (error) {
                            _this.Debug('There was an error while executing ' +
                                'a callback after an AJAX request', 'warning');
                        }
                    }
                }
                httpRequest.send(JSON.stringify(data));
            }, nl2br: function (str, is_xhtml) {
                var breakTag = (is_xhtml || typeof is_xhtml === 'undefined') ? '<br />' : '<br>';
                return (str + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1' + breakTag + '$2');
            }, show: function (element) {
                _util.removeClass(element, 'paddle-hidden');
                _util.addClass(element, 'paddle-visible');
            }, hide: function (element) {
                _util.removeClass(element, 'paddle-visible');
                _util.addClass(element, 'paddle-hidden');
            }, chooseCheckoutVariant: function () {
                var totalVariantWeight = 0;
                _checkoutVariants.forEach(function (variant) {
                    totalVariantWeight += variant.weight;
                });
                var randomAssignment = Math.random() * totalVariantWeight;
                for (var i = 0, currentTotal = 0; i < _checkoutVariants.length; i++) {
                    currentTotal += _checkoutVariants[i].weight;
                    if (randomAssignment <= currentTotal) {
                        return _checkoutVariants[i];
                    }
                }
            }, initialCheckoutVisibility: function () {
                if (_util.analyticsContext().browser == 'Safari') {
                    return 'none';
                } else {
                    return 'block';
                }
            }, analyticsContext: function () {
                var unknown = 'Unknown';
                var screenSize = '';
                if (screen.width) {
                    width = (screen.width) ? screen.width : '';
                    height = (screen.height) ? screen.height : '';
                    screenSize += '' + width + " x " + height;
                }
                var nVer = navigator.appVersion;
                var nAgt = navigator.userAgent;
                var browser = navigator.appName;
                var version = '' + parseFloat(navigator.appVersion);
                var majorVersion = parseInt(navigator.appVersion, 10);
                var nameOffset,
                    verOffset,
                    ix;
                if ((verOffset = nAgt.indexOf('Opera')) != -1) {
                    browser = 'Opera';
                    version = nAgt.substring(verOffset + 6);
                    if ((verOffset = nAgt.indexOf('Version')) != -1) {
                        version = nAgt.substring(verOffset + 8);
                    }
                }
                else if ((verOffset = nAgt.indexOf('MSIE')) != -1) {
                    browser = 'Microsoft Internet Explorer';
                    version = nAgt.substring(verOffset + 5);
                }
                else if ((browser == 'Netscape') && (nAgt.indexOf('Trident/') != -1)) {
                    browser = 'Microsoft Internet Explorer';
                    version = nAgt.substring(verOffset + 5);
                    if ((verOffset = nAgt.indexOf('rv:')) != -1) {
                        version = nAgt.substring(verOffset + 3);
                    }
                }
                else if ((verOffset = nAgt.indexOf('Chrome')) != -1) {
                    browser = 'Chrome';
                    version = nAgt.substring(verOffset + 7);
                }
                else if ((verOffset = nAgt.indexOf('Safari')) != -1) {
                    browser = 'Safari';
                    version = nAgt.substring(verOffset + 7);
                    if ((verOffset = nAgt.indexOf('Version')) != -1) {
                        version = nAgt.substring(verOffset + 8);
                    }
                    if (nAgt.indexOf('CriOS') != -1) {
                        browser = 'Chrome';
                    }
                }
                else if ((verOffset = nAgt.indexOf('Firefox')) != -1) {
                    browser = 'Firefox';
                    version = nAgt.substring(verOffset + 8);
                }
                else if ((nameOffset = nAgt.lastIndexOf(' ') + 1) < (verOffset = nAgt.lastIndexOf('/'))) {
                    browser = unknown;
                    version = '0';
                }
                if ((ix = version.indexOf(';')) != -1)
                    version = version.substring(0, ix);
                if ((ix = version.indexOf(' ')) != -1)
                    version = version.substring(0, ix);
                if ((ix = version.indexOf(')')) != -1)
                    version = version.substring(0, ix);
                majorVersion = parseInt('' + version, 10);
                if (isNaN(majorVersion)) {
                    version = '' + parseFloat(navigator.appVersion);
                    majorVersion = parseInt(navigator.appVersion, 10);
                }
                var mobile = /Mobile|mini|Fennec|Android|iP(ad|od|hone)/.test(nVer);
                var cookieEnabled = (navigator.cookieEnabled) ? true : false;
                if (typeof navigator.cookieEnabled == 'undefined' && !cookieEnabled) {
                    document.cookie = 'testcookie=1; SameSite=Lax;';
                    cookieEnabled = (document.cookie.indexOf('testcookie=') != -1) ? true : false;
                    document.cookie = "testcookie=1; expires=Thu, 01-Jan-1970 00:00:01 GMT; SameSite=Lax;";
                }
                var os = unknown;
                var clientStrings = [{
                    s: 'Windows 3.11',
                    r: /Win16/
                }, {
                    s: 'Windows 95',
                    r: /(Windows 95|Win95|Windows_95)/
                }, {
                    s: 'Windows ME',
                    r: /(Win 9x 4.90|Windows ME)/
                }, {
                    s: 'Windows 98',
                    r: /(Windows 98|Win98)/
                }, {
                    s: 'Windows CE',
                    r: /Windows CE/
                }, {
                    s: 'Windows 2000',
                    r: /(Windows NT 5.0|Windows 2000)/
                }, {
                    s: 'Windows XP',
                    r: /(Windows NT 5.1|Windows XP)/
                }, {
                    s: 'Windows Server 2003',
                    r: /Windows NT 5.2/
                }, {
                    s: 'Windows Vista',
                    r: /Windows NT 6.0/
                }, {
                    s: 'Windows 7',
                    r: /(Windows 7|Windows NT 6.1)/
                }, {
                    s: 'Windows 8.1',
                    r: /(Windows 8.1|Windows NT 6.3)/
                }, {
                    s: 'Windows 8',
                    r: /(Windows 8|Windows NT 6.2)/
                }, {
                    s: 'Windows NT 4.0',
                    r: /(Windows NT 4.0|WinNT4.0|WinNT|Windows NT)/
                }, {
                    s: 'Windows ME',
                    r: /Windows ME/
                }, {
                    s: 'Android',
                    r: /Android/
                }, {
                    s: 'Open BSD',
                    r: /OpenBSD/
                }, {
                    s: 'Sun OS',
                    r: /SunOS/
                }, {
                    s: 'Linux',
                    r: /(Linux|X11)/
                }, {
                    s: 'iOS',
                    r: /(iPhone|iPad|iPod)/
                }, {
                    s: 'Mac OS X',
                    r: /Mac OS X/
                }, {
                    s: 'Mac OS',
                    r: /(MacPPC|MacIntel|Mac_PowerPC|Macintosh)/
                }, {
                    s: 'QNX',
                    r: /QNX/
                }, {
                    s: 'UNIX',
                    r: /UNIX/
                }, {
                    s: 'BeOS',
                    r: /BeOS/
                }, {
                    s: 'OS/2',
                    r: /OS\/2/
                }, {
                    s: 'Search Bot',
                    r: /(nuhk|Googlebot|Yammybot|Openbot|Slurp|MSNBot|Ask Jeeves\/Teoma|ia_archiver)/
                }];
                for (var id in clientStrings) {
                    var cs = clientStrings[id];
                    if (cs.r.test(nAgt)) {
                        os = cs.s;
                        break;
                    }
                }
                if (/Windows/.test(os)) {
                    os = 'Windows';
                }
                var browserDetail = {
                    screen: screenSize,
                    browser: browser,
                    browserVersion: version,
                    mobile: mobile,
                    os: os,
                    osVersion: '',
                    cookies: cookieEnabled
                };
                return browserDetail;
            }, fireEvent: function (eventData) {
                if (typeof _options.eventCallback == 'function') {
                    _options.eventCallback(eventData);
                }
            }, detectAutoOpen: function () {
                if (typeof _util.urlParam('paddle_open') != 'undefined' && (_util.urlParam('paddle_open') == 'true' || _util.urlParam('paddle_open') === true)) {
                    _util.ready(function () {
                        var firstButton = (typeof document.getElementsByClassName('paddle_button')[0] != 'undefined') ? document.getElementsByClassName('paddle_button')[0] : false;
                        if (firstButton) {
                            var buttonAttributes = _this.Button.getButtonAttributes(firstButton);
                            _this.Checkout.open(buttonAttributes, 'auto-open');
                        }
                    });
                }
            }, getUrlCoupon: function () {
                if (typeof _util.urlParam('paddle_coupon') != 'undefined' && _util.urlParam('paddle_coupon') != '') {
                    return _util.urlParam('paddle_coupon');
                } else {
                    return false;
                }
            }, getPrices: function (productId, quantity, callback) {
                if (typeof _prices[productId] == 'undefined') {
                    _util.jsonp(_this.Environment.defaults().pricesApi + '?product_id=' + productId + '&quantity=' + quantity, function (data) {
                        _prices[productId] = {};
                        _prices[productId] = data;
                        if (typeof callback == 'function') {
                            callback(_prices[productId]);
                        }
                    });
                } else {
                    if (typeof callback == 'function') {
                        callback(_prices[productId]);
                    }
                }
            }, listen: function () {
                window.addEventListener("message", (function (message) {
                    if (typeof message.data == 'object') {
                        if (typeof message.data.callback_data == 'undefined') {
                            var callback_data = {};
                        } else {
                            var callback_data = message.data.callback_data;
                        }
                        if (message.data.action == 'close') {
                            _util.closeCheckout(callback_data);
                        } else if (message.data.action == 'complete') {
                            _util.completeCheckout(callback_data);
                        }
                        if (message.data.action == 'event' || message.data.action == 'close' || message.data.action == 'complete') {
                            if (message.data.action == 'event') {
                                if (message.data.event_name != 'Checkout.Ping.Size') {
                                    var globalEventData = {
                                        event: message.data.event_name,
                                        eventData: callback_data,
                                        checkoutData: _activeCheckout,
                                        campaignData: _util.analyticsDefaults()
                                    };
                                    _util.fireEvent(globalEventData);
                                }
                            } else {
                                if (message.data.action == 'close') {
                                    var eventName = 'Checkout.Close';
                                } else if (message.data.action == 'complete') {
                                    var eventName = 'Checkout.Complete';
                                }
                                var globalEventData = {
                                    event: eventName,
                                    eventData: callback_data,
                                    checkoutData: _activeCheckout,
                                    campaignData: _util.analyticsDefaults()
                                };
                                _util.fireEvent(globalEventData);
                            }
                        }
                        if (message.data.action == 'event') {
                            if (message && message.data && message.data.event_name) {
                                _this.Debug('Checkout fired message: ' + message.data.event_name);
                                if (message.data.event_name == 'Checkout.Loaded') {
                                    if (_util.initialCheckoutVisibility() == 'none') {
                                        document.getElementsByClassName('paddle-frame')[0].style.setProperty('display', 'block');
                                    }
                                    if (_activeCheckout.method != 'inline') {
                                        _util.showPoweredBy();
                                        _util.hideLoading();
                                        if ((typeof _activeCheckout.isUpsell == 'undefined' || _activeCheckout.isUpsell != 'true') && _activeCheckout.upsell) {
                                            _this.Upsell.display(_activeCheckout.upsell);
                                        }
                                    }
                                    _this.Analytics.track('Paddle.Checkout.Loaded', callback_data, {});
                                    if (typeof window[_activeCheckout.loadCallback] == 'function') {
                                        window[_activeCheckout.loadCallback]();
                                    } else if (typeof _activeCheckout.loadCallback == 'function') {
                                        _activeCheckout.loadCallback();
                                    }
                                } else if (message.data.event_name == 'Checkout.Error') {
                                    _this.Analytics.track('Paddle.Checkout.Error', callback_data, {'Error.Message': message.data.callback_data.message});
                                } else if (message.data.event_name == 'Checkout.Ping.Size') {
                                    if (message.data.callback_data && message.data.callback_data.height != '') {
                                        if (typeof _activeCheckout.frameTarget != '') {
                                            var newFrameHeight = parseInt(message.data.callback_data.height) + 45;
                                            document.getElementsByClassName(_activeCheckout.frameTarget)[0].getElementsByTagName('iframe')[0].setAttribute('height', newFrameHeight);
                                        }
                                    }
                                } else if (message.data.event_name == 'Checkout.PaymentComplete') {
                                    _this.Analytics.track('Paddle.Checkout.PaymentComplete', callback_data, {});
                                } else if (message.data.event_name == 'Checkout.CountryInformationEntered') {
                                    _this.Analytics.track('Paddle.Checkout.CountryInformationEntered', callback_data, {});
                                } else if (message.data.event_name == 'Checkout.Login') {
                                    _this.Analytics.track('Paddle.Checkout.Login', callback_data, {});
                                } else if (message.data.event_name == 'Checkout.PaymentMethodSelected') {
                                    _this.Analytics.track('Paddle.Checkout.PaymentMethodSelected', callback_data, {'PaymentMethod': message.data.callback_data.paymentMethod});
                                } else if (message.data.event_name == 'Checkout.DuplicateWarningShown') {
                                    _this.Analytics.track('Paddle.Checkout.DuplicateWarningShown', callback_data, {});
                                }
                            }
                        }
                    }
                }), false);
            }, showLoading: function (returnHtml) {
                _util.hideLoading();
                if (typeof returnHtml == 'undefined') {
                    var returnHtml = false;
                }
                var paddleLoader = document.createElement('div');

                paddleLoader.style.zIndex = "99998";
                paddleLoader.style.display = "block";
                paddleLoader.style.position = "fixed";
                paddleLoader.style.height = "100%";
                paddleLoader.style.width = "100%";
                paddleLoader.style.top = "0px";
                paddleLoader.style.left = "0px";
                paddleLoader.style.right = "0px";
                paddleLoader.style.bottom = "0px";
                paddleLoader.style.margin = "0px";
                paddleLoader.style.padding = "0px";
                paddleLoader.style.background = "rgba(0,0,0,0.38)";

                paddleLoader.className = 'paddle-loader';
                var loadingCircle = document.createElement('div');

                loadingCircle.style.zIndex = "99999";
                loadingCircle.style.display = "block";
                loadingCircle.style.width = "58px";
                loadingCircle.style.height = "58px";
                loadingCircle.style.position = "fixed";
                loadingCircle.style.top = "50%";
                loadingCircle.style.left = "50%";
                loadingCircle.style.marginTop = "-29px";
                loadingCircle.style.marginLeft = "-29px";
                loadingCircle.style.background = "#FFFFFF";
                loadingCircle.style.boxShadow = "0px 0px 0px 1px rgba(0,0,0,0.1), 0px 1px 6px 0px rgba(0,0,0,0.12)";
                loadingCircle.style.borderRadius = "40px";
                loadingCircle.style.padding = "4px";
                loadingCircle.style.boxSizing = "border-box";

                var loadingImage = document.createElement('img')
                loadingImage.src = 'https://cdn.paddle.com/paddle/assets/images/loading.gif';

                loadingImage.style.display = "block";
                loadingImage.style.width = "50px";
                loadingImage.style.height = "50px";

                loadingCircle.appendChild(loadingImage);
                paddleLoader.appendChild(loadingCircle);
                if (!returnHtml) {
                    document.getElementsByTagName('body')[0].appendChild(paddleLoader);
                } else {
                    return _util.nodeToString(paddleLoader);
                }
            }, hideLoading: function () {
                _util.each('paddle-loader', function (loader) {
                    loader.parentNode.removeChild(loader);
                });
            }, showPoweredBy: function () {
                if (_options.poweredByBadge && !_util.isMobile() && !_options.sdk) {
                    _util.hidePoweredBy();
                    var paddlePowered = document.createElement('div');
                    paddlePowered.className = 'paddle-powered';

                    paddlePowered.style.position = "fixed";
                    paddlePowered.style.zIndex = "99999999";
                    paddlePowered.style.left = "12px";
                    paddlePowered.style.bottom = "12px";

                    var poweredLink = document.createElement('a');
                    poweredLink.setAttribute('href', 'https://www.paddle.com/features?utm_source=Referral_' + window.location.host + '&utm_campaign=CheckoutReferral&utm_medium=CheckoutReferral&utm_content=Referral_' + window.location.host);
                    poweredLink.setAttribute('target', '_blank');
                    var poweredImage = document.createElement('img');
                    poweredImage.setAttribute('src', 'https://cdn.paddle.com/paddle/assets/images/powered.png');
                    poweredImage.setAttribute('width', 220);
                    poweredImage.setAttribute('height', 32);

                    poweredImage.style.width = "220px";
                    poweredImage.style.height = "32px";

                    poweredLink.appendChild(poweredImage);
                    poweredLink.addEventListener("click", function (event) {
                        _this.Analytics.track('Paddle.PoweredBy.Click', {}, {});
                    });
                    paddlePowered.appendChild(poweredLink);
                    document.getElementsByTagName('body')[0].appendChild(paddlePowered);
                    _this.Analytics.track('Paddle.PoweredBy.Impression', {}, {});
                } else {
                    if (_util.isMobile()) {
                        _this.Debug('"Powered by Paddle" rendering skipped due to mobile session.');
                    } else {
                        _this.Debug('"Powered by Paddle" rendering skipped due to _options preference.');
                    }
                }
            }, hidePoweredBy: function () {
                _util.each('paddle-powered', function (loader) {
                    loader.parentNode.removeChild(loader);
                });
            }, isMobile: function () {
                var check = false;
                (function (a) {
                    if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true
                })(navigator.userAgent || navigator.vendor || window.opera);
                return check;
            }, ready: (function () {
                var readyList, DOMContentLoaded, class2type = {};
                class2type["[object Boolean]"] = "boolean";
                class2type["[object Number]"] = "number";
                class2type["[object String]"] = "string";
                class2type["[object Function]"] = "function";
                class2type["[object Array]"] = "array";
                class2type["[object Date]"] = "date";
                class2type["[object RegExp]"] = "regexp";
                class2type["[object Object]"] = "object";
                var ReadyObj = {
                    isReady: false, readyWait: 1, holdReady: function (hold) {
                        if (hold) {
                            ReadyObj.readyWait++;
                        } else {
                            ReadyObj.ready(true);
                        }
                    }, ready: function (wait) {
                        if ((wait === true && !--ReadyObj.readyWait) || (wait !== true && !ReadyObj.isReady)) {
                            if (!document.body) {
                                return setTimeout(ReadyObj.ready, 1);
                            }
                            ReadyObj.isReady = true;
                            if (wait !== true && --ReadyObj.readyWait > 0) {
                                return;
                            }
                            readyList.resolveWith(document, [ReadyObj]);
                        }
                    }, bindReady: function () {
                        if (readyList) {
                            return;
                        }
                        readyList = ReadyObj._Deferred();
                        if (document.readyState === "complete") {
                            return setTimeout(ReadyObj.ready, 1);
                        }
                        if (document.addEventListener) {
                            document.addEventListener("DOMContentLoaded", DOMContentLoaded, false);
                            window.addEventListener("load", ReadyObj.ready, false);
                        } else if (document.attachEvent) {
                            document.attachEvent("onreadystatechange", DOMContentLoaded);
                            window.attachEvent("onload", ReadyObj.ready);
                            var toplevel = false;
                            try {
                                toplevel = window.frameElement == null;
                            } catch (e) {
                            }
                            if (document.documentElement.doScroll && toplevel) {
                                doScrollCheck();
                            }
                        }
                    }, _Deferred: function () {
                        var
                            callbacks = [], fired, firing, cancelled, deferred = {
                                done: function () {
                                    if (!cancelled) {
                                        var args = arguments, i, length, elem, type, _fired;
                                        if (fired) {
                                            _fired = fired;
                                            fired = 0;
                                        }
                                        for (i = 0, length = args.length; i < length; i++) {
                                            elem = args[i];
                                            type = ReadyObj.type(elem);
                                            if (type === "array") {
                                                deferred.done.apply(deferred, elem);
                                            } else if (type === "function") {
                                                callbacks.push(elem);
                                            }
                                        }
                                        if (_fired) {
                                            deferred.resolveWith(_fired[0], _fired[1]);
                                        }
                                    }
                                    return this;
                                }, resolveWith: function (context, args) {
                                    if (!cancelled && !fired && !firing) {
                                        args = args || [];
                                        firing = 1;
                                        try {
                                            while (callbacks[0]) {
                                                callbacks.shift().apply(context, args);
                                            }
                                        }
                                        finally {
                                            fired = [context, args];
                                            firing = 0;
                                        }
                                    }
                                    return this;
                                }, resolve: function () {
                                    deferred.resolveWith(this, arguments);
                                    return this;
                                }, isResolved: function () {
                                    return !!(firing || fired);
                                }, cancel: function () {
                                    cancelled = 1;
                                    callbacks = [];
                                    return this;
                                }
                            };
                        return deferred;
                    }, type: function (obj) {
                        return obj == null ? String(obj) : class2type[Object.prototype.toString.call(obj)] || "object";
                    }
                }

                function doScrollCheck() {
                    if (ReadyObj.isReady) {
                        return;
                    }
                    try {
                        document.documentElement.doScroll("left");
                    } catch (e) {
                        setTimeout(doScrollCheck, 1);
                        return;
                    }
                    ReadyObj.ready();
                }

                if (document.addEventListener) {
                    DOMContentLoaded = function () {
                        document.removeEventListener("DOMContentLoaded", DOMContentLoaded, false);
                        ReadyObj.ready();
                    };
                } else if (document.attachEvent) {
                    DOMContentLoaded = function () {
                        if (document.readyState === "complete") {
                            document.detachEvent("onreadystatechange", DOMContentLoaded);
                            ReadyObj.ready();
                        }
                    };
                }

                function ready(fn) {
                    ReadyObj.bindReady();
                    var type = ReadyObj.type(fn);
                    readyList.done(fn);
                }

                return ready;
            })(), each: function (className, callback) {
                var elements = document.getElementsByClassName(className);
                for (var i = 0; i < elements.length; i++) {
                    var thisElement = elements[i];
                    if (typeof callback === "function") {
                        callback(thisElement);
                    } else {
                        throw new Error("_util.each(className, function() {... requires the callback argument to be of type Function");
                    }
                }
            }, queryString: function (obj, prefix) {
                var str = [];
                for (var p in obj) {
                    if (obj.hasOwnProperty(p)) {
                        var k = prefix ? prefix + "[" + p + "]" : p, v = obj[p];
                        if (k != null && k != '' && v != null && v != '' && typeof v != 'function') {
                            if (k != 'closeCallback' && k != 'successCallback' && k != 'loadCallback' && k != 'method' && k != 'override') {
                                str.push(typeof v == "object" ? this.queryString(v, k) : encodeURIComponent(k) + "=" + encodeURIComponent(v));
                            }
                        }
                    }
                }
                return str.join("&");
            }, buildCheckoutUrl: function (productId, checkoutQuery, type) {
                if (typeof checkoutQuery == 'undefined') {
                    var checkoutQuery = {};
                }
                checkoutQuery.apple_pay_enabled = _util.isApplePaySupported() ? 'true' : 'false';
                if (type == 'popup') {
                    checkoutQuery.popup = 'true';
                    checkoutQuery.paddle_js = 'true';
                    checkoutQuery.is_popup = 'true';
                    checkoutQuery.parentURL = window.location.href;
                    checkoutQuery.parent_url = window.location.href;
                } else {
                    delete checkoutQuery.popup;
                    if (type == 'fallback') {
                        checkoutQuery.popup = 'true';
                        checkoutQuery.paddle_js = 'true';
                        checkoutQuery.popup_window = 'true';
                        checkoutQuery.is_popup = 'true';
                        if (_options.sdk) {
                            checkoutQuery.display_mode = 'sdk';
                        }
                        checkoutQuery.parentURL = window.location.href;
                        checkoutQuery.parent_url = window.location.href;
                    }
                }
                var urlCoupon = _util.getUrlCoupon();
                if (urlCoupon) {
                    checkoutQuery.coupon = urlCoupon;
                }
                if (checkoutQuery.internal == 'true') {
                    var internalPlan = checkoutQuery.plan;
                    var internalVendor = checkoutQuery.vendor;
                    delete checkoutQuery.internal;
                    delete checkoutQuery.plan;
                    delete checkoutQuery.vendor;
                    var checkoutFullUrl = _this.Environment.defaults().internalCheckoutBase + internalPlan + '/' + internalVendor + '/?' + _util.queryString(checkoutQuery);
                } else {
                    if (_util.isAffiliate() && (typeof checkoutQuery.override == 'undefined' || checkoutQuery.override.length == 0)) {
                        var checkoutFullUrl = 'https://a.paddle.com/checkout/' + _util.affiliateToken() + '/?type=product&product_id=' + productId + '&' + _util.queryString(checkoutQuery);
                        if (typeof checkoutQuery.success != 'undefined' && checkoutQuery.success != '') {
                            checkoutQuery.affiliate_success = _util.absoluteUrl(checkoutQuery.success);
                        }
                    } else {
                        if (typeof checkoutQuery.override != 'undefined' && checkoutQuery.override != '' && checkoutQuery.override != null) {
                            if (checkoutQuery.override.indexOf('?') <= -1) {
                                var overrideGlue = '/?';
                            } else {
                                var overrideGlue = '&';
                            }
                            var checkoutFullUrl = checkoutQuery.override + overrideGlue + _util.queryString(checkoutQuery);
                        } else {
                            var checkoutFullUrl = _this.Environment.defaults().checkoutBase + productId + '/?' + _util.queryString(checkoutQuery);
                        }
                    }
                }
                _this.Debug('Built checkout URL: ' + checkoutFullUrl);
                return checkoutFullUrl;
            }, renderCheckoutFrame: function (productId, checkoutQuery, inline) {
                if (typeof inline == 'undefined') {
                    var inline = false;
                }
                if (_options.sdk) {
                    var checkoutUrl = _util.buildCheckoutUrl(productId, checkoutQuery, 'fallback');
                } else {
                    var checkoutUrl = _util.buildCheckoutUrl(productId, checkoutQuery, 'popup');
                }
                if (!inline) {
                    _util.showLoading();
                }
                window.PaddleFrame = document.createElement('iframe');
                window.PaddleFrame.id = 'pf_' + productId;
                window.PaddleFrame.className = 'paddle-frame';
                window.PaddleFrame.frameborder = '0';
                window.PaddleFrame.allowtransparency = 'true';
                if (typeof checkoutQuery.frameStyle != 'undefined' && checkoutQuery.frameStyle != '') {
                    window.PaddleFrame.setAttribute('style', checkoutQuery.frameStyle);
                } else {
                    if (!_util.isMobile()) {
                        window.PaddleFrame.style.zIndex = "99999";
                        window.PaddleFrame.style.display = _util.initialCheckoutVisibility();
                        window.PaddleFrame.style.backgroundColor = "transparent";
                        window.PaddleFrame.style.border = "0px none transparent";
                        window.PaddleFrame.style.overflowX = "hidden";
                        window.PaddleFrame.style.overflowY = "auto";
                        window.PaddleFrame.style.visibility = "visible";
                        window.PaddleFrame.style.margin = "0px";
                        window.PaddleFrame.style.padding = "0px";
                        window.PaddleFrame.style.webkitTapHighlightColor = "transparent";
                        window.PaddleFrame.style.position = "fixed";
                        window.PaddleFrame.style.left = "0px";
                        window.PaddleFrame.style.top = "0px";
                        window.PaddleFrame.style.width = "100%";
                        window.PaddleFrame.style.height = "100%";
                    } else {
                        window.PaddleFrame.style.zIndex = "99999";
                        window.PaddleFrame.style.display = _util.initialCheckoutVisibility();
                        window.PaddleFrame.style.backgroundColor = "transparent";
                        window.PaddleFrame.style.border = "0px none transparent";
                        window.PaddleFrame.style.overflowX = "hidden";
                        window.PaddleFrame.style.overflowY = "scroll";
                        window.PaddleFrame.style.visibility = "visible";
                        window.PaddleFrame.style.margin = "0px";
                        window.PaddleFrame.style.padding = "0px";
                        window.PaddleFrame.style.webkitTapHighlightColor = "transparent";
                        window.PaddleFrame.style.position = "absolute";
                        window.PaddleFrame.style.left = "0px";
                        window.PaddleFrame.style.top = "0px";
                        window.PaddleFrame.style.width = "100%";
                        window.PaddleFrame.style.height = "100%";
                    }
                }
                if (typeof checkoutQuery.frameInitialHeight != 'undefined') {
                    window.PaddleFrame.setAttribute('height', checkoutQuery.frameInitialHeight);
                }
                window.PaddleFrame.src = checkoutUrl;
                if (_util.isMobile() && (typeof _activeCheckout.method == 'undefined' || _activeCheckout.method != 'inline')) {
                    window.mobileViewportControl.freeze(1.0, 'pf_' + productId);
                }
                if (typeof checkoutQuery.frameTarget != 'undefined' && checkoutQuery.frameTarget != '') {
                    document.getElementsByClassName(checkoutQuery.frameTarget)[0].appendChild(window.PaddleFrame);
                } else {
                    document.getElementsByTagName('body')[0].appendChild(window.PaddleFrame);
                }
            }, renderCheckoutWindow: function (productId, checkoutQuery) {
                if (typeof window.PaddleWindow != 'undefined' && !window.PaddleWindow.closed) {
                    _util.closeCheckout(null);
                }
                delete window.PaddleWindow;
                window.PaddleWindow = window.open("", 'PaddlePopupWindow', 'width=' + _defaults.popupWindow.width + ',height=' + _defaults.popupWindow.height + ',location=' + _defaults.popupWindow.location + ',menubar=' + _defaults.popupWindow.menubar + ',resizable=' + _defaults.popupWindow.resizable + ',scrollbars=' + _defaults.popupWindow.scrollbars + ',status=' + _defaults.popupWindow.status + ',toolbar=' + _defaults.popupWindow.toolbar + ',top=' + _util.popupWindowPosition('top', _defaults.popupWindow.width, _defaults.popupWindow.height) + ',left=' + _util.popupWindowPosition('left', _defaults.popupWindow.width, _defaults.popupWindow.height), false);
                if (typeof window.PaddleWindow != 'undefined') {
                    window.PaddleWindow.document.write('<title>Loading Checkout...</title>' + _util.showLoading(true));
                    window.PaddleWindow.location.href = _util.buildCheckoutUrl(productId, checkoutQuery, 'fallback');
                    window.PaddleWindow.focus();
                    _util.checkPopupWindowClosed('PaddleWindow', true);
                    _this.Debug('Successfully opened Paddle Checkout as a popup window.');
                } else {
                    _this.Analytics.track('Paddle.Checkout.Open.Failed', {}, {
                        'Error.FailureType': 'window',
                        'Error.Message': 'Failed to open checkout popup window, falling back to opening in current window.'
                    });
                    _this.Debug('Unable to load Paddle Checkout as a popup window (typically due to popup blocker), falling back to opening in the current page. Callbacks will not be called upon close and success.', 'warning');
                    window.location.href = _util.buildCheckoutUrl(productId, checkoutQuery, 'normal');
                }
            }, popupWindowPosition: function (direction, popupWidth, popupHeight) {
                var dualScreenLeft = window.screenLeft != undefined ? window.screenLeft : screen.left;
                var dualScreenTop = window.screenTop != undefined ? window.screenTop : screen.top;
                var width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width;
                var height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height;
                var left = ((width / 2) - (popupWidth / 2)) + dualScreenLeft;
                var top = ((height / 2) - (popupHeight / 2)) + dualScreenTop;
                if (direction == 'left') {
                    return left;
                } else if (direction == 'top') {
                    return top;
                } else {
                    return false;
                }
            }, closeCheckout: function (callback_data, fireCustomCallback, fireAnalytics) {
                var fireAnalytics = (typeof fireAnalytics != 'undefined') ? fireAnalytics : true;
                _this.Debug('Checkout frame/window has been closed.');
                if (typeof _activeCheckout.upsell != 'undefined' && _activeCheckout.upsell != '') {
                    _this.Upsell.close(_activeCheckout.upsell);
                }
                var original = document.getElementById('paddle_upsell_original');
                if (original) {
                    original.style.display = "none";
                }
                if (typeof fireCustomCallback == 'undefined') {
                    var fireCustomCallback = true;
                }
                _util.hideLoading();
                _util.hidePoweredBy();
                _util.each('paddle-frame', function (element) {
                    element.parentNode.removeChild(element);
                });
                if (typeof window.PaddleWindow != 'undefined' && !window.PaddleWindow.closed) {
                    _util.clearPopupWindowClosureCheck();
                    window.PaddleWindow.close();
                }
                var closeObject = callback_data;
                if (fireAnalytics) {
                    _this.Analytics.track('Paddle.Checkout.Close', closeObject, {});
                }
                if (fireCustomCallback) {
                    if (typeof window[_activeCheckout.closeCallback] == 'function') {
                        delete closeObject.checkoutCompleted;
                        window[_activeCheckout.closeCallback](closeObject);
                    } else if (typeof _activeCheckout.closeCallback == 'function') {
                        delete closeObject.checkoutCompleted;
                        _activeCheckout.closeCallback(closeObject);
                    }
                }
                if (_util.isMobile() && (typeof _activeCheckout.method == 'undefined' || _activeCheckout.method != 'inline')) {
                    window.mobileViewportControl.thaw();
                }
            }, completeCheckout: function (callback_data) {
                var completeObject = callback_data;
                _this.Analytics.track('Paddle.Checkout.Complete', completeObject, {});
                if (_this.Affiliate.isAffiliate()) {
                    _this.Affiliate.Event('Conversion', {CheckoutID: completeObject.checkout.id});
                    _this.Affiliate.EndSession();
                }
                if (typeof window[_activeCheckout.successCallback] == 'function') {
                    _util.closeCheckout(null, false, true);
                    delete completeObject.checkoutCompleted;
                    window[_activeCheckout.successCallback](completeObject);
                } else if (typeof _activeCheckout.successCallback == 'function') {
                    _util.closeCheckout(null, false, true);
                    delete completeObject.checkoutCompleted;
                    _activeCheckout.successCallback(completeObject);
                } else {
                    if (_activeCheckout.success && _activeCheckout.success != '') {
                        _util.closeCheckout(null, false, true);
                        _util.showLoading();
                        setTimeout(function () {
                            window.top.location.href = _activeCheckout.success || '#!';
                        }, 2100);
                    } else if (callback_data && typeof callback_data.checkout != 'undefined' && callback_data.checkout.redirect_url != 'undefined' && callback_data.checkout.redirect_url != null) {
                        _util.closeCheckout(null);
                        _util.showLoading();
                        setTimeout(function () {
                            window.top.location.href = callback_data.checkout.redirect_url || '#!';
                        }, 2100);
                    } else {
                        if (_options.completeDetails) {
                            _util.closeCheckout(null);
                            _this.Analytics.track('Paddle.Checkout.Complete.AutomaticDetailsPopup', completeObject, {});
                            _this.Order.DetailsPopup(completeObject.checkout.id, '<div class="paddle-details-popup-interim-title">Success! Your transaction has been completed!</div><div class="paddle-details-popup-interim-message">Your order is now being processed and this page will update when processing is complete, an order confirmation email and receipt will be sent to the email address used during purchase.</div><div class="paddle-details-popup-interim-message-small">You can close this page at any time, processing will continue in the background and your order confirmation will be emailed to you.</div>');
                        } else {
                            _this.Analytics.track('Paddle.Checkout.Complete.NoAction', completeObject, {});
                        }
                    }
                }
            }, checkPopupWindowClosed: function (popupWindow, newWindow) {
                if (typeof newWindow == 'undefined') {
                    var newWindow = false;
                } else {
                    if (newWindow) {
                        window.clearInterval(window.PaddleCheckWindowClosure);
                        delete window.PaddleCheckWindowClosure;
                    }
                }
                if (typeof window[popupWindow] != 'undefined' && window[popupWindow].closed) {
                    _util.clearPopupWindowClosureCheck();
                    _util.closeCheckout(null);
                } else {
                    if (typeof window[popupWindow] != 'undefined' && typeof window.PaddleCheckWindowClosure == 'undefined') {
                        window.PaddleCheckWindowClosure = window.setInterval(function () {
                            _util.checkPopupWindowClosed(popupWindow);
                        }, 500);
                    }
                }
            }, clearPopupWindowClosureCheck: function () {
                if (typeof window.PaddleCheckWindowClosure != 'undefined') {
                    window.clearInterval(window.PaddleCheckWindowClosure);
                }
            }, hasClass: function (el, className) {
                if (el.classList) {
                    return el.classList.contains(className);
                } else {
                    return !!el.className.match(new RegExp('(\\s|^)' + className + '(\\s|$)'));
                }
            }, addClass: function (el, className) {
                if (el.classList) {
                    el.classList.add(className);
                } else if (!this.hasClass(el, className)) {
                    el.className += " " + className;
                }
            }, removeClass: function (el, className) {
                if (el.classList) {
                    el.classList.remove(className);
                } else if (this.hasClass(el, className)) {
                    var reg = new RegExp('(\\s|^)' + className + '(\\s|$)');
                    el.className = el.className.replace(reg, ' ');
                }
            }, nodeToString: function (node) {
                var tmpNode = document.createElement("div");
                tmpNode.appendChild(node.cloneNode(true));
                var str = tmpNode.innerHTML;
                tmpNode = node = null;
                return str;
            }, urlParam: function (param) {
                var vars = {};
                var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value) {
                    vars[key] = value;
                });
                return vars[param] ? vars[param].split('#')[0] : '';
            }, setCookie: function (cookieName, cookieValue, expiresDays) {
                if (expiresDays === -1) {
                    var expires = 'Thu, 01 Jan 1970 00:00:01 GMT';
                } else {
                    var date = new Date();
                    date.setTime(date.getTime() + (expiresDays * 24 * 60 * 60 * 1000));
                    var expires = "expires=" + date.toUTCString();
                }
                if (expiresDays != null) {
                    document.cookie = cookieName + "=" + cookieValue + "; path=/; " + expires;
                } else {
                    document.cookie = cookieName + "=" + cookieValue + "; path=/;";
                }
                return true;
            }, getCookie: function (cookieName) {
                var name = cookieName + "=";
                var ca = document.cookie.split(';');
                for (var i = 0; i < ca.length; i++) {
                    var c = ca[i];
                    while (c.charAt(0) == ' ') c = c.substring(1);
                    if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
                }
                return "";
            }, removeCookie: function (cookieName) {
                _util.setCookie(cookieName, '', -1);
            }, absoluteUrl: function (path) {
                var link = document.createElement("a");
                link.href = path;
                return link.protocol + "//" + link.host + link.pathname + link.search + link.hash;
            }, campaignDomainCategory: function (domain) {
                var categorizedDomain = {};
                if (domain != '') {
                    if (typeof _defaults.domainCategories[domain] == 'undefined') {
                        var domainMatched = false;
                        for (var domainMatch in _defaults.domainCategories) {
                            if (!domainMatched) {
                                if (domain.indexOf(domainMatch) >= 0) {
                                    categorizedDomain = {
                                        type: _defaults.domainCategories[domainMatch].type,
                                        name: _defaults.domainCategories[domainMatch].name
                                    };
                                    domainMatched = true;
                                }
                            }
                        }
                        if (!domainMatched) {
                            categorizedDomain = false;
                        }
                    } else {
                        categorizedDomain = {
                            type: _defaults.domainCategories[domain].type,
                            name: _defaults.domainCategories[domain].name
                        };
                    }
                } else {
                    categorizedDomain = false;
                }
                return categorizedDomain;
            }, campaignAttributes: function () {
                var returnCampaign = {};
                if (typeof _util.getCookie(_defaults.campaignCookiePrefix + 'affiliate') != 'undefined' && _util.getCookie(_defaults.campaignCookiePrefix + 'affiliate') != '') {
                    returnCampaign.Affiliate = true;
                    returnCampaign.AffiliateData = JSON.parse(_util.getCookie(_defaults.campaignCookiePrefix + 'affiliate'));
                } else {
                    if (typeof _util.urlParam('p_tok') != 'undefined' && _util.urlParam('p_tok') != '') {
                        returnCampaign.Affiliate = true;
                        returnCampaign.AffiliateData = {
                            token: _util.urlParam('p_tok'),
                            link: _util.urlParam('p_link'),
                            affiliate: _util.urlParam('p_aid'),
                            seller: _util.urlParam('p_sid')
                        };
                        _util.setCookie(_defaults.campaignCookiePrefix + 'affiliate', JSON.stringify(returnCampaign.AffiliateData), _defaults.campaignCookieExpiresDays);
                    } else {
                        returnCampaign.Affiliate = false;
                        returnCampaign.AffiliateData = {token: false, link: false, affiliate: false, seller: false};
                    }
                }
                if (typeof _util.getCookie(_defaults.campaignCookiePrefix + 'discovery') != 'undefined' && _util.getCookie(_defaults.campaignCookiePrefix + 'discovery') != '') {
                    returnCampaign.Discovery = true;
                } else {
                    if (typeof _util.urlParam('p_discovery') != 'undefined' && _util.urlParam('p_discovery') == 'true') {
                        returnCampaign.Discovery = true;
                        _util.setCookie(_defaults.campaignCookiePrefix + 'discovery', 'true', _defaults.campaignCookieExpiresDays);
                    } else {
                        returnCampaign.Discovery = false;
                    }
                }
                if (typeof _util.getCookie(_defaults.campaignCookiePrefix + 'paddle_ref') != 'undefined' && _util.getCookie(_defaults.campaignCookiePrefix + 'paddle_ref') != '') {
                    returnCampaign.PaddleRef = _util.getCookie(_defaults.campaignCookiePrefix + 'paddle_ref');
                } else {
                    if (typeof _util.urlParam('paddle_ref') != 'undefined' && _util.urlParam('paddle_ref') != '') {
                        returnCampaign.PaddleRef = _util.urlParam('paddle_ref');
                        _util.setCookie(_defaults.campaignCookiePrefix + 'paddle_ref', returnCampaign.PaddleRef, _defaults.campaignCookieExpiresDays);
                    } else {
                        returnCampaign.PaddleRef = false;
                    }
                }
                if (typeof _util.getCookie(_defaults.campaignCookiePrefix + 'campaign') != 'undefined' && _util.getCookie(_defaults.campaignCookiePrefix + 'campaign') != '') {
                    returnCampaign.Campaign = _util.getCookie(_defaults.campaignCookiePrefix + 'campaign');
                } else {
                    if (typeof _util.urlParam('utm_campaign') != 'undefined' && _util.urlParam('utm_campaign') != '') {
                        returnCampaign.Campaign = _util.urlParam('utm_campaign');
                        _util.setCookie(_defaults.campaignCookiePrefix + 'campaign', returnCampaign.Campaign, _defaults.campaignCookieExpiresDays);
                    } else {
                        returnCampaign.Campaign = false;
                    }
                }
                if (typeof _util.getCookie(_defaults.campaignCookiePrefix + 'source') != 'undefined' && _util.getCookie(_defaults.campaignCookiePrefix + 'source') != '') {
                    returnCampaign.Source = _util.getCookie(_defaults.campaignCookiePrefix + 'source');
                } else {
                    if (typeof _util.urlParam('utm_source') != 'undefined' && _util.urlParam('utm_source') != '') {
                        returnCampaign.Source = _util.urlParam('utm_campaign');
                        _util.setCookie(_defaults.campaignCookiePrefix + 'source', returnCampaign.Source, _defaults.campaignCookieExpiresDays);
                    } else {
                        returnCampaign.Source = false;
                    }
                }
                if (typeof _util.getCookie(_defaults.campaignCookiePrefix + 'medium') != 'undefined' && _util.getCookie(_defaults.campaignCookiePrefix + 'medium') != '') {
                    returnCampaign.Medium = _util.getCookie(_defaults.campaignCookiePrefix + 'medium');
                } else {
                    if (typeof _util.urlParam('utm_medium') != 'undefined' && _util.urlParam('utm_medium') != '') {
                        returnCampaign.Medium = _util.urlParam('utm_medium');
                        _util.setCookie(_defaults.campaignCookiePrefix + 'medium', returnCampaign.Medium, _defaults.campaignCookieExpiresDays);
                    } else {
                        returnCampaign.Medium = false;
                    }
                }
                if (typeof _util.getCookie(_defaults.campaignCookiePrefix + 'term') != 'undefined' && _util.getCookie(_defaults.campaignCookiePrefix + 'term') != '') {
                    returnCampaign.Term = _util.getCookie(_defaults.campaignCookiePrefix + 'term');
                } else {
                    if (typeof _util.urlParam('utm_term') != 'undefined' && _util.urlParam('utm_term') != '') {
                        returnCampaign.Term = _util.urlParam('utm_term');
                        _util.setCookie(_defaults.campaignCookiePrefix + 'term', returnCampaign.Term, _defaults.campaignCookieExpiresDays);
                    } else {
                        returnCampaign.Term = false;
                    }
                }
                if (typeof _util.getCookie(_defaults.campaignCookiePrefix + 'referrer') != 'undefined' && _util.getCookie(_defaults.campaignCookiePrefix + 'referrer') != '') {
                    returnCampaign.Referrer = _util.getCookie(_defaults.campaignCookiePrefix + 'referrer');
                } else {
                    if (typeof document.referrer.split('/')[2] != 'undefined' && document.referrer.split('/')[2] != '') {
                        returnCampaign.Referrer = document.referrer.split('/')[2];
                        _util.setCookie(_defaults.campaignCookiePrefix + 'referrer', returnCampaign.Referrer, _defaults.campaignCookieExpiresDays);
                    } else {
                        returnCampaign.Referrer = false;
                    }
                }
                if (returnCampaign.Referrer) {
                    var referrerMeta = _util.campaignDomainCategory(returnCampaign.Referrer);
                    if (referrerMeta) {
                        returnCampaign.Referrer = referrerMeta.name;
                        returnCampaign.ReferrerCategory = referrerMeta.type;
                    } else {
                        returnCampaign.ReferrerCategory = false;
                    }
                } else {
                    returnCampaign.ReferrerCategory = false;
                }
                return returnCampaign;
            }, analyticsDefaults: function () {
                var analyticsDefaultValues = {};
                analyticsDefaultValues._Library = {};
                analyticsDefaultValues._Request = {};
                analyticsDefaultValues._Affiliate = {};
                analyticsDefaultValues._Discovery = {};
                analyticsDefaultValues._Campaign = {};
                analyticsDefaultValues._Campaign.Referrer = {};
                analyticsDefaultValues._SDK = {};
                analyticsDefaultValues._Tests = {};
                analyticsDefaultValues._Tests = {Checkout: _options.checkoutVariant};
                analyticsDefaultValues._Library.Version = libraryVersion;
                analyticsDefaultValues._Library.LoadMethod = _options.loadMethod;
                analyticsDefaultValues._Vendor = _options.vendor || null;
                analyticsDefaultValues._Request.Secure = (window.location.protocol == 'https') ? true : false;
                analyticsDefaultValues._Request.Domain = (_options.sdk && _options.sdkAttributes && _options.sdkAttributes.bundleIdentifier) ? _options.sdkAttributes.bundleIdentifier : window.location.host.replace(/www\./, '');
                analyticsDefaultValues._Request.Page = window.location.origin + window.location.pathname;
                analyticsDefaultValues._Request.Mobile = _util.isMobile();
                analyticsDefaultValues._Request.Browser = (_options.sdk) ? 'SDK' : _util.analyticsContext().browser || 'Unknown';
                analyticsDefaultValues._Request.Platform = (_options.sdk) ? 'SDK' : (_util.isMobile()) ? 'Mobile' : 'Web';
                analyticsDefaultValues._Request.ApplePaySupported = _util.isApplePaySupported();
                if (_options.sdk) {
                    analyticsDefaultValues._SDK = _options.sdkAttributes || {};
                }
                var campaignData = _util.campaignAttributes();
                analyticsDefaultValues._Campaign.Referrer.Name = (campaignData.Referrer) ? campaignData.Referrer : null;
                analyticsDefaultValues._Campaign.Referrer.Type = (campaignData.ReferrerCategory) ? campaignData.ReferrerCategory : null;
                analyticsDefaultValues._Campaign.Paddle = (campaignData.PaddleRef) ? campaignData.PaddleRef : null;
                analyticsDefaultValues._Campaign.Name = (campaignData.Campaign) ? campaignData.Campaign : null;
                analyticsDefaultValues._Campaign.Source = (_options.sdk) ? 'SDK' : (campaignData.Source) ? campaignData.Source : null;
                analyticsDefaultValues._Campaign.Medium = (campaignData.Medium) ? campaignData.Medium : null;
                analyticsDefaultValues._Campaign.Term = (campaignData.Term) ? campaignData.Term : null;
                analyticsDefaultValues._Affiliate.IsAffiliate = (campaignData.Affiliate) ? true : false;
                analyticsDefaultValues._Affiliate.AffiliateToken = (campaignData.AffiliateData.token) ? campaignData.AffiliateData.token : null;
                analyticsDefaultValues._Discovery.IsDiscovery = (campaignData.Discovery) ? true : false;
                analyticsDefaultValues._Campaign.CampaignSummaryString = '';
                if (analyticsDefaultValues._Request.Domain != null) {
                    if (analyticsDefaultValues._Campaign.CampaignSummaryString != '') analyticsDefaultValues._Campaign.CampaignSummaryString += ' / ';
                    analyticsDefaultValues._Campaign.CampaignSummaryString += analyticsDefaultValues._Request.Domain.replace('/', '');
                }
                if (analyticsDefaultValues._Discovery.IsDiscovery) {
                    if (analyticsDefaultValues._Campaign.CampaignSummaryString != '') analyticsDefaultValues._Campaign.CampaignSummaryString += ' / ';
                    analyticsDefaultValues._Campaign.CampaignSummaryString += 'Paddle Discovery';
                } else {
                    if (analyticsDefaultValues._Affiliate.IsAffiliate) {
                        if (analyticsDefaultValues._Campaign.CampaignSummaryString != '') analyticsDefaultValues._Campaign.CampaignSummaryString += ' / ';
                        analyticsDefaultValues._Campaign.CampaignSummaryString += 'Affiliate';
                    }
                }
                if (analyticsDefaultValues._Campaign.Referrer.Name != null) {
                    if (analyticsDefaultValues._Campaign.CampaignSummaryString != '') analyticsDefaultValues._Campaign.CampaignSummaryString += ' / ';
                    analyticsDefaultValues._Campaign.CampaignSummaryString += analyticsDefaultValues._Campaign.Referrer.Name.replace('/', '');
                }
                if (analyticsDefaultValues._Campaign.Paddle != null) {
                    if (analyticsDefaultValues._Campaign.CampaignSummaryString != '') analyticsDefaultValues._Campaign.CampaignSummaryString += ' / ';
                    analyticsDefaultValues._Campaign.CampaignSummaryString += analyticsDefaultValues._Campaign.Paddle.replace('/', '');
                }
                if (analyticsDefaultValues._Campaign.Name != null) {
                    if (analyticsDefaultValues._Campaign.CampaignSummaryString != '') analyticsDefaultValues._Campaign.CampaignSummaryString += ' / ';
                    analyticsDefaultValues._Campaign.CampaignSummaryString += analyticsDefaultValues._Campaign.Name.replace('/', '');
                }
                if (_options.sdk) {
                    analyticsDefaultValues._Campaign.CampaignSummaryString = _options.sdkAttributes.appName + ' In-app Purchase (SDK)';
                }
                return analyticsDefaultValues;
            }, setPaddleCampaign: function (campaignValue) {
                if (campaignValue != null && campaignValue != '') {
                    _util.setCookie(_defaults.campaignCookiePrefix + 'paddle_ref', campaignValue, _defaults.campaignCookieExpiresDays);
                }
            }, buildPaddleReferrerString: function () {
                var analyticsData = _util.analyticsDefaults();
                return analyticsData._Campaign.CampaignSummaryString || '';
            }, isAffiliate: function () {
                if (_util.getCookie(_defaults.campaignCookiePrefix + 'affiliate_ignore') != _util.affiliateToken() && _util.affiliateToken()) {
                    var analyticsData = _util.analyticsDefaults();
                    return analyticsData._Affiliate.IsAffiliate;
                } else {
                    return false;
                }
            }, affiliateToken: function () {
                var campaignData = _util.campaignAttributes();
                if (campaignData.AffiliateData.token != _util.getCookie(_defaults.campaignCookiePrefix + 'affiliate_ignore')) {
                    return campaignData.AffiliateData.token;
                } else {
                    return false;
                }
            }, jsonp: function (url, callback, context) {
                var name = "_jsonp_" + Math.ceil(Math.random() * 10000000);
                if (url.match(/\?/)) {
                    url += "&callback=" + name;
                } else {
                    url += "?callback=" + name;
                }
                var script = document.createElement('script');
                script.type = 'text/javascript';
                script.src = url;
                window[name] = function (data) {
                    _this.Debug('Paddle API call finished (' + url + '), response: ' + JSON.stringify(data));
                    callback.call((context || window), data);
                    document.getElementsByTagName('head')[0].removeChild(script);
                    script = null;
                    delete window[name];
                };
                document.getElementsByTagName('head')[0].appendChild(script);
            }, post: function (url, parameterString, callback) {
                var http = new XMLHttpRequest();
                http.open("POST", url, true);
                http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
                http.onreadystatechange = function () {
                    if (http.readyState == 4 && http.status == 200) {
                        if (typeof callback == 'function') {
                            callback(http.responseText);
                        }
                    }
                }
                http.send(parameterString);
            }, isApplePaySupported: function () {
                var applePaySession = window.ApplePaySession;
                var isSupported;
                try {
                    isSupported = applePaySession && applePaySession.canMakePayments();
                } catch (e) {
                    isSupported = false;
                }
                return !!isSupported;
            }
        };
        this.Debug = function (message, type, alwaysShow) {
            window.console = console || {
                log: function (message) {
                }, error: function (message) {
                }, warn: function (message) {
                }
            };
            window.console.debug = window.console.debug || window.console.log || function () {
            };
            if (typeof type == 'undefined') {
                var type = 'log';
            }
            if (typeof alwaysShow == 'undefined') {
                var alwaysShow = false;
            }
            var debugMessage = '[Paddle Debug] ' + message;
            if (_options.debug) {
                if (type == 'log') {
                    console.debug(debugMessage);
                } else if (type == 'warning') {
                    console.warn(debugMessage);
                }
            }
            if (alwaysShow) {
                console.warn(message);
            }
        };
    }
})();
(function () {
    var Paddle;
    var PaddleVersion = "1.9.22";
    if (this.Paddle == null || typeof this.Paddle == 'undefined') {
        this.Paddle || (this.Paddle = {});
        this.Paddle = new _Paddle(window, PaddleVersion);
    }
})(this);
if (!Array.prototype.forEach) {
    Array.prototype.forEach = function (callback, thisArg) {
        var T, k;
        if (this === null) {
            throw new TypeError(' this is null or not defined');
        }
        var O = Object(this);
        var len = O.length >>> 0;
        if (typeof callback !== "function") {
            throw new TypeError(callback + ' is not a function');
        }
        if (arguments.length > 1) {
            T = thisArg;
        }
        k = 0;
        while (k < len) {
            var kValue;
            if (k in O) {
                kValue = O[k];
                callback.call(T, kValue, k, O);
            }
            k++;
        }
    };
}
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define('mobile-viewport-control', [], factory);
    }
    else if (typeof module === 'object' && module.exports) {
        module.exports = factory();
    }
    else {
        root.mobileViewportControl = factory();
    }
}(this, function () {
    function getScroll() {
        return {
            top: window.pageYOffset || document.documentElement.scrollTop,
            left: window.pageXOffset || document.documentElement.scrollLeft
        };
    }

    function setScroll(scroll) {
        if (window.scrollTo) {
            window.scrollTo(scroll.left, scroll.top);
        } else {
            document.documentElement.scrollTop = scroll.top;
            document.documentElement.scrollLeft = scroll.left;
            document.body.scrollTop = scroll.top;
            document.body.scrollLeft = scroll.left;
        }
    }

    function getInitialViewport(withDefaults) {
        var viewport = {};
        if (withDefaults) {
            viewport = {'user-scalable': 'yes', 'minimum-scale': '0', 'maximum-scale': '10'};
        }
        var tags = document.querySelectorAll('meta[name=viewport]');
        var i, j, tag, content, keyvals, keyval;
        for (i = 0; i < tags.length; i++) {
            tag = tags[i];
            content = tag.getAttribute('content');
            if (tag.id !== hookID && content) {
                keyvals = content.split(',');
                for (j = 0; j < keyvals.length; j++) {
                    keyval = keyvals[j].split('=');
                    if (keyval.length === 2) {
                        viewport[keyval[0].trim()] = keyval[1].trim();
                    }
                }
            }
        }
        return viewport;
    }

    function getPrettyInitialViewport() {
        var initial = getInitialViewport();
        var keyvals = [];
        for (var prop in initial) {
            if (initial.hasOwnProperty(prop)) {
                keyvals.push({key: prop, val: initial[prop]});
            }
        }
        return (keyvals.sort(function (a, b) {
            if (a.key < b.key) return -1;
            if (a.key > b.key) return 1;
            return 0;
        }).map(function (kv) {
            return kv.key + '=' + kv.val;
        }).join(',\n'));
    }

    function getOrientation() {
        var degrees = window.orientation;
        var w = document.documentElement.clientWidth;
        var h = document.documentElement.clientHeight;
        if (degrees === undefined) {
            return (w > h) ? 'landscape' : 'portrait';
        }
        return (degrees % 180 === 0) ? 'portrait' : 'landscape';
    }

    function getOrientedScreenWidth() {
        var orientation = getOrientation();
        var sw = screen.width;
        var sh = screen.height;
        return (orientation === 'portrait') ? Math.min(sw, sh) : Math.max(sw, sh);
    }

    function getScale() {
        var visualViewportWidth = window.innerWidth;
        var screenWidth = getOrientedScreenWidth();
        return screenWidth / visualViewportWidth;
    }

    function getMobileOS() {
        var userAgent = navigator.userAgent || navigator.vendor || window.opera;
        if (userAgent.match(/iPad/i) || userAgent.match(/iPhone/i) || userAgent.match(/iPod/i)) {
            return 'iOS';
        }
        else if (userAgent.match(/Android/i)) {
            return 'Android';
        }
    }

    function isFirefox() {
        var userAgent = navigator.userAgent || navigator.vendor || window.opera;
        return userAgent.match(/Firefox/i) ? true : false;
    }

    var hookID = '__mobileViewportControl_hook__';
    var styleID = '__mobileViewPortControl_style__';
    var refreshDelay = 200;
    var originalScale;
    var originalScroll;
    var hiddenClasses = ['mvc__a', 'mvc__lot', 'mvc__of', 'mvc__classes', 'mvc__to', 'mvc__increase', 'mvc__the', 'mvc__odds', 'mvc__of', 'mvc__winning', 'mvc__specificity'];

    function isolatedStyle(elementID) {
        var classes = hiddenClasses.join('.');
        return ['html.' + classes + ',', 'html.' + classes + ' > body {', '  background: #fff;', '  width: auto;', '  min-width: inherit;', '  max-width: inherit;', '  height: auto;', '  min-height: 100%;', '  max-height: inherit;', '  margin: 0;', '  padding: 0;', '  border: 0;', '}', 'html.' + classes + ' > body > * {', '  display: none !important;', '}', 'html.' + classes + ' > body > #' + elementID + ' {', '  display: block !important;', '}'].join('\n');
    }

    function isolate(elementID) {
        var classes = hiddenClasses.join(' ');
        var html = document.documentElement;
        html.className += ' ' + classes;
        var style = document.createElement('style');
        style.id = styleID;
        style.type = 'text/css';
        style.appendChild(document.createTextNode(isolatedStyle(elementID)));
        document.head.appendChild(style);
    }

    function undoIsolate() {
        var classes = hiddenClasses.join(' ');
        var html = document.documentElement;
        html.className = html.className.replace(classes, '');
        var style = document.getElementById(styleID);
        document.head.removeChild(style);
    }

    function freeze(scale) {
        var isolateID, onDone;
        var args = Array.prototype.slice.call(arguments, 1);
        if (typeof args[0] === 'string') {
            isolateID = args[0];
            args.splice(0, 1);
        }
        if (typeof args[0] === 'function') {
            onDone = args[0];
        }
        originalScroll = getScroll();
        originalScale = getScale();
        if (isolateID) {
            isolate(isolateID);
            setScroll({x: 0, y: 0});
        }
        if (scale === 1) {
            scale = 1.002;
        }
        var hook = document.getElementById(hookID);
        if (!hook) {
            hook = document.createElement('meta');
            hook.id = hookID;
            hook.name = 'viewport';
            document.head.appendChild(hook);
        }
        var includeWidth = (getMobileOS() === 'Android' && isFirefox());
        hook.setAttribute('content', ['user-scalable=yes', 'initial-scale=' + scale, 'minimum-scale=' + scale, 'maximum-scale=' + (scale + 0.004), (includeWidth ? 'width=device-width' : null)].filter(Boolean).join(','));
        if (onDone) {
            setTimeout(onDone, refreshDelay);
        }
    }

    function thawWebkit(hook, initial, onDone) {
        hook.setAttribute('content', ['initial-scale=' + originalScale, 'minimum-scale=' + originalScale, 'maximum-scale=' + originalScale].join(','));
        hook.setAttribute('content', ['user-scalable=' + initial['user-scalable'], 'minimum-scale=' + initial['minimum-scale'], 'maximum-scale=' + initial['maximum-scale'], (initial.width ? 'width=' + initial.width : null)].filter(Boolean).join(','));
        document.head.removeChild(hook);
        setScroll(originalScroll);
        setTimeout(function () {
            if (onDone)
                onDone();
        }, refreshDelay);
    }

    function thawGecko(hook, initial, onDone) {
        hook.setAttribute('content', ['initial-scale=' + originalScale, 'minimum-scale=' + originalScale, 'maximum-scale=' + originalScale].join(','));
        setScroll(originalScroll);
        setTimeout(function () {
            hook.setAttribute('content', ['user-scalable=' + initial['user-scalable'], 'minimum-scale=' + initial['minimum-scale'], 'maximum-scale=' + initial['maximum-scale'], (initial.width ? 'width=' + initial.width : null)].filter(Boolean).join(','));
            setScroll(originalScroll);
            document.head.removeChild(hook);
            if (onDone)
                onDone();
        }, refreshDelay);
    }

    function thawBlink(hook, initial, onDone) {
        hook.setAttribute('content', ['user-scalable=' + initial['user-scalable'], 'initial-scale=' + initial['initial-scale'], 'minimum-scale=' + initial['minimum-scale'], 'maximum-scale=' + initial['maximum-scale'], (initial.width ? 'width=' + initial.width : null)].filter(Boolean).join(','));
        setScroll(originalScroll);
        setTimeout(function () {
            document.head.removeChild(hook);
            if (onDone)
                onDone();
        }, refreshDelay);
    }

    function thaw(onDone) {
        var style = document.getElementById(styleID);
        if (style) {
            undoIsolate();
        }
        var hook = document.getElementById(hookID);
        if (!hook) {
            return;
        }
        var initial = getInitialViewport(true);
        var thawFunc = thawWebkit;
        var os = getMobileOS();
        if (os === 'Android') {
            thawFunc = isFirefox() ? thawGecko : thawBlink;
        }
        else if (os === 'iOS') {
            thawFunc = thawWebkit;
        }
        thawFunc(hook, initial, onDone);
    }

    return {
        getInitialViewport: getInitialViewport,
        getPrettyInitialViewport: getPrettyInitialViewport,
        getScale: getScale,
        isolate: isolate,
        undoIsolate: undoIsolate,
        version: '0.3.1',
        freeze: freeze,
        thaw: thaw
    };
}));