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

    let table = $('#data-table').DataTable({
        scrollY:        300,
        deferRender:    false,
        scroller:       true,
    });


    let options = {
        errors: false,
    };

    let showPersons = () => {
        let persons = JSON.parse(localStorage.getItem('person'));

        if(persons) {
            $.each(persons, (key, value) => {
                table.row.add([
                    '<input type="checkbox" class="ml-2 rowCheck">',
                    value.firstName,
                    value.lastName,
                    value.email,
                    value.dof,
                    value.phone,
                    value.address,
                    value.gender,
                    value.work,
                ]).draw(false);
            });
        }
    };

    let showPerson = () => {
        let persons = JSON.parse(localStorage.getItem('person')),
            person = persons[persons.length - 1];

        table.row.add([
            '<input type="checkbox" class="ml-2 rowCheck">',
            person.firstName,
            person.lastName,
            person.email,
            person.dof,
            person.phone,
            person.address,
            person.gender,
            person.work,
        ]).draw(false);
    };

    let dateTimes = $('input[name="datetimes"]');


    dateTimes.daterangepicker({
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

    dateTimes.on('apply.daterangepicker', function(ev, picker) {
        $(this).val(picker.startDate.format('MM/DD/YYYY') + ' - ' + picker.endDate.format('MM/DD/YYYY'));
        formValidate($(this), $(this).val());
    });

    dateTimes.on('cancel.daterangepicker', function() {
        $(this).val('');
        formValidate($(this), $(this).val());
    });

    let dof = $('input[id="dof"]');

    dof.on('apply.daterangepicker', function(ev, picker) {
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
            format: 'MM/DD/YYYY',
        },
    });

    $('textarea[data-valid] , .type-text').on('keyup', (event) => {
        event.preventDefault();
       formValidate($(event.target), $(event.target).val());
    });

    $('.type-change').change((event) => {
        event.preventDefault();
        formValidate($(event.target), $(event.target).val().trim());
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
            'Email address is not valid',
            'Number not valid',
            'This field is not date format'
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

            if(key === 'string') {
                string(feedbackDiv, errorTexts, value);
            }

            if(key === 'integer') {
                integer(feedbackDiv, errorTexts, value);
            }

            if(key === 'email') {
                email(feedbackDiv, errorTexts, value);
            }

            if(key === 'date') {
                date(feedbackDiv, errorTexts, value);
            }

            if(key === 'two') {
                dateTwo(feedbackDiv, errorTexts, value);
            }
        });

    };

    let required = (div, text, val) => {
        if(!val) {
            div.addClass('is-invalid').text(text[0]);
            options.errors = true;
            options['errorType'] = 'required';
            return false;
        } else {
            div.empty();
            options.errors =false;
        }
        return true;
    };

    let min = (div, text, val, rule) => {
        let minimum = parseInt(rule.split(':')[1]);

        if(minimum && val && val.length < minimum) {
            div.empty();
            div.addClass('is-invalid').text(text[1] + ' ' + (minimum - 1));
            options.errors = true;
            return false;
        }
        return true;
    };

    let max = (div, text, val, rule) => {
        let maximum = parseInt(rule.split(':')[1]);

        if(maximum && val && val.length > maximum) {
            div.empty();
            div.addClass('is-invalid').text(text[2] + ' ' + maximum);
            options.errors = true;
            options['errorType'] = 'max';
            return false;
        }
        return true;
    };

    let string = (div, text, val) => {
        let regex = /^[a-zA-Z]+$/;

        if(val && !val.match(regex)) {
            div.empty();
            div.addClass('is-invalid').text(text[3]);
            options.errors = true;
            options['errorType'] = 'string';
            return false;
        }
        return true;
    };

    let integer = (div, text, val) => {
        let regex = /^[0-9]+$/;

        if(val && !val.match(regex)) {
            div.empty();
            div.addClass('is-invalid').text(text[4]);
            options.errors = true;
            options['errorType'] = 'integer';
            return false;
        }
        return true;
    };

    let email = (div, text, val) => {
        let regex = /^([A-Z|a-z|0-9](\.|_){0,1})+[A-Z|a-z|0-9]\@([A-Z|a-z|0-9])+((\.){0,1}[A-Z|a-z|0-9]){2}\.[a-z]{2,3}$/;

        if(val && !val.match(regex)) {
            div.empty();
            div.addClass('is-invalid').text(text[5]);
            options.errors = true;
            options['errorType'] = 'email';
            return false;
        }
        return true;
    };

    let date = (div, text, val) => {
        let regex = /^(0?[1-9]|1[0-2])[\/](0?[1-9]|[12]\d|3[01])[\/](19|20)\d{2}\s[-]\s(0?[1-9]|1[0-2])[\/](0?[1-9]|[12]\d|3[01])[\/](19|20)\d{2}$/;

        if(val && !val.match(regex)) {
            div.empty();
            div.addClass('is-invalid').text(text[7]);
            options.errors = true;
            return false;
        }
        return true;
    };

    let dateTwo = (div, text, val) => {
        let regex = /^(0?[1-9]|1[0-2])[\/](0?[1-9]|[12]\d|3[01])[\/](19|20)\d{2}$/;

        if(val && !val.match(regex)) {
            div.empty();
            div.addClass('is-invalid').text(text[7]);
            options.errors = true;
            return false;
        }
        return true;
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

    $('#customCheck1').change(function () {
        setTimeout(function () {
            if($('#collapse').hasClass('show')) {
                $('#work').attr('data-valid', 'required|date');
            } else {
                $('#work').removeAttr('data-valid');
            }
        }, 500);
    });

    $('.rowCheck').change((event) => {
        $(event.target).closest('tr[role="row"]').toggleClass('mustRemove');
    });

    $('.submit').click((event) => {
        event.preventDefault();
        afterValidate();
        console.log(options.errors);

        if(options.errors === false) {
            setPersons();
            showPerson();

        } else {
            alert('Please fix errors before submit!');
            return false;
        }

    });

    $('#reset').click(()  => {
        $('.mustRemove').remove();
        let persons = JSON.parse(localStorage.getItem('person'));

        for(let i = 0; i < persons.length; i++) {
            localStorage.removeItem(persons[i]);
        }
    });
});