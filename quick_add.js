window.onload = function() {

  var BASE_URI = 'http://localhost:3000/'
  var CLIENT_ID = '93b237a292e6f5ca67c7ed96c141702a06035bba0f906051d7a07ae59a88e641';
  var CLIENT_SECRET = '196be0bf8f968f5119156f92655dbd73da8451ec15a37b0f006b01d3fa4e28db';

  chrome.storage.sync.get(function(object) {
    var access_token = object.access_token;
    
    // Get all collections

    $.ajax({
      type: "GET",
      url: 'http://localhost:3000/api/collections',
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
      console.log(response);
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
            $('#main_container').css('height', '450px');
            $('#metadata_img').attr('src', response.metadata.image);
            $('#metadata_description').html(response.metadata.description);
            $('#metadata_title').html(response.metadata.title);
            $('#pre_filled_metadata').show();
          }
          else{
            $('#main_container').css('height', '450px');
            $('#unfilled_metadata').show(); 
          }
      }).fail(function(response) {
        console.log(response);
      });
    });

  });


}