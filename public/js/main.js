$(document).ready( function() {

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
     // infinite: true,
     speed: 700,
     autoplay: true,
     autoplaySpeed: 4500,
     slidesToShow: 1,
     centerMode: true,
     variableWidth: true,
     adaptiveHeight: false,
     responsive: [
       {
         breakpoint: 600,
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
