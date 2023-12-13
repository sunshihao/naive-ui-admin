<%@ page contentType="text/html;charset=UTF-8" %>
<%@ page import="java.util.Map"%>
<%@ page import="java.util.HashMap"%>
<%@ page import="java.util.List"%>
<%@ page import="java.net.URLDecoder" %>
<%@ page import="java.net.URLEncoder" %>
<%@ page import="com.dhc.framework.base.util.SpringUtils"%>
<%@ page import="com.dhc.framework.auth.func.as.AuthFunctionAS"%>
<%@ page import="com.dhc.framework.base.config.CONFIG"%>
<%@ page import="com.dhc.framework.base.config.ConfigHolder"%>
<!DOCTYPE html>

<html lang="zh-CN">
<head>
<jsp:include page="/framework/ui4/jsp/IEHeader.jsp" flush="true" />
<title>left</title>
<%
    int maxMenuCharSize = Integer.valueOf(ConfigHolder.getPropVal("MAX_MENU_CHAR_SIZE"));
	List<Map> subMenuList = null;
	String userId = (String)session.getAttribute(CONFIG.LOGON_USERID);
	String rootNodeId = request.getParameter("rootMenuId");
	String encRootMenuName = request.getParameter("rootMenuName");
	String rootMenuName = null;
	if(encRootMenuName != null){
		rootMenuName = new String(encRootMenuName.getBytes("iso-8859-1"),"utf-8");
		rootMenuName = java.net.URLDecoder.decode(rootMenuName,"UTF-8");

	}else
		rootMenuName="";
	if(rootNodeId != null && rootNodeId.length() > 0){
		//获取topframe的当前菜单的子菜单列表
		Map<String,String> paraMap = new HashMap<String,String>();
		paraMap.put("rootNodeId", rootNodeId);
		paraMap.put("userId", userId);
		subMenuList = ((AuthFunctionAS)SpringUtils.getAppService("AuthFunctionAS")).getSubMenusByUserAndParent(paraMap);
	}else{
		rootMenuName = "首页";
	}
	String contextPath = request.getContextPath();
%>
</head>

<body>
<div class="leftNav">
    
        <%
        	if(subMenuList!=null && subMenuList.size()>0){
        		Map menu = null;
        		//String absFuncUrl = null;
        		int childSum = 0;
        		String encName1 = null,encName2 = null;
        		encName1 =  URLEncoder.encode(rootMenuName, "UTF-8");
        		
        		for(int i=0 ; i<subMenuList.size() ; i++){
        			menu = subMenuList.get(i);
        			//absFuncUrl = contextPath + (String)menu.get("functionUrl");
        			if(menu.get("childSum") != null)
        				childSum = (Integer)menu.get("childSum");
        			else
        				childSum = 0;
        			/* String rightUrl = contextPath + "/framework/ui_dblue/main/right.jsp?functionId=" 
        			+ menu.get("functionId") + "&" + functionUrl; */
        			//childSum>0,本级节点不是叶子节点 
        			//nodeType=0 叶子节点 ，nodeType=1 非叶子节点
        			encName2 = URLEncoder.encode((String)menu.get("functionName"), "UTF-8");
        			String functionName = (String)menu.get("functionName");
        			if(childSum > 0){ //非叶子节点
        				//添加三级菜单
        				
        %>
        <div class="panel-group" id="accordion" role="tablist">
            <div class="panel panel-default">
			    <div class="panel-heading" role="tab" id="heading<%=i %>">
			      <h4 class="panel-title">
			        <a data-toggle="collapse" data-parent="#accordion" href="#" onclick="UI4.leftNav.openRightFrame('1','<%=menu.get("functionId")%>','<%=encName1 %>','<%=encName2%>','<%=menu.get("functionUrl")%>',this)" aria-expanded="false" aria-controls="leftnav-li-<%=menu.get("functionId") %>" style="padding-left: 15px;">
			             <% 
							if(menu.get("functionName") != null) {
								//functionName.replaceAll("(.{" + maxMenuCharSize + "}).*", "$1...")
								out.write(SpringUtils.subTextString(functionName, maxMenuCharSize));								
							}					    
						    
						 %>
			          <span class="glyphicon glyphicon-menu-down"></span>
			        </a>
			      </h4>
			    </div>
			    <div id="leftnav-li-<%=menu.get("functionId") %>" class="panel-collapse collapse" role="tabpanel" aria-labelledby="heading<%=i %>">
			        <div>
				        <ul class="leftnav_li_<%=menu.get("functionId") %>">
				            
				        </ul>
			        </div>
			    </div>
            </div>
        </div>
            
        <% 				
        			}else{ //叶子节点，右侧直接打开对应页面
        %>
        
	        <ul>   		 
	       		 <li id="leftnav-li-<%=i%>" onclick="UI4.leftNav.openRightFrame('0','<%=menu.get("functionId")%>','<%=encName1 %>','<%=encName2%>','<%=contextPath+menu.get("functionUrl") %>',this)">
	       		 	<a href="#" data-toggle="tooltip" data-placement="bottom" title="<%=menu.get("functionName") %>">
						<i class="<%=menu.get("iconClass") %>"></i>
						<span class="left-nav-text"> <% 
							if(menu.get("functionName") != null) {
								out.write(SpringUtils.subTextString(functionName, maxMenuCharSize));
							}					    						    
						%></span>
			        </a>
	       		 </li>
	       	</ul>
	     
        <%				
        			}
        		}
        	}
        %>
    
</div>
<!-- 导航js -->
<script src="<%=contextPath %>/framework/ui4/main/jquery-leftNav.js" type="text/javascript"></script>
<script>
	$(function () { $("[data-toggle='tooltip']").tooltip(); });
</script>
</body>
</html>