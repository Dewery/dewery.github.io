'use strict';
var $ = jQuery;
var isTouchDevice = navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry|Windows Phone)/);

function createTimeCicles() {
	var countDown  =  $('.count-down'),
			countColor = 'rgba(255,255,255,0.8)';
	
	if (countDown.length){
		countDown.TimeCircles().destroy();

		countDown.each(function (){
			$(this).TimeCircles({
				'animation'       : 'ticks',
				'bg_width'        : 0.2,
				'fg_width'        : 0.01,
				'circle_bg_color' : 'rgba(255,255,255,0.4)',
				'time'            : {
					'Days' : {
						'text'  : 'Days',
						'color' : countColor,
						'show'  : true
					},
					'Hours' : {
						'text'  : 'Hours',
						'color' : countColor,
						'show'  : true
					},
					'Minutes' : {
						'text'  : 'Minutes',
						'color' : countColor,
						'show'  : true
					},
					'Seconds' : {
						'text'  : 'Seconds',
						'color' : countColor,
						'show'  : true
					}
				}
			});
		});
	}
}

//Google Map
function initialize(){
  var mapCanvas = $('.map-canvas');
  
  mapCanvas.each(function () {
		var $this           = $(this),
				zoom            = 8,
				lat             = 39.747844,
				lng             = -104.9815279,
				scrollwheel     = false,
				draggable       = true,
				title           = '',
				contentString   = '';
		
		if ($this.data('zoom'))
			zoom = parseFloat($this.data('zoom'));
	
		if ($this.data('lat'))
			lat = parseFloat($this.data('lat'));
		
		if ($this.data('lng'))
			lng = parseFloat($this.data('lng'));
		
		if ($this.data('scrollwheel')) {
			scrollwheel = $this.data('scrollwheel');
		}
		
		if ($this.data('title'))
			title = $this.data('title');
		
		if( isTouchDevice )
			draggable = false;
	
		var mapOptions = {
			zoom                  : zoom,
			scrollwheel           : scrollwheel,
			draggable             : draggable,
			center                : new google.maps.LatLng(lat, lng),
			mapTypeId             : google.maps.MapTypeId.ROADMAP,
			mapTypeControlOptions : {
				style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
				position: google.maps.ControlPosition.LEFT_BOTTOM 
			}
		};
		
		var map = new google.maps.Map($this[0], mapOptions);
		var is_internetExplorer11 = navigator.userAgent.toLowerCase().indexOf('trident') > -1;
		var image = (is_internetExplorer11) ? 'img/marker.png' : 'img/marker.svg';
		
		if ($this.data('content')) {
			contentString = '<div class="marker-content">' +
				'<h3 class="title">' + title + '</h3>' +
				$this.data('content') +
			'</div>';
		}
	
		var infowindow = new google.maps.InfoWindow({
			content: contentString
		});
		
		var marker = new google.maps.Marker({
			position : new google.maps.LatLng(lat, lng),
			map      : map,
			icon     : image,
			title    : title
		});
		
		if ($this.data('content')) {
			google.maps.event.addListener(marker, 'click', function() {
				infowindow.open(map,marker);
			});
		}
		
		var styles = [{"stylers":[{"saturation":-100},{"gamma":1}]},{"elementType":"labels.text.stroke","stylers":[{"visibility":"off"}]},{"featureType":"poi.business","elementType":"labels.text","stylers":[{"visibility":"off"}]},{"featureType":"poi.business","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"poi.place_of_worship","elementType":"labels.text","stylers":[{"visibility":"off"}]},{"featureType":"poi.place_of_worship","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"road","elementType":"geometry","stylers":[{"visibility":"simplified"}]},{"featureType":"water","stylers":[{"visibility":"on"},{"saturation":50},{"gamma":0},{"hue":"#50a5d1"}]},{"featureType":"administrative.neighborhood","elementType":"labels.text.fill","stylers":[{"color":"#333333"}]},{"featureType":"road.local","elementType":"labels.text","stylers":[{"weight":0.5},{"color":"#333333"}]},{"featureType":"transit.station","elementType":"labels.icon","stylers":[{"gamma":1},{"saturation":50}]}];
			
		map.setOptions({
			styles: styles
		});
	});
}

function loadScript(){
  var script = document.createElement('script');
  script.type = 'text/javascript';
  script.src = 'https://maps.googleapis.com/maps/api/js?v=3.exp&sensor=false&' +
    'callback=initialize';
  document.body.appendChild(script);
}

window.onload = loadScript;

//Slider Background
function backgroundSlider() {
	var slider = $('.background-slider');
	
	if (slider.length) {
		var autoplayTimeout = 2000,
				animateIn       = 'fadeIn',
				animateOut      = 'fadeOut';
		
		if (slider.data('animateIn'))
			animateIn = slider.data('animateIn');
		
		if (slider.data('animateOut'))
			animateOut = slider.data('animateOut');
		
		if (slider.data('timeout'))
			autoplayTimeout = slider.data('timeout');
		
		slider.owlCarousel({
			animateIn       : animateIn,
			animateOut      : animateOut,
			items           : 1,
			loop            : true,
			autoplay        : true,
			autoplayTimeout : autoplayTimeout
		});
	}
}

//HTML5 Video Background
function htmlVideoBg(){
  var videoBg = $('.background-video');
  
  if (videoBg.find('video').length){
		var video = videoBg.find('video');
	
		if (video.width() == videoBg.width()){
			video.css({
				marginLeft : 0,
				marginTop : -((video.height() - videoBg.height()) / 2),
				width : 'auto'
			});
		} else {
			video.css({
				marginTop : 0,
				marginLeft : -((video.width() - videoBg.width()) / 2),
				width : 'auto'
			});
		}
  }
}

//YouTube Video Background
function youtubeVideoBg(){
  var videoBg = $('.background-video');

  if ((videoBg.data('video')) && ($.fn.tubular)){
		if (videoBg.find('video').length)
			videoBg.find('video').remove();
		
		if (!videoBg.find('.tubular-container').length){
			var videoId = '';
			
			if (videoBg.data('video'))
				videoId = videoBg.data('video');
			
			videoBg.tubular({
				videoId   : videoId,
				container : videoBg
			});
		}
  }
}

//Constellation Background
function constellationBg(){
	var constellation = $('.background-constellation'),
			length = 150,
			distance = 120,
			radius = 150;
	
	if (!constellation.find('canvas').length) constellation.append('<canvas>');
	
	if ($('body').width() < 768) {
		length = 75;
		distance = 60;
		radius = 75;
	}
	constellation.find('canvas').constellation({
		star : {
			color : 'rgba(255,255,255,.8)',
			width : 2
		},
		line : {
			color : 'rgba(255,255,255,.5)',
			width : 0.5
		},
		length : length,
    distance : distance,
    radius : radius
	});
}

//Main Menu
function headerMenu(){
  var menu    = $('.menu'),
			link    = menu.find('a'),
			url     = window.location.href,
			hash    = url.substring(url.indexOf('#')),
			landing = $('body').hasClass('landing-page'),
			headerH;
	
	if ($('body').width() < 768)
		headerH = 0;
	else
		headerH = $('.site-header').height();
	
  link.on('click', function(e){
		var $this    = $(this),
				id       = '#' + $this.attr('href').split('#').pop(),
				duration = 1;
		
		e.preventDefault();
		
		if ((!$(id).length) || ($this.parent('li').hasClass('active')))
			return false;
		
		link.closest('li').removeClass('active');
		
		if (!menu.find('.btn-navbar').hasClass('collapsed'))
			menu.find('.btn-navbar').trigger('click');
		
		if (!landing) {
			finishAnimation();
		
			$('.article.active [data-animation-out]').each(function(){
				var $this = $(this);
				
				if ($this.data('animationOutDelay')){
					if ($this.data('animationOutDelay') >= duration)
						duration = $this.data('animationOutDelay');
				}
			});
			
			$('body').find('.preloader').delay(duration + 500).fadeIn(400, function() {
				document.location.hash = id;
				
				$('html, body').animate({scrollTop: 0}, 0);
				
				$('.article').removeClass('active');
				
				$(id).addClass('active');
				
				$this.closest('li').addClass('active');
				
				createTimeCicles();
				
				$(this).fadeOut(400);
				
				setTimeout(function(){
					startAnimation();
				}, 0);
			});
		} else {
			$this.closest('li').addClass('active');
			
			if ($(id).length) {
				$('html, body').animate({
					scrollTop: $(id).offset().top - headerH
				}, 600);
			}
		}
  });
	
	if (landing)
		$(document).on('scroll', onScroll);
	
	function onScroll(){
		var scrollPos = $(document).scrollTop();
		
		link.each(function () {
			var currLink = $(this),
					refElement;
			
			if ($(currLink.attr('href')).length) {
				refElement = $(currLink.attr('href'));
				
				if (
				refElement.position().top - headerH - 1 <= scrollPos &&
				refElement.position().top + refElement.outerHeight() > scrollPos) {
					link.closest('li').removeClass('active');
					currLink.closest('li').addClass('active');
				} else {
					currLink.closest('li').removeClass('active');
				}
			}
		});
	}
	
  $('[href="'+ hash +'"]').trigger('click');
}

//Start Animation
function startAnimation(){
  var activeSection = $('.article.active');
	
  activeSection.find('[data-animation]').each(function(){
		var $this     = $(this),
				delay     = 100,
				animation = 'bounceIn';

		if ($this.data('animation'))
			animation = $this.data('animation');
		
		if ($this.data('animationDelay'))
			delay = $this.data('animationDelay');
	
		$this.css('animation-delay', delay + 'ms').addClass('animated').addClass(animation);
  });
}

//Stop Animation
function finishAnimation(){
  var duration = 1;

  $('[data-animation-out]').each(function(){
		var $this        = $(this),
				animation    = 'bounceIn',
				animationOut = 'bounceOut',
				delay        = 100,
				outDelay     = 1;
	
		if ($this.data('animation'))
			animation = $this.data('animation');
		
		if ($this.data('animationOut'))
			animationOut = $this.data('animationOut');
		
		if ($this.data('animationDelay'))
			delay = $this.data('animationDelay');
		
		if ($this.data('animationOutDelay'))
			outDelay = $this.data('animationOutDelay');
	
		$this.css('animation-delay', delay + 'ms');

		if ($this.closest('.article').hasClass('active')){
			if (outDelay >= duration)
				duration = outDelay;

			$this.removeClass(animation).addClass(animationOut);
			
			if ($this.data('animationOutDelay'))
				$this.css('animation-delay', outDelay + 'ms');
			else
				$this.css('animation-delay', '1ms');
		} else {
			$this.removeClass(animation).removeClass(animationOut).removeAttr('style', 'animation-delay');
		}
  });
}

//Carousels
function carousels() {
	var carousel = $('.carousel');
	
	if (carousel.length) {
		carousel.each(function(){
			var $this      = $(this),
					rtl        = false,
					responsive = {0 : {items : 1}, 768 : { items : 3}, 992 : { items : 4}};
			
			if ($this.data('rtl'))
				rtl = $this.data('rtl');
				
			if ($this.data('responsive'))
				responsive = $this.data('responsive');
			
			$this.owlCarousel({
				rtl        : rtl,
				autoplay   : false,
				loop       : true,
				nav        : true,
				margin     : 15,
				responsive : responsive
			});
		});
	}
}

//Team
function team() {
	if(!isTouchDevice) {
		$('.employee').on({
			mouseenter: function(e) {
				e.preventDefault();
	
				$(this).addClass('hover');
			}, mouseleave: function(e) {
				e.preventDefault();
	
				$(this).removeClass('hover');
			}
		});
	}

	$('body').on('touchstart', function (e) {
		e.stopPropagation();

		if ($(e.target).parents('.employee').length === 0)
			$('.employee').removeClass('hover');
	});

	$('.employee').on('touchend', function(){
		if ($(this).hasClass('hover')) {
			$(this).removeClass('hover');
		} else {
			$('.employee').removeClass('hover');
			$(this).addClass('hover');
		}
  });
}

//Preloader
function loaderOut(){
	$('body').addClass('loaded').find('.preloader').fadeOut(400);
}

$(document).ready(function(){
	if (!$('.article.active').length)
		$('.article').first().addClass('active');
	
	if (isTouchDevice)
		$('.background-video').remove();
	
  //Functions
	createTimeCicles();
	backgroundSlider();
	youtubeVideoBg();
	if ($('.background-constellation').length) constellationBg();
	if ($('.background-slider').length) backgroundSlider();
	if ($('.background-video').length) youtubeVideoBg();
	headerMenu();
	
	$(window).load(function(){
		startAnimation();
		if ($('.background-video').length) htmlVideoBg();
		loaderOut();
		carousels();
		team();
  });
	
	//Contact Form
  $('.contact-form').on('submit', function(e){
		var form = $(this);
		
		e.preventDefault();
		
		$.ajax({
			type: 'POST',
			url : 'php/contact.php',
			data: form.serialize(),
			success: function(data){
				form.find('.form-message').html(data).fadeIn();
				
				form.find('.btn').prop('disabled', true);
					
				if ($(data).is('.send-true')){
					setTimeout(function(){
						form.trigger('reset');
						
						form.find('.btn').prop('disabled', false);
						
						form.find('.form-message').fadeOut().delay(500).queue(function(){
							form.find('.form-message').html('').dequeue();
						});
					}, 2000);
				} else {
					form.find('.btn').prop('disabled', false);
				}
			}
		});
  });
	
	//Subscribe
	$('.subscribe').on('submit', function(e){
		var form           = $(this),
				message        = form.find('.form-message'),
				messageSuccess = 'Your email is sended',
				messageInvalid = 'Please enter a valid email address',
				messageSigned  = 'This email is already signed',
				messageErrore  = 'Error request';
		
		e.preventDefault();
		
    $.ajax({
      url     : 'php/notify-me.php',
      type    : 'POST',
      data    : form.serialize(),
      success : function(data){
				form.find('.btn').prop('disabled', true);
				
				message.removeClass('text-danger').removeClass('text-success').fadeIn();
				
				switch(data) {
					case 0:
						message.html(messageSuccess).addClass('text-success').fadeIn();
					
						setTimeout(function(){
							form.trigger('reset');
							
							message.fadeOut().delay(500).queue(function(){
								message.html('').dequeue();
							});
						}, 2000);
						
						break;
					case 1:
						message.html(messageInvalid).addClass('text-danger').fadeIn();
						
						break;
					case 2:
						message.html(messageSigned).addClass('text-danger').fadeIn();
						
						setTimeout(function(){
							form.trigger('reset');

							message.fadeOut().delay(500).queue(function(){
								message.html('').dequeue();
							});
						}, 2000);
						
						break;
					default:
						message.html(messageErrore).addClass('text-danger').fadeIn();
				}
				
				form.find('.btn').prop('disabled', false);
      }
    });
  });
	
	//Pop up
	$('.image-link:not(".gallery")').magnificPopup({ 
		type : 'image',
		mainClass : 'mfp-with-zoom',
		zoom : {
			enabled : true,
			duration : 300
		},
		callbacks: {
			elementParse: function(item) {
				if($(item.el.context).hasClass('video-link')) {
					item.type = 'iframe';
				} else {
					item.type = 'image';
				}
			}
		}
	});
	$('.gallery').magnificPopup({ 
		type : 'image',
		mainClass : 'mfp-with-zoom',
		zoom : {
			enabled : true,
			duration : 300
		},
		gallery: {
      enabled : true
    },
		callbacks: {
			elementParse: function(item) {
				if($(item.el.context).hasClass('video-link')) {
					item.type = 'iframe';
				} else {
					item.type = 'image';
				}
			}
		}
	});
});

//Window Resize
(function() {
	var delay = (function(){
		var timer = 0;
		return function(callback, ms){
			clearTimeout (timer);
			timer = setTimeout(callback, ms);
		};
  })();
	
	//Functions
  function resizeFunctions() {
		createTimeCicles();
		if ($('.background-video').length) htmlVideoBg();
  }

  if(isTouchDevice) {
		$(window).bind('orientationchange', function() {
			delay(function(){
				resizeFunctions();
			}, 50);
		});
  } else {
		$(window).on('resize', function() {
			delay(function(){
				resizeFunctions();
			}, 50);
		});
  }
}());