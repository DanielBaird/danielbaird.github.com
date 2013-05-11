
dots = {};

inHeader = false;

nextTick = false;

handleDots = function() {
    if (inHeader) {
        offset = $header.offset();
        ref = (mx - offset.left) + ',' + (my - offset.top);
        if (dots[ref]) {
            // increment existing dot
            dots[ref].size += 3;
        } else {
            // start a new dot
            dots[ref] = { x: (mx - offset.left), y: (my - offset.top), size: 5 };
        }
    }
    // show (and decrement) dots
    ellipses = [];
    $.each(dots, function(d) {
        ellipses.push('-webkit-radial-gradient('+dots[d].x+'px '+dots[d].y+'px, '+dots[d].size+'px '+dots[d].size+'px, rgba(255,0,0, '+ (0.5 + (dots[d].size / 100)) +'), rgba(255,255,255, 0))');
        dots[d].size -= 1;
        if (dots[d].size < 1) {
            delete dots[d];
        }
    });
    $header.css('background', ellipses.join(','));

    if (!nextTick) {
        nextTick = setInterval("handleDots()", 50);
    }
}

$( function() {
    nextTick = setInterval("handleDots()", 50);
    $header = $('.page > header')
    $header.on('mousemove', function(e) {
        mx = e.pageX
        my = e.pageY
    });
    $header.mouseenter( function(e) {
        inHeader = true;
    });
    $header.mouseleave( function(e) {
        inHeader = false;
    });
});