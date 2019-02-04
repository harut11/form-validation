$(document).ready(function() {
    // Intel-tel Section Start
    let input = document.querySelector('#phone'),
        errorMsg = document.querySelector("#error-msg");

    // here, the index maps to the error code returned from getValidationError - see readme
    let errorMap = [ "Invalid number", "Invalid country code", "Too short", "Too long", "Invalid number"];

    let iti = window.intlTelInput(input, {
        utilsScript: "int/built/js/utils.js?1537727621611"
    });

    iti.setCountry("am");

    let reset = function() {
        input.classList.remove("error");
        errorMsg.innerHTML = "";
        errorMsg.classList.add("hide");
    };

    // on blur: validate
    input.addEventListener('blur', function() {
        reset();
        if (input.value.trim()) {
            if (iti.isValidNumber()) {

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

    // Intel-tel Section End
    let showPersons = () => {
        let persons = JSON.parse(localStorage.getItem('person'));

        if(persons) {
            let tbody = $('#tbody'),
                html = "";

            $.each(persons, (key, value) => {
                html += "<tr>";

                html += "<td>" + value.firstName + "</td>";
                html += "<td>" + value.lastName + "</td>";
                html += "<td>" + value.email + "</td>";
                html += "<td>" + value.dof + "</td>";
                html += "<td>" + value.phone + "</td>";
                html += "<td>" + value.address + "</td>";
                html += "<td>" + value.gender + "</td>";
                html += "<td>" + value.work + "</td>";
                html += "<td>" + value.bio + "</td>";

                html += "</tr>"
            });
            tbody.empty().append(html)
        }
    };

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
        formValidate($(this), $(this).val());
    });

    $('input[name="datetimes"]').on('cancel.daterangepicker', function(ev, picker) {
        $(this).val('');
        formValidate($(this), $(this).val());
    });

    $('input[id="dof"]').daterangepicker({
        singleDatePicker: true,
        showDropdowns: true,
        minYear: 1950,
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

    $('textarea[data-valid] , .type-text').on('keyup', (event) => {
        event.preventDefault();
       formValidate($(event.target), $(event.target).val());
    });

    $('.type-change').on('change', (event) => {
        formValidate($(event.target), $(event.target).val());
    });

    let afterValidate = () => {
        let inputs = $('input[data-valid]'),
            textarea = $('textarea[data-valid]');

        for(let i = 0; i < inputs.length; i++) {
            formValidate($(inputs[i]), $(inputs[i]).val());
        }
        formValidate(textarea, textarea.val());
    };

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

        let rules = element.attr('data-valid').split('|'),
            feedbackDiv = element.closest('.form-group').find('.feedback');

        $.map(rules, (key) => {

            if(key.includes('required')) {
                required(feedbackDiv, errorTexts, value);
            }

            if(key.includes('min')) {
                min(feedbackDiv, errorTexts, value, key);
            }

            if(key.includes('max')) {
                max(feedbackDiv, errorTexts, value, key);
            }

            if(key.includes('string')) {
                string(feedbackDiv, errorTexts, value);
            }

            if(key.includes('integer')) {
                integer(feedbackDiv, errorTexts, value);
            }

            if(key.includes('email')) {
                email(feedbackDiv, errorTexts, value);
            }

            if(key.includes('phone')) {
                phone(feedbackDiv, errorTexts, value);
            }

            if(key.includes('date')) {
                date(feedbackDiv, errorTexts, value);
            }
        });

    };

    let required = (div, text, val) => {
        if(!val) {
            div.addClass('is-invalid').text(text[0]);
            options.errors = true;
            options['errorType'] = 'required';
        } else {
            div.empty();
            options.errors = false;
        }
    };

    let min = (div, text, val, rule) => {
        let minimum = parseInt(rule.split(':')[1]);
        if(minimum && val && val.length < minimum) {
            div.empty();
            div.addClass('is-invalid').text(text[1] + ' ' + (minimum - 1));
            options.errors = true;
        }
    };

    let max = (div, text, val, rule) => {
        let maximum = parseInt(rule.split(':')[1]);

        if(maximum && val && val.length > maximum) {
            div.empty();
            div.addClass('is-invalid').text(text[2] + ' ' + maximum);
            options.errors = true;
            options['errorType'] = 'max';
        }
    };

    let string = (div, text, val) => {
        let regex = /^[a-zA-Z]+$/;

        if(val && !val.match(regex)) {
            div.empty();
            div.addClass('is-invalid').text(text[3]);
            options.errors = true;
            options['errorType'] = 'string';
        }
    };

    let integer = (div, text, val) => {
        let regex = /^[0-9]+$/;

        if(val && !val.match(regex)) {
            div.empty();
            div.addClass('is-invalid').text(text[4]);
            options.errors = true;
            options['errorType'] = 'integer';
        }
    };

    let email = (div, text, val) => {
        let regex = /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/;

        if(val && !val.match(regex)) {
            div.empty();
            div.addClass('is-invalid').text(text[5]);
            options.errors = true;
            options['errorType'] = 'email';
        }
    };

    let phone = (div, text, val) => {
       let regex = /^\+[0-9]?()[0-9](\s|\S)(\d[0-9]{9})$/;

       if(val && !val.match(regex)) {
           div.empty();
           div.addClass('is-invalid').text(text[6]);
           options.errors = true;
           options['errorType'] = 'phone';
       }
    };

    let date = (div, text, val) => {
        let regex = /^(0?[1-9]|1[0-2])[\/](0?[1-9]|[12]\d|3[01])[\/](19|20)\d{2}\s[-]\s(0?[1-9]|1[0-2])[\/](0?[1-9]|[12]\d|3[01])[\/](19|20)\d{2}$/;

        if(val && !val.match(regex)) {
            div.empty();
            div.addClass('is-invalid').text(text[7]);
            options.errors = true;
            options['errorType'] = 'date';
        }
    };

    let setPersons = () => {
        let firstName = $('#firstName').val().trim(),
            lastName = $('#lastName').val().trim(),
            setEmail = $('#email').val().trim(),
            dof = $('#dof').val().trim(),
            phone = $('#phone').val().trim(),
            address = $('#address').val().trim(),
            gender = $('input[type="radio"]:checked').val(),
            work = $('#work').val().trim(),
            bio = $('#aboutYou').val().trim(),
            person = JSON.parse(localStorage.getItem('person'));

        if(!person) {
            person = [];
        }

        person.push( {
            firstName: firstName,
            lastName: lastName,
            email: setEmail,
            dof: dof,
            phone: phone,
            address: address,
            gender: gender,
            work: work,
            bio: bio,
        });

        localStorage.setItem('person', JSON.stringify(person));


    };

    showPersons();

    if($('#collapse').hasClass('show')) {
        $('#work').attr('data-valid', 'required|date');
    } else {
        $('#work').removeAttr('data-valid');
    }

    $('.submit').click((event) => {
        event.preventDefault();
        afterValidate();

        if(options.errors === false) {
            setPersons();
        } else {
            alert('Please fix errors before submit!');
            return false;
        }
        showPersons();
    });

    $('#reset').click(()  => {
        localStorage.clear('person');
        $('#tbody').empty();
    });

});