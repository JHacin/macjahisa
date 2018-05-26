$(document).ready( function() {

  var cropper;//the cropper object
  var input;// the image upload button
  var inputName;// name of the input field (to make POST request)
  var newImage;// the image being cropped
  var oldImage;// the image saved in DB
  var entityId;// ID of the cat (to make POST request)
  var $modal = $('#imageCropModal');

  // destroy cropper object whenever modal is closed
  $modal.on('hidden.bs.modal', function () {
    if(cropper) {
      cropper.destroy();
    }
  });

  // on selecting new image
  var getInputs = document.getElementsByClassName('catImgUploadInput');

  for (i = 0; i < getInputs.length; i++) {
    input = getInputs[i];
    newImage = $(input).siblings("img");

        input.addEventListener('change', function (e) {
          var files = e.target.files;
          oldImage = $(this).siblings(".slika");
          entityId = $(this).siblings(".slika").attr("id");
          inputName = $(this).attr("name");
          var done = function (url) {
            input.value = '';
            newImage.src = url;
            $modal.modal('show');
            $('.imagepreview').attr('src', newImage.src);
            cropper = new Cropper(document.querySelector('.imagepreview'), {
              aspectRatio: 450 / 280,
              viewMode: 1
            });
          };

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

  // on button click open modal with corresponding image
  $('.imageCropButton').on('click', function() {
    $('.imagepreview').attr('src', $(this).siblings("img").attr('src'));
    $modal.modal('show');
    newImage = document.querySelector('.imagepreview');
    // init cropper
    cropper = new Cropper(newImage, {
      aspectRatio: 450 / 280,
      viewMode: 1
    });

  });

  // TO-DO: CLEAR FILE INPUT OR REPLACE IT WITH OLD PICTURE ON PRESSING CANCEL BUTTON

  // confirm crop
  var cropButton;
  var getConfirmButtons = document.getElementsByClassName('imageCropConfirm');
  for (i = 0; i < getConfirmButtons.length; i++) {
    cropButton = getConfirmButtons[i];
    cropButton.addEventListener('click', function () {
      var initialAvatarURL;
      var canvas;
      if (cropper) {
        canvas = cropper.getCroppedCanvas();
        $modal.modal('hide');
        initialAvatarURL = $(oldImage).attr("src");
        var dataURL = canvas.toDataURL();
        $(oldImage).attr('src', dataURL);
        var xyz = "#" + inputName + "_crop";
        $(xyz).val(dataURL);

          var postURL = "/admin/muce/" + entityId + "/crop?_method=PUT";
          $.ajax({
              type: "POST",
              url: postURL,
              data: {fileName: xyz, dataURL: dataURL}
          }).done(function(o) {
              console.log('all_saved');
          });
      }
    });
  }
});
