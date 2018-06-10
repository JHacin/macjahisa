$(document).ready( function() {

  // set default value of date input to today
  Date.prototype.toDateInputValue = (function() {
    var local = new Date(this);
    local.setMinutes(this.getMinutes() - this.getTimezoneOffset());
    return local.toJSON().slice(0,10);
  });

  if ($('#datum').val() == "") {
    $('#datum').val(new Date().toDateInputValue());
  }

  // dataTables
  $('#tabela').DataTable({
    "order": [[ 0, 'desc' ]]
  });

  $('#summernote').summernote({
    minHeight: 500
  });

  $("#naslovnicaRangeInput").on("input", function() {
    $("#naslovnicaRangeValue").html($(this).val() + "%");
    var pos = "50% " + $(this).val() + "%";
    console.log(pos);
    $("#naslovnica").css("background-position", pos);
  })

  $("#naslovnicaRangeInput").on("change", function() {
    $("#naslovnicaRangeValue").html($(this).val() + "%");
    var pos = "50% " + $(this).val() + "%";
    $("#naslovnica").css("background-position", pos);
  })

  // muce metadata
  $("#generateCatMetaDataButton").click(function() {
    var ime = $("#ime").val();
    var opis = $("#summernote").val();
    if(ime == "" || opis == "") {
      alert("Manjka ime in/ali opis.");
    } else {
      generateMetaData(ime, opis);
    }
  });

  // članki metadata
  $("#generateArticleMetaDataButton").click(function() {
    var naslov = $("#naslov").val();
    var besedilo = $("#summernote").val();
    if(naslov == "" || besedilo == "") {
      alert("Manjka naslov in/ali besedilo.");
    } else {
      generateMetaData(naslov, besedilo);
    }
  });

  // podstrani metadata
  $("#generatePageMetaDataButton").click(function() {
    var naslov = $("#naslov").val();
    var vsebina = $("#summernote").val();
    if(naslov == "" || vsebina == "") {
      alert("Manjka naslov in/ali besedilo.");
    } else {
      generateMetaData(naslov, vsebina);
    }
  });

  // vnesi generiran metadata v form
  function generateMetaData(title, description) {
    var generatedTitle = title + " | Mačja hiša";
    var generatedDescription = description.replace(/<\/?[^>]+(>|$)/g, "").substring(0, 300);

      $("#SEOmetaTitle").val(generatedTitle);
      $("#SEOmetaTitleLength").html(generatedTitle.length);
      $("#SEOfbTitle").val(generatedTitle);
      $("#SEOfbTitleLength").html(generatedTitle.length);
      $("#SEOtwitterTitle").val(generatedTitle);
      $("#SEOtwitterTitleLength").html(generatedTitle.length);

      $("#SEOmetaDescription").val(generatedDescription);
      $("#SEOmetaDescriptionLength").html(generatedDescription.length);
      $("#SEOfbDescription").val(generatedDescription);
      $("#SEOfbDescriptionLength").html(generatedDescription.length);
      $("#SEOtwitterDescription").val(generatedDescription);
      $("#SEOtwitterDescriptionLength").html(generatedDescription.length);
  };

  $(".SEOinputField").on("input", function() {
    var charLengthCounter = $(this).siblings().children(".charLength");
    var newLength = $(this).val().length;
    charLengthCounter.html(newLength);
    // pobarvaj na rdeče če je dolžina > 300
    if(newLength > 300) {
      $(this).siblings(".SEOtextlength").css("color", "red");
    } else {
      $(this).siblings(".SEOtextlength").css("color", "#686868");
    }
  });

});
