window.onload = function() {
  var CLIENT_ID = '1e860423b3d54b09101c9fd7c1a225fa14b32dd2a0b7da56f10914c9e5c044f1';
  var CLIENT_SECRET = '20c6d35ced31cca65ae3cbbf5ab6aa3fe786297bb774d60b9188495617266874';
  var REDIRECT_URI = 'https://ljcjhaejllpbeiamjnbldcngmjjoihln.chromiumapp.org/vyrtex-chrome-extension';
  var BASE_URI = 'http://localhost:3000/'

  function htmlEncode(value){
    return $('<div/>').text(value).html();
  }

  function exchangeCodeForToken(code) {
    data = {
      client_id: CLIENT_ID,
      grant_type: 'authorization_code',
      redirect_uri: REDIRECT_URI,
      code: code
    }

    $.ajax({
      type: 'POST',
      beforeSend: function(request) {
        request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        request.setRequestHeader('Accept', 'application/json');
        request.setRequestHeader('Authorization', 'Basic ' + btoa(CLIENT_ID + ':' + CLIENT_SECRET));
      },
      url: BASE_URI + 'oauth/token',
      data: data
    }).done(function(response) {
      chrome.storage.sync.set({'access_token': response.access_token}, function() {
        console.log(response.access_token)
        window.location.href = 'quick-add.html';
      });
    }).fail(function(response) {
      console.log(response);
    });
  }

  $("#login").click(function(event) {
    console.log("Click");
    chrome.identity.launchWebAuthFlow(
    {'url': BASE_URI + 'oauth/authorize?client_id=' + CLIENT_ID + '&redirect_uri=' + htmlEncode(REDIRECT_URI) + '&response_type=code', 'interactive': true},
    function(redirect_url) { 
       var code = redirect_url.substring(redirect_url.indexOf("=") + 1, redirect_url.length );
       exchangeCodeForToken(code);
    });
  });
}