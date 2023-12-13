<%@ page contentType="text/html;charset=UTF-8" %>
<%@ page import="java.util.*"%>
<%@ page import="java.net.*" %>
<%@ page import="com.dhc.framework.auth.func.domain.AuthFunction"%>
<%@ page import="com.dhc.framework.base.config.CONFIG"%>
<%@ page import="com.dhc.framework.auth.count.domain.SysSessionStat"%>
<%@ page import="com.dhc.framework.base.util.WebSessionUtil"%>
<!DOCTYPE html>
<html lang="zh-CN">
<head>
<jsp:include page="/framework/ui4/jsp/IEHeader.jsp" flush="true" />
<title>topnav</title>
<%
	String contextPath = request.getContextPath();
	
	//当前用户
	String currentUser = WebSessionUtil.getCurrUserName(request);
	currentUser += "(" + WebSessionUtil.getCurrUserCode(request) + ")";
	String currUserId = WebSessionUtil.getCurrUserId(request);
	
	//统计信息
	String onlineCount = String.valueOf((Integer)request.getSession().getServletContext().getAttribute("onlineCount"));	
	String allCount = String.valueOf((Integer)request.getSession().getServletContext().getAttribute("allCount"));
%>
</head>

<body>
<nav class="navbar navbar-default">
    <div class="container-fluid">
  	<div class="row">
	<!-- 导航 -->
		<div class="navbar navbar-default">
			<div class="navbar-header">
				<div class="page-header navbar" >
				
				<div class=" logo-box">
					<img src="../img/xj/xj-logo.png">
                </div>	
				<div class="nav-line"></div>
				<a class="navbar-title"><p class="china">网上支付管理系统</p><p class="eng">Online Payment Management System</p></a>	
                <a href="javascript:;" class="menu-toggler responsive-toggler" data-toggle="collapse" data-target=".navbar-collapse"> </a>
				</div>  
				<!-- <button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-responsive-collapse">
					<span class="sr-only">toggle navigation</span>
					<span class="icon-bar"></span>
					<span class="icon-bar"></span>
					<span class="icon-bar"></span>					
				</button>	 -->							
		
			</div>
			<div class="topNav collapse navbar-collapse navbar-responsive-collapse">								
			</div>
			<!-- 用户信息 -->
			<div class="header-right">
		
<!-- 				<div class="dropdown header-menu1">
					<a class="btn btn-default dropdown-toggle" data-toggle="modal" data-target="#myModal">金融系统</a>
				</div>
				<div class="fl remind">
					<a title="首页" id="homeBtn"><i class="icon iconfont icon-shouye"></i></a>
				</div>
				<div class="fl remind"><i class="icon iconfont icon-tixing"></i><span class="red-prompt"></span></div>
				<div class="fl news"><i class="icon iconfont icon-xuqiu"></i><span class="red-prompt"></span></div>
-->
				<div class="user-name pull-right dropdown">	
					<a class="user-down dropdown-toggle" href="#" data-toggle="dropdown">
						<img src="<%=contextPath %>/framework/ui4/img/frame/avatar1_small.jpg" alt="">
						<span class="username"><%=currentUser==null?"Unknown":currentUser %></span>
						<b class="caret"></b>
					</a>
					<ul class="dropdown-menu" role="menu" aria-labelledby="dropdownMenuDivider">
					 <!--  <div class="log-arrow-up"></div> -->
					  <%-- <li onclick="UI4.topNav.changeUserPwd('<%=currUserId %>')">
					  	<a href="#"><span class="glyphicon glyphicon-user"></span>修改密码</a>
					  </li> --%>
					 <!--  <li role="presentation" class="divider"></li> -->
					  <li onclick="UI4.topNav.logoutCurUser()">
					  <a href="#"><span class="glyphicon glyphicon-log-out"></span>退出</a>
					  </li>
					</ul>
				</div>
			</div>
		<!-- 用户信息 结束 -->
		</div>	
		<!-- 导航结束 -->
	</div>
  </div>
</nav>

<script src="<%=contextPath %>/framework/ui4/main/jquery-topNav.js" type="text/javascript"></script>
</body>
</html>
