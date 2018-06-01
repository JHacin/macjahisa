$(document).ready( function() {

  // begin click listener
  $(".setNaslovnicaButton").click(function() {
    var razdeljenId = $(this).attr("id").split("_");
    var ajaxData = {
      id: razdeljenId[0],
      pozicija: razdeljenId[1]
    }
    var postURL = "/admin/naslovnice/" + ajaxData.pozicija + "/" + ajaxData.id;

    $.ajax({
        type: "POST",
        url: postURL,
        data: JSON.stringify(ajaxData),
        dataType: "json",
        contentType: "application/json",
        processData: false,
        success: function (data, textStatus, jqXHR) {
          if (typeof data.redirect == 'string') {
            window.location.replace(data.redirect);
          }
        },
        error: function(e) {
          console.log(e);
        }
    });
  });
  // end click listener

});
