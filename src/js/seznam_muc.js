$(document).ready(() => {
    const $seznamMuc = $('.seznam-muc');
    if ($seznamMuc.length) {
        $seznamMuc.jplist({
            itemsBox: '.seznam-muc-list',
            itemPath: '.seznam-muc-list-item',
            panelPath: '.jplist-panel',
            animateToTop: 'html, body',
            animateToTopDuration: 500,
            effect: 'fade',
            duration: 300,
        });
    }
});
