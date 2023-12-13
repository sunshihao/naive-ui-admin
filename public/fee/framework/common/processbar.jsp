<%@ page contentType="text/html;charset=UTF-8" %>
<%
	String __path__ = request.getContextPath();
%>
	<STYLE type=text/css> 
		.txt-main 
		{
			font-size: 12px;
			color: #333333;
			letter-spacing: 2px;
			line-height: 19px;
		}
		.progress 
		{
			position: absolute; z-index: 1;left:expression((document.body.clientWidth -400)/2);top: expression(document.body.scrollTop + (screen.availHeight -  window.screenTop - 15)/2);
		}
		.allbody
		{
			filter: alpha(opacity=80); 
			
			background-color:#6699CC;
			layer-background-color: #6699CC;
			position: absolute; z-index: 0;height:expression(document.body.scrollHeight);left:0;top:expression(document.body.scrollTop);width:expression(document.body.scrollWidth); 
		}
		
		.miniprogress 
		{
			position: absolute; z-index: 3;left:0;top: 0;height:100%;
		}
		.miniallbody
		{
			filter: alpha(opacity=80); 
			position: absolute; z-index: 2;height:expression(document.body.scrollHeight);left:0;top:expression(document.body.scrollTop);width:expression(document.body.scrollWidth); 
		}
	</STYLE>
	
	<DIV class=allbody oncontextmenu=self.event.returnValue=false id=allbody style="DISPLAY: none"></DIV>
	<DIV class=progress oncontextmenu=self.event.returnValue=false onselectstart="return false" id=prodress style="DISPLAY: none; LEFT: 30%;" align=center><SPAN class=txt-main style="COLOR: #333399;font: bold;" id="__SHOWMESSAGE__">正在处理数据,请稍等...</SPAN>
		<TABLE height=14 cellSpacing=0 cellPadding=0 border=0>
			<TBODY>
				<TR>
					<TD><IMG height=14 src='<%=__path__%>/resource/image/processbar/left_s.gif' width=4 border=0></TD>
					<TD width=400 background='<%=__path__%>/resource/image/processbar/center_s.gif' bgColor=#ffffff>
					<MARQUEE id=progress scrollAmount=8 scrollDelay=100 direction=right><IMG height=8 src='<%=__path__%>/resource/image/processbar/progressdot.gif' width=6 border=0><IMG height=8 src='<%=__path__%>/resource/image/processbar/space.gif' width=2 border=0><IMG height=8 src='<%=__path__%>/resource/image/processbar/progressdot.gif' width=6 border=0><IMG height=8 src='<%=__path__%>/resource/image/processbar/space.gif' width=2 border=0><IMG height=8 src='<%=__path__%>/resource/image/processbar/progressdot.gif' width=6 border=0><IMG height=8 src='<%=__path__%>/resource/image/processbar/space.gif' width=2 border=0><IMG height=8 src='<%=__path__%>/resource/image/processbar/progressdot.gif' width=6 border=0><IMG height=8 src='<%=__path__%>/resource/image/processbar/space.gif' width=2 border=0><IMG height=8 src='<%=__path__%>/resource/image/processbar/progressdot.gif' width=6 border=0><IMG height=8 src='<%=__path__%>/resource/image/processbar/space.gif' width=2 border=0><IMG height=8 src='<%=__path__%>/resource/image/processbar/progressdot.gif' width=6 border=0><IMG height=8 src='<%=__path__%>/resource/image/processbar/space.gif' width=2 border=0><IMG height=8 src='<%=__path__%>/resource/image/processbar/progressdot.gif' width=6 border=0><IMG height=8 src='<%=__path__%>/resource/image/processbar/space.gif' width=2 border=0><IMG height=8 src='<%=__path__%>/resource/image/processbar/progressdot.gif' width=6 border=0><IMG height=8 src='<%=__path__%>/resource/image/processbar/space.gif' width=2 border=0><IMG height=8 src='<%=__path__%>/resource/image/processbar/progressdot.gif' width=6 border=0><IMG height=8 src='<%=__path__%>/resource/image/processbar/space.gif' width=2 border=0><IMG height=8 src='<%=__path__%>/resource/image/processbar/progressdot.gif' width=6 border=0><IMG height=8 src='<%=__path__%>/resource/image/processbar/space.gif' width=2 border=0></MARQUEE></TD>
					<TD><IMG height=14 src='<%=__path__%>/resource/image/processbar/right_s.gif' width=3 border=0></TD>
				</TR>
			</TBODY>
		</TABLE>
	</DIV>
	
	<DIV class=miniallbody oncontextmenu=self.event.returnValue=false id=miniallbody style="DISPLAY: none"></DIV>
	<DIV class=miniprogress oncontextmenu=self.event.returnValue=false onselectstart="return false" id=miniprodress style="DISPLAY: none;" align=center>
		<TABLE width="100%" height="100%" cellSpacing=0 cellPadding=0 border=0 align="center">
			<TR valign="middle">
				<td align="center" valign="middle">
					<img src="<%=__path__%>/resource/image/processbar/progbar.gif"/>
				</td>
			</TR>
		</TABLE>
	</DIV>
	