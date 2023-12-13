<%@ page language="java" contentType="text/html" pageEncoding="UTF-8"%>
<%@ page import="com.dhc.framework.base.config.ConfigHolder"%>
<%@ page import="com.dhc.framework.base.util.WebSessionUtil" %>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta http-equiv="expires" content="0" />
<meta http-equiv="Pragma" content="no-cache" />
<meta http-equiv="Cache-Control" content="no-store, must-revalidate" />
<%
	String webCtxPath = request.getContextPath();
	String userLang = WebSessionUtil.getUserLanguage(request);
	//获取配置文件的左边菜单样式
	String MLT = ConfigHolder.getPropVal("MENU_LAYOUT_THEME");
%>
<script type="text/javascript">
	//定义js全局变量WEB_CTX_PATH
	var WEB_CTX_PATH = "<%=webCtxPath%>";
	var LOCALE_LANG  = "<%=userLang%>";
	var Left_Theme = "<%=MLT%>";
</script>
<!-- icon -->
<link rel="shortcut icon" href="<%=webCtxPath%>/framework/ui4/img/frame/bitbug_favicon.ico"/>
<link rel="apple-touch-icon" href="<%=webCtxPath%>/framework/ui4/img/frame/bitbug_favicon.png"/>
<!-- bootstrap 样式 -->
<link rel="stylesheet" href="<%=webCtxPath%>/framework/ui4/css/bootstrap/bootstrap.min.css"/>
<!--[if !IE 8]><!-->
<link rel="stylesheet" href="<%=webCtxPath%>/framework/ui4/widget/font-awesome/css/font-awesome.css"/>
<link rel="stylesheet" href="<%=webCtxPath%>/framework/ui4/css/bootstrap/font-awesome.css" />
<link rel="stylesheet" href="<%=webCtxPath%>/framework/ui4/css/iconfont/iconfont.css" />
<!--<![endif]-->
<!-- bootstrap 主题样式 -->
<link rel="stylesheet" href="<%=webCtxPath%>/framework/ui4/css/bootstrap/bootstrap-theme.min.css"/>
<!-- jquery ui 样式 -->
<link rel="stylesheet" href="<%=webCtxPath%>/framework/ui4/css/jquery-ui.css" />
<!-- layer 样式 -->
<link rel="stylesheet" href="<%=webCtxPath%>/framework/ui4/widget/layui/css/layer.css" />
<!-- 加载样式 -->
<link rel="stylesheet" href="<%=webCtxPath%>/framework/ui4/widget/loading/showLoading.css" type="text/css"/> 
<!-- 主题样式-默认 -->
<link rel="stylesheet" href="<%=webCtxPath%>/framework/ui4/css/iLead-theme-white.css"/>
<!-- 结构样式 -->
<link rel="stylesheet" href="<%=webCtxPath%>/framework/ui4/css/iLead-common.css"/>
<!-- iLead 样式 -->
<link rel="stylesheet" href="<%=webCtxPath%>/framework/ui4/css/iLead-style.css"/>
<!-- 新家 样式2017-08-01 -->
<link rel="stylesheet" href="<%=webCtxPath%>/framework/ui4/css/xj-theme.css"/>
<!--[if lt IE 9]>
<link rel="stylesheet" href="<%=webCtxPath%>/framework/ui4/css/iLead-compatibility-ie8.css"/>
<link rel="stylesheet" href="<%=webCtxPath%>/framework/ui4/css/iconfont/iconfont.css" />
<![endif]-->

<!--[if lt IE 9]>     
      <script src="<%=webCtxPath%>/framework/ui4/js/bootstrap/html5shiv.min.js"></script>
      <script src="<%=webCtxPath%>/framework/ui4/js/bootstrap/respond.min.js"></script>    
<![endif]-->