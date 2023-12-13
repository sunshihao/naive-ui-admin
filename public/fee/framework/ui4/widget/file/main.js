
/* global $, window */

$(function () {
    'use strict';

    // Initialize the jQuery File Upload widget:
    $('#fileupload').fileupload({
        // Uncomment the following to send cross-domain cookies:
        //xhrFields: {withCredentials: true},
        //url: 'server/php/'
    });

    // Enable iframe cross-domain access via redirect option:
    $('#fileupload').fileupload(
        'option',
        'redirect',
        window.location.href.replace(
            /\/[^\/]*$/,
            '/cors/result.html?%s'
        )
    );
    
    var fileTypeFunc = function(){
    	if(accept_file_types && accept_file_types.length>0){
    		var file_types = accept_file_types.split(",");
    		var typeStr = "";
    		if(file_types!=null){
    			for(var i=0;i<file_types.length;i++){
    				if(i<file_types.length-1)
    					typeStr = typeStr + file_types[i] + "|";
    				else
    					typeStr = typeStr + file_types[i];
    			}
    		}
    		return "/(\\.|\\/)(" + typeStr + ")$/i";
    	}else
    		return undefined;
    };
    
   var fileTypePattern = fileTypeFunc();
//    if (window.location.hostname === 'localhost') {
    	
        // Demo settings:
        $('#fileupload').fileupload('option', {
            //url: '//jquery-file-upload.appspot.com/',
            // Enable image resizing, except for Android and Opera,
            // which actually support image resizing, but fail to
            // send Blob objects via XHR requests:
            disableImageResize: /Android(?!.*Chrome)|Opera/
                .test(window.navigator.userAgent),
            maxFileSize: max_file_size,
            //acceptFileTypes: /(\.|\/)(gif|jpe?g|png)$/i,
            acceptFileTypes: eval(fileTypePattern),
            dropZone: null,
            pasteZone: null,
//            fileInput: null,
            maxNumberOfFiles: max_file_number,
            autoUpload:false,
            //disabled: true,
            messages: {
            	uploadedBytes: '超出上传文件最大尺寸',
                maxNumberOfFiles: '超出最大文件数量',
                acceptFileTypes: '不支持此文件类型',
                maxFileSize: '文件太大',
                minFileSize: '文件太小'
            }
        });
    
//        if(!oper_type || oper_type != "edit"){
//        	$('#fileupload').fileupload("disable");
//        }
        	
        // Upload server status check for browsers with CORS support:
/*        if ($.support.cors) {
            $.ajax({
                url: WEB_CTX_PATH,
                type: 'HEAD'
            }).fail(function () {
                $('<div class="alert alert-danger"/>')
                    .text('Upload server currently unavailable - ' +
                            new Date())
                    .appendTo('#fileupload');
            });
        }*/
//    } else {
// 
//        // Load existing files:
//        $('#fileupload').addClass('fileupload-processing');
//        $.ajax({
//            // Uncomment the following to send cross-domain cookies:
//            //xhrFields: {withCredentials: true},
//            url: $('#fileupload').fileupload('option', 'url'),
//            dataType: 'json',
//            context: $('#fileupload')[0]
//        }).always(function () {
//            $(this).removeClass('fileupload-processing');
//        }).done(function (result) {
//            $(this).fileupload('option', 'done')
//                .call(this, $.Event('done'), {result: result});
//        });
//    }

});

$().ready(function(){
	if(accept_file_types && accept_file_types.length>0){
		$("#fileTypeTip").html("允许上传的文件类型包括：【<span style='color: #FF0000;'>" + accept_file_types + "</span>】");
	}
	//为了加载时就立即排好页面，将显示部分先处理
    if(oper_type == "view"){
    	$('.fileupload-buttonbar').attr('style','display:none');
    	$('.td_check,.td_oper,.td_process').css("display","none");
    	
    	resizeTdForView();
    	if(batch_download == "true")
    		$('.fileupload-view-buttonbar').css("display","inline");
    }
	
	if(bind_prop_val && bind_prop_val!="" && bind_prop_val != 'undefined'){
		$('#fileupload').addClass('fileupload-processing');
		$.ajax({
			url: WEB_CTX_PATH + "/jqFileUploadAction.do?method=getFileList&bindPropVal="+ bind_prop_val 
				+"&mainType="+ main_type +"&subType="+ sub_type +"&inForm="+ inform +"&operAuth="+ oper_auth,
			dataType: "json",
			context: $('#fileupload')[0]
		}).always(function () {
          $(this).removeClass('fileupload-processing');
	    }).done(function (result) {
	            $(this).fileupload('option', 'done')
	                .call(this, $.Event('done'), {result: result});
	            if(oper_type == "view"){
//	            	$('#fileupload').fileupload("disable");
	            	$('.td_check,.td_oper,.td_process').css("display","none");
            		resizeTdForView();
	            	if(batch_download == "true"){
		            	$('.td_filename').css("width","45%");
	                	$('.td_check').css("display","");
	                	$('.toggle').removeAttr("disabled").removeClass("disabled");
		            	$('#filedownbtn').click(function (e) {
		            		debugger
		                    e.preventDefault();
		                    var fileIds = "",fileName = "",fileNames = "",fileSuffixs = "";
		                    $('.toggle:checked')
	                        .closest('.template-download')
	                        .find(".td_filename a").each(function(){
		                    	if(this.getAttribute("fileid")){
		                        	fileIds += this.getAttribute("fileid")+",";
		                        	fileName = this.getAttribute("href").substring(this.getAttribute("href").indexOf("fileName")+9,this.getAttribute("href").indexOf("fileSuffix")-1);
		                        	fileNames += fileName+",";
		                        	fileSuffixs += fileName.substring(fileName.lastIndexOf(".")+1)+",";
		                    	}
		                    });
		                    if(fileIds){
			                    window.location.href = WEB_CTX_PATH+"/jqFileUploadAction.do?method=getBatchFile" +
			                    		"&fileId="+fileIds+"&fileName="+fileNames+"&fileSuffix="+fileSuffixs+"&mainType="+main_type+"&subType="+sub_type+"&zipName="+zip_name;
		                    }
		                });
		            	$('#filedownbtn').removeAttr("disabled").removeClass("disabled");
	            	}
	            }
	    });
	}
}
);


function pickupDownloadTempl(){
	var downFileRows = $(".files:first").find(".template-download");
	var fileIds = "";
//	if(downFileRows && downFileRows.length>0){
//		for(var i=0 ;i<downFileRows.length;i++){
//			var file = $(downFileRows[i]).find("a .name");
//			if(file){
//				var fileid = file.attr("fileid");
//				if(fileid && fileid!=null)
//					fileIds = fileIds + "," + fileid;
//			}
//		}		
//	}
	$(downFileRows).each(function(i){
		   var file = $(this).find("td p a");
		   if(file && file.length > 0){
			   var fileid = $(file)[0].getAttribute("fileid");
			   var error = $(file)[0].getAttribute("error");
			   if(fileid && fileid!=null && !error)
				   fileIds = fileIds + "," + fileid;
		   }
	});
	if(fileIds.length>0)
		fileIds = fileIds.substring(1);
	return fileIds;
}

function resizeTdForView(){
	$('.td_filename').css("width","50%");
	$('.td_filesize').css("width","10%");
	$('.td_upuser').css("width","20%");
	$('.td_uptime').css("width","20%");
}