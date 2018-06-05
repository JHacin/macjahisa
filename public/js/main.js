$(document).ready( function() {


  // SAFARI TEMPORARY FIX: prevents donate button from showing above mobile navbar
  $(window).on('resize', function(){
      var win = $(this); //this = window
      var donateButton = $(".nav_donate > form > button");
      var isNavActive = $(".stellarnav").hasClass("active");
      if(!isNavActive) {
        donateButton.removeClass("notVisible");
      } else if (win.width() > 768) {
        donateButton.removeClass("notVisible");
      } else if (isNavActive) {
        donateButton.addClass("notVisible");
      }
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
     dots: false,
     arrows: true,
     infinite: true,
     speed: 700,
     autoplay: true,
     autoplaySpeed: 4500,
     slidesToShow: 1,
     centerMode: false,
     variableWidth: true,
     adaptiveHeight: false,
     responsive: [
       {
         breakpoint: 640,
         settings: {
          adaptiveHeight: true,
          variableWidth: false,
          centerMode: false,
          slidesToShow: 1,
          autoplay: false
        }
       }
     ]
   });

});
