/*
 * 银行间转账统计页面
 */
export const banktransferstat = function() {
	return {
		init : function() {
			// 初始化
			banktransferstat.gridInit();
			// 查询
			jQuery("#queryBtn").on("click",banktransferstat.doQuery);
			// 重置
			jQuery("#resetBtn").on("click",banktransferstat.doReset);
		},
		/*
		 * 生成表格组件
		 */
		gridInit : function() {
			
			jQuery("#dataList").jqGrid(
					{
						// 绝大部分情况下JS中单引号与双引号并无区别
						// 以下部分的值采用单引号和双引号无区别
						url : WEB_CTX_PATH
								+ "/bankTransferStatAction.do?method=doInit",
						regional : 'cn',
						datatype : "json",
						colNames : [ 'id','单据号','单据日期','转出公司','转入公司','金额','经办人','状态'],
						operatorKey : "act",
						shrinkToFit : true,
						colModel : [
							{
								name : 'billUid',
								index : 'billUid',
								hidden : true,
								key : true
							},
							{
								name : 'billNo',
								index : 'billNo'
							},
							{
								name : 'billDate',
								index : 'billDate',
								formatter:"date",
								formatoptions:{srcformat: 'Y-m-d H:i:s', newformat: 'Y-m-d'},
								align: 'center'
							},
							{
								name : 'outUpOrgId',
								index : 'outUpOrgId'
							},
							{
								name : 'inUpOrgId',
								index : 'inUpOrgId'
							},
							{
								name : 'amount',
								index : 'amount',
								formatter:"number",
								formatoptions:{decimalSeparator:".", thousandsSeparator: ",", decimalPlaces: 2, defaultValue: '0.00'},
								align: 'right'
							},						
							{
								name : 'applicantUid',
								index : 'applicantUid'
							},
							{
								name : 'state',
								index : 'state',
								align: 'center'
							},],
						rowNum : 10, // 每页最大显示行数
						autowidth : true, // grid的宽度会根据父元素的宽度自动重新计算
						height : "100%",
						multiselect : true, // 多选（表格会多出一列选择框）
						rownumbers : true, // 显示行号
						rowList : [10,20,30],// 其他可选每页最大显示行数
						pager : '#listPager',
						mtype : "post",
						viewrecords : false,
						sortname : 'createDate', // 默认的排序索引,可根据需求添加该项
						sortorder : 'desc',
						gridComplete: function(){
				        	var ids = jQuery("#dataList").jqGrid('getDataIDs');
							var userData=jQuery("#dataList").jqGrid('getGridParam', 'userData');
							for(var i=0;i<ids.length;i++){
							var appStatus = jQuery("#dataList").jqGrid('getCell',ids[i],'state');
							/*alert(appStatus);*/
							var id = jQuery("#dataList").jqGrid('getCell',ids[i],'billNo');
							
							if(appStatus == ""){
								var btn ="<span>待审批</span>"; 
								jQuery("#dataList").jqGrid('setRowData',ids[i],{state:btn});
							}else if(appStatus=="待审批"){
								var btn ="<span>待审批</span>"; 
								jQuery("#dataList").jqGrid('setRowData',ids[i],{state:btn});
							}else{
							var btn = 
						          "<a id='view' href='javascript:void(0);'  onclick=\"doAppStatusFlow('银行间转款单','"+id+"','FEE03001');\">"
					      	      + appStatus + "</a>"; 
								jQuery("#dataList").jqGrid('setRowData',ids[i],{state:btn});
							}
							}
						},
						
						emptyMsg : "查询结果为空", // 如果设置了该选项，在表格为空数据时撑开表格并显示设置的信息
						caption : "银行间转账列表"
					});
			//分页处理
		    jQuery("#dataList").jqGrid('navGrid', '#listPager', {
		    	add: false, del: false, edit: false, search:false, refresh:false
		    });
			/*
			 * 表格大小调整
			 */
			jQuery(window).on(
					'resize.jqGrid',
					function() {
						jQuery("#dataList").jqGrid('setGridWidth',
								jQuery(".col-xs-12").width());
					});
			jQuery(window).triggerHandler('resize.jqGrid');
		},
		/*
		 * 清空input框内容
		 */
		doReset : function(){
			jQuery("input,select,textarea",jQuery("#dataList")).each(function(){
				if(this.type!="button"){
					this.value="";
				}
			});
			$("#outUpOrgId").val("");
			$("#inUpOrgId").val("");
			$("#state").val(null).select2();
			$(".select2-selection__placeholder").text("-请选择-");
		},
		
		//详细画面
		queryDetail:function(){
			//码表id
			var paramIdArr = "";
			//页头
			var titleStr = "";
			//url
			var url = "";
			//判断id是否为空
				titleStr = "银行间转款单详细";
				paramIdArr = $("#dataList").jqGrid('getGridParam','selarrrow');
				if(paramIdArr && paramIdArr.length > 1){
					//选中多条
					sweetAlert({
						title: "提示",
						text:"只能选择一条数据进行查看",
						type: 'error',
						showConfirmButton: true,
						confirmButtonText:"确认",
					});
					return;
				}else if(paramIdArr.length == 0){
					//未选中数据
					sweetAlert({
						title: "提示",
						text:"请选择一条数据进行查看",
						type: 'error',
						showConfirmButton: true,
						confirmButtonText:"确认",
					});
					return;
				}
//				url = WEB_CTX_PATH+"/bankTransferStatAction.do?method=queryDetail&billUid="+paramIdArr[0]+"&actionType="+"detail";
				url = WEB_CTX_PATH+"/bankTransferAction.do?method=doAddOrEdit&actionType=detail&billUid="+paramIdArr[0];
			
//			jQuery().openDlg({
////				parent: window.top,//此行调遮罩
//				height: 680,//此行调高度
//				width: 1000,
//				url:url,
//				title: titleStr
//			});
		         layer.open({
		             type : 2,
		             title : titleStr,
		             content: url,
		             fix : true,
		             area  :  ['100%', '100%'],
//		           /*注释部分功能：弹窗后立即最大化*/
		             success: function(layerObj){
		                 var currLayer = jQuery(layerObj);
		                 currLayer.css({top:"0px",left:"0px",width:"100%",height:jQuery(window).height()})
		                   .find("iframe").css("height",jQuery(window).height()-50);
		             }
		          })
		},
		
		//打印画面
		doPrint:function(){
			//码表id
			var paramIdArr = "";
			//页头
			var titleStr = "";
			//url
			var url = "";
			//判断id是否为空
				titleStr = "银行间转款单打印";
				paramIdArr = $("#dataList").jqGrid('getGridParam','selarrrow');
				if(paramIdArr && paramIdArr.length > 1){
					//选中多条
					sweetAlert({
						title: "提示",
						text:"只能选择一条数据进行打印",
						type: 'error',
						showConfirmButton: true,
						confirmButtonText:"确认",
					});
					return;
				}else if(paramIdArr.length == 0){
					//未选中数据
					sweetAlert({
						title: "提示",
						text:"请选择一条数据进行打印",
						type: 'error',
						showConfirmButton: true,
						confirmButtonText:"确认",
					});
					return;
				}
				var appStatus = $("#dataList").jqGrid('getRowData', paramIdArr).state;
				// 字符串中没有审批通过则给出提示
				if (appStatus.indexOf("审批通过") == -1) {
					sweetAlert({
						title: "提示",
						text:"只有审批通过的数据才可打印。",
						type: 'error',
						showConfirmButton: true,
						confirmButtonText:"确认",
					});
					return;
				}
				url = WEB_CTX_PATH+"/bankTransferAction.do?method=print&billUid="+paramIdArr[0]+"&actionType="+"print";
//			jQuery().openDlg({
////				parent: window.top,//此行调遮罩
//				height: 600,//此行调高度
//				width: 1000,
//				url:url,
//				title: titleStr
//			});
		         layer.open({
		             type : 2,
		             title : titleStr,
		             content: url,
		             fix : true,
		             area  :  ['100%', '100%'],
//		           /*注释部分功能：弹窗后立即最大化*/
		             success: function(layerObj){
		                 var currLayer = jQuery(layerObj);
		                 currLayer.css({top:"0px",left:"0px",width:"100%",height:jQuery(window).height()})
		                   .find("iframe").css("height",jQuery(window).height()-50);
		             }
		          })
		},
		/*
		 * 按钮关闭
		 */
		doClose : function() {
			jQuery().closeDlg(parent.layer);
		},
		//查询
		doQuery : function(){
			// 转出公司
			var outUpOrgId = jQuery("#outUpOrgId").val();
			// 转入公司
			var inUpOrgId = jQuery("#inUpOrgId").val();
			// 单据号
			var billNo = jQuery("#billNo").val();
			// 单据日期【起】
			var startTime = jQuery("#startTime").val();
			// 单据日期【止】
			var endTime = jQuery("#endTime").val();
			// 状态
			var state = jQuery("#state").val();
			
			//重新加载数据
			jQuery("#dataList").jqGrid('setGridParam', {
				url :WEB_CTX_PATH+"/bankTransferStatAction.do?method=doInit",
				page : 1,
				postData : {"outUpOrgId":outUpOrgId,"inUpOrgId":inUpOrgId,"billNo":billNo,"startTime":startTime,"endTime":endTime,"state":state}
			}).trigger("reloadGrid");
		},
		//input框去空格
		cky:function(obj)
	    {
	        var t = obj.value.replace(/\s+/g,'');
	        if(obj.value!=t)
	            obj.value=t;
	    }
	}
}();


	var api = parent.layer.getUserData();
	var actionType;

	banktransferstat.companytree = function() {
		var zTree;
		return {
			init : function() {
				//同步加载模式
				jQuery.ajax({
					async: true,
					type: "POST",
					url: WEB_CTX_PATH+"/paymentAction.do?method=getCompany",
					contentType: "application/x-www-form-urlencoded",
					data: {userId: api.userId},
					dataType:'json',
					beforeSend: function(xhr) {xhr.setRequestHeader("__REQUEST_TYPE", "AJAX_REQUEST");},
					success: banktransferstat.companytree.createTreeAll
				});	
			},
			bindEvent : function() {
			},createTreeAll : function(returnData){
				allNodes = returnData||[];
				var setting = {
						async : {
							enable : false
						},
						check: {
							enable: false,
							autoCheckTrigger: false,
							chkboxType: { "Y": "", "N": "" }
						},
						data : {
							simpleData : {
								enable : true,
								idKey : "id",
								pIdKey : "pId",
								rootPId : "****"
							}
						},
						view : {
							expandSpeed : "fast",
							selectedMulti : false,
							showLine: true,
							dblClickExpand: false
						},
						callback : {
							onClick : banktransferstat.companytree.onClickOrg,
							onAsyncSuccess : banktransferstat.companytree.checkTree
						}
				};
				
				jQuery.fn.zTree.init(jQuery("#companyTree"), setting, allNodes);
				zTree = jQuery.fn.zTree.getZTreeObj("companyTree");
			},
			createTree : function() {
				var setting = {
					async : {
						enable : false,
						autoParam : [ "id", "name", "type" ],
						dataType : "text",
						type : "post",
						url : WEB_CTX_PATH
								+ "/paymentAction.do?method=getCompany"
					},
					data : {
						simpleData : {
							enable : true,
							idKey : "id",
							pIdKey : "pId",
							rootPId : "****"
						}
					},
					view : {
						expandSpeed : "fast",
						selectedMulti : false,
						showLine : true,
						dblClickExpand : false
					},
					callback : {
						onClick : banktransferstat.companytree.onClickOrg,
						onAsyncSuccess : banktransferstat.companytree.checkTree
					}
				};
				jQuery.fn.zTree.init(jQuery("#companyTree"), setting, null);
				zTree = jQuery.fn.zTree.getZTreeObj("companyTree");
			},
			onClickOrg : function(e, treeId, treeNode) {
				var node = zTree.getSelectedNodes()[0];
				var v = "";
				if (node.type == 'position') {
					var orgNode = node.getParentNode();
					while (true) {
						if (orgNode.type == 'position')
							orgNode = orgNode.getParentNode();
						else
							break;
					}
					v = orgNode.name + "," + node.name;
					jQuery("#outUpOrgId").val(orgNode.id);
				}
				if (node.type == 'org') {
					v = node.name;
					jQuery("#outUpOrgId").val(node.id);
				}
				jQuery("#companyName").val(v);
				banktransferstat.companytree.hideMenu();
				//变换角色类型
				banktransferstat.companytree.changeRole();
				//初始化城市
				jQuery("#city").val("");
				jQuery("#orgName").val("");
			},
			showOrgTree : function() {
				var orgName = jQuery("#companyName");
				var orgOffset = jQuery("#companyName").offset();
				jQuery("#companyContent").css({
					left : orgOffset.left-17 + "px",
					top : orgOffset.top-20 + orgName.outerHeight() + "px"
				}).slideDown("fast");

				jQuery("body").bind("mousedown",
						banktransferstat.companytree.onBodyDown);
			},
			hideMenu : function() {
				jQuery("#companyContent").fadeOut("fast");
				jQuery("body").unbind("mousedown",
						banktransferstat.companytree.onBodyDown);
			},
			onBodyDown : function(event) {
				if (!(event.target.id == "menuBtn"
						|| event.target.id == "orgTreeBtn" || jQuery(event.target)
						.parents("#companyContent").length > 0)) {
					banktransferstat.companytree.hideMenu();
				}
			},
			initSuccess : function(returnData) {
				jQuery("#userForm").initForm({
					data : returnData.result
				});
			},
			doSuccess : function(data) {
				if (data.resultType != 1) {
					alert(data.resultMsg ? "保存失败:" + data.resultMsg : "保存失败");
					return false;
				}
				alert("保存成功");
				parent.auth.UserList.doQuery();
				banktransferstat.companytree.doClose();
			},
			checkTree : function() {
				//回显组织名称
				var node=zTree.getNodeByParam("id",outUpOrgId);
				if(node!=undefined && node!=null){
					zTree.selectNode(node);
					$("#companyName").val(node.name);
					//变换角色类型
					banktransferstat.companytree.changeRole();
				}
			},
			initRole : function(){//调用下拉列表  bankName'upOrgId'为select组件id、'bankName'(初始化)
				ajaxFormRequest(
					WEB_CTX_PATH
							+ "/hrInfoAction.do?method=getSelectOptions&element2CodeType="
							+ encodeURI(encodeURI("{'role':'"+$("#outUpOrgId").val()+"'}")),
					function(returnData) {
						if (initSelect2(returnData)) {
							// 操作类型
							var actionType = jQuery("#actionType").val();
							if (actionType == "edit") {
								$("#role").val(role).select2();
							}
						}
					}, function(state) {
					}, "standardForm", true, " ");
			},
			changeRole : function(){//调用下拉列表  bankName'upOrgId'为select组件id、'bankName'(改变角色)
				if($("#role").val()!=null){
					$("#role").empty().select2();
				}
				ajaxFormRequest(
					WEB_CTX_PATH
							+ "/hrInfoAction.do?method=getSelectOptions&element2CodeType="
							+ encodeURI(encodeURI("{'role':'"+$("#outUpOrgId").val()+"'}")),
					function(returnData) {
						if (initSelect2(returnData)) {
						}
					}, function(state) {
					}, "notifForm", true, " ");
			},
			doError : function() {
				alert("Error");
			},
			doClose : function() {
				
			}
		}
	}();
	
	banktransferstat.orgTree = function() {
		var zTree;
		return {
			init : function() {
				//同步加载模式
				jQuery.ajax({
					async: true,
					type: "POST",
					url: WEB_CTX_PATH+"/paymentAction.do?method=getCompany",
					contentType: "application/x-www-form-urlencoded",
					data: {userId: api.userId},
					dataType:'json',
					beforeSend: function(xhr) {xhr.setRequestHeader("__REQUEST_TYPE", "AJAX_REQUEST");},
					success: banktransferstat.orgTree.createTreeAll
				});	
			},
			bindEvent : function() {
			},createTreeAll : function(returnData){
				allNodes = returnData||[];
				var setting = {
						async : {
							enable : false
						},
						check: {
							enable: false,
							autoCheckTrigger: false,
							chkboxType: { "Y": "", "N": "" }
						},
						data : {
							simpleData : {
								enable : true,
								idKey : "id",
								pIdKey : "pId",
								rootPId : "****"
							}
						},
						view : {
							expandSpeed : "fast",
							selectedMulti : false,
							showLine: true,
							dblClickExpand: false
						},
						callback : {
							onClick : banktransferstat.orgTree.onClickOrg,
							onAsyncSuccess : banktransferstat.orgTree.checkTree
						}
				};
				
				jQuery.fn.zTree.init(jQuery("#orgTree"), setting, allNodes);
				zTree = jQuery.fn.zTree.getZTreeObj("orgTree");
			},
			createTree : function() {
				var setting = {
					async : {
						enable : false,
						autoParam : [ "id", "name", "type" ],
						dataType : "text",
						type : "post",
						url : WEB_CTX_PATH
								+ "/paymentAction.do?method=getCompany"
					},
					data : {
						simpleData : {
							enable : true,
							idKey : "id",
							pIdKey : "pId",
							rootPId : "****"
						}
					},
					view : {
						expandSpeed : "fast",
						selectedMulti : false,
						showLine : true,
						dblClickExpand : false
					},
					callback : {
						onClick : banktransferstat.orgTree.onClickOrg,
						onAsyncSuccess : banktransferstat.orgTree.checkTree
					}
				};
				jQuery.fn.zTree.init(jQuery("#orgTree"), setting, null);
				zTree = jQuery.fn.zTree.getZTreeObj("orgTree");
			},
			onClickOrg : function(e, treeId, treeNode) {
				var node = zTree.getSelectedNodes()[0];
				var v = "";
				if (node.type == 'position') {
					var orgNode = node.getParentNode();
					while (true) {
						if (orgNode.type == 'position')
							orgNode = orgNode.getParentNode();
						else
							break;
					}
					v = orgNode.name + "," + node.name;
					jQuery("#inUpOrgId").val(orgNode.id);
				}
				if (node.type == 'org') {
					v = node.name;
					jQuery("#inUpOrgId").val(node.id);
				}
				jQuery("#companyName2").val(v);
				banktransferstat.orgTree.hideMenu();
				//变换角色类型
				banktransferstat.orgTree.changeRole();
				//初始化城市
				jQuery("#city").val("");
				jQuery("#orgName").val("");
			},
			showOrgTree : function() {
				var orgName = jQuery("#companyName2");
				var orgOffset = jQuery("#companyName2").offset();
				jQuery("#treeContent").css({
					left : orgOffset.left-17 + "px",
					top : orgOffset.top-20 + orgName.outerHeight() + "px"
				}).slideDown("fast");

				jQuery("body").bind("mousedown",
						banktransferstat.orgTree.onBodyDown);
			},
			hideMenu : function() {
				jQuery("#treeContent").fadeOut("fast");
				jQuery("body").unbind("mousedown",
						banktransferstat.orgTree.onBodyDown);
			},
			onBodyDown : function(event) {
				if (!(event.target.id == "menuBtn"
						|| event.target.id == "orgTreeBtn" || jQuery(event.target)
						.parents("#treeContent").length > 0)) {
					banktransferstat.orgTree.hideMenu();
				}
			},
			initSuccess : function(returnData) {
				jQuery("#userForm").initForm({
					data : returnData.result
				});
			},
			doSuccess : function(data) {
				if (data.resultType != 1) {
					alert(data.resultMsg ? "保存失败:" + data.resultMsg : "保存失败");
					return false;
				}
				alert("保存成功");
				parent.auth.UserList.doQuery();
				banktransferstat.orgTree.doClose();
			},
			checkTree : function() {
				//回显组织名称
				var node=zTree.getNodeByParam("id",inUpOrgId);
				if(node!=undefined && node!=null){
					zTree.selectNode(node);
					$("#companyName2").val(node.name);
					//变换角色类型
					banktransferstat.orgTree.changeRole();
				}
			},
			initRole : function(){//调用下拉列表  bankName'upOrgId'为select组件id、'bankName'(初始化)
				ajaxFormRequest(
					WEB_CTX_PATH
							+ "/hrInfoAction.do?method=getSelectOptions&element2CodeType="
							+ encodeURI(encodeURI("{'role':'"+$("#inUpOrgId").val()+"'}")),
					function(returnData) {
						if (initSelect2(returnData)) {
							// 操作类型
							var actionType = jQuery("#actionType").val();
							if (actionType == "edit") {
								$("#role").val(role).select2();
							}
						}
					}, function(state) {
					}, "standardForm", true, " ");
			},
			changeRole : function(){//调用下拉列表  bankName'upOrgId'为select组件id、'bankName'(改变角色)
				if($("#role").val()!=null){
					$("#role").empty().select2();
				}
				ajaxFormRequest(
					WEB_CTX_PATH
							+ "/hrInfoAction.do?method=getSelectOptions&element2CodeType="
							+ encodeURI(encodeURI("{'role':'"+$("#inUpOrgId").val()+"'}")),
					function(returnData) {
						if (initSelect2(returnData)) {
						}
					}, function(state) {
					}, "notifForm", true, " ");
			},
			doError : function() {
				alert("Error");
			},
			doClose : function() {
				
			}
		}
	}();	
	