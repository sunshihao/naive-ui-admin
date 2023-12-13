<%@ page contentType="text/html;charset=UTF-8" language="java"%>
<%@ page import="com.dhc.framework.base.exception.*"%>
<%@ page import="com.dhc.framework.base.log.log4j.logutil.*"%>
<%@ taglib uri="/WEB-INF/tlds/ilead.tld" prefix="lead" %>
<%@ page isErrorPage="true" %>
<%
String webCtxPath = request.getContextPath();
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
<!DOCTYPE html>
<html>
  <head>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
	<meta http-equiv="X-UA-Compatible" content="chrome=1,IE=edge" />
	<link rel="stylesheet" href="<%=webCtxPath%>/framework/ui4/css/500/500.css"/>
	<title>系统异常提示</title>
	<style>
		html {
			height:100%;
		}
		body {
			background-color: #FFFFFF;
			margin:0;
			height:100%;
		}
	</style>

	<!-- copy these lines to your document head: -->

	<meta name="viewport" content="user-scalable=yes, width=1280" />


	<!-- end copy -->

  </head>
  <body>

  	<div class="iLead-text-cont">
  		<div class="iLead-text-box">
  			<div class="iLead-text-true">
  				<h3>业务异常:</h3>
		  		<div class="iLead-text-p">
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
		  		</div>
  			</div>
  		</div>
  	</div>	
	<!-- copy these lines to your document: -->

	<div id="5002_hype_container" style="margin:auto;position:relative;width:100%;height:100%;overflow:hidden;" aria-live="polite">
		<script type="text/javascript" charset="utf-8" src="<%=webCtxPath%>/framework/ui4/css/500/5002_hype_generated_script.js?9717"></script>
	</div>

	<!-- end copy -->


	


	<!-- text content for search engines: -->

	<div style="display:none">

		<div></div>

	</div>

	<!-- end text content: -->

  </body>
</html>
