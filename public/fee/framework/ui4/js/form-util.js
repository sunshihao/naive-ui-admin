(function ($) {
$.initForm = $.initForm||{};

/**
 * 用ajax请求返回的json串初始化form元素
 */
$.fn.initForm = function(config ) {
	var config=$.extend({
			url		:null,
			elem	:this.attr("id"),
			type	:'POST'
		}, config || {});

	if(config.url){
		$.ajax({type: config.type,url: config.url,data:$.extend({initForm:config.elem},config.data||{}),dataType: "json",async: false,
			success: function(data){
				config.data=data;
			}
		});
	}
	if(config.data){//初始化input [type =text password hidden button reset submit checkbox radio] select textarea
		$("#"+config.elem).find("input,select,textarea").each(function(){
			var elemType=$(this).attr("type")==undefined?this.type:$(this).attr("type");
			var elemName=$(this).attr("name");
			var elemData=config.data[elemName];
			if(!$("#"+config.elem).attr("loadedInit")&&$(this).attr("loadurl")){
				switch(elemType){
					case "checkbox":
					case "radio":
					case "select":
					case "select-one":
					case "select-multiple":{
						var _this =this;
						$.ajax({type: config.type,url: $(this).attr("loadurl"),dataType: "json",async: false,success: function(data){	
							if(elemType=="select"||elemType=="select-one"||elemType=="select-multiple"){
								$(_this).empty();
							}
							for (var elem in data){
									if(elemType=="select"||elemType=="select-one"||elemType=="select-multiple"){
										$(_this).append("<option value='"+data[elem].value+"'>"+data[elem].display+"</option>");
									}else{
										$(_this).after('<input type="'+elemType+'"  name="'+elemName+'" value="'+data[elem].value+'" />'+data[elem].display);
									}
								}
								if(elemType=="checkbox"||elemType=="radio")$(_this).remove();
							}
						});
						break;
					}
				}
			}
			
			if(typeof(elemData)!="undefined" && elemData!=null){
				switch(elemType){
					case undefined:
					case "text":
					case "password":
					case "hidden":
					case "button":
					case "reset":
					case "textarea":
					case "submit":{
						if(typeof(elemData)=="string"){
							$(this).val(elemData.toUpperCase()=="NULL"?"":elemData);
						}else{
							$(this).val(elemData+"");
						}
						
						$(this).attr("title", this.value);
						break;
					}
					case "checkbox":
					case "radio":{
						$(this).prop("checked",false);
						if(elemData.constructor==Array){//checkbox multiple value is Array
							for (var elem in elemData){
								if(elemData[elem]==$(this).val()){
									$(this).prop("checked",true);
								}
							}
						}else{//radio or checkbox is a string single value
							if(elemData==$(this).val()){
								$(this).prop("checked",true);
							}
						}
						break;
					}
					case "select":
					case "select-one":
					case "select-multiple":{
						var selectedName="";
						$(this).find("option:selected").prop("selected",false);
						if(elemData.constructor==Array){
							for (var elem in elemData){
								$(this).find("option[value='"+elemData[elem]+"']").prop("selected",true);
								selectedName = selectedName + $(this).find("option[value='"+elemData[elem]+"']").text() + ",";
							}
						}else{
							$(this).find("option[value='"+elemData+"']").prop("selected",true);
							selectedName = $(this).find("option[value='"+elemData+"']").text();
						}
						
						$(this).attr("title",selectedName);
						
						break;
					}
				}
			}
		});
	}

	
};

/*
 * coinfig = {
 * 	initItems:[
 * 		element_name1:[
 * 			{"code":code11,"name":name11},{"code":code12,"name":name12}
 * 		],
 * 		element_name2:[
 * 			{"code":code21,"name":name21},{"code":code22,"name":name22},{"code":code23,"name":name23}
 * 		]
 * 	]
 * }
 */

/**
 * 初始化下拉表单
 */
$.fn.initItems = function(config){
	var l_config=$.extend({
		url		:null,
		element	:this.attr("id"),
		type	:'POST'
	}, config || {});
	
	if(!$("#"+l_config.element).attr("loadedInit")){
		if(l_config.initItems){ //初始化 checkbox radio select
			for (var elem in l_config.initItems){ //循环初始化每个元素
				
				var arrayData=l_config.initItems[elem]; //指定元素的可选项数组
				var input_element=$("#"+l_config.element+" input[name='"+elem+"']");
				if(input_element){
					var elemType=input_element.attr("type");
					var elemName=input_element.attr("name");
					//var initElem=$("#"+config.elem+" input[name='"+elem+"']");
					switch(elemType){
						case "checkbox":
						case "radio":
							for (var i=0;i<arrayData.length;i++){
								input_element.after('<input type="'+elemType+'"  name="'+elemName+'" value="'+arrayData[i].code+'" />'+arrayData[i].name);
							}
							input_element.remove();
							break;
					}
				} 
				var sel_element = $("#"+l_config.element+" select[name='"+elem+"']");
				if(sel_element){
					for (var i=0;i<arrayData.length;i++){
						sel_element.append("<option value='"+arrayData[i].code+"'>"+arrayData[i].name+"</option>");					
					}				
				}
			}
		}
		if(l_config.initLabels){//label
			$("#"+l_config.element+" label").each(function(){
				var labelFor=$(this).attr("for");
				if(l_config.initLabels[labelFor]){
					$(this).html(l_config.initLabelsl[labelFor]);
				}
			});
		}
	}
	
	$("#"+config.elem).attr("loadedInit","true");//设置loadedInit=true,避免重复初始化checkbox radio select label
};

$.fn.disableAllELements = function(disable){
	if(disable === false){
		jQuery("input,select,textarea",this).each(function(){
			if(this.type!="button"){
				this.disabled=false;
			}
		});
	}else{
		jQuery("input,select,textarea",this).each(function(){
			if(this.type!="button"){
				this.disabled=true;
			}
		});
	}
}
/**
 * 初始化文件上传组件
 * var config = {
 * notIframe			 // 可选值，决定是以iframe方式加载还是load方式加载。
 * bindPropId: xx,       // 可选值，已存在文件id，用于页面初始加载。
 * fileDivId: yy,        // 必填值，对应jsp页面中的文件容器div的id值
 * operType: view/edit,  // 必填值，edit：文件容器可编辑；view:文件容器只可查看，无法编辑
 * mainType: ,           // 可选值，文件类型（一级分类）
 * subType: ,            // 可选值，文件类型（二级分类）
 * maxFileNumber: ,      // 可选值，设置上传文件个数的最大值
 * acceptFileTypes:      // 可选值，设置允许上传的文件类型(后缀名)
 * maxFileSize:          // 可选址，允许上传文件的最大尺寸，以byte为单位的数值,
 * batchDownload		 // 可选值，决定是view视图下是否启用批量下载功能。
 * }
 */
$.fn.initFileContainer = function(config){
	var l_config = $.extend({
		notIframe : false,//Alex 160516 commit
		previewImg : true,
		batchDownload : false,
		operAuth : false
	},config||{});

	if(!l_config.fileDivId  || WEB_CTX_PATH == undefined || WEB_CTX_PATH == null)
		return false;
	
	if(typeof(l_config.operType)=="undefined" || l_config.operType==null)
		l_config.operType="view";
	
  // 初始化
	var load_url = WEB_CTX_PATH + "/jqFileUploadAction.do?method=initFilePage";
	load_url = load_url + "&operType=" + l_config.operType;

	if(l_config.bindPropVal)
		load_url = load_url + "&bindPropVal=" + l_config.bindPropVal;
	if(l_config.mainType)
		load_url = load_url + "&mainType=" + l_config.mainType;
	if(l_config.subType)
		load_url = load_url + "&subType=" + l_config.subType;
	if(l_config.maxFileNumber || l_config.maxFileNumber==0)
		load_url = load_url + "&maxFileNumber=" + l_config.maxFileNumber;
	if(l_config.acceptFileTypes)
		load_url = load_url + "&acceptFileTypes=" + l_config.acceptFileTypes;
	if(l_config.maxFileSize)
		load_url = load_url + "&maxFileSize=" + l_config.maxFileSize;
	if(l_config.operType=="view"&&l_config.batchDownload==true){
		load_url = load_url + "&batchDownload=true";
		if(l_config.zipName)
			load_url = load_url + "&zipName="+l_config.zipName;
	}
	if(l_config.previewImg)
		load_url = load_url + "&previewImg=true";
	if(l_config.operAuth)
		load_url = load_url + "&operAuth=true";
//	if(l_config.permitDownload==false)	
//		load_url = load_url + "&permitDownload=false";
//	var parentIframeHeightStyle = $('#contIFrame', window.parent.document).attr("style");
	var fileDiv = $("#"+l_config.fileDivId);
	function resizeFileContainer(){
		fileFrame.width(fileDiv.width()*0.97);
		if(fileDiv.attr("height")==undefined&&(fileDiv.attr("style")==undefined||fileDiv.attr("style").indexOf("height")==-1)){
			fileFrame.height(280);
		}else{
			fileFrame.height(fileDiv.height());
		}
		$(window).on('resize',function(){
				fileFrame.width(fileDiv.width()*0.97);
			});
	}
	if(!l_config.notIframe) {
		$("#"+l_config.fileDivId).html('<iframe id="' +l_config.fileDivId
			+'Iframe" src="'+load_url
			+'" frameborder="0" width="98%"></iframe>');
		var fileFrame = $("#"+l_config.fileDivId+"Iframe");
		if(fileFrame[0].attachEvent){
			fileFrame[0].attachEvent("onload",resizeFileContainer);
		}else{
			fileFrame[0].onload = resizeFileContainer;
		}
	}
	else {
		$("#"+l_config.fileDivId).hide();
		$("#"+l_config.fileDivId).load(load_url+"&notIframe=true",{},function(){$("#"+l_config.fileDivId).show();});
	}
/*	iFrame高度自适应
 	$("#"+l_config.fileDivId).load(function(){
		var mainheight = $(this).contents().find("body").height()+30;
		$(this).height(mainheight);
		}); */
};


/**
 * 初始化文件上传组件
 * var config = {
 * bindPropId: xx,       // 可选值，已存在文件id，用于页面初始加载。
 * fileDivId: yy,        // 必填值，针对上传组件的标识可以是form
 * acceptFileTypes:      //可选值，设置允许上传的文件类型(后缀名)格式(.png,.jpge,.txt)
 * maxFileSize:          //可选址，允许上传文件的最大尺寸，以byte为单位的数值 默认最大为10M,
 * uploadTheme:          //0:default 1:不包含input 2:包含图片预览方式但是兼容IE10+，火狐3.6+，Safari6.0+, Chrome6.0+ and Opera11.1+,指接受图片类型
 * fileName:             //文件组件的名称 id和name名称一致
 * isIleadUpload         //是否使用框架上传组件
 * mainType              //可选值，文件类型（一级分类）
 * subType （废弃）         //可选值，文件类型（二级分类）
 * formId               //表单form标识
 * operType             //必填值，edit：文件容器可编辑；view:文件容器只可查看，无法编辑
 * isPreview            //是否预览（只针对主题1）
 * previewWidth      200
 * previewHeight     150
 * }
 */
$.fn.initSimpleFileContainer = function(config){
var l_config = $.extend({
	   bindPropId:"",
	   subType:"",
	   mainType:(new Date()).valueOf()
	},config||{});
    

	if(!l_config.fileDivId)
		return false;
	
	if(typeof(l_config.acceptFileTypes)=="undefined" || l_config.acceptFileTypes==null)
		l_config.acceptFileTypes = "";
	
	if(typeof(l_config.uploadTheme)=="undefined" || l_config.uploadTheme==null) 
		l_config.uploadTheme = "0";
	
	if(typeof(l_config.maxFileSize)=="undefined" || l_config.maxFileSize==null) 
		l_config.maxFileSize = 10000000;
	
	if(typeof(l_config.fileName)=="undefined" || l_config.fileName==null) 
		l_config.fileName = "fileUpload_" + (new Date()).valueOf();
	
	if(typeof(l_config.formId)=="undefined" || l_config.formId==null) 
		l_config.formId = l_config.fileDivId;
	
	if(typeof(l_config.operType)=="undefined" || l_config.operType==null)
		l_config.operType="view";
	
	if(typeof(l_config.bindPropId)=="undefined" || l_config.bindPropId==null)
		l_config.bindPropId="";
	if(typeof(l_config.isPreview)=="undefined" || l_config.isPreview==null)
		l_config.isPreview=false;
	if(typeof(l_config.previewWidth)=="undefined" || l_config.previewWidth==null)
		l_config.previewWidth=200;
	if(typeof(l_config.previewHeight)=="undefined" || l_config.previewHeight==null)
		l_config.previewHeight=150;
	
	var fileDivId = l_config.fileDivId;
	var formId = l_config.formId;
	var buttonId = l_config.buttonId;
	var innerHtml = "";
	var acceptHtml = "";
	var fileTypePattern = "";
	if(l_config.acceptFileTypes != "") {
		acceptHtml = 'accept="' + l_config.acceptFileTypes + '"';
		fileTypePattern = (l_config.acceptFileTypes).replaceAll('\\.','');
	}
	var agent = window.navigator.userAgent;
	var isIE8 = ("documentMode" in document) && (document.documentMode == 8);//agent.indexOf('MSIE 8.0') != -1;
	switch(l_config.uploadTheme){
	    case "0":	    		    	
	    	var temp = '<div class="uneditable-input input-fixed input-medium" style="white-space: nowrap;" '+(!isIE8?'data-trigger="fileinput"':'')+'><i class="fa fa-file fileinput-exists icon-file"></i>&nbsp;<span class="fileinput-filename"> </span></div>';
	    	var temp1 = "",temp3 = "";
	    	if(l_config.operType!="view"){//Alex 160516 commit
	    		temp1 = '<span class="input-group-addon btn blue default btn-file"><span class="fileinput-new"> 选择文件 </span><span class="fileinput-exists"> 修改 </span><input id="' + l_config.fileName + '" type="file" name="' + l_config.fileName + '" ' + acceptHtml + ' > </span>';
		    	temp3 = '<a href="javascript:;" class="input-group-addon btn red fileinput-exists" data-dismiss="fileinput"> 删除文件 </a>';
		    }
		    innerHtml = '<div class="input-group input-large">' + temp + temp1 + temp3 + '</div>';
	    	$("#"+$(this).attr("id")).attr("class", "fileinput fileinput-new");
	    	$("#"+$(this).attr("id")).attr("data-provides", "fileinput");
	    	$("#"+$(this).attr("id")).html(innerHtml); 	
	    	break;
	    case "1":
	    	var temp = "";
		    if(l_config.operType!="view"){
		    	innerHtml = '<span class="btn green btn-file"> <span class="fileinput-new"> 选择文件 </span><span class="fileinput-exists"> 修改 </span><input id="' + l_config.fileName + '" type="file" name="' + l_config.fileName + '" ' + acceptHtml + '  > </span>';
		    	innerHtml = innerHtml + ' <span class="btn fileinput-filename-out" style=""><span class="fileinput-filename"> </span> &nbsp;<a href="javascript:;" class="close fileinput-exists" data-dismiss="fileinput" style="float: none;"></a></span>';
		    }
		    $("#"+$(this).attr("id")).attr("class", "fileinput fileinput-new");
	    	$("#"+$(this).attr("id")).attr("data-provides", "fileinput");
            if(l_config.isPreview) {
	    		temp = '<div class="fileinput-new thumbnail" style="width: 200px; height: 150px;"><img class="fileupload-img"  style="" src="' + WEB_CTX_PATH + '/framework/ui4/widget/bootstrap-fileinput/img/no_image.png" alt="..."></div>';
	    	}
	    	$("#"+$(this).attr("id")).html(temp + '<div>' + innerHtml + '</div>');
            
	    	break;
	    case "2":	    	
	    	var temp = '<div class="fileinput-new thumbnail" style="width: ' + l_config.previewWidth + 'px; height: ' + l_config.previewHeight + 'px;"><img class="fileupload-img" src="' + WEB_CTX_PATH + '/framework/ui4/widget/bootstrap-fileinput/img/no_image.png" alt="..." width="' + l_config.previewWidth + 'px" height="' + l_config.previewHeight + 'px"></div>';
	    	var temp1 = "",temp3 = "";
	    	if(l_config.operType!="view"){
		    	temp1 = '<div class="fileinput-preview fileinput-exists thumbnail" style="max-width: ' + l_config.previewWidth + 'px; max-height: ' + l_config.previewHeight + 'px;width: ' + l_config.previewWidth + 'px; height: ' + l_config.previewHeight + 'px;"> </div>';
		    	temp3 = '<div class="fileupload-buttons"><span class="btn default btn-file"><span class="fileinput-new"> 选择文件 </span><span class="cancel fileinput-exists"> 修改 </span><input id="' + l_config.fileName + '" type="file" name="' + l_config.fileName + '" ' + acceptHtml + '> </span><a href="javascript:;" class="btn red fileinput-exists " data-dismiss="fileinput"> 删除文件 </a></div>';
		    }
		    innerHtml = temp + temp1 + temp3 ;
	    	$("#"+$(this).attr("id")).attr("class", "fileinput fileinput-new");
	    	$("#"+$(this).attr("id")).attr("data-provides", "fileinput");
	    	$("#"+$(this).attr("id")).html(innerHtml);
	    	if(isIE8) {
	    		//$('.fileinput').find('.fileinput-new').attr("style", "filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(enabled='true',sizingMethod='scale',src='C:/Hydrangeas.jpg');");
	    		$("#" + l_config.fileName).on("change", function(event){
		    		$(this).select();
					var o =  document.selection.createRange().text;
					if (o != "") {
						$('.fileinput').find('.fileinput-preview').html("");
					    $('.fileinput').find('.fileinput-preview').attr("style", "filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(enabled='true',sizingMethod='scale',src='" + o + "');width:" + l_config.previewWidth + "px;height:" + l_config.previewHeight + "px;");
						//$('.fileinput').find('.fileinput-preview').html('<img  src="' + o + '" alt="..." width="200px" height="150px">');
//						$jQuery('.fileinput').on('change.bs.fileinput',function(e){							
//							$('.fileinput').find('.fileinput-preview').html('<img  src="' + o + '" alt="..." width="200px" height="150px">');
//						});
					}
					       
		    	});
	    	}	    	
	    	break;
	    default:"";
	}
	//修复多个上传组件时jquery选择不正确的问题 16/4/12 AlexKim
	var _this = $jQuery('#' + fileDivId);
	//判断文件是否存在
	if(l_config.bindPropId != ""){
		//获取文件信息
		jQuery.ajax
		({
			async: true,
			type: "GET",
			 url: "jqFileUploadAction.do?method=getFileList&bindPropVal=" 
				+ l_config.bindPropId + "&mainType=" + l_config.mainType + "&subType=" + l_config.subType + "&inForm=" + l_config.formId,
			contentType: "application/x-www-form-urlencoded;charset=UTF-8",
			dataType:'json',
			beforeSend: function(xhr) {xhr.setRequestHeader("__REQUEST_TYPE", "AJAX_REQUEST");},
			success: function(data) {
				if(data.files.length == 1) {
					
					var result = data.files[0];
//					if(l_config.operType == "view") {
//						
//					}else {
					    //$("#" + l_config.formId).append('<input type="hidden" name="fileId" id="fileId" value="' + l_config.bindPropId + '">');
						if(l_config.uploadTheme == "1") {
							_this.find('.fileinput-filename').text(result.name);
						    _this.find('.fileinput-preview').text(result.name);   
						    _this.find('.fileinput-filename-out').attr('style','border:1px solid #a2b4c7;border-radius:4px;');
						    _this.addClass('fileinput-exists').removeClass('fileinput-new');   
						    //_this.trigger('change.bs.fileinput');
						    _this.find('.fileinput-filename').html('<a id="uploadHref" href="' + result.url + '" style="color:#6985a0">' + result.name + '</a>');
						    _this.append('<p class="form-control" style="border:1px solid #a4b6c3;border-radius:4px;margin-top: 10px;vertical-align: middle;"><a href="' + result.url + '"><span style="color:#6985a0">' +result.name + '</span><span class="icon-download-alt" style="float:right;padding-top: 4px;color:#6985a0">下载</span></a></p>');
						    _this.find("#uploadHref").hover(
						    		  function () {
						    			  layer.tips('<img src="'+ result.thumbnailUrl + '" width="100px" height="100px">', this, {
						    				    tips: [1, '#FFF'],
						    				    time: 4000
						    				});
						    		  },
						    		  function () {
						    		    //$(this).removeClass("hover");
						    		  }
						    );
						    if(l_config.operType == "view") {
						    	 _this.find(".fileinput-exists").remove();
						    	 _this.find('.btn-file').hide();
						    	 _this.find('.fileinput-filename-out').hide();
						    	 _this.find("p").attr("style", "border:1px solid #a4b6c3;border-radius:4px;vertical-align: middle;");
						    }
						}else if(l_config.uploadTheme == "0") {
							_this.find('.fileinput-filename').text(result.name);
						    _this.find('.fileinput-preview').text(result.name);   
						    _this.addClass('fileinput-exists').removeClass('fileinput-new');   
						    //_this.trigger('change.bs.fileinput');
						    _this.append('<p class="form-control" style="border:1px solid #a4b6c3;border-radius:4px;margin-top: 10px;vertical-align: middle;"><a href="' + result.url + '"><span style="color:#6985a0">' +result.name + '</span><span class="icon-download-alt" style="float:right;padding-top: 4px;color:#6985a0">下载</span></a></p>');
						    if(l_config.operType == "view") {
						    	 _this.find(".input-group .fileinput-exists").remove();
						    	 _this.find(".input-group").hide();
						    	 _this.find("p").attr("style", "border:1px solid #a4b6c3;border-radius:4px;vertical-align: middle;");
						    }
						    
						    
						}else if(l_config.uploadTheme == "2") {
							var preview = _this.find('.fileinput-preview');
							var $img = $('<img>');
							$img[0].src = result.thumbnailUrl;
							_this.find('.fileinput-filename').text(result.name);
					        _this.find('.fileinput-filename-out').attr('style','border:1px solid #a2b4c7;border-radius:4px;');
					        
					        if (preview.css('max-height') != 'none') $img.css('max-height', parseInt(preview.css('max-height'), 10) - parseInt(preview.css('padding-top'), 10) - parseInt(preview.css('padding-bottom'), 10)  - parseInt(preview.css('border-top'), 10) - parseInt(preview.css('border-bottom'), 10))					        
					        preview.html($img);
					       // preview.find("img").attr("src", result.thumbnailUrl);
					        _this.addClass('fileinput-exists').removeClass('fileinput-new');
					        
					        _this.find(".fileupload-buttons").append('<a href="'+ result.url + '" class="btn blue " >文件下载 </a>');
					        //_this.trigger('change.bs.fileinput');
                            if(l_config.operType == "view") {                            	
                            	 _this.find(".fileupload-buttons .fileinput-exists").remove();
                            	 _this.find('.fileupload-buttons .btn-file').hide();
						    }
                            _this.find(".fileinput-preview").css("height", l_config.previewHeight );
					        _this.find(".fileinput-preview").css("width", l_config.previewWidth);
						}
						
					//}
				}else {
					alert("文件上传组件获取文件数据错误！");
					return;
				}
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) {
				alert("文件上传组件初始化失败！");
				return;
			}
		});
		
	}
	
	//获取jquery file upload 符合要求的文件格式
	var fileTypeFunc = function(accept_file_types){
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
	
	//初始化jquery file upload
	'use strict';
    // Initialize the jQuery File Upload widget:
	$jQuery('#' + fileDivId).fileupload({
        // Uncomment the following to send cross-domain cookies:
        //xhrFields: {withCredentials: true},
        //url: 'server/php/'
    });

    // Enable iframe cross-domain access via redirect option:
	$jQuery('#' + fileDivId).fileupload(
        'option',
        'redirect',
        window.location.href.replace(
            /\/[^\/]*$/,
            '/cors/result.html?%s'
        )
    );
	$jQuery('#' + fileDivId).fileupload('option', {
            disableImageResize: /Android(?!.*Chrome)|Opera/
                .test(window.navigator.userAgent),
            maxFileSize: l_config.maxFileSize,
            //acceptFileTypes: /(\.|\/)(gif|jpe?g|png)$/i,
            acceptFileTypes: eval(fileTypeFunc(fileTypePattern)),
            dropZone: null,
            pasteZone: null,
            autoUpload:false,
            isIleadUpload:true,
            singleFileUploads:true,
            /*
            maxNumberOfFiles:1,
            limitMultiFileUploads:1,
            limitConcurrentUploads:1,
            sequentialUploads:true,*/
            messages: {
            	uploadedBytes: '超出上传文件最大尺寸',
                maxNumberOfFiles: '超出最大文件数量',
                acceptFileTypes: '不支持此文件类型',
                maxFileSize: '文件太大',
                minFileSize: '文件太小'
            }
     });
	var hiddenStr = '<input type="hidden" class="uploadBindId"  value="' + fileDivId + '" />';
	var hiddenStr2 = '<input type="hidden" name="uploadstatus"  class="upload-status"  value="none" />';
	var hiddenStr3 = '<input type="hidden" name="file_Id"   value="'+ l_config.bindPropId + '" />';
	$jQuery("#" + fileDivId).append(hiddenStr);
	$jQuery("#" + fileDivId).append(hiddenStr2);
	if(l_config.bindPropId != ""){
		$jQuery("#" + formId).append(hiddenStr3);
	}
	$jQuery("#" + fileDivId).append('<div class="error" style="color:red"></div>');
	$jQuery('#' + fileDivId).fileupload({
        dataType: 'json', 
        add: function (e, data) {

        	var buttonObj = buttonId==undefined?$jQuery('.start-upload'):$jQuery("#" + buttonId);
    		buttonObj.off();
    		buttonObj.click(function(){
        		var dataFrom = jQuery("#" + formId).serializeArray();
        		$jQuery('#' + fileDivId).fileupload('option',{formData:dataFrom});
        		var url = $jQuery('#' + fileDivId).fileupload('getURL');
        		
        		if(l_config.bindPropId != "") {
        			$jQuery('#' + fileDivId).fileupload('option',{url:url + "&mainType=" + l_config.mainType + "&subType=" + l_config.subType + "&acceptFileTypes=" + fileTypePattern + "&fileId=" + l_config.bindPropId });
        		}else {
        			$jQuery('#' + fileDivId).fileupload('option',{url:url + "&mainType=" + l_config.mainType + "&subType=" + l_config.subType + "&acceptFileTypes=" + fileTypePattern});
        		}
        		if(typeof(data.files.error)=="undefined"){       			
        			
        			if($jQuery('#' + fileDivId).find(".upload-status").val() == "edit") {
        				data.submit();
        			}      			
        		}else {
        			//修复多个上传组件时jquery选择不正确的问题 16/4/12 AlexKim
        			$jQuery('#' + fileDivId).find(".error").text(data.files[0].error);
        		}
        		
        	});
        	
        	$.blueimp.fileupload.prototype.options.add.call(this, e, data);

        	if(data.files.error) {
        		$jQuery('#' + fileDivId).find(".error").text(data.files[0].error);
        	}else {
        		$jQuery('#' + fileDivId).find(".error").text("");
        	}       	
        },
        change:function(e, data){
        	
        }
   });
	$jQuery('.fileinput').on('clear.bs.fileinput',function(){
		$jQuery('#' + fileDivId).find(".upload-status").val("del");	
	});
	$jQuery('.fileinput').on('change.bs.fileinput',function(e){
		$jQuery('#' + fileDivId).find(".upload-status").val("edit");	
	});
};

$.fn.initFileUpoldCustom = function(){alert("initFileUpoldCustom方法名已被改为initFileUploadCustom");};
$.fn.initFileUploadCustom = function(config){
	var l_config = $.extend({
		},config||{});
		if(!l_config.fileDivId)
			return false;		
		if(typeof(l_config.acceptFileTypes)=="undefined" || l_config.acceptFileTypes==null)
			l_config.acceptFileTypes = "";
		
		if(typeof(l_config.uploadTheme)=="undefined" || l_config.uploadTheme==null) 
			l_config.uploadTheme = "0";
		
		if(typeof(l_config.maxFileSize)=="undefined" || l_config.maxFileSize==null) 
			l_config.maxFileSize = 10000000;
		if(typeof(l_config.url)=="undefined" || l_config.url==null) {
			return;
		}
		if(typeof(l_config.formData)=="undefined" || l_config.formData==null) {
			l_config.formData = null;
		}
		var fileDivId = l_config.fileDivId;
		var formId = l_config.formId;
		var buttonId = l_config.buttonId;
		var innerHtml = "";
		var acceptHtml = "";
		var fileTypePattern = "";
		if(l_config.acceptFileTypes != "") {
			acceptHtml = 'accept="' + l_config.acceptFileTypes + '"';
			fileTypePattern = (l_config.acceptFileTypes).replaceAll('\\.','');
		}
		var isIE8 = ("documentMode" in document) && (document.documentMode == 8);
		var temp = '<div class="uneditable-input input-fixed input-medium" style="white-space: nowrap;" '+(!isIE8?'data-trigger="fileinput"':'')+'><i class="fa fa-file fileinput-exists icon-file"></i>&nbsp;<span class="fileinput-filename"> </span></div>';
    	var temp1 = '<span class="input-group-addon btn blue default btn-file"><span class="fileinput-new"> 选择文件 </span><span class="fileinput-exists"> 修改 </span><input id="' + l_config.fileName + '" type="file" name="' + l_config.fileName + '" ' + acceptHtml + ' > </span>';
    	var temp3 = '<a href="javascript:;" class="input-group-addon btn red fileinput-exists" data-dismiss="fileinput"> 删除文件 </a>';
        innerHtml = '<div class="input-group input-large">' + temp + temp1 + temp3 + '</div>';
    	$("#"+$(this).attr("id")).attr("class", "fileinput fileinput-new");
    	$("#"+$(this).attr("id")).attr("data-provides", "fileinput");
    	$("#"+$(this).attr("id")).html(innerHtml);
		
		//获取jquery file upload 符合要求的文件格式
		var fileTypeFunc = function(accept_file_types){
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
		
		//初始化jquery file upload
		'use strict';
	    // Initialize the jQuery File Upload widget:
		$jQuery('#' + fileDivId).fileupload({
	        // Uncomment the following to send cross-domain cookies:
	        //xhrFields: {withCredentials: true},
	        //url: 'server/php/'
	    });

	    // Enable iframe cross-domain access via redirect option:
		$jQuery('#' + fileDivId).fileupload(
	        'option',
	        'redirect',
	        window.location.href.replace(
	            /\/[^\/]*$/,
	            '/cors/result.html?%s'
	        )
	    );
		$jQuery('#' + fileDivId).fileupload('option', {
	            disableImageResize: /Android(?!.*Chrome)|Opera/
	                .test(window.navigator.userAgent),
	            maxFileSize: l_config.maxFileSize,
	            //acceptFileTypes: /(\.|\/)(gif|jpe?g|png)$/i,
	            acceptFileTypes: eval(fileTypeFunc(fileTypePattern)),
	            dropZone: null,
	            pasteZone: null,
	            autoUpload:false,
	            isIleadUpload:true,
	            singleFileUploads:true,
	            /*
	            maxNumberOfFiles:1,
	            limitMultiFileUploads:1,
	            limitConcurrentUploads:1,
	            sequentialUploads:true,*/
	            messages: {
	            	uploadedBytes: '超出上传文件最大尺寸',
	                maxNumberOfFiles: '超出最大文件数量',
	                acceptFileTypes: '不支持此文件类型',
	                maxFileSize: '文件太大',
	                minFileSize: '文件太小'
	            }
	     });
		//修复uploadstatus缺失的问题 16/4/12 AlexKim
		$jQuery("#" + fileDivId).append('<input type="hidden" name="uploadstatus"  class="upload-status"  value="none" />');
		$jQuery("#" + fileDivId).append('<div class="error" style="color:red"></div>');
		$jQuery('#' + fileDivId).fileupload({
	        dataType: 'json',
	        url:l_config.url,
	        done: function (e, data) {
	           eval(l_config.done(data.result));
	        },
	        //formData: l_config.formData,
	        add: function (e, data) {
	    		//修复多个上传组件时按钮定位的问题 16/4/12 AlexKim
	        	var buttonObj = buttonId==undefined?$jQuery('.start-upload'):$jQuery("#" + buttonId);
        		buttonObj.off();
        		buttonObj.click(function(){
	        		if(typeof(l_config.formId) !="undefined" && l_config.formId !='' ) {
	        			var dataFrom = jQuery("#" + formId).serializeArray();
		        		$jQuery('#' + fileDivId).fileupload('option',{formData:dataFrom});
	        		}
	        		//var url = $jQuery('#' + fileDivId).fileupload('getURL');
	        		
//	        		if(l_config.bindPropId != "") {
//	        			$jQuery('#' + fileDivId).fileupload('option',{url:url + "&mainType=" + l_config.mainType + "&subType=" + l_config.subType + "&acceptFileTypes=" + fileTypePattern + "&fileId=" + l_config.bindPropId });
//	        		}else {
//	        			$jQuery('#' + fileDivId).fileupload('option',{url:url + "&mainType=" + l_config.mainType + "&subType=" + l_config.subType + "&acceptFileTypes=" + fileTypePattern});
//	        		}
	        		if(typeof(data.files.error)=="undefined"){

	        			if($jQuery('#' + fileDivId).find(".upload-status").val() == "edit") {
	        				data.submit();
	        			}
	        		}else {
	        			//修复多个上传组件时jquery选择不正确的问题 16/4/12 AlexKim
	        			$jQuery('#' + fileDivId).find(".error").text(data.files[0].error);
	        		}
	        		
	        	});
	        	
	        	$.blueimp.fileupload.prototype.options.add.call(this, e, data);

	        	if(data.files.error) {
	        		$jQuery('#' + fileDivId).find(".error").text(data.files[0].error);
	        	}else {
	        		$jQuery('#' + fileDivId).find(".error").text("");
	        	}
	        }
	   });
		$jQuery('.fileinput').on('clear.bs.fileinput',function(){
			$jQuery('#' + fileDivId).find(".upload-status").val("del");
		});
		$jQuery('.fileinput').on('change.bs.fileinput',function(e){
			$jQuery('#' + fileDivId).find(".upload-status").val("edit");
		});
	};

/********
 * 
 * 初始化弹出窗口table组件
 * title 弹出窗口标题；
 * url 请求的列表url地址；
 * colModel 列数组列的中文名 例子：["公告编号","公告标题", "公告内容", "公告编辑人","公告状态","结束时间"]
 * colNames 列数组 包含：列英文名（name）， 宽度（width），是否隐藏（hidden），列值显示居中还是靠左（align），是否是查询字段查询中文名（queryName）
 * 例子：:[ {name:'notifNo',index:'notifNo', width:55, hidden:true, queryName:"公告编号"}, ],
 * multiSelect：是否是多选还是单选
 * *****/
$.fn.initPopup = function(config){
	var api = frameElement.api;
    var l_config = $.extend({
    	title       :"",
    	url		    :"",
    	colModel    :[],
    	colNames    :[],
    	multiSelect :true,
    	width       :300,
    	height      :300
    },config||{});
    $(this).click(function () { 
    	$jQuery().openDlg({
    		 id:$(this).attr("id"),
	   		 title:l_config.title,
	   		 width: l_config.width,
	   		 height: l_config.height,
	   		 //modal: true,
	   		 url: WEB_CTX_PATH + "/popupAction.do?method=initPopup",	   		
	   		 resize:true,
	   		 data: {
				 "config": l_config,
				 "id":$(this).attr("id")
			 },
			 parent: api
			 //TODO 需要增加close属性，待做（20141107）
//	   		 close: function() {
//	   			 //alert("Parent:"+dlgRetVal.endTime);
//	   		 }
   	    });
    });
    
};
/****
 * 普通分页方法
 * 可配置参数url，data，pager
 * *******/
$.fn.pager = function(config){
	var api = frameElement.api;
    var l_config = $.extend({
    	url       :"",
    	data        :"",
    	datatype: "json", //支持json和text
    	pager: '#pager',
    	mtype:"POST",
    	ifPageShowNum:3,
    	dataAction : function(msg){
        },
        pageAction : function(pageNum) {
        	var pageNum = pageNum;
        	var totlePage = 1;
        	var rows = 2;
        	var resultURL = "";
        	if(l_config.url.indexOf("?") > 0) {
        		resultURL = l_config.url + "&page=" + pageNum + "&rows=" + rows;
        	}else {
        		resultURL = l_config.url + "?page=" + pageNum + "&rows=" + rows;
        	}
        	$.ajax({
        		   type: "POST",
        		   url: resultURL,
        		   data:l_config.data,
        		   dataType:l_config.datatype.toLowerCase(),
        		   success: function(dataObject) {
        			   var msg = null;
        			   if(l_config.datatype.toLowerCase() == 'text') {
        				   msg = eval( '(' + dataObject + ')' );
        			   }else {
        				   msg = dataObject;
        			   }
        			   totlePage = msg.total;
        			   pageNum = msg.page;
        			   var pageBefore = "";
        			   var pagerNext = "";		  
        			   var pagesStr = "";
        			   var firstPageStr = "";
        			   var lasrPageStr = "";
        			   if(pageNum == 1) {
        				   firstPageStr = "<li class=\"disabled\"><a  href=\"#\"    aria-label=\"Previous\">首页</a></li>";;
        				   pageBefore = "<li class=\"disabled\"><a  href=\"#\"    aria-label=\"Previous\">← 上一页</a></li>";				   
        			   }else {
        				   firstPageStr = "<li><a id=\"firstPage\" href=\"#\"  aria-label=\"Previous\">首页</a></li>";;
        				   pageBefore = "<li><a id=\"pagerBefore\" href=\"#\"  aria-label=\"Previous\">← 上一页</a></li>";
        			   }
        			   
        			   if(totlePage <= 1 || pageNum == totlePage) {
        				   lasrPageStr = "<li class=\"disabled\"><a  href=\"#\" aria-label=\"Next\">末页 </a></li>";;
        				   pagerNext = "<li class=\"disabled\"><a  href=\"#\" aria-label=\"Next\">下一页 → </a></li>";
        			   }else {
        				   pagerNext = "<li><a id=\"pagerNext\"  href=\"#\" aria-label=\"Next\">下一页 → </a></li>";
        			   }
        			   
        			   for(var i = 0; i < totlePage; i++) {
        				   if(i + 1 == pageNum) {
        					   pagesStr = pagesStr + "<li class=\"active\"><a href=\"#\">" + parseInt(i+1) + "<span class=\"sr-only\">(current)</span></a></li>";
        				   }else {
        					   pagesStr = pagesStr + "<li id='page" + parseInt(i+1) + "'><a class=\"pagernumber\" href=\"#\">" + parseInt(i+1) + "</a></li>";
        				   }	
        				   
        				   if(i > l_config.ifPageShowNum - 1) {
        					   break;
        				   }
        			   }
        			   
        			   var pageNav = "<nav><ul class=\"page-num pagination\">" + pageBefore + pagesStr + pagerNext + "</ul></nav>"
        			   $jQuery(l_config.pager).html("<div class=\"row\"><div class=\"col-md-12\">" + pageNav + "</div></div>");
        			   l_config.dataAction(msg);
        			   $("#pagerNext").click( function () {
        				   pageNum = pageNum + 1;
        				   if(pageNum%3 == 0) {
        					   $("#page" + parseInt(pageNum - l_config.ifPageShowNum + 1)).remove();
        					   $("#page" + parseInt(pageNum)).after("<li id='page" + parseInt(pageNum+1) + "'><a class=\"pagernumber\" href=\"#\">" + parseInt(pageNum+1) + "</a></li>");
        				   }
        				   
        				   
        				   l_config.pageAction(pageNum);
        				   
        			   });
        			   $("#pagerBefore").click( function () {
        				   pageNum = pageNum - 1;
        				   l_config.pageAction(pageNum);
        			   });
        			   $(".pagernumber").click( function () {
        				  var currentPage = $(this).html();
        				  l_config.pageAction(parseInt(currentPage));
        			   });
        		   }
            });
        }
    },config||{});
    l_config.pageAction(1);   
};


/**
 * 获取已上传文件的id并赋给bindPropId指定的页面标签
 * var config = {
 * bindPropId: xx,
 * fileDivId: yy
 * 
 */
$.fn.pickupFileIds = function(config){
	var l_config = $.extend({		
	},config||{});
	var bindProp = jQuery("#" + l_config.bindPropId);
	if(!bindProp)
		return false;
	var iframeElem = document.getElementById(l_config.fileDivId+"Iframe");
	if(iframeElem){
		var retVal = iframeElem.contentWindow.pickupDownloadTempl();
		if(!retVal || retVal == null)
			bindProp.val("");
		else
			bindProp.val(retVal);
	}else{//load方式加载(notIframe:true)时获取值的方法 160516 Alex commit
		var retVal = pickupDownloadTempl.apply(document.getElementById(l_config.fileDivId));
		if(!retVal || retVal == null)
			bindProp.val("");
		else
			bindProp.val(retVal);
	}
	
};
/**
 * 基于jquery同名原生方法调整。
 * 因为原生方法会跳过disabled的元素
 */
function serializeArray() {
	return this.map(function() {
		var elements = jQuery.prop( this, "elements" );
		return elements ? jQuery.makeArray( elements ) : this;
	})
	.filter(function() {
		var type = this.type;
		return this.name && //!jQuery( this ).is( ":disabled" ) &&
		/^(?:input|select|textarea|keygen)/i.test( this.nodeName ) &&
		!/^(?:submit|button|image|reset|file)$/i.test( type ) &&
			( this.checked || !/^(?:checkbox|radio)$/i.test( type ) );
	})
	.map(function( i, elem ) {
		var val = jQuery( this ).val();

		return val == null ?
			null :
			jQuery.isArray( val ) ?
				jQuery.map( val, function( val ) {
					return { name: elem.name, value: val.replace( /\r?\n/g, "\r\n" ) };
				}) :
				{ name: elem.name, value: val.replace( /\r?\n/g, "\r\n" ) };
	}).get();
};
/**
 * form 表单转换为json对象
 * **/
$.fn.serializeJson = function(){  
    var serializeObj = {};  
    var array = serializeArray.call(this);
    $(array).each(function(){  
        if(serializeObj[this.name]){  
            if($.isArray(serializeObj[this.name])){  
                serializeObj[this.name].push(this.value);  
            }else{  
                serializeObj[this.name]=[serializeObj[this.name],this.value];  
            }  
        }else{  
            serializeObj[this.name]=this.value;   
        }  
    });  
    return serializeObj;
};
/**
 * 基于jquery的serialize方法调整。
 * 因为原生方法会跳过disabled的元素
 */
$.fn.serializeAll = function(){
	return jQuery.param( serializeArray.call(this) );
};
/**
 * @param  fileNames   (string/string[], optional) names of file to load (eg, 'Messages' or ['Msg1','Msg2']). Defaults to "Messages"
 * @param  language    (string, optional) language/country code (eg, 'en', 'en_US', 'pt_BR'). if not specified, language reported by the browser will be used instead.
 * @param  path      (string, optional) path of directory that contains file to load
 * @param  callbackFunc     (function, optional) callback function to be called after script is terminated
 * 
 */
$.fn.loadBundles = function(fileNames, lang, path, callbackFunc) {
	/**
	   * @param  name      (string/string[], optional) names of file to load (eg, 'Messages' or ['Msg1','Msg2']). Defaults to "Messages"
	   * @param  language    (string, optional) language/country code (eg, 'en', 'en_US', 'pt_BR'). if not specified, language reported by the browser will be used instead.
	   * @param  path      (string, optional) path of directory that contains file to load
	   * @param  mode      (string, optional) whether bundles keys are available as JavaScript variables/functions or as a map (eg, 'vars' or 'map')
	   * @param  cache        (boolean, optional) whether bundles should be cached by the browser, or forcibly reloaded on each page load. Defaults to false (i.e. forcibly reloaded)
	   * @param  encoding  (string, optional) the encoding to request for bundles. Property file resource bundles are specified to be in ISO-8859-1 format. Defaults to UTF-8 for backward compatibility.
	   * @param  callbackFunc     (function, optional) callback function to be called after script is terminated
	 */
	$.i18n.properties({
	    name: fileNames, 
	    path: path, 
	    mode: 'map',
	    language: lang, 
	    callback: eval(callbackFunc)
	});
};

/**
 * 置换html结构体内的占位符，占位符格式要求：#{key} ，其中key对应于资源文件中的属性key。
 * 支持动态参数实现对属性文件中占位符的替换，例如 
 * populateHtml(btnHtml, "btn_search","a");
 * populateHtml(btnHtml, "btn_search",["a","b","c"]);
 * populateHtml(btnHtml, "btn_search","a","b","c");
 * 
 */
$.fn.populateHtml = function(orignHtml, key /* Add parameters as function arguments as necessary  */) {
	
	if(orignHtml == null || key == null)
		return orignHtml;
	
	var propValue ;
	if(arguments.length == 3 && $.isArray(arguments[2]))
		propValue = $.i18n.prop(key, arguments[2]);
	else if(arguments.length >= 3 && !$.isArray(arguments[2])){
		var args = new Array(arguments.length-2);
		for(var i=2;i<arguments.length;i++){
			args[i-2] = arguments[i];
		}
		propValue = $.i18n.prop(key, args);
	}
	else
		propValue = $.i18n.prop(key);
	if(propValue == null || propValue == "")
		return orignHtml;
	//var pholderInHtml = "#{" + key + "}";
	var regExp = new RegExp("#{" + key + "}", "g");

	return orignHtml.replace(regExp, propValue);
};

})(jQuery);

/**
 * AJAX请求调用的函数
 * @param url ajax请求的url
 * @param onCompleteFunc ajax请求完成之后调用的函数名称
 * @param onFailureFun ajax请求失败调用的函数
 * @param params ajax请求的字符串列表，格式如：A=1&B=2
 * @param asynFlag 异步标志,true or false,缺省为true异步执行
 * @return 无返回值
 */
function ajaxRequest(url,onCompleteFunc,onFailureFunc,params,asynFlag,formid)
{
	//var isLoading = false;
	//jQuery(document.body).showLoading();
	//jQuery(document.body).mask("加载中...");
	//isLoading=true;
	
	var async = true;
	var param = "";
	if(params != undefined)
	{
		param = params;
	}
	if (asynFlag!= undefined)
	{
		if ((asynFlag==false) || (asynFlag=="false"))
		{
			async = false;
		}
		else
		{
			async = true;
		}
	}
	
//	if(isLoading==true)
//		var hideString=";\njQuery('#'+formid).hideLoading();}";

	jQuery.ajax
		({
			async: async,
			type: "GET",
			url: url,
			contentType: "application/x-www-form-urlencoded;charset=UTF-8",
			data: param,
			dataType:'json',
			beforeSend: function(xhr) {xhr.setRequestHeader("__REQUEST_TYPE", "AJAX_REQUEST");},
			success: eval(onCompleteFunc),
			error: eval(onFailureFunc)
		});
	window.setTimeout(function(){}, 100);
}
/**
 * AJAX请求调用的函数,该函数可以把form内部的所有可提交变量全部提交到后台
 * @param url ajax请求的url
 * @param onCompleteFun ajax请求完成之后调用的函数名称
 * @param onFailureFun ajax请求失败调用的函数
 * @param formid ajax请求form表单对象
 * @param asynFlag 异步标志,true or false,缺省为true异步执行
 * @return 无返回值
 */
function ajaxFormRequest(req_url,onCompleteFun,onFailureFun,formid,asynFlag,req_target,postDatas)
{
	var uploadBindId = $jQuery('#'+formid + " .uploadBindId").val();
	var uploadStatus = $jQuery('#'+formid + " .upload-status").val();
	var postData = postDatas || "";//Alex 160516 commit
//	var agent = window.navigator.userAgent;
//	var isIE8 = agent.indexOf('MSIE 8.0') != -1;

	if(typeof(uploadBindId) != "undefined" && uploadBindId != null && uploadBindId != "" && uploadStatus=="edit"){
		var isIleadUpload = $jQuery('#' + uploadBindId).fileupload('getIfUpload');
		$jQuery('#' + uploadBindId).fileupload('option',{url:req_url + "&isIleadUpload=" + isIleadUpload + "&uploadstatus=" + uploadStatus});
		$jQuery('#' + uploadBindId).fileupload({		 
				        done: function (e, data) {
				        	eval(onCompleteFun(data.result));
				        },fail:function (e, data) {
				        	eval(onFailureFun(data.result));
				        }
		});
	
	}else {
		var async = true;
		if (asynFlag!= undefined)
		{
			if ((asynFlag==false) || (asynFlag=="false"))
			{
				async = false;
			}
			else
			{
				async = true;
			}
		}
	    $jQuery('#'+formid).ajaxSubmit({
	    	target: req_target,
	    	url: req_url,
	    	dataType: 'json',
	    	data: postData,
	    	type: 'post',
	    	success: eval(onCompleteFun),
	    	error: eval(onFailureFun),
	    	beforeSend: function(xhr) {xhr.setRequestHeader("__REQUEST_TYPE", "AJAX_REQUEST");},
	    	async: async,
	    	contentType: "application/x-www-form-urlencoded;charset=utf-8"
	    });
    }
}

/**
 * 处理系统的提示和异常信息，并提示出来。
 * @param returnobj ajax返回的信息
 * @return 返回是否有系统提示或者异常
 */
function dealSystemInfo(returnobj)
{
	var jdg = false;
	var msg = "";
	if(returnobj.__WARNMSGS != undefined)
	{
		for(var i=0;i<returnobj.__WARNMSGS.length;i++)
	 	{
	 		var tmp = returnobj.__WARNMSGS[i].__WARNMSG;
	 		jdg = false;
	 		if(msg == ""){
	 			msg = tmp;
	 		}else{
	 			msg = msg + "\r\n"+tmp;
	 		}
		}
	}
	if(returnobj.__ERRORMSG != undefined)
	{
		jdg = true;
		if(msg == ""){
	 		msg = returnobj.__ERRORMSG;
	 	}else{
	 		msg = msg + "\r\n"+returnobj.__ERRORMSG;
	 	}
	}
	if(msg != ""){
		alert(msg);
	}
	return jdg;
}
/**
 * 对传入ajax的uri地址进行编码
 * @param inputValue 输入的url地址
 * @return 编码之后的url
 */
function encodeUrl(inputValue)
{
	return encodeURI(encodeURI(inputValue));
}
