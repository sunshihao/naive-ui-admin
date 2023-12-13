//			选项：
//			id 且BMP时，不要与同一模块下已存在的弹出页面重名（不同模块之间不影响）
//				已填写时，modalLayer.open()会返回图层对象
//				未填写时，新建匿名图层,modalLayer.open()不返回图层对象
//			url 必填，弹出页面的url
//			width 页面宽度
//			height 不建议设置
//			top 弹出窗口与浏览器窗口之间的上方距离
//			left 弹出窗口与浏览器窗口之间的左侧距离 ;默认居中，建议不另行设置
//			zIndex 弹出窗口的堆叠优先级
//			closeButton 给弹出框有上角加上关闭按钮。默认true
//			（废弃）draggable 弹出窗口的是否可拖动。默认true
//			reload 弹出窗口重新load()一遍。默认true ;false主要用于可能需要之前弹窗的某些数据的情景
//			clearOnload reload=false时有用。指定弹出窗口是否要每次弹窗清数据,调用页面对象的clearFun;默认true
//			
//			得到的页面对象结构：
//			open(config) 窗口弹出。与modalLayer.open()一样,config选项可以为除id外其他setting中属性 
//			getPageData 获取父页面传递的json格式数据
//			clearFun 清除页面数据功能（仅页面）。除特殊情况无需另行定义（例如：需要额外清除JS需要自己定义）
//			pageContent 弹出窗口中页面内容加载区域的jquery对象


//closeButton
//position absolute/fixed
//
//move


(function($){
	'use strict'
	var modalLayer = {},
		settings = {}, layers = {}, recentPage = {};
	var _defaults = {
			setting : {
				id : '',
				title : '',
				url : '',//必填
				width : '',
				height : '',
				top : 40,
				left : function(){//默认居中
					var left = ($(window).width()-$(this).width())/2;
					left = left < 0 ? 0:left;
					return left;
				},
				zIndex : 99999,
				closeButton : true,
				reload : true,
				draggable : true
			},
			mark : {
				defaultPage : "ilead_modalLayer",
				anonymousPage : "ilead_anonymousLayer"
			}
	};
	function _extend(key,obj){
		if(typeof key == 'string')
			modalLayer[key] = obj;
		else if(key == null){//批扩展
			for(var k in obj){
				if(typeof obj[k] != 'undefined'){
					modalLayer[k] = obj[k];
				}
			}
		}
	};
	function _extendProperty(objTo,objFrom){
			for(var k in objFrom){
				if(typeof objFrom[k] != 'undefined'&&typeof objTo[k] != 'undefined'){
					objTo[k] = objFrom[k];
				}
			}
			return objTo;
	};
	
	
	function _addSetting(obj){
		if(!settings[obj.id])
			settings[obj.id] = obj;
	}
	function _getSettingById(id){
		return settings[id];
	};
	function _setSettingById(id,setting){
		if(setting.id&&setting.id!=settings[id].id){
			setting.id = undefined;//id不可更改
		}
		settings[id] = _extendProperty(settings[id],setting||{});
	};
	function _addLayer(obj){
		if(!layers[obj.getLayerId()])
			layers[obj.getLayerId()] = obj;
	}
	function _getLayerById(id){
		return layers[id];
	};
	
	var _tool = {
			initSetting : function(config){
				if(typeof config.url!='string'||config.url==""){
					throw "url is necessary and must be a string!";
				}
				if(typeof config.id!='string'&&typeof config.id!='undefined'){
					throw "id must be a string!";
				}
				var setting = _extendProperty(_defaults.setting,config||{});
				_addSetting(setting);
				return setting;
			},
			initAnonymousSetting : function(config){
				if(typeof config.url!='string'||config.url==""){
					throw "url is necessary and must be a string!";
				}
				config.id = "modalLayer_"+(new Date().valueOf());
				if(config.reload)config.reload = undefined;
				var setting = _extendProperty(_defaults.setting,config||{});
				_addSetting(setting);
				return setting;
			},
			makeLayerObject : function(_layer,setting){
				_layer.attr('id',setting.id)
				_layer.css('z-index',setting.zIndex);
				var layerId = setting.id;
				var pageData = {};
				var loadCount = 0;
				_layer.extend({
					getLayerId : function(){return layerId;},
					pageDialog: _layer.find("div[class='modal-dialog']"),
					pageContent: _layer.find("div[class='modal-content']"),
					getUserData: function(){return pageData;},
					setUserData: function(data){pageData = $.extend(data,pageData);},
					close:function(){
						this.modal("hide");
					},
					open:function(openConfig,isAnonymous){
						var that = this;
						openConfig = openConfig||{};
						pageData = openConfig.data||{};
						recentPage = that;
						var openSet = {};
						if(!isAnonymous){
							_setSettingById(that.getLayerId(),openConfig);
							openSet = _getSettingById(that.getLayerId());
						}else{//如果是匿名窗体就不修改setting，每次都基于默认setting来设置
							openSet = _extendProperty(_defaults.setting,openConfig);
						}
						that.pageContent.width(openSet.width).height(openSet.height);
						if(openSet.reload||loadCount++===0){
							that.pageContent.empty();
							that.pageContent.load(openSet.url,{}
									,function(){
										var left;
										if(typeof openSet.left == 'function'){
											left = openSet.left.apply(that.pageContent);
										}else{
											left = openSet.left;
										}
										that.pageDialog.css('margin-top',openSet.top).css('margin-left',left);
										if(openSet.closeButton)
											that.pageDialog.find('.modal-header:first').prepend("<button class='close' aria-hidden='true' type='button' data-dismiss='modal'>&times;</button>");
										if(openSet.title)
											that.pageDialog.find('.modal-header:first').append("<h4 class='modal-title'>"+ openSet.title +"</h4>");
									}
								);
							that.modal('show');
							$(window).on('resize',
									function(){
										var left;
										if(typeof openSet.left == 'function'){
											left = openSet.left.apply(that.pageContent);
										}else{
											left = openSet.left;
										}
										that.pageDialog.css('margin-top',openSet.top).css('margin-left',left);
										that.pageContent.width(openSet.width).height(openSet.height);
									}
								);
						}else{
							if(openSet.success){
								that.success();
							}
							that.modal('show');
						}
//						if(openSet.draggable){
//							that.draggable({
//							    handle: ".modal-header"
//							});
//						}
					}
				});

				_addLayer(_layer);
				return _layer;
			},
			modalLayerHtml : function(customClass){
				return $("<div class='modal "+customClass+" fade bmp-modal bmp-dialog' tabindex='-1' role='dialog' aria-labelledby='myModalLabel'>"
		  		+ "<div class='modal-dialog' role='document'>"
		    	+ "<div class='modal-content'>"
		    	+ "</div></div></div>");
			}
	};
	function open(config){
		var _layer = {};
		if(config.id){
			var setting = _tool.initSetting(config);
			if($("div[id='"+setting.id+"']").length==0){//检验当前DOM内有无id冲突
				_layer = _tool.modalLayerHtml(_defaults.mark.defaultPage);
				if($("body")){
					$("body").append(_layer);
				}else if($("div:first")){
					($("div:first").nextAll("div:last")).after(_layer);
				}
				_layer = _tool.makeLayerObject(_layer,setting);
				_layer.open({data:config.data||{}});
			}else{
				_layer = _getLayerById(setting.id);
				if(!_layer)
					throw "layer with specific id is not found in prepared layers!";
				_layer.open(config);
			}
			return _layer;
		}else{
			_layer = $("div."+_defaults.mark.anonymousPage+":hidden");
			if(_layer.length==0){//检验当前有没有匿名模态窗（未配置id）
				var setting = _tool.initAnonymousSetting(config);
				_layer = _tool.modalLayerHtml(_defaults.mark.anonymousPage);
				if($("body")){
					$("body").append(_layer);
				}else if($("div:first")){
					($("div:first").nextAll("div:last")).after(_layer);
				}
				_layer = _tool.makeLayerObject(_layer,setting);
				_layer.open({data:config.data||{}},true);
			}else{
				_layer = _getLayerById(_layer.attr("id"));
				if(!_layer)
					throw "layer with specific id is not found in prepared layers!";
				_layer.open(config,true);
			}
			return _layer;
		}
	};
	function create(config){
		var _layer = {};
		if(config.id){
			var setting = _tool.initSetting(config);
			if($("div[id='"+setting.id+"']").length==0){//检验当前DOM内有无id冲突
				_layer = _tool.modalLayerHtml(_defaults.mark.defaultPage);
				if($("body")){
					$("body").append(_layer);
				}else if($("div:first")){
					($("div:first").nextAll("div:last")).after(_layer);
				}
				_layer = _tool.makeLayerObject(_layer,setting);
			}else{
				throw "layer with specific id is already exists!";
			}
			return _layer;
		}else{
			throw "id is necessary";
		}
	};
	function recentOpenPage(){
		return recentPage;
	}

	_extend('extend',_extend);
	_extend('open',open);
	_extend('create',create);
	_extend('recentOpenPage',recentOpenPage);
	window.modalLayer = modalLayer;
}(jQuery));