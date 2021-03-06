window.onload = function() {
  var CLIENT_ID = '6ebbc8bd124a2243e07fb0603b1d88858c4bf8040f4ef133738281220bb7ecb1';
  var CLIENT_SECRET = '6a12f115b888968aefc69ea7a4ad165d4fd9f0ddd25064ae51deb2ba31ccbf9e';
  var REDIRECT_URI = 'https://mpngmaeikidoddalmljkgnoeeghjpajp.chromiumapp.org/vyrtex-chrome-extension';
  var BASE_URI = 'http://beta.vyrtex.com/';

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
    var url = BASE_URI + 'oauth/authorize?client_id=' + CLIENT_ID + '&redirect_uri=' + htmlEncode(REDIRECT_URI) + '&response_type=code';
    console.log(url);
    chrome.identity.launchWebAuthFlow(
    {'url': url, 'interactive': true},
    function(redirect_url) { 
      console.log(redirect_url);
       var code = redirect_url.substring(redirect_url.indexOf("=") + 1, redirect_url.length );
       exchangeCodeForToken(code);
    });
  });
}