$(document).on('ready', function() {

    $(".outer-slider-container").slick({
        arrows: false,
        // autoplay: true,
        infinite: true,
        centerMode: true,
        centerPadding: '250px',
        slidesToShow: 1
    });

    $(".inner-slider-container").slick({
        arrows: false,
        dots: true,
        infinite: true,
    });

});