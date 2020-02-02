$(document).ready(() => {
    $('.nav_category_toggle').click(({ currentTarget }) => {
        const closeOtherCategories = () => {
            $(currentTarget)
                .parent('.nav_menu_primary_category')
                .siblings('.nav_menu_primary_category')
                .removeClass('active')
                .children('ul')
                .slideUp(250);
        };

        const toggleClickedCategory = () => {
            $(currentTarget)
                .parent('.nav_menu_primary_category')
                .toggleClass('active')
                .children('ul')
                .slideToggle(250);
        };

        if ($('.navbar').hasClass('open_mobile')) {
            closeOtherCategories();
            toggleClickedCategory();
        }
    });
});
