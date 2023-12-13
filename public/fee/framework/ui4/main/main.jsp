<%@ page language="java" contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="zh-CN">
<head>
<jsp:include page="/framework/ui4/jsp/IEHeader.jsp" flush="true" />
<jsp:include page="/framework/ui4/jsp/CommonCSS.jsp" flush="true" />
<title>网上支付管理系统</title>
<%
	String webCtxPath = request.getContextPath();
	String userExpPrompt = (String)request.getSession().getAttribute("userExpPrompt");
	String pwdExpPropt = (String)request.getSession().getAttribute("pwdExpPrompt");
	String anonyPwdPrompt = (String)request.getSession().getAttribute("anonyPwdPrompt");
	request.getSession().removeAttribute("userExpPrompt");
	request.getSession().removeAttribute("pwdExpPrompt");
	request.getSession().removeAttribute("anonyPwdPrompt");
%>
</head>

<body >

	<div class="main"> 
	
		<!-- 头部 -->
		<header id="topFrame"></header>
		<!-- 头部结束 -->
		
		<!-- 左侧菜单 -->
		<aside>
			<div id="leftFrame">
			   <div class="leftFrameNav"></div>
			</div>	
		</aside>	
		<!-- 左侧菜单结束 -->	
		
		<!-- 中间内容 -->
		<section id="main-content" class="main-content" >
			<section class="wrapper" id="rightFrame">
		        <iframe src="" frameborder="0" width="100%" id="contIFrame" name="contIFrame" scrolling="no"  frameborder="no" border="0" ></iframe>
			</section>
		</section>
		<!-- 中间结束 -->	
		
	</div>


<jsp:include page="/framework/ui4/jsp/CommonJS.jsp" flush="true" />
<script type="text/javascript">
/*
$(function(){
	 $("#contIFrame").load(function(){
		 var ifm= document.getElementById("contIFrame");   
			var subWeb = document.frames ? document.frames["leftFrame"].document : ifm.contentDocument;   
			if(ifm != null && subWeb != null) {
			  // ifm.height = subWeb.body.scrollHeight;
			}  
			var topHeight = $("#topFrame").height();
			var leftHeight = $("#leftFrame").height();
			var heigth = leftHeight - topHeight -8;
			$("#main-content").attr("style","height:" + (heigth-27) +"px");
			$("#contIFrame").attr("style","height:" + (heigth-29) +"px");
	 });
});*/
$(window).bind('beforeunload',function(){
    return "您确定要离开网上支付管理系统嘛？";
});
</script>
<script src="<%=webCtxPath %>/framework/ui4/main/jquery-nav.js" type="text/javascript"></script> 

<% 
if(userExpPrompt!=null && !userExpPrompt.equals("")){
%>
	<script type="text/javascript">
		alert("<%=userExpPrompt%>");
	</script>
<%
}
%>
<% 
if(pwdExpPropt!=null && !pwdExpPropt.equals("")){
%>
	<script type="text/javascript">
		alert("<%=pwdExpPropt%>");
	</script>
<%
}
%>
<% 
if(anonyPwdPrompt!=null && !anonyPwdPrompt.equals("")){
%>
	<script type="text/javascript">
		alert("<%=anonyPwdPrompt%>");
	</script>
<%
}
%>
</body>
</html>
