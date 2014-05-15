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

/*function showPlaceholder(status) {
  placeholder.classList.add('active');
  loader.classList.remove('active');
  imageList.classList.remove('active');

  if (status === 'error') {
    placeholder.classList.remove('favs');
    placeholder.classList.add('error');
    placeholder.innerHTML = '<span></span>Network Error';
  } else if (status === 'empty') {
    placeholder.classList.add('favs');
    placeholder.classList.remove('error');
    placeholder.innerHTML = '<span></span>No favorites yet';
  } else {
    placeholder.classList.add('favs');
    placeholder.classList.remove('error');
    placeholder.innerHTML = '<span></span>No favorites yet';
  }
}*/
