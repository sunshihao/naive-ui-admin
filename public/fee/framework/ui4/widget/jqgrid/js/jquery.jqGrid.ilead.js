;(function($){
	
	var transObject = function(){  
		this.add = new Object();
		this.update = new Object();
		this.del = new Object();
	}
	
	var lastsel = {};
	
	var Map = function(){  
	    this._entrys = new Array();  
	      
	    this.put = function(key, value){  
	        if (key == null || key == undefined) {  
	            return;  
	        }  
	        var index = this._getIndex(key);  
	        if (index == -1) {  
	            var entry = new Object();  
	            entry.key = key;  
	            entry.value = value;  
	            this._entrys[this._entrys.length] = entry;  
	        }else{  
	            this._entrys[index].value = value;  
	        }          
	    };  
	    this.get = function(key){  
	        var index = this._getIndex(key);  
	        return (index != -1) ? this._entrys[index].value : null;  
	    };  
	    this.remove = function(key){  
	        var index = this._getIndex(key);  
	        if (index != -1) {  
	            this._entrys.splice(index, 1);  
	        }  
	    };  
	    this.clear = function(){  
	        this._entrys.length = 0;;  
	    };  
	    this.contains = function(key){  
	        var index = this._getIndex(key);  
	        return (index != -1) ? true : false;  
	    };  
	    this.getCount = function(){  
	        return this._entrys.length;  
	    };  
	    this.getEntrys =  function(){  
	        return this._entrys;  
	    };  
	   this._getIndex = function(key){  
	        if (key == null || key == undefined) {  
	            return -1;  
	        }  
	        var _length = this._entrys.length;  
	        for (var i = 0; i < _length; i++) {  
	            var entry = this._entrys[i];  
	            if (entry == null || entry == undefined) {  
	                continue;  
	            }  
	            if (entry.key === key) {//equal  
	                return i;  
	            }  
	        }  
	        return -1;  
	    };  
	}
	var getRandomHexCode = function(){
		var hex = "0123456789abcdef", s = [];
	    for (var i = 0; i < 10; i++) {
	        s[i] = hex.charAt(Math.floor(Math.random() * 0x10));
	    }
		return s.join("");
	}
	var adaptGroupHeader = function(colModelArrayTmp, colModelArray, groupHeader){
		var currGroupNum = 0,
			currGroupIdx = -1,
			currStartColName = "";
		$.each(colModelArrayTmp, function(l, o)  {
			if(currGroupNum == 0){
				$.each(groupHeader,function(idx,val){
					if(val.startColumnName == o.name){
						currGroupIdx = idx;
						currStartColName = o.name;
						currGroupNum = val.numberOfColumns;
						return false;
					}
				});
			}
			if(currGroupNum > 0){
				if($.inArray(o.name,colModelArray)< 0) {
					if(o.name != currStartColName){
						if(--groupHeader[currGroupIdx].numberOfColumns == 0)
							groupHeader.splice(currGroupIdx,1);
					}else{
						if(currGroupNum > 1){
							groupHeader[currGroupIdx].startColumnName = colModelArrayTmp[l+1].name;
						}else{
							groupHeader.splice(currGroupIdx,1);
						}
					}
				}
				--currGroupNum;
				if(currGroupNum == 0){
					currGroupIdx = -1;
					currStartColName = "";
				}
			}
		});
		$.each(groupHeader,function(l, o){
			o.startColumnIndex = $.inArray(o.startColumnName,colModelArray);
			delete o.startColumnName;//去无用数据
		});
		return JSON.stringify(groupHeader);
	}
	
$.jgrid.extend({
	//add by zrzdemon
	
	//触发导出execl操作
	exportExcelAction : function() {
		//alert("exportExcelAction");
		var args = $.makeArray(arguments).slice(1), o = {}, $t = this[0],ret; 
		var url = $($t).jqGrid("getGridParam", "url");
		var postData = $($t).jqGrid("getGridParam", "postData");		
		var records = $($t).jqGrid("getGridParam", "records");		
		var rowNum = $($t).jqGrid("getGridParam", "rowNum");		
		var colNames = $($t).jqGrid("getGridParam", "colNames");
		var colModel = $($t).jqGrid("getGridParam", "colModel");
		var operatorKey = $($t).jqGrid("getGridParam", "operatorKey");
		var exportCol = $($t).jqGrid("getGridParam", "exportCol");
		var groupHeader = $.extend(true,{},($($t).jqGrid("getGridParam", "groupHeader")||{})["groupHeaders"]);

		//获取合计的值
		var footData = $($t).footerData("get");
		//
		var colModelArray = new Array();
		var colModelArrayTmp = new Array();
		var hiddenArray  = new Array();
		var blankArray  = new Array();			
		var colNamesArray = new Array();
		var colNamesArrayTmp = new Array();
		var codeMappingKeyArray = new Array();
		var codeMappingSeparatorArray = new Array();
		var codeMappingKeyColArray = new Array();
		//过滤空白标题
		$.each(colNames, function(j, k){
			if(k != "" && k.indexOf("input") < 0) { 
				colNamesArrayTmp.push(k);
			}else {
				blankArray.push(j);
			}
		});
		
		$.each(colModel, function(i, n)  {
			if($.inArray(i, blankArray) < 0) {
				colModelArrayTmp.push(n);
		    }
			//获取codeMappingKey
			if(typeof(n.codeMappingKey) != "undefined" && n.codeMappingKey != "") {
				codeMappingKeyArray.push(n.codeMappingKey);
				codeMappingSeparatorArray.push(n.codeMappingSeparator||"none");
				codeMappingKeyColArray.push(n.name);
			}
		});
		
		if(exportCol==="all"){//导出所有列
			$.each(colModelArrayTmp, function(l, o)  {
				colModelArray.push(o.name);		
			});
			$.each(colNamesArrayTmp, function(z,m){
				colNamesArray.push(m);
			});
		}else if($.isArray(exportCol)){//导出自选列
			$.each(colModelArrayTmp, function(l, o)  {
				if($.inArray(o.name,exportCol)>-1) {
					colModelArray.push(o.name);		
				}else {
					hiddenArray.push(l);
				}			
			});
			$.each(colNamesArrayTmp, function(z,m){
				if($.inArray(z, hiddenArray) < 0) { 
					colNamesArray.push(m);
				}
			});
		}else{//导出显示列
			$.each(colModelArrayTmp, function(l, o)  {
				if(typeof(o.hidden) == "undefined" || !o.hidden) {
					colModelArray.push(o.name);		
				}else {
					hiddenArray.push(l);
				}			
			});
			$.each(colNamesArrayTmp, function(z,m){
				if($.inArray(z, hiddenArray) < 0) { 
					colNamesArray.push(m);
				}
			});
		}
        if(groupHeader && exportCol!="all"){
        	groupHeader = adaptGroupHeader(colModelArrayTmp, colModelArray, groupHeader)
        }
		var hiddenStr = "";
		$.each(postData, function(key, value) {
			hiddenStr = hiddenStr + "<input type='hidden' id='" + key + "' name='" + key + "' value='" + value + "' />"
		});
		var postDataStr = JSON.stringify(postData);
		var colNamesStr = JSON.stringify(colNamesArray);
		var colModelStr = JSON.stringify(colModelArray);
		var codeMappingKeyStr = JSON.stringify(codeMappingKeyArray);
		var codeMappingSeparatorStr = JSON.stringify(codeMappingSeparatorArray);
		var codeMappingKeyColStr = JSON.stringify(codeMappingKeyColArray);
		var footDataStr = "";
		if(!$.isEmptyObject(footData)) {
			footDataStr = JSON.stringify(footData);
		}
				
		var exportVersion = "<div class='form-group'><label class='radio-inline col-xs-4'>导出版本</label><div class='col-xs-8'><label class='radio-inline'><input type='radio' name='exportVersion' value='2003'checked />EXCEL 2003</label><label class='radio-inline'><input class='' type='radio' name='exportVersion' value='pdf' />PDF</label></div></div>";
		//var exportVersion = "<div class='form-group'><label class='radio-inline col-xs-4'>导出版本</label><div class='col-xs-8'><label class='radio-inline'><input type='radio' name='exportVersion' value='2003'checked />execl2003</label></div></div>";
		var exportMode = "<div class='form-group'><label class='radio-inline col-xs-4'>导出方式</label><div class='col-xs-8'><label class='radio-inline'><input  type='radio' class='exportMode' name='exportMode' value='all' />全部导出</label><label class='radio-inline'><input class='exportMode' type='radio' name='exportMode' value='cur' checked />当前页</label></div></div>";
		//var exportMode = "<div class='form-group'><label class='radio-inline col-xs-4'>导出方式</label><div class='col-xs-8'><label class='radio-inline'><input class='' type='radio' name='exportMode' value='cur' checked />当前页</label></div></div>";		
		var exportAction = "<div class='modal-footer'><button type='submit' id='saveButton' class='btn btn-default' >导出</button></div>";
		var hiddenArea = "<div class='form-group'>" + hiddenStr + "<input type='hidden' id='operatorKey' name='operatorKey' value='" + operatorKey + "' /><input type='hidden' id='colModelStr' name='colModelStr' value='" + colModelStr + "' /><input type='hidden' id='colNamesStr' name='colNamesStr' value='" + colNamesStr + "' /><input type='hidden' id='url' name='url' value='" + url + "' /><input type='hidden' id='postData' name='postData' value='" + postDataStr + "' /><input type='hidden' id='records' name='records' value='" + records + "' /><input type='hidden' id='footData' name='footData' value='" + footDataStr + "' /><input type='hidden' id='codeMappingKey' name='codeMappingKey' value='" + codeMappingKeyStr + "' /><input type='hidden' id='codeMappingSeparator' name='codeMappingSeparator' value='" + codeMappingSeparatorStr + "' /><input type='hidden' id='codeMappingKeyCol' name='codeMappingKeyCol' value='" + codeMappingKeyColStr + "' /><input type='hidden' id='groupHeader' name='groupHeader' value='" + groupHeader + "' /></div>"
		var htmlContent = "<div class='container-fluid'><div class='row'><div class='col-xs-12'><form class='form-horizontal' name='exportForm' id='exportForm' method='post' action='"+ url + "&exportFlag=true' >" + hiddenArea + exportVersion + exportMode + exportAction + "</form></div></div></div>";
		layer.open({
		    type: 1,
		    title: "导出设置",
		    area: ['400px', '210px'], //宽高
		    shade: 0.8,
		    shadeClose :true,
		    zIndex :99999,
		    content: htmlContent
		});	
		$(".exportMode").change(function() {
			if($(this).val() == "all") {
				$("#rows").val(records);
			}else {
				$("#rows").val(rowNum);
			}
		});
	},
	
	expandAllAction : function() {
		var args = $.makeArray(arguments).slice(1), o = {}, $t = this[0]; 
		var expandAll = $($t).jqGrid('getGridParam', 'expandAll');
		if(expandAll) {
			var ids = $($t).jqGrid('getDataIDs');
			for(var i=0;i<ids.length;i++){
				$($t).jqGrid('updateRowAction', ids[i]);
			}
		}else {
			alert("expandAll属性设置错误！");
		}
	},
	
    //列渲染
    operatorRender : function(jsonObject) {
    	var args = $.makeArray(arguments).slice(1), o = {}, $t = this[0]; 
    	var ids = $($t).jqGrid('getDataIDs');
		var userData = $($t).jqGrid('getGridParam', 'userData');
		var addStr = "";
		
		var delStr = "";
		var ifColumn = /^\#.*\#$/;
		var getResult = /(?!^\#).*(?=\#$)/;
		for(var i=0;i<ids.length;i++) {
			//为每行添加自定义功能按钮
			var cl = ids[i];
			var editStr = "";
			var addStr = "";
			var delStr = "";
			var actStr = "";
			var otherStr = "";
	        var iconClass = "";
	        var title = "";
	        var ifTitShow = true;
			if(jsonObject.edit) {
				var editParamStr = "";	
				if (typeof(jsonObject.editParam.funcParam) != "undefined") {
					$.each(jsonObject.editParam.funcParam, function(j, n){
						if(ifColumn.test(n)){
							//temp必须是string类型 所以比对类型和值相等必须使用===
							var temp = String(getResult.exec(n));					
							editParamStr = editParamStr + "'" + $($t).jqGrid('getCell',ids[i], temp) + "',";
						}else {
							editParamStr = editParamStr + "'" + n + "',";
						}
					});
				}  			
				if (typeof(jsonObject.editParam.title) != "undefined" && jsonObject.editParam.title != "") {
					title = jsonObject.editParam.title;
				}else {
					title = "编辑";
				}
				if (typeof(jsonObject.editParam.iconClass) != "undefined" && jsonObject.editParam.iconClass != "") {
					iconClass = jsonObject.editParam.iconClass;
				}
				if (typeof(jsonObject.editParam.ifTitShow) != "undefined" && typeof(jsonObject.editParam.ifTitShow) == "boolean") {
					ifTitShow = jsonObject.editParam.ifTitShow;
				}
				if(editParamStr == "") {
					editStr = "&nbsp;&nbsp; <a  href='javascript:void(0);'  onclick=\"" + jsonObject.editParam.funcName + "('" + cl + "'" + ");\"  >" + "<i class='" + iconClass + "'></i>" + ((ifTitShow)?title:"") + "</a>";
				}else {
					editStr = "&nbsp;&nbsp; <a  href='javascript:void(0);'  onclick=\"" + jsonObject.editParam.funcName + "('" + cl + "'," + editParamStr.substring(0, editParamStr.length-1) + ");\"  >" + "<i class='" + iconClass + "'></i>" + ((ifTitShow)?title:"") + "</a>";
				}
				actStr = actStr + editStr;
			}
			if(jsonObject.add) {				
				var addParamStr = "";
				if (typeof(jsonObject.addParam.funcParam) != "undefined") {
					$.each(jsonObject.addParam.funcParam, function(j, n){
						if(ifColumn.test(n)){
							var temp = String(getResult.exec(n));					
							addParamStr = addParamStr + "'" + $($t).jqGrid('getCell',ids[i], temp) + "',";
						}else {
							addParamStr = addParamStr + "'" + n + "',";
						}
					});
				}
				if (typeof(jsonObject.addParam.title) != "undefined" && jsonObject.addParam.title != "") {
					title = jsonObject.editParam.title;
				}else {
					title = "添加";
				}
				if (typeof(jsonObject.addParam.iconClass) != "undefined" && jsonObject.addParam.iconClass != "") {
					iconClass = jsonObject.addParam.iconClass;
				}
				if (typeof(jsonObject.addParam.ifTitShow) != "undefined" && typeof(jsonObject.addParam.ifTitShow) == "boolean") {
					ifTitShow = jsonObject.addParam.ifTitShow;
				}
				if(addParamStr == "") {
					addStr = "&nbsp;&nbsp; <a  href='javascript:void(0);'  onclick=\"" + jsonObject.addParam.funcName + "('" + cl + "'" + ");\" >" + "<i class='" + iconClass + "'></i>" + ((ifTitShow)?title:"") + "</a>";
				}else {
					addStr = "&nbsp;&nbsp; <a  href='javascript:void(0);'  onclick=\"" + jsonObject.addParam.funcName + "('" + cl + "'," + addParamStr.substring(0, addParamStr.length-1) + ");\" >" + "<i class='" + iconClass + "'></i>" + ((ifTitShow)?title:"") + "</a>";
				}
				actStr = actStr + addStr;
			}
			if(jsonObject.del) {
				var delParamStr = "";	
				if (typeof(jsonObject.delParam.funcParam) != "undefined") {
					$.each(jsonObject.delParam.funcParam, function(j, n){
						if(ifColumn.test(n)){
							var temp = String(getResult.exec(n));				
							delParamStr = delParamStr + "'" + $($t).jqGrid('getCell',ids[i], temp) + "',";
						}else {
							delParamStr = delParamStr + "'" + n + "',";
						}
					});	
				}
				if (typeof(jsonObject.delParam.title) != "undefined" && jsonObject.delParam.title != "") {
					title = jsonObject.delParam.title;
				}else {
					title = "删除";
				}
				if (typeof(jsonObject.delParam.iconClass) != "undefined" && jsonObject.delParam.iconClass != "") {
					iconClass = jsonObject.delParam.iconClass;
				}
				if (typeof(jsonObject.delParam.ifTitShow) != "undefined" && typeof(jsonObject.delParam.ifTitShow) == "boolean") {
					ifTitShow = jsonObject.delParam.ifTitShow;
				}	
				if(delParamStr == "") {
					delStr = "&nbsp;&nbsp; <a  href='javascript:void(0);'  onclick=\"" + jsonObject.delParam.funcName + "('" + cl + "'" + ");\"  >" + "<i class='" + iconClass + "'></i>" + ((ifTitShow)?title:"") + "</a>";
				}else {
					delStr = "&nbsp;&nbsp; <a  href='javascript:void(0);'  onclick=\"" + jsonObject.delParam.funcName + "('" + cl + "'," + delParamStr.substring(0, delParamStr.length-1) + ");\" >" + "<i class='" + iconClass + "'></i>" + ((ifTitShow)?title:"") + "</a>";
				}
				actStr = actStr + delStr;
			}
			if(jsonObject.other) {
				if (typeof(jsonObject.otherParam) != "undefined") {
					$.each(jsonObject.otherParam, function(j, n){
						var otherParamStr = "";
						iconClass = "";
						otherStr = "";
						if (typeof(n.funcParam) != "undefined") {
							$.each(n.funcParam, function(k, subN ){
								if(ifColumn.test(subN)){
									var temp = String(getResult.exec(subN));				
									otherParamStr = otherParamStr + "'" + $($t).jqGrid('getCell',ids[i], temp) + "',";
								}else {
									otherParamStr = otherParamStr + "'" + subN + "',";
								}
							});
						}
						if (typeof(n.title) != "undefined" && n.title != "") {
							title = n.title;
						}else {
							title = "无";
						}
						if (typeof(n.iconClass) != "undefined" && n.iconClass != "") {
							iconClass = n.iconClass;
						}
						if (typeof(n.ifTitShow) != "undefined" && n.ifTitShow != "") {
							ifTitShow = n.ifTitShow;
						}						
						if(otherParamStr == "") {
							otherStr = "&nbsp;&nbsp; <a  href='javascript:void(0);'  onclick=\"" + n.funcName + "('" + cl + "'" + ");\"  >" + "<i class='" + iconClass + "'></i>" + ((ifTitShow)?title:"") + "</a>";
						}else {
							otherStr = "&nbsp;&nbsp; <a  href='javascript:void(0);'  onclick=\"" + n.funcName + "('" + cl + "'," + otherParamStr.substring(0, otherParamStr.length-1) + ");\" >" +"<i class='" + iconClass + "'></i>" + ((ifTitShow)?title:"") + "</a>";
						}
						actStr = actStr + otherStr;
					});
				}
			}
			$($t).jqGrid('setRowData',ids[i],{act:actStr});		
		}
    },
    
    getGridDataAction:function() {
    	var args = $.makeArray(arguments).slice(1), o = {}, $t = this[0],ret; 
    	var resultMap = $($t).jqGrid("getGridParam", "dataMap");
    	var lastId = lastsel[$t.id];   	
    	var addArray = new Array();
    	var delArray = new Array();
    	var updateArray = new Array();
    	var tempObj;
    	var obj;
    	var operatorKey;
    	var busiKey;
    	ret = $t.p;
    	var setting =  $t.p;
    	var delObj;

    	var ind;
    	var resultObj = new transObject();
    	var expandAll = $($t).jqGrid('getGridParam', 'expandAll');
    	if(lastId != "") {
    		//判断是否需要全部展开，需要就不用保存			
			if(!expandAll){
				var ind = $($t).jqGrid("getInd",lastId,true);
				var editable = $(ind).attr("editable");
				if(editable === "1") {
					if(!$($t).jqGrid('saveRowNew', lastId, false)) {
						return JSON.stringify(resultObj);;
    				} 
				}else {
					$($t).jqGrid('saveRowNew', lastId, false);
				} 
			}			 
		}
    	$.each(resultMap.getEntrys(), function(j, n) {
    		tempObj = n.value;
    		ind = $($t).jqGrid("getInd", n.key, true);    		
    		if(ind) {
    			$($t).jqGrid("saveRowNew", n.key, false);
        		obj = $($t).jqGrid('getRowData', n.key);
        		operatorKey = $($t).jqGrid("getGridParam", "operatorKey");
        		
        		if(setting.hasOwnProperty("operatorKey")) {
        			delete obj[$($t).jqGrid("getGridParam", "operatorKey")];
        		}else {
        		    alert("请先设置operatorKey");	
        		    return "";
        		}			
    			if(tempObj.operAction == "add") {				
    				addArray.push(obj);
        		}else if(tempObj.operAction == "update") {
        			//处理值发生变化的
        			if(tempObj.status == "2") {
        				updateArray.push(obj);
        			}       			
        		}else if(tempObj.operAction == "delete") {

        			if(typeof $($t).jqGrid("getGridParam", "busiKey") == "string") {
            			delObj = new Object();
            			delObj[$($t).jqGrid("getGridParam", "busiKey")] = tempObj.busiKey;
        				delArray.push(delObj); 
        				if(!$($t).jqGrid('delRowData', tempObj.id)){
        					alert("错误的删除类型！");
        				}
        			}else if(typeof $($t).jqGrid("getGridParam", "busiKey") == "object") {
        				delObj = new Object();
        				$.each($($t).jqGrid("getGridParam", "busiKey"), function(index,name){
        					delObj[name] = tempObj.busiKey[name];    					
        				});
        				delArray.push(delObj); 
        				if(!$($t).jqGrid('delRowData', tempObj.id)){
        					alert("错误的删除类型！");
        				}
        			}else {
        				alert("错误的删除类型！");
        			}
        			
        		}else {
        			alert("有非法数据提交！");
        		}
    		}else if(tempObj.operAction == "delete") {	
    			if(typeof $($t).jqGrid("getGridParam", "busiKey") == "string") {
        			delObj = new Object();
        			delObj[$($t).jqGrid("getGridParam", "busiKey")] = tempObj.busiKey;
    				delArray.push(delObj); 
    			}else if(typeof $($t).jqGrid("getGridParam", "busiKey") == "object") {
    				delObj = new Object();
    				$.each($($t).jqGrid("getGridParam", "busiKey"), function(index,name){
    					delObj[name] = tempObj.busiKey[name];    					
    				});
    				delArray.push(delObj); 
    			}else {
    				alert("错误的删除类型！");
    			}
    		}
    	        		
    	});
    	
    	if(addArray.length > 0) {
    		resultObj.add = addArray;
    	}
    	if(updateArray.length > 0) {
    		resultObj.update = updateArray;
    	}
    	if(delArray.length > 0) {
    		resultObj.del = delArray;
    	}
    	if(expandAll){
    		$($t).jqGrid('expandAllAction');
    	}
    	//添加判断是否是IE8
    	var _el = document.createElement('DIV'),_style = _el.style,_agent = navigator.userAgent,_platform = navigator.platform;
        var isopera = ("opera" in window); 
        var isie = (("all" in document) && ("attachEvent" in _el) && !isopera); 
		var isie8 = isie && ("documentMode" in document) && (document.documentMode == 8);
    	if(isie8) {
    		eval("var resultStr = '" + JSON.stringify(resultObj) + "';");
    		return resultStr;
    	}else {
    		return JSON.stringify(resultObj);
    	}    	
    },
    
    updateRowAction:function(id) {
    	var args = $.makeArray(arguments).slice(1), o = {}, $t = this[0];   
    	var lastId = lastsel[$t.id];   	
    	if(id != ""){ 
    		if(lastId != "") {
    			//判断是否需要全部展开，需要就不用保存
    			var expandAll = $($t).jqGrid('getGridParam', 'expandAll');
    			if(!expandAll){
    				if(editable === "1") {
    					if(!$($t).jqGrid('saveRowNew', lastId, false)) {
    						return JSON.stringify(resultObj);;
        				} 
    				}else {
    					$($t).jqGrid('saveRowNew', lastId, false);
    				}
    			}
    		}
    		$($t).jqGrid('editRow', id, {keys : true} ); 
        	lastsel[$t.id] =  id; 
        	var mydata = new Object();
     	    mydata.id = id;
     	    mydata.operAction = "update";
     	    mydata.status = "0";
     	    //处理已经存在的行是新添加的
     	    var dataMap = $($t).jqGrid("getGridParam", "dataMap");
     	    if(dataMap.get(id) != null) {
     	    	
     	    	var dataObj = dataMap.get(id);
     	    	if(dataObj.operAction != null && dataObj.operAction == "add") {
         	    	mydata.operAction = "add";
         	    }
     	    }  
     	    $($t).jqGrid("getGridParam", "dataMap").put(id, mydata);
    	}
    },
    
    updateRowAction:function(id, ifKey) {
    	var args = $.makeArray(arguments).slice(1), o = {}, $t = this[0];   
    	var lastId = lastsel[$t.id];   	
    	if(id != ""){ 
    		if(lastId != "") {
    			//判断是否需要全部展开，需要就不用保存
    			var expandAll = $($t).jqGrid('getGridParam', 'expandAll');
    			if(!expandAll){
    				var ind = $($t).jqGrid("getInd",lastId,true);
    				var editable = $(ind).attr("editable");
    				if(editable === "1") {
    					if(!$($t).jqGrid('saveRowNew', lastId, false)) {
        					return;
        				} 
    				}else {
    					$($t).jqGrid('saveRowNew', lastId, false);
    				}   				
    			}
    		}
    		$($t).jqGrid('editRow', id, {keys : ifKey} ); 
        	lastsel[$t.id] =  id; 
        	var mydata = new Object();
     	    mydata.id = id;
     	    mydata.operAction = "update";
     	    mydata.status = "0";
     	    //处理已经存在的行是新添加的
     	    var dataMap = $($t).jqGrid("getGridParam", "dataMap");
     	    if(dataMap.get(id) != null) {
     	    	
     	    	var dataObj = dataMap.get(id);
     	    	if(dataObj.operAction != null && dataObj.operAction == "add") {
         	    	mydata.operAction = "add";
         	    }
     	    }  
     	    $($t).jqGrid("getGridParam", "dataMap").put(id, mydata);
    	}
    },
    
    hiddenRowAction:function(id) {
    	var args = $.makeArray(arguments).slice(1), o = {}, $t = this[0];
    	var setting =  $t.p;
    	var rowData;
    	
    	var mydata = new Object();
		mydata.id = id;
		mydata.operAction = "delete";
		mydata.status = "0";
				
    	if(setting.hasOwnProperty("busiKey")) {
    		rowData = $($t).jqGrid('getRowData', id);
            //添加多主键	
    		if(typeof setting.busiKey == "string") {
    			mydata.busiKey = rowData[$($t).jqGrid("getGridParam", "busiKey")];
    		}else if(typeof setting.busiKey == "object") {
    			var busObject = new Object();
    			$.each($($t).jqGrid("getGridParam", "busiKey"), function(index, name){
    				busObject[name] = rowData[name];
    			});
    			mydata.busiKey = busObject;
    		}else {
    			alert("错误的删除类型！");
    		}
		}else {
		    alert("请先设置busiKey");	
		    return;
		}	
    	var lastId = lastsel[$t.id];
    	if(confirm("确定要删除此数据")){
    		
    		if(lastId != "") {
    			//判断是否需要全部展开，需要就不用保存
    			var expandAll = $($t).jqGrid('getGridParam', 'expandAll');
    			if(!expandAll){
    				$($t).jqGrid('saveRowNew', lastId, false); 
    			}
    		}
    		if($($t).jqGrid('setRowData', id, null,{display: 'none'})) {
    			  //处理已经存在的行是新添加的
    			var obj = $($t).jqGrid("getGridParam", "dataMap").get(id);
    	     	if(obj != null) {
    	     	    if(obj.operAction != null && obj.operAction == "add") {
    	         	   //mydata.operAction = "add";
    	     	       $($t).jqGrid("getGridParam", "dataMap").remove(id);
    	         	}
    	     	}else {
    	     		$($t).jqGrid("getGridParam", "dataMap").put(id, mydata);
    	     	}
    			
        		lastsel[$t.id] =  id; 
    		}else {
    		    alert("删除发生异常！");	
    		}    		
    		
    	}
    },
    
    delRowAction:function(id) {
    	var args = $.makeArray(arguments).slice(1), o = {}, $t = this[0];
    	var setting =  $t.p;
    	var rowData;
    	
    	var mydata = new Object();
		mydata.id = id;
		mydata.operAction = "delete";
		mydata.status = "0";
				
    	if(setting.hasOwnProperty("busiKey")) {
    		rowData = $($t).jqGrid('getRowData', id);
            //添加多主键	
    		if(typeof setting.busiKey == "string") {
    			mydata.busiKey = rowData[$($t).jqGrid("getGridParam", "busiKey")];
    		}else if(typeof setting.busiKey == "object") {
    			var busObject = new Object();
    			$.each($($t).jqGrid("getGridParam", "busiKey"), function(index, name){
    				busObject[name] = rowData[name];
    			});
    			mydata.busiKey = busObject;
    		}else {
    			alert("错误的删除类型！");
    		}
		}else {
		    alert("请先设置busiKey");	
		    return;
		}	
    	var lastId = lastsel[$t.id];
    	if(confirm("确定要删除此数据")){
    		
    		if(lastId != "") {
    			//判断是否需要全部展开，需要就不用保存
    			var expandAll = $($t).jqGrid('getGridParam', 'expandAll');
    			if(!expandAll){
    				$($t).jqGrid('saveRowNew', lastId, false); 
    			} 
    		}
    		
    		if($($t).jqGrid('delRowData', id)) {
    			  //处理已经存在的行是新添加的
    			var obj = $($t).jqGrid("getGridParam", "dataMap").get(id);
    	     	if(obj != null) {
    	     	    if(obj.operAction != null && obj.operAction == "add") {
    	         	   //mydata.operAction = "add";
    	     	    	$($t).jqGrid("getGridParam", "dataMap").remove(id);
    	         	}else if(obj.operAction != null && obj.operAction == "update"){
    	         		$($t).jqGrid("getGridParam", "dataMap").put(id, mydata);
    	         	}
    	     	}else {
    	     		$($t).jqGrid("getGridParam", "dataMap").put(id, mydata);
    	     	}
    			
        		lastsel[$t.id] =  id; 
    		}else {
    		    alert("删除发生异常！");	
    		}    		
    		
    	}
    },
    
    addRowDataAction:function(dataObj) {
    	var args = $.makeArray(arguments).slice(1), o = {}, $t = this[0];
    	var newrowid;
    	var mydata;
    	$.each(dataObj, function(j, n) {
    		var lastId = lastsel[$t.id];
        	if(lastId != "") {
        		//判断是否需要全部展开，需要就不用保存
    			var expandAll = $($t).jqGrid('getGridParam', 'expandAll');
    			if(!expandAll){
    				$($t).jqGrid('saveRowNew', lastId, false); 
    			}
    		}
    	    newrowid = getRandomHexCode();   	    
    	    if($($t).jqGrid('addRowData', newrowid, n)) {
    	    	mydata = new Object();
        	    mydata.id = newrowid;
        	    mydata.operAction = "add";
        	    mydata.status = "0";
        	    $($t).jqGrid("getGridParam", "dataMap").put(newrowid, mydata);
        	    $($t).jqGrid('editRow', newrowid, {keys: true}); 
        	    lastsel[$t.id] = newrowid;
    	    }    	    	  
    	});
    },
    
    addRowDataAction:function(dataObj, ifKey) {
    	var args = $.makeArray(arguments).slice(1), o = {}, $t = this[0];
    	var newrowid;
    	var mydata;
    	$.each(dataObj, function(j, n) {
    		var lastId = lastsel[$t.id];
        	if(lastId != "") {
        		//判断是否需要全部展开，需要就不用保存
    			var expandAll = $($t).jqGrid('getGridParam', 'expandAll');
    			if(!expandAll){
    				$($t).jqGrid('saveRowNew', lastId, false); 
    			}
    		}
    	    newrowid = getRandomHexCode();   	    
    	    if($($t).jqGrid('addRowData', newrowid, n)) {
    	    	mydata = new Object();
        	    mydata.id = newrowid;
        	    mydata.operAction = "add";
        	    mydata.status = "0";
        	    $($t).jqGrid("getGridParam", "dataMap").put(newrowid, mydata);
        	    $($t).jqGrid('editRow', newrowid, {keys: ifKey}); 
        	    lastsel[$t.id] = newrowid;
    	    }    	    	  
    	});
    },
    
    addRowAction:function() {
    	var args = $.makeArray(arguments).slice(1), o = {}, $t = this[0];
    	var lastId = lastsel[$t.id];
    	if(lastId != "") {
    		//判断是否需要全部展开，需要就不用保存
    		var expandAll = $($t).jqGrid('getGridParam', 'expandAll');
			if(typeof(expandAll) == "undefined") {
				expandAll = false;
	    	}
			if(!expandAll){
				if(!$($t).jqGrid('saveRowNew', lastId, false)) {
					return;
				} 
			}
		}
    	if (!$t.grid ) { return success; }
    	var colModel = $($t).jqGrid().getGridParam("colModel") ;  
    	
	    var cellLenth = colModel.length ; 
	    var newRow = JSON.stringify(colModel);  
	    var ids = $($t).jqGrid('getDataIDs');  
	    //如果jqgrid中没有数据 定义行号为1 ，否则取当前最大行号+1  
	    var rowid = (ids.length ==0 ? 1: Math.max.apply(Math,ids)+1);  
	    //获得新添加行的行号（为什么是负数呢,与编辑行差别对待）  
	    var newrowid = getRandomHexCode();
	    //设置grid单元格不可编辑 （防止在添加时，用户修改其他非添加行的数据）  
	   // $($t).setGridParam({cellEdit:true});  
	    //将新行追加到表格头部  
	    if(expandAll) {
	    	$($t).jqGrid("addRowData", newrowid,newRow , "last", {keys: true});  
	    }else {
	    	$($t).jqGrid("addRowData", newrowid,newRow , "last", {keys: true});  
	    }	        
	    //设置grid单元格可编辑（防止追加行后，可编辑列无法编辑）  
	    $($t).jqGrid('editRow', newrowid, {keys: true}); 
	    //定义对象
	    var mydata = new Object();
	    mydata.id = newrowid;
	    mydata.operAction = "add";
	    mydata.status = "0";
	    $($t).jqGrid("getGridParam", "dataMap").put(newrowid, mydata);	   
	    lastsel[$t.id] = newrowid;
	    return newrowid;
    },
    
    addRowAction:function(ifkey) {
    	if(typeof(ifkey) == "undefined" || ifkey == null && ifkey == "") {
    		ifkey=false;
    	}
    	var args = $.makeArray(arguments).slice(1), o = {}, $t = this[0];
    	var lastId = lastsel[$t.id];
    	if(lastId != "") {
    		//判断是否需要全部展开，需要就不用保存
			var expandAll = $($t).jqGrid('getGridParam', 'expandAll');
			if(typeof(expandAll) == "undefined") {
				expandAll = false;
	    	}
			if(!expandAll){
				var ind = $($t).jqGrid("getInd",lastId,true);
				var editable = $(ind).attr("editable");
				if(editable === "1") {
					if(!$($t).jqGrid('saveRowNew', lastId, false)) {
    					return;
    				} 
				}else {
					$($t).jqGrid('saveRowNew', lastId, false);
				} 
			}else {
				$($t).jqGrid('saveRowNew', lastId, false)
				$($t).jqGrid('editRow', lastId, {keys : ifkey} ); 
			}
		}
    	if (!$t.grid ) { return success; }
    	var colModel = $($t).jqGrid().getGridParam("colModel") ;  
    	
	    var cellLenth = colModel.length ; 
	    var newRow = JSON.stringify(colModel);  
	    var ids = $($t).jqGrid('getDataIDs');  
	    //如果jqgrid中没有数据 定义行号为1 ，否则取当前最大行号+1  
	    var rowid = (ids.length ==0 ? 1: Math.max.apply(Math,ids)+1);  
	    //获得新添加行的行号（为什么是负数呢,与编辑行差别对待）  
	    var newrowid = getRandomHexCode();
	    //alert(newrowid);
	    //设置grid单元格不可编辑 （防止在添加时，用户修改其他非添加行的数据）  
	   // $($t).setGridParam({cellEdit:true});  
	    //将新行追加到表格头部  
	    if(expandAll) {	 
	        $($t).jqGrid("addRowData", newrowid,newRow , "last", {keys: ifkey});  
	    }else {
	    	$($t).jqGrid("addRowData", newrowid,newRow , "last", {keys: ifkey}); 
	    }
	    //设置grid单元格可编辑（防止追加行后，可编辑列无法编辑）  
	    $($t).jqGrid('editRow', newrowid, {keys: ifkey}); 
//	    if(expandAll) {	    	
//	    	 $($t).jqGrid('expandAllAction'); 
//	    }
	    //定义对象
	    var mydata = new Object();
	    mydata.id = newrowid;
	    mydata.operAction = "add";
	    mydata.status = "0";
	    $($t).jqGrid("getGridParam", "dataMap").put(newrowid, mydata);	   
	    lastsel[$t.id] = newrowid;
	    return newrowid;
    },
    
    addRowDataNew : function(rowid,rdata,pos,src) {
		if(["first", "last", "before", "after"].indexOf(pos) == -1) {pos = "last";}
		var success = false, nm, row, gi, si, ni,sind, i, v, prp="", aradd, cnm, cn, data, cm, id;
		if(rdata) {
			if($.isArray(rdata)) {
				aradd=true;
				//pos = "last";
				cnm = rowid;
			} else {
				rdata = [rdata];
				aradd = false;
			}
			this.each(function() {
				
				var t = this, datalen = rdata.length;
				ni = t.p.rownumbers===true ? 1 :0;
				gi = t.p.multiselect ===true ? 1 :0;
				si = t.p.subGrid===true ? 1 :0;
				if(!aradd) {
					if(rowid !== undefined) { rowid = String(rowid);}
					else {
						rowid = $.jgrid.randId();
						if(t.p.keyName !== false) {
							cnm = t.p.keyName;
							if(rdata[0][cnm] !== undefined) { rowid = rdata[0][cnm]; }
						}
					}
				}
				cn = t.p.altclass;
				var k = 0, cna ="", lcdata = {},
				air = $.isFunction(t.p.afterInsertRow) ? true : false;
				
				while(k < datalen) {
					data = rdata[k];
					row=[];
					if(aradd) {
						try {
							rowid = data[cnm];
							if(rowid===undefined) {
								rowid = $.jgrid.randId();
							}
						}
						catch (e) {rowid = $.jgrid.randId();}
						cna = t.p.altRows === true ?  (t.rows.length-1)%2 === 0 ? cn : "" : "";
					}
					id = rowid;
					rowid  = t.p.idPrefix + rowid;
					if(ni){
						prp = t.formatCol(0,1,'',null,rowid, true);
						row[row.length] = "<td role=\"gridcell\" class=\"ui-state-default jqgrid-rownum\" "+prp+">0</td>";
					}
					if(gi) {
						v = "<input role=\"checkbox\" type=\"checkbox\""+" id=\"jqg_"+t.p.id+"_"+rowid+"\" class=\"cbox\"/>";
						prp = t.formatCol(ni,1,'', null, rowid, true);
						row[row.length] = "<td role=\"gridcell\" "+prp+">"+v+"</td>";
					}
					if(si) {
						row[row.length] = $(t).jqGrid("addSubGridCell",gi+ni,1);
					}
					for(i = gi+si+ni; i < t.p.colModel.length;i++){
						cm = t.p.colModel[i];
						nm = cm.name;
						lcdata[nm] = data[nm];
						v = t.formatter( rowid, $.jgrid.getAccessor(data,nm), i, data );
						prp = t.formatCol(i,1,v, data, rowid, lcdata);
						row[row.length] = "<td role=\"gridcell\" "+prp+">"+v+"</td>";
					}
					row.unshift( t.constructTr(rowid, false, cna, lcdata, data, false ) );
					row[row.length] = "</tr>";
					
					if(t.rows.length === 0){
						$("table:first",t.grid.bDiv).append(row.join(''));
					} else {
						switch (pos) {
							case 'last':
								$(t.rows[t.rows.length-1]).after(row.join(''));
								sind = t.rows.length-1;
								break;
							case 'first':
								$(t.rows[0]).after(row.join(''));
								sind = 1;
								break;
							case 'after':
								sind = $(t).jqGrid('getGridRowById', src);
								if (sind) {
									if($(t.rows[sind.rowIndex+1]).hasClass("ui-subgrid")) { $(t.rows[sind.rowIndex+1]).after(row); }
									else { $(sind).after(row.join('')); }
									sind=sind.rowIndex + 1;
								}	
								break;
							case 'before':
								sind = $(t).jqGrid('getGridRowById', src);
								if(sind) {
									$(sind).before(row.join(''));
									sind=sind.rowIndex - 1;
								}
								break;
						}
					}
					
					if(t.p.subGrid===true) {
						$(t).jqGrid("addSubGrid",gi+ni, sind);
					}
					t.p.records++;
					t.p.reccount++;
					$(t).triggerHandler("jqGridAfterInsertRow", [rowid,data,data]);
					if(air) { t.p.afterInsertRow.call(t,rowid,data,data); }
					k++;
					if(t.p.datatype === 'local') {
						lcdata[t.p.localReader.id] = id;
						t.p._index[id] = t.p.data.length;
						t.p.data.push(lcdata);
						lcdata = {};
					}
				}
				
				if( t.p.altRows === true && !aradd) {
					if (pos === "last") {
						if ((t.rows.length-1)%2 === 1)  {$(t.rows[t.rows.length-1]).addClass(cn);}
					} else {
						$(t.rows).each(function(i){
							if(i % 2 ===1) { $(this).addClass(cn); }
							else { $(this).removeClass(cn); }
						});
					}
				}
				success = true;
			});
		}
		return success;
	},
	
	//修改行数据
	setRowDataAction:function(rowid, data, cssp){
		if(typeof(rowid) == "undefined" || rowid == null && rowid == "") {
    		return false;
    	}
    	var args = $.makeArray(arguments).slice(1), o = {}, $t = this[0];
    	 //处理已经存在的行是新添加的
 	    var datas = $($t).jqGrid("getGridParam", "dataMap");
 	   //处理已经存在的行是新添加的
 	    if(datas.get(rowid) != null) {	    	
 	    	var dataObj = datas.get(rowid);
 	    	if(dataObj.operAction != null && dataObj.operAction == "add") {
 	    		dataObj.operAction = "add";
     	    }
 	    	$($t).jqGrid("getGridParam", "dataMap").put(rowid, dataObj);
 	    	return $($t).jqGrid("setRowData", rowid, data);
 	    }else {
 	    	if($($t).jqGrid("setRowData", rowid, data)){
 	    		var mydata = new Object();
 	 		    mydata.id = rowid;
 	 		    mydata.operAction = "update";
 	 		    mydata.status = "2";
 	 		    $($t).jqGrid("getGridParam", "dataMap").put(rowid, mydata);	   
 	 		    lastsel[$t.id] = rowid;
 	 		    return true;
 	    	} 	    	
 	    }  
 	    return false;
	},
    
    //direction 为last或者first
    addRowActionByDirection:function(direction) {
    	var args = $.makeArray(arguments).slice(1), o = {}, $t = this[0];
    	var lastId = lastsel[$t.id];
    	if(lastId != "") {
			//判断是否需要全部展开，需要就不用保存
			var expandAll = $($t).jqGrid('getGridParam', 'expandAll');
			if(!expandAll){
				$($t).jqGrid('saveRowNew', lastId, false); 
			}
		}
    	if (!$t.grid ) { return success; }
    	var colModel = $($t).jqGrid().getGridParam("colModel") ;  
    	
	    var cellLenth = colModel.length ; 
	    var newRow = JSON.stringify(colModel);  
	    var ids = $($t).jqGrid('getDataIDs');  
	    //如果jqgrid中没有数据 定义行号为1 ，否则取当前最大行号+1  
	    var rowid = (ids.length ==0 ? 1: Math.max.apply(Math,ids)+1);  
	    //获得新添加行的行号（为什么是负数呢,与编辑行差别对待）  
	    var newrowid = getRandomHexCode();
	    //alert(newrowid);
	    //设置grid单元格不可编辑 （防止在添加时，用户修改其他非添加行的数据）  
	   // $($t).setGridParam({cellEdit:true});  
	    //将新行追加到表格头部  
	    $($t).jqGrid("addRowData", newrowid,newRow , direction , {keys: true});  
	    //设置grid单元格可编辑（防止追加行后，可编辑列无法编辑）  
	    $($t).jqGrid('editRow', newrowid, {keys: true}); 
	    //定义对象
	    var mydata = new Object();
	    mydata.id = newrowid;
	    mydata.operAction = "add";
	    mydata.status = "0";
	    $($t).jqGrid("getGridParam", "dataMap").put(newrowid, mydata);	   
	    lastsel[$t.id] = newrowid;
	    return newrowid;
    },
    
    
    addRowActionByDirection:function(direction,ifKey) {
    	var args = $.makeArray(arguments).slice(1), o = {}, $t = this[0];
    	var lastId = lastsel[$t.id];
    	if(lastId != "") {
			//判断是否需要全部展开，需要就不用保存
			var expandAll = $($t).jqGrid('getGridParam', 'expandAll');
			if(!expandAll){
				$($t).jqGrid('saveRowNew', lastId, false); 
			}
		}
    	if (!$t.grid ) { return success; }
    	var colModel = $($t).jqGrid().getGridParam("colModel") ;  
    	
	    var cellLenth = colModel.length ; 
	    var newRow = JSON.stringify(colModel);  
	    var ids = $($t).jqGrid('getDataIDs');  
	    //如果jqgrid中没有数据 定义行号为1 ，否则取当前最大行号+1  
	    var rowid = (ids.length ==0 ? 1: Math.max.apply(Math,ids)+1);  
	    //获得新添加行的行号（为什么是负数呢,与编辑行差别对待）  
	    var newrowid = getRandomHexCode();
	    //alert(newrowid);
	    //设置grid单元格不可编辑 （防止在添加时，用户修改其他非添加行的数据）  
	   // $($t).setGridParam({cellEdit:true});  
	    //将新行追加到表格头部  
	    $($t).jqGrid("addRowData", newrowid,newRow , direction , {keys: ifKey});  
	    //设置grid单元格可编辑（防止追加行后，可编辑列无法编辑）  
	    $($t).jqGrid('editRow', newrowid, {keys: ifKey}); 
	    //定义对象
	    var mydata = new Object();
	    mydata.id = newrowid;
	    mydata.operAction = "add";
	    mydata.status = "0";
	    $($t).jqGrid("getGridParam", "dataMap").put(newrowid, mydata);	   
	    lastsel[$t.id] = newrowid;
	    return newrowid;
    },
    
    saveRowAction:function(id) {
    	var args = $.makeArray(arguments).slice(1), o = {}, $t = this[0];
    	if (!$t.grid ) { return success; }
    	var data = $($t).jqGrid("getGridParam", "dataMap");
    	var mydata = null;
    	var expandAll = $($t).jqGrid('getGridParam', 'expandAll');
    	if(expandAll) {
//    		 $($t).jqGrid('editRow', id, {keys: false});
//    		 var formName = $($t).jqGrid("getGridParam", "formName")
// 			if(typeof(formName) != "undefined" && formName != null && formName != "") {
// 				if(!$("#" + formName).valid()) {
// 					$($t).find(".error").focus();
// 					return false;
// 				}				
// 			}
    	}
    	if(data.get(id) != null) {
    		mydata = data.get(id);
    		$($t).jqGrid("getGridParam", "dataMap").put(id, mydata);
    		//$($t).jqGrid('saveRowNew', id, false); 
    		return true;
    	}else {
    		alert("获取行标识错误！");
    		return false;
    	}
    },
    
    //待修改
    setGridWidthAction : function(nwidth, shrink) {
		return this.each(function(){
			if (!this.grid ) {return;}
			var $t = this, cw,
			initwidth = 0, brd=$.jgrid.cell_width ? 0: $t.p.cellLayout, lvc, vc=0, hs=false, scw=$t.p.scrollOffset, aw, gw=0, cr;
			if(typeof shrink !== 'boolean') {
				shrink=$t.p.shrinkToFit;
			}
			
			
			
			if(isNaN(nwidth)) {return;}
			nwidth = parseInt(nwidth,10); 
			$t.grid.width = $t.p.width = nwidth;
			
			
			$("#gbox_"+$.jgrid.jqID($t.p.id)).css("width",nwidth+"%");			
			$("#gview_"+$.jgrid.jqID($t.p.id)).css("width",nwidth+"%");
			
			
			$($t.grid.bDiv).css("width",nwidth+"%");
			$($t.grid.hDiv).css("width",nwidth+"%");
			if($t.p.pager ) {$($t.p.pager).css("width",nwidth+"%");}
			if($t.p.toppager ) {$($t.p.toppager).css("width",nwidth+"%");}
			if($t.p.toolbar[0] === true){
				$($t.grid.uDiv).css("width",nwidth+"px");
				if($t.p.toolbar[1]==="both") {$($t.grid.ubDiv).css("width",nwidth+"%");}
			}
			if($t.p.footerrow) { $($t.grid.sDiv).css("width",nwidth+"%"); }
			if(shrink ===false && $t.p.forceFit === true) {$t.p.forceFit=false;}
			if(shrink===true) {
				
				$.each($t.p.colModel, function() {
					if(this.hidden===false){
						cw = this.widthOrg;
						initwidth += cw+brd;
						if(this.fixed) {
							gw += cw+brd;
						} else {
							vc++;
						}
					}
				});
				if(vc  === 0) { return; }
				$t.p.tblwidth = initwidth;
				aw = nwidth-brd*vc-gw;
				if(!isNaN($t.p.height)) {
					if($($t.grid.bDiv)[0].clientHeight < $($t.grid.bDiv)[0].scrollHeight || $t.rows.length === 1){
						hs = true;
						aw -= scw;
					}
				}
				initwidth =0;
				var cle = $t.grid.cols.length >0;
				$.each($t.p.colModel, function(i) {
					if(this.hidden === false && !this.fixed){
						cw = this.widthOrg;
						cw = Math.round(aw*cw/($t.p.tblwidth-brd*vc-gw));
						if (cw < 0) { return; }
						this.width =cw;
						initwidth += cw;
						$t.grid.headers[i].width=cw;
						$t.grid.headers[i].el.style.width=cw+"%";
						if($t.p.footerrow) { $t.grid.footers[i].style.width = cw+"%"; }
						if(cle) { $t.grid.cols[i].style.width = cw+"%"; }
						lvc = i;
					}
				});

				if (!lvc) { return; }

				cr =0;
				if (hs) {
					if(nwidth-gw-(initwidth+brd*vc) !== scw){
						cr = nwidth-gw-(initwidth+brd*vc)-scw;
					}
				} else if( Math.abs(nwidth-gw-(initwidth+brd*vc)) !== 1) {
					cr = nwidth-gw-(initwidth+brd*vc);
				}
				$t.p.colModel[lvc].width += cr;
				$t.p.tblwidth = initwidth+cr+brd*vc+gw;
				if($t.p.tblwidth > nwidth) {
					var delta = $t.p.tblwidth - parseInt(nwidth,10);
					$t.p.tblwidth = nwidth;
					cw = $t.p.colModel[lvc].width = $t.p.colModel[lvc].width-delta;
				} else {
					cw= $t.p.colModel[lvc].width;
				}
				$t.grid.headers[lvc].width = cw;
				$t.grid.headers[lvc].el.style.width=cw+"%";
				if(cle) { $t.grid.cols[lvc].style.width = cw+"%"; }
				if($t.p.footerrow) {
					$t.grid.footers[lvc].style.width = cw+"%";
				}
			}
			if($t.p.tblwidth) {
				$('table:first',$t.grid.bDiv).css("width",$t.p.tblwidth+"%");
				$('table:first',$t.grid.hDiv).css("width",$t.p.tblwidth+"%");
				$t.grid.hDiv.scrollLeft = $t.grid.bDiv.scrollLeft;
				if($t.p.footerrow) {
					$('table:first',$t.grid.sDiv).css("width",$t.p.tblwidth+"%");
				}
			}
		});
	},
    
	saveRowNew : function(rowid, successfunc, url, extraparam, aftersavefunc,errorfunc, afterrestorefunc) {
		
		// Compatible mode old versions
		var args = $.makeArray(arguments).slice(1), o = {}, $t = this[0];
        //alert(rowid);
		if( $.type(args[0]) === "object" ) {
			o = args[0];
		} else {
			if ($.isFunction(successfunc)) { o.successfunc = successfunc; }
			if (url !== undefined) { o.url = url; }
			if (extraparam !== undefined) { o.extraparam = extraparam; }
			if ($.isFunction(aftersavefunc)) { o.aftersavefunc = aftersavefunc; }
			if ($.isFunction(errorfunc)) { o.errorfunc = errorfunc; }
			if ($.isFunction(afterrestorefunc)) { o.afterrestorefunc = afterrestorefunc; }
		}
		o = $.extend(true, {
			successfunc: null,
			url: null,
			extraparam: {},
			aftersavefunc: null,
			errorfunc: null,
			afterrestorefunc: null,
			restoreAfterError: true,
			mtype: "POST",
			saveui : "enable",
			savetext : $.jgrid.getRegional($t,'defaults.savetext')
		}, $.jgrid.inlineEdit, o );
		// End compatible

		var success = false, nm, tmp={}, tmp2={}, tmp3= {}, editable, fr, cv, ind, nullIfEmpty=false;
		if (!$t.grid ) { return success; }
		ind = $($t).jqGrid("getInd",rowid,true);
		if(ind === false) {return success;}
		var errors = $.jgrid.getRegional(this, 'errors'),
		edit =$.jgrid.getRegional(this, 'edit'),
		bfsr = $.isFunction( o.beforeSaveRow ) ?	o.beforeSaveRow.call($t,o, rowid) :  undefined;
		if( bfsr === undefined ) {
			bfsr = true;
		}
		if(!bfsr) { return; }
		editable = $(ind).attr("editable");
		o.url = o.url || $t.p.editurl;
		if (editable==="1") {
			
			/**
			 * 添加校验判断jquery validate
			 * **/
			//console.log("Sample log");
			var formName = $($t).jqGrid("getGridParam", "formName")
			if(typeof(formName) != "undefined" && formName != null && formName != "") {
				var tpvld = $.data( $("#" + formName)[0], "validator" );
				if(!tpvld){
					tpvld = $("#" + formName).validate();
				}
				var tpign = tpvld.settings.ignore;
				tpvld.settings.ignore = ":not(#gview_"+$t.id+" input,#gview_"+$t.id+" select,#gview_"+$t.id+" textarea)";
				if(!$("#" + formName).valid()) {
					tpvld.settings.ignore = tpign;
					return false;
				}else{
					tpvld.settings.ignore = tpign;
				}
			}		
			//jquery validate end
			
			var cm;
			$('td[role="gridcell"]',ind).each(function(i) {
				cm = $t.p.colModel[i];
				nm = cm.name;
				if ( nm !== 'cb' && nm !== 'subgrid' && cm.editable===true && nm !== 'rn' && !$(this).hasClass('not-editable-cell')) {
					switch (cm.edittype) {
						case "checkbox":
							var cbv = ["Yes","No"];
							if(cm.editoptions ) {
								cbv = cm.editoptions.value.split(":");
							}
							tmp[nm]=  $("input",this).is(":checked") ? cbv[0] : cbv[1]; 
							break;
						case 'text':
						case 'password':
						case 'textarea':
						case "button" :
							tmp[nm]=$("input, textarea",this).val();
							break;
						case 'select':
							if(!cm.editoptions.multiple) {
								tmp[nm] = $("select option:selected",this).val();
								tmp2[nm] = $("select option:selected", this).text();
							} else {
								var sel = $("select",this), selectedText = [];
								tmp[nm] = $(sel).val();
								if(tmp[nm]) { tmp[nm]= tmp[nm].join(","); } else { tmp[nm] =""; }
								$("select option:selected",this).each(
									function(i,selected){
										selectedText[i] = $(selected).text();
									}
								);
								tmp2[nm] = selectedText.join(",");
							}
							if(cm.formatter && cm.formatter === 'select') { tmp2={}; }
							break;
						case 'custom' :
							try {
								if(cm.editoptions && $.isFunction(cm.editoptions.custom_value)) {
									tmp[nm] = cm.editoptions.custom_value.call($t, $(".customelement",this),'get');
									if (tmp[nm] === undefined) { throw "e2"; }
								} else { throw "e1"; }
							} catch (e) {
								if (e==="e1") { $.jgrid.info_dialog(errors.errcap,"function 'custom_value' "+edit.msg.nodefined,edit.bClose); }
								if (e==="e2") { $.jgrid.info_dialog(errors.errcap,"function 'custom_value' "+edit.msg.novalue,edit.bClose); }
								else { $.jgrid.info_dialog(errors.errcap,e.message,edit.bClose); }
							}
							break;
					}
					cv = $.jgrid.checkValues.call($t,tmp[nm],i);
					if(cv[0] === false) {
						return false;
					}
					if($t.p.autoencode) { tmp[nm] = $.jgrid.htmlEncode(tmp[nm]); }
					if(o.url !== 'clientArray' && cm.editoptions && cm.editoptions.NullIfEmpty === true) {
						if(tmp[nm] === "") {
							tmp3[nm] = 'null';
							nullIfEmpty = true;
						}
					}
				}
			});
			if (cv[0] === false){
				try {
					var tr = $($t).jqGrid('getGridRowById', rowid), positions = $.jgrid.findPos(tr);
					$.jgrid.info_dialog(errors.errcap,cv[1],edit.bClose,{left:positions[0],top:positions[1]+$(tr).outerHeight()});
				} catch (e) {
					alert(cv[1]);
				}
				return success;
			}
			var idname, opers = $t.p.prmNames, oldRowId = rowid;
			if ($t.p.keyName === false) {
				idname = opers.id;
			} else {
				idname = $t.p.keyName;
			}
			if(tmp) {
				tmp[opers.oper] = opers.editoper;
				if (tmp[idname] === undefined || tmp[idname]==="") {
					tmp[idname] = rowid;
				} else if (ind.id !== $t.p.idPrefix + tmp[idname]) {
					// rename rowid
					var oldid = $.jgrid.stripPref($t.p.idPrefix, rowid);
					if ($t.p._index[oldid] !== undefined) {
						$t.p._index[tmp[idname]] = $t.p._index[oldid];
						delete $t.p._index[oldid];
					}
					rowid = $t.p.idPrefix + tmp[idname];
					$(ind).attr("id", rowid);
					if ($t.p.selrow === oldRowId) {
						$t.p.selrow = rowid;
					}
					if ($.isArray($t.p.selarrrow)) {
						var i = $.inArray(oldRowId, $t.p.selarrrow);
						if (i>=0) {
							$t.p.selarrrow[i] = rowid;
						}
					}
					if ($t.p.multiselect) {
						var newCboxId = "jqg_" + $t.p.id + "_" + rowid;
						$("input.cbox",ind)
							.attr("id", newCboxId)
							.attr("name", newCboxId);
					}
					// TODO: to test the case of frozen columns
				}
				if($t.p.inlineData === undefined) { $t.p.inlineData ={}; }
				tmp = $.extend({},tmp,$t.p.inlineData,o.extraparam);
			}
			if (o.url === 'clientArray') {
				tmp = $.extend({},tmp, tmp2);
				if($t.p.autoencode) {
					$.each(tmp,function(n,v){
						tmp[n] = $.jgrid.htmlDecode(v);
					});
				}
				var k, resp = $($t).jqGrid("setRowData",rowid,tmp);
				//add by zrzdemon$(ind).attr("editable","0");
				$(ind).attr("editable","0");
				for(k=0;k<$t.p.savedRow.length;k++) {
					if( String($t.p.savedRow[k].id) === String(oldRowId)) {fr = k; break;}
				}
				if(fr >= 0) { $t.p.savedRow.splice(fr,1); }
				$($t).triggerHandler("jqGridInlineAfterSaveRow", [rowid, resp, tmp, o]);
				if( $.isFunction(o.aftersavefunc) ) { o.aftersavefunc.call($t, rowid, resp, tmp, o); }
				success = true;
				$(ind).removeClass("jqgrid-new-row").unbind("keydown");
			} else {
				//$($t).jqGrid("progressBar", {method:"show", loadtype : o.saveui, htmlcontent: o.savetext });
				tmp3 = $.extend({},tmp,tmp3);
				tmp3[idname] = $.jgrid.stripPref($t.p.idPrefix, tmp3[idname]);
//				$.ajax($.extend({
//					url:o.url,
//					data: $.isFunction($t.p.serializeRowData) ? $t.p.serializeRowData.call($t, tmp3) : tmp3,
//					type: o.mtype,
//					async : false, //?!?
//					complete: function(res,stat){
						//$($t).jqGrid("progressBar", {method:"hide", loadtype : o.saveui, htmlcontent: o.savetext});
				var stat = "success";	
				var res = null;
				if (stat === "success"){
							var ret = true, sucret, k;
							sucret = $($t).triggerHandler("jqGridInlineSuccessSaveRow", [res, rowid, o]);
							if (!$.isArray(sucret)) {sucret = [true, tmp3];}
							if (sucret[0] && $.isFunction(o.successfunc)) {sucret = o.successfunc.call($t, res);}							
							if($.isArray(sucret)) {
								// expect array - status, data, rowid
								ret = sucret[0];
								tmp = sucret[1] || tmp;
							} else {
								ret = sucret;
							}
							if (ret===true) {
								if($t.p.autoencode) {
									$.each(tmp,function(n,v){
										tmp[n] = $.jgrid.htmlDecode(v);
									});
								}
								if(nullIfEmpty) {
									$.each(tmp,function( n ){
										if(tmp[n] === 'null' ) {
											tmp[n] = '';
										}
									});
								}
								tmp = $.extend({},tmp, tmp2);
								$($t).jqGrid("setRowData",rowid,tmp);
								//add by zrzdemon$(ind).attr("editable","0");
								$(ind).attr("editable","0");
								for(k=0;k<$t.p.savedRow.length;k++) {
									if( String($t.p.savedRow[k].id) === String(rowid)) {fr = k; break;}
								}
								if(fr >= 0) { $t.p.savedRow.splice(fr,1); }
								$($t).triggerHandler("jqGridInlineAfterSaveRow", [rowid, res, tmp, o]);
								if( $.isFunction(o.aftersavefunc) ) { o.aftersavefunc.call($t, rowid, res, tmp, o); }
								success = true;
								$(ind).removeClass("jqgrid-new-row").unbind("keydown");
							} else {
								$($t).triggerHandler("jqGridInlineErrorSaveRow", [rowid, res, stat, null, o]);
								if($.isFunction(o.errorfunc) ) {
									o.errorfunc.call($t, rowid, res, stat, null);
								}
								if(o.restoreAfterError === true) {
									$($t).jqGrid("restoreRow",rowid, o.afterrestorefunc);
								}
							}
							//
							//alert($(ind).attr("editable"));
							$($t).jqGrid("saveRowAction",rowid);
						}
				
				    
				    
//					},
//					error:function(res,stat,err){
//						$("#lui_"+$.jgrid.jqID($t.p.id)).hide();
//						$($t).triggerHandler("jqGridInlineErrorSaveRow", [rowid, res, stat, err, o]);
//						if($.isFunction(o.errorfunc) ) {
//							o.errorfunc.call($t, rowid, res, stat, err);
//						} else {
//							var rT = res.responseText || res.statusText;
//							try {
//								$.jgrid.info_dialog(errors.errcap,'<div class="ui-state-error">'+ rT +'</div>', edit.bClose, {buttonalign:'right'});
//							} catch(e) {
//								alert(rT);
//							}
//						}
//						if(o.restoreAfterError === true) {
//							$($t).jqGrid("restoreRow",rowid, o.afterrestorefunc);
//						}
//					}
//				}, $.jgrid.ajaxOptions, $t.p.ajaxRowOptions || {}));
			}
		}
		return success;
	},
	
	//按钮权限渲染 add by cm
	privilegeRender : function(jsonObject) {
    	var args = $.makeArray(arguments).slice(1), o = {}, $t = this[0]; 
    	var ids = $($t).jqGrid('getDataIDs');
		for(var i=0;i<ids.length;i++){
			jQuery.each(jsonObject.result,function(k,v){
				if(v == "false"){
					var j = i + 1;
					jQuery("#"+$t.id+" tr:eq("+j+") td #"+k).css("display","none");
					return ;
				}
			});	
		}
    },
    
    //获取当前页面
    getCurrentPage : function() {
    	var args = $.makeArray(arguments).slice(1), o = {}, $t = this[0]; 
    	var page = $($t).jqGrid('getGridParam', 'page');
    	return page;
    },
    getGridRowStatus:function(rowId) {
    	var args = $.makeArray(arguments).slice(1), o = {}, $t = this[0],ret; 
    	var resultMap = $($t).jqGrid("getGridParam", "dataMap");
    	var returnResult = "none";
    	$.each(resultMap.getEntrys(), function(j, n) {
    		var tempObj = n.value;
    		if(rowId + "" == tempObj.id + "") {
    			if(tempObj.operAction == "update" && tempObj.status == "2") {
    				returnResult = tempObj.operAction
    				return;
    			}else if(tempObj.operAction == "add" || tempObj.operAction == "delete") {
    				returnResult = tempObj.operAction
    				return;
    			}
    		}
    	});
    	return returnResult;
    }
	
});
})(jQuery);