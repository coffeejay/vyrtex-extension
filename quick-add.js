window.onload = function(){

	chrome.tabs.getSelected(null,function(tab) {
    var tablink = tab.url;
    $('#url_input').val(tablink);
	});


}