$(document).ready( function() {

  // check if window is top - if not, display nav_button
  $(window).scroll(function(){
    if($(this).scrollTop() > 100) {
      $(".scrollToTop").fadeIn();
      $(".i_scrollToTop").fadeIn();
    } else {
      $(".scrollToTop").fadeOut();
      $(".i_scrollToTop").fadeOut();
    }
  });

  // scroll to top on btn click
  $(".scrollToTop").click(function(){
    $("html, body").animate({scrollTop: 0}, 600);
    return false;
  });

  // scroll to top on btn click
  $(".i_scrollToTop").click(function(){
    $("html, body").animate({scrollTop: 0}, 600);
    return false;
  });

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
   // $('.photos').slick({
   //   dots: true,
   //   arrows: true,
   //   infinite: true,
   //   speed: 300,
   //   slidesToShow: 2,
   //   slidesToScroll: 1,
   //   adaptiveHeight: true,
   //   variableWidth: true
   // });
  //
  //  $('.i_jumbo').slick({
  //   dots: true,
  //   infinite: true,
  //
  // });

   $('.photos').slick({
     dots: true,
     arrows: false,
     infinite: true,
     speed: 400,
     autoplay: true,
     autoplaySpeed: 2500,
     slidesToShow: 1,
     centerMode: true,
     variableWidth: true,
     responsive: [
       {
         breakpoint: 600,
         settings: {
           dots: true,
           arrows: true,
           infinite: true,
           speed: 400,
           adaptiveHeight: true,
           variableWidth: false,
           centerMode: false,
           slidesToShow: 1
         }
       }
     ]
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
        $(".mobile_logo_index").css({'visibility': 'visible', 'opacity': '1'});
        $(".mobile_top_contact_index").css({'visibility': 'visible', 'opacity': '1'});
        $(".stellar_index .fa-bars").css('color', '#343a40');
        $(".nav_index").css('background', 'rgba(230, 230, 230,1)');
      } else {
        $(".mobile_logo_index").css({'visibility': 'hidden', 'opacity': '0'});
        $(".mobile_top_contact_index").css({'visibility': 'hidden', 'opacity': '0'});
        $(".stellar_index .fa-bars").css('color', 'rgba(230, 230, 230,0.8)');
        $(".nav_index").css('background', 'none');
      }
  });


});
