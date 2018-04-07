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

});
