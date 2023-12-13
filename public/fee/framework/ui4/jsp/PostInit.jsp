<!-- 本jsp通常由业务应用jsp在page 尾部加载，用于进行页面初始化后的通用处理 -->
<%@ page contentType="text/html;charset=UTF-8" %>
<%@ page import="com.dhc.framework.base.config.ConfigHolder" %>
<%@ page import="com.dhc.framework.base.util.WebSessionUtil" %>
<%
	String webCtxPath = request.getContextPath();
	String userLang = WebSessionUtil.getUserLanguage(request);
%>
<script type="text/javascript">
	//定义js全局变量WEB_CTX_PATH
	var WEB_CTX_PATH = "<%=webCtxPath%>";
	var LOCALE_LANG  = "<%=userLang%>";
</script>
<!-- ilead公共 组件-->
<script src="<%=webCtxPath%>/framework/common/js/common-util.js" type="text/javascript"></script>
<!-- jquery 组件-->
<script src="<%=webCtxPath%>/framework/ui4/js/jquery-1.11.2.min.js" type="text/javascript"></script>
<!-- jquery from 组件-->
<script src="<%=webCtxPath%>/framework/ui4/js/jquery.form.js" type="text/javascript"></script>
<!-- jquery validate -->
<script src="<%=webCtxPath%>/framework/ui4/widget/validate/js/jquery.metadata.js" type="text/javascript"></script>
<script src="<%=webCtxPath%>/framework/ui4/widget/validate/js/jquery.validate.js" type="text/javascript"></script>
<script src="<%=webCtxPath%>/framework/ui4/widget/validate/js/jquery.validate.method.js" type="text/javascript"></script>
<script src="<%=webCtxPath%>/framework/ui4/widget/validate/js/validate_msg/messages_<%=userLang%>.js" type="text/javascript"></script>
<!-- bootstrap 组件-->
<script type="text/javascript" src="<%=webCtxPath%>/framework/ui4/js/bootstrap/bootstrap.min.js"></script>
<!-- jqGrid 组件-->
<script type="text/javascript" src="<%=webCtxPath%>/framework/ui4/widget/jqgrid/js/jquery.jqGrid.js"></script>
<script type="text/javascript" src="<%=webCtxPath%>/framework/ui4/widget/jqgrid/js/jquery.jqGrid.ilead.js"></script>
<script type="text/javascript" src="<%=webCtxPath%>/framework/ui4/widget/jqgrid/js/grid.locale-cn.js"></script>
<!--layui 时间控件  -->
<script type="text/javascript" src="<%=webCtxPath%>/framework/ui4/widget/layui/js/laydate.js"></script>
<script type="text/javascript" src="<%=webCtxPath%>/framework/ui4/widget/layui/js/layer.js"></script>
<script type="text/javascript" src="<%=webCtxPath%>/framework/ui4/widget/bootstrap-modallayer/js/modal_layer.js"></script>
<!--layui 弹出层控件
<script type="text/javascript" src="<%=webCtxPath%>/framework/ui4/widget/layui/layer/js/layer.js"></script>
<script type="text/javascript" src="<%=webCtxPath%>/framework/ui4/widget/layui/layer/js/extend/layer.ext.js"></script>  -->
<!-- select2 下拉（ajax，自动补全）组件  -->
<script type="text/javascript" src="<%=webCtxPath%>/framework/ui4/widget/select2/js/select2.js"></script>
<script type="text/javascript" src="<%=webCtxPath%>/framework/ui4/widget/select2/js/select2.ext.js"></script>
<script type="text/javascript" src="<%=webCtxPath%>/framework/ui4/widget/select2/js/i18n/zh-CN.js"></script>
<script type="text/javascript" src="<%=webCtxPath%>/framework/ui4/main/select-util.js"></script>
<!-- sweetalert样式  -->
<script type="text/javascript" src="<%=webCtxPath%>/ecside/sweetalert/sweetalert.min.js"></script>
<!-- 国际化支持 -->
<%
	if("true".equals(ConfigHolder.getPropVal("GLOBALIZE_SUPPORT"))) {
%>
<script type="text/javascript" src="<%=webCtxPath%>/framework/resource/globalize/jquery.i18n.properties.js"></script>
<%
	}
%>
<%-- loading效果 --%>
<%--iLead框架引用的扩展js库 --%>
<script src="<%=webCtxPath%>/framework/ui4/js/global.js" type="text/javascript"></script>
<script src="<%=webCtxPath%>/framework/ui4/js/ui4-common.js" type="text/javascript"></script>
<script src="<%=webCtxPath%>/framework/ui4/js/form-util.js" type="text/javascript"></script>
<!-- jquery 滚动条 -->
<script type="text/javascript" src="<%=webCtxPath%>/framework/ui4/widget/scroll/js/jquery.nicescroll.js"></script>
<script>
	$(document).ready(function() {
		var nice = $("body").niceScroll(
				{
					touchbehavior:false,
					cursorcolor:"#3399FF",
					cursoropacitymax:1,
					cursorwidth:8,
					cursorborder:"none",
					cursorborderradius:"4px"
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
	//workflowurl
	var FROM_WORK_FLOW_URL="http://172.16.1.53:8080";
	// 工作流
	var doAppStatusFlow=function(title,becomeId,busiFunctionId) {
		/* 		jQuery().openDlg({
		 width: 1000,
		 height: 450,
		 url : FROM_WORK_FLOW_URL + "/wf/InterApproveAction.do?method=doforwardApproveView&busiCode=" + becomeId + "&busiFunctionId="+busiFunctionId,
		 title: title,
		 callBackFun: function(){
			 alert("parent");
		 },
		 data: {

		 }
	}); */
		layer.open({
			type : 2,
			title : title,
			content: FROM_WORK_FLOW_URL + "/wf/InterApproveAction.do?method=doforwardApproveView&busiCode=" + becomeId + "&busiFunctionId="+busiFunctionId,
			fix : true,
			area  :  ['100%', '100%'],
			//     /*注释部分功能：弹窗后立即最大化*/
			success: function(layerObj){
				var currLayer = jQuery(layerObj);
				currLayer.css({top:"0px",left:"0px",width:"100%",height:jQuery(window).height()})
						.find("iframe").css("height",jQuery(window).height()-50);
			}
		})
	}
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