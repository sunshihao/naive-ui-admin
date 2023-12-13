<%@ page language="java" contentType="text/html" pageEncoding="UTF-8"%>

<%@ taglib uri="/WEB-INF/tlds/struts-html.tld" prefix="html" %>
<%@ taglib uri="/WEB-INF/tlds/struts-logic.tld" prefix="logic" %>
<%@ taglib uri="/WEB-INF/tlds/struts-bean.tld" prefix="bean" %>

<%@ page import="com.dhc.framework.base.config.ConfigHolder"%>
<%@ page import="com.dhc.framework.base.util.HttpUtil" %>
<%@ page import="java.net.*"%>
<%@ page import="javax.servlet.http.HttpSession" %>

<%
  
	//System.out.println("index sessionId:" + request.getSession().getId());
    String ctxPath = request.getContextPath();

    String userCode = "";
    Cookie[] cookies = request.getCookies();
    if (cookies != null)
    {
        for(int i = 0 ;i < cookies.length ; i ++)
        {
            if (cookies[i].getName().equals("userCode"))
            {
                userCode = URLDecoder.decode(cookies[i].getValue(), "UTF-8");
                userCode = userCode!=null?userCode.trim():"";
                break;
            }
        }
    }

   	//String radomStr = LogonUtil.getRandomStr();
    //request.getSession().setAttribute(CONFIG.RADOM_CODE,radomStr);

    response.setHeader("Pragma","No-cache");
    response.setHeader("Cache-Control","no-cache");
    response.setDateHeader("Expires", 0);
    
    String ipAddr = HttpUtil.getIpAddr(request);
%>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">

<head>
	<title>网上支付管理系统</title>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
	<meta http-equiv="X-UA-Compatible" content="IE=Edge"/>
	<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"/>
    <jsp:include page="/framework/ui4/jsp/CommonOutCSS.jsp" flush="true" />
</head>

<body onload="page_init();">
<div class="container">		
	    <p style="text-align:center">网上支付管理系统</p>
		<div class="contWrap">
	        <form class="form_style" role="form" action="<%=ctxPath%>/index.jsp" id="ui3LoginForm" method="post">	
	            <div class="inputAdd">
		            <span class="glyphicon glyphicon-user"></span>							
			        <input type="text" id="usercode" name="usercode" placeholder="请输入用户名" class="" />			          				         	
				</div>
				<div class="inputAdd">
				    <span class="glyphicon glyphicon-lock"></span>	
				    <input id="passwd" name="passwd" type="password" class="" placeholder="请输入密码" />
				</div>
				<div class="inputAdd">
				    <span class="glyphicon glyphicon-globe"></span>	
					<input type="text" id="ip" name="ip" type="text" value="<%=ipAddr%>" readonly="readonly"  class="" placeholder="IP地址" />
				</div>
				
				<%
				String failureMsg = (String)request.getAttribute("shiroLoginFailure");
				if(ConfigHolder.getPropVal("IS_VERIFY_SECURCODE").equals("true") || 
						(ConfigHolder.getPropVal("IS_VERIFY_SECURCODE").equals("2") && failureMsg!=null && !failureMsg.equals("")
						)){ 
				%>
				<div class="col-xs-12 p-0 inputAdd2">
		        	<div class="col-xs-7 p-0">
			          	<span class="glyphicon glyphicon-barcode"></span>
			        	<input id="securitycode"  name="securitycode"  type="text" class="" placeholder="请输入验证码" />	
			        </div>
			        <div class="col-xs-5 p-0">
			        	 <img id="security_img" alt="点击图片刷新" src="<%=ctxPath %>/SecurityCode.sl" />
			        </div>
		        </div>              				
              	<%} %>
     	    	<button type="button" class="btn btn-block loginBtn" id="login_Btn"  onclick="onLogin();">登录/login</button> 
     	    	<div>

				<%				
					//String failureMsg = (String)request.getAttribute("shiroLoginFailure");
					if(failureMsg!=null){
				%>
					<span class="point">
						<%= failureMsg%>
					</span>			
				<% 
					}
					
				%> 
     	    	</div>   						   		
		    </form>
		</div>
</div>
<jsp:include page="/framework/ui4/jsp/CommonOutJS.jsp" flush="true" />

<script language="javascript" type="text/javascript">
	/* $(document).ready(function(){ 
	  // to enable iPass plugin
	  $("input[type=password]").iPass();
	}); */
	function refreshSecurityCode(){
		var securityCodeImg=document.getElementById("security_img");
		if(securityCodeImg && securityCodeImg!=null){
			var d = new Date();
			securityCodeImg.src="<%=ctxPath %>/SecurityCode.sl?r="+ d;
		}
	}
	function GetLocalIPAddress(){
	     var obj = null;
	     var rslt = "";
	     try{
	         obj = new ActiveXObject("rcbdyctl.Setting");
	         rslt = obj.GetIPAddress;
	         obj = null;
	     }
	     catch(e){
	         //异常发生
	     }     
	    return rslt;
	}

	function page_init(){
		document.all("usercode").focus();
		document.all("usercode").value = "<%=userCode%>";
		document.all("passwd").value = "111";
	}

	function onLogin()
	{
		//加密		
		var oldPasswd = jQuery("#passwd").val();
		var crppas = CryptoJS.MD5(oldPasswd);
		jQuery("#passwd").val(crppas);
 		document.forms[0].submit();
	}

	function checkKey(ev){
		//针对firefox特殊处理
/* 		
		if( typeof(document.all)=="undefined" ){
			event = e;
			event.srcElement = e.target;
		} */
		 var target = ev.srcElement || ev.target; 

	  if(target.keyCode == 13)
	  {
	  	onLogin();
	  }
	}
	$(function(){
		document.onkeydown = function(e){
		    var ev = document.all ? window.event : e;
		    if(ev.keyCode==13) {
		    	onLogin();
		    }
		}
	 })
	
	</script>
</body>
</html>
<%
	request.getSession().invalidate();//清空session
	if(request.getCookies()!=null && request.getCookies().length > 0){
		Cookie cookie = request.getCookies()[0];//获取cookie 
		cookie.setMaxAge(0);//让cookie过期 ； 		
	}
%>