
(function($) {
	/**
	 * options 数组
	 * var options = {
	 * id: ,
	 * modal: ,
	 * url: ,
	 * title: ,
	 * content: ,
	 * width: ,
	 * height: ,
	 * left: ,
	 * top: ,
	 * parent: ,
	 * data: ,
	 * };
	 */

	
	var custom_dialog_ui4 = function(options) {		
		var divId = "dialog" + new Date().getTime();
		var settings = {
			id : divId,
			width : 0,
			height : 0,
			modal : true,
			show : "explode",
			hide : "highlight",
			title : "提示",
			url : "/login",
			//新增
			type: 2, //用于指定类型0（信息框，默认）1（页面层）2（iframe层）3（加载层）4（tips层）
			content:"",
			offset:0,
			//shade: 0.3,
			maxmin: true,
			shadeClose :false,
			time :0,
			shift :0,
			zIndex :99999,
			callBackFun:null,
			invokedFunName:"",
			//
			data:{},
			parent:null
		};
		if (options) {
			$.extend(settings, options);
		}
		var areaTemp;
		if(settings.width ==  0 && settings.height == 0) {
			areaTemp = 'auto';
		}else {
			areaTemp = [settings.width + "px", settings.height + "px"]
		}
		var contentTemp ;
		if(settings.url && settings.type == 2) {
			contentTemp = settings.url;
		}else if(settings.content && settings.type == 1) {
			contentTemp = settings.content;
		}else {
			contentTemp="未知";
		}
		var shadeTemp;
		if(settings.modal) {
			shadeTemp = 0.5;
		}else {
			shadeTemp = false;
		}
		if(settings.parent != null) {
			settings.parent.open({
				type : settings.type,
			    title : settings.title,
				area  : areaTemp,
				fix : false,
				shade : shadeTemp,
				content : contentTemp,
				shadeClose : settings.shadeClose,
				offset :settings.offset,
				maxmin : settings.maxmin,
				zIndex : 9999,
				callBackFun:settings.callBackFun,
				invokedFunName:settings.invokedFunName,
				data:settings.data
			});
		}else {
			layer.open({
				type : settings.type,
			    title : settings.title,
				area  : areaTemp,
				fix : false,
				shade : shadeTemp,
				content : contentTemp,
				shadeClose : settings.shadeClose,
				offset :settings.offset,
				maxmin : settings.maxmin,
				zIndex : 9999,
				callBackFun:settings.callBackFun,
				invokedFunName:settings.invokedFunName,
				data:settings.data
			});
		}
		// Dialog		
		return this;
	};
	
		
	$.fn.openDlg = custom_dialog_ui4;
	$.fn.closeDlgByName = function(obj, name) {
		var index = obj.getFrameIndex(name);
		obj.close(index);
	}
	
	$.fn.closeDlg = function(obj) {
		var index = obj.getFrameIndex(window.name);
		obj.close(index);
	}
	
	$.fn.invokFunDlg = function(windowName, param) {
		parent.layer.invokFun(windowName, param);
	}
	
	/*	
	 * 警告窗口
	 * content：内容
	   callback：窗口关闭时执行的回调函数
	   parent：警告窗口的父窗口对象*/
/*	$.fn.dlg_alert = function(content,callback,parent){
		return $.dialog.alert(content,callback,parent);
	};
*/

	/*
	 * 确认窗口
	 * content: 内容
	 * yes: 确定按钮回调函数
	 * no: 取消按钮回调函数
	 * parent: 确认窗口的父窗口对象
	 */
	$.fn.dlg_confirm = function (content,yes,no,parent){
		
		layer.open({
		    content: content
		    ,btn: ['确认', '取消']
		    ,yes: function(index, layero){
		        //按钮【按钮一】的回调
		    	return true;
		    },cancel: function(index){
		        //按钮【按钮二】的回调
		    	return false;
		    }
		});
		//return $.dialog.confirm(content,yes,no,parent);
		return false;
	};

	/*
	 * 提问
	 * 	content：内容
		yes：确定按钮回调函数
		value：文本框默认值
		parent：提问窗口的父窗口对象
	 */
/*	$.fn.dlg_prompt = function(content,yes,value,parent){
		return $.dialog.prompt(content,yes,value,parent);
	};*/

	/*
	 * 短暂提示
	 * 	content：内容
		time：显示时间
		icon：提示图标
		callback：提示关闭时执行的函数
	 */
/*	$.fn.dlg_tips = function(content,time,icon,callback){
		return $.dialog.tips(content,time,icon,callback);
	};*/
	
})(jQuery);
