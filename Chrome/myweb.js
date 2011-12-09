applyStyle(loadStyle()); // Automatically apply selected style when a page is opened.

(function(){
	var html = "<div id='MyWeb'>"
+   "<div class='title'>MyWeb</div>"
+   "<div class='menu'>"
+      "<span class='default'>Default Style</span>"
+       "<ul class='list'>"
+          "<li>Style One</li>"
+      "</ul>"
+      "<span class='customize'>Customize Style</span>"
+  "</div>"
+  "<div class='edit'>"
+ "<table><tbody>"
+ "<tr><th>Email</th><td><input id='email' type='text' /></td></tr>"
+ "<tr><th>Title</th><td><input id='title' type='text' /></td></tr>"
+ "<tr><th colspan='2'>CSS Content</th></tr>"
+ "<tr><td colspan='2'><textarea id='content' /></td></tr>"
+ "</tbody></table>"
+ "<button class='cancel'>Cancel</button>"
+ "<button class='save' title='Will be lost when switch to Default Style or other styles.'>Save in Local</button>"
+ "<button class='upload'>Upload and Share with Others</button>"
+ "</div>"
+"</div>";
	$("body").append(html);

    refresh();

    $("#MyWeb .title").click(function(){
        showStyleList();
        show("menu");
    });
    $("#MyWeb .menu .default").click(function(){
        var style = loadStyle();
        style.Content = "";
        style.Domain = "";
        storeStyle(style);
        refresh();
    });
    $("#MyWeb .menu .customize").click(function(){
        var style = loadStyle();
        fillInput(style);
        show("edit");
    });
    $("#MyWeb .edit .cancel").click(function(){
        var style = loadStyle();
        fillInput(style);
        show("title");
    });
    $("#MyWeb .edit .save").click(function(){
        var style = getInputStyle();
        storeStyle(style);
        refresh();
    });
    $("#MyWeb .edit .upload").click(function(){
        var style = getInputStyle();
        if (!validateInput(style))
        {
            return;
        }
        style.Domain = document.domain;
        storeStyle(style);
        uploadStyle(style);
        refresh();
    });
})();

function refresh()
{
    var style = loadStyle();
    applyStyle(style);
    show("title");
    autoCheckMenuItem();
}
function validateInput(style)
{
     if (style.Email == "")
    {
        alert("Please input your email as the owner of this style.");
        return false;
    }
    else if (style.Title == "")
    {
        alert("Please input a title.");
        return false;
    }
    else if (style.Content == "")
    {
        alert("Please input CSS content.");
        return false;
    }
    return true;
}
// Apply the current CSS content into the page
function applyStyle(style){
    if ($("#myweb_style").length <= 0)
    {
        var html = "<style id='myweb_style'></style>"
        $("body").append(html);
    }
    $("#myweb_style").html(style.Content);
};

// Switch views
function show(name){
    $("#MyWeb .title").hide();
    $("#MyWeb .menu").hide();
    $("#MyWeb .edit").hide();
    $("#MyWeb ." + name).show();
}
function autoCheckMenuItem()
{
    $("#MyWeb .menu .customize, #MyWeb .menu .default, #MyWeb .menu li").removeClass("checked")
    var style = loadStyle();
    if (style.Domain != "") // Styles shared by others
    {
        var items = $("#MyWeb .menu li");
        $.each(items, function(key, li) {
            if ($(li).html() == style.Title)
            {
                $(li).addClass("checked");
            }
          });
    }
    else if (style.Content != "") // The customized style
    {
        $("#MyWeb .menu .customize").addClass("checked");
    }
    else // Default style
    {
        $("#MyWeb .menu .default").addClass("checked");
    }
}
function use(title)
{
    var url = gateway + "GetStyle&domain=" + document.domain + "&title=" + title;
    post(url, null, function(data){

        var style = new Object();
        style.Title = title;
        style.Domain = document.domain;
        style.Content = data;

        storeStyle(style);
        refresh();
    });
}

//
// Web services
//
var gateway = "http://zwc.name/caller/call.ashx?h=MyWeb&m=";
function uploadStyle(style)
{
    post(gateway + "SubmitStyle", style, function(data){
        if (data == "true"){
            //alert("Uploaded");
        }
        else{
            alert(data);
        }
    });
}
function showStyleList()
{
    var url = gateway + "ListStyles&domain=" + document.domain;
    var ul = $("#MyWeb .menu ul");
    ul.html("<li>Loading...</li>");

    jQuery.getJSON(url, function(data){
        ul.html("");
        $.each(data, function(key, style) {
            if ($.trim(style.Title) != "")
            {
                ul.append("<li>" + style.Title + "</li>");
            }
          });
        autoCheckMenuItem();
        
        // Style list onclick event.
        $("#MyWeb .menu li").click(function(){
            var title = $(this).html();
            use(title);
            show("title");
        });
    });
}

function post(url, entity, callback)
{
    var json = JSON.stringify(entity);
    $.ajax({
        url: url,
        type: "POST",
        contentType: "application/json; charset=utf-8",
        data: json,
        dataType: "text",
        success: callback,
    });
}

//
// Style entity
//
function getInputStyle()
{
    var style = new Object();
    style.Domain = "";
    style.Email = $("#MyWeb .edit #email").val();
    style.Email = $.trim(style.Email);
    style.Title = $("#MyWeb .edit #title").val();
    style.Title = $.trim(style.Title);
    style.Content = $("#MyWeb .edit #content").val();
    style.Content = $.trim(style.Content);
    return style;
}
function fillInput(style)
{
    $("#MyWeb .edit #email").val(style.Email);
    $("#MyWeb .edit #title").val(style.Title);
    $("#MyWeb .edit #content").val(style.Content);
}
function storeStyle(style)
{
    localStorage["Email"] = style.Email;
    localStorage["Domain"] = style.Domain;
    localStorage["Title"] = style.Title;
    localStorage["Content"] = style.Content;
}
function loadStyle()
{
    var style = new Object();
    style.Email =localStorage["Email"];
    style.Domain = localStorage["Domain"];
    style.Title = localStorage["Title"];
    style.Content = localStorage["Content"];
    if (!style.Email)
    {
        style.Email = "";
    }
    if (!style.Domain)
    {
        style.Domain = "";
    }
    if (!style.Title)
    {
        style.Title = "";
    }
    if (!style.Content)
    {
        style.Content = "";
    }
    return style;
}                                                                 