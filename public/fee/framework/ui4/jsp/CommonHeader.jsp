<%@ page language="java" contentType="text/html" pageEncoding="UTF-8"%>
<%@ page import="com.dhc.framework.base.util.WebSessionUtil" %>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1"/>
<meta http-equiv="expires" content="0"/>
<meta http-equiv="Pragma" content="no-cache"/>
<meta http-equiv="Cache-Control" content="no-store, must-revalidate" />
<%
	String webCtxPath = request.getContextPath();
	String userLang = WebSessionUtil.getUserLanguage(request);
%>
<script type="text/javascript">
	//定义js全局变量WEB_CTX_PATH
	var WEB_CTX_PATH = "<%=webCtxPath%>";
	var LOCALE_LANG  = "<%=userLang%>";
</script>
<link rel="shortcut icon" href="<%=webCtxPath%>/framework/ui4/img/frame/bitbug_favicon.ico"/>
<link rel="apple-touch-icon" href="<%=webCtxPath%>/framework/ui4/img/frame/bitbug_favicon.png"/>
<!-- bootstrap 样式 -->
<link rel="stylesheet" href="<%=webCtxPath%>/framework/ui4/css/bootstrap/bootstrap.min.css"/>
<!-- icon font 选择器 -->
<link rel="stylesheet" type="text/css" href="<%=webCtxPath %>/framework/ui4/widget/fonticonpicker/css/jquery.fonticonpicker.min.css" />
<link rel="stylesheet" type="text/css" href="<%=webCtxPath %>/framework/ui4/widget/fonticonpicker/themes/grey-theme/jquery.fonticonpicker.grey.min.css" />
<link rel="stylesheet" type="text/css" href="<%=webCtxPath %>/framework/ui4/widget/fonticonpicker/css/jquery.fonticonpicker.ilead.css" />
<!--[if !IE]><!-->
<link rel="stylesheet" href="<%=webCtxPath%>/framework/ui4/css/iconfont/iconfont.css" />
<link rel="stylesheet" href="<%=webCtxPath%>/framework/ui4/widget/font-awesome/css/font-awesome.css"/>
<link rel="stylesheet" href="<%=webCtxPath%>/framework/ui4/css/bootstrap/font-awesome.css" />
<!--<![endif]-->
<!-- bootstrap 主题样式 -->
<link rel="stylesheet" href="<%=webCtxPath%>/framework/ui4/css/bootstrap/bootstrap-theme.min.css"/>
<!-- bootstrap 时间主题样式 -->
<link rel="stylesheet" href="<%=webCtxPath%>/framework/ui4/widget/bootstrap-datetimepicker/css/bootstrap-datetimepicker.css"/>
<link rel="stylesheet" href="<%=webCtxPath%>/framework/ui4/widget/bootstrap-daterangepicker/css/bootstrap-daterangepicker.css"/>
<!-- layer 样式 -->
<link rel="stylesheet" href="<%=webCtxPath%>/framework/ui4/widget/layui/layer/css/layer.css" />
<!-- jqgrid 样式 -->
<link rel="stylesheet" href="<%=webCtxPath%>/framework/ui4/widget/jqgrid/css/ui.jqgrid.css" />
<!-- select2 下拉（ajax，自动补全）组件  -->
<link rel="stylesheet" href="<%=webCtxPath%>/framework/ui4/widget/select2/css/select2.css" />
<link rel="stylesheet" href="<%=webCtxPath%>/framework/ui4/widget/select2/css/select2-bootstrap.css" />
<!-- jquery ui 样式 -->
<link rel="stylesheet" href="<%=webCtxPath%>/framework/ui4/css/jquery-ui.css" />
<!-- iLead 样式 -->
<link rel="stylesheet" href="<%=webCtxPath%>/framework/ui4/css/iLead-style.css"/>
<!-- iLead 样式 -->
<link rel="stylesheet" href="<%=webCtxPath%>/framework/ui4/css/iLead-common.css"/>
<!-- 新加 样式20170801 -->
<link rel="stylesheet" href="<%=webCtxPath%>/framework/ui4/css/xj-theme.css"/>

<link rel="stylesheet" href="<%=webCtxPath%>/ecside/sweetalert/sweetalert.css"/>
<!--[if lt IE 9]>
<link rel="stylesheet" href="<%=webCtxPath%>/framework/ui4/css/iLead-compatibility-ie8.css"/>
<link rel="stylesheet" href="<%=webCtxPath%>/framework/ui4/css/iconfont/iconfont.css" />
<![endif]-->
<!--[if lt IE 9]> 
      <script src="<%=webCtxPath%>/framework/ui4/js/bootstrap/html5shiv.min.js"></script>
      <script src="<%=webCtxPath%>/framework/ui4/js/bootstrap/respond.min.js"></script> 
<![endif]-->