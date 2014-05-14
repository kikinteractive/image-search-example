var API = function () {
  //TODO: alternate url
  var API_URL = 'https://image-search-backend.appspot.com',
      TIMEOUT = 25 * 1000; // in milliseconds

  return function (resource, data, callback) {
    var url  = API_URL + resource;
    $.post({
      url: url,
      data: data,
      dataType: "json",
      timeout: TIMEOUT,
      crossDomain: true,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      success: function (response, status) {
        console.log(response);
        console.log(status);
      },
      error: function (response, status, err) {
        console.log(request);
        console.log(status);
        console.log(err);
      }
    });
  };

}();
