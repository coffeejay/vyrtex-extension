// Copyright (c) 2012 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

window.onload = function() {
  $("#login").click(function(event) {
    console.log('test')
    chrome.identity.launchWebAuthFlow(
    {'url': 'http://localhost:3000/oauth/authorize?client_id=1e860423b3d54b09101c9fd7c1a225fa14b32dd2a0b7da56f10914c9e5c044f1&redirect_uri=https%3A%2F%2Fljcjhaejllpbeiamjnbldcngmjjoihln.chromiumapp.org%2Fvyrtex-chrome-extension&response_type=code', 'interactive': true},
    function(redirect_url) { 
      console.log(redirect_url) 
    });
  });
}
