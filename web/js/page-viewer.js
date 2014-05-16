App.controller('viewer', function (page, data) {

  var $title = page.querySelector('.app-title'),
      query  = (data.query || data.image.query),
      urls;

  // Set app's current title to the search query
  if (query) {
    $title.childNodes[1].textContent = query;
  }

  if (data.images) {
    // If search result has a list of images
    if (data.badImages) {
      // Filter out the bad images (errored, link doesn't work)
      data.images = data.images.filter(function (image, index) {
        return (!data.badImages || (data.badImages.indexOf(index) === -1) || (data.index === index));
      });
      var newIndex = data.index;
      data.badImages.forEach(function (i) {
        if (i < data.index) {
          newIndex--;
        }
      });
      data.index = newIndex;
      data.badImages = null;
    }
    // Returns urls of the good images
    urls = data.images.map(function (image) {
      return image.url;
    });
  } else {
    // If a single image is sent from a Kik message, return url of a that image
    urls = [ data.image.url ];
  }

  // Create a Kik photo viewer
  var photoViewer = new PhotoViewer(page, urls, {
    automaticTitles : false ,
    autoHideTitle   : true ,
    startAt         : (data.index || 0)
  });

  if (data.images) {
    // When the user flips to the next/previous photo in the photo viewer
    photoViewer.on('flip', function (newIndex) {
      data.index = newIndex;
      // Displays the heart icon
      setHeartIcon();
      App.saveStack();
    });
  }

  // Set app title width when orientation changes, window resizes and page
  page.addEventListener('appLayout', function () {
    var diff = (App.platform === 'android' ? 132 : 188);
    $title.style.width = (window.innerWidth-diff) + 'px';
  });

  // Displays the heart icon
  setHeartIcon();

  // Trigger event when the Back button is clicked
  page.querySelector('.app-button.left')
    .addEventListener('click', function () {
      var lastPage = App.getStack()[0];
      // Go back to the search page if the previous page is not search
      if (!lastPage || (lastPage[0] !== 'search')) {
        App.load('search', App.getReverseTransition());
        App.removeFromStack(0);
      }
    });

  // Trigger event when the Kik button is clicked
  page.querySelector('.app-button.kik')
    .addEventListener('click', function () {
      // Prompts to install Kik if Kik is not installed
      if ( !kik.send ) {
        App.dialog({
          title        : 'Install Kik' ,
          text         : 'This is a feature of Kik Messenger. Install it to share images.' ,
          okButton     : 'Install' ,
          cancelButton : 'Cancel'
        }, function (status) {
          if (status) {
            var os = kik.utils.os;
            if (os.ios) {
              window.location.href = 'itms-apps://itunes.apple.com/app/kik-messenger/id357218860';
            } else if (os.android) {
              window.location.href = 'market://details?id=kik.android';
            } else {
              window.location.href = 'http://kik.com';
            }
          }
        });
        return;
      }
      // Send Kik message with the image
      var image = data.images ? data.images[data.index] : data.image;
      image.query = query;
      kik.send({
        pic   : image.url      ,
        big   : true           ,
        data  : image
      });
    });

  // Favors/unfavors the image when the heart icon is clicked
  page.querySelector('.app-button.heart')
    .addEventListener('click', function () {
      var image = data.images ? data.images[data.index] : data.image;
      Saved.toggle(image);
      setHeartIcon();
    });

  // Display the favorite heart icon depending on whether an image is favored
  // (saved in web storage) or not
  function setHeartIcon () {
    var image = data.images ? data.images[data.index] : data.image;
    if (Saved.has(image)) {
      page.querySelector('.app-button.heart').classList.add('fav');
    } else {
      page.querySelector('.app-button.heart').classList.remove('fav');
    }
  };

});
