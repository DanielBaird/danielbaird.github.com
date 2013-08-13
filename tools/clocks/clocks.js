// Generated by CoffeeScript 1.3.3
(function() {
  var pick_one;

  pick_one = function(list) {
    if (list.length === 0) {
      return null;
    }
    return list[Math.floor(Math.random() * list.length)];
  };

  $(function() {
    var update;
    update = function() {
      var clock, clockhtml, clocks, hour, hour_hand_accuracy, hour_rotation, min, min_step, minute, minute_rotation, numbers, possible_hours, possible_minutes;
      $('#clocks').empty().append('<p><b><i>Instructions:</i> Work out the time each clock is showing.  Write it in the space below each clock.</b></p>');
      min_step = parseInt($('.clocksettings input[name="minutehand"]:checked').val(), 10);
      hour_hand_accuracy = $('.clocksettings input[name="hourhand"]:checked').val();
      numbers = $('.clocksettings input[name="numbers"]:checked').val();
      possible_minutes = (function() {
        var _i, _results;
        _results = [];
        for (min = _i = 0; _i <= 59; min = _i += min_step) {
          _results.push(min);
        }
        return _results;
      })();
      possible_hours = (function() {
        var _i, _results;
        _results = [];
        for (hour = _i = 0; _i <= 11; hour = ++_i) {
          _results.push(hour);
        }
        return _results;
      })();
      clocks = (function() {
        var _i, _results;
        _results = [];
        for (clock = _i = 0; _i <= 11; clock = ++_i) {
          minute = pick_one(possible_minutes);
          minute_rotation = minute * 6;
          hour = pick_one(possible_hours);
          hour_rotation = hour * 30;
          if (hour_hand_accuracy === 'real') {
            hour_rotation += minute / 2;
          } else if (hour_hand_accuracy === 'exaggerated') {
            hour_rotation += Math.min(45, minute) / 2;
          }
          clockhtml = '<div class="clockarea">';
          clockhtml += '<div class="clockface">';
          clockhtml += '  <div class="big tick p12"></div>';
          clockhtml += '  <div class="tick p1"></div>';
          clockhtml += '  <div class="tick p2"></div>';
          clockhtml += '  <div class="tick p3"></div>';
          clockhtml += '  <div class="tick p4"></div>';
          clockhtml += '  <div class="tick p5"></div>';
          clockhtml += '  <div class="tick p6"></div>';
          clockhtml += '  <div class="minuteface" style="-moz-transform: rotate(' + minute_rotation + 'deg); -webkit-transform: rotate(' + minute_rotation + 'deg);">';
          clockhtml += '    <div class="minutehand"></div>';
          clockhtml += '  </div>';
          clockhtml += '  <div class="hourface" style="-moz-transform: rotate(' + hour_rotation + 'deg); -webkit-transform: rotate(' + hour_rotation + 'deg);">';
          clockhtml += '    <div class="hourhand"></div>';
          clockhtml += '  </div>';
          clockhtml += '  <div class="middledot"></div>';
          clockhtml += '</div>';
          clockhtml += '<div class="answer">:</div>';
          _results.push(clockhtml += '</div>');
        }
        return _results;
      })();
      $('#clocks').append($(clocks.join("")));
      return event.stopPropagation();
    };
    $('input').change(function(event) {
      return update();
    });
    $('#make').click(function(event) {
      return update();
    });
    return update();
  });

}).call(this);
