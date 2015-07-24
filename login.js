window.onload = function() {
  var CLIENT_ID = '7bcb11568a2246a5d006b2faddbe4725d0ccb7ec31308017d6e57a75d0741ee9';
  var CLIENT_SECRET = '22feab201bbb6b8a6fe0ed3aef4acec81afe7d8d0b83c6be3eb99c915d7be390';
  var REDIRECT_URI = 'https://hnjjholodahaklljjenjpfbkkghppdpk.chromiumapp.org/vyrtex-chrome-extension';
  var BASE_URI = 'http://localhost:3000/';

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