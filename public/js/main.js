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


});
