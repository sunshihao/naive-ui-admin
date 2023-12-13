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
<jsp:include page="/framework/ui4/widget/bootstrap-menu/BSMenuCSS.jsp" flush="true" />
<title>LEFT</title>
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
<div id="leftBody" >
	<div class="page-container">
	    <div class="page-sidebar-wrapper">
	        <div class="page-sidebar navbar-collapse collapse">
	        	<div id="retract" class="menu-toggler sidebar-toggler" style="position:absolute;z-index:99"><i class="icon iconfont icon-caidan"></i></div>
	            <ul id="BSLeftMenu" class="page-sidebar-menu   " data-keep-expanded="false" data-auto-scroll="true" data-slide-speed="200">
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
					 <li class="nav-item  " id="topnav-li-<%=func.getFunctionId() %>">
					 	<a href="javascript:;" class="nav-link nav-toggle topNav" onclick="UI4.leftNav.showSecondNav('<%=func.getFunctionId() %>', '<%=currUserId %>', '<%=func.getFunctionName() %>')">
                            <i class="<%=func.getIconClass()%>"></i>
                            <span class="title"><%=func.getFunctionName() %></span>
                            <span class="arrow"></span>
                        </a>
                        <ul class="sub-menu">
                        </ul>
					 </li>
					<%
							}
						}
					%>
	            </ul>
	        </div>
	    </div>
	</div>
</div>
<jsp:include page="/framework/ui4/widget/bootstrap-menu/BSMenuJS.jsp" flush="true" />
<script src="<%=contextPath %>/framework/ui4/main/left-theme/sideba/left.js" type="text/javascript"></script>
</body>
</html>
