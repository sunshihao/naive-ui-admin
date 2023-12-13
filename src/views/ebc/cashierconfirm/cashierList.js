/*
 * 定义命名空间
 */
const WEB_CTX_PATH = "/app/fee"

export const cashierconfirm = function() {
	return {
		init : function() {
			cashierconfirm.gridInit();
			jQuery("#queryBtn").on("click",cashierconfirm.doQuery);
			jQuery("#resetBtn").on("click",cashierconfirm.resetQuery);
			jQuery("#printBtn").on("click",cashierconfirm.doPrint);
		},
		/*
		 * 生成表格组件
		 */
		gridInit : function() {
			jQuery("#dataList").jqGrid(
					{
						// 绝大部分情况下JS中单引号与双引号并无区别
						url : WEB_CTX_PATH
								+ "/cashierAction.do?method=doInit",
						regional : 'cn',
						datatype : "json",
						colNames : [ 'id','单据号','单据类型','单据日期',"价税合计","收款人/单位","申请人",'状态','类型', '流程状态'],
						operatorKey : "act",
						shrinkToFit : true,
						colModel : [
						{
							name : 'BILLUID',
							index : 'BILLUID',
							hidden : true,
							key : true
						},
						{
							name : 'BILLNO',
							index : 'BILLNO'
						},		
						{
							name : 'TYPE_NAME',
							index : 'TYPE_NAME'
							
						},
						{
							name : 'BILLDATE',
							index : 'BILLDATE',
							formatter:"date",
							formatoptions:{srcformat: 'Y-m-d H:i:s', newformat: 'Y-m-d'},
							align: 'center'
						},
						{
							name : 'AMOUNT',
							index : 'AMOUNT',
							formatter:"number",
							formatoptions:{decimalSeparator:".", thousandsSeparator: ",", decimalPlaces: 2, defaultValue: '0.00'},
							align: 'right'
						},
						
						{
							name : 'APPLICATUID',
							index : 'APPLICATUID',
							align: 'center'
						},
						{
							name : 'AGENTUID',
							index : 'AGENTUID',
							align: 'center'
						},
						
						{
							name : 'CONFIRMATIONSTATE',
							index : 'CONFIRMATIONSTATE',
							align: 'center'
						},
						{
							name : 'TYPE',
							index : 'TYPE',
							hidden : true
						},
						{
							name : 'appStatus',
							index : 'appStatus',
							align: 'center'
						}
						],
						
						rowNum : 10, // 每页最大显示行数
						autowidth : true, // grid的宽度会根据父元素的宽度自动重新计算
						multiselect : true, // 多选（表格会多出一列选择框）
						rownumbers : true, // 显示行号
						rowList : [10,50,100],// 其他可选每页最大显示行数
						pager : '#listPager',
						mtype : "post",
						viewrecords : false,
						sortname : 'CREATEDATE', // 默认的排序索引,可根据需求添加该项
						sortorder : 'desc',
//						height : "100%",
//						height : '500',
						height : $(document).height() - $("div.ilead-search").height() - 200,
//						scroll:true,
						gridComplete: function(){
				        	var ids = jQuery("#dataList").jqGrid('getDataIDs');
							var userData=jQuery("#dataList").jqGrid('getGridParam', 'userData');
							for(var i=0;i<ids.length;i++){
								var id = jQuery("#dataList").jqGrid('getCell',ids[i],'BILLNO');
								var type = jQuery("#dataList").jqGrid('getCell',ids[i],'TYPE');
								
								// 单据类型名
								if(type=="BX"){
									jQuery("#dataList").jqGrid('setRowData',ids[i],{TYPE_NAME:"个人普通报销"});
								}else if(type=="CL"){
									jQuery("#dataList").jqGrid('setRowData',ids[i],{TYPE_NAME:"个人差旅报销"});
								}else if(type=="ZJ"){
									jQuery("#dataList").jqGrid('setRowData',ids[i],{TYPE_NAME:"银行间转款"});
								}else if(type=="FX"){
									jQuery("#dataList").jqGrid('setRowData',ids[i],{TYPE_NAME:"支付业务"});
								}else if(type=="CX"){
									jQuery("#dataList").jqGrid('setRowData',ids[i],{TYPE_NAME:"车辆费用报销"});
								}else if(type=="LC"){
									jQuery("#dataList").jqGrid('setRowData',ids[i],{TYPE_NAME:"理财产品"});
								}else if(type=="XC"){
									jQuery("#dataList").jqGrid('setRowData',ids[i],{TYPE_NAME:"薪酬发放"});
								}
								
								// 流程状态
								if(type=="BX"){
									var btn = "<a id='view' href='javascript:void(0);'  onclick=\"doAppStatusFlow('个人普通报销','"+id+"','FEE01001');\">审批通过</a>"; 
									jQuery("#dataList").jqGrid('setRowData',ids[i],{appStatus:btn});
								}else if(type=="CL"){
									var btn = "<a id='view' href='javascript:void(0);'  onclick=\"doAppStatusFlow('个人差旅报销','"+id+"','FEE01002');\">审批通过</a>"; 
									jQuery("#dataList").jqGrid('setRowData',ids[i],{appStatus:btn});
								}else if(type=="ZJ"){
									var btn = "<a id='view' href='javascript:void(0);'  onclick=\"doAppStatusFlow('银行间转款','"+id+"','FEE03001');\">审批通过</a>"; 
									jQuery("#dataList").jqGrid('setRowData',ids[i],{appStatus:btn});
								}else if(type=="FX"){
									var btn = "<a id='view' href='javascript:void(0);'  onclick=\"doAppStatusFlow('付款报销','"+id+"','FEE02001');\">审批通过</a>"; 
									jQuery("#dataList").jqGrid('setRowData',ids[i],{appStatus:btn});
								}else if(type=="CX"){
									var btn = "<a id='view' href='javascript:void(0);'  onclick=\"doAppStatusFlow('车辆费用报销','"+id+"','FEE01003');\">审批通过</a>"; 
									jQuery("#dataList").jqGrid('setRowData',ids[i],{appStatus:btn});
								}else if(type=="LC"){
									var btn = "<a id='view' href='javascript:void(0);'  onclick=\"doAppStatusFlow('理财产品','"+id+"','FEE03002');\">审批通过</a>"; 
									jQuery("#dataList").jqGrid('setRowData',ids[i],{appStatus:btn});
								}else if(type=="XC"){
									var btn = "<a id='view' href='javascript:void(0);'  onclick=\"doAppStatusFlow('薪酬发放','"+id+"','FEE03003');\">审批通过</a>"; 
									jQuery("#dataList").jqGrid('setRowData',ids[i],{appStatus:btn});
								}
							}
						},
						
						emptyMsg : "查询结果为空", // 如果设置了该选项，在表格为空数据时撑开表格并显示设置的信息
						caption : "部门单据列表"
					});
					//导出表格
				    jQuery("#dataList").jqGrid('navGrid', '#listPager', {
				    	add: false, del: false, edit: false, search:false, refresh:false
				    });
			/*
			 * 表格大小调整
			 */
			jQuery(window).on(
					'resize.jqGrid',
					function() {
						jQuery("#dataList").jqGrid('setGridWidth', jQuery(".col-xs-12").width());
//						jQuery("#dataList").jqGrid('setGridHeight', ($(document).height() - $("div.ilead-search").height() - 200));
					});
			jQuery(window).triggerHandler('resize.jqGrid');
	
		},
		//编辑/详细画面
		queryDetail:function(actionType){
			//码表id
			var paramIdArr = "";
			//页头
			var titleStr = "";
			//url
			var url = "";
			//判断id是否为空
			paramIdArr = $("#dataList").jqGrid('getGridParam','selarrrow');
			if(paramIdArr && paramIdArr.length > 1){
				//选中多条
				sweetAlert({
					title: "提示",
					text:"只能选择一条数据进行操作",
					type: 'error',
					showConfirmButton: true,
					confirmButtonText:"确认",
				});
				return;
			}else if(paramIdArr.length == 0){
				//未选中数据
				sweetAlert({
					title: "提示",
					text:"请选择一条数据进行操作",
					type: 'error',
					showConfirmButton: true,
					confirmButtonText:"确认",
				});
				return;
			}
			
			var state = $("#dataList").jqGrid('getRowData', paramIdArr).CONFIRMATIONSTATE;
			if (actionType == "cashier" && state == "已确认") {
				sweetAlert({
					title: "提示",
					text:"该单据已经被确认，无法修改。",
					type: 'error',
					showConfirmButton: true,
					confirmButtonText:"确认",
				});
				return;
			}
			//单据类型判断
			var type = $("#dataList").jqGrid('getRowData', paramIdArr).TYPE;
			var titleStr="";
			if(type=="BX"){
				titleStr = "个人普通报销单详细";
				url = WEB_CTX_PATH + "/ordinarymainAction.do?method=doAddOrEdit&actionType=" + actionType + "&billUid=" + paramIdArr[0];
//					jQuery().openDlg({
////						parent: window.top,//此行调遮罩
//						height: 800,//此行调高度
//						width: 1100,
//						url:url,
//						title: titleStr
//					});
			}else if(type=="CL"){
				titleStr = "人民币差旅报销单详细";
				url = WEB_CTX_PATH + "/tripMainAction.do?method=detail&actionType=" + actionType + "&paramId=" + paramIdArr[0];
//					jQuery().openDlg({
//						// parent: window.top,//此行调遮罩
//						height : 700,// 此行调高度
//						width : 1100,
//						url : url,
//						title : titleStr
//					});
			}else if(type=="ZJ"){
				titleStr = "银行间转款单详细";
				url = WEB_CTX_PATH + "/bankTransferAction.do?method=doAddOrEdit&actionType=" + actionType + "&billUid=" + paramIdArr[0];
//					jQuery().openDlg({
////						parent: window.top,//此行调遮罩
//						height: 680,//此行调高度
//						width: 1000,
//						url:url,
//						title: titleStr
//					});
			}else if(type=="FX"){
				titleStr = "付款报销单详细";
				url = WEB_CTX_PATH + "/paymentAction.do?method=doAddOrEdit&actionType=" + actionType + "&paramId=" + paramIdArr[0];
//					jQuery().openDlg({
////						parent: window.top,//此行调遮罩
//						height: 700,//此行调高度
//						width: 1100,
//						url:url,
//						title: titleStr
//					});
			}else if(type=="CX"){
				titleStr = "车辆费用报销单详细";
				url = WEB_CTX_PATH + "/vehicleExpenseAction.do?method=doAddOrEdit&actionType=" + actionType + "&billUid=" + paramIdArr[0];
//					jQuery().openDlg({
////						parent: window.top,//此行调遮罩
//						height: 700,//此行调高度
//						width: 1100,
//						url:url,
//						title: titleStr
//					});
			}else if(type=="LC"){
				titleStr = "理财产品单详细";
				url = WEB_CTX_PATH + "/financingAction.do?method=doAddOrEdit&actionType=" + actionType + "&billUid=" + paramIdArr[0];
			}else if(type=="XC"){
				titleStr = "薪酬发放单详细";
				url = WEB_CTX_PATH + "/salaryAction.do?method=doEditOrDetail&actionType=" + actionType + "&billUid=" + paramIdArr[0];
			}else{
				alert("未知异常");
			}
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
		//确认
		doConfirm:function(){
			//码表id
			var paramIdArr = "";
			//页头
			var titleStr = "";
			//url
			var url = "";
			//判断id是否为空
				paramIdArr = $("#dataList").jqGrid('getGridParam','selarrrow');
				if(paramIdArr && paramIdArr.length > 1){
					//选中多条
					sweetAlert({
						title: "提示",
						text:"只能选择一条数据进行确认",
						type: 'error',
						showConfirmButton: true,
						confirmButtonText:"确认",
					});
					return;
				}else if(paramIdArr.length == 0){
					//未选中数据
					sweetAlert({
						title: "提示",
						text:"请选择一条数据进行确认",
						type: 'error',
						showConfirmButton: true,
						confirmButtonText:"确认",
					});
					return;
				}
				
				sweetAlert({
					title: "确认",
					text:"要进行出纳确认吗?",
					type: 'warning',
					showConfirmButton: true,
					showCancelButton:true,
					confirmButtonText:"确认",
					cancelButtonText: "取消",
					closeOnConfirm: false, 
				},
				function(isConfirm){ 
				 //是否出纳确认
				  if (!isConfirm) { 
					  //取消
					  return;
				  } else { //确认
					//单据类型判断
					var type = $("#dataList").jqGrid('getRowData', paramIdArr).TYPE;
					var confirm = $("#dataList").jqGrid('getRowData', paramIdArr).CONFIRMATIONSTATE;
					var billuid = $("#dataList").jqGrid('getRowData', paramIdArr).BILLUID;
					var titleStr="";
					if(confirm=="已确认"){
						sweetAlert({
							title : "提示",
							text : "状态为已确认的数据不可以确认！",
							type : 'error',
							showConfirmButton : true,
							confirmButtonText : "确认",
						});
						return;
					}else if(confirm=="未确认"){
						$.ajax({
							url : WEB_CTX_PATH+ "/cashierAction.do?method=doConfirm",
							data : {
								"billuid" : billuid,
								"type":type
							},
							type : "POST",
							dataType : 'json',
							success : function(data) {
								// 成功
								if (data.success == true) {
									sweetAlert(
											{
												title : "确认成功！",
												type : 'success',
												showConfirmButton : true,
												confirmButtonText : "确认"
											},
											function() {
												// 重新加载数据
												jQuery("#dataList").jqGrid('setGridParam', {
													url : WEB_CTX_PATH+ "/cashierAction.do?method=doInit",
													page : 1,
												}).trigger("reloadGrid");
											})
								} else {
									// 失败
									sweetAlert({
										title : "确认失败",
										text : "请刷新后重试",
										type : 'error',
										showConfirmButton : true,
										confirmButtonText : "确认"
									})
								}
							},
							// 异常
							error : function(data) {
								alert("系统错误");
								sweetAlert({
									title : "系统错误",
									type : 'error',
									showConfirmButton : true,
									confirmButtonText : "确认"
								})
							}
						});
						
					}else{
						alert("未知异常");
					}
				  } 
				});
		
		},
		//根据条件查询数据
		doQuery : function(){
			var deptuid=$("#orgId").val(); //部门id 
			var compid=$("#upOrgId").val();//公司id
			var projectuid=$("#projectUid").val();//项目id
			if (projectuid == null) {
				projectuid = "";
			}
			var type = $("#type").val(); //类型
			var cashierConfirm = $("#cashierConfirm").val();//状态
			var applicatuid= $("#billNo").val();//申领人id
			var starttime= $("#starttime").val();//开始日期 
			var endtime= $("#endtime").val();//结束日期
			//重新加载数据
			jQuery("#dataList").jqGrid('setGridParam', {
				url : WEB_CTX_PATH+ "/cashierAction.do?method=doInit",
				page : 1,
				postData : {"deptuid":deptuid,"compid":compid,"type":type,"cashierConfirm":cashierConfirm,"applicatuid":applicatuid,"starttime":starttime,
					"endtime":endtime,"projectuid":projectuid}
			}).trigger("reloadGrid");
		},
		//重置
		resetQuery : function(){
		jQuery("input,select,textarea",jQuery("#dataList")).each(function(){
				if(this.type!="button"){
				this.value="";
				}
			});
			$("#upOrgId").val("");
			$("#orgId").val("");
			$("#projectUid").empty().select2();
			$("#projectUid").val("");
			$("#cashierConfirm").val(null).select2();
			$("#type").val(null).select2();
			cashierconfirm.orgtree.init();
			cashierconfirm.superDetailTree.init();
			ajaxFormRequest(
		 			WEB_CTX_PATH
		 					+ "/codeAction.do?method=getSelectOptions&element2CodeType="
		 					+ encodeURI(encodeURI("{'type':'billType'}")),
		 			function(returnData) {
		 				if (initSelect2(returnData)) {
		 				}
		 			}, function(type) {
		 			}, "deptbillForm", true, " ");
			ajaxFormRequest(
		 			WEB_CTX_PATH
		 					+ "/codeAction.do?method=getSelectOptions&element2CodeType="
		 					+ encodeURI(encodeURI("{'cashierConfirm':'confirmationState'}")),
		 			function(returnData) {
		 				if (initSelect2(returnData)) {
		 				}
		 			}, function(cashierConfirm) {
		 			}, "deptbillForm", true, " ");
			$(".select2-selection__placeholder").text("-请选择-");

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
			var appStatus = $("#dataList").jqGrid('getRowData', paramIdArr).appStatus;
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
			
			//单据类型判断
			var type = $("#dataList").jqGrid('getRowData', paramIdArr).TYPE;
			if(type=="BX"){
				titleStr = "个人普通报销单打印";
				url = WEB_CTX_PATH + "/ordinarymainAction.do?method=print&paramId=" + paramIdArr[0];
			}else if(type=="CL"){
				titleStr = "人民币差旅报销单打印";
				url = WEB_CTX_PATH + "/tripMainAction.do?method=print&paramId=" + paramIdArr[0];
			}else if(type=="ZJ"){
				titleStr = "银行间转款单打印";
				url = WEB_CTX_PATH+"/bankTransferAction.do?method=print&billUid="+paramIdArr[0]+"&actionType=print";
			}else if(type=="CX"){
				titleStr = "车辆费用报销单打印";
				url = WEB_CTX_PATH + "/vehicleExpenseAction.do?method=print&paramId=" + paramIdArr[0];
			}else if(type=="FX"){
				titleStr = "付款报销单打印";
				url = WEB_CTX_PATH + "/paymentAction.do?method=print&paramId=" + paramIdArr[0];
			}else if(type=="LC"){
				titleStr = "理财产品单打印";
				url = WEB_CTX_PATH + "/financingAction.do?method=print&billUid=" + paramIdArr[0];
			}else if(type=="XC"){
				titleStr = "薪酬发放单打印";
				url = WEB_CTX_PATH + "/salaryAction.do?method=print&billUid=" + paramIdArr[0];
			} else {
				return;
			}
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
		//input框去空格
		cky:function(obj)
	    {
	        var t = obj.value.replace(/\s+/g,'');
	        if(obj.value!=t)
	            obj.value=t;
	    }
	}
}();

// 20170822 公司树形
cashierconfirm.companytree = function() {
	var zTree;
	return {
		init : function() {
			//同步加载模式
			jQuery.ajax({
				async: true,
				type: "POST",
				url: WEB_CTX_PATH+"/paymentAction.do?method=getCompany",
				contentType: "application/x-www-form-urlencoded",
				data: {},
				dataType:'json',
				beforeSend: function(xhr) {xhr.setRequestHeader("__REQUEST_TYPE", "AJAX_REQUEST");},
				success: cashierconfirm.companytree.createTreeAll
			});	
			
		},
		bindEvent : function() {
		},
		createTreeAll : function(returnData){
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
						onClick : cashierconfirm.companytree.onClickCompany
					}
			};
			jQuery.fn.zTree.init(jQuery("#companyTree"), setting, allNodes);
			zTree = jQuery.fn.zTree.getZTreeObj("companyTree");
		},
		
		onClickCompany : function(e, treeId, treeNode) {
			//获取当前选中节点
			var node = zTree.getSelectedNodes()[0];
			jQuery("#upOrgId").val(node.id);
			jQuery("#upOrgName").val(node.name);
			var billtype = jQuery("#type").val();
			// 隐藏menu
			cashierconfirm.companytree.hideMenu();
			// 初始化 部门 
			jQuery("#orgId").val("");
			jQuery("#orgName").val("");
			cashierconfirm.orgtree.init(node.id);
			// 初始化 项目  
			jQuery("#projectUid").empty().select2();
		
			cashierconfirm.companytree.changeProject();
			cashierconfirm.superDetailTree.init();
		},
		changeProject : function(){//调用下拉列表  bankName'upOrgId'为select组件id、'bankName'(改变角色)
			if($("#projectUid").val()!=null){
				$("#projectUid").empty().select2();
			}
		},
		showOrgTree : function() {
			var orgName = jQuery("#upOrgName");
			var orgOffset = jQuery("#upOrgName").offset();
			jQuery("#companyContent").css({
				left : orgOffset.left + "px",
				top : orgOffset.top + orgName.outerHeight() + "px"
			}).slideDown("fast");
			jQuery("body").bind("mousedown",cashierconfirm.companytree.onBodyDown);			
		},
		hideMenu : function() {
			jQuery("#companyContent").fadeOut("fast");
			jQuery("body").unbind("mousedown",cashierconfirm.companytree.onBodyDown);
		},
		onBodyDown : function(event) {
			if (!(event.target.id == "menuBtn"|| event.target.id == "orgTreeBtn" || jQuery(event.target).parents("#companyContent").length > 0)) {	
				cashierconfirm.companytree.hideMenu();	
			}
		},
		doError : function() {
			alert("Error");
		},
		doClose : function() {
			
		}
	}
}();

//20170822 部门+项目
cashierconfirm.orgtree = function() {
	var zTree;
	return {
		init : function(upOrgId) {
			//同步加载模式
			jQuery.ajax({
				async: true,
				type: "POST",
				url: WEB_CTX_PATH+"/paymentAction.do?method=getCompanyDepartment",
				contentType: "application/x-www-form-urlencoded",
				data: {"upOrgId":upOrgId},
				dataType:'json',
				beforeSend: function(xhr) {xhr.setRequestHeader("__REQUEST_TYPE", "AJAX_REQUEST");},
				success: cashierconfirm.orgtree.createTreeAll
			});	
		},
		bindEvent : function() {
		},
		createTreeAll : function(returnData){
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
						onClick : cashierconfirm.orgtree.onClickOrg
					}
			};
			jQuery.fn.zTree.init(jQuery("#orgTree"), setting, allNodes);
			zTree = jQuery.fn.zTree.getZTreeObj("orgTree");
		},
		onClickOrg : function(e, treeId, treeNode) {
			// 获取当前选中节点
			var node = zTree.getSelectedNodes()[0];
			if (node.type == 'org') {
				jQuery("#orgId").val(node.id);
			}
			jQuery("#orgName").val(node.name);
			// 隐藏menu
			cashierconfirm.orgtree.hideMenu();
			// 初始化 项目  -- 最后做
			cashierconfirm.orgtree.changeProject();
		},
		changeProject : function(){
			//调用下拉列表  bankName'upOrgId'为select组件id、'bankName'(改变角色)
			if($("#projectUid").val()!=null){
				$("#projectUid").empty().select2();
			}
			ajaxFormRequest(
				WEB_CTX_PATH
						+ "/paymentAction.do?method=getCompanyDepartmentProject" 
						+"&upOrgId="+$("#upOrgId").val()
						+"&orgId="+$("#orgId").val(),
				function(returnData) {
					// 定义属性
					var obj = new Object();
					var obj1 = new Object();
					obj1.projectUid=returnData;
					// 这个属性 是控件Id
					obj.result=obj1;
					if (initSelect2(obj)) {
						$("#projectUid").val(null).select2();
						$(".select2-selection__placeholder").text("-请选择-");
					}
				}, function(cashierConfirm) {
				}, "deptbillForm", true, " ");
		},
		showOrgTree : function() {
			var orgName = jQuery("#orgName");
			var orgOffset = jQuery("#orgName").offset();
			jQuery("#orgContent").css({
				left : orgOffset.left + "px",
				top : orgOffset.top + orgName.outerHeight() + "px"
			}).slideDown("fast");
			jQuery("body").bind("mousedown",cashierconfirm.orgtree.onBodyDown);			
		},
		hideMenu : function() {
			jQuery("#orgContent").fadeOut("fast");
			jQuery("body").unbind("mousedown",cashierconfirm.orgtree.onBodyDown);
		},
		onBodyDown : function(event) {
			if (!(event.target.id == "menuBtn"|| event.target.id == "orgTreeBtn" || jQuery(event.target).parents("#orgContent").length > 0)) {	
				cashierconfirm.orgtree.hideMenu();	
			}
		},
		doError : function() {
			alert("Error");
		},
		
		doClose : function() {
			
		}
	}
}();

/*
 * 初始化
 */
// jQuery(document).ready(function() {
// 	cashierconfirm.init();
// 	// 初始公司
// 	cashierconfirm.companytree.init();
// 	//初始化控件
// 	// jQuery("#projectUid").select2({
// 	// 	minimumResultsForSearch: -1,
// 	// 	data: []
// 	// });
// 	//单据状态下拉
// 	ajaxFormRequest(
//  			WEB_CTX_PATH
//  					+ "/codeAction.do?method=getSelectOptions&element2CodeType="
//  					+ encodeURI(encodeURI("{'cashierConfirm':'confirmationState'}")),
//  			function(returnData) {
//  				if (initSelect2(returnData)) {
//  				}
//  			}, function(cashierConfirm) {
//  			}, "deptbillForm", true, " ");
// 	//单据类型下拉
// 	ajaxFormRequest(
//  			WEB_CTX_PATH
//  					+ "/codeAction.do?method=getSelectOptions&element2CodeType="
//  					+ encodeURI(encodeURI("{'type':'billType'}")),
//  			function(returnData) {
//  				if (initSelect2(returnData)) {
//  				}
//  			}, function(type) {
//  			}, "deptbillForm", true, " ");
// });
