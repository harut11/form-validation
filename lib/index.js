"use strict";

$(document).ready(function () {
  var input = document.querySelector('#phone');
  window.intlTelInput(input);
  $('input[name="datetimes"]').daterangepicker({
    timePicker: true,
    startDate: moment().startOf('hour'),
    endDate: moment().startOf('hour').add(32, 'hour'),
    locale: {
      format: 'M/DD hh:mm A'
    },
    opens: 'center'
  });
  $('#data-table').DataTable({
    buttons: ['copy']
  });
  $('input[data-valid]').on('keyup', function (event) {
    formValidate($(event.target), $(event.target).val());
  });

  var formValidate = function formValidate(element, value) {
    var errorTexts = ['This field is required', 'This field value must be higher then', 'This field value must be lower then', 'This field value must be string', 'This field value must be number'];
    var feedback = $('input + div');
    var rules = element.attr('data-valid');
    var rule = rules.split('|');
    console.log(rule);

    if ($.inArray('required ', rule) && value.length === 0) {
      feedback.removeClass('valid');
      feedback.addClass('is-invalid');
      feedback.text(errorTexts[0]);
    }
  };

  $(".submit").click(function (event) {});
});