window.onload = function() {
  $("#login").click(function(event) {
    chrome.identity.launchWebAuthFlow(
    {'url': 'http://localhost:3000/oauth/authorize?client_id=7b529aed5e89c14bd45c4cb949f220e5bc4cc440003dd7604d3fc6ed43f29844&redirect_uri=https%3A%2F%2Fhnjjholodahaklljjenjpfbkkghppdpk.chromiumapp.org%2Fvyrtex-chrome-extension&response_type=code', 'interactive': true},
    function(redirect_url) { 
       console.log(redirect_url);
       var code = redirect_url.substring(redirect_url.indexOf("=") + 1, redirect_url.length );
       exchangeCodeForToken(code);
    });
  });

  function exchangeCodeForToken(code) {
    var xhr = new XMLHttpRequest();
    xhr.open('POST',
             'http://localhost:3000/oauth/token?' +
             'client_id=' + "7b529aed5e89c14bd45c4cb949f220e5bc4cc440003dd7604d3fc6ed43f29844" +
             '&grant_type=' + "authorization_code" +
             '&redirect_uri=' + "https://hnjjholodahaklljjenjpfbkkghppdpk.chromiumapp.org/vyrtex-chrome-extension" +
             '&code=' + code);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.setRequestHeader('Accept', 'application/json');
    xhr.setRequestHeader('Authorization', 'Basic ' + btoa('7b529aed5e89c14bd45c4cb949f220e5bc4cc440003dd7604d3fc6ed43f29844' + ':' + '48ec91d8b544bc13f6ddc2528a64105da385cbde6b4345972026eb3eaf8abd0a'));
    xhr.onload = function () {
      if (this.status === 200) {
        var response = JSON.parse('"'+this.responseText+'"');
        response = response.substring(0,response.indexOf('&'));
        access_token = response;
        console.log(access_token);
      }
    };
    xhr.send();
  }
}