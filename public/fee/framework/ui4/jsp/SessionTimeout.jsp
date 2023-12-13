<%@ page contentType="text/html;charset=UTF-8" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<%
	String webCtxPath = request.getContextPath();
    String sendRedirectUrl = request.getParameter("sendRedirectUrl");
%>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<meta http-equiv="X-UA-Compatible" content="IE=Edge" />
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
<link rel="shortcut icon" href="<%=webCtxPath%>/framework/ui4/img/frame/bitbug_favicon.ico"/>
<link rel="apple-touch-icon" href="<%=webCtxPath%>/framework/ui4/img/frame/bitbug_favicon.png"/>
<link rel="stylesheet" href="<%=webCtxPath%>/framework/ui4/css/bootstrap/bootstrap.min.css" type="text/css" />
<link rel="stylesheet" href="<%=webCtxPath%>/framework/ui4/css/bootstrap/bootstrap-theme.min.css" type="text/css" />
<link rel="stylesheet" href="<%=webCtxPath%>/framework/ui4/css/timeOut.css" type="text/css" />
<title>超时提示</title>
</head>
<body onload="init()">
<div class="container">
    <div class="row">		
		<div class="contWrap">
			<p>抱歉！当前会话由于闲置太久已经被淘汰出局~~</p>	
			<p>您可以重新
				<button type="button" class="btn btn-xs btn-add1" onclick="loginAgain()">登录</button>
					或者
				<button type="button" class="btn btn-xs btn-add2" onclick="closeWin()">关闭</button>
			</p>		
		</div>
	</div>
</div>
<script src="<%=webCtxPath%>/framework/ui4/js/jquery-1.11.2.min.js" type="text/javascript"></script>
<script src="<%=webCtxPath%>/framework/ui4/js/bootstrap/bootstrap.min.js" type="text/javascript"></script>
<script src="<%=webCtxPath%>/framework/ui4/js/global.js" type="text/javascript"></script>
<script language="JavaScript">
var sendRedirectUrl = "<%=sendRedirectUrl%>"
function overlayTop(){
	if (top!=null && top.document!=null && top.document.frames["FrmOuter"] != null)
	{
		try
		{
	    	top.window.location = "<%=webCtxPath%>/framework/ui4/jsp/SessionTimeout.jsp";
	    }
	    catch(e)
	    {
	    }
	}
}

function closeWin(){
	window.closeIgnoreAgent();
/* 	var browserName = navigator.appName;
	if(browserName=="Netscape"){
		window.open("","_self","");
		window.close();
	}else{
		window.close();
	} */
}

function loginAgain() {
	window.location.href="<%=webCtxPath%>/";
}

function init() {
	if(typeof("sendRedirectUrl") != "undefined" && sendRedirectUrl != null && sendRedirectUrl != "null" && sendRedirectUrl != "") {
		var url = location.href; 
		//获取要取得的get参数位置
		var get = url.indexOf("sendRedirectUrl=");
		var getParamStr = url.slice("sendRedirectUrl".length + get + 1);
		if (top!=null && top.document!=null) {
			top.window.location = getParamStr;
		}else { 
			window.location.href = getParamStr;
		}
	    
	}
}
</script>
</body>
</html>
