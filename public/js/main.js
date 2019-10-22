$(document).ready(function() {
  // SAFARI TEMPORARY FIX: prevents donate button from showing above mobile navbar
  $(window).on("resize", function() {
    var win = $(this); //this = window
    var donateButton = $(".nav_donate > form > button");
    var isNavActive = $(".stellarnav").hasClass("active");
    if (!isNavActive) {
      donateButton.removeClass("notVisible");
    } else if (win.width() > 768) {
      donateButton.removeClass("notVisible");
    } else if (isNavActive) {
      donateButton.addClass("notVisible");
    }
  });

  // SHOW OR HIDE NAVBAR DURING SCROLL
  var didScroll;
  var lastScrollTop = 0;
  var delta = 5;
  var navbarHeight = $(".navbar").outerHeight();

  $(window).scroll(function() {
    didScroll = true;
  });

  setInterval(function() {
    if (didScroll) {
      hasScrolled();
      didScroll = false;
    }
  }, 250);

  function hasScrolled() {
    var scrollTop = $(this).scrollTop();

    if (Math.abs(lastScrollTop - scrollTop) <= delta) {
      return;
    }

    if (scrollTop > lastScrollTop && scrollTop > navbarHeight) {
      $(".navbar").addClass("move-up");
    } else {
      if (scrollTop + $(window).height() < $(document).height()) {
        $(".navbar").removeClass("move-up");
      }
    }

    lastScrollTop = scrollTop;
  }

  // MUCE LIST
  if ($(".muce_seznam").length >= 1) {
    $(".muce_seznam").jplist({
      itemsBox: ".list",
      itemPath: ".list-item",
      panelPath: ".jplist-panel"
    });
  }

  // MUCA IMAGE SLIDER
  if ($(".photos").length >= 1) {
    $(".photos").slick({
      dots: false,
      arrows: true,
      infinite: true,
      speed: 700,
      autoplay: true,
      autoplaySpeed: 3500,
      slidesToShow: 1,
      centerMode: false,
      variableWidth: true,
      responsive: [
        {
          breakpoint: 768,
          settings: {
            variableWidth: false,
            centerMode: false,
            slidesToShow: 1,
            autoplay: true
          }
        }
      ]
    });
  }
});
