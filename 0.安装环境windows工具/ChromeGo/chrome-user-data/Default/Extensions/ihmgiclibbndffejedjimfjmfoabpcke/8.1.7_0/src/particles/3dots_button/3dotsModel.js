/**
 * Created by chernikovalexey on 07/11/17.
 */

(function (undefined) {

    ke.import('ext.clipboard');

    pl.extend(ke.particles.three_dots.model, {
        getClassIntAttr: function (className, attr) {
            var classes = className.split(' ');

            for (var i = 0, len = classes.length; i < len; ++i) {
                var _a = classes[i].split('-');
                if (_a[0] === attr) {
                    return +_a[1];
                }
            }

            return -1;
        },

        getOriginalWord: function (event) {
            if (ke.section === 'content' || ke.section === 'pdf_tooltip') {
                var tid = ke.particles.three_dots.model.getClassIntAttr($(event.target).attr('class'), 't');
                return ke.particles.listen.model._getTransValue('tooltip', 'orig', $('.' + ke.getPrefix() + 'tooltip-' + tid));
            } else if (ke.section === 'window') {
                return $('.translation-input').val();
            } else if (ke.section === 'phrasebook') {
                return ke.app.handlers.getPlaybackContents('orig', $('.expanded'));
            } else if (ke.section === 'history') {
                return ke.particles.hist_list.model.getListenValue('orig', $('.expanded'));
            }

            return '';
        },

        getTranslatedWord: function (event) {
            if (ke.section === 'content' || ke.section === 'pdf_tooltip') {
                var tid = ke.particles.three_dots.model.getClassIntAttr($(event.target).attr('class'), 't');
                return ke.particles.listen.model._getTransValue('tooltip', 'trans', $('.' + ke.getPrefix() + 'tooltip-' + tid));
            } else if (ke.section === 'window') {
                return ke.particles.listen.model._getTransValue('window');
            } else if (ke.section === 'phrasebook') {
                return ke.app.handlers.getPlaybackContents('trans');
            } else if (ke.section === 'history') {
                return ke.particles.hist_list.model.getListenValue('trans');
            }

            return '';
        },

        createWordlist: function (a, event) {
            chrome.runtime.sendMessage({
                action: ke.processCall('app', 'opt', 'newTab'),
                url: ke.ext.tpl.compile(chrome.extension.getURL("/pages/public/phrasebook.html#wl_create?from=<%=from%>&to=<%=to%>&text=<%=text%>&word=<%=word%>"), {
                    from: ke.particles.three_dots.view.current_from_lang,
                    to: ke.particles.three_dots.view.current_to_lang,
                    word: ke.particles.three_dots.model.getOriginalWord(event)
                })
            });

            chrome.runtime.sendMessage({
                action: ke.processCall('app', 'commands', 'sendAnalyticsEvent'),
                cat: 'three-dot',
                event: ke.section,
                subevent: 'create-wordlist'
            });
        },

        addToWordlist: function (a, event) {
            var wl_id = ke.particles.three_dots.model.getClassIntAttr($(event.target).attr('class'), 'wl');
            var from = ke.particles.three_dots.view.current_from_lang;
            var to = ke.particles.three_dots.view.current_to_lang;
            var phrase = ke.particles.three_dots.model.getOriginalWord(event);
            var wl_name = $(event.target).html();

            chrome.runtime.sendMessage({
                action: ke.processCall('app', 'phrasebook', 'addPhrase'),
                wl_id: wl_id,
                phrase: phrase,
                from: from,
                to: to
            }, function () {
            });

            ke.ui.notifications.show(ke.ext.tpl.compile(ke.getLocale("DotsButton_Added"), {
                wl: wl_name
            }));

            chrome.runtime.sendMessage({
                action: ke.processCall('app', 'commands', 'sendAnalyticsEvent'),
                cat: 'three-dot',
                event: ke.section,
                subevent: 'add-wordlist'
            });
        },

        copyOriginal: function (a, event) {
            ke.ext.clipboard.copyToClipboard(ke.particles.three_dots.model.getOriginalWord(event));

            ke.ui.notifications.show(ke.getLocale("DotsButton_OrigCopied"));

            chrome.runtime.sendMessage({
                action: ke.processCall('app', 'commands', 'sendAnalyticsEvent'),
                cat: 'three-dot',
                event: ke.section,
                subevent: 'copy-orig'
            });
        },

        copyTranslation: function (a, event) {
            ke.ext.clipboard.copyToClipboard(ke.particles.three_dots.model.getTranslatedWord(event));

            ke.ui.notifications.show(ke.getLocale("DotsButton_Copied"));

            chrome.runtime.sendMessage({
                action: ke.processCall('app', 'commands', 'sendAnalyticsEvent'),
                cat: 'three-dot',
                event: ke.section,
                subevent: 'copy-trans'
            });
        },

        copyMain: function (event) {
            var $this = $(this);

            if ($this.hasClass('copied')) {
                return;
            }

            $this.addClass('copied');
            setTimeout(function () {
                $this.removeClass('copied');
            }, 2500);

            if ($this.hasClass('copy-translation')) {
                ke.particles.three_dots.model.copyTranslation.call(this, null, event);
            } else if ($this.hasClass('copy-original')) {
                ke.particles.three_dots.model.copyOriginal.call(this, null, event);
            }
        },

        copySynonym: function () {
            var prefix = (ke.section === 'content' || ke.section === 'pdf_tooltip')
                ? ke.getPrefix()
                : '';

            var $this = $(this);
            var _class = prefix + 'copied';

            if ($this.hasClass(_class)) {
                return;
            }

            var $el = $(this).parent().find('.' + prefix + 'main-of-item');

            $this.addClass(_class);
            setTimeout(function () {
                $this.removeClass(_class);
            }, 2500);

            ke.ext.clipboard.copyToClipboard($el.html());
        }
    });

})();