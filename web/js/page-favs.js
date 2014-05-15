App.controller('favs', function (page) {

  var resultTmpl  = page.querySelector('.result');

  if ( Saved.list().length ) {
    showResults(page, null, resultTmpl, Saved.list());
  } else {
    showPlaceholder(page, 'empty');
  }

  resultTmpl.parentNode.removeChild(resultTmpl);

  page.addEventListener('appLayout', function () {
    layoutResults(page);
  });

  Saved.on('update', function () {
    if ( Saved.list().length ) {
      showResults(page, null, resultTmpl, Saved.list());
    } else {
      showPlaceholder(page, 'favs');
    }
  });

});
