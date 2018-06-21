$(document).ready( function() {

  // Disable hover effects on mobile
  function watchForHover() {
    var hasHoverClass = false;
    var container = document.body;
    var lastTouchTime = 0;

    function enableHover() {
        // filter emulated events coming from touch events
        if (new Date() - lastTouchTime < 500) return;
        if (hasHoverClass) return;

        container.className += ' hasHover';
        hasHoverClass = true;
    }

    function disableHover() {
        if (!hasHoverClass) return;

        container.className = container.className.replace(' hasHover', '');
        hasHoverClass = false;
    }

    function updateLastTouchTime() {
        lastTouchTime = new Date();
    }

    document.addEventListener('touchstart', updateLastTouchTime, true);
    document.addEventListener('touchstart', disableHover, true);
    document.addEventListener('mousemove', enableHover, true);

    enableHover();
}

watchForHover();


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
         breakpoint: 768,
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
