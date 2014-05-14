var API = function () {
  //TODO: alternate url
  var API_URL = 'https://image-search-backend.appspot.com',
      TIMEOUT = 25 * 1000; // in milliseconds

  return function (resource, data, callback) {
    var url  = API_URL + resource;
    $.ajax({
      type: "POST",
      url: url,
      data: JSON.stringify(data || {}),
      dataType: "jsonp",
      timeout: TIMEOUT,
      crossDomain: true,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      success: function (data) {
        console.log(data);
      },
      error: function (request, status, err) {
        console.log(request);
        console.log(status);
        console.log(err);
      }
    });
  };

}();
