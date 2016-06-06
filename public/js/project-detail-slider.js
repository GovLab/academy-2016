$(document).ready(function() {
  $('.b-project-slider').slick({
        arrows: true,
        prevArrow: "<div class='e-left-arrow'><i class='material-icons'>chevron_left</i></div>",
        nextArrow: "<div class='e-right-arrow'><i class='material-icons'>chevron_right</i></div>",
        infinite: false,
        draggable: false,
        centerMode: true,
        slidesToShow: 1,
        variableWidth: true,
        focusOnSelect: true,
        swipeToSlide: true,
        responsive: [
            {
                breakpoint: 800,
                settings: {
                    draggable: true,
                    slidesToShow: 1,
                }
            }
        ]
    });
});