var Saved = function () {

  var SAVED_KEY = '__IMAGE_SAVED_CACHE__';

  var saved = kik.events({
    list   : getList     ,
    toggle : toggleSaved ,
    has    : isSaved     ,
  });
  return saved;

  function getCache() {
    try {
      return JSON.parse( localStorage[SAVED_KEY] );
    } catch (err) {
      return {};
    }
  };

  function setCache(cache) {
    localStorage[SAVED_KEY] = JSON.stringify(cache);
  };

  function getList() {
    var cache  = getCache(),
        images = [];
    for (var i in cache) {
      images.push( cache[i] );
    }
    return images;
  };

  function toggleSaved(image) {
    var cache = getCache();
    if (image.url in cache) {
      delete cache[image.url];
    } else {
      cache[image.url] = image;
    }
    setCache(cache);
    saved.trigger('update');
  };

  function isSaved(image) {
    return image.url in getCache();
  };

}();
