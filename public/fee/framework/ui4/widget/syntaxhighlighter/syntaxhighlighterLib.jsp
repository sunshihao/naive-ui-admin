<%@ page contentType="text/html;charset=UTF-8" %>
<%
  // 获得应用上下文
  String shPath = request.getContextPath();
%>
<link type="text/css" rel="stylesheet" href="<%=shPath%>/framework/ui4/widget/syntaxhighlighter/styles/shCoreEclipse.css"/>
<script type="text/javascript" src="<%=shPath%>/framework/ui4/widget/syntaxhighlighter/scripts/shCore.js"></script>
<script type="text/javascript" src="<%=shPath%>/framework/ui4/widget/syntaxhighlighter/scripts/shBrushJScript.js"></script>
<script type="text/javascript" src="<%=shPath%>/framework/ui4/widget/syntaxhighlighter/scripts/shBrushXml.js"></script>
<script type="text/javascript">
    SyntaxHighlighter.defaults['toolbar'] = false;
    SyntaxHighlighter.all();
</script>
