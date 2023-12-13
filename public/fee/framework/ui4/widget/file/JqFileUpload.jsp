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
		maxFileSize="500000000000";
	
	String batchDownload = (String)request.getAttribute("batchDownload");
	if(batchDownload == null)
		batchDownload = "";
	String zipName = (String)request.getAttribute("zipName");
	if(zipName == null)
		zipName = "";
	
	String previewImg = (String)request.getAttribute("previewImg");
	if(previewImg == null)
		previewImg = "";
	
	String operAuth = (String)request.getAttribute("operAuth");
	if(operAuth == null)
		operAuth = "";
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
	var batch_download = "<%=batchDownload%>";
	var zip_name = "<%=zipName%>";
	var preview_img = "<%=previewImg%>";
	if(preview_img=="true")preview_img = true;else preview_img = false;
	var oper_auth = "<%=operAuth%>";
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

<!-- jQuery UI styles 
<link id="theme" rel="stylesheet" href="<%=webCtxPath%>/framework/ui3/css/south-street/jquery-ui.css" type="text/css"/>-->

<!-- bootstrap 样式 -->
<link rel="stylesheet" href="<%=webCtxPath%>/framework/ui4/css/bootstrap/bootstrap.min.css"/>

<!-- Demo styles -->
<link rel="stylesheet" href="<%=webCtxPath%>/framework/ui4/widget/file/css/jqfileupload.css" />
<style>
</style>

<!--[if lte IE 8]>
<link rel="stylesheet" href="css/demo-ie8.css">
<![endif]-->

<style>
/* Adjust the jQuery UI widget font-size: */
.ui-widget {
    font-size: 0.9em;
    font-weight: normal;
}
.ui-progressbar .ui-progressbar-value {
	margin: -1px;
	height: 100%;
}

</style>

<!-- blueimp Gallery styles -->
<link rel="stylesheet" href="<%=webCtxPath%>/framework/ui4/widget/file/css/blueimp-gallery.min.css">
<!-- icon样式 -->
<!--[if !IE]><!-->
<link rel="stylesheet" href="<%=webCtxPath%>/framework/ui4/widget/font-awesome/css/font-awesome.css"/>
<link rel="stylesheet" href="<%=webCtxPath%>/framework/ui4/css/bootstrap/font-awesome.css" />
 <!--<![endif]-->
 
<!--[if IE 7]>
  <link rel="stylesheet" href="<%=webCtxPath%>/framework/ui4/css/bootstrap/font-awesome-ie7.css">
<![endif]-->

<!-- CSS to style the file input field as button and adjust the Bootstrap progress bars -->
<link rel="stylesheet" href="<%=webCtxPath%>/framework/ui4/widget/file/css/jquery.fileupload.css">
<link rel="stylesheet" href="<%=webCtxPath%>/framework/ui4/widget/file/css/jquery.fileupload-ui.css">

<!-- iLead 样式 -->
<link rel="stylesheet" href="<%=webCtxPath%>/framework/ui4/css/iLead-style.css"/>
<!-- iLead 样式 -->
<link rel="stylesheet" href="<%=webCtxPath%>/framework/ui4/css/iLead-common.css"/>
<!--[if lt IE 9]>
<link rel="stylesheet" href="<%=webCtxPath%>/framework/ui4/css/iLead-compatibility-ie8.css"/>
<![endif]-->
<style>
.ui-widget-header{
background: #2C7BCC none repeat scroll 0% 0%;
}
</style>


<!-- jquery 组件-->
<script src="<%=webCtxPath%>/framework/ui4/js/jquery-1.11.2.min.js" type="text/javascript"></script>


<script src="<%=webCtxPath%>/framework/ui4/js/jquery-ui.min.js" type="text/javascript"></script>
<!-- The Templates plugin is included to render the upload/download listings -->
<script src="<%=webCtxPath%>/framework/ui4/widget/file/js/tmpl.min.js"></script>
<!-- The Load Image plugin is included for the preview images and image resizing functionality -->
<script src="<%=webCtxPath%>/framework/ui4/widget/file/js/load-image.min.js"></script>
<!-- The Canvas to Blob plugin is included for image resizing functionality -->
<script src="<%=webCtxPath%>/framework/ui4/widget/file/js/canvas-to-blob.min.js"></script>

<!-- bootstrap 组件-->
<script type="text/javascript" src="<%=webCtxPath%>/framework/ui4/js/bootstrap/bootstrap.js"></script>

<script src="<%=webCtxPath%>/framework/ui3/js/json2.js"></script>
<!-- blueimp Gallery script -->
<script src="<%=webCtxPath%>/framework/ui4/widget/file/js/jquery.blueimp-gallery.min.js"></script>
<!-- The Iframe Transport is required for browsers without support for XHR file uploads -->
<script src="<%=webCtxPath%>/framework/ui4/widget/file/js/jquery.iframe-transport.js"></script>
<!-- The basic File Upload plugin -->
<script src="<%=webCtxPath%>/framework/ui4/widget/file/js/jquery.fileupload.js"></script>
<!-- The File Upload processing plugin -->
<script src="<%=webCtxPath%>/framework/ui4/widget/file/js/jquery.fileupload-process.js"></script>
<!-- The File Upload image preview & resize plugin -->
<script src="<%=webCtxPath%>/framework/ui4/widget/file/js/jquery.fileupload-image.js"></script>
<!-- The File Upload audio preview plugin -->
<script src="<%=webCtxPath%>/framework/ui4/widget/file/js/jquery.fileupload-audio.js"></script>
<!-- The File Upload video preview plugin -->
<script src="<%=webCtxPath%>/framework/ui4/widget/file/js/jquery.fileupload-video.js"></script>
<!-- The File Upload validation plugin -->
<script src="<%=webCtxPath%>/framework/ui4/widget/file/js/jquery.fileupload-validate.js"></script>
<!-- The File Upload user interface plugin -->
<script src="<%=webCtxPath%>/framework/ui4/widget/file/js/jquery.fileupload-ui.js"></script>
<!-- The File Upload jQuery UI plugin -->
<script src="<%=webCtxPath%>/framework/ui4/widget/file/js/jquery.fileupload-jquery-ui.js"></script>

<!-- The main application script -->
<script src="<%=webCtxPath%>/framework/ui4/widget/file/main.js"></script>

<!-- The XDomainRequest Transport is included for cross-domain file deletion for IE 8 and IE 9 -->
<!--[if (gte IE 8)&(lt IE 10)]>
<script src="js/cors/jquery.xdr-transport.js"></script>
<![endif]-->

</head>

<!-- <h5>附件管理</h5> -->
<body class="temp-p-15">
<div class="container-fluid">	
    <div class="row">		
		<div class="col-xs-12">
		    <div class="panel panel-default modal-content">
		         <div class="panel-body modal-body">
		            <!-- The file upload form used as target for the file upload widget -->
					<form id="fileupload" action="<%=webCtxPath %>/jqFileUploadAction.do?method=doFileUpload&mainType=<%=mainType %>&subType=<%=subType %>&acceptFileTypes=<%=acceptFileTypes %>" method="POST" enctype="multipart/form-data">
						<!--  -->
					    <input type="hidden" id="operType" name="operType" value="<%=operType %>" />
					    <input type="hidden" id="bindPropId" name="bindPropId" value="<%=bindPropId %>" />
					    <input type="hidden" id="bindPropVal" name="bindPropVal" value="<%=bindPropVal %>" />
					    <input type="hidden" id="mainType" name="mainType" value="<%=mainType %>" />
					    <input type="hidden" id="mainType" name="subType" value="<%=subType %>" />
					    <input type="hidden" id="acceptFileTypes" name="acceptFileTypes" value="<%=acceptFileTypes %>" />
					   <div class="row">		
		                   <div class="col-xs-12">
							    <!-- The fileupload-buttonbar contains buttons to add/delete files and start/cancel the upload -->
							    <div class="row fileupload-buttonbar">
							        <div class="fr">
							           <!-- The fileinput-button span is used to style the file input field as button -->
							           
							           <span class="btn btn-default fileinput-button">
							           <i class="fa fa-plus"></i>
							               <span>添加文件...</span>
							               <input type="file" name="files[]" multiple>
							           </span>
							           <button type="submit" class="start btn btn-default"><i class="fa fa-upload"></i><span> 全部上传</span></button>
							           <button type="reset" class="cancel btn btn-default"><i class="fa fa-minus-circle"></i><span> 取消上传</span></button>
							           <button type="button" class="delete btn btn-default"><i class="fa fa-trash"></i><span> 批量删除</span></button>
							           
							           <!-- The global file processing state -->
							           <span class="fileupload-process"></span>
							        </div>
							        <!-- The global progress state -->
							        <div class="col-xs-6 fileupload-progress fade" style="display:none">
							           <!-- The global progress bar -->
							           <div class="progress progress-striped active" role="progressbar" aria-valuemin="0" aria-valuemax="100">
							                    <div class="progress-bar progress-bar-success" style="width:100%;"></div>
							           </div>
							           <!-- The extended global progress state -->
							           <div class="progress-extended">&nbsp;</div>
							        </div>
							    </div>
							    <div class="row fileupload-view-buttonbar fr" style="display:none;">
							    	<button type="button" id="filedownbtn" class="download btn btn-default"><i class="fa fa-download"></i><span> 批量下载</span></button>
					       		</div>
					       </div>
					   </div>
					   <div class="row">						   
						   <div class="col-xs-12">
						        <div class="row">
							         <div class="col-xs-12">
							        	<div id="fileTypeTip" style="padding: 8px 0px; "> </div>
							         </div>
						        </div>
						        <div class="row">
							        <div class="col-xs-12">
									    <!-- The table listing the files available for upload/download -->
									    <table role="presentation" class="upTableListBox table table-bordered table-hover" cellpadding="0" cellspacing="0" style="width: 98%;table-layout: fixed;">
									        <thead>
									           <tr>
												<td class="td_check" style="width:5%;"><input type="checkbox" class="toggle"></td>
												<td class="td_filename" style="width:30%;">文件名称</td>
												<td class="td_filesize" style="width:10%;">尺寸</td>
												<td class="td_uptime" style="width:10%;">上传人</td>
												<td class="td_upuser" style="width:15%;">上传时间</td>
												<td class="td_oper" style="width:15%;">操作</td>
												<td class="td_process" style="width:15%;">进度</td>
										       </tr>
										    </thead>
									   	    <tbody class="files"></tbody>
									    </table>
									</div>
							    </div>
						   </div>
					   </div>
                     </form>
		         </div>
		    </div>
		</div>
	</div>	
</div>

<!-- The template to display files available for upload -->
<script id="template-upload" type="text/x-tmpl">

{% for (var i=0, file; file=o.files[i]; i++) { %}
    <tr class="template-upload">
        <td class="td_check" style="width:5%;">
        </td>
        <td class="td_filename" style="width: 30%;vertical-align: middle;text-align: center;">
            {% if (preview_img) { %}
            	<span class="preview"></span>
			{% } %}
            <p class="name" style="word-break: break-all;" title="{%=file.name%}">{%=file.name%}</p>
            <strong class="error"></strong>
        </td>
        <td class="td_filesize" style="width:10%;vertical-align: middle;text-align: center;">
			<p class="size">Processing...</p>
        </td>
        <td class="td_upuser" style="width:10%;vertical-align: middle;text-align: center;">

        </td>
        <td class="td_uptime" style="width:15%;vertical-align: middle;text-align: center;">

        </td>
        <td class="td_oper" style="width:15%;vertical-align: middle;text-align: center;">
            {% if (!i && !o.options.autoUpload) { %}
                <button class="start btn btn-default" disabled><i class="fa fa-upload"></i></button>
            {% } %}
            {% if (!i) { %}
                <button class="cancel btn btn-default"><i class="fa fa-trash"></i></button>
            {% } %}
        </td>
        <td class="td_process" style="width:15%;vertical-align: middle;text-align: center;">
            
            <div class="progress" style="height:10px;margin-bottom:0px"></div>
        </td>		
    </tr>
{% } %}
</script>

<!-- The template to display files available for download -->
<script id="template-download" type="text/x-tmpl">
{% for (var i=0, file; file=o.files[i]; i++) { %}
    <tr class="template-download">
        <td class="td_check" style="width:5%;vertical-align: middle;text-align: center;">
			<input type="checkbox" name="delete" value="1" class="toggle">
        </td>
        <td class="td_filename" style="width: 30%;vertical-align: middle;text-align: center;">
            {% if (preview_img&&file.thumbnailUrl) { %}
			    <span class="preview">
                    <a href="{%=file.url%}" title="{%=file.name%}" download="{%=file.name%}" data-gallery><img src="{%=file.thumbnailUrl%}" height="64" width="64"></a>
                </span>
            {% } %}
            <p class="name" style="width:100%;vertical-align: middle;text-align: center;word-break: break-all;">			
                <a href="{%=file.url%}" fileid="{%=file.id%}" {%=file.error?'error=yes':''%} title="{%=file.name%}" download="{%=file.name%}" {%=file.thumbnailUrl?'data-gallery':''%}>{%=file.name%}</a>		
			</p>
            {% if (file.error) { %}
                <div><span class="error">错误</span> {%=file.error%}</div>
            {% } %}
        </td>
        <td class="td_filesize" style="width:10%;vertical-align: middle;text-align: center;">
            <span class="size">{%=file.size%}</span>
        </td>
        <td class="td_upuser" style="width:10%;vertical-align: middle;text-align: center;">
            <span class="size">{%=file.upuser%}</span>
        </td>
        <td class="td_uptime" style="width:15%;vertical-align: middle;text-align: center;">
            <span class="size">{%=file.uptime%}</span>
        </td>
        <td class="td_oper" style="width:15%;vertical-align: middle;text-align: center;">
			{% if (file.error) { %}
            <button class="cancel btn btn-default"><i class="fa fa-trash"></i></button>
            {% } else{ %}
				{% if (file.deleteUrl) { %}
            		<button class="delete btn btn-default" data-type="{%=file.deleteType%}" data-url="{%=file.deleteUrl%}"
					{% if (file.deleteWithCredentials) { %} data-xhr-fields='{"withCredentials":true}'{% } %}>
						<i class="fa fa-trash"></i>
					</button>
				{% } %}
            {% } %}
        </td>
        <td class="td_process" style="width:15%;vertical-align: middle;text-align: center;">
           
        </td>		
    </tr>
{% } %}
</script>


</body> 
</html>
