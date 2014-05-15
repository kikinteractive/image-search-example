App.controller('search', function (page) {

  var INPUT_KEY  = '__SEARCH_INPUT__',
      SEARCH_KEY = '__SEARCH_QUERY__';

  var form        = page.querySelector('form'),
      input       = page.querySelector('form .app-input'),
      placeholder = page.querySelector('.placeholder'),
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
  });

  input.addEventListener('change', function () {
    localStorage[INPUT_KEY] = input.value;
  });

  page.addEventListener('appLayout', function () {
    layoutResults(page);
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    performSearch(input.value);
  });

  function performSearch(query) {
    query = query.trim();
    if (!query || ( (query === currentQuery) && !placeholder.classList.contains('error') ) ) {
      return;
    }

    input.blur();
    form.blur();

    localStorage[SEARCH_KEY] = query;

    var time = Date.now();
    currentQuery = query;
    currentTime  = time;

    if (query in cache) {
      showResults(page, currentTime, resultTmpl, cache[query], query);
      return;
    }

    showLoader(page);

    kik.ready(function () {
      var queryTime = new Date().getTime();
      API('/search/', { q: query }, function (status, images) {
        if (status === 0) {
          if ((currentQuery === query) && (currentTime === time)) {
            showResults(page, currentTime, resultTmpl, null, query);
          }
          return;
        }

        cache[query] = images;
        if ((currentQuery === query) && (currentTime === time)) {
          showResults(page, currentTime, resultTmpl, images, query);
        }
      });
    });
  };

});
