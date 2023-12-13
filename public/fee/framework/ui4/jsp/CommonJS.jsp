<!-- 本jsp通常由业务应用jsp在page 尾部加载，用于进行页面初始化后的通用处理 -->
<%@ page contentType="text/html;charset=UTF-8" %>
<%@ page import="com.dhc.framework.base.config.ConfigHolder" %>
<%@ page import="com.dhc.framework.base.util.WebSessionUtil" %>
<div id="loading"></div>
<%
	String webCtxPath = request.getContextPath();
	String userLang = WebSessionUtil.getUserLanguage(request);
%>
<script type="text/javascript">
	//定义js全局变量WEB_CTX_PATH
	var WEB_CTX_PATH = "<%=webCtxPath%>";
	var LOCALE_LANG  = "<%=userLang%>";
</script>
<!-- jquery 组件-->
<script type="text/javascript" src="<%=webCtxPath%>/framework/ui4/js/jquery-1.11.2.min.js"></script>
<!-- bootstrap 组件-->
<script type="text/javascript" src="<%=webCtxPath%>/framework/ui4/js/bootstrap/bootstrap.min.js"></script> 
<!--layui 弹出层控件 -->
<script type="text/javascript" src="<%=webCtxPath%>/framework/ui4/widget/layui/js/layer.js"></script>
<!-- jquery 滚动条 -->
<script type="text/javascript" src="<%=webCtxPath%>/framework/ui4/widget/scroll/jquery.nicescroll/v3.6.8/js/jquery.nicescroll.js"></script>
<!-- ilead公共 组件-->
<script src="<%=webCtxPath%>/framework/common/js/common-util.js" type="text/javascript"></script>
<%--iLead框架引用的扩展js库 --%>
<script src="<%=webCtxPath%>/framework/ui4/js/global.js" type="text/javascript"></script>
<script src="<%=webCtxPath%>/framework/ui4/js/ui4-common.js" type="text/javascript"></script>
<script src="<%=webCtxPath%>/framework/ui4/js/form-util.js" type="text/javascript"></script>
<%--ie下可以支持css3伪类 --%>
<!--[if (gte IE 6)&(lte IE 8)]>
 <script type="text/javascript" src="<%=webCtxPath%>/framework/ui4/js/selectivizr.js"></script>
<![endif]-->
<!-- 弹出提示 -->
<script>
   $(function () { $("[data-toggle='tooltip']").tooltip(); });
</script>
<script>
  <!-- jquery 滚动条 -->
  $(document).ready(function() {  
	var nice = $(".leftFrameNav,.leftNav,.page-container,#leftBody").niceScroll(
			{
			touchbehavior:false,
    		cursorcolor:"#3399FF",
   			cursoropacitymax:1,
   			cursorwidth:8,
   		 	cursorborder:"none",
   		 	cursorborderradius:"4px",
			}
		);   
  });
</script>
<script type="text/javascript" >
	var $jQuery = $;
	var jQuery = $;
	jQuery.ajaxSetup ({
		cache: false //关闭AJAX缓存
	});
</script>

<script type="text/javascript">   
	//加载等待效果,禁止ajax执行过程中的其他页面操作
	jQuery(document).ajaxStart(function () {
		layer.load(2,{shade:0.1});
	}).ajaxStop(function () {
		layer.closeAll('loading');
	});
	
	//防止form多次提交
	jQuery(function () {
	    jQuery('form').on('submit', function () {	    	
	    	layer.load(2,{shade:0.1});
	    });
	});
</script>
<%
if(ConfigHolder.getPropVal("SHIELDING_MODEL").equals("true")){
%>
<script type="text/javascript">
	document.onkeydown=hback;
	window.onhelp=returnFalse;
	document.oncontextmenu=returnValueFalse;
</script>
<%
}
%>