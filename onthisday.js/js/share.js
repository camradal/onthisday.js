var share = (function () {
    var sharedItem = {};
    
    function registerForShare() {
        var dataTransferManager = Windows.ApplicationModel.DataTransfer.DataTransferManager.getForCurrentView();
        dataTransferManager.addEventListener("datarequested", shareLinkHandler);
    }

    function shareLinkHandler(e) {
        if (!sharedItem) return;
        
        var request = e.request;
        request.data.properties.title = "On this day in " + sharedItem.title;
        request.data.properties.description = sharedItem.description;
        request.data.setUri(new Windows.Foundation.Uri("http://en.wikipedia.org/w/" + sharedItem.subtitle));
    }

    function setSharedItem(item) {
        sharedItem = item;
    }

    registerForShare();

    return {
        setSharedItem: setSharedItem
    };
})();