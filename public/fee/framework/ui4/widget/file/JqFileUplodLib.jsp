<!-- 本jsp通常由业务应用jsp在page 尾部加载，用于进行页面初始化后的通用处理 -->
<%@ page contentType="text/html;charset=UTF-8" %>
<%@ page import="com.dhc.framework.base.config.ConfigHolder" %>
<%@ page import="com.dhc.framework.base.util.WebSessionUtil" %>

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
<!-- upload -->
<script type="text/javascript" src="<%=webCtxPath%>/framework/ui4/widget/bootstrap-fileinput/bootstrap-fileinput.js"></script>
<script src="<%=webCtxPath%>/framework/ui4/js/jquery-ui.js" type="text/javascript"></script>
<script src="<%=webCtxPath%>/framework/ui4/widget/file/js/jquery.blueimp-gallery.min.js"></script>
<script type="text/javascript" src="<%=webCtxPath%>/framework/ui4/widget/file/js/jquery.iframe-transport.js"></script>
<script type="text/javascript" src="<%=webCtxPath%>/framework/ui4/widget/file/js/jquery.fileupload.js"></script>
<script src="<%=webCtxPath%>/framework/ui4/widget/file/js/jquery.fileupload-process.js"></script>
<!-- The File Upload validation plugin -->
<script src="<%=webCtxPath%>/framework/ui4/widget/file/js/jquery.fileupload-validate.js"></script>
<!-- The File Upload user interface plugin -->
<script src="<%=webCtxPath%>/framework/ui4/widget/file/js/jquery.fileupload-ui.js"></script>
<!-- The File Upload jQuery UI plugin -->
<script src="<%=webCtxPath%>/framework/ui4/widget/file/js/jquery.fileupload-jquery-ui.js"></script>