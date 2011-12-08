$(function(){
	var html = "<div id=\"MyWeb\">"
+ "<div class=\"menu\"><h1>MyWeb</h1><ul class=\"style_list\"></ul><span class=\"add_style\">New Style</span><div>"
+ "<div class=\"edit_style\">Add Style</div>"
+ "</div>";
	$("body").append(html);
	
	var me = $("#MyWeb");

	me.addClass("disactive");
	me.click(function() {
        if (me.hasClass("active")){
            me.removeClass("active");
            me.addClass("disactive");
        }
        else{
            me.removeClass("disactive");
            me.addClass("active");
        }
	});
});