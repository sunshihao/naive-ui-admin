//---------------------更改select2的默认设置
//$.fn.select2.defaults.set("minimumResultsForSearch", -1);
//此选项可删除搜索栏
$.fn.select2.defaults.set("placeholder", "请选择");
$.fn.select2.defaults.set("allowClear", true);
$.extend({
	s2Map : function(data,id,text){
		if(data && id && text){
			data = $.map(data,function(obj){
				obj.id = obj[id]||obj.id;
				obj.text = obj[text]||obj.text;
				return obj;
			});
		}
		return data;
	}
});
$.fn.extend({
	select2Multi : function(option){
		option = $.extend({
			multiple : true,
			allowClear : true,
			closeOnSelect: false
		},option||{});
		this.select2(option);
	},
	select2Ajax : function(option){
		if(option&&!option.maximumResultsPerPage)
			option.maximumResultsPerPage = 20;
		option = $.extend(true,{//深拷贝
			ajax: {
				dataType: 'json',
				data: function(param){
					return{
						search: param.term,
						page: param.page || 1,
						maximumResultsPerPage: option.maximumResultsPerPage
					};
				},
			    processResults: function (returnData, param) {
			    	param.page = param.page || 1;
			    	return {
			    		results: returnData.items,
			    		pagination: {
			    			more: (param.page * returnData.maximumResultsPerPage) < returnData.totalCount
			    		}
			    	};
			    },
				delay: 300
			},
			minimumInputLength: 0
		},option||{});
		this.select2(option);
	}
});
