(function (kik, App) {

  if (kik.browser && kik.browser.setOrientationLock) {
    kik.browser.setOrientationLock('portrait');
  }

  if (kik.message) {
    App.load('viewer', { image: kik.message });
  } else {
    try {
      App.restore();
    } catch (err) {
      App.load('search');
    }
  }

})(kik, App);
