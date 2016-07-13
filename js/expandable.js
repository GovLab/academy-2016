$( document ).ready(function() {

    $('.b-expand-trigger').on("click", function() {
        $(this).siblings().toggleClass('m-active');
        if ($(this).siblings().is(":visible")) {
          $(this).find('.e-expandable-icon').text("expand_less");
        } else {
          $(this).find('.e-expandable-icon').text("expand_more");
        }
    });

})
