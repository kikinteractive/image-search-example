App.controller('favs', function (page) {
  var content     = page.querySelector('.app-content'),
      results     = page.querySelector('.results'),
      placeholder = page.querySelector('.placeholder'),
      loader      = page.querySelector('.loader'),
      imageList   = page.querySelector('.image-list'),
      resultTmpl  = page.querySelector('.result'),
      currentTime;

  if ( Saved.list().length ) {
    showResults(Saved.list());
  } else {
    showPlaceholder(page, 'empty');
  }

  resultTmpl.parentNode.removeChild(resultTmpl);

  page.addEventListener('appLayout', function () {
    layoutResults();
  }, false);

  Saved.on('update', function () {
    if ( Saved.list().length ) {
      showResults(Saved.list());
    } else {
      showPlaceholder(page, 'favs');
    }
  });

  function showLoader() {
    placeholder.classList.remove('active');
    loader.classList.add('active');
    imageList.classList.remove('active');
  }

  function showResults(images) {
    if ( !images ) {
      showPlaceholder(page, 'error');
      return;
    }
    if ( !images.length ) {
      showPlaceholder(page, 'empty');
      return;
    }

    placeholder.classList.remove('active');
    loader.classList.remove('active');
    imageList.classList.add('active');

    renderResults(images);
  }

  function renderResults(images) {
    if (imageList.childNodes) {
      for (var child; child=imageList.childNodes[0];) {
        child.parentNode.removeChild(child);
      }
    }

    var renderTime = currentTime,
        numImages  = images.length,
        badImages  = [];

    images.forEach(function (image, index) {
      renderImage(image, index);
    });

    layoutResults();

    function renderImage(image, index) {
      var result = resultTmpl.cloneNode(true),
          img    = result.querySelector('img');

      result.setAttribute('data-height', image.height+'');
      result.setAttribute('data-width' , image.width +'');
      imageList.appendChild(result);

      var start = +new Date();

      img.onload = function () {
        img.onload = img.onerror = null;

        if ((App.platform !== 'ios') || (+new Date()-start < 50)) {
          img.classList.add('visible');
          return;
        }

        img.classList.add('animated');
        setTimeout(function () {
          img.classList.add('visible');
          setTimeout(function () {
            img.classList.remove('animated');
          }, 400);
        }, 10);
      };

      img.onerror = function () {
        img.onload = img.onerror = null;
        badImages.push(index);
        if (result.parentNode) {
          result.parentNode.removeChild(result);
          layoutResults(); //TODO: is this janky?
        }
      };

      img.src = image.url;

      Clickable.sticky(img, function (unlock) {
        App.load('viewer', {
          image     : image  ,
          index     : index  ,
          images    : images ,
          badImages : badImages
        }, unlock);
      });
    }
  }

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
