//禁用ajax缓存
$.ajaxSetup({
	cache : true
// close AJAX cache
});

//定义命名空间根据模块名和页面名称定义
jQuery.namespace("UI4.leftNav");
UI4.leftNav = function(){
	var navPath = "";
	return {
		init : function() {

		},
		showSecondNav :function(topNavId, userId, funcName) {		
			var classValue =  $("#topnav-li-" + topNavId).attr("class");
			var ifInit = classValue.indexOf("inited");
			//判断是否打开
			if(ifInit < 0) {
				ajaxRequest(WEB_CTX_PATH + "/func_privilege.do?method=getSubMenusByUserAndParent",function(returnData) {
					var str = "";
					$.each(returnData.result, function(i, n) {
						var path = "topnav-li-" + topNavId + "," + "secnav-li-" + n.functionId
						if(typeof(n.childSum) != "undefined"  && parseInt(n.childSum) > 0 ) {
						    str = str + '<li class="nav-item  " id="secnav-li-' + n.functionId + '"><a href="javascript:;" onclick="UI4.leftNav.showThirdNav(\'' + n.functionId + '\', \'' + path + '\')" class="nav-link nav-toggle secNav"><span class="title">' + n.functionName + '</span><span class="arrow"></span></a><ul class="sub-menu"></ul></li>';
						}else if (typeof(n.childSum) != "undefined" && parseInt(n.childSum) <= 0) {
							str = str + '<li class="nav-item start " id="secnav-li-' + n.functionId + '"><a href="#" class="nav-link " onclick="UI4.leftNav.loadMainPage(\'' + n.functionUrl + '\', \'' + path + '\')"> <i class="' + n.iconClass + '"></i><span class="title">' + n.functionName + '</span></a></li>';
						}else {
							alert("服务器错误!");
						}				    	    	 
				    });
					$("#topnav-li-" + topNavId).find(".sub-menu").html(str);
					$("#topnav-li-" + topNavId).addClass("inited");
				}, UI4.leftNav.initError, "rootNodeId=" + topNavId + "&userId=" + userId);
			}

			
		},
	
	    initError : function(req, status, error){
	    	alert("top菜单加载错误，请刷新画面！");
		},
		
		showThirdNav : function(topNavId, path) {
			var classValue =  $("#secnav-li-" + topNavId).attr("class");
			var ifInit = classValue.indexOf("inited");
			if(ifInit < 0) {  
				ajaxRequest(WEB_CTX_PATH + "/func_privilege.do?method=getSubMenusByUserAndParent",function(returnData) {
					var str = "";
					$.each(returnData.result, function(i, n) {
						//构造二级菜单
						var pathName = path + ",thinav-li-" + n.functionId;
						str = str + '<li class="nav-item  " id="thinav-li-' + n.functionId + '"><a href="#" class="nav-link " onclick="UI4.leftNav.loadMainPage(\'' + n.functionUrl + '\', \'' + pathName + '\')"> <i class="' + n.iconClass + '"></i><span class="title">' + n.functionName + '</span></a></li>';				    	    	 
				    });
					$("#secnav-li-" + topNavId).find(".sub-menu").html(str);
					$("#secnav-li-" + topNavId).addClass("inited");
				}, UI4.leftNav.initError, "rootNodeId=" + topNavId);
			}
		},
		
		loadMainPage : function(url, path) {
			var paths = path.split(",");
			if(navPath != "") {
				var pathr = navPath.split(",");
				$.each( pathr, function(j, m){
					$("#" + m).removeClass("active");
					$("#" + m).removeClass("open");	
			    });
			}			
			$.each( paths, function(i, n){
				$("#" + n).addClass("active");
				$("#" + n).addClass("open");	
		    });
			navPath = path;
			iLead.main.setContentHeight(true);
			$("#contIFrame").attr("src", WEB_CTX_PATH + url);
		}
				
	}
}();
jQuery().ready(function() {
	UI4.leftNav.init();
});
$(document).ready(function(){
	$("#retract").click(function(){
		if($(this).hasClass("active")){
			$("#leftFrame").css("width","200px");
			$("#main-content").css("margin-left","200px");
			$("#retract .icon-caidan").css("left","90px")
			$(this).removeClass("active");
			
		}else{
			$("#leftFrame").css("width","54px");
			$("#main-content").css("margin-left","54px");
			$(this).addClass("active");
			$("#retract .icon-caidan").css("left","17px")
		}
		
		
	})
})