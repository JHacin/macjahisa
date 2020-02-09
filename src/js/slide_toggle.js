$(document).ready(() => {
    $('.slide-toggle').click(({ currentTarget }) => {
        const $slideTarget = $($(currentTarget).attr('data-slide-to'));
        if ($slideTarget) {
            $('html, body').animate({ scrollTop: $slideTarget.offset().top }, 750);
        }
    });
});
