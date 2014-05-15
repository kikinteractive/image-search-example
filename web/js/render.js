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

var renderResults = function (currentTime, images, query) {

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
  layoutResults();

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
        layoutResults();
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
        layoutResults(); //TODO: is this janky?
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

  renderResults(currentTime, images, query);
};
