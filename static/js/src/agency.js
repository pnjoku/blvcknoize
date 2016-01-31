/*!
 * Start Bootstrap - Agency Bootstrap Theme (http://startbootstrap.com)
 * Code licensed under the Apache License v2.0.
 * For details, see http://www.apache.org/licenses/LICENSE-2.0.
 */

// jQuery for page scrolling feature - requires jQuery Easing plugin
(function($) {
    $(document).ready(function() {

        $('.page-scroll').bind('click', function(event) {
			event.preventDefault();

            $('html, body').stop().animate({
                scrollTop: $('#' + event.currentTarget.href.split('#')[1]).offset().top
            }, 1500, 'easeInOutExpo');
        });

        // Closes the Responsive Menu on Menu Item Click
        $('.navbar-collapse ul li a').click(function() {
            $('.navbar-toggle:visible').click();
        });

        // Shrink navigation
        var header = $('.navbar-default'),
			didScroll = false;

		window.addEventListener('scroll', function() {
			if(!didScroll) {
				didScroll = true;
				setTimeout( scrollPage, 250 );
			}
		}, false);

		function scrollPage() {
			if ( window.pageYOffset || document.documentElement.scrollTop >= 300 ) {
				header.addClass('navbar-shrink');
			}
			else {
				header.removeClass('navbar-shrink');
			}
			didScroll = false;
		}
    });
})(window.jQuery);
