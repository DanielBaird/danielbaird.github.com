
dots = {};

inHeader = false;
nextTick = false;

handleDots = function() {
    dotthere = false;
    wk_dots = [];
    w3_dots = [];
    moz_dots = [];
    offset = $header.offset();
    $.each(dots, function(d) {
        // step = Math.max(Math.round(dots[d].size / 10.0) || 1, 10);
        step = 2;
        // is the mouse near this one?
        xdiff = window.mx - offset.left - dots[d].x;
        ydiff = window.my - offset.top - dots[d].y;
        if (inHeader && xdiff < 15 && xdiff > -15 && ydiff < 15 && ydiff > -15) {
            // increment this one..
            dots[d].size += step;
            dots[d].age = Math.max(0, dots[d].age - step/100);
            dotthere = true;
        } else {
            dots[d].size += step;
            dots[d].age += step/200;
        }
        // if (dots[d].size < 1) {
        if (dots[d].age > 1) {
            delete dots[d];
        } else {
            x = dots[d].x;
            y = dots[d].y;
            size = dots[d].size;
            opac = 1 - dots[d].age;
            moz_dots.push('-moz-radial-gradient('+x+'px '+y+'px, circle, rgba(255,0,0, '+ opac +') 0%, rgba(255,255,255, 0) '+ size +'px)');
            w3_dots.push('radial-gradient('+ size +'px at '+x+'px '+y+'px, rgba(255,0,0, '+ opac +'), rgba(255,255,255, 0))');
        }
    });
    if (!dotthere && inHeader) {
        ref = (window.mx - offset.left) + ',' + (window.my - offset.top);
        dots[ref] = { x: (window.mx - offset.left), y: (window.my - offset.top), size: 7, age: 0 };
    }
    $header.css('background', moz_dots.join(','));
    $header.css('background', w3_dots.join(','));

    setTimeout("handleDots()", 100);
}

$( function() {
    setTimeout("handleDots()", 50);
    $header = $('.page > header')
    $header.on('mousemove', function(e) {
        window.mx = e.pageX
        window.my = e.pageY
    });
    $header.mouseenter( function(e) {
        inHeader = true;
    });
    $header.mouseleave( function(e) {
        inHeader = false;
    });
});