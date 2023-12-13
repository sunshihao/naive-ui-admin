//禁用ajax缓存
$.ajaxSetup ({
	cache: true //close AJAX cache
});
//定义命名空间根据模块名和页面名称定义
jQuery.namespace("UI4.topNav");
UI4.topNav = function(){
	var navPath = "";
	return {
		init : function() {

		},
		// 一级导航选中
		current : function(doc,url){     
			$(".topNav ul li a").attr('class','nocurrent');	
			$("#" + doc.id + " a").attr('class','current');	
			if(doc.id == "home") {
				$(".leftFrameNav").html("");
			}else {
				$(".leftFrameNav").load(url);
			}
		    
			var b_url = WEB_CTX_PATH + "/framework/ui4/main/content-default.jsp";
			$("#contIFrame").attr("src", b_url);
		},
		// cookie functions 
		createCookie : function(name,value,days){
			var expires;
			if (days)
			{
				var date = new Date();
				date.setTime(date.getTime()+(days*24*60*60*1000));
				expires = "; expires="+date.toGMTString();
			}
			else expires = "";
			document.cookie = name+"="+value+expires+"; path=/";
		},
		readCookie : function(name)
		{
			var nameEQ = name + "=";
			var ca = document.cookie.split(';');
			for(var i=0;i < ca.length;i++)
			{
				var c = ca[i];
				while (c.charAt(0)==' ') c = c.substring(1,c.length);
				if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
			}
			return null;
		},
		eraseCookie : function(name)
		{
			createCookie(name,"",-1);
		},
		//修改密码
	    changeUserPwd : function(userid){
			$jQuery().openDlg({
				 width: 610,
				 height: 250,
				 modal: true,
				 offset:"auto",
				 url: WEB_CTX_PATH + "/authUserPasswordAction.do?method=changePassword&userId="+userid,
				 title: "修改密码"
			});
		},
		//登出
		logoutCurUser : function(){
			window.location.href = WEB_CTX_PATH + "/logoutAction.do";
		}			
	}
}();
jQuery().ready(function() {
	UI4.topNav.init();
});
