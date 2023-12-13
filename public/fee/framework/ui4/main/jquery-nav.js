//禁用ajax缓存
$.ajaxSetup ({
	cache: true //close AJAX cache
});

jQuery.namespace("iLead.main");
iLead.main = function(){
	return {
		init : function() {		
			if(Left_Theme == "sidebar") {		
				$("#topFrame").load(WEB_CTX_PATH + "/framework/ui4/main/left-theme/sideba/topnav.jsp",function(){
				    $("#topFrame").fadeIn(2000);}
                );
				$(".leftFrameNav").load(WEB_CTX_PATH + "/framework/ui4/main/left-theme/sideba/left.jsp", function(){
				    $(".leftFrameNav").fadeIn(2000);}
				);
			}else {
				$("#contIFrame").attr("src", WEB_CTX_PATH + "/framework/ui4/main/content-default.jsp");
				$("#topFrame").load(WEB_CTX_PATH + "/framework/ui4/main/topnav.jsp");
			}
			iLead.main.setContentHeight(false);	
		    $("#contIFrame").attr("src", WEB_CTX_PATH + "/framework/ui4/main/content-default.jsp");
		},
		getTopNavHeight : function() {
			return $("#topFrame").height();
		},
		getLeftNavHeight : function() {
			return $(".leftFrameNav").height();
		},
		getContentHeight : function() {
			return iLead.main.getLeftNavHeight() - iLead.main.getTopNavHeight();
		}, 
		setContentHeight : function(ifLeft) {
			//设置content的高度
			var heigth = 100;
			heigth = iLead.main.getLeftNavHeight() - 4;
			$("#contIFrame").css("height",heigth);
		}
	
	}
}();
jQuery().ready(function() {
	iLead.main.init();
});
