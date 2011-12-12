chrome.extension.onRequest.addListener(
function(request, sender, sendResponse) {
    applyStyle(request.content);
    localStorage["myweb_style"] = request.content;
    sendResponse({});
});

// Apply the current CSS content into the page
function applyStyle(content){
    if ($("#myweb_style").length <= 0)
    {
        var html = "<style id='myweb_style'></style>"
        $("body").append(html);
    }
    $("#myweb_style").html(content);
};

var content = localStorage["myweb_style"];
applyStyle(content);