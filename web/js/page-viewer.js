App.controller('viewer', function (page, data) {

  var $title = page.querySelector('.app-title'),
      query  = (data.query || data.image.query),
      urls;

  if (query) {
    $title.childNodes[1].textContent = query;
  }

  if (data.images) {
    if (data.badImages) {
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
    urls = data.images.map(function (image) {
      return image.url;
    });
  } else {
    urls = [ data.image.url ];
  }

  var photoViewer = new PhotoViewer(page, urls, {
    automaticTitles : false ,
    autoHideTitle   : true ,
    startAt         : (data.index || 0)
  });

  if (data.images) {
    photoViewer.on('flip', function (newIndex) {
      data.index = newIndex;
      setHeartIcon();
      App.saveStack();
    });
  }

  page.addEventListener('appLayout', function () {
    var diff = (App.platform === 'android' ? 132 : 188);
    $title.style.width = (window.innerWidth-diff) + 'px';
  }, false);

  setHeartIcon();

  page.querySelector('.app-button.left')
    .addEventListener('click', function () {
      var lastPage = App.getStack()[0];
      if (!lastPage || (lastPage[0] !== 'search')) {
        App.load('search', App.getReverseTransition());
        App.removeFromStack(0);
      }
    }, false);

  page.querySelector('.app-button.kik')
    .addEventListener('click', function () {
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

      var image = data.images ? data.images[data.index] : data.image;
      image.query = query;
      kik.send({
        pic   : image.url      ,
        big   : true           ,
        data  : image
      });
    }, false);

  page.querySelector('.app-button.heart')
    .addEventListener('click', function () {
      var image = data.images ? data.images[data.index] : data.image;
      Saved.toggle(image);
      setHeartIcon();
    }, false);

  function setHeartIcon() {
    var image = data.images ? data.images[data.index] : data.image;

    if (Saved.has(image)) {
      page.querySelector('.app-button.heart').classList.add('fav');
    } else {
      page.querySelector('.app-button.heart').classList.remove('fav');
    }
  };

});
