<%@ page language="java" contentType="text/html" pageEncoding="UTF-8"%>
<%@ page import="com.dhc.framework.base.util.WebSessionUtil" %>
<%
	String webCtxPath = request.getContextPath();
	String userLang = WebSessionUtil.getUserLanguage(request);
%>
<script type="text/javascript">
	//定义js全局变量WEB_CTX_PATH
	var WEB_CTX_PATH = "<%=webCtxPath%>";
	var LOCALE_LANG  = "<%=userLang%>";
</script>

<link href="<%=webCtxPath %>/framework/ui4/widget/tab/css/tab.bootstrap.css" rel="stylesheet" id="style_components" type="text/css" />
<link href="<%=webCtxPath %>/framework/ui4/widget/tab/css/tab.ilead.css" rel="stylesheet" type="text/css" />

