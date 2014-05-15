App.controller('favs', function (page) {
  var content     = page.querySelector('.app-content'),
      results     = page.querySelector('.results'),
      placeholder = page.querySelector('.placeholder'),
      loader      = page.querySelector('.loader'),
      imageList   = page.querySelector('.image-list'),
      resultTmpl  = page.querySelector('.result'),
      currentTime;

  if ( Saved.list().length ) {
    showResults(page, currentTime, resultTmpl, Saved.list());
  } else {
    showPlaceholder(page, 'empty');
  }

  resultTmpl.parentNode.removeChild(resultTmpl);

  page.addEventListener('appLayout', function () {
    layoutResults(page);
  }, false);

  Saved.on('update', function () {
    if ( Saved.list().length ) {
      showResults(page, currentTime, resultTmpl, Saved.list());
    } else {
      showPlaceholder(page, 'favs');
    }
  });

});
