$.fn.extend({
	iLeadDateTimePicker : function(option){
		option = $.extend({
			festival: false, //是否显示节日
			fixed: false, //是否固定在可视区域
			zIndex: 99999 //css z-index
		},option||{});

		if(option.format&&(option.onlyYear||option.onlyYearMonth)){//适配datetimepicker的format格式
			option.format = option.format.replace(/YYYY|MM|DD|hh|mm|ss/g,function(str,index){
				switch(str){
				case "YYYY": return "yyyy";break;
				case "MM": return "mm";break;
				case "DD": return "dd";break;
				case "hh": return "hh";break;
				case "mm": return "ii";break;
				case "ss": return "ss";break;
				}
			});
		}
		if(option.onlyYear){
			this.datetimepicker({
				format: option.format||"yyyy",
				startView: 4,
				minView: 4,
				viewSelect: 4,
				autoclose: true
			});
		}
		else if(option.onlyYearMonth){
			this.datetimepicker({
				format: option.format||"yyyy-mm",
				startView: 3,
				minView: 3,
				viewSelect: 3,
				autoclose: true
			});
		}else if(option.rangePick){
			this.daterangepicker({
				timePicker: option.istime,
				timePicker24Hour: option.istime,
				locale: {
					format: option.format||option.istime&&"YYYY-MM-DD hh:mm",
					separator: option.separator
				}
			});
		}else{
			if(!option.format){
				if(option.istime)option.format = "YYYY-MM-DD hh:mm";
				else option.format = "YYYY-MM-DD";
			}
			if(this.length==1){
				option.elem = "#"+this[0].id;
				laydate(option);
			}
			else if(this.length==2){
				var start =  $.extend({},option);
					end = $.extend({},option);
				start.elem = "#"+this[0].id;
				end.elem = "#"+this[1].id;
				if(!start.choose){
					start.choose = function(date){
				    	end.min = date;
				    	end.start = date;
				    };
				}else{//如果choose已被定义就会额外执行操作
					var temp = start.choose;
					start.choose = function(date){
				    	end.min = date;
				    	end.start = date;
				    	temp(date);
				    };
				}
				if (!end.choose){
					end.choose = function(date){
				    	start.max = date;
				    	start.start = date;
				    };
				}else{
					var temp = end.choose;
					end.choose = function(date){
				    	start.max = date;
				    	start.start = date;
				    	temp(date);
				    };
				}
				laydate(start);
				laydate(end);
			}
		}
	}
});