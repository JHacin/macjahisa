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
      // desktop
      if(scroll_pos > 210) {
          $(".top_bar_index").css('background', '#343a40');
      } else {
          $(".top_bar_index").css('background', 'none');
      }
      // mobile
      if(scroll_pos > 150) {
        $(".mobile_logo").css({'visibility': 'visible', 'opacity': '1'});
        $(".mobile_top_contact").css({'visibility': 'visible', 'opacity': '1'});
        $(".stellarnav .fa-bars").css('color', '#343a40');
        $(".nav").css('background', 'rgba(230, 230, 230,1)');
      } else {
        $(".mobile_logo").css({'visibility': 'hidden', 'opacity': '0'});
        $(".mobile_top_contact").css({'visibility': 'hidden', 'opacity': '0'});
        $(".stellarnav .fa-bars").css('color', 'rgba(230, 230, 230,0.8)');
        $(".nav").css('background', 'none');
      }
  });



});
