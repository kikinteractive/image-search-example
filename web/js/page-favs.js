/**
 * This file defines the controller for the favorite image page.
 */

App.controller('favs', function (page) {

  var resultTmpl  = page.querySelector('.result');

  if ( Saved.list().length ) {
    // If there are favorite images, show them
    showResults(page, null, resultTmpl, Saved.list());
  } else {
    // Show empty placeholder otherwise
    showPlaceholder(page, 'empty');
  }

  // Clear up rendered images
  resultTmpl.parentNode.removeChild(resultTmpl);

  page.addEventListener('appLayout', function () {
    layoutResults(page);
  });

  // Re-renders images when a new one is favored/unfavored
  Saved.on('update', function () {
    if ( Saved.list().length ) {
      showResults(page, null, resultTmpl, Saved.list());
    } else {
      showPlaceholder(page, 'favs');
    }
  });

});
