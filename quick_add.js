window.onload = function() {
  var CLIENT_ID = '6ebbc8bd124a2243e07fb0603b1d88858c4bf8040f4ef133738281220bb7ecb1';
  var CLIENT_SECRET = '6a12f115b888968aefc69ea7a4ad165d4fd9f0ddd25064ae51deb2ba31ccbf9e';
  var REDIRECT_URI = 'https://mpngmaeikidoddalmljkgnoeeghjpajp.chromiumapp.org/vyrtex-chrome-extension';
  var BASE_URI = 'http://localhost:3000/';

  $(document).ready(function(){
   $('body').on('click', 'a', function(){
     chrome.tabs.create({url: $(this).attr('href')});
     return false;
   });
  });

  chrome.storage.sync.get(function(object) {
    var access_token = object.access_token;
    
    // Get all collections

    $.ajax({
      type: "GET",
      url: BASE_URI + 'api/collections',
      beforeSend: function(request) {
        request.setRequestHeader('Authorization', 'Bearer ' + access_token)
      }
    }).done(function(response) {
      collections = {}

      for (var item in response.collections) {
        var collection = response.collections[item];
        collections[collection.id] = collection.name
      };

      var select = $("#collections")
      $.each(collections, function(id, name) {
        select.append($('<option />').val(id).text(name));
      })
    }).fail(function(response) {
      if (response.status === 401) {
        chrome.storage.sync.clear();
        window.location.href = "popup.html";
      }
    })

    chrome.tabs.getSelected(null,function(tab) {
      var tablink = tab.url;
      $('#url_input').val(tablink);

      //Get metadata

      $.ajax({
        type: 'GET',
        beforeSend: function(request) {
          request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
          request.setRequestHeader('Accept', 'application/json');
          request.setRequestHeader('Authorization', 'Basic ' + btoa(CLIENT_ID + ':' + CLIENT_SECRET));
        },
        url: BASE_URI + 'utilities/metadata',
        data: {'url':tablink}
      }).done(function(response) {
          console.log(response)
          if (response.status == "ok") {
            $('#metadata_img').attr('src', response.metadata.image);
            $('#metadata_description').html(response.metadata.description);
            $('#metadata_title').html(response.metadata.title);
            $('#article-description').html(response.metadata.description);
            $('#article-title').val(response.metadata.title);
            $('#article-provider').val(response.metadata.site_name);
            $('#pre_filled_metadata').show();
          }
          else{
            $('#unfilled_metadata').show(); 
          }
      }).fail(function(response) {
        console.log(response);
      });
    });

    $("#add-article").click(function(event) {

      var data = {
        'article[url]': $('#url_input').val(),
        'article[title]': $('#article-title').val(),
        'article[description]': $('#article-description').val(),
        'article[image]': $('#metadata_img').attr('src'),
        'article[collection_id]': $('#collections').val()
      }

      console.log(data);

      $.ajax({
        type: "POST",
        url: BASE_URI + 'api/articles',
        beforeSend: function(request) {
          request.setRequestHeader('Authorization', 'Bearer ' + access_token)
        },
        data: data
      }).done(function(response) {
        console.log(response);
        $('#main_container').hide();
        $('#success_container #link_to_collection').attr('href', BASE_URI + 'collections/' + response.article.collection_id)
        $('#success_container').show();

      }).fail(function(response) {
        console.log(response);
      })
    });

  });

  
}