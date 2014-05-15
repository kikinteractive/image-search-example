App.controller('search', function (page) {
  var INPUT_KEY  = '__SEARCH_INPUT__',
      SEARCH_KEY = '__SEARCH_QUERY__';

  var pageManager = this,
      content     = page.querySelector('.app-content'),
      form        = page.querySelector('form'),
      input       = page.querySelector('form .app-input'),
      results     = page.querySelector('.results'),
      placeholder = page.querySelector('.placeholder'),
      loader      = page.querySelector('.loader'),
      imageList   = page.querySelector('.image-list'),
      resultTmpl  = page.querySelector('.result'),
      cache       = {},
      currentQuery, currentTime;

  resultTmpl.parentNode.removeChild(resultTmpl);

  showPlaceholder(page);

  if (this.restored) {
    input.value = localStorage[INPUT_KEY] || '';
    if ( localStorage[SEARCH_KEY] ) {
      performSearch( localStorage[SEARCH_KEY] );
    }
  }

  input.addEventListener('keyup', function () {
    localStorage[INPUT_KEY] = input.value;
  }, false);
  input.addEventListener('change', function () {
    localStorage[INPUT_KEY] = input.value;
  }, false);

  page.addEventListener('appLayout', function () {
    layoutResults();
  }, false);

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    performSearch(input.value);
  }, false);

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

  function performSearch(query) {
    query = query.trim();
    if (!query || ( (query === currentQuery) && !placeholder.classList.contains('error') ) ) {
      return;
    }

    input.blur();
    form.blur();

    localStorage[SEARCH_KEY] = query;

    var time = +new Date();
    currentQuery = query;
    currentTime  = time;

    if (query in cache) {
      showResults(page, currentTime, cache[query], query);
      return;
    }

    showLoader(page);

    kik.ready(function () {
      var queryTime = new Date().getTime();
      API('/search/', { q: query }, function (status, images) {
        if (status === 0) {
          if ((currentQuery === query) && (currentTime === time)) {
            showResults(page, currentTime, null, query);
          }
          return;
        }

        cache[query] = images;
        if ((currentQuery === query) && (currentTime === time)) {
          showResults(page, currentTime, images, query);
        }
      });
    });
  }
});
