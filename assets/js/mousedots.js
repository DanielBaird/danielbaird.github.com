
dots = {};

in_header = false;
window.tick = false;
tick_length = 100;

handleDots = function() {
    dotthere = false;
    wk_dots = [];
    w3_dots = [];
    moz_dots = [];
    offset = $header.offset();
    $.each(dots, function(ref, d) {
        step = 4;
        // is the mouse near this one?
        xdiff = window.mx - offset.left - d.x;
        ydiff = window.my - offset.top - d.y;
        if (dotthere = (in_header && xdiff < 15 && xdiff > -15 && ydiff < 15 && ydiff > -15)) {
            // increment this one..
            d.size += step;
            d.age = Math.max(-0.33, d.age - step/100);
        } else {
            d.size += step;
            d.age += step/200;
        }
        if (d.age > 1) {
            delete dots[ref];
        } else {
            x = d.x;
            y = d.y;
            size = d.size;
            opac = 0.66 - d.age;
            moz_dots.push('-moz-radial-gradient('+x+'px '+y+'px, circle, rgba(255,0,0, '+ opac +'), rgba(255,0,0, 0) '+ size +'px)');
            w3_dots.push('radial-gradient('+ size +'px at '+x+'px '+y+'px, rgba(255,0,0, '+ opac +'), rgba(255,0,0, 0))');
        }
    });
    if (!dotthere && in_header) {
        ref = (window.mx - offset.left) + ',' + (window.my - offset.top);
        dots[ref] = { x: (window.mx - offset.left), y: (window.my - offset.top), size: 7, age: 0 };
    }
//    $header.css('background', moz_dots.join(','));
    $header.css('background-image', w3_dots.join(','));

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