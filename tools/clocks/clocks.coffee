pick_one = (list) ->
    return null if list.length == 0
    list[Math.floor(Math.random() * list.length)]

$ ->
    update = ()->
        $('#clocks').empty().append '<p><b><i>Instructions:</i> Work out the time each clock is showing.  Write it in the space below each clock.</b></p>'

        min_step = parseInt($('.clocksettings input[name="minutehand"]:checked').val(), 10)
        hour_hand_accuracy = $('.clocksettings input[name="hourhand"]:checked').val()
        numbers = $('.clocksettings input[name="numbers"]:checked').val()

        possible_minutes = for min in [0..59] by min_step
            min

        possible_hours = for hour in [0..11]
            hour

        clocks = for clock in [0..11]
            minute = pick_one possible_minutes
            minute_rotation = minute * 6

            hour = pick_one possible_hours
            hour_rotation = hour * 30
            if hour_hand_accuracy == 'real'
                hour_rotation += minute / 2
            else if hour_hand_accuracy == 'exaggerated'
                hour_rotation += Math.min(45, minute) / 2

            clockhtml  = '<div class="clockarea">'
            clockhtml += '<div class="clockface">'
            clockhtml += '  <div class="big tick p12"></div>'
            clockhtml += '  <div class="tick p1"></div>'
            clockhtml += '  <div class="tick p2"></div>'
            clockhtml += '  <div class="tick p3"></div>'
            clockhtml += '  <div class="tick p4"></div>'
            clockhtml += '  <div class="tick p5"></div>'
            clockhtml += '  <div class="tick p6"></div>'
            clockhtml += '  <div class="minuteface" style="-moz-transform: rotate(' + minute_rotation + 'deg); -webkit-transform: rotate(' + minute_rotation + 'deg);">'
            clockhtml += '    <div class="minutehand"></div>'
            clockhtml += '  </div>'
            clockhtml += '  <div class="hourface" style="-moz-transform: rotate(' + hour_rotation + 'deg); -webkit-transform: rotate(' + hour_rotation + 'deg);">'
            clockhtml += '    <div class="hourhand"></div>'
            clockhtml += '  </div>'
            clockhtml += '  <div class="middledot"></div>'
            clockhtml += '</div>'
            clockhtml += '<div class="answer">:</div>'
            clockhtml += '</div>'

        $('#clocks').append $(clocks.join "")
        event.stopPropagation()

    $('input').change (event)-> update()
    $('#make').click  (event)-> update()
    update()
