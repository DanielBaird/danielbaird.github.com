
dots = {};

in_header = false;
window.tick = false;
tick_length = 25;

handleDots = function() {
    dotthere = false;
    wk_dots = [];
    w3_dots = [];
    moz_dots = [];
    step = 1;
    close = 66;
    // offset = $header.offset();
    offset = { left: 0, top: 0 }
    $.each(dots, function(ref, d) {
        // is the mouse near this one?
        xdiff = window.mx - offset.left - d.x;
        ydiff = window.my - offset.top - d.y;
        if (in_header && xdiff < close && xdiff > -close && ydiff < close && ydiff > -close) {
            dotthere = true
            // increment this one..
            d.size += step;
            if (d.size < 150) {
                d.age = Math.max(-0.25, d.age - step/25);
            } else {
                d.age += step/75;
            }
        } else {
            d.size += step;
            d.age += step/75;
        }
        if (d.age > 1) {
            delete dots[ref];
        } else {
            x = d.x;
            y = d.y;
            size = d.size;
            opac = 0.75 - d.age;
            moz_dots.push('-moz-radial-gradient('+x+'px '+y+'px, circle, rgba(255,0,0, '+ opac +'), rgba(255,0,0, 0) '+ size +'px)');
            w3_dots.push('radial-gradient('+ size +'px at '+x+'px '+y+'px, rgba(255,0,0, '+ opac +'), rgba(255,0,0, 0))');
        }
    });
    if (!dotthere && in_header) {
        ref = (window.mx - offset.left) + ',' + (window.my - offset.top);
        dots[ref] = { x: (window.mx - offset.left), y: (window.my - offset.top), size: 7, age: 0 };
    }
    $('body').css('background-image', moz_dots.join(','));
    $('body').css('background-image', w3_dots.join(','));

    window.tick = setTimeout("handleDots()", tick_length);
}

$( function() {
    window.tick = setTimeout("handleDots()", tick_length);
//    setInterval("console.log(Object.keys(window.dots).length)", 1000);
    $header = $('.page > header')
    $header.on('mousemove', function(e) {
        window.mx = e.pageX
        window.my = e.pageY
    });
    $header.mouseenter( function(e) {
        in_header = true;
    });
    $header.mouseleave( function(e) {
        in_header = false;
    });
});
