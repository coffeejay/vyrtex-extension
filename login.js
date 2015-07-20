window.onload = function() {
  var CLIENT_ID = '1f795e7f4fb8bf07a74e2abb9844b73978e02a26aba31e78a8b197289a99c5be';
  var CLIENT_SECRET = '797761fc6d77f921e6e2db8103d6ebc09ade9f90d02450881a820de141ecfca6';
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