var Saved = function () {

  // Keys to use for the HTML5 web storage
  var SAVED_KEY = '__IMAGE_SAVED_CACHE__';

  // Bind functions to Kik events
  var saved = kik.events({
    list   : getList     ,
    toggle : toggleSaved ,
    has    : isSaved     ,
  });
  return saved;

  // Get cached image from web storage
  function getCache () {
    try {
      return JSON.parse( localStorage[SAVED_KEY] );
    } catch (err) {
      return {};
    }
  };

  // Cache image in web storage
  function setCache (cache) {
    localStorage[SAVED_KEY] = JSON.stringify(cache);
  };

  // Get list of cached images
  function getList () {
    var cache  = getCache(),
        images = [];
    for (var i in cache) {
      images.push( cache[i] );
    }
    return images;
  };

  // Toggle whether an image is favored or not
  function toggleSaved (image) {
    var cache = getCache();
    if (image.url in cache) {
      delete cache[image.url];
    } else {
      cache[image.url] = image;
    }
    setCache(cache);
    saved.trigger('update');
  };

  // Check if image is already in the web storage
  function isSaved (image) {
    return image.url in getCache();
  };

}();
