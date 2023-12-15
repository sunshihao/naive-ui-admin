<%@ page contentType="text/html;charset=UTF-8" %>
<%
	String webCtxPath = request.getContextPath();
%>
<script src="<%=webCtxPath %>/framework/resource/highcharts/js/highcharts.js"></script>
<script src="<%=webCtxPath %>/framework/resource/highcharts/js/modules/exporting.js"></script>

<script src="<%=webCtxPath %>/framework/resource/highcharts/js/modules/canvas-tools.js"></script>

<script src="<%=webCtxPath %>/framework/resource/highcharts/js/plugins/export-csv.js"></script>
<script type="application/javascript" src="<%=webCtxPath %>/framework/resource/highcharts/js/plugins/jspdf.min.js"></script>

<script src="<%=webCtxPath %>/framework/resource/highcharts/js/plugins/highcharts-export-clientside.js"></script>
<script src="<%=webCtxPath %>/framework/resource/highcharts/highcharts-ilead.js"></script>