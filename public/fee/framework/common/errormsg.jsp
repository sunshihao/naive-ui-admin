<%@ page contentType="text/html;charset=UTF-8" %>
<%@ taglib uri="/WEB-INF/tlds/struts-html.tld" prefix="html" %>
<%@ taglib uri="/WEB-INF/tlds/struts-logic.tld" prefix="logic" %>
<%@ taglib uri="/WEB-INF/tlds/struts-bean.tld" prefix="bean" %>

<logic:messagesPresent>
<div id="MainArea">
 	<div class="ItemBlockBorder">
		<div class="ItemBlock">
			<div align="justify">
				<div id="MainArea2">
					<font color=blue><b>提示：</b></font>
					<table cellpadding="0" cellspacing="0" class="TableStyle" style="margin-left: 30px;">
						<html:messages id="message" >
							<tr>
								<td style="color:red">·&nbsp;<bean:write name="message"/></td>
							</tr>
						</html:messages>
					</table>
				</div>
			</div>
		</div>
	</div>
</div>
</logic:messagesPresent> 