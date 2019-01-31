$(document).ready(function() {
    // Intel-tel Section Start
    let input = document.querySelector('#phone');

    window.intlTelInput(input);

    // Intel-tel Section End
    localStorage.clear();

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
        minYear: 1950
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

    $('input[data-valid], textarea[data-valid]').on('keyup', (event) => {
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
            'Number not valid'
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

    };

    let required = (div, text, val) => {
        if(!val) {
            div.removeClass('is-valid');
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
            div.removeClass('is-valid');
            div.addClass('is-invalid').text(text[1] + ' ' + (minimum - 1));
            options.errors = true;
        }
    };

    let max = (div, text, val, rule) => {
        let maximum = parseInt(rule.split(':')[1]);

        if(val && val.length > maximum) {
            div.empty();
            div.removeClass('is-valid');
            div.addClass('is-invalid').text(text[2] + ' ' + maximum);
            options.errors = true;
        }
    };

    let string = (div, text, val) => {
        let regex = /^[a-zA-Z]+$/;

        if(val && !val.match(regex)) {
            div.empty();
            div.removeClass('is-valid');
            div.addClass('is-invalid').text(text[3]);
            options.errors = true;
        }
    };

    let integer = (div, text, val) => {
        let regex = /^[0-9]+$/;

        if(val && !val.match(regex)) {
            div.empty();
            div.removeClass('is-valid');
            div.addClass('is-invalid').text(text[4]);
            options.errors = true;
        }
    };

    let email = (div, text, val) => {
        let regex = /^(?:(?:[\w`~!#$%^&*\-=+;:{}'|,?\/]+(?:(?:\.(?:"(?:\\?[\w`~!#$%^&*\-=+;:{}'|,?\/\.()<>\[\] @]|\\"|\\\\)*"|[\w`~!#$%^&*\-=+;:{}'|,?\/]+))*\.[\w`~!#$%^&*\-=+;:{}'|,?\/]+)?)|(?:"(?:\\?[\w`~!#$%^&*\-=+;:{}'|,?\/\.()<>\[\] @]|\\"|\\\\)+"))@(?:[a-zA-Z\d\-]+(?:\.[a-zA-Z\d\-]+)*|\[\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\])$/;

        if(val && !val.match(regex)) {
            div.empty();
            div.removeClass('is-valid');
            div.addClass('is-invalid').text(text[5]);
            options.errors = true;
        } else if (val.match(regex)){
            div.empty().removeClass('is-invalid').addClass('is-valid').text('✓ Looks Good');
            options.errors = false;
        }
    };

    let phone = (div, text, val) => {
       let regex = /^([+(\d]{1})(([\d+() -.]){5,16})([+(\d]{1})$/;

       if(val && !val.match(regex)) {
           div.empty();
           div.removeClass('is-valid').addClass('is-invalid').text(text[6]);
           options.errors = true;
       }  else if (val.match(regex)){
           div.empty().removeClass('is-invalid').addClass('is-valid').text('✓ Looks Good');
           options.errors = false;
       }

       if(isNaN(val)) {
           div.empty();
           div.removeClass('is-valid').addClass('is-invalid').text(text[4]);
           console.log(options.errors);
           options.errors = true;
       }
    };

    let drawdata = () => {
        let tbody = $('#tbody');
        let html = "";
        let firstName = $('#firstName').val();
        let lastName = $('#lastName').val();
        let setEmail = $('#email').val();
        let dof = $('#dof').val();
        let about = $('#aboutYou').val();
        let phone = $('#phone').val();
        let address = $('#address').val();
        let gender = $('.gender').val();
        let work = $('#work').val();
        let person = JSON.parse(localStorage.getItem('person'));
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
        } else{return false}
    });

});