$(document).on('ready', function() {

    $(".outer-slider-container").slick({
        arrows: false,
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


    $(".slider-calendario").slick({
        arrows: false,
        dots: true,
        infinite: true,
        centerMode: true,
        // slidesToShow: 1,
        mobileFirst: true,
        centerPadding: '3.906vw',
        responsive: [
            {
                breakpoint: 768,
                settings: "unslick"
            }
        ]
    });
    
    // Dynamic Tramoya Diagrams
    $('#tagFoto2').click(() => {
        $('.dynamic-diagram').css('background-image','url(./img/tramoya02.png)');
    });

    $('#tagFoto3').click(() => {
        $('.dynamic-diagram').css('background-image','url(./img/tramoya03.png)');
    });

    $('.tagFoto4').click(() => {
        $('.dynamic-diagram').css('background-image','url(./img/tramoya04.png)');
    });

    $('.tagFoto5').click(() => {
        $('.dynamic-diagram').css('background-image','url(./img/tramoya05.png)');
    });

    let isOdd = (num) => {
        return num % 2;
    }

    // Read FAQ JSON file
    let jqxhr = $.getJSON('./js/faq.json', (faqs) => {
        let innerHTML = '',
            leftColumnInnerHTML = '<div class="left-column">',
            rightColumnInnerHTML = '<div class="right-column">',
            $questionsContainer = $('.questions-container');
        // console.log(faqs.questions);

        $.each(faqs.questions, function(key, item) {
            if(key%2 == 0){
                leftColumnInnerHTML += '<div class="question">' + item.question + '<i class="arrow up"></i></div>';
                leftColumnInnerHTML += '<div class="answer">' + item.answer + '</div>';
            }
            else {
                rightColumnInnerHTML += '<div class="question">' + item.question + '<i class="arrow up"></i></div>';
                rightColumnInnerHTML += '<div class="answer"><p>' + item.answer + '</p></div>';
            }
        });

        leftColumnInnerHTML += '</div>';
        rightColumnInnerHTML += '</div>';

        $questionsContainer.append(leftColumnInnerHTML);
        $questionsContainer.append(rightColumnInnerHTML);
     })
     .done(() => {
        // Accordion Questions
        $('.question').click((e) => {
            let target = e.target,
                arrow = target.querySelector('.arrow');
            target.classList.toggle('active');
            arrow.classList.toggle('down');
            let answer = target.nextElementSibling;
            if(answer.style.display === "block") {
                answer.style.display = "none";
            }
            else {
                answer.style.display = "block";
            }
        });
     });
});