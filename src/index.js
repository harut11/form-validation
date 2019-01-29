$(document).ready(function() {
    let input = document.querySelector('#phone');
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
        buttons: [
            'copy'
        ]
    });

    $('input[data-valid]').on('keyup', (event) => {
       formValidate($(event.target).val());
        console.log($(this).attr());
    });

    let formValidate = (val) => {
        let errorTexts = [
            'This field is required',
            'This field value must be higher then',
            'This field value must be lower then',
            'This field value must be string',
            'This field value must be number',
        ];

        $('input[data-valid]').each(function () {

            console.log(val);
        })
    };

    $(`.submit`).click((event) => {

    });

});