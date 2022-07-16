(function (undefined) {
    ke.import('ext.util.storageUtil');

    pl.extend(ke.particles.sett_tabber.view, {
        displayCurrentTab: function (tab) {
            var $prev = $('.active-tab');
            var prev_id = +$prev.data('id');
            var $new = $('.tab-' + tab);

            $prev.removeClass('active-tab');
            $new.addClass('active-tab');

            if (prev_id && prev_id != tab) {
                $('.tc-' + prev_id).fadeOut(100, 'easeInOutQuart', function () {
                    $('.tc-' + tab).fadeIn(100);
                });
            } else if (!prev_id) {
                $('.tab-contents:visible').each(function () {
                    if (!$(this).hasClass('tc-' + tab)) {
                        $(this).hide();
                    }
                });
            }
        }
    });
})();