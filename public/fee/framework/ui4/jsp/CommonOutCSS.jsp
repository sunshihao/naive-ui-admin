<%@ page language="java" contentType="text/html" pageEncoding="UTF-8"%>
<%@ page import="com.dhc.framework.base.util.WebSessionUtil" %>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta http-equiv="expires" content="0" />
<meta http-equiv="Pragma" content="no-cache" />
<meta http-equiv="Cache-Control" content="no-store, must-revalidate" />
<%
	String webCtxPath = request.getContextPath();
	String userLang = WebSessionUtil.getUserLanguage(request);
%>
<!-- icon -->
<link rel="shortcut icon" href="<%=webCtxPath%>/framework/ui4/img/frame/bitbug_favicon.ico"/>
<link rel="apple-touch-icon" href="<%=webCtxPath%>/framework/ui4/img/frame/bitbug_favicon.png"/>
<!-- bootstrap 样式 -->
<link rel="stylesheet" href="<%=webCtxPath%>/framework/ui4/css/bootstrap/bootstrap.min.css" type="text/css" />
<!-- bootstrap 主题样式 -->
<link rel="stylesheet" href="<%=webCtxPath%>/framework/ui4/css/bootstrap/bootstrap-theme.min.css" type="text/css" />
<!-- 登陆主题样式 -->
<link rel="stylesheet" href="<%=webCtxPath%>/framework/ui4/css/login.css" type="text/css" />
<!--[if lt IE 9]>
      <script src="<%=webCtxPath%>/framework/ui4/js/bootstrap/html5shiv.min.js"></script>
      <script src="<%=webCtxPath%>/framework/ui4/js/bootstrap/respond.min.js"></script>
<![endif]-->