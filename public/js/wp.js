$(function() {
    // pull posts from wordpress.com api
    $.ajax({
        type: "GET",
        url: 'https://public-api.wordpress.com/rest/v1.1/sites/mrfpblog.wordpress.com/posts/?number=2',
        dataType: 'json',
    }).success( function(response){
        // console.log(JSON.stringify(response));
        // r = JSON.parse(response);
        // r = JSON.stringify(response);
        r = response;
        console.log(r);

        var slide = $( '.js-wp-slide' ).clone();
        $( '.js-template' ).remove();

        for (var post in r.posts) {
            console.log(r.posts[post]);
            var date = new Date(r.posts[post].date);
            $( slide ).find('.e-project-name').text( r.posts[post].title );
            $( slide ).find('.e-question').text( date.toDateString() );
            $( slide ).find('.e-post').html( r.posts[post].excerpt );
            $( slide ).find('.e-read-more').attr( 'href', r.posts[post].URL );

            $( slide ).clone().appendTo( '#wp-slider' );
        }



        $('#wp-slider').slick('unslick');
        $('#wp-slider').slick({
            arrows: true,
            draggable: false,
            swipeToSlide: true,
            autoplay: true,
            autoplaySpeed: 3000,
            responsive: [
            {
                breakpoint: 800,
                settings: {
                    draggable: true,
                }
            }
            ]
        });


    });


});