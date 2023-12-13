jQuery.namespace("common.base");
common.base = function() {
	return {
		/**
		 *  select2标签 addBy zhouyang addDate 201607
		 */
		initSelect2 : function(returnData) {
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
	}

}();
/**
 * 动态初始化参数
 */
(function($) {
	$.jgrid.extend({
				/**
				 * addBy qianjun.lin addDate 20160516 Jgrid操作栏加载方法
				 * jsonObject.actType 操作名称（如 新增） jsonObject.funcName 调用方法名称
				 * jsonObject.funcParam jsonObject.funcName的参数列表
				 */
				initGridAct : function(jsonObject) {
					var $t = this[0];// 获取jQuery对象
					var ifColumn = /^\#.*\#$/;// 判断是否为否为#号包含的参数
					var getResult = /(?!^\#).*(?=\#$)/;// 取出列名
					var ids = $($t).jqGrid('getDataIDs'); // 获取行id
					for (var i = 0; i < ids.length; i++) {// 根据行循环
						var actData = "";// 操作栏的数据
						$.each(jsonObject, function(j, n) {// 根据按钮个数遍历
									var funcParam = "";// 参数
									var iconClass ="";
									if (typeof(n.iconClass) != "undefined" && n.iconClass != "") {
										iconClass = n.iconClass;
									}
									if (n.funcParam && $.isArray(n.funcParam)) {
										$.each(n.funcParam, function(jp, np) {// 根据参数个数遍历
													if (ifColumn.test(np)) {// 校验通过
														// 则证明
														// 需要获取jQGrid的中某列的值作为参数
														var temp = String(getResult.exec(np));
														funcParam += "'" + $($t).jqGrid('getCell', ids[i], temp) + "',";
													} else {// 校验不通过 则证明
														// 此参数为直接传入的参数
														funcParam += "'" + np + "',";
													}
												});
									}
									var actTitle = "";
									// 校验链接名称 如果名称为#XX#格式 则证明 名称为动态名称
									if (ifColumn.test(n.actName)) {// 校验通过 则证明
										// 需要获取jQGrid的中某列的值作为参数
										var temp = String(getResult.exec(n.actName));
										actTitle = $($t).jqGrid('getCell', ids[i], temp);
									} else {
										actTitle = n.actName;
									}
									// 拼接操作数据 + "<i class='" + n.iconClass +
									// "'></i>"

									/*
									 * dpct : [{ 'statusCode' : ['2200',
									 * '2191'], 'sdfdsl':['',''] }]
									 */
									var addLink = false;
									if (n.dpct) {
										var tempDpct = n.dpct;
										if ($.isArray(tempDpct)) {
											$.each(tempDpct, function(x, y) {
														for (var t in y) {
															var val = $($t).jqGrid('getCell', ids[i], t);
															if ($.isArray(y[t])) {
																$.each(y[t], function(ind, obj) {
																			if (val == obj) {
																				addLink = true;
																				return;
																			}
																		});
															}
														}
													});
										}
									} else {
										addLink = true;
									}
									if (addLink) {
										if (actData == "") {
											// 第一个按钮 没有分隔符号
											actData = "<a href='javascript:void(0);' onclick=\"" + n.funcName + "(" + funcParam.substring(0, funcParam.length - 1) + ");\">" +"<i class='" + iconClass + "'></i>" + actTitle + "</a>";
										} else {
											actData += "  <a href='javascript:void(0);' onclick=\"" + n.funcName + "(" + funcParam.substring(0, funcParam.length - 1) + ");\">"+"<i class='" + iconClass + "'></i>" 
													+ actTitle + "</a>";
										}
									}

								});
						if (actData) {
							$($t).jqGrid('setRowData', ids[i], {
										act : actData
									});
						}
					}
				},

				/**
				 * 为每个链接增加一个colId属性
				 */
				initGridActWithId : function(jsonObject) {
					var $t = this[0];// 获取jQuery对象
					var ifColumn = /^\#.*\#$/;// 判断是否为否为#号包含的参数
					var getResult = /(?!^\#).*(?=\#$)/;// 取出列名
					var ids = $($t).jqGrid('getDataIDs'); // 获取行id
					for (var i = 0; i < ids.length; i++) {// 根据行循环
						var actData = "";// 操作栏的数据
						$.each(jsonObject, function(j, n) {// 根据按钮个数遍历
									var funcParam = "";// 参数
									var iconClass ="";
									//add id
									var colId = n.colId;
									if (typeof(n.iconClass) != "undefined" && n.iconClass != "") {
										iconClass = n.iconClass;
									}
									if (n.funcParam && $.isArray(n.funcParam)) {
										$.each(n.funcParam, function(jp, np) {// 根据参数个数遍历
													if (ifColumn.test(np)) {// 校验通过
														// 则证明
														// 需要获取jQGrid的中某列的值作为参数
														var temp = String(getResult.exec(np));
														funcParam += "'" + $($t).jqGrid('getCell', ids[i], temp) + "',";
													} else {// 校验不通过 则证明
														// 此参数为直接传入的参数
														funcParam += "'" + np + "',";
													}
												});
									}
									var actTitle = "";
									// 校验链接名称 如果名称为#XX#格式 则证明 名称为动态名称
									if (ifColumn.test(n.actName)) {// 校验通过 则证明
										// 需要获取jQGrid的中某列的值作为参数
										var temp = String(getResult.exec(n.actName));
										actTitle = $($t).jqGrid('getCell', ids[i], temp);
									} else {
										actTitle = n.actName;
									}
									// 拼接操作数据 + "<i class='" + n.iconClass +
									// "'></i>"

									/*
									 * dpct : [{ 'statusCode' : ['2200',
									 * '2191'], 'sdfdsl':['',''] }]
									 */
									var addLink = false;
									if (n.dpct) {
										var tempDpct = n.dpct;
										if ($.isArray(tempDpct)) {
											$.each(tempDpct, function(x, y) {
														for (var t in y) {
															var val = $($t).jqGrid('getCell', ids[i], t);
															if ($.isArray(y[t])) {
																$.each(y[t], function(ind, obj) {
																			if (val == obj) {
																				addLink = true;
																				return;
																			}
																		});
															}
														}
													});
										}
									} else {
										addLink = true;
									}
									if (addLink) {
										if (actData == "") {
											// 第一个按钮 没有分隔符号
											actData = "<a href='javascript:void(0);' colId=" + colId +  " onclick=\"" + n.funcName + "(" + funcParam.substring(0, funcParam.length - 1) + ");\">" +"<i class='" + iconClass + "'></i>" + actTitle + "</a>";
										} else {
											actData += "  <a href='javascript:void(0);' colId=" + colId +  " onclick=\"" + n.funcName + "(" + funcParam.substring(0, funcParam.length - 1) + ");\">"+"<i class='" + iconClass + "'></i>" 
													+ actTitle + "</a>";
										}
									}

								});
						if (actData) {
							$($t).jqGrid('setRowData', ids[i], {
										act : actData
									});
						}
					}
				},
				
				/**
				 * addBy zhouyang addDate 20160411 JqGird界面转码
				 */
				parseGridCode : function() {
					var args = $.makeArray(arguments).slice(1), o = {}, $t = this[0];
					var ids = $($t).jqGrid('getDataIDs');
					var userData = $($t).jqGrid('getGridParam', 'userData');
					for (var col in userData) {
						for (var i = 0; i < ids.length; i++) {
							// 为指定列做 编码到名称 的映射
							var queryKey = $($t).jqGrid('getCell', ids[i], col);
							jQuery.each(userData[col], function(key, value) {
										if (queryKey == key) {
											var data = {};
											data[col] = value;
											$($t).jqGrid('setRowData', ids[i], data);
											return;
										}
									});
						}
					}
				}
			});
})(jQuery);


