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

<script src="<%=webCtxPath%>/framework/ui4/widget/bootstrap-tagsinput/js/typeahead.bundle.min.js" type="text/javascript"></script>
<script src="<%=webCtxPath%>/framework/ui4/widget/bootstrap-tagsinput/js/bootstrap-tagsinput.min.js" type="text/javascript"></script>
