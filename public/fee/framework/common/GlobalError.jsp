<%@ page contentType="text/html;charset=UTF-8" language="java"%>

<%@ taglib uri="/WEB-INF/tlds/ilead.tld" prefix="lead" %>

<%-- <%@ include file="/framework/common/header.jsp"%>
<%@ include file="/framework/common/script.jsp"%> --%>
<%-- <%@ page import="org.springframework.dao.DataAccessException,com.dhc.framework.base.exception.*"%> --%>
<%@ page import="com.dhc.framework.base.exception.*"%>
<%@ page import="com.dhc.framework.base.log.log4j.logutil.*"%>
<%@ page isErrorPage="true" %>
<head>
	<title>系统异常提示</title>
</head>
<%
	Exception e = null;
	if (request.getAttribute("javax.servlet.error.exception") != null) {
		e = (Exception)request.getAttribute("javax.servlet.error.exception");
	} else if (request.getAttribute("javax.servlet.jsp.jspException") != null) {
		e = (Exception)request.getAttribute("javax.servlet.jsp.jspException");

	} else if (request.getAttribute("org.apache.struts.action.EXCEPTION") != null) {
		e = (Exception)request.getAttribute("org.apache.struts.action.EXCEPTION");
	}

	String err_code = "" + request.getAttribute("javax.servlet.error.status_code");
	String err_msg = "" + request.getAttribute("javax.servlet.error.message");
	String err_type = "" + request.getAttribute("javax.servlet.error.exception_type");
%>
<body>
	<%
	if (e !=null)
	{
		SysLogger.fatal("系统发生异常",e);
	%>
	<lead:oparea id="errmsg" >
		<table>

		<% if (e instanceof BaseASException) { %>
			<tr>
				<td>
					业务异常:<%=e.getMessage()%>
				</td>
			</tr>
		<% } else if (e instanceof UserCatchedException) { %>
			<tr>
				<td>
					用户捕获异常:<%=e.getMessage()%>
				</td>
			</tr>
		<% } else if (e instanceof BaseDaoException) { %>
			<tr>
				<td>
					数据访问异常:<%=e.getMessage()%>
				</td>
			</tr>
		<% } else { %>
			<tr>
				<td>
				未知异常:<%=e.getMessage()%>
				</td>
			</tr>
		<% } %>
		</table>
	</lead:oparea>
	<lead:oparea id="errtrace" >
		<table>
			<tr>
				<td>
					<h3>异常详细信息(Exception)：</h3>
				</td>
			</tr>
			<tr>
				<td >
					<%= e.getClass().getName() + ":" + e.getMessage()%>
				</td>
			</tr>
			<%
			StackTraceElement elements[] = e.getStackTrace();
			for (int i=0; i<elements.length; i++) {
			%>
			<tr>
				<td >
					<%= elements[i]%>
				</td>
			</tr>
			<%
			}
			%>
		</table>

		<%
			if (e instanceof UserCatchedException && e.getCause() != null) {
		%>
		<table>
			<tr>
				<td>
					<h3>异常详细信息(Cause)：</h3>
				</td>
			</tr>
			<tr>
				<td >
					<%= e.getCause().getMessage()%>
				</td>
			</tr>
			<%
			StackTraceElement causeElements[] = e.getCause().getStackTrace();
			for (int i=0; i<causeElements.length; i++) {
			%>
			<tr>
				<td >
					<%= causeElements[i]%>
				</td>
			</tr>
			<%
			}
			%>
		</table>
		<%
			}
		%>
		</lead:oparea>
		<%
		}else{
		%>
		<lead:oparea id="syserr" >
		<table>
			<tr>
				<td>
					错误代码：<%=err_code%>
				</td>
			</tr>
			<tr>
				<td>
					错误信息：<%=err_msg%>
				</td>
			</tr>
			<tr>
				<td>
					错误类型：<%=err_type%>
				</td>
			</tr>
		</table>
		</lead:oparea>
		<%}%>
</body>
