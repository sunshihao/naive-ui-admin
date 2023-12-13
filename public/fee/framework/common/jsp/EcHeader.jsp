<%-- <%@ page contentType="text/html;charset=UTF-8" %> --%>
<%@ page import="com.dhc.framework.base.util.WebSessionUtil" %>
<%@ page import="com.dhc.framework.base.config.CONFIG" %>
<%
	String webContextPath = request.getContextPath();
	String localeLang = WebSessionUtil.getUserLanguage(request);
	//System.out.println("localeLang:"+localeLang);
%>

<link rel="stylesheet" type="text/css" href="<%=webContextPath%>/ecside/css/ecside_style.css" /> 
<link rel="stylesheet" type="text/css" href="<%=webContextPath%>/ecside/css/darkBlue_style.css" />
<link rel="stylesheet" type="text/css" href="<%=webContextPath%>/ecside/css/ecside_simple.css"/>

<script type="text/javascript" src="<%=webContextPath%>/ecside/js/ecside_msg_utf8_<%=localeLang%>.js" ></script>
<script type="text/javascript" src="<%=webContextPath%>/ecside/js/prototype_mini.js" ></script>

<script type="text/javascript">
<!--
var $proto=$;
//-->
</script>

<script type="text/javascript" src="<%=webContextPath%>/ecside/js/ecside.js" ></script>
