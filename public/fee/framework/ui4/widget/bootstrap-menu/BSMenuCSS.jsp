<%@ page language="java" contentType="text/html" pageEncoding="UTF-8"%>
<%
	String webCtxPath = request.getContextPath();
%>
<script type="text/javascript">
	//定义js全局变量WEB_CTX_PATH
	var WEB_CTX_PATH = "<%=webCtxPath%>";
</script>
<link rel="stylesheet" type="text/css" href="<%=webCtxPath %>/framework/ui4/widget/bootstrap-menu/css/components.css" />
<link rel="stylesheet" type="text/css" href="<%=webCtxPath %>/framework/ui4/widget/bootstrap-menu/css/theme/css/layout.css" />
<link rel="stylesheet" type="text/css" href="<%=webCtxPath %>/framework/ui4/widget/bootstrap-menu/css/theme/css/themes/light.css" />
<link rel="stylesheet" type="text/css" href="<%=webCtxPath %>/framework/ui4/widget/bootstrap-menu/css/theme/css/custom.css" />
<link rel="stylesheet" type="text/css" href="<%=webCtxPath %>/framework/ui4/widget/bootstrap-menu/css/BSMenuCSSInter.css" />
<!-- 新加 样式20170801 -->
<link rel="stylesheet" type="text/css" href="<%=webCtxPath%>/framework/ui4/css/xj-theme.css"/>