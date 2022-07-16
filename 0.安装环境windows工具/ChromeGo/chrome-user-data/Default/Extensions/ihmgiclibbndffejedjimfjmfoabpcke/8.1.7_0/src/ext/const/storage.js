(function (undefined) {

    pl.extend(ke.ext.const.storage, {
        FROM_LANG: 'It_Lang_From',
        TO_LANG: 'It_Lang_To',
        RECENTLY_USED_LANG: 'It_Lang_RecentlyUsed',

        DROPDOWN_HTML: 'It_Opt_DropdownPregeneratedHtml',

        ZENDESK_USER: 'It_IsZendeskUser',
        SUBMITTED_ZENDESK_USER: 'It_IsZendeskUserSubmitted',

        SETTINGS_TAB: 'It_OptUi_SettingsTab',
        TRANS_COMBINATION: 'It_OptTrans_CombinationToTranslate',
        ADD_TRANS_COMBINATIONS: 'It_OptTrans_AdditionalCombinationsToTranslate',

        NO_PDF_SHOWS: 'It_WindowNoPDFShows',

        LANGSITES: 'It_LangSites',
        LANGSITES_LAST_UPDATE: 'It_LangSites_LastUpdate',
        MATE_ACCOUNT_TIP_DISMISSED: 'It_Tips_AccountDismissed',

        WIN_TRANS_TYPE_SHOWN: 'It_Ui_WindowTranslationTypeShown',
        WIN_TRANS_TYPE: 'It_Ui_WindowTranslationType',
        INSTANT: 'It_Ui_InstantTranslation',
        MULTI_VARIANT: 'It_Ui_MultiVariant',
        SAVE: 'It_Ui_Save',
        HUMAN: 'It_Ui_Human',
        SAVED_VAL: 'It_Ui_SavedVal',
        SHOW_ORIGINAL: 'It_Ui_ShowOriginal',
        SHOW_TRANSLIT: 'It_Ui_ShowTranslit',
        SHOW_ARTICLES: 'It_Ui_ShowArticles',
        SHOW_IPA: 'It_Ui_ShowIPA',
        AUTOSWAP: 'It_Ui_Autoswap',
        CTX_MENU: 'It_Ui_CtxMenu',
        SYNC: 'It_SyncFlag',
        AUTOCORRECTION: 'It_Ui_Autocorrection',
        CARET_POSITIONS: 'It_Ui_CaretPositions',
        DOUBLE_CLICK_INLINE_SHOWS: 'It_DoubleClickInlineOptionShows',
        SELECTION_INLINE_SHOWS: 'It_SelectionInlineOptionShows',
        NETFLIX: 'It_TranslateNetflixSubtitles',

        TOOLTIP_SCALE: 'It_TooltipScale',
        NEW_SETTINGS_COUNTER: 'It_TooltipNewSettingsFlag',

        INSTALL_DATE: 'It_InstallDate',
        ALL_TRANS_COUNT: 'It_AllTranslationsCount',
        LAST_TRANS_COUNT_UPD: 'It_LastTranslationsCountUpdate',
        TRANSLATIONS_COUNT: 'It_TranslationsCount',

        MONTHLY_TRANS_COUNT: 'It_MonthlyTranslationsCount',
        LAST_MONTHLY_RESET: 'It_LastMonthlyCounterReset',

        INVITE_FRIENDS_SHOWN: 'It_InviteFriendsShown',
        NETFLIX_UPDATE_SHOWN: 'It_NetflixUpdateShown',

        DOUBLE_CLICK: 'It_Trans_DoubleClick',
        KEY_COMBO: 'It_Trans_KeyCombinations',
        CONTEXT: 'It_Trans_ContextMenu',
        HISTORY: 'It_Trans_HistoryOfTranslations',
        WINDOW_SHORTCUT_SHOWN: 'It_WindowShortcutShown',

        MONETIZATION: 'It_Monetization',
        SHOW_DEVDATA: 'It_Dev_Data',
        MON_IS_CIS: 'It_Mon_IsCIS',
        MON_WARN: 'It_Mon_Warned',
        MATE_WELCOME_SHOWN: 'It_MateWelcomeShown',
        PRO_INAPP_PRICE: 'It_ProInAppPrice',
        CHRISTMAS_MON_WARN: 'It_ChristmasMonWarn',
        LAUCH_LOGIN_SHOWN: 'It_LoginOnLaunchShown',
        GDPR_CONSENT: 'It_GDPRConsent',

        LEARN_ONBOARDING: 'It_LearnOnboarding',

        TRIAL_STARTED: 'It_HasSafariTrialBeenStarted',
        TRIAL_START: 'It_SafariTrialStart',

        DARK_MODE: 'It_DarkMode',

        SEEN_TOUR: 'It_SeenTour',
        EXT_VER: 'It_Version',
        CHR_PRO_FLAG: 'It_IsChromePro',
        SUPRESS_SIGNIN: 'It_SupressSignInOnLaunch',
        FULLPAGE: 'It_FullpageTranslation',
        SELECTION: 'It_TranslateOnSelect',

        MISC_SERVER: 'It_MiscServerNum',
        FAREWELL_SURVEY: 'It_FarewellSurvey',

        REJI_ADS: 'It_RejiAdsEnabled',
        REJI_POPUP: 'It_RejiPopupTime',
        REJI_HISTORY: 'It_RejiHistoryFlag',
        REJI_PHRASEBOOK: 'It_RejiPhrasebookFlag',

        LAST_RATE_SHOW: 'It_LastRateShow',

        MB_USER: 'It_Monetization_MB',

        INSTALL_EVENT: 'It_InstallEventSent',
        ANALYZED_HISTORY: 'It_AnalyzedHistory',
        USER_ID: 'It_UserId',
        LIKE_MATE: 'It_DoesLikeMate',

        LAST_COUNTRY_FETCH: 'It_LastCountryFetch',
        LAST_COUNTRY_FETCH_2: 'It_LastCountryFetch2',
        LAST_PRICE_FETCH: 'It_LastPriceFetch',
        LAST_PROMOT_FETCH: 'It_LastPromoTableFetch',

        PROMO_TABLE: 'It_PromotionalTable',

        USER_COUNTRY: 'It_UserCountry',
        CONVERSION_RATES: 'It_CurrencyConversionRates',

        HT_FROM_LANG: 'It_HtLangFrom',
        HT_TO_LANG: 'It_HtLangTo',
        HT_SAVEDTEXT: 'It_HtSavedText',

        ACCOUNT_NAME: 'It_AccountName',
        ACCOUNT_EMAIL: 'It_AccountEmail',
        ACCOUNT_TOKEN: 'It_AccountToken'
    });

    var DEFAULT_VALUES = {
        FROM_LANG: 'auto',
        TO_LANG: ke.getCurrentLocale(true),
        RECENTLY_USED_LANG: [],

        ZENDESK_USER: false,
        SUBMITTED_ZENDESK_USER: false,
        
        LANGSITES: [],
        LANGSITES_LAST_UPDATE: 0,
        MATE_ACCOUNT_TIP_DISMISSED: false,

        DROPDOWN_HTML: {
            from: {
                code: '',
                select: ''
            },
            to: {
                code: '',
                select: ''
            }
        },

        TRANS_COMBINATION: '16+84',
        ADD_TRANS_COMBINATIONS: '{}',
        SETTINGS_TAB: 1,

        WIN_TRANS_TYPE_SHOWN: false,
        WIN_TRANS_TYPE: 2,
        INSTANT: false,
        MULTI_VARIANT: true,
        SAVE: true,
        HUMAN: false,
        SAVED_VAL: '',
        SHOW_ORIGINAL: true,
        SHOW_TRANSLIT: true,
        SHOW_ARTICLES: true,
        SHOW_IPA: true,
        AUTOSWAP: true,
        CTX_MENU: true,
        AUTOCORRECTION: true,
        CARET_POSITIONS: {start: 0, end: 0},
        DOUBLE_CLICK_INLINE_SHOWS: 0,
        SELECTION_INLINE_SHOWS: 0,

        DARK_MODE: false,
        NETFLIX: true,

        LIKE_MATE: -1,

        INSTALL_DATE: Date.now(),
        LAST_TRANS_COUNT_UPD: Date.now(),
        ALL_TRANS_COUNT: {
            'window': 0,
            'fullpage': 0,
            'phrasebook': 0,
            'double-click': 0,
            'shortcut': 0,
            'context-menu': 0,
            'selection': 0,
            'pdf': 0
        },
        TRANSLATIONS_COUNT: {
            'window': 0,
            'fullpage': 0,
            'phrasebook': 0,
            'double-click': 0,
            'shortcut': 0,
            'context-menu': 0,
            'selection': 0,
            'pdf': 0
        },

        MONTHLY_TRANS_COUNT: 0,
        LAST_MONTHLY_RESET: Date.now(),

        NO_PDF_SHOWS: 0,

        INVITE_FRIENDS_SHOWN: false,
        NETFLIX_UPDATE_SHOWN: false,

        LEARN_ONBOARDING: false,

        DOUBLE_CLICK: false,
        KEY_COMBO: true,
        CONTEXT: {
            active: true,
            value: 1
        },
        HISTORY: true,
        SYNC: true,
        WINDOW_SHORTCUT_SHOWN: false,

        get MONETIZATION() {
            return ke.IS_CHROME
                ? true
                : false;
        },
        SHOW_DEVDATA: true,
        MON_IS_CIS: false,
        MON_WARN: false,
        MAC_PROMO: false,
        MATE_WELCOME_SHOWN: true,
        PRO_INAPP_PRICE: '9.99$',
        CHRISTMAS_MON_WARN: false,
        LAUCH_LOGIN_SHOWN: false,
        GDPR_CONSENT: false,

        TOOLTIP_SCALE: 0.85,

        TRIAL_STARTED: false,
        TRIAL_START: Date.now(),

        SEEN_TOUR: false,
        EXT_VER: '',
        CHR_PRO_FLAG: false,
        SUPRESS_SIGNIN: '',
        FULLPAGE: true,
        SELECTION: true,

        MISC_SERVER: 'https://api2.matetranslate.com',
        FAREWELL_SURVEY: 'https://gikken.co/mate-translate/goodbye/',

        REJI_ADS: false,
        REJI_POPUP: Date.now(),
        REJI_HISTORY: false,
        REJI_PHRASEBOOK: false,

        LAST_RATE_SHOW: Date.now(),
        LAST_PRO_SHOW: Date.now(),
        LAST_MACPROMO_SHOW: Date.now(),

        MB_USER: '',
        NEW_SETTINGS_COUNTER: 0,

        INSTALL_EVENT: false,
        ANALYZED_HISTORY: false,
        USER_ID: '',

        LAST_COUNTRY_FETCH: 0,
        LAST_COUNTRY_FETCH_2: 0,
        LAST_PRICE_FETCH: 0,
        LAST_PROMOT_FETCH: 0,

        PROMO_TABLE: '{"ios":[true,"https://itunes.apple.com/app/id1073473333",""],"mac":[true,"https://twopeoplesoftware.com/mate"],"edge":[true,"https://www.microsoft.com/store/p/instant-translate-select-and-translate/9pj8vl1pqs7v"],"firefox":[true,"https://addons.mozilla.org/en-US/firefox/addon/instant-translate/",""],"chrome":[true,"https://chrome.google.com/webstore/detail/instant-translate-select/ihmgiclibbndffejedjimfjmfoabpcke",""],"safari":[true,"https://safari-extensions.apple.com/details/?id=com.matetranslate.app-S8B638MM79",""],"samsunginternet":[true,"http://apps.samsung.com/appquery/appDetail.as?appId=com.gikken.matesamsung"]}',

        USER_COUNTRY: '--',
        CONVERSION_RATES: '{}',

        HT_FROM_LANG: '',
        HT_TO_LANG: '',
        HT_SAVEDTEXT: '',

        ACCOUNT_NAME: '',
        ACCOUNT_EMAIL: '',
        ACCOUNT_TOKEN: ''
    };

    pl.extend(ke.ext.const.storage, {
        DEFAULT_VALUES: DEFAULT_VALUES,

        FAREWELL_NEW: 'https://docs.google.com/forms/d/e/1FAIpQLSd938lNG6QYZv3ZCSqzWqVezY_NrTQUF1T5DOrrOpWSLJFn-g/viewform',
        FAREWELL_OLD: 'https://docs.google.com/forms/d/e/1FAIpQLSeO53ksILQ0Pg6crEdJ5nUiqfaJ_TekJyd1iRfzXYVMXRbgrg/viewform'
    });

    // Simple getters
    pl.extend(ke, {
        getStorageConst: function (n) {
            return ke.ext.const.storage[n.toUpperCase()];
        },

        getStorageDefValue: function (n) {
            return DEFAULT_VALUES[n.toUpperCase()];
        }
    });

})();