App.controller('favs', function (page) {
  var content     = page.querySelector('.app-content'),
      results     = page.querySelector('.results'),
      placeholder = page.querySelector('.placeholder'),
      loader      = page.querySelector('.loader'),
      imageList   = page.querySelector('.image-list'),
      resultTmpl  = page.querySelector('.result'),
      currentTime;

  if ( Saved.list().length ) {
    showResults(page, currentTime, Saved.list());
  } else {
    showPlaceholder(page, 'empty');
  }

  resultTmpl.parentNode.removeChild(resultTmpl);

  page.addEventListener('appLayout', function () {
    layoutResults();
  }, false);

  Saved.on('update', function () {
    if ( Saved.list().length ) {
      showResults(page, currentTime, Saved.list());
    } else {
      showPlaceholder(page, 'favs');
    }
  });

  function layoutResults() {
    var resultNodes = [];
    if (imageList.childNodes) {
      for (var i=0, l=imageList.childNodes.length; i<l; i++) {
        resultNodes.push( imageList.childNodes[i] );
      }
    }

    var viewportWidth = window.innerWidth - 16,
        currentIndex  = 0;

    while (currentIndex < resultNodes.length) {
      currentIndex += layoutRow(currentIndex);
    }

    function layoutRow(index, numResults) {
      if ( !numResults ) {
        numResults = Math.min(3, resultNodes.length-index);
      }

      if (numResults === 1) {
        var height = parseFloat( resultNodes[index].getAttribute('data-height') ),
            width  = parseFloat( resultNodes[index].getAttribute('data-width' ) );
        resultNodes[index].style.height = (viewportWidth*height/width) + 'px';
        resultNodes[index].style.width  = viewportWidth + 'px';
        resultNodes[index].style.marginLeft = '0';
        return 1;
      }

      var availableWidth = viewportWidth - 8*(numResults-1),
          images         = resultNodes.slice(index, index+numResults);

      var summedRatios = images.reduce(function (sum, image) {
        var height = parseFloat( image.getAttribute('data-height') ),
            width  = parseFloat( image.getAttribute('data-width' ) );
        return sum + width/height;
      }, 0);

      var imageHeight = availableWidth / summedRatios;
      if (imageHeight < 120) {
        return layoutRow(index, numResults-1);
      }

      images.forEach(function (image, i) {
        var height = parseFloat( image.getAttribute('data-height') ),
            width  = parseFloat( image.getAttribute('data-width' ) );
        image.style.width  = (imageHeight*width/height) + 'px';
        image.style.height = imageHeight + 'px';
        if (i) {
          image.style.marginLeft = '8px';
        } else {
          image.style.marginLeft = '0';
        }
      });
      return numResults;
    }
  }
});
