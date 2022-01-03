$(document).on('ready', function() {

    $(".outer-slider-container").slick({
        arrows: false,
        // autoplay: true,
        infinite: true,
        centerMode: true,
        slidesToShow: 1,
        mobileFirst: true,
        centerPadding: '3.906vw',
        responsive: [
            {
                breakpoint: 768,
                settings: {
                    centerPadding: '17.361vw',
                }
            },
            {
                breakpoint: 1440,
                settings: {
                    centerPadding: '250px'
                }
            }
        ]
    });

    $(".inner-slider-container").slick({
        arrows: false,
        dots: true,
        infinite: true,
    });

});