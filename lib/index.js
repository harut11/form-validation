"use strict";

$(document).ready(function () {
  var input = document.querySelector('#phone');
  window.intlTelInput(input);
  var validation = {
    persons: []
  };
  console.log(validation.persons);
  $('input[name="datetimes"]').daterangepicker({
    timePicker: true,
    startDate: moment().startOf('hour'),
    endDate: moment().startOf('hour').add(32, 'hour'),
    locale: {
      format: 'M/DD hh:mm A'
    },
    opens: 'center'
  });
  $('input[id="dof"]').daterangepicker({
    singleDatePicker: true,
    showDropdowns: true,
    minYear: 1901
  });
  $('#data-table').DataTable({
    order: [[2, 'asc']],
    rowGroup: {
      dataSrc: 2
    },
    scrollY: 300,
    deferRender: false,
    scroller: true
  });
  $('input[data-valid], textarea[data-valid]').on('keyup', function (event) {
    formValidate($(event.target), $(event.target).val());
  });

  var formValidate = function formValidate(element, value) {
    var errorTexts = ['This field is required', 'This field value must be higher then', 'This field value must be lower then', 'This field value must be string', 'This field value must be number', 'Email address are not valid'];
    var rules = element.attr('data-valid').split('|');
    var feedbackDiv = element.closest('.form-group').find('.feedback');

    if (rules[0] === 'required') {
      required(feedbackDiv, errorTexts, value);
    }

    if (rules[1]) {
      min(feedbackDiv, errorTexts, value, rules[1]);
    }

    if (rules[2]) {
      max(feedbackDiv, errorTexts, value, rules[2]);
    }

    if (rules[3] === 'string') {
      string(feedbackDiv, errorTexts, value);
    }

    if (rules[3] === 'integer') {
      integer(feedbackDiv, errorTexts, value);
    }

    if (rules[3] === 'email') {
      email(feedbackDiv, errorTexts, value);
    }
  };

  var required = function required(div, text, val) {
    if (!val) {
      div.removeClass('is-valid');
      div.addClass('is-invalid').text(text[0]);
      return false;
    } else {
      div.empty();
    }
  };

  var min = function min(div, text, val, rule) {
    var minimum = parseInt(rule.split(':')[1]);

    if (val && val.length < minimum) {
      div.empty();
      div.removeClass('is-valid');
      div.addClass('is-invalid').text(text[1] + ' ' + (minimum - 1));
      return false;
    }
  };

  var max = function max(div, text, val, rule) {
    var maximum = parseInt(rule.split(':')[1]);

    if (val && val.length > maximum) {
      div.empty();
      div.removeClass('is-valid');
      div.addClass('is-invalid').text(text[2] + ' ' + maximum);
      return false;
    }
  };

  var string = function string(div, text, val) {
    var regex = /^[a-zA-Z]+$/;

    if (val && !val.match(regex)) {
      div.empty();
      div.removeClass('is-valid');
      div.addClass('is-invalid').text(text[3]);
      return false;
    }
  };

  var integer = function integer(div, text, val) {
    var regex = /^[0-9]+$/;

    if (val && !val.match(regex)) {
      div.empty();
      div.removeClass('is-valid');
      div.addClass('is-invalid').text(text[4]);
      return false;
    }
  };

  var email = function email(div, text, val) {
    var regex = /^(?:(?:[\w`~!#$%^&*\-=+;:{}'|,?\/]+(?:(?:\.(?:"(?:\\?[\w`~!#$%^&*\-=+;:{}'|,?\/\.()<>\[\] @]|\\"|\\\\)*"|[\w`~!#$%^&*\-=+;:{}'|,?\/]+))*\.[\w`~!#$%^&*\-=+;:{}'|,?\/]+)?)|(?:"(?:\\?[\w`~!#$%^&*\-=+;:{}'|,?\/\.()<>\[\] @]|\\"|\\\\)+"))@(?:[a-zA-Z\d\-]+(?:\.[a-zA-Z\d\-]+)*|\[\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\])$/;

    if (val && !val.match(regex)) {
      div.empty();
      div.removeClass('is-valid');
      div.addClass('is-invalid').text(text[5]);
      return false;
    } else if (val.match(regex)) {
      div.empty().removeClass('is-invalid').addClass('is-valid').text('Looks Good');
    }
  };

  var drawdata = function drawdata() {
    var tbody = $('#tbody');
    var html = "";
    var inputVal = $('#firstName').val();
    localStorage.inputVal = inputVal;

    for (var i = 0; i < validation.persons.length; i++) {
      html += "<tr>";

      for (var s = 0; s <= 8; s++) {
        html += "<td>" + localStorage.inputVal + "</td>";
      }

      html += "</tr>";
    }

    tbody.empty().append(html);
  };

  $('.submit').click(function (event) {
    event.preventDefault();
    validation.persons.push('1');
    drawdata();
  });
});