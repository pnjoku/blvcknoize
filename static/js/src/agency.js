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

        // Contact form
		var contactForm = $('#contactForm'),
			contactSuccess = $('#contactSuccess');

        contactForm.submit(function() {
			$(this).ajaxSubmit({
				success: function(responseText, statusText, xhr, $form) {
					if (responseText.errors) {

						// clear any previous errors
						contactForm.find('.has-error').removeClass('has-error');
						contactForm.find('.text-danger').remove();

						// add error states to fields, mapping `path` to the dom `id`
						$.each(responseText.errors, function(index, error) {
							$('#' + error.path)
								.addClass('has-error')
								.after('<p class="help-block text-danger">' + error.message + '</p>');
						});
					}
					else {
						// clear fields
						$form.resetForm();

						// display message to user
						contactSuccess.find('span').text(responseText.name.first);
						contactSuccess.show();
						window.setTimeout(function() {
							contactSuccess.fadeOut();
						}, 5000);
					}
				}
			});

			return false;
		});
    });
})(window.jQuery);
