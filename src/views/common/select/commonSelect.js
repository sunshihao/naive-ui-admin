jQuery.namespace('hr.CommonSelect');
hr.CommonSelect = (function () {
  var selectId_ = '';
  return {
    //公司-部门-人员或职位三级联动
    // companySelectId公司下拉框id  orgSelectId部门下拉框id
    // selectId 承办人  isStaff ??
    // powerType 1 : 所属权限  ！1  数据权限
    initCompanySelect: function (companySelectId, orgSelectId, selectId, isStaff, powerType) {
      debugger;
      selectId_ = selectId;
      var input_company = $('#subordinateCompanies_input').val();
      //初始化公司下拉框
      var companySelect = $('#' + companySelectId);
      companySelect.append('<option value="">--请选择--</option>');
      var orgSelect = $('#' + orgSelectId);
      orgSelect.append('<option value="">--请选择--</option>');
      var select = $('#' + selectId);
      select.append('<option value="">--请选择--</option>');
      $.ajax({
        url: WEB_CTX_PATH + '/commonSelectAction.do?method=doLinkageCompany',
        data: {
          actType: 'select',
          powerType: powerType,
        },
        async: false,
        dataType: 'json',
        success: function (data) {
          if (data.result == '4') {
            companySelect.empty();
            companySelect.append('<option value="">--请选择--</option>');
          } else if (data.result == '2') {
            alert('系统错误!');
          } else {
            for (var i = 0; i < data.result.length; i++) {
              var option = '';
              if (input_company == data.result[i].name) {
                option =
                  '<option selected="selected" value="' +
                  data.result[i].id +
                  '">' +
                  data.result[i].name +
                  '</option>';
                hr.CommonSelect.companyChange(null, orgSelectId, data.result[i].id);
              } else {
                option =
                  '<option value="' + data.result[i].id + '">' + data.result[i].name + '</option>';
              }
              companySelect.append(option);
            }
            if (isStaff) {
              hr.CommonSelect.orgChange(
                orgSelectId,
                isStaff,
                selectId,
                $('#' + orgSelectId).val(),
                ''
              );
            }
          }
        },
      });
    },
    companyChange: function (obj, orgSelectId, editId, mType) {
      var upOrgId = '';
      if (editId) {
        upOrgId = editId;
        var input_department = $('#dept_input').val();
      } else {
        upOrgId = $(obj).val();
      }
      var orgSelect = $('#' + orgSelectId);
      orgSelect.empty();
      orgSelect.append('<option value="">--请选择--</option>');
      var select = $('#' + selectId_);
      select.empty();
      select.append('<option value="">--请选择--</option>');
      $.ajax({
        url: WEB_CTX_PATH + '/commonSelectAction.do?method=doLinkageOrg',
        data: { actType: 'select', upOrgId: upOrgId, mType: mType },
        async: false,
        dataType: 'json',
        success: function (data) {
          if (data.result != 2) {
            for (var i = 0; i < data.result.length; i++) {
              var option = '';
              if (input_department == data.result[i].name) {
                option =
                  '<option selected="selected" value="' +
                  data.result[i].id +
                  '">' +
                  data.result[i].name +
                  '</option>';
                hr.CommonSelect.orgChange(null, 'staff', selectId_, data.result[i].id);
              } else {
                option =
                  '<option value="' + data.result[i].id + '">' + data.result[i].name + '</option>';
              }
              orgSelect.append(option);
            }
          } else {
            alert('系统错误!');
          }
        },
      });
    },
    //公司部门联动，部门显示登录人所在部门  add by zhuyechuan 2018-1-30 bug：6165
    companyChangeOnlyDep: function (obj, orgSelectId) {
      var upOrgId = $(obj).val();
      var orgSelect = $('#' + orgSelectId);
      orgSelect.empty();
      orgSelect.append('<option value="">--请选择--</option>');
      var select = $('#' + selectId_);
      select.empty();
      select.append('<option value="">--请选择--</option>');
      $.ajax({
        url: WEB_CTX_PATH + '/commonSelectAction.do?method=doLinkPerOnlyOrg',
        data: { actType: 'select', upOrgId: upOrgId },
        async: false,
        dataType: 'json',
        success: function (data) {
          if (data.result != 2) {
            for (var i = 0; i < data.result.length; i++) {
              var option =
                '<option value="' + data.result[i].id + '">' + data.result[i].name + '</option>';
              orgSelect.append(option);
            }
          } else {
            alert('系统错误!');
          }
        },
      });
    },

    //发票类型
    initBillTypeSelect: function (billTypeSelectId) {
      //初始化发票类型下拉框
      $jQuery('#' + billTypeSelectId).select2({
        tags: true,
        allowClear: true,
        minimumResultsForSearch: -1,
      });
    },
    companyChangeBillType: function (obj, billTypeSelectId) {
      var upOrgId = $(obj).val();
      var billTypeSelect = $('#' + billTypeSelectId);
      billTypeSelect.empty();
      $.ajax({
        url: WEB_CTX_PATH + '/commonSelectAction.do?method=doLinkBillTypeSelect',
        data: { actType: 'select', upOrgId: upOrgId },
        async: false,
        dataType: 'json',
        success: function (data) {
          if (data.result == 0) {
            $jQuery('#' + billTypeSelectId).select2({
              data: data.billTypeList,
              tags: true,
              allowClear: true,
              minimumResultsForSearch: -1,
            });
          } else if (data.result == '1') {
            $jQuery('#' + billTypeSelectId).select2({
              tags: true,
              allowClear: true,
              minimumResultsForSearch: -1,
            });
          } else {
            sweetAlert({
              title: '网络异常，请联系管理员!',
              type: 'error',
              showConfirmButton: true,
              confirmButtonText: '确认',
            });
          }
        },
      });
    },
    //承办部门
    initDepartmentTypeSelect: function (departmentTypeSelectId) {
      //初始化承办部门下拉框
      $jQuery('#' + departmentTypeSelectId).select2({
        tags: true,
        allowClear: true,
        minimumResultsForSearch: -1,
      });
    },
    companyChangeDepartmentType: function (obj, departmentTypeSelectId) {
      var upOrgId = $(obj).val();
      var departmentTypeSelect = $('#' + departmentTypeSelectId);
      departmentTypeSelect.empty();
      $.ajax({
        url: WEB_CTX_PATH + '/commonSelectAction.do?method=doLinkDepartmentTypeSelect',
        data: { actType: 'select', upOrgId: upOrgId },
        async: false,
        dataType: 'json',
        success: function (data) {
          if (data.result == 0) {
            $jQuery('#' + departmentTypeSelectId).select2({
              data: data.departmentTypeList,
              tags: true,
              allowClear: true,
              minimumResultsForSearch: -1,
            });
          } else if (data.result == '1') {
            $jQuery('#' + departmentTypeSelectId).select2({
              tags: true,
              allowClear: true,
              minimumResultsForSearch: -1,
            });
          } else {
            sweetAlert({
              title: '网络异常，请联系管理员!',
              type: 'error',
              showConfirmButton: true,
              confirmButtonText: '确认',
            });
          }
        },
      });
    },
    //收付款方向
    initPayOppositeSelect: function (payOppositeSelectId) {
      //初始化收付款方向下拉框
      $jQuery('#' + payOppositeSelectId).select2({
        tags: true,
        allowClear: true,
        minimumResultsForSearch: -1,
      });
    },
    companyChangePayOpposite: function (obj, payOppositeSelectId) {
      var upOrgId = $(obj).val();
      var payOppositeSelect = $('#' + payOppositeSelectId);
      payOppositeSelect.empty();
      $.ajax({
        url: WEB_CTX_PATH + '/commonSelectAction.do?method=doLinkPayOppositeSelect',
        data: { actType: 'select', upOrgId: upOrgId },
        async: false,
        dataType: 'json',
        success: function (data) {
          if (data.result == 0) {
            $jQuery('#' + payOppositeSelectId).select2({
              data: data.payOppositeList,
              tags: true,
              allowClear: true,
              minimumResultsForSearch: -1,
            });
          } else if (data.result == '1') {
            $jQuery('#' + payOppositeSelectId).select2({
              tags: true,
              allowClear: true,
              minimumResultsForSearch: -1,
            });
          } else {
            sweetAlert({
              title: '网络异常，请联系管理员!',
              type: 'error',
              showConfirmButton: true,
              confirmButtonText: '确认',
            });
          }
        },
      });
    },
    //收付方向
    initReceiptsDirectionSelect: function (receiptsDirectionSelectId) {
      //初始化收付方向下拉框
      $jQuery('#' + receiptsDirectionSelectId).select2({
        tags: true,
        allowClear: true,
        minimumResultsForSearch: -1,
      });
    },
    companyChangeReceiptsDirection: function (obj, receiptsDirectionSelectId) {
      var upOrgId = $(obj).val();
      var receiptsDirectionSelect = $('#' + receiptsDirectionSelectId);
      receiptsDirectionSelect.empty();
      $.ajax({
        url: WEB_CTX_PATH + '/commonSelectAction.do?method=doLinkReceiptsDirectionSelect',
        data: { actType: 'select', upOrgId: upOrgId },
        async: false,
        dataType: 'json',
        success: function (data) {
          if (data.result == 0) {
            $jQuery('#' + receiptsDirectionSelectId).select2({
              data: data.receiptsDirectionList,
              tags: true,
              allowClear: true,
              minimumResultsForSearch: -1,
            });
          } else if (data.result == '1') {
            $jQuery('#' + receiptsDirectionSelectId).select2({
              tags: true,
              allowClear: true,
              minimumResultsForSearch: -1,
            });
          } else {
            sweetAlert({
              title: '网络异常，请联系管理员!',
              type: 'error',
              showConfirmButton: true,
              confirmButtonText: '确认',
            });
          }
        },
      });
    },
    //用印类型
    initSealTypeSelect: function (sealTypeSelectId) {
      //初始化用印类型下拉框
      $jQuery('#' + sealTypeSelectId).select2({
        tags: true,
        allowClear: true,
        minimumResultsForSearch: -1,
      });
    },
    companyChangeSealType: function (obj, sealTypeSelectId) {
      var upOrgId = $(obj).val();
      var sealTypeSelect = $('#' + sealTypeSelectId);
      sealTypeSelect.empty();
      $.ajax({
        url: WEB_CTX_PATH + '/commonSelectAction.do?method=doLinkSealTypeSelect',
        data: { actType: 'select', upOrgId: upOrgId },
        async: false,
        dataType: 'json',
        success: function (data) {
          if (data.result == 0) {
            $jQuery('#' + sealTypeSelectId).select2({
              data: data.sealTypeList,
              tags: true,
              allowClear: true,
              minimumResultsForSearch: -1,
            });
          } else if (data.result == '1') {
            $jQuery('#' + sealTypeSelectId).select2({
              tags: true,
              allowClear: true,
              minimumResultsForSearch: -1,
            });
          } else {
            sweetAlert({
              title: '网络异常，请联系管理员!',
              type: 'error',
              showConfirmButton: true,
              confirmButtonText: '确认',
            });
          }
        },
      });
    },
    //模板分类
    initTypeSelect: function (typeSelectId) {
      //初始化模板分类下拉框
      $jQuery('#' + typeSelectId).select2({
        tags: true,
        allowClear: true,
        minimumResultsForSearch: -1,
      });
    },
    companyChangeType: function (obj, typeSelectId) {
      var upOrgId = $(obj).val();
      var typeSelect = $('#' + typeSelectId);
      typeSelect.empty();
      $.ajax({
        url: WEB_CTX_PATH + '/commonSelectAction.do?method=doLinkTypeSelect',
        data: { actType: 'select', upOrgId: upOrgId },
        async: false,
        dataType: 'json',
        success: function (data) {
          if (data.result == 0) {
            $jQuery('#' + typeSelectId).select2({
              data: data.typeList,
              tags: true,
              allowClear: true,
              minimumResultsForSearch: -1,
            });
          } else if (data.result == '1') {
            $jQuery('#' + typeSelectId).select2({
              tags: true,
              allowClear: true,
              minimumResultsForSearch: -1,
            });
          } else {
            sweetAlert({
              title: '网络异常，请联系管理员!',
              type: 'error',
              showConfirmButton: true,
              confirmButtonText: '确认',
            });
          }
        },
      });
    },
    /**
     * personStatus:人员状态筛选  0-在职 1-全部
     */
    orgChange: function (obj, type, selectId, editId, company, personStatus) {
      var url = '';
      var select = $('#' + selectId);
      if (type == 'staff') {
        url = WEB_CTX_PATH + '/commonSelectAction.do?method=doLinkageStaff';
      } else if (type == 'post') {
        url = WEB_CTX_PATH + '/commonSelectAction.do?method=doLinkagePost';
      }
      var orgId = '';
      if (editId) {
        orgId = editId;
        var input_salesman = $('#agent_input').val();
      } else {
        orgId = $(obj).val();
      }
      var upOrgId = '';
      if (company) {
        upOrgId = company;
      }
      select.empty();
      select.append('<option value="">--请选择--</option>');
      $.ajax({
        url: url,
        data: { orgId: orgId, upOrgId: upOrgId, personStatus: personStatus },
        async: false,
        dataType: 'json',
        success: function (data) {
          if (data.result != '2') {
            for (var i = 0; i < data.result.length; i++) {
              var option = '';
              if (input_salesman == data.result[i].name) {
                option =
                  '<option selected="selected" value="' +
                  data.result[i].id +
                  '">' +
                  data.result[i].name +
                  '</option>';
              } else {
                option =
                  '<option value="' + data.result[i].id + '">' + data.result[i].name + '</option>';
              }
              select.append(option);
            }
          } else {
            alert('系统错误!');
          }
        },
      });
    },
    //单独的公司下拉框
    initOnlyCompanySelect: function (companySelectId) {
      //初始化公司下拉框
      var companySelect = $('#' + companySelectId);
      $.ajax({
        url: WEB_CTX_PATH + '/commonSelectAction.do?method=doLinkageCompany',
        data: { actType: 'select' },
        async: false,
        dataType: 'json',
        success: function (data) {
          if (data.result != '2') {
            for (var i = 0; i < data.result.length; i++) {
              if ('****' == data.result[i].parentId) {
                continue;
              }
              var option =
                '<option value="' + data.result[i].id + '">' + data.result[i].name + '</option>';
              companySelect.append(option);
            }
          } else if (data.result == '4') {
            companySelect.append('<option value="">无可操作公司</option>');
          } else {
            alert('系统错误!');
          }
        },
      });
    },
    //人员模糊查询框
    staffSelect: function (objectForm, selectId, type, id) {
      ajaxFormRequest(
        WEB_CTX_PATH +
          '/hrParamAction.do?method=getStaffSelectOptions&selectType=' +
          type +
          '&orgOrUpOrgId=' +
          id +
          '&element2CodeType=' +
          encodeURI(encodeURI("{'" + selectId + "':'" + selectId + "'}")),
        function (returnData) {
          if (hr.base.initSelect2(returnData)) {
          }
        },
        function (state) {},
        objectForm,
        true,
        ' '
      );
    },
    //乘法
    accMul: function (arg1, arg2) {
      var m = 0;
      var s1 = arg1.toString();
      var s2 = arg2.toString();
      try {
        m += s1.split('.')[1].length;
      } catch (e) {}
      try {
        m += s2.split('.')[1].length;
      } catch (e) {}
      return (Number(s1.replace('.', '')) * Number(s2.replace('.', ''))) / Math.pow(10, m);
    },
    //除法
    accDiv: function (arg1) {
      var t1 = 0;
      var r1;
      try {
        t1 = arg1.toString().split('.')[1].length;
      } catch (e) {}
      // with (Math) {
      //   r1 = Number(arg1.toString().replace('.', ''));
      //   var m = 0;
      //   var s1 = (r1 / 10000).toString();
      //   var s2 = pow(10, 0 - t1).toString();
      //   try {
      //     m += s1.split('.')[1].length;
      //   } catch (e) {}
      //   try {
      //     m += s2.split('.')[1].length;
      //   } catch (e) {}
      //   var result = (Number(s1.replace('.', '')) * Number(s2.replace('.', ''))) / Math.pow(10, m);
      //   return result;
      // }
    },

    // 获取金投四家扁平化公司及直属子公司列表
    initJTLowerCompanySelect: function (companySelectId) {
      //初始化公司下拉框
      var companySelect = $('#' + companySelectId);
      $.ajax({
        url: WEB_CTX_PATH + '/commonSelectAction.do?method=doLinkageJTLowerCompany',
        async: false,
        dataType: 'json',
        success: function (data) {
          if (data.result != '2') {
            companySelect.append('<option value="">--请选择--</option>');
            for (var i = 0; i < data.result.length; i++) {
              if ('****' == data.result[i].parentId) {
                continue;
              }
              var option =
                '<option value="' + data.result[i].id + '">' + data.result[i].name + '</option>';
              companySelect.append(option);
            }
          } else if (data.result == '4') {
            companySelect.append('<option value="">无可操作公司</option>');
          } else {
            alert('系统错误!');
          }
        },
      });
    },

    /**
     * 全部公司部门联动 begin
     * allData:是否查询所有公司和部门 0-否 1-是
     */
    //公司-部门-人员或职位三级联动
    initCompanyAllSelect: function (companySelectId, orgSelectId, selectId, allData, agentId) {
      selectId_ = selectId;
      var input_company = $('#subordinateCompanies_input').val();
      //初始化公司下拉框
      var companySelect = $('#' + companySelectId);
      companySelect.append('<option value="">--请选择--</option>');
      var orgSelect = $('#' + orgSelectId);
      orgSelect.append('<option value="">--请选择--</option>');
      var select = $('#' + selectId);
      select.append('<option value="">--请选择--</option>');
      $.ajax({
        url: WEB_CTX_PATH + '/commonSelectAction.do?method=doLinkageCompanyAll',
        data: { actType: 'select', allData: allData },
        async: false,
        dataType: 'json',
        success: function (data) {
          if (data.result == '4') {
            companySelect.empty();
            companySelect.append('<option value="">--请选择--</option>');
          } else if (data.result == '2') {
          } else {
            for (var i = 0; i < data.result.length; i++) {
              var option = '';
              if (input_company == data.result[i].name) {
                option =
                  '<option selected="selected" value="' +
                  data.result[i].id +
                  '">' +
                  data.result[i].name +
                  '</option>';
                hr.CommonSelect.companyChangeAll(
                  null,
                  orgSelectId,
                  data.result[i].id,
                  allData,
                  agentId
                );
              } else {
                option =
                  '<option value="' + data.result[i].id + '">' + data.result[i].name + '</option>';
              }
              companySelect.append(option);
            }
          }
        },
      });
    },

    companyChangeAll: function (obj, orgSelectId, editId, mType, agentId) {
      var upOrgId = '';
      if (editId) {
        upOrgId = editId;
        var input_department = $('#dept_input').val();
      } else {
        upOrgId = $(obj).val();
      }
      var orgSelect = $('#' + orgSelectId);
      orgSelect.empty();
      orgSelect.append('<option value="">--请选择--</option>');
      var select = $('#' + selectId_);
      select.empty();
      select.append('<option value="">--请选择--</option>');
      $.ajax({
        url: WEB_CTX_PATH + '/commonSelectAction.do?method=doLinkageOrg',
        data: { actType: 'select', upOrgId: upOrgId, mType: mType },
        async: false,
        dataType: 'json',
        success: function (data) {
          if (data.result != 2) {
            for (var i = 0; i < data.result.length; i++) {
              var option = '';
              if (input_department == data.result[i].name) {
                option =
                  '<option selected="selected" value="' +
                  data.result[i].id +
                  '">' +
                  data.result[i].name +
                  '</option>';
                if (agentId != null && agentId != '') {
                  hr.CommonSelect.orgChange(null, 'staff', selectId_, data.result[i].id);
                }
              } else {
                option =
                  '<option value="' + data.result[i].id + '">' + data.result[i].name + '</option>';
              }
              orgSelect.append(option);
            }
          } else {
            alert('系统错误!');
          }
        },
      });
    },

    /**
     * 查询合同分类
     */
    queryConType: function (upOrgId, orgSelectId) {
      var orgSelect = $('#' + orgSelectId);
      orgSelect.empty();
      orgSelect.append('<option value="">--请选择--</option>');
      var select = $('#' + selectId_);
      select.empty();
      select.append('<option value="">--请选择--</option>');
      $.ajax({
        url: WEB_CTX_PATH + '/commonSelectAction.do?method=queryConType',
        data: { actType: 'select', upOrgId: upOrgId },
        async: false,
        dataType: 'json',
        success: function (data) {
          if (data.result != 2) {
            for (var i = 0; i < data.result.length; i++) {
              var option = '';

              option =
                '<option value="' + data.result[i].id + '">' + data.result[i].name + '</option>';

              orgSelect.append(option);
            }
          } else {
            alert('系统错误!');
          }
        },
      });
    },
    /**
     * 全部公司部门联动 end
     */
  };
})();
