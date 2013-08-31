pick_one = (list) ->
    return null if list.length == 0
    list[Math.floor(Math.random() * list.length)]

trim_leading_zeros = (digits) ->
    while digits[0] is 0 and digits.length > 1
        digits.shift()
    digits

$ ->
    update = ()->
        $('#problems').empty().append '<p><b><i>Instructions:</i> Work out the answer for each problem and write it in the space below.</b></p>'

        avoid_zeros = $('.settings input[name="avoidzeros"]').prop('checked')
        console.log avoid_zeros

        digits = [0,1,2,3,4,5,6,7,8,9]
        less_zeros_digits = [0,1,2,3,4,5,6,7,8,9,1,2,3,4,5,6,7,8,9,1,2,3,4,5,6,7,8,9]

        operations = ['+', '-', '*']
        operations = ['+']
        digitlengths = [3,4,5]

        problems = for problem in [0..4]

            operation = pick_one operations
            length = pick_one digitlengths

            first_digits = for digit in [1..length]
                pick_one digits

            trim_leading_zeros first_digits

            second_digits = for first_digit in first_digits
                second_digit = 10
                while second_digit + first_digit >= 10
                    if avoid_zeros
                        second_digit = pick_one less_zeros_digits
                    else
                        second_digit = pick_one digits
                second_digit

            trim_leading_zeros second_digits

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
