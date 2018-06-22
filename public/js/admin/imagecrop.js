$(document).ready( function() {

  var cropper;//the cropper object
  var input;// the image upload button (def. "choose file")
  var inputName;// name of the input field (to make POST request) e.g. #slika1_crop
  var newImage;// the new image that's also being cropped
  var oldImage;// the image saved until now in DB
  var entityId;// ID of the cat (to make POST request)
  var $modal = $('#imageCropModal');

  // destroy cropper object whenever modal is closed
  $modal.on('hidden.bs.modal', function () {
    if(cropper) {
      cropper.destroy();
    }
  });

  // clear file input whenever the cancel button in modal is clicked
  $('.imageCropCancel').on('click', function() {
    input.val("");
  });

  // on selecting new image in file input
    // get all file input fields by class
    var getInputs = document.getElementsByClassName('catImgUploadInput');
    for (i = 0; i < getInputs.length; i++) {
      input = getInputs[i];
      // the image to be displayed in the modal
      newImage = $(input).siblings("img");
        input.addEventListener('change', function (e) {
          var files = e.target.files;
          // grab current input field in case we need to clear it
          input = $(this);
          // grab current cat pic in case we need to reset it
          oldImage = $(this).siblings(".slika");
          // e.g. slika1
          inputName = $(this).siblings(".hiddenImgUploadInput").attr("id");

          var done = function (url) {
            // input.value = '';
            newImage.src = url;
            $modal.modal('show');
            // show new image in modal
            $('.imagepreview').attr('src', newImage.src);
            cropper = new Cropper(document.querySelector('.imagepreview'), {
              aspectRatio: 450 / 280,
              viewMode: 1
            });
          };

          // handle dataurl creation
          var reader;
          var file;
          var url;
          if (files && files.length > 0) {
            file = files[0];
            if (URL) {
              done(URL.createObjectURL(file));
            } else if (FileReader) {
              reader = new FileReader();
              reader.onload = function (e) {
                done(reader.result);
              };
              reader.readAsDataURL(file);
            };
          };
        });
      };


  // on button click open modal with current image
var thisButton;
var currentImage;
var getCurrentImageCropButtons = document.getElementsByClassName('currentImageCropButton');
  for (i = 0; i < getCurrentImageCropButtons.length; i++) {
    imageCropButton = getCurrentImageCropButtons[i];

      imageCropButton.addEventListener('click', function () {

        thisButton = $(this);
        currentImage = $(this).siblings("img").attr('src');
        inputName = $(this).siblings(".hiddenImgUploadInput").attr("id");
        oldImage = $(this).siblings(".slika");

          getDataUriOfCurrentImage(currentImage, function(dataUri) {
            $('.imagepreview').attr('src', dataUri);
            $modal.modal('show');
            // init cropper
            cropper = new Cropper(document.querySelector('.imagepreview'), {
              aspectRatio: 450 / 280,
              viewMode: 1
            });

          }); // end getDataUriOfCurrentImage
      });

  }

    // create DATA URI from current image function
    function getDataUriOfCurrentImage(url, callback) {
      var image = new Image();
      var result;
      image.onload = function () {
          var canvas = document.createElement('canvas');
          canvas.width = this.naturalWidth; // or 'width' if you want a special/scaled size
          canvas.height = this.naturalHeight; // or 'height' if you want a special/scaled size
          canvas.getContext('2d').drawImage(this, 0, 0);
          callback(canvas.toDataURL('image/jpeg'));
      };
      image.src = url;
    }

  // confirm crop
  var cropButton;
  var getConfirmButtons = document.getElementsByClassName('imageCropConfirm');
  for (i = 0; i < getConfirmButtons.length; i++) {
    cropButton = getConfirmButtons[i];
    cropButton.addEventListener('click', function () {
      // var initialAvatarURL;
      var canvas;
      if (cropper) {
        canvas = cropper.getCroppedCanvas();
        $modal.modal('hide');
        var dataURL = canvas.toDataURL("image/jpeg");
        $(oldImage).attr('src', dataURL);
        $("#" + inputName).val(dataURL);
      }
    });
  }

  $("#formSubmit").click(function() {
    var postURL;
    if($(".slika").attr("id")) {
      entityId = $(".slika").attr("id");
      postURL = "/admin/muce/" + entityId + "?_method=PUT";
    } else {
      postURL = "/admin/muce/";
    }
    var data = getFormData();

    if(dataisValid(data)) {
      $.ajax({
          type: "POST",
          url: postURL,
          data: JSON.stringify(data),
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
    }
  });

  function getFormData() {
    var formData = {
      ime: $("#ime").val(),
      datum: $("#datum").val(),
      status: $("#status").val(),
      mesec_rojstva: $("#mesec_rojstva").val(),
      spol: $("#spol").val(),
      opis: $('#editor').trumbowyg('html'),
      kontakt: $("#kontakt").val(),
      posvojitev_na_daljavo: $("#posvojitev_na_daljavo").val(),
      boter_povezava: $("#boter_povezava").val(),
      vet: {
        s_k: document.getElementById("vet[s_k]").checked,
        cipiranje: document.getElementById("vet[cipiranje]").checked,
        cepljenje: document.getElementById("vet[cepljenje]").checked,
        razparazit: document.getElementById("vet[razparazit]").checked,
        felv: document.getElementById("vet[felv]").checked,
        fiv: document.getElementById("vet[fiv]").checked
      },
      slika1_crop: $("#slika1_crop").val(),
      slika2_crop: $("#slika2_crop").val(),
      slika3_crop: $("#slika3_crop").val(),
      slika4_crop: $("#slika4_crop").val(),
      SEOmetaTitle: $("#SEOmetaTitle").val(),
      SEOmetaDescription: $("#SEOmetaDescription").val(),
      SEOfbTitle: $("#SEOfbTitle").val(),
      SEOfbDescription: $("#SEOfbDescription").val(),
      SEOtwitterTitle: $("#SEOtwitterTitle").val(),
      SEOtwitterDescription: $("#SEOtwitterDescription").val()
    };
    return formData;
  }

  function dataisValid(data) {
    var isValid = true;
    if(data.ime === "") { alert("Vnesi ime."); return false; }
    if(data.datum === "") { alert("Vnesi datum sprejema."); return false; }
    if(data.status === null) { alert("Vnesi status muce."); return false; }
    if(data.mesec_rojstva === "") { alert("Vnesi mesec rojstva."); return false; }
    if(data.spol === null) { alert("Vnesi spol."); return false; }
    if(data.opis === "") { alert("Vnesi opis."); return false; }
    if(data.posvojitev_na_daljavo === "") { alert("Označi, ali je muca na voljo za posvojitev na daljavo."); return false; }
    if(data.boter_povezava === "" && $("#boter_povezava").prop("required")) { alert("Vnesi povezavo do zgodbe na Mačjem botru."); return false; }
    // if(data.slika1_crop === "" && data.slika2_crop === "" && data.slika3_crop === "" && data.slika4_crop === "") {
    //   alert("Treba je dodati vsaj eno sliko.");
    //   return false;
    // }

    return isValid;
  }

});
