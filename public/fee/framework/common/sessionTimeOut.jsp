<%@ page contentType="text/html;charset=UTF-8" %>
<%@ include file="/framework/common/header.jsp"%>

<%
    response.setHeader("Pragma","No-cache");
    response.setHeader("Cache-Control","no-cache");
    response.setDateHeader("Expires", 0);

    String ctxPath = request.getContextPath();
%>
<link rel="stylesheet" href="<%=ctxPath%>/resource/css/style.css" type="text/css">

<script language="JavaScript">
	if (top!=null && top.document!=null && top.document.frames["FrmOuter"] != null)
	{
		try
		{
	    	top.window.location = "<%=ctxPath%>/framework/common/sessionTimeOut.jsp";
	    }
	    catch(e)
	    {
	    }
	}
</script>

<html>
	<head>
		<title>session超时提示</title>
	</head>
	<body style="margin:10px;" oncontextmenu="window.event.returnValue=false">
		<!--Begin：表单标题-->
		<dhc:titleTag title="session超时提示"/>
		<!--End：表单标题-->
		<div class="DivBlock">
			<div class="DivWrap" style="display:block">
				<TABLE WIDTH="100%" height="100%" BORDER="0" CELLSPACING="0" CELLPADDING="0">
					<TR>
						<TD ALIGN="center" NOWRAP>
							由于长时间没有对系统进行操作，当前会话已经失效，请重新登录。
						</TD>
					</TR>
					<TR>
						<TD ALIGN="center" NOWRAP>
							&nbsp;
						</TD>
					</TR>
					<TR>
						<TD ALIGN="center" NOWRAP>
							请您单击此处&nbsp;<a href="<%=ctxPath%>/">重新登录</a>&nbsp;系统。
						</TD>
					</TR>
				</TABLE>
			</div>
		</div>
	</body>
</html>

