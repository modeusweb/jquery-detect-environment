(function ($) {
  $.fn.detectEnvironment = function () {
    const $html = $('html');

    // Helper function to add a class if a condition is met
    const addClassIf = (condition, className) => {
      if (condition) $html.addClass(className);
    };

    // Remove existing environment-related classes
    $html.removeClass((_, className) =>
      (
        className.match(
          /\b(env|device|os|width|orientation|browser|status|time|region|user|pixel|prefers|page)-\S+/g,
        ) || []
      ).join(' '),
    );

    // Device Type Detection
    const isMobile = /Mobi|Android/i.test(navigator.userAgent);
    $html.addClass(isMobile ? 'device-mobile' : 'device-desktop');

    // Operating System Detection
    const ua = navigator.userAgent;
    addClassIf(ua.includes('Win'), 'os-windows');
    addClassIf(ua.includes('Mac'), 'os-macos');
    addClassIf(ua.includes('Linux'), 'os-linux');
    addClassIf(/Android/i.test(ua), 'os-android');
    addClassIf(/iPhone|iPad|iPod/i.test(ua), 'os-ios');

    // Window Width Detection (Bootstrap-based breakpoints)
    const width = $(window).width();
    const widthClasses = [
      { max: 576, className: 'width-xs' },
      { max: 768, className: 'width-sm' },
      { max: 992, className: 'width-md' },
      { max: 1200, className: 'width-lg' },
    ];
    const widthClass = widthClasses.find((w) => width < w.max) || {
      className: 'width-xl',
    };
    $html.addClass(widthClass.className);

    // Screen Orientation Detection
    const isPortrait = window.matchMedia('(orientation: portrait)').matches;
    $html.addClass(
      isPortrait ? 'orientation-portrait' : 'orientation-landscape',
    );

    // Browser Detection
    addClassIf(ua.includes('Chrome'), 'browser-chrome');
    addClassIf(ua.includes('Firefox'), 'browser-firefox');
    addClassIf(
      ua.includes('Safari') && !ua.includes('Chrome'),
      'browser-safari',
    );
    addClassIf(ua.includes('Edge'), 'browser-edge');

    // Internet Connectivity Detection
    $html.addClass(navigator.onLine ? 'status-online' : 'status-offline');

    // Time of Day Detection
    const hour = new Date().getHours();
    if (hour >= 6 && hour < 12) {
      $html.addClass('time-morning');
    } else if (hour >= 12 && hour < 18) {
      $html.addClass('time-afternoon');
    } else if (hour >= 18 && hour < 24) {
      $html.addClass('time-evening');
    } else {
      $html.addClass('time-night');
    }

    // Color Scheme Preference Detection
    const prefersDarkMode =
      window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches;
    $html.addClass(
      prefersDarkMode ? 'prefers-dark-mode' : 'prefers-light-mode',
    );

    // Pixel Density Detection
    const pixelRatio = window.devicePixelRatio;
    $html.addClass(
      pixelRatio >= 3
        ? 'pixel-ratio-3x'
        : pixelRatio >= 2
          ? 'pixel-ratio-2x'
          : 'pixel-ratio-1x',
    );

    return this;
  };

  // Initialize on document ready and add event listeners
  $(function () {
    $('html').detectEnvironment();
    $(window).on('resize orientationchange', function () {
      $('html').detectEnvironment();
    });

    window.addEventListener('online', function () {
      $('html').addClass('status-online').removeClass('status-offline');
    });
    window.addEventListener('offline', function () {
      $('html').addClass('status-offline').removeClass('status-online');
    });
  });
})(jQuery);
