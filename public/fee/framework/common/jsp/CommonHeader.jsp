<%@ page language="java" contentType="text/html" pageEncoding="UTF-8"%>
<%-- <%@ page contentType="text/html;charset=UTF-8" %> --%>
<%@ page import="com.dhc.framework.base.config.CONFIG"%>
<%@ page import="com.dhc.framework.base.util.WebSessionUtil" %>

<%-- <%@ taglib uri="/WEB-INF/tlds/ecside.tld" prefix="ec"%>
<%@ taglib uri="/WEB-INF/tlds/struts-html.tld" prefix="html" %>
<%@ taglib uri="/WEB-INF/tlds/struts-logic.tld" prefix="logic" %>
<%@ taglib uri="/WEB-INF/tlds/struts-bean.tld" prefix="bean" %>
<%@ taglib uri="/WEB-INF/tlds/tag.tld" prefix="dhc" %>
<%@ taglib uri="/WEB-INF/tlds/c.tld" prefix="c" %> --%>


<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<meta http-equiv="expires" content="0">
<meta http-equiv="Pragma" content="no-cache">
<meta http-equiv="Cache-Control" content="no-cache" />

<%
	String webCtxPath = request.getContextPath();
	String userLang = WebSessionUtil.getUserLanguage(request);
%>

<script type="text/javascript">
	//定义js全局变量WEB_CTX_PATH
	var WEB_CTX_PATH = "<%=webCtxPath%>";
	var LOCALE_LANG  = "<%=userLang%>";
</script>


<script type="text/javascript" src="<%=webCtxPath%>/resource/js/processbar.js" ></script>
<script type="text/javascript" src="<%=webCtxPath%>/resource/js/util.js" ></script>
<script type="text/javascript"  src="<%=webCtxPath%>/resource/js/Globals.js"></script>
<%-- 引入jQuery文件 --%>

<script type="text/javascript" src="<%=webCtxPath%>/framework/jQuery/jquery.js"></script>
<script type="text/javascript" src="<%=webCtxPath%>/framework/jQuery/plugins/jquery.cookie.js" charset="UTF-8" ></script>
<script type="text/javascript" src="<%=webCtxPath%>/resource/js/jquery_ajax.js"></script>


<script type="text/javascript" src="<%=webCtxPath%>/resource/js/formvalid.js" ></script>
<script type="text/javascript" src="<%=webCtxPath%>/resource/js/valididcard.js" ></script>
<script type="text/javascript" >
	var $jQuery = $;
	var jQuery = $;
</script>


<%-- 
<script language="javascript" type="text/javascript" src="<%=_ctxPath_%>/resource/js/jquery-1.2.3.js"></script>
--%>

<link rel="stylesheet" href="<%=webCtxPath%>/resource/css/style.css" type="text/css">

<link rel="stylesheet" type="text/css" href="<%=webCtxPath%>/framework/common/css/pageCommon.css" /> 

<%-- UI设置 begin --%>
<%if(CONFIG.UI_THEME.equals("dark_blue")){ %>

 <link rel="stylesheet" type="text/css" href="<%=webCtxPath%>/framework/ui_dblue/css/style.css" > 

<%}else{ %>

<%--  <link rel="stylesheet" type="text/css" href="<%=webCtxPath%>/resource/css/style.css" >
 <link rel="stylesheet" type="text/css" href="<%=webCtxPath%>/framework/common/css/pageCommon.css" /> 
  --%>
<%} %>
<%-- UI设置 end --%>

<%
if(CONFIG.SHIELDING_MODEL){
%>
<script type="text/javascript">
	document.onkeydown=hback;
	window.onhelp=returnFalse;
	document.oncontextmenu=returnValueFalse;
</script>
<%
}
%>