$(document).ready(function() {
    // Intel-tel Section Start
    let input = document.querySelector('#phone'),
        errorMsg = document.querySelector("#error-msg"),
        validMsg = document.querySelector("#valid-msg");

    // here, the index maps to the error code returned from getValidationError - see readme
    let errorMap = [ "Invalid number", "Invalid country code", "Too short", "Too long", "Invalid number"];

    let iti = window.intlTelInput(input, {
        utilsScript: "js/utils.js"
    }).setCountry('am');

    let reset = function() {
        input.classList.remove("error");
        errorMsg.innerHTML = "";
        errorMsg.classList.add("hide");
        validMsg.classList.add("hide");
    };

    // on blur: validate
    input.addEventListener('blur', function() {
        reset();
        if (input.value.trim()) {
            if (iti.isValidNumber()) {
                validMsg.classList.remove("hide");
            } else {
                input.classList.add("error");
                let errorCode = iti.getValidationError();
                errorMsg.innerHTML = errorMap[errorCode];
                errorMsg.classList.remove("hide");
            }
        }
    });

    // on keyup / change flag: reset
    input.addEventListener('change', reset);
    input.addEventListener('keyup', reset);
    // let isValid = iti.isValidNumber();
    // console.log(isValid);

    // Intel-tel Section End
    localStorage.clear();

    $('input[name="datetimes"]').daterangepicker({
        timePicker: false,
        startDate: moment().startOf('hour'),
        endDate: moment().startOf('hour').add(32, 'hour'),
        locale: {
            format: 'M/DD/Y',
            cancelLabel: 'Clear'
        },
        opens: 'center',
        autoUpdateInput: false,
    });

    $('input[name="datetimes"]').on('apply.daterangepicker', function(ev, picker) {
        $(this).val(picker.startDate.format('MM/DD/YYYY') + ' - ' + picker.endDate.format('MM/DD/YYYY'));
    });

    $('input[name="datetimes"]').on('cancel.daterangepicker', function(ev, picker) {
        $(this).val('');
    });

    $('input[id="dof"]').daterangepicker({
        singleDatePicker: true,
        showDropdowns: true,
        minYear: 1950,
        maxYear: 2000,
    });

    $('#data-table').DataTable({
        order: [[2, 'asc']],
        rowGroup: {
            dataSrc: 2
        },
        scrollY:        300,
        deferRender:    false,
        scroller:       true
    });

    let options = {
        errors: false,
    };

    if($('input[type="checkbox"]:checked')) {
        $('#work').attr('data-valid', 'required|min|max|date');
    }

    $('textarea[data-valid] , .type-text').on('keyup', (event) => {
        event.preventDefault();
       formValidate($(event.target), $(event.target).val());
    });

    $('.type-change').on('change', (event) => {
        event.preventDefault();
        formValidate($(event.target), $(event.target).val());
    });

    let formValidate = (element, value) => {
        let errorTexts = [
            'This field is required',
            'This field value must be higher then',
            'This field value must be lower then',
            'This field value must be string',
            'This field value must be number',
            'Email address are not valid',
            'Number not valid',
            'This field are not date format'
        ];

        let rules = element.attr('data-valid').split('|');
        let feedbackDiv = element.closest('.form-group').find('.feedback');

        if(rules[0] === 'required') {
            required(feedbackDiv, errorTexts, value);
        }

        if(rules[1]) {
            min(feedbackDiv, errorTexts, value, rules[1]);
        }

        if(rules[2]) {
            max(feedbackDiv, errorTexts, value, rules[2]);
        }

        if(rules[3] === 'string') {
            string(feedbackDiv, errorTexts, value);
        }

        if(rules[3] === 'integer') {
            integer(feedbackDiv, errorTexts, value);
        }

        if(rules[3] === 'email') {
            email(feedbackDiv, errorTexts, value);
        }

        if(rules[3] === 'phone') {
            phone(feedbackDiv, errorTexts, value);
        }

        if(rules[3] === 'date') {
            date(feedbackDiv, errorTexts, value);
        }

    };

    let required = (div, text, val) => {
        if(!val) {
            div.addClass('is-invalid').text(text[0]);
            options.errors = true;
        } else {
            div.empty();
        }
    };

    let min = (div, text, val, rule) => {
        let minimum = parseInt(rule.split(':')[1]);
        if(val && val.length < minimum) {
            div.empty();
            div.addClass('is-invalid').text(text[1] + ' ' + (minimum - 1));
            options.errors = true;
        }
    };

    let max = (div, text, val, rule) => {
        let maximum = parseInt(rule.split(':')[1]);

        if(val && val.length > maximum) {
            div.empty();
            div.addClass('is-invalid').text(text[2] + ' ' + maximum);
            options.errors = true;
        }
    };

    let string = (div, text, val) => {
        let regex = /^[a-zA-Z]+$/;

        if(val && !val.match(regex)) {
            div.empty();
            div.addClass('is-invalid').text(text[3]);
            options.errors = true;
        }
    };

    let integer = (div, text, val) => {
        let regex = /^[0-9]+$/;

        if(val && !val.match(regex)) {
            div.empty();
            div.addClass('is-invalid').text(text[4]);
            options.errors = true;
        }
    };

    let email = (div, text, val) => {
        let regex = /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/;

        if(val && !val.match(regex)) {
            div.empty();
            div.addClass('is-invalid').text(text[5]);
            options.errors = true;
        }
    };

    let phone = (div, text, val) => {
       let regex = /^\+[0-9]?()[0-9](\s|\S)(\d[0-9]{9})$/;

       if(val && !val.match(regex)) {
           div.empty();
           div.addClass('is-invalid').text(text[6]);
           options.errors = true;
       }
    };

    let date = (div, text, val) => {
        let regex = /^(0?[1-9]|1[0-2])[\/](0?[1-9]|[12]\d|3[01])[\/](19|20)\d{2}\s[-]\s(0?[1-9]|1[0-2])[\/](0?[1-9]|[12]\d|3[01])[\/](19|20)\d{2}$/;

        if(val && !val.match(regex)) {
            div.empty();
            div.addClass('is-invalid').text(text[7]);
            options.errors = true;
        }
    };

    let drawdata = () => {
        let tbody = $('#tbody'),
            html = "",
            firstName = $('#firstName').val(),
            lastName = $('#lastName').val(),
            setEmail = $('#email').val(),
            dof = $('#dof').val(),
            about = $('#aboutYou').val(),
            phone = $('#phone').val(),
            address = $('#address').val(),
            gender = $('input[type="radio"]:checked').val(),
            work = $('#work').val(),
            person = JSON.parse(localStorage.getItem('person'));
        if(!person) {
            person = [];
        }
        person.push( {
            firstName: firstName,
            lastName: lastName,
            email: setEmail,
            dof: dof,
            about: about,
            phone: phone,
            address: address,
            gender: gender,
            work: work
        });
        localStorage.setItem('person', JSON.stringify(person));

        $.each(person, (key, value) => {
                html += "<tr>";

                html += "<td>" + value.firstName + "</td>";
                html += "<td>" + value.lastName + "</td>";
                html += "<td>" + value.email + "</td>";
                html += "<td>" + value.dof + "</td>";
                html += "<td>" + value.phone + "</td>";
                html += "<td>" + value.address + "</td>";
                html += "<td>" + value.gender + "</td>";
                html += "<td>" + value.work + "</td>";

                html += "</tr>"
        });
        tbody.empty().append(html);
    };


    $('.submit').click((event) => {
        event.preventDefault();

        if(options.errors === false) {
            drawdata();
        } else {return false}
    });

});