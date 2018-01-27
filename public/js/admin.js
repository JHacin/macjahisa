$(document).ready( function() {

// set default value of date input to today
  Date.prototype.toDateInputValue = (function() {
    var local = new Date(this);
    local.setMinutes(this.getMinutes() - this.getTimezoneOffset());
    return local.toJSON().slice(0,10);
  });

  $('#nova_datum').val(new Date().toDateInputValue());

// dataTables
  $('#tabela').DataTable({
    "order": [[ 0, 'desc' ]]
  });

  $('#summernote').summernote({
    minHeight: 500
  });


});
