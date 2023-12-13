<%@ page language="java" contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE HTML>
<%
	String webCtxPath = request.getContextPath();
	String operType = (String)request.getAttribute("operType");
	if(operType == null)
		operType = "edit";
	String bindPropId = (String)request.getAttribute("bindPropId");
	if(bindPropId == null)
		bindPropId = "";
	String bindPropVal = (String)request.getAttribute("bindPropVal");
	if(bindPropVal == null)
		bindPropVal = "";
	String mainType = (String)request.getAttribute("mainType");
	if(mainType == null)
		mainType = "";
	String subType = (String)request.getAttribute("subType");
	if(subType == null)
		subType = "";
	String maxFileNumber = (String)request.getAttribute("maxFileNumber");
	if(maxFileNumber == null)
		maxFileNumber = "999";
	String inForm = (String)request.getAttribute("inForm");
	if(inForm == null ||inForm.equals(""))
		inForm = "true";
	
	String acceptFileTypes = (String)request.getAttribute("acceptFileTypes");
	if(acceptFileTypes==null || acceptFileTypes.equals(""))
		acceptFileTypes="";
	
	String maxFileSize = (String)request.getAttribute("maxFileSize");
	if(maxFileSize==null || maxFileSize.equals(""))
		maxFileSize="5000000";
%>
<html lang="zh">

<script type="text/javascript">
	var oper_type = "<%=operType%>";
	var bind_prop_id = "<%=bindPropId%>";
	var bind_prop_val = "<%=bindPropVal%>";
	var main_type = "<%= mainType%>";
	var sub_type = "<%= subType%>";
	var max_file_number = <%=maxFileNumber%>;
	var inform = "<%=inForm%>";
	var accept_file_types = "<%=acceptFileTypes%>";
	var WEB_CTX_PATH = "<%=webCtxPath%>" ;
	var max_file_size = "<%=maxFileSize%>";
</script>

<!-- Force latest IE rendering engine or ChromeFrame if installed -->
<!--[if IE]>
<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
<![endif]-->

<title>文件上传控件</title>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<meta http-equiv="expires" content="0">
<meta http-equiv="Pragma" content="no-cache">
<meta http-equiv="Cache-Control" content="no-store, must-revalidate" />

<!-- jQuery UI styles -->
<link id="theme" rel="stylesheet" href="<%=webCtxPath%>/framework/ui3/css/south-street/jquery-ui.css" type="text/css"/>

<!-- Demo styles -->
<link rel="stylesheet" href="<%=webCtxPath%>/framework/ui3/widget/file/css/jqfileupload.css">
<!--[if lte IE 8]>
<link rel="stylesheet" href="css/demo-ie8.css">
<![endif]-->

<style>
/* Adjust the jQuery UI widget font-size: */
.ui-widget {
    font-size: 0.9em;
    font-weight: normal;
}
</style>

<!-- blueimp Gallery styles -->
<link rel="stylesheet" href="<%=webCtxPath%>/framework/ui3/widget/file/css/blueimp-gallery.min.css">

<!-- CSS to style the file input field as button and adjust the Bootstrap progress bars -->
<link rel="stylesheet" href="<%=webCtxPath%>/framework/ui3/widget/file/css/jquery.fileupload.css">
<link rel="stylesheet" href="<%=webCtxPath%>/framework/ui3/widget/file/css/jquery.fileupload-ui.css">

<script src="<%=webCtxPath%>/framework/ui3/js/jquery-1.10.2.js" type="text/javascript"></script>
<script src="<%=webCtxPath%>/framework/ui3/js/jquery-ui.min.js" type="text/javascript"></script>
<!-- The Templates plugin is included to render the upload/download listings -->
<script src="<%=webCtxPath%>/framework/ui3/widget/file/js/tmpl.min.js"></script>
<!-- The Load Image plugin is included for the preview images and image resizing functionality -->
<script src="<%=webCtxPath%>/framework/ui3/widget/file/js/load-image.min.js"></script>
<!-- The Canvas to Blob plugin is included for image resizing functionality -->
<script src="<%=webCtxPath%>/framework/ui3/widget/file/js/canvas-to-blob.min.js"></script>

<script src="<%=webCtxPath%>/framework/ui3/js/json2.js"></script>
<!-- blueimp Gallery script -->
<script src="<%=webCtxPath%>/framework/ui3/widget/file/js/jquery.blueimp-gallery.min.js"></script>
<!-- The Iframe Transport is required for browsers without support for XHR file uploads -->
<script src="<%=webCtxPath%>/framework/ui3/widget/file/js/jquery.iframe-transport.js"></script>
<!-- The basic File Upload plugin -->
<script src="<%=webCtxPath%>/framework/ui3/widget/file/js/jquery.fileupload.js"></script>
<!-- The File Upload processing plugin -->
<script src="<%=webCtxPath%>/framework/ui3/widget/file/js/jquery.fileupload-process.js"></script>
<!-- The File Upload image preview & resize plugin -->
<script src="<%=webCtxPath%>/framework/ui3/widget/file/js/jquery.fileupload-image.js"></script>
<!-- The File Upload audio preview plugin -->
<script src="<%=webCtxPath%>/framework/ui3/widget/file/js/jquery.fileupload-audio.js"></script>
<!-- The File Upload video preview plugin -->
<script src="<%=webCtxPath%>/framework/ui3/widget/file/js/jquery.fileupload-video.js"></script>
<!-- The File Upload validation plugin -->
<script src="<%=webCtxPath%>/framework/ui3/widget/file/js/jquery.fileupload-validate.js"></script>
<!-- The File Upload user interface plugin -->
<script src="<%=webCtxPath%>/framework/ui3/widget/file/js/jquery.fileupload-ui.js"></script>
<!-- The File Upload jQuery UI plugin -->
<script src="<%=webCtxPath%>/framework/ui3/widget/file/js/jquery.fileupload-jquery-ui.js"></script>

<!-- The main application script -->
<script src="<%=webCtxPath%>/framework/ui3/widget/file/main.js"></script>

<!-- The XDomainRequest Transport is included for cross-domain file deletion for IE 8 and IE 9 -->
<!--[if (gte IE 8)&(lt IE 10)]>
<script src="js/cors/jquery.xdr-transport.js"></script>
<![endif]-->

</head>

<!-- <h5>附件管理</h5> -->
<body>
<!-- The file upload form used as target for the file upload widget -->
<form id="fileupload" action="<%=webCtxPath %>/jqFileUploadAction.do?method=doFileUpload&mainType=<%=mainType %>&subType=<%=subType %>&acceptFileTypes=<%=acceptFileTypes %>" method="POST" enctype="multipart/form-data">
	<!--  -->
   <input type="hidden" id="operType" name="operType" value="<%=operType %>" />
   <input type="hidden" id="bindPropId" name="bindPropId" value="<%=bindPropId %>" />
   <input type="hidden" id="bindPropVal" name="bindPropVal" value="<%=bindPropVal %>" />
   <input type="hidden" id="mainType" name="mainType" value="<%=mainType %>" />
   <input type="hidden" id="mainType" name="subType" value="<%=subType %>" />
   <input type="hidden" id="acceptFileTypes" name="acceptFileTypes" value="<%=acceptFileTypes %>" />
   
   <!-- The fileupload-buttonbar contains buttons to add/delete files and start/cancel the upload -->
   <div class="fileupload-buttonbar">
       <div class="fileupload-buttons">
           <!-- The fileinput-button span is used to style the file input field as button -->
           
           <span class="fileinput-button">
               <span>添加文件...</span>
               <input type="file" name="files[]" multiple>
           </span>
           <button type="submit" class="start">全部上传</button>
           <button type="reset" class="cancel">取消上传</button>
           <button type="button" class="delete">批量删除</button>
           <input type="checkbox" class="toggle">
           <!-- The global file processing state -->
           <span class="fileupload-process"></span>
       </div>
       <!-- The global progress state -->
       <div class="fileupload-progress fade" style="display:none">
           <!-- The global progress bar -->
           <div class="progress" role="progressbar" aria-valuemin="0" aria-valuemax="100"></div>
           <!-- The extended global progress state -->
           <div class="progress-extended">&nbsp;</div>
       </div>
   </div>
   
   	<div id="fileTypeTip" style="padding-top: 8px; font-size: 10px;"> </div>
   
   <!-- The table listing the files available for upload/download -->
   <table role="presentation" class="upTableListBox" cellpadding="0" cellspacing="0" style="width: 98%;table-layout: fixed;">
   <thead>
	<tr>
		<td style="width:10%;">选择</td>
		<td style="width:35%;">文件名称</td>
		<td style="width:15%;">尺寸</td>
		<td style="width:20%;">操作</td>
		<td style="width:20%;">进度</td>
	</tr>
	</thead>
   	<tbody class="files"></tbody>
   </table>
</form>

<br>



<!-- The template to display files available for upload -->
<script id="template-upload" type="text/x-tmpl">

{% for (var i=0, file; file=o.files[i]; i++) { %}
    <tr class="template-upload fade">
        <td style="width:10%;">
            <span class="preview"></span>
        </td>
        <td style="width: 35%;">
            <p class="name" title="{%=file.name%}">{%=file.name%}</p>
            <strong class="error"></strong>
        </td>
        <td style="width:15%;">
			<p class="size">Processing...</p>
        </td>
        <td style="width:20%;">
            {% if (!i && !o.options.autoUpload) { %}
                <button class="start" disabled>启动</button>
            {% } %}
            {% if (!i) { %}
                <button class="cancel">取消</button>
            {% } %}
        </td>
        <td style="width:20%;">
            
            <div class="progress"></div>
        </td>		
    </tr>
{% } %}
</script>

<!-- The template to display files available for download -->
<script id="template-download" type="text/x-tmpl">
{% for (var i=0, file; file=o.files[i]; i++) { %}
    <tr class="template-download fade">
        <td style="width:10%;">
			<input type="checkbox" name="delete" value="1" class="toggle">
        </td>
        <td style="width: 35%;">
			<span class="preview">
                {% if (file.thumbnailUrl) { %}
                    <a href="{%=file.url%}" title="{%=file.name%}" download="{%=file.name%}" data-gallery><img src="{%=file.thumbnailUrl%}" height="64" width="64"></a>
                {% } %}
            </span> 
            <p class="name" style="width:100%;">			
                <a href="{%=file.url%}" fileid="{%=file.id%}" {%=file.error?'error=yes':''%} title="{%=file.name%}" download="{%=file.name%}" {%=file.thumbnailUrl?'data-gallery':''%}>{%=file.name%}</a>		
			</p>
            {% if (file.error) { %}
                <div><span class="error">错误</span> {%=file.error%}</div>
            {% } %}
        </td>
        <td style="width:15%;">
            <span class="size">{%=file.size%}</span>
        </td>
        <td style="width:15%;">
			{% if (file.error) { %}
            <button class="cancel">取消</button>
            {% } else{ %}
            <button class="delete" data-type="{%=file.deleteType%}" data-url="{%=file.deleteUrl%}"{% if (file.deleteWithCredentials) { %} data-xhr-fields='{"withCredentials":true}'{% } %}>删除</button>
            {% } %}
        </td>
        <td style="width:25%;">
           <div class="progress"></div>
        </td>		
    </tr>
{% } %}
</script>


</body> 
</html>
