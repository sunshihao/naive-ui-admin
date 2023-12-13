<%@ page language="java" contentType="text/html" pageEncoding="UTF-8"%>
<%
	String webCtxPath = request.getContextPath();
%>
<script type="text/javascript">
	//定义js全局变量WEB_CTX_PATH
	var WEB_CTX_PATH = "<%=webCtxPath%>";
</script>
<script type="text/javascript" src="<%=webCtxPath%>/framework/ui4/widget/bootstrap-menu/js/menu.js"></script>
<script type="text/javascript" src="<%=webCtxPath%>/framework/ui4/widget/bootstrap-menu/js/layout.js"></script>