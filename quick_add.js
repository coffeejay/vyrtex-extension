window.onload = function() {
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
  });

  chrome.tabs.getSelected(null,function(tab) {
    var tablink = tab.url;
    $('#url_input').val(tablink);

    $('#main_container').css('height', '400px');

    //make call to get metadata

    //if metadata exists
    $('#pre_filled_metadata').show();

    //if metadata doesnt exist 
    $('#unfilled_metadata').show();

  });

}