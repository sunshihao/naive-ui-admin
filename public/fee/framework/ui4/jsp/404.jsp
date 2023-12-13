<%@ page contentType="text/html;charset=UTF-8" %>
<!DOCTYPE html>
<%
	String webCtxPath = request.getContextPath();
%>
<html>
  <head>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
	<meta http-equiv="X-UA-Compatible" content="chrome=1,IE=edge" />
	<title>404错误</title>
	<style>
		html {
			height:100%;
		}
		body {
			background-color: #FFFFFF;
			margin:0;
			height:100%;
			position: relative;
		}
		.text-cont{
			margin: 150px auto 0;
			position: absolute;
			width: 100%;
			z-index: 3;
		}
		.text-box{
			width: 500px;
			margin: 0 auto;
			color: #ffffff;
			overflow: hidden;
			padding: 30px;
			line-height: 30px;
		}
		.text-box{
			width: 500px;
			margin: 0 auto;
			background: #000000;
			opacity: 0.5;
			border-radius: 10px;
		}

	</style>
	<meta name="viewport" content="user-scalable=yes, width=1200" />
  </head>
  <body>

  	<div class="text-cont">
  		<div class="text-box">
  			<p>您所请求资源未找到!</p>
			<p>请确认资源地址是否正确。</p>
  		</div>
  		<div class="text-bg"></div>
  	</div>

	<div id="404_hype_container" style="margin:auto;position:relative;width:100%;height:100%;overflow:hidden;" aria-live="polite">
		<script type="text/javascript" charset="utf-8" src="<%=webCtxPath %>/framework/ui4/css/404/404_hype_generated_script.js?6812"></script>
	</div>

	<div style="display:none">
	</div>

  </body>
</html>
