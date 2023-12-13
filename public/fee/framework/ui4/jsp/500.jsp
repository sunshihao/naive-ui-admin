<%@ page contentType="text/html;charset=UTF-8" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<%
	String webCtxPath = request.getContextPath();
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
<link rel="stylesheet" href="<%=webCtxPath%>/framework/ui4/css/500.css" type="text/css" />
<title>500错误</title>
</head>
<body>
<div class="contTop"></div>		
<div class="container">	
	<div class="contWrap">
	<p>抱歉！由于地面系统错误，导致飞船错误。</p>	
	<p>你可以选择重新
		<button type="button" class="btn btn-add" onclick="loginAgain()">登录</button>
					,或者进行其他操作
	</p>
</div>	
</div>
<div class="contBottom"></div>
<script src="<%=webCtxPath%>/framework/ui4/js/jquery-1.11.2.min.js" type="text/javascript"></script>
<script src="<%=webCtxPath%>/framework/ui4/js/bootstrap/bootstrap.min.js" type="text/javascript"></script>
<script src="<%=webCtxPath%>/framework/ui4/js/global.js" type="text/javascript"></script>
<script language="JavaScript">

function closeWin(){
	window.closeIgnoreAgent();
}

function loginAgain() {
	top.window.location="<%=webCtxPath%>/";
}

</script>
</body>
</html>
