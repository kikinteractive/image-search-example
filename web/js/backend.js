var API = function () {
  //TODO: alternate url
  var API_URL = 'https://image-search-backend.appspot.com',
      TIMEOUT = 25 * 1000; // in milliseconds

  return function (resource, data, callback) {
    var url  = API_URL + resource;
    $.post(url, data, function (data, textStatus, jqXHR) {
      console.log(data);
      console.log(textStatus);
      console.log(jqXHR);
    });
  };

}();
