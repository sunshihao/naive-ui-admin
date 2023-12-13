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
<!-- upload -->
<link rel="stylesheet" type="text/css" href="<%=webCtxPath %>/framework/ui4/widget/bootstrap-fileinput/bootstrap-fileinput.css" />
<link rel="stylesheet" type="text/css" href="<%=webCtxPath %>/framework/ui4/widget/bootstrap-fileinput/components.css" />
<!--[if IE 8]>
  <link rel="stylesheet" href="<%=webCtxPath%>/framework/ui4/widget/bootstrap-fileinput/bootstrap-fileinput-ie8.css">
<![endif]-->
