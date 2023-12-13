<%@ page contentType="text/html; charset=UTF-8" %>
<%@ taglib uri="/WEB-INF/tlds/tag.tld" prefix="dhc" %>
<%@ taglib uri="/WEB-INF/tlds/struts-html.tld" prefix="html" %>
<html>
<head>
<%
	String ctxPath = request.getContextPath();
%>
<link href="<html:rewrite forward="treecss"/>" rel="stylesheet"	type="text/css">
<link href="<html:rewrite forward="css"/>" rel="stylesheet"	type="text/css">
<script src='<%=ctxPath%>/resource/js/xtree.jsp'></script>
<script src='<%=ctxPath%>/resource/js/xmlextras.jsp'></script>
<script src='<%=ctxPath%>/resource/js/xloadtree.jsp'></script>
</head>
<style type="text/css">
<!--
body {
	margin-left: 0px;
	margin-top: 0px;
	margin-right: 0px;
	margin-bottom: 0px;
   padding:0px 0px 0% 0px;
}
-->
</style>


<body style="overflow-y:scroll;overflow-x:scroll;">
<dhc:Areatreelist />

</body>
</html>
