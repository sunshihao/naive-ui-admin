		/**
		 *  select2标签 addBy zhouyang addDate 201607
		 */
		function initSelect2(returnData) {
			if (!returnData) {
				jQuery("select").select2();
				return;
			}
			var selResult = returnData.result;
			for (var sel in selResult) {
				jQuery("#" + sel + "").select2({
							data : jQuery.map(selResult[sel], function(obj) {
										obj.id = obj.id || obj.code;
										obj.text = obj.text || obj.name;
										return obj;
									}),
							placeholder : "-请选择-",
							allowClear : true
						});
			}
			return true;
		}



