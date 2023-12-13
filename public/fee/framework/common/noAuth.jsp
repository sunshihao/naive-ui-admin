<%@ page contentType="text/html;charset=UTF-8" %>
<%@ include file="/framework/common/header.jsp"%>

<%
	String _ctxPath_ = request.getContextPath();
%>

<html>
	<head>
		<title>操作提示</title>
		<link rel="stylesheet" href="<%=_ctxPath_%>/resource/css/style.css" type="text/css">
	</head>

<body style="margin:10px;" >
	<!--Begin：表单标题-->
	<lead:title label="操作提示"/>
	<!--End：表单标题-->

	<div class="DivBlock">
		<div class="DivWrap" style="display:block">
			<TABLE WIDTH="100%" BORDER="0" CELLSPACING="0" CELLPADDING="0">
				<TR>
					<TD ALIGN="center" NOWRAP>
						您请求的系统服务未被授权，如需授权请与管理员联系。
					</TD>
				</TR>
				<TR>
					<TD ALIGN="right" NOWRAP>
						<input type="button" value="关闭" class="MyButton" onClick="javascript:window.close();" />
					</TD>
				</TR>
			</TABLE>
		</div>
	</div>
</body>
</html>