<%@ page contentType="text/html;charset=UTF-8" %>
<%@ include file="/framework/common/header.jsp"%>

<%
	String _ctxPath_ = request.getContextPath();
	String access_start = request.getParameter("access_start");
	String access_end = request.getParameter("access_end");
	access_start = access_start!=null?access_start.trim():"0000";
	access_end = access_end!=null?access_end.trim():"0000";
	boolean bBetweenTwoDays = false; //时间段是否跨两天
	if(Integer.parseInt(access_start)>Integer.parseInt(access_end))
	{
		bBetweenTwoDays = true;
	}
	access_start = access_start.substring(0,2) + ":" +access_start.substring(2,4);
	access_end = access_end.substring(0,2) + ":" +access_end.substring(2,4);
	if(bBetweenTwoDays)
	{
		access_end = "次日" + access_end;
	}
%>

<html>
	<head>
		<title>操作提示</title>
		<link rel="stylesheet" href="<%=_ctxPath_%>/resource/css/style.css" type="text/css">
	</head>

<body style="margin:10px;" >
	<!--Begin：表单标题-->
	<dhc:titleTag title="操作提示"/>
	<!--End：表单标题-->

	<div class="DivBlock">
		<div class="DivWrap" style="display:block">
			<TABLE WIDTH="100%" BORDER="0" CELLSPACING="0" CELLPADDING="0">
				<TR>
					<TD ALIGN="center" NOWRAP>
						此项操作只允许在时间段『<%=access_start %>-<%=access_end %>』进行，如需操作请与管理员联系。
					</TD>
				</TR>
				<TR>
					<TD ALIGN="right" NOWRAP>
						&nbsp;
					</TD>
				</TR>
			</TABLE>
		</div>
	</div>
</body>
</html>