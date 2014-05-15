(function (kik, App) {

  // Locks the app in portrait mode
  if (kik.browser && kik.browser.setOrientationLock) {
    kik.browser.setOrientationLock('portrait');
  }

  if (kik.message) {
    // If app is opened from a Kik message, go directly to the image viewer
    // page to view the image.
    App.load('viewer', { image: kik.message });
  } else {
    try {
      // Go back to the page that you were at for Image Search
      App.restore();
    } catch (err) {
      // Go to the search page by default
      App.load('search');
    }
  }

})(kik, App);
