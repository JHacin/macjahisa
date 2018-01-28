$(document).ready( function() {

  // pagination
  $('#page_container').pajinate({
    items_per_page : 10,
    item_container_id : '.content',
    nav_panel_id : '.page_navigation',
    num_page_links_to_display: 5,
    nav_label_prev: "Nazaj",
    nav_label_next: "Naprej",
    nav_label_first: "Na začetek",
    nav_label_last: "Na konec",
    show_paginate_if_one: false
  });

});
