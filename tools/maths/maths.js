// Generated by CoffeeScript 1.3.3
(function() {
  var pick_one, trim_leading_zeros;

  pick_one = function(list) {
    if (list.length === 0) {
      return null;
    }
    return list[Math.floor(Math.random() * list.length)];
  };

  trim_leading_zeros = function(digits) {
    while (digits[0] === 0 && digits.length > 1) {
      digits.shift();
    }
    return digits;
  };

  $(function() {
    var update;
    $('.control.ops input').change(function(e) {
      var $group, $groupControls;
      $group = $('.control.' + $(e.srcElement).attr('name'));
      $groupControls = $group.find('select').add($group.find('input'));
      if (e.srcElement.checked) {
        $groupControls.prop('disabled', false);
        return $group.removeClass('disabled');
      } else {
        $groupControls.prop('disabled', true);
        return $group.addClass('disabled');
      }
    });
    $('[name="ops-sub"]').click();
    update = function() {
      var add_bottom_avoid_zero, add_bottom_positive, add_digitlengths, add_lengths, digit, digits, first_digit, first_digits, include_add, include_sub, length, less_zeros_digits, no_nines_digits, no_zeros_digits, no_zeros_no_nines_digits, operation, operations, problem, problemhtml, problems, second_digit, second_digits;
      $('#problems').empty().append('<p><b><i>Instructions:</i> Work out the answer for each problem and write it in the space below.</b></p>');
      include_add = $('.settings input[name="ops-add"]').prop('checked');
      include_sub = $('.settings input[name="ops-sub"]').prop('checked');
      add_lengths = $('.settings select[name="add-topdigits"]').val();
      add_bottom_avoid_zero = $('.settings input[name="add-bottomavoidzero"]').prop('checked');
      add_bottom_positive = $('.settings input[name="add-bottompositive"]').prop('checked');
      operations = [];
      if (include_add) {
        operations.push('+');
      }
      if (include_sub) {
        operations.push('-');
      }
      add_digitlengths = [parseInt(add_lengths, 10)];
      digits = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
      no_nines_digits = [0, 1, 2, 3, 4, 5, 6, 7, 8];
      no_zeros_digits = [1, 2, 3, 4, 5, 6, 7, 8, 9];
      no_zeros_no_nines_digits = [1, 2, 3, 4, 5, 6, 7, 8];
      less_zeros_digits = [0].concat([1, 2, 3, 4, 5, 6, 7, 8, 9]).concat([1, 2, 3, 4, 5, 6, 7, 8, 9]).concat([1, 2, 3, 4, 5, 6, 7, 8, 9]).concat([1, 2, 3, 4, 5, 6, 7, 8, 9]);
      problems = (function() {
        var _i, _results;
        _results = [];
        for (problem = _i = 0; _i <= 4; problem = ++_i) {
          operation = pick_one(operations);
          if (operation === '+') {
            length = pick_one(add_digitlengths);
            first_digits = (function() {
              var _j, _ref, _results1;
              _results1 = [];
              for (digit = _j = 0, _ref = length - 1; 0 <= _ref ? _j <= _ref : _j >= _ref; digit = 0 <= _ref ? ++_j : --_j) {
                if (digit === (length - 1) && add_bottom_positive) {
                  _results1.push(pick_one(no_zeros_no_nines_digits));
                } else if (digit === 0) {
                  _results1.push(pick_one(no_zeros_digits));
                } else {
                  _results1.push(pick_one(digits));
                }
              }
              return _results1;
            })();
            second_digits = (function() {
              var _j, _ref, _results1;
              _results1 = [];
              for (digit = _j = 0, _ref = length - 1; 0 <= _ref ? _j <= _ref : _j >= _ref; digit = 0 <= _ref ? ++_j : --_j) {
                first_digit = first_digits[digit];
                second_digit = 10;
                while (second_digit + first_digit >= 10) {
                  if (digit === (length - 1) && add_bottom_positive) {
                    second_digit = pick_one(no_zeros_digits);
                  } else if (add_bottom_avoid_zero) {
                    second_digit = pick_one(less_zeros_digits);
                  } else {
                    second_digit = pick_one(digits);
                  }
                }
                _results1.push(second_digit);
              }
              return _results1;
            })();
            trim_leading_zeros(first_digits);
            trim_leading_zeros(second_digits);
          } else if (operation === '-') {
            first_digits = [9, 9, 9];
            second_digits = [1, 1, 1];
          } else {
            alert("Didn't recognise operation '" + operation + "'.");
            break;
          }
          problemhtml = '<div class="problemarea">';
          problemhtml += '<div class="first number">';
          problemhtml += '<span class="digit">' + (first_digits.join('</span><span class="digit">')) + '</span>';
          problemhtml += '</div><div class="second number">';
          problemhtml += '<span class="operator">' + operation + '</span>';
          problemhtml += '<span class="digit">' + (second_digits.join('</span><span class="digit">')) + '</span>';
          problemhtml += '</div><div class="answer number">';
          problemhtml += '</div>';
          _results.push(problemhtml += '</div>');
        }
        return _results;
      })();
      $('#problems').append($(problems.join("")));
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
