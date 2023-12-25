jQuery.namespace("hr.commonSelectAllOrg");
hr.commonSelectAllOrg = function(){
	var selectId_ = "";
	return {
		//公司-部门-人员或职位三级联动
		initCompanySelect:function(companySelectId,orgSelectId,selectId,objectForm,isSupervisor){
			selectId_ = selectId;
			var input_company = $("#subordinateCompanies_input").val();
			//初始化公司下拉框
			var companySelect = $("#"+companySelectId);
			companySelect.empty();
			companySelect.append('<option value="">--请选择--</option>');
			var orgSelect = $("#"+orgSelectId);
			orgSelect.empty();
			orgSelect.append('<option value="">--请选择--</option>');
			var select=$("#"+selectId);
			select.empty();
			select.append('<option value="">--请选择--</option>');
			select.val(null).trigger("change");
			$.ajax({
				url : WEB_CTX_PATH + "/commonSelectAction.do?method=doLinkageCompany",
				data : {"actType":"select"},
				async:false,
				dataType : "json",
				success : function(data) {
					if(data.result=='4'){
						companySelect.empty();
						companySelect.append('<option value="">--请选择--</option>');
					}else if(data.result=='2'){
						alert("系统错误!");
					}else{
						for(var i = 0;i<data.result.length;i++){
							var option="";
							if(input_company==data.result[i].name){
								option='<option selected="selected" value="'+data.result[i].id+'">'+data.result[i].name+'</option>';
								hr.commonSelectAllOrg.companyChange(null,orgSelectId,"0",objectForm,data.result[i].id,isSupervisor);
							}else{
							    option='<option value="'+data.result[i].id+'">'+data.result[i].name+'</option>';
							}
							
							companySelect.append(option);
						}
					}
				}
			});
		},
		companyChange : function(obj,orgSelectId,mType,objectForm,editId,isSupervisor) {
			var upOrgId = "";
			if(editId){
				upOrgId = editId
				var input_department =  $("#dept_input").val();
			}else{
				upOrgId = $(obj).val();
			}
			var orgSelect = $("#"+orgSelectId);
			orgSelect.empty();
			orgSelect.append('<option value="">--请选择--</option>');
			var select=$("#"+selectId_);
			select.empty();
			select.append('<option value="">--请选择--</option>');
			select.val(null).trigger("change");
			$.ajax({
				url : WEB_CTX_PATH + "/commonSelectAction.do?method=doLinkageOrg",
				data : {"actType":"select","upOrgId":upOrgId,"mType":mType},
				async:false,
				dataType : "json",
				success : function(data) {
					if(data.result!=2){
						for(var i = 0;i<data.result.length;i++){
							var option = "";
							if(input_department == data.result[i].name){
								option='<option selected="selected" value="'+data.result[i].id+'">'+data.result[i].name+'</option>';
								hr.commonSelectAllOrg.orgChange(null,selectId_,objectForm,data.result[i].id,isSupervisor);
							}else{
								option='<option value="'+data.result[i].id+'">'+data.result[i].name+'</option>';
							}
							orgSelect.append(option);
						}
					}else{
						alert("系统错误!");
					}
				}
			});
		},
		
		//公司-部门-人员或职位三级联动
		//联动公司下，登录人所在部门（包含扁平化管理部门）add by zhuyechuan 2018-1-30 bug：6165
		initCompanySelectOnlyOrg:function(companySelectId,orgSelectId,selectId,objectForm,isSupervisor){
			selectId_ = selectId;
			var input_company = $("#subordinateCompanies_input").val();
			//初始化公司下拉框
			var companySelect = $("#"+companySelectId);
			companySelect.empty();
			companySelect.append('<option value="">--请选择--</option>');
			var orgSelect = $("#"+orgSelectId);
			orgSelect.empty();
			orgSelect.append('<option value="">--请选择--</option>');
			var select=$("#"+selectId);
			select.empty();
			select.append('<option value="">--请选择--</option>');
			select.val(null).trigger("change");
			$.ajax({
				url : WEB_CTX_PATH + "/commonSelectAction.do?method=doLinkageCompany",
				data : {"actType":"select"},
				async:false,
				dataType : "json",
				success : function(data) {
					if(data.result=='4'){
						companySelect.empty();
						companySelect.append('<option value="">--请选择--</option>');
					}else if(data.result=='2'){
						alert("系统错误!");
					}else{
						for(var i = 0;i<data.result.length;i++){
							var option="";
							
							if(input_company==data.result[i].name){
								option='<option selected="selected" value="'+data.result[i].id+'">'+data.result[i].name+'</option>';
								hr.commonSelectAllOrg.companyChangeOnlyDep(null,orgSelectId,"0",objectForm,data.result[i].id,isSupervisor);
							}else{
							    option='<option value="'+data.result[i].id+'">'+data.result[i].name+'</option>';
							}
							
							companySelect.append(option);
						}
					}
				}
			});
		},
		//联动公司下，登录人所在部门（包含扁平化管理部门）add by zhuyechuan 2018-1-30 bug：6165
		companyChangeOnlyDep : function(obj,orgSelectId,mType,objectForm,editId,isSupervisor) {
			var upOrgId = "";
			if(editId){
				upOrgId = editId
				var input_department =  $("#dept_input").val();
			}else{
				upOrgId = $(obj).val();
			}
			var orgSelect = $("#"+orgSelectId);
			orgSelect.empty();
			orgSelect.append('<option value="">--请选择--</option>');
			var select=$("#"+selectId_);
			select.empty();
			select.append('<option value="">--请选择--</option>');
			select.val(null).trigger("change");
			$.ajax({
				url : WEB_CTX_PATH + "/commonSelectAction.do?method=doLinkPerOnlyOrg",
				data : {"actType":"select","upOrgId":upOrgId,"mType":mType},
				async:false,
				dataType : "json",
				success : function(data) {
					if(data.result!=2){
						for(var i = 0;i<data.result.length;i++){
							var option = "";
							if(input_department == data.result[i].name){
								option='<option selected="selected" value="'+data.result[i].id+'">'+data.result[i].name+'</option>';
								hr.commonSelectAllOrg.orgChange(null,selectId_,objectForm,data.result[i].id,isSupervisor);
							}else{
								option='<option value="'+data.result[i].id+'">'+data.result[i].name+'</option>';
							}
							orgSelect.append(option);
						}
					}else{
						alert("系统错误!");
					}
				}
			});
		},
		
		orgChange : function(obj,selectId,objectForm,editId,isSupervisor) {
			var orgId = "";
			if(editId){
				orgId = editId;
				var input_salesman = $("#agent").val();
			}else{
				orgId = $(obj).val();
			}
			if(isSupervisor){
				hr.commonSelectAllOrg.staffSelect(objectForm,selectId,orgId,isSupervisor); 
			}else{
				hr.commonSelectAllOrg.staffSelect(objectForm,selectId,orgId); 
			}
		},
		//人员模糊查询框(扁平化)
		staffSelect:function(objectForm,selectId,orgId,isSupervisor){
			if(orgId){
				var input_salesman = $("#agent").val();
			}
			$("#"+selectId).empty();
			if(orgId){
				ajaxFormRequest(WEB_CTX_PATH + "/hrParamAction.do?method=getStaffSelectOptionsAllOrg&orgId=" + orgId + "&isSupervisor=" + isSupervisor + "&element2CodeType=" + 
						encodeURI(encodeURI("{'"+selectId+"':'"+selectId+"'}")), 
						function(returnData) {
					if (hr.base.initSelect2(returnData)) {
						var selectInput = jQuery("#agent").val();
						if(selectInput){
							jQuery('#'+selectId).val(selectInput).trigger("change");
						}
					}
				}, function(state) {
				}, objectForm, true, " ");
			}
			$("#"+selectId).append("<option value='' selected='selected'>-请选择-</option>")
		}
	}
}();
