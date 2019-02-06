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
        startDate: '01/01/1951',
        endDate: '12/31/2000',
        autoUpdateInput: false,
    });

    $('textarea[data-valid] , .type-text').on('keyup', (event) => {
        event.preventDefault();
       formValidate($(event.target), $(event.target).val().toLowerCase());
    });

    $('.type-change').change((event) => {
        event.preventDefault();
        formValidate($(event.target), $(event.target).val().trim());
    });

    let afterValidate = () => {
        let inputs = $('input[data-valid]'),
            textarea = $('textarea[data-valid]');
        let _errors = 0;
        for(let i = 0; i < inputs.length; i++) {
            if(formValidate($(inputs[i]), $(inputs[i]).val())) _errors++
        }
        if(formValidate(textarea, textarea.val())) _errors++;
        return _errors
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

        let hasError = false;

        let rules = element.attr('data-valid').split('|'),
            feedbackDiv = element.closest('.form-group').find('.feedback');
        let errorsIterator = 0;

        for(let i = 0; i < rules.length; i++){
            let key = rules[i];
            if(key === 'required') {
                hasError = required(feedbackDiv, errorTexts, value);
                if(!hasError) errorsIterator++
            }

            if(key.includes('min')) {
                hasError = min(feedbackDiv, errorTexts, value, key);
                if(!hasError) errorsIterator++
            }

            if(key.includes('max')) {
                hasError = max(feedbackDiv, errorTexts, value, key);
                if(!hasError) errorsIterator++
            }

            if(key === 'name') {
                hasError = name(feedbackDiv, errorTexts, value);
                if(!hasError) errorsIterator++
            }

            if(key === 'integer') {
                hasError = integer(feedbackDiv, errorTexts, value);
                if(!hasError) errorsIterator++
            }

            if(key === 'email') {
                hasError = email(feedbackDiv, errorTexts, value);
                if(!hasError) errorsIterator++
            }

            if(key === 'date') {
                hasError = date(feedbackDiv, errorTexts, value);
                if(!hasError) errorsIterator++
            }

            if(key === 'two') {
                hasError = dateTwo(feedbackDiv, errorTexts, value);
                if(!hasError) errorsIterator++
            }
        }
        return errorsIterator;
    };

    let required = (div, text, val) => {
        if(!val.trim()) {
            div.empty();
            div.addClass('is-invalid').text(text[0]);
            return false;
        } else {
            div.empty();
            return true
        }
    };

    let min = (div, text, val, rule) => {
        let minimum = parseInt(rule.split(':')[1]);
        if(minimum && val && val.length < minimum || !val) {
            div.empty();
            div.addClass('is-invalid').text(text[1] + ' ' + (minimum - 1));
            return false;
        }else {
            div.empty();
            return true
        }
    };

    let max = (div, text, val, rule) => {
        let maximum = parseInt(rule.split(':')[1]);

        if(maximum && val && val.length > maximum) {
            div.empty();
            div.addClass('is-invalid').text(text[2] + ' ' + maximum);
            return false;
        }else {
            return true
        }
    };

    let name = (div, text, val) => {
        let regex = /^(([A-za-z]+[\s]{1}[A-za-z]+)|([A-Za-z]+))$/;

        if(val && !val.match(regex)) {
            div.empty();
            div.addClass('is-invalid').text(text[3]);
            return false;
        } else {
            return true;
        }
    };

    let integer = (div, text, val) => {
        let regex = /^[0-9]+$/;

        if(val && !val.match(regex)) {
            div.empty();
            div.addClass('is-invalid').text(text[4]);
            return false;
        } else {
            return true;
        }
    };

    let email = (div, text, val) => {
        let regex = /^([A-Z|a-z|0-9](\.|_){0,1})+[A-Z|a-z|0-9]\@([A-Z|a-z|0-9])+((\.){0,1}[A-Z|a-z|0-9]){2}\.[a-z]{2,3}$/;

        if(val && !val.match(regex)) {
            div.empty();
            div.addClass('is-invalid').text(text[5]);
            return false;
        }  else {
            return true;
        }
    };

    let date = (div, text, val) => {
        let regex = /^(0?[1-9]|1[0-2])[\/](0?[1-9]|[12]\d|3[01])[\/](19|20)\d{2}\s[-]\s(0?[1-9]|1[0-2])[\/](0?[1-9]|[12]\d|3[01])[\/](19|20)\d{2}$/;

        if(val && !val.match(regex)) {
            div.empty();
            div.addClass('is-invalid').text(text[7]);
            return false;
        } else {
            return true;
        }
    };

    let dateTwo = (div, text, val) => {
        let regex = /^(0?[1-9]|1[0-2])[\/](0?[1-9]|[12]\d|3[01])[\/](19|20)\d{2}$/;

        if(val && !val.match(regex)) {
            div.empty();
            div.addClass('is-invalid').text(text[7]);
            return false;
        } else {
            return true;
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
        let row = $(event.target).closest('tr[role="row"]');

        if(row) {
            if(row.attr('mustRemove')) {
                row.removeAttr('mustRemove');
            } else {
                row.attr('mustRemove', 'true');
            }
        }
    });

    $('.submit').click((event) => {
        event.preventDefault();
        let a = afterValidate();
        if(!a) {
            setPersons();
            showPerson();

        } else {
            alert('Please fix errors before submit!');
            return false;
        }
    });

    $('#reset').click(()  => {
        let persons = JSON.parse(localStorage.getItem('person')),
            tr = $('tr[mustRemove="true"]'),
            td = tr.find('td'),
            space = Array.from(persons);

        for(let i = 0; i < space.length; i++) {
            let localEmail = space[i].email;

            for(let s = 0; s < td.length; s++) {
                let str = $(td[s]).text().trim();
                if(localEmail === str) {
                    space.splice(i, 1);
                    localStorage.setItem('person', JSON.stringify(space));
                }
            }
        }
        tr.remove();
    });
});