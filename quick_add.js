window.onload = function() {
  var CLIENT_ID = '1f795e7f4fb8bf07a74e2abb9844b73978e02a26aba31e78a8b197289a99c5be';
  var CLIENT_SECRET = '797761fc6d77f921e6e2db8103d6ebc09ade9f90d02450881a820de141ecfca6';
  var REDIRECT_URI = 'https://ljcjhaejllpbeiamjnbldcngmjjoihln.chromiumapp.org/vyrtex-chrome-extension';
  var BASE_URI = 'http://localhost:3000/'

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

      //make call to get metadata

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