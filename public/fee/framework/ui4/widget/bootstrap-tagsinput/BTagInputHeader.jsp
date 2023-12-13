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

<link href="<%=webCtxPath %>/framework/ui4/widget/bootstrap-tagsinput/css/bootstrap-tagsinput-typeahead.css" rel="stylesheet"  type="text/css" />
<link href="<%=webCtxPath %>/framework/ui4/widget/bootstrap-tagsinput/css/bootstrap-tagsinput.css" rel="stylesheet" type="text/css" />

