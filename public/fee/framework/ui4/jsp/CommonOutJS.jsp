<!-- 本jsp通常由业务应用jsp在page 尾部加载，用于进行页面初始化后的通用处理 -->
<%@ page contentType="text/html;charset=UTF-8" %>
<%@ page import="com.dhc.framework.base.config.ConfigHolder" %>
<%@ page import="com.dhc.framework.base.util.WebSessionUtil" %>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<div id="loading"></div>
<%
	String webCtxPath = request.getContextPath();
	String userLang = WebSessionUtil.getUserLanguage(request);
%>
<script type="text/javascript">
	//定义js全局变量WEB_CTX_PATH
	var WEB_CTX_PATH = "<%=webCtxPath%>";
	var LOCALE_LANG  = "<%=userLang%>";
</script>
<!-- ilead公共 组件-->
<script src="<%=webCtxPath%>/framework/common/js/common-util.js" type="text/javascript"></script>
<!-- jquery 组件-->
<script src="<%=webCtxPath%>/framework/ui4/js/jquery-1.11.2.min.js" type="text/javascript"></script>
<!-- jquery from 组件-->
<script src="<%=webCtxPath%>/framework/ui4/js/jquery.form.js" type="text/javascript"></script>
<!-- jquery validate -->
<script src="<%=webCtxPath%>/framework/ui4/widget/validate/js/jquery.metadata.js" type="text/javascript"></script>
<script src="<%=webCtxPath%>/framework/ui4/widget/validate/js/jquery.validate.js" type="text/javascript"></script>
<script src="<%=webCtxPath%>/framework/ui4/widget/validate/js/jquery.validate.method.js" type="text/javascript"></script>
<script src="<%=webCtxPath%>/framework/ui4/widget/validate/js/validate_msg/messages_<%=userLang%>.js" type="text/javascript"></script>
<!-- bootstrap 组件-->
<script type="text/javascript" src="<%=webCtxPath%>/framework/ui4/js/bootstrap/bootstrap.min.js"></script>
<!-- 加密组件-->
<script src="<%=webCtxPath%>/framework/ui4/widget/crypto/crypto-js.js" type="text/javascript"></script>

<script type="text/javascript" >
	var $jQuery = $;
	var jQuery = $;
	jQuery.ajaxSetup ({
		cache: false //关闭AJAX缓存
	});
</script>

 <script type="text/javascript">   
	//加载等待效果,禁止ajax执行过程中的其他页面操作
	jQuery(document).ajaxStart(function () {
		jQuery().showLoading();
	}).ajaxStop(function () {
		jQuery().hideLoading();
	});
	
	//防止form多次提交
	jQuery(function () {
	    jQuery('form').on('submit', function () {
	    	jQuery().showLoading();
	    });
	});
</script>
<%
if(ConfigHolder.getPropVal("SHIELDING_MODEL").equals("true")){
%>
<script type="text/javascript">
	document.onkeydown=hback;
	window.onhelp=returnFalse;
	document.oncontextmenu=returnValueFalse;
</script>
<%
}
%>