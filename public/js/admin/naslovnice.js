$(document).ready( function() {

  $("#naslovnicaPreview").hide();
  $("#naslovnicaPreviewReloadButton").hide();

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

  // LOAD preview
  $("#naslovnicaPreviewLoadButton").click(function(){
    $(this).hide();
    // če zazna nov background
    if (document.querySelector("#ozadje").files[0]) {
      $("#naslovnica").css("background-image", "none");
      reloadBackground();
    };

    updatePreviewValues();
    // end
    $("#naslovnicaPreview").show();
    $("#naslovnicaPreviewReloadButton").show();
  });

  // RELOAD preview
  $("#naslovnicaPreviewReloadButton").click(function(){
    // če zazna nov background
    if (document.querySelector("#ozadje").files[0]) {
      $("#naslovnica").css("background-image", "none");
      reloadBackground();
    };

    updatePreviewValues();
    // end
    $("#naslovnicaPreview").show();
  });

  // reload div background
  function reloadBackground() {
    var file = document.querySelector("#ozadje").files[0];
    // FileReader
    var reader = new FileReader();
     reader.readAsDataURL(file);
     reader.onload = function () {
       // console.log(reader.result);
       var img = new Image();
       img.src = reader.result;
      $("#naslovnica").css("background-image", "url('" + img.src + "')");
       // $("#naslovnica").css("")
     };
     reader.onerror = function (error) {
       console.log('Error: ', error);
     };
  };

  // update title, subtitle, etc.
  function updatePreviewValues() {
    $(".i_jumbo_title").html($("#naslov").val());
    $(".i_jumbo_subtitle").html($("#podnaslov").val());
    $(".jumbo_povezava").attr("href", $("#povezava").val());
    $(".i_jumbo_button").html($("#napisNaGumbu").val());
  };

});
