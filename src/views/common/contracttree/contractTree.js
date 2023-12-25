jQuery.namespace("contract.contractTree");
contract.contractTree = function(){
	var inputUpOrgId;
	var inputUpOrgName;
	var inputStaffNo;
	var inputStaffName;
	var inputOrgId;
	var inputOrgName;
	var inputIsMultiOrg;
	var inputIsMultiStaff;
	var endLinkageType;//"0":员工树，"1":职位树
	var inputCallBack;
	return {
		filter : function (treeId, parentNode, childNodes) {
			if (childNodes.result == '2') {
				jQuery("#" + treeId).fadeOut("fast");
				alert("服务器内部异常.");
				return false;
			}
			if (childNodes.result == '3') {
				jQuery("#" + treeId).fadeOut("fast");
				alert("数据权限不正确，无法取得信息");
				return false;
			}
			if (childNodes.result == '4') {
				jQuery("#" + treeId).fadeOut("fast");
				alert("检索不到相关数据");
				return false;
			}
			return childNodes.result;
		},
		selectMultiOrg : function(orgId, orgName){
			inputOrgId = orgId;
			inputOrgName = orgName;
			var draftId = jQuery("#draftId").val();
			var selectMultiOrgObject = jQuery('#' + orgName);
			var setting = {
					async : {
						enable : true,
						autoParam : ["id", "name"],
						dataType : "text",
						type : "post",
						url : WEB_CTX_PATH + "/contractTreeAction.do?method=doTreeTopNode&draftId=" + draftId,
						dataFilter:  contract.contractTree.filter
					},
					check : {
						chkStyle : "checkbox",              // 勾选框类型(checkbox 或 radio）
						chkboxType: { "Y" : "p", "N" : "" }, // 勾选取消时父子节点联动
						enable : true                       // checkbox是否显示，默认
					},
					callback: {
						onClick: contract.contractTree.clickForSelectMultiOrg,
						onCheck: contract.contractTree.checkForSelectMultiOrg
					}
			};
			var orgOffset = selectMultiOrgObject.offset();
			var divobj;
			var treeObj;
			var treeDiv = inputOrgName + '_treeDiv';
			var divStyle = 'z-index:9999;display:none; position: absolute;left:' + orgOffset.left + 'px;top:' + (orgOffset.top + selectMultiOrgObject.outerHeight()) + 'px;width:' + selectMultiOrgObject.outerWidth() + 'px';
			if (jQuery("#" + treeDiv).length <= 0) {
				divobj = jQuery('<div id="' + treeDiv + '" style="' + divStyle + '"></div>');
				treeObj = jQuery('<ul id="' + treeDiv + '" class="ztree" style="margin-top: 1px;border: 1px solid #617775;background: #f0f6e4;width:' + selectMultiOrgObject.innerWidth() + 'px;min-height:300px;max-height:300px;overflow-y:scroll;overflow-x:auto;"></ul>');
				divobj.append(treeObj);
				jQuery("body").append(divobj);
				$.fn.zTree.init(treeObj, setting);
			} else {
				divobj = jQuery("#" + treeDiv);
				divobj.attr("style", divStyle);
			}
			divobj.slideDown("fast");
			jQuery("body").bind("mousedown", contract.contractTree.onBodyDownForSelectMultiOrg);
		},
		onBodyDownForSelectMultiOrg: function(event) {
			var treeDiv = inputOrgName + '_treeDiv';
			if (!jQuery(event.target).parents("#" + treeDiv).length>0) {
				jQuery("#" + treeDiv).fadeOut("fast");
				jQuery("body").unbind("mousedown", contract.contractTree.onBodyDownForSelectSingleOrg);
			}
		},
		onBodyDownForSelectSingleOrg: function(event) {
			var treeDiv = inputOrgName + '_treeDiv';
			if (!jQuery(event.target).parents("#" + treeDiv).length>0) {
				jQuery("#" + treeDiv).fadeOut("fast");
				jQuery("body").unbind("mousedown", contract.contractTree.onBodyDownForSelectSingleOrg);
			}
		},
		checkForSelectMultiOrg : function(e, treeId, treeNode) {
				var treeDiv = inputOrgName + '_treeDiv';
				var zTree = $.fn.zTree.getZTreeObj(treeDiv);
				nodes = zTree.getCheckedNodes(true);
				var orgName = "";
				var orgId = "";
				for (var i=0, l=nodes.length; i<l; i++) {
					orgName += nodes[i].name + ",";
					orgId += nodes[i].id + ",";
				}
				if (orgId.length > 0 ) {
					orgId = orgId.substring(0, orgId.length-1);
				}
				if (orgName.length > 0 ) {
					orgName = orgName.substring(0, orgName.length-1);
				}
				jQuery("#" + inputOrgName).val(orgName);
				jQuery("#" + inputOrgId).val(orgId);
		},
		clickForSelectMultiOrg : function(e, treeId, treeNode) {
				var treeDiv = inputOrgName + '_treeDiv';
				var zTree = $.fn.zTree.getZTreeObj(treeDiv);
				nodes = zTree.getCheckedNodes(true);
				var orgName = "";
				var orgId = "";
				for (var i=0, l=nodes.length; i<l; i++) {
					orgName += nodes[i].name + ",";
					orgId += nodes[i].id + ",";
				}
				if (orgId.length > 0 ) {
					orgId = orgId.substring(0, orgId.length-1);
				}
				if (orgName.length > 0 ) {
					orgName = orgName.substring(0, orgName.length-1);
				}
				jQuery("#" + inputOrgName).val(orgName);
				jQuery("#" + inputOrgId).val(orgId);
		},
//		clickForSelectMultiOrg : function(e, treeId, treeNode) {
//			 var draftId = jQuery("#draftId").val();
//			 if(treeNode.children == null || treeNode.children == "undefined") {
//				jQuery.ajax({
//					url:WEB_CTX_PATH + "/contractTreeAction.do?method=getNextNodes&draftId=" + draftId,
//					data:{"id":treeNode.id, "type":treeNode.type, "treeType":"org"},
//					type: "POST",
//					dataType:'json',
//					success:function(returnData){
//						if (returnData.result == '2') {
//							alert("服务器内部异常.");
//							return false;
//						}
//						if (returnData.result == '3') {
//							alert("数据权限不正确，无法取得信息");
//							return false;
//						}
//						var treeObj = $.fn.zTree.getZTreeObj(treeId);
//						treeObj.addNodes(treeNode, returnData.result);
//					}
//				});
//			}
//		},
	}
}();