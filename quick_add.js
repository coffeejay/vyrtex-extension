window.onload = function() {
  var CLIENT_ID = '7bcb11568a2246a5d006b2faddbe4725d0ccb7ec31308017d6e57a75d0741ee9';
  var CLIENT_SECRET = '22feab201bbb6b8a6fe0ed3aef4acec81afe7d8d0b83c6be3eb99c915d7be390';
  var REDIRECT_URI = 'https://hnjjholodahaklljjenjpfbkkghppdpk.chromiumapp.org/vyrtex-chrome-extension';
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
            $('#metadata_provider').html(response.metadata.site_name);
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
        'article[site_name]': $('#metadata_provider').html(),
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