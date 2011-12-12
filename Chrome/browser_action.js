var gateway = "http://zwc.name/caller/call.ashx?h=MyWeb&m=";

$(function(){

    showStyleList();

    $(".menu .default").click(function(){
        chrome.tabs.getSelected(null, function(tab) {
            storeMode(tab.url, "default");
            refresh("");
        });
    });
    $(".menu .customize").click(function(){
        chrome.tabs.getSelected(null, function(tab) {
            var style = loadStyle(tab.url);
            fillInput(style);
            show("edit");
        });
    });
    $(".edit .cancel").click(function(){
        window.close();
    });
    $(".edit .save").click(function(){
        chrome.tabs.getSelected(null, function(tab) {
            var style = getInputStyle();
            style.Domain = extractDomain(tab.url);
            storeStyle(style);
            storeMode(tab.url, "customize");
            refresh(style.Content);
        });
    });
    $(".edit .upload").click(function(){
        chrome.tabs.getSelected(null, function(tab) {
            var style = getInputStyle();
            style.Domain = extractDomain(tab.url);
            if (!validateInput(style))
            {
                return;
            }
            storeMode(tab.url, "customize");
            storeStyle(style);
            uploadStyle(style);
        });
    });
});
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
function uploadStyle(style)
{
    post(gateway + "SubmitStyle", style, function(data){
        if (data == "true"){
            refresh(style.Content);
        }
        else{
            alert(data);
        }
    });
}
function showStyleList()
{
    autoCheckMenuItem();

    chrome.tabs.getSelected(null, function(tab) {
        var url = gateway + "ListStyles&domain=" + extractDomain(tab.url);
        var ul = $(".menu ul");
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
            $(".menu li").click(function(){
                var title = $(this).html();
                use(title);
            });
        });
    });
}

function autoCheckMenuItem()
{
    chrome.tabs.getSelected(null, function(tab) {
        $(".menu .customize, .menu .default, .menu li").removeClass("checked")
        var style = loadStyle(tab.url);
        var mode = loadMode(tab.url);
            
        if (mode == "default")
        {
            $(".menu .default").addClass("checked");
        }
        else if (mode == "customize")
        {
            $(".menu .customize").addClass("checked");
        }
        else
        {
            var items = $(".menu li");
            $.each(items, function(key, li) {
                if ($(li).html() == style.Title)
                {
                    $(li).addClass("checked");
                }
              });
        }
    });
}
function use(title)
{
    chrome.tabs.getSelected(null, function(tab) {  
        var domain = extractDomain(tab.url);
        var url = gateway + "GetStyle&domain=" + domain + "&title=" + title;
        post(url, null, function(data){

            var style = new Object();
            style.Email = "";
            style.Title = title;
            style.Domain = domain;
            style.Content = data;
            
            storeMode(tab.url, "");
            storeStyle(style);
            refresh(style.Content);
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
function extractDomain(url)
{
    var domain = url.substring(url.indexOf("://") + 3);
    domain = domain.substring(0, domain.indexOf("/"));
    return domain;
}
function show(name){
    $(".menu").hide();
    $(".edit").hide();
    $("." + name).show();
}
function getInputStyle()
{
    var style = new Object();
    style.Domain = "";
    style.Email = $(".edit #email").val();
    style.Email = $.trim(style.Email);
    style.Title = $(".edit #title").val();
    style.Title = $.trim(style.Title);
    style.Content = $(".edit #content").val();
    style.Content = $.trim(style.Content);
    return style;
}
function fillInput(style)
{
    $(".edit #email").val(style.Email);
    $(".edit #title").val(style.Title);
    $(".edit #content").val(style.Content);
}
function storeMode(url, mode)
{
    localStorage[extractDomain(url) + "_mode"] = mode;
}
function loadMode(url)
{
    return localStorage[extractDomain(url) + "_mode"];
}
function storeStyle(style)
{
    localStorage[style.Domain + "_Email"] = style.Email;
    localStorage[style.Domain + "_Domain"] = style.Domain;
    localStorage[style.Domain + "_Title"] = style.Title;
    localStorage[style.Domain + "_Content"] = style.Content;
}
function loadStyle(url)
{
    var domain  = extractDomain(url);
    var style = new Object();
    style.Email =localStorage[domain + "_Email"];
    style.Domain = localStorage[domain + "_Domain"];
    style.Title = localStorage[domain + "_Title"];
    style.Content = localStorage[domain + "_Content"];
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
function refresh(content)
{
    chrome.tabs.getSelected(null, function(tab) {
        chrome.tabs.sendRequest(tab.id, {content: content}, function(response) {
            
        });
        window.close();
    });
}