window.onload = function() {
  chrome.storage.sync.get('access_token', function(obj) {
    window.access_token = obj.access_token;
    if (window.access_token) {
      window.location.href = 'quick-add.html';
    } else {
      window.location.href = 'login.html';
    }
  });

}