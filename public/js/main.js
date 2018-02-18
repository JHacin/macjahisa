$(document).ready( function() {

  // dropdown menu
  $(".stellarnav").stellarNav({
    position: "left",
    breakpoint: 600
  });

  // MUCE LIST
  $('.muce_seznam').jplist({
    itemsBox: '.list',
    itemPath: '.list-item',
    panelPath: '.jplist-panel'
   });

   // NOVICE LIST
   $('.novice_seznam').jplist({
     itemsBox: '.list',
     itemPath: '.list-item',
     panelPath: '.jplist-panel'
    });

   // MUCA IMAGE SLIDER
   $('.photos').slick({
     dots: true,
     arrows: true,
     infinite: true,
     speed: 300,
     slidesToShow: 1,
     adaptiveHeight: true,
   });

   // indexpage - change top bar background on scroll
   var scroll_pos = 0;
  $(document).scroll(function() {
      scroll_pos = $(this).scrollTop();
      if(scroll_pos > 210) {
          $(".top_bar_index").css('background', '#343a40');
      } else {
          $(".top_bar_index").css('background', 'none');
      }
  });


});
