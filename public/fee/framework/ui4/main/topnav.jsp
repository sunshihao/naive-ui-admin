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
	List<String> getCurrRoles = WebSessionUtil.getCurrRoles(request);
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
				<button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-responsive-collapse">
					<span class="sr-only">toggle navigation</span>
					<span class="icon-bar"></span>
					<span class="icon-bar"></span>
					<span class="icon-bar"></span>					
				</button>
				<a class="navbar-brand" href="#">The New iLead Frame</a>
			</div>

			<div class="topNav collapse navbar-collapse navbar-responsive-collapse">
				<ul class="nav navbar-nav">
				    <li id="home" onclick="UI4.topNav.current(this, '<%=contextPath%>/framework/ui4/main/leftnav_new.jsp')">
						<a href="#"  class="current"><i class="icon-home"></i>首页</a>
					</li>
					 <%
						String parentid = request.getParameter("parentid");
						String secBoardScript = "";
						List rootMenulist = (List)session.getAttribute(CONFIG.ROOT_MENU);
						AuthFunction func = null;
						if(rootMenulist != null){
							for(int i=0;i<rootMenulist.size();i++)
							{
								func = (AuthFunction)rootMenulist.get(i);
								String encName = URLEncoder.encode(func.getFunctionName(), "UTF-8");
		 			 %>
					<li id="topnav-li-<%=i %>" onclick='UI4.topNav.current(this,"<%=contextPath%>/framework/ui4/main/leftnav.jsp?rootMenuId=<%=func.getFunctionId()%>&rootMenuName=<%=encName%>")'>
						<a href="#"><i class="<%=func.getIconClass()%>"></i><%=func.getFunctionName() %></a>
					</li>
					<%
							}
						}
					%>
					
				</ul>
			</div>

			<!-- 用户信息 -->
			<div class="user-name pull-right dropdown">
				<a class="user-down dropdown-toggle" href="#" data-toggle="dropdown">
					<img src="<%=contextPath %>/framework/ui4/img/frame/avatar1_small.jpg" alt="">
					<span class="username"><%=currentUser==null?"Unknown":currentUser %></span>
					<b class="caret"></b>
				</a>
				<ul class="dropdown-menu" role="menu" aria-labelledby="dropdownMenuDivider">
				  <div class="log-arrow-up"></div>
				<%--   <li onclick="UI4.topNav.changeUserPwd('<%=currUserId %>')">
				  	<a href="#"><span class="glyphicon glyphicon-user"></span>修改密码</a>
				  </li> --%>
				  <li role="presentation" class="divider"></li>
				  <li onclick="UI4.topNav.logoutCurUser()">
				  <a href="#"><span class="glyphicon glyphicon-log-out"></span>退出</a>
				  </li>
				</ul>
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
