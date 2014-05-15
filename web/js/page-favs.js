App.controller('favs', function (page) {
  var resultTmpl  = page.querySelector('.result'),
      currentTime;

  if ( Saved.list().length ) {
    showResults(page, currentTime, resultTmpl, Saved.list());
  } else {
    showPlaceholder(page, 'empty');
  }

  resultTmpl.style.display = 'none';
  //resultTmpl.parentNode.removeChild(resultTmpl);

  page.addEventListener('appLayout', function () {
    layoutResults(page);
  });

  Saved.on('update', function () {
    if ( Saved.list().length ) {
      showResults(page, currentTime, resultTmpl, Saved.list());
    } else {
      showPlaceholder(page, 'favs');
    }
  });

});
