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

});
