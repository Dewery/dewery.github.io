;(function ($, window) {
  if ($('.background-video').length) {
    // defaults
    var defaults = {
        ratio: 16/9, // usually either 4/3 or 16/9 -- tweak as needed
        videoId: 'ZCAnLxRvNNc', // toy robot in space is a good default, no?
        mute: true,
        repeat: true,
        width: $(window).width(),
        wrapperZIndex: 'inherit',
        playButtonClass: 'tubular-play',
        pauseButtonClass: 'tubular-pause',
        muteButtonClass: 'tubular-mute',
        volumeUpClass: 'tubular-volume-up',
        volumeDownClass: 'tubular-volume-down',
        increaseVolumeBy: 10,
        start: 0,
        container: $('.section')
    };
    // methods
    var tubular = function(node, options) { // should be called on the wrapper div
      var options = $.extend({}, defaults, options),
          $body = options.container, // cache body node
          $node = $(node); // cache wrapper node
      // build container
      var tubularContainer = '<div class="tubular-container"><div id="tubular-player" class="tubular-player"/></div>';
      // set up css prereq's, inject tubular container and set up wrapper defaults
      $body.prepend(tubularContainer);
      $node.css({position: 'relative'});
      // set up iframe player, use global scope so YT api can talk
      window.player;
      window.onYouTubeIframeAPIReady = function() {
        player = new YT.Player('tubular-player', {
          width: options.width,
          height: Math.ceil(options.width / options.ratio),
          videoId: options.videoId,
          playerVars: {
            controls: 0,
            showinfo: 0,
            modestbranding: 1,
            wmode: 'transparent'
          },
          events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
          }
        });
      }
      window.onPlayerReady = function(e) {
        resize();
        if (options.mute) e.target.mute();
        e.target.seekTo(options.start);
        e.target.playVideo();
      }
      window.onPlayerStateChange = function(state) {
        if (state.data === 0 && options.repeat) { // video ended and repeat option is set true
          player.seekTo(options.start); // restart
        }
      }
      // resize handler updates width, height and offset of player after resize/init
      var resize = function() {
        var width = $(window).width(),
            pWidth, // player width, to be defined
            height = $(window).height(),
            pHeight, // player height, tbd
            $tubularPlayer = $('#tubular-player');
        // when screen aspect ratio differs from video, video must center and underlay one dimension
        if (width / options.ratio < height) { // if new video height < window height (gap underneath)
          pWidth = Math.ceil(height * options.ratio); // get new player width
          $tubularPlayer.width(pWidth).height(height).css({left: (width - pWidth) / 2, top: 0}); // player width is greater, offset left; reset top
        } else { // new video width < window width (gap to right)
          pHeight = Math.ceil(width / options.ratio); // get new player height
          $tubularPlayer.width(width).height(pHeight).css({left: 0, top: (height - pHeight) / 2}); // player height is greater, offset top; reset left
        }
      }
      // events
      $(window).on('resize.tubular', function() {
        resize();
      })
      $('body').on('click','.' + options.playButtonClass, function(e) { // play button
        e.preventDefault();
        player.playVideo();
      }).on('click', '.' + options.pauseButtonClass, function(e) { // pause button
        e.preventDefault();
        player.pauseVideo();
      }).on('click', '.' + options.muteButtonClass, function(e) { // mute button
        e.preventDefault();
        (player.isMuted()) ? player.unMute() : player.mute();
      }).on('click', '.' + options.volumeDownClass, function(e) { // volume down button
        e.preventDefault();
        var currentVolume = player.getVolume();
        if (currentVolume < options.increaseVolumeBy) currentVolume = options.increaseVolumeBy;
        player.setVolume(currentVolume - options.increaseVolumeBy);
      }).on('click', '.' + options.volumeUpClass, function(e) { // volume up button
        e.preventDefault();
        if (player.isMuted()) player.unMute(); // if mute is on, unmute
        var currentVolume = player.getVolume();
        if (currentVolume > 100 - options.increaseVolumeBy) currentVolume = 100 - options.increaseVolumeBy;
        player.setVolume(currentVolume + options.increaseVolumeBy);
      })
    }
    // load yt iframe js api
    var tag = document.createElement('script');
    tag.src = "//www.youtube.com/iframe_api";
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    // create plugin
    $.fn.tubular = function (options) {
      return this.each(function () {
        if (!$.data(this, 'tubular_instantiated')) { // let's only run one
          $.data(this, 'tubular_instantiated', 
          tubular(this, options));
        }
      });
    }
  }
})(jQuery, window);

(function ($, window) {
	/**
	 * Makes a nice constellation on canvas
	 * @constructor Constellation
	 */
	function Constellation (canvas, options) {
		var $canvas = $(canvas),
        context = canvas.getContext('2d'),
        defaults = {
          star: {
            color: 'rgba(255, 255, 255, .5)',
            width: 1
          },
          line: {
            color: 'rgba(255, 255, 255, .5)',
            width: 0.5
          },
          position: {
            x: 0, // This value will be overwritten at startup
            y: 0 // This value will be overwritten at startup
          },
          width: window.innerWidth,
          height: window.innerHeight,
          velocity: 0.1,
          length: 150,
          distance: 120,
          radius: 150,
          stars: []
        },
        config = $.extend(true, {}, defaults, options);
    
		function Star () {
			this.x = Math.random() * canvas.width;
			this.y = Math.random() * canvas.height;
			this.vx = (config.velocity - (Math.random() * 0.5));
			this.vy = (config.velocity - (Math.random() * 0.5));
			this.radius = Math.random() * config.star.width;
		}

		Star.prototype = {
			create: function(){
				context.beginPath();
				context.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
				context.fill();
			},
			animate: function(){
				var i;
				for (i = 0; i < config.length; i++) {
					var star = config.stars[i];

					if (star.y < 0 || star.y > canvas.height) {
						star.vx = star.vx;
						star.vy = - star.vy;
					} else if (star.x < 0 || star.x > canvas.width) {
						star.vx = - star.vx;
						star.vy = star.vy;
					}
					star.x += star.vx;
					star.y += star.vy;
				}
			},
			line: function(){
				var length = config.length,
            iStar,
            jStar,
            i,
            j;

				for (i = 0; i < length; i++) {
					for (j = 0; j < length; j++) {
						iStar = config.stars[i];
						jStar = config.stars[j];

						if (
							(iStar.x - jStar.x) < config.distance &&
							(iStar.y - jStar.y) < config.distance &&
							(iStar.x - jStar.x) > - config.distance &&
							(iStar.y - jStar.y) > - config.distance
						) {
							if (
								(iStar.x - config.position.x) < config.radius &&
								(iStar.y - config.position.y) < config.radius &&
								(iStar.x - config.position.x) > - config.radius &&
								(iStar.y - config.position.y) > - config.radius
							) {
								context.beginPath();
								context.moveTo(iStar.x, iStar.y);
								context.lineTo(jStar.x, jStar.y);
								context.stroke();
								context.closePath();
							}
						}
					}
				}
			}
		};
		this.createStars = function () {
			var length = config.length,
          star,
          i;

			context.clearRect(0, 0, canvas.width, canvas.height);

			for (i = 0; i < length; i++) {
				config.stars.push(new Star());
				star = config.stars[i];
				star.create();
			}
			star.line();
			star.animate();
		};

		this.setCanvas = function () {
			canvas.width = config.width;
			canvas.height = config.height;
		};
		this.setContext = function () {
			context.fillStyle = config.star.color;
			context.strokeStyle = config.line.color;
			context.lineWidth = config.line.width;
		};
		this.setInitialPosition = function () {
			if (!options || !options.hasOwnProperty('position')) {
				config.position = {
					x: canvas.width * 0.5,
					y: canvas.height * 0.5
				};
			}
		};
		this.loop = function (callback) {
			callback();
			window.requestAnimationFrame(function () {
				this.loop(callback);
			}.bind(this));
		};
		this.bind = function () {
			$('body').on('mousemove', function(e){
				config.position.x = e.pageX - $canvas.offset().left;
				config.position.y = e.pageY - $canvas.offset().top;
			});
      $('body').on('touchmove', function(e){
				config.position.x = e.originalEvent.targetTouches[0].pageX - $canvas.offset().left;
				config.position.y = e.originalEvent.targetTouches[0].pageY - $canvas.offset().top;
			});
		};
		this.init = function () {
			this.setCanvas();
			this.setContext();
			this.setInitialPosition();
			this.loop(this.createStars);
			this.bind();
		};
	}

	$.fn.constellation = function (options) {
		return this.each(function () {
			var c = new Constellation(this, options);
			c.init();
		});
	};
})($, window);