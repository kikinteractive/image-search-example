var showPlaceholder = function (page, status) {

  var currentPage = page.getAttribute('data-page');

  var placeholder = page.querySelector('.placeholder');
  var loader      = page.querySelector('.loader');
  var imageList   = page.querySelector('.image-list');

  placeholder.classList.add('active');
  loader.classList.remove('active');
  imageList.classList.remove('active');

  if (status === 'error') {
    placeholder.classList.remove(currentPage);
    placeholder.classList.add('error');
    placeholder.innerHTML = '<span></span>Network Error';
  } else if (status === 'empty') {
    placeholder.classList.add(currentPage);
    placeholder.classList.remove('error');
    if (currentPage === 'search') {
      placeholder.innerHTML = '<span></span>No Results';
    } else if (currentPage === 'favs') {
      placeholder.innerHTML = '<span></span>No favorites yet';
    }
  } else {
    placeholder.classList.add(currentPage);
    placeholder.classList.remove('error');
    if (currentPage === 'search') {
      placeholder.innerHTML = '<span></span>Search for Images';
    } else if (currentPage === 'favs') {
      placeholder.innerHTML = '<span></span>No favorites yet';
    }
  }
};

var showLoader = function (page) {

  var placeholder = page.querySelector('.placeholder');
  var loader      = page.querySelector('.loader');
  var imageList   = page.querySelector('.image-list');

  placeholder.classList.remove('active');
  loader.classList.add('active');
  imageList.classList.remove('active');

};

var layoutResults = function (page) {

  var imageList   = page.querySelector('.image-list');

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

  function layoutRow (index, numResults) {
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

    var summedRatios = images.reduce (function (sum, image) {
      var height = parseFloat( image.getAttribute('data-height') ),
          width  = parseFloat( image.getAttribute('data-width' ) );
      return sum + width/height;
    }, 0);

    var imageHeight = availableWidth / summedRatios;
    if (imageHeight < 120) {
      return layoutRow(index, numResults-1);
    }

    images.forEach (function (image, i) {
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

};

var renderResults = function (page, currentTime, images, query) {

  var imageList   = page.querySelector('.image-list');

  if (imageList.childNodes) {
    for (var child; child=imageList.childNodes[0];) {
      child.parentNode.removeChild(child);
    }
  }

  var renderTime = currentTime,
      numImages  = images.length,
      badImages  = [],
      pivot      = numImages; //TODO: can we dynamically load at some point?

  images.slice(0, pivot).forEach(function (image, index) {
    renderImage(image, index, query);
  });
  layoutResults(page);

  content.addEventListener('scroll', loadMoreItems, false);

  function loadMoreItems () {

    var scrollNode    = Scrollable.node(content),
        scrollHeight  = content.scrollHeight,
        contentHeigth = parseInt(content.style.height);
    if (content !== scrollNode) {
      var styles = document.defaultView.getComputedStyle(scrollNode, null);
      scrollHeight = parseInt(styles.height);
    }

    var loadMore = (content._scrollTop()+contentHeigth >= scrollHeight-72);
    if (loadMore || (renderTime !== currentTime)) {
      content.removeEventListener('scroll', loadMoreItems);
    }
    if (loadMore) {
      var newImages = images.slice(pivot);
      if (newImages.length) {
        newImages.forEach(function (image, index) {
          renderImage(image, pivot+index, query);
        });
        layoutResults(page);
      }
    }

  };

  function renderImage (image, index, query) {

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
        layoutResults(page); //TODO: is this janky?
      }
    };

    img.src = image.url;

    Clickable.sticky(img, function (unlock) {
      App.load('viewer', {
        query     : query  ,
        image     : image  ,
        index     : index  ,
        images    : images ,
        badImages : badImages
      }, unlock);
    });

  };

};

var showResults = function (page, currentTime, images, query) {

  if ( !images ) {
    showPlaceholder(page, 'error');
    return;
  }
  if ( !images.length ) {
    showPlaceholder(page, 'empty');
    return;
  }

  var placeholder = page.querySelector('.placeholder');
  var loader      = page.querySelector('.loader');
  var imageList   = page.querySelector('.image-list');

  placeholder.classList.remove('active');
  loader.classList.remove('active');
  imageList.classList.add('active');

  renderResults(page, currentTime, images, query);
};
