<%@ page contentType="text/html;charset=UTF-8" %>
<%@ page import="com.dhc.framework.base.config.CONFIG"%>
<%
	String _ctxPath_ = request.getContextPath();
%>
<script language="javascript" src="<%=_ctxPath_%>/resource/js/processbar.js" type="text/javascript"></script>
<script language="javascript" src="<%=_ctxPath_%>/resource/js/util.js" type="text/javascript"></script>
<link rel="stylesheet" href="<%=_ctxPath_%>/resource/css/style.css" type="text/css">
<script src='<%=_ctxPath_%>/resource/js/Globals.js'></script>
<%-- 
<script language="javascript" type="text/javascript" src="<%=_ctxPath_%>/resource/js/jquery-1.2.3.js"></script>
--%>
<script language="javascript" type="text/javascript" src="<%=_ctxPath_%>/framework/jQuery/jquery.js"></script>
<script language="javascript" type="text/javascript" src="<%=_ctxPath_%>/resource/js/jquery_ajax.js"></script>
<script src="<%=_ctxPath_%>/framework/jQuery/plugins/jquery.cookie.js" charset="UTF-8" type="text/javascript">
</script>
 
<script language="javascript" src="<%=_ctxPath_%>/resource/js/formvalid.js" type="text/javascript"></script>

<script type="text/javascript" >
	var $jQuery = $;
	var jQuery = $;
</script>

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
