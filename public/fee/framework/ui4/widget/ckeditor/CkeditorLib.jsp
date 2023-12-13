<!-- 本jsp通常由业务应用jsp在page 尾部加载，用于进行页面初始化后的通用处理 -->
<%@ page contentType="text/html;charset=UTF-8" %>
<%
	String webCtxPath = request.getContextPath();
%>

<script type="text/javascript">
	//定义js全局变量WEB_CTX_PATH
	var WEB_CTX_PATH = "<%=webCtxPath%>";
</script>
<script type="text/javascript" src="<%=webCtxPath%>/framework/ui4/widget/ckeditor/adapters/jquery.js"></script>
<script type="text/javascript" src="<%=webCtxPath%>/framework/ui4/widget/ckeditor/ckeditor.js"></script>

