# returns one item randomly selected from the array `list`
pick_one = (list) ->
    return null if list.length == 0
    list[Math.floor(Math.random() * list.length)]

# removes leading 0s from the array `digits`.  Returns `digits`
trim_leading_zeros = (digits) ->
    while digits[0] is 0 and digits.length > 1
        digits.shift()
    digits

$ ->
    # connect the operation checkboxes to each operation's settings
    $('.control.ops')

    update = ()->
        $('#problems').empty().append '<p><b><i>Instructions:</i> Work out the answer for each problem and write it in the space below.</b></p>'

        # read options from form.

        include_add = $('.settings input[name="ops-add"]').prop('checked')
        include_sub = $('.settings input[name="ops-sub"]').prop('checked')

        add_lengths = $('.settings select[name="add-topdigits"]').val()
        add_bottom_avoid_zero = $('.settings input[name="add-bottomavoidzero"]').prop('checked')
        add_bottom_positive = $('.settings input[name="add-bottompositive"]').prop('checked')

        # make settings vars based on user options
        operations = []
        operations.push '+' if include_add
        operations.push '-' if include_sub

        add_digitlengths = [ (parseInt add_lengths, 10) ]

        # convenience lists of digits
        digits = [0..9]
        no_nines_digits = [0..8]
        no_zeros_digits = [1..9]
        no_zeros_no_nines_digits = [1..8]
        less_zeros_digits = [0].concat([1..9]).concat([1..9]).concat([1..9]).concat([1..9])

        # make the problems..
        problems = for problem in [0..4]

            # choose op for this problem
            operation = pick_one operations

            # -- addition ------------------------------------------------
            if operation is '+'

                length = pick_one add_digitlengths

                first_digits = for digit in [0..length-1]
                    if digit is (length-1) and add_bottom_positive
                        # if we're not picking zero, we can't have the 1st num's
                        # last digit be a 9 coz it can force a 0 in the 2nd num
                        pick_one no_zeros_no_nines_digits
                    else if digit is 0
                        # always pick a non-zero first digit
                        pick_one no_zeros_digits
                    else
                        pick_one digits

                second_digits = for digit in [0..length-1]
                    first_digit = first_digits[digit]
                    second_digit = 10

                    while second_digit + first_digit >= 10
                        if digit is (length-1) and add_bottom_positive
                            second_digit = pick_one no_zeros_digits
                        else if add_bottom_avoid_zero
                            second_digit = pick_one less_zeros_digits
                        else
                            second_digit = pick_one digits

                    second_digit

                trim_leading_zeros first_digits
                trim_leading_zeros second_digits

            # -- subtraction ---------------------------------------------
            else if operation is '-'
                first_digits = [9,9,9]
                second_digits = [1,1,1]
                # ...
            else
                alert "Didn't recognise operation #{operation}."

            problemhtml  = '<div class="problemarea">'
            problemhtml += '<div class="first number">'
            problemhtml += '<span class="digit">' + (first_digits.join '</span><span class="digit">') + '</span>'
            problemhtml += '</div><div class="second number">'
            problemhtml += '<span class="operator">' + operation + '</span>'
            problemhtml += '<span class="digit">' + (second_digits.join '</span><span class="digit">') + '</span>'
            problemhtml += '</div><div class="answer number">'
            problemhtml += '</div>'
            problemhtml += '</div>'

        $('#problems').append $(problems.join "")
        event.stopPropagation()

    $('input').change (event)-> update()
    $('#make').click  (event)-> update()
    update()
