"use strict";

$(document).ready(function () {
  // Intel-tel Section Start
  var input = document.querySelector('#phone'),
      errorMsg = document.querySelector("#error-msg"); // here, the index maps to the error code returned from getValidationError - see readme

  var errorMap = ["Invalid number", "Invalid country code", "Too short", "Too long", "Invalid number"];
  var iti = window.intlTelInput(input, {
    utilsScript: "int/built/js/utils.js?1537727621611"
  });
  iti.setCountry("am");

  var reset = function reset() {
    input.classList.remove("error");
    errorMsg.innerHTML = "";
    errorMsg.classList.add("hide");
  }; // on blur: validate


  input.addEventListener('blur', function () {
    reset();

    if (input.value.trim()) {
      if (iti.isValidNumber()) {} else {
        input.classList.add("error");
        var errorCode = iti.getValidationError();
        errorMsg.innerHTML = errorMap[errorCode];
        errorMsg.classList.remove("hide");
      }
    }
  }); // on keyup / change flag: reset

  input.addEventListener('change', reset);
  input.addEventListener('keyup', reset); // Intel-tel Section End

  var table = $('#data-table').DataTable({
    scrollY: 300,
    deferRender: false,
    scroller: true
  });

  var showPersons = function showPersons() {
    var persons = JSON.parse(localStorage.getItem('person'));

    if (persons) {
      $.each(persons, function (key, value) {
        table.row.add(['<input type="checkbox" class="ml-2 rowCheck">', value.firstName, value.lastName, value.email, value.dof, value.phone, value.address, value.gender, value.work]).draw(false);
      });
    }
  };

  var showPerson = function showPerson() {
    var persons = JSON.parse(localStorage.getItem('person')),
        person = persons[persons.length - 1];
    table.row.add(['<input type="checkbox" class="ml-2 rowCheck">', person.firstName, person.lastName, person.email, person.dof, person.phone, person.address, person.gender, person.work]).draw(false);
  };

  var dateTimes = $('input[name="datetimes"]');
  dateTimes.daterangepicker({
    timePicker: false,
    startDate: moment().startOf('hour'),
    endDate: moment().startOf('hour').add(32, 'hour'),
    locale: {
      format: 'M/DD/Y',
      cancelLabel: 'Clear'
    },
    opens: 'center',
    autoUpdateInput: false
  });
  dateTimes.on('apply.daterangepicker', function (ev, picker) {
    $(this).val(picker.startDate.format('MM/DD/YYYY') + ' - ' + picker.endDate.format('MM/DD/YYYY'));
    formValidate($(this), $(this).val());
  });
  dateTimes.on('cancel.daterangepicker', function () {
    $(this).val('');
    formValidate($(this), $(this).val());
  });
  var dof = $('input[id="dof"]');
  dof.on('apply.daterangepicker', function (ev, picker) {
    $(this).val(picker.endDate.format('MM/DD/YYYY'));
    formValidate($(this), $(this).val().trim());
  });
  dof.daterangepicker({
    singleDatePicker: true,
    showDropdowns: true,
    minYear: 1950,
    maxYear: 2000,
    autoUpdateInput: false,
    locale: {
      format: 'MM/DD/YYYY'
    }
  });
  $('textarea[data-valid] , .type-text').on('keyup', function (event) {
    event.preventDefault();
    formValidate($(event.target), $(event.target).val().toLowerCase());
  });
  $('.type-change').change(function (event) {
    event.preventDefault();
    formValidate($(event.target), $(event.target).val().trim());
  });

  var afterValidate = function afterValidate() {
    var inputs = $('input[data-valid]'),
        textarea = $('textarea[data-valid]');
    var _errors = 0;

    for (var i = 0; i < inputs.length; i++) {
      if (!formValidate($(inputs[i]), $(inputs[i]).val())) _errors++;
    }

    if (!formValidate(textarea, textarea.val())) _errors++;

    if (_errors) {
      return false;
    }
  };

  var formValidate = function formValidate(element, value) {
    var errorTexts = ['This field is required', 'This field value must be higher then', 'This field value must be lower then', 'This field value must be string', 'This field value must be number', 'Email address is not valid', 'Number not valid', 'This field is not date format'];
    var hasError = false;
    var rules = element.attr('data-valid').split('|'),
        feedbackDiv = element.closest('.form-group').find('.feedback');
    var errorsIterator = 0;

    for (var i = 0; i < rules.length; i++) {
      var key = rules[i];

      if (key === 'required') {
        hasError = required(feedbackDiv, errorTexts, value);
        if (!hasError) errorsIterator++;
      }

      if (key.includes('min')) {
        hasError = min(feedbackDiv, errorTexts, value, key);
        if (!hasError) errorsIterator++;
      }

      if (key.includes('max')) {
        hasError = max(feedbackDiv, errorTexts, value, key);
        if (!hasError) errorsIterator++;
      }

      if (key === 'name') {
        hasError = name(feedbackDiv, errorTexts, value);
        if (!hasError) errorsIterator++;
      }

      if (key === 'integer') {
        hasError = integer(feedbackDiv, errorTexts, value);
        if (!hasError) errorsIterator++;
      }

      if (key === 'email') {
        hasError = email(feedbackDiv, errorTexts, value);
        if (!hasError) errorsIterator++;
      }

      if (key === 'date') {
        hasError = date(feedbackDiv, errorTexts, value);
        if (!hasError) errorsIterator++;
      }

      if (key === 'two') {
        hasError = dateTwo(feedbackDiv, errorTexts, value);
        if (!hasError) errorsIterator++;
      }
    }

    return errorsIterator;
  };

  var required = function required(div, text, val) {
    if (!val.trim()) {
      div.empty();
      div.addClass('is-invalid').text(text[0]);
      return false;
    } else {
      div.empty();
      return true;
    }
  };

  var min = function min(div, text, val, rule) {
    var minimum = parseInt(rule.split(':')[1]);

    if (minimum && val && val.length < minimum || !val) {
      div.empty();
      div.addClass('is-invalid').text(text[1] + ' ' + (minimum - 1));
      return false;
    } else {
      div.empty();
      return true;
    }
  };

  var max = function max(div, text, val, rule) {
    var maximum = parseInt(rule.split(':')[1]);

    if (maximum && val && val.length > maximum) {
      div.empty();
      div.addClass('is-invalid').text(text[2] + ' ' + maximum);
      return false;
    } else {
      return true;
    }
  };

  var name = function name(div, text, val) {
    var regex = /^(([A-za-z]+[\s]{1}[A-za-z]+)|([A-Za-z]+))$/;

    if (val && !val.match(regex)) {
      div.empty();
      div.addClass('is-invalid').text(text[3]);
      return false;
    } else {
      return true;
    }
  };

  var integer = function integer(div, text, val) {
    var regex = /^[0-9]+$/;

    if (val && !val.match(regex)) {
      div.empty();
      div.addClass('is-invalid').text(text[4]);
      return false;
    } else {
      return true;
    }
  };

  var email = function email(div, text, val) {
    var regex = /^([A-Z|a-z|0-9](\.|_){0,1})+[A-Z|a-z|0-9]\@([A-Z|a-z|0-9])+((\.){0,1}[A-Z|a-z|0-9]){2}\.[a-z]{2,3}$/;

    if (val && !val.match(regex)) {
      div.empty();
      div.addClass('is-invalid').text(text[5]);
      return false;
    } else {
      return true;
    }
  };

  var date = function date(div, text, val) {
    var regex = /^(0?[1-9]|1[0-2])[\/](0?[1-9]|[12]\d|3[01])[\/](19|20)\d{2}\s[-]\s(0?[1-9]|1[0-2])[\/](0?[1-9]|[12]\d|3[01])[\/](19|20)\d{2}$/;

    if (val && !val.match(regex)) {
      div.empty();
      div.addClass('is-invalid').text(text[7]);
      return false;
    } else {
      return true;
    }
  };

  var dateTwo = function dateTwo(div, text, val) {
    var regex = /^(0?[1-9]|1[0-2])[\/](0?[1-9]|[12]\d|3[01])[\/](19|20)\d{2}$/;

    if (val && !val.match(regex)) {
      div.empty();
      div.addClass('is-invalid').text(text[7]);
      return false;
    } else {
      return true;
    }
  };

  var setPersons = function setPersons() {
    var firstName = $('#firstName').val().trim(),
        lastName = $('#lastName').val().trim(),
        setEmail = $('#email').val().trim(),
        dof = $('#dof').val().trim(),
        phone = $('#phone').val().trim(),
        address = $('#address').val().trim(),
        gender = $('input[type="radio"]:checked').val(),
        work = $('#work').val().trim(),
        bio = $('#aboutYou').val().trim(),
        person = JSON.parse(localStorage.getItem('person'));

    if (!person) {
      person = [];
    }

    person.push({
      firstName: firstName,
      lastName: lastName,
      email: setEmail,
      dof: dof,
      phone: phone,
      address: address,
      gender: gender,
      work: work,
      bio: bio
    });
    localStorage.setItem('person', JSON.stringify(person));
  };

  showPersons();
  $('#customCheck1').change(function () {
    setTimeout(function () {
      if ($('#collapse').hasClass('show')) {
        $('#work').attr('data-valid', 'required|date');
      } else {
        $('#work').removeAttr('data-valid');
      }
    }, 500);
  });
  $('.rowCheck').change(function (event) {
    var row = $(event.target).closest('tr[role="row"]');

    if (row.attr('mustRemove')) {
      row.removeAttr('mustRemove');
    } else {
      row.attr('mustRemove', 'true');
    }
  });
  $('.submit').click(function (event) {
    event.preventDefault();
    var a = afterValidate();
    console.log(a);

    if (a) {
      setPersons();
      showPerson();
    } else {
      alert('Please fix errors before submit!');
      return false;
    }
  });
  $('#reset').click(function () {
    var persons = JSON.parse(localStorage.getItem('person')),
        td = $('tr[mustRemove="true"]').find('td'),
        space = Array.from(persons);

    for (var i = 0; i < space.length; i++) {
      var localEmail = space[i].email;

      for (var s = 0; s < td.length; s++) {
        var str = $(td[s]).text().trim();

        if (localEmail === str) {
          space.splice(i, 1);
          localStorage.setItem('person', JSON.stringify(space));
        }
      }
    }

    $('[mustRemove="true"]').remove();
  });
});