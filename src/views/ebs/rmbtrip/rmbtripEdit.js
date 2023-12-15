/*
 * 定义命名空间
 */
jQuery.namespace('rmbtrip.rmbtripEdit');
//var JT_companyId = "10000";//金投
//var KD_companyId = "10001";//凯迪
//var KK_companyId = "10004";//凯矿
//var KC_companyId = "10005";//凯创
//var ZG_companyId = "10003";//资管
//var DL_companyId = "10007";//刀郎
//var WY_companyId = "10012";//物業
var KF_companyId = '10006'; //房产
var company = '10001,10000,10004,10005,10002';
rmbtrip.rmbtripEdit = (function () {
  return {
    init: function () {
      rmbtrip.rmbtripEdit.gridInit();
      if ($('#actionType').val() == 'edit') {
        //显示查看出差申请单的按钮
        $('#viewApply').show();
        //陪同出差
        if ($('#accompany').val() == '1') {
          $('#accompany').attr('checked', true);
        } else {
          $('#accompany').attr('checked', false);
        }
        // 项目的下拉列表控件
        if ($('#haveProject').val() == '1') {
          //0显示项目下拉控件,1 隐藏项目下拉控件
          $('#project_div').hide();
        } else {
          $('#project_div').show();
        }
        //是否高管
        if ($('#executive').val() == '1') {
          //是
          $('#executive').attr('checked', true);

          rmbtrip.rmbtripEdit.hideAccompany();

          $('#chooseApply').hide();
          $('#viewApply').hide();
          $('#applicatDiv').removeAttr('class');
          $('#trip_request_sign').hide();
        } else {
          // 否
          $('#executive').attr('checked', false);

          rmbtrip.rmbtripEdit.showAccompany();

          $('#chooseApply').show();
          $('#viewApply').show();
          $('#applicatDiv').attr('class', 'input-group');
          $('#trip_request_sign').show();
        }
        //是否计划外 0-否 1-是
        if ($('#usePlanFlag').val() == '1') {
          $('#usePlanFlag').attr('checked', true);
        } else {
          $('#usePlanFlag').attr('checked', false);
        }
        //是否计划外check
        rmbtrip.rmbtripEdit.userPlanCheck();
      } else {
        $('#chooseApply').show();
      }
      jQuery('#saveButton').on('click', rmbtrip.rmbtripEdit.update);
      jQuery('#saveStartButton').on('click', rmbtrip.rmbtripEdit.updateStart);
      jQuery('#closeButton').on('click', rmbtrip.rmbtripEdit.doClose);
      jQuery('#chooseApply').on('click', rmbtrip.rmbtripEdit.chooseApply);
      jQuery('#viewApply').on('click', rmbtrip.rmbtripEdit.viewApply);
      jQuery('#accompany').on('click', rmbtrip.rmbtripEdit.goAccompany);
      jQuery('#executive').on('click', rmbtrip.rmbtripEdit.goExecutive);
      jQuery('#usePlanFlag').on('change', rmbtrip.rmbtripEdit.goUsePlanFlag);
      jQuery('#expenseType').on('change', rmbtrip.rmbtripEdit.changeExpenseType);
      //生成select2
      $('#projectUid').select2();
      // 加载支付方式下拉列表
      ajaxFormRequest(
        WEB_CTX_PATH +
          '/codeAction.do?method=getSelectOptions&element2CodeType=' +
          encodeURI(encodeURI("{'payType':'payType'}")),
        function (returnData) {
          if (initSelect2(returnData)) {
            // 操作类型
            var actionType = jQuery('#actionType').val();
            if (actionType == 'edit') {
              $('#payType').val(payType).select2();
            }
          }
        },
        function (state) {},
        'rmbtripForm',
        true,
        ' '
      );
      // 差旅报销类型
      ajaxFormRequest(
        WEB_CTX_PATH +
          '/codeAction.do?method=getSelectOptions&element2CodeType=' +
          encodeURI(encodeURI("{'expenseType':'tripExpenseType'}")),
        function (returnData) {
          if (initSelect2(returnData)) {
            // 操作类型
            var actionType = jQuery('#actionType').val();
            if (actionType == 'edit') {
              $('#expenseType').val(expenseType).select2();
              // 编辑页面初始加载时，重设计划内外的显示
              rmbtrip.rmbtripEdit.planAmount(false);
            }
          }
        },
        function (state) {},
        'rmbtripForm',
        true,
        ' '
      );
      jQuery('#fileUploadDiv').initFileContainer({
        operAuth: false, //true：只有上传者才可以删除
        notIframe: true,
        batchDownload: true, //设置查看模式下是否添加批量下载功能（会放到压缩包内下载）
        zipName: 'trip', //设置批量下载时压缩包的名称
        bindPropVal: $('#attachmentId').val(),
        mainType: 'CL',
        //				mainType:"一级目录名",		//可选值，文件一级目录
        //				subType:"二级目录名",		//可选值，文件二级目录
        fileDivId: 'fileUploadDiv',
        operType: 'edit',
        maxFileNumber: 100,
        //				acceptFileTypes: "jpg,jpeg,png,txt,pdf,docx,doc,xls,xlsx",
        maxFileSize: 600000000,
      });

      //自适应
      $('#citytraffic_a').bind('click', function () {
        jQuery('#citytraffic').jqGrid('setGridWidth', jQuery('.nav.nav-tabs').width());
      });
      $('#cityinside_a').bind('click', function () {
        jQuery('#cityinside').jqGrid('setGridWidth', jQuery('.nav.nav-tabs').width());
      });
      $('#hotel_a').bind('click', function () {
        jQuery('#hotel').jqGrid('setGridWidth', jQuery('.nav.nav-tabs').width());
      });
      $('#subsidy_a').bind('click', function () {
        jQuery('#subsidy').jqGrid('setGridWidth', jQuery('.nav.nav-tabs').width());
      });
      $('#other_a').bind('click', function () {
        jQuery('#other').jqGrid('setGridWidth', jQuery('.nav.nav-tabs').width());
      });
      jQuery(window).on('resize.jqGrid', function () {
        jQuery('#payType')
          .next()
          .attr('style', 'width:' + $('.col-xs-2').width() + 'px');
        jQuery('#expenseType')
          .next()
          .attr('style', 'width:' + $('.col-xs-2').width() + 'px');
      });
      jQuery(window).triggerHandler('resize.jqGrid');
    },
    update: function () {
      rmbtrip.rmbtripEdit.saveOrUpdate();
    },
    updateStart: function () {
      //设置保存并启动工作状态
      $('#saveAndStart').val('saveAndStart');
      //保存并启动工作流
      rmbtrip.rmbtripEdit.saveOrUpdate();
    },
    changeExpenseType: function () {
      //取消计划外的选中
      $('#usePlanFlag').removeAttr('checked');
      $('#usePlanFlag').val('0');
      rmbtrip.rmbtripEdit.planAmount(true);
    },
    planAmount: function (init) {
      var usePlanFlag = $('#usePlanFlag').val();
      //计划外
      if (usePlanFlag == 1) {
      } else {
        //公司id
        var upOrgId = $('#upOrgId').val();
        //部门id
        var deptUid = $('#deptUid').val();
        //费用明细
        var expenseType = $('#expenseType').val();

        if (upOrgId == '' || deptUid == '' || expenseType == '') {
          return;
        }

        $.ajax({
          url: WEB_CTX_PATH + '/tripMainAction.do?method=getplan',
          data: { upOrgId: upOrgId, deptUid: deptUid, expenseType: expenseType },
          type: 'POST',
          dataType: 'json',
          async: false,
          success: function (data) {
            //计划内可用金额赋值
            if (data.result != '') {
              $('#monthlyPlan').val(data.result);
              //计划可用金额改变时，计划内外改变
              if (init) {
                rmbtrip.rmbtripEdit.isPlanInner();
              }
            } else {
              $('#monthlyPlan').val('');
              $('#planCheckAmount').val('');
              //清空计划内外
              $('#planCheckAmountState').val('');
              $('#planCheckAmountState').attr('style', 'background-color:#eee');

              if (data.msg != null && data.msg != '') {
                sweetAlert({
                  title: '提示',
                  text: data.msg,
                  type: 'error',
                  showConfirmButton: true,
                  confirmButtonText: '确认',
                });
              }
            }
          },
          //异常
          error: function (data) {
            sweetAlert({
              title: '获取计划信息失败',
              type: 'error',
              showConfirmButton: true,
              confirmButtonText: '确认',
            });
          },
        });
      }
    },
    //计划内外改变
    isPlanInner: function () {
      var usePlanFlag = $('#usePlanFlag').val();
      //计划外
      if (usePlanFlag == 1) {
      } else {
        //计划内
        //实际支付
        var payAmount = fee.Common.clearFormatAmount($('#amount').val());
        //计划内可用金额
        var monthlyPlan = fee.Common.clearFormatAmount($('#monthlyPlan').val());
        if (monthlyPlan != null && monthlyPlan != '') {
          if (payAmount == null || payAmount == '') {
            payAmount = 0;
          }
          if (Number(payAmount) > Number(monthlyPlan)) {
            $('#planCheckAmount').val('0');
            $('#planCheckAmountState').val('计划外');
            $('#planCheckAmountState').attr(
              'style',
              'background-color:#FF6347;color:black;font-weight:900'
            );
          } else {
            $('#planCheckAmount').val(fee.Common.formatAmount(monthlyPlan));
            $('#planCheckAmountState').val('计划内');
            $('#planCheckAmountState').attr(
              'style',
              'background-color:#00FA9A;color:black;font-weight:900'
            );
          }
        } else {
          $('#planCheckAmount').val('');
          //清空计划内外
          $('#planCheckAmountState').val('');
          $('#planCheckAmountState').attr('style', 'background-color:#eee');
        }
      }
    },
    /*
     * 生成表格组件
     */
    gridInit: function () {
      // 校验
      jQuery('#rmbtripForm').validate({
        rules: {
          companyName: {
            required: true,
          },
          orgName: {
            required: true,
          },
          //					projectUid : {
          //						required : true
          //					},
          payType: {
            required: true,
          },
          receiptNumber: {
            required: true,
          },
          amount: {
            required: true,
          },
          applicantBillCd: {
            checkTripBillRequired: true,
          },
          remark: {
            checkTextAreaRequired: true,
          },
          bankName: {
            required: true,
          },
          cardNo: {
            required: true,
          },
          expenseType: {
            required: true,
          },
        },
      });

      // 操作类型
      var actionType = jQuery('#actionType').val();
      if (actionType == 'add' || actionType == 'agent') {
        $('#billState').val('待生成');
      } else if (actionType == 'edit') {
        //11111
        $('#billState').val($('#billNo').val());
      }
    },
    // 确认按钮
    saveOrUpdate: function () {
      debugger;
      // form表单校验
      if (
        !jQuery('#rmbtripForm').valid() ||
        !rmbtrip.citytraffic.validateNull() ||
        !rmbtrip.cityinside.validateNull() ||
        !rmbtrip.subsidy.validateNull() ||
        !rmbtrip.hotel.validateNull() ||
        !rmbtrip.other.validateNull()
      ) {
        return false;
      }

      // 房产暂时不校验此项
      var jtFlag = false;
      if ($('#upOrgId').val() != KF_companyId) {
        if (company.indexOf($('#upOrgId').val()) != -1) {
          //住宿费中总金额是否超标准
          var tb3_count;
          var index = 1;
          $(":input[name='tab3_amount']").each(function () {
            if (rmbtrip.hotel.checkAmountForJT(this, index) == false) {
              tb3_count = 1;
            }
            index = index + 1;
          });
          if (tb3_count > 0) {
            jtFlag = true;
          }
        } else {
          //住宿费中总金额是否超标准
          var tb3_count;
          var index = 1;
          $(":input[name='tab3_amount']").each(function () {
            if (rmbtrip.hotel.checkAmount(this, index) == false) {
              tb3_count = 1;
            }
            index = index + 1;
          });
          if (tb3_count > 0) {
            return;
          }
        }

        //补助中总金额是否超标准
        var tb4_count;
        index = 1;
        $(":input[name='tab4_amount']").each(function () {
          if (rmbtrip.subsidy.checkAmount(this, index) == false) {
            tb4_count = 1;
          }
          index = index + 1;
        });
        if (tb4_count > 0) {
          return;
        }
      }

      //			// 明细是否存在
      //			var re_records = $("#citytraffic").jqGrid('getGridParam', 'records'); //获取数据总条数
      //			if(re_records==0){
      //				sweetAlert({
      //					title : "提示",
      //					text : "请填写报销明细！",
      //					type : 'error',
      //					showConfirmButton : true,
      //					confirmButtonText : "确认",
      //				});
      //			    return false;
      //			}

      $('#subsidy')
        .find('.subsidy_datetime')
        .each(function () {
          var startDateId = $(this).attr('id');
          $('#' + startDateId + '_hide').val($(this).val());
        });
      $('#subsidy')
        .find('.subsidy_time')
        .each(function () {
          var endDateId = $(this).attr('id');
          $('#' + endDateId + '_hide').val($(this).val());
        });

      // 操作类型
      var actionType = jQuery('#actionType').val();
      // sweetAlert的title和text
      var tStr = '';
      if (actionType == 'add') {
        tStr = '添加';
      } else if (actionType == 'edit') {
        tStr = '编辑';
      }

      // 附件信息设定
      jQuery('#fileUploadDiv').pickupFileIds({
        bindPropId: 'attachmentId',
        fileDivId: 'fileUploadDiv',
      });

      if (jtFlag) {
        $('#execessiveFlag').val('true');
        sweetAlert(
          {
            title: '住宿：存在超出标准，请核对或上传经批准的情况说明，确定要继续吗?',
            type: 'warning',
            showCancelButton: true,
            showConfirmButton: true,
            cancelButtonText: '取消',
            confirmButtonText: '确认',
            closeOnConfirm: false,
          },
          function (isConfirm) {
            //是否确认刪除
            if (!isConfirm) {
              //取消
              return;
            } else {
              // 表单提交
              $('#rmbtripForm').ajaxSubmit({
                url: WEB_CTX_PATH + '/tripMainAction.do?method=doSaveOrUpdate',
                dataType: 'json',
                method: 'POST',
                target: '#rmbtripForm',
                data: {
                  actionType: actionType,
                },
                success: function (data) {
                  if (data.result.success) {
                    // 成功
                    sweetAlert(
                      {
                        title: '系统提示',
                        text: '操作成功',
                        type: 'success',
                        showConfirmButton: true,
                        confirmButtonText: '确认',
                      },
                      function () {
                        parent.rmbtrip.rmbtripList.doQuery();
                        if ($('#saveAndStart').val() == 'saveAndStart') {
                          // 保存并提交按钮时，完成后关闭画面。
                          jQuery('#closeButton').click();
                        } else if (actionType == 'add') {
                          // 新建页面的 保存按钮时，不关闭画面
                          jQuery('#billUid').val(data.billUid);
                          jQuery('#billState').val(data.billNo);
                          jQuery('#billNo').val(data.billNo);
                          jQuery('#actionType').val('edit');
                        }
                      }
                    );
                  } else {
                    if (data.result.msg == '') {
                      // 失败
                      sweetAlert(
                        {
                          title: '系统提示',
                          text: '失败，出差申请单已存在。',
                          type: 'error',
                          showConfirmButton: true,
                          confirmButtonText: '确认',
                        },
                        function () {
                          //														parent.rmbtrip.rmbtripList.doQuery();
                          //														jQuery("#closeButton").click();
                        }
                      );
                    } else {
                      // 失败
                      sweetAlert(
                        {
                          title: '系统提示',
                          text: data.result.msg,
                          type: 'error',
                          showConfirmButton: true,
                          confirmButtonText: '确认',
                        },
                        function () {
                          //														parent.rmbtrip.rmbtripList.doQuery();
                        }
                      );
                    }
                  }
                },
                // 异常
                error: function (data) {
                  // 失败
                  sweetAlert(
                    {
                      title: '系统提示',
                      text: '失败，刷新后重试。',
                      type: 'error',
                      showConfirmButton: true,
                      confirmButtonText: '确认',
                    },
                    function () {
                      //												parent.rmbtrip.rmbtripList.doQuery();
                      //												jQuery("#closeButton").click();
                    }
                  );
                },
                beforeSend: function (xhr) {
                  xhr.setRequestHeader('__REQUEST_TYPE', 'AJAX_REQUEST');
                },
              });
            }
          }
        );
      } else {
        // 表单提交
        $('#execessiveFlag').val('false');
        $('#rmbtripForm').ajaxSubmit({
          url: WEB_CTX_PATH + '/tripMainAction.do?method=doSaveOrUpdate',
          dataType: 'json',
          method: 'POST',
          target: '#rmbtripForm',
          data: {
            actionType: actionType,
          },
          success: function (data) {
            if (data.result.success) {
              // 成功
              sweetAlert(
                {
                  title: '系统提示',
                  text: '操作成功',
                  type: 'success',
                  showConfirmButton: true,
                  confirmButtonText: '确认',
                },
                function () {
                  parent.rmbtrip.rmbtripList.doQuery();
                  if ($('#saveAndStart').val() == 'saveAndStart') {
                    // 保存并提交按钮时，完成后关闭画面。
                    jQuery('#closeButton').click();
                  } else if (actionType == 'add') {
                    // 新建页面的 保存按钮时，不关闭画面
                    jQuery('#billUid').val(data.billUid);
                    jQuery('#billState').val(data.billNo);
                    jQuery('#billNo').val(data.billNo);
                    jQuery('#actionType').val('edit');
                  }
                }
              );
            } else {
              if (data.result.msg == '') {
                // 失败
                sweetAlert(
                  {
                    title: '系统提示',
                    text: '失败，出差申请单已存在。',
                    type: 'error',
                    showConfirmButton: true,
                    confirmButtonText: '确认',
                  },
                  function () {
                    //											parent.rmbtrip.rmbtripList.doQuery();
                    //											jQuery("#closeButton").click();
                  }
                );
              } else {
                // 失败
                sweetAlert(
                  {
                    title: '系统提示',
                    text: data.result.msg,
                    type: 'error',
                    showConfirmButton: true,
                    confirmButtonText: '确认',
                  },
                  function () {
                    //											parent.rmbtrip.rmbtripList.doQuery();
                  }
                );
              }
            }
          },
          // 异常
          error: function (data) {
            // 失败
            sweetAlert(
              {
                title: '系统提示',
                text: '失败，刷新后重试。',
                type: 'error',
                showConfirmButton: true,
                confirmButtonText: '确认',
              },
              function () {
                //									parent.rmbtrip.rmbtripList.doQuery();
                //									jQuery("#closeButton").click();
              }
            );
          },
          beforeSend: function (xhr) {
            xhr.setRequestHeader('__REQUEST_TYPE', 'AJAX_REQUEST');
          },
        });
      }
    },
    saveAndStart: function () {
      //设置保存并启动工作状态
      $('#saveAndStart').val('saveAndStart');
      //保存并启动工作流
      rmbtrip.rmbtripEdit.saveOrUpdate();
    },
    /*
     * 按钮关闭
     */
    doClose: function () {
      jQuery().closeDlg(parent.layer);
    },
    /*
     * 陪同出差
     */
    goAccompany: function () {
      ldaccompany();
    },
    hideAccompany: function () {
      //			$("#accompany").attr("checked",false);
      //			$("#accompany").attr("disabled",true);
      //			$("#accompany").val("0");
      //			$("#accompany").hide();
      //			$("#accompany_label").hide();
    },
    showAccompany: function () {
      //平行化四家、资管和刀郎没有陪同出差
      //			if ($('#upOrgId').val() != JT_companyId
      //					&& $('#upOrgId').val() != KD_companyId
      //					&& $('#upOrgId').val() != KK_companyId
      //					&& $('#upOrgId').val() != KC_companyId
      //					&& $('#upOrgId').val() != ZG_companyId
      //					&& $('#upOrgId').val() != DL_companyId
      //					&& $('#upOrgId').val() != WY_companyId) {
      //				$("#accompany").removeAttr("disabled");
      //				$("#accompany").show();
      //				$("#accompany_label").show();
      //			}
    },
    //是否计划外check
    goUsePlanFlag: function () {
      if ($('#usePlanFlag').is(':checked')) {
        $('#usePlanFlag').val('1');
      } else {
        $('#usePlanFlag').val('0');
      }
      rmbtrip.rmbtripEdit.userPlanCheck();
    },
    userPlanCheck: function () {
      if ($('#usePlanFlag').val() == '1') {
        $('#planCheckAmount').val('0');
        $('#planCheckAmountState').val('计划外');
        $('#planCheckAmountState').attr(
          'style',
          'background-color:#FF6347;color:black;font-weight:900'
        );
      } else {
        //计划可用金额改变时，计划内外改变
        rmbtrip.rmbtripEdit.isPlanInner();
        rmbtrip.rmbtripEdit.planAmount(true);
      }
    },
    goExecutive: function () {
      if ($('#executive').is(':checked')) {
        $('#executive').val('1');

        jQuery('#applicantBillCd').val('');
        $('#trip_request_sign').hide();
        $('#chooseApply').hide();
        $('#viewApply').hide();
        $('#applicatDiv').removeAttr('class');

        rmbtrip.rmbtripEdit.hideAccompany();
      } else {
        $('#executive').val('0');

        $('#trip_request_sign').show();
        $('#chooseApply').show();
        var applicantBillCd = jQuery('#applicantBillCd').val();
        if (applicantBillCd != null && applicantBillCd != '') {
          $('#viewApply').show();
        }
        $('#applicatDiv').attr('class', 'input-group');

        rmbtrip.rmbtripEdit.showAccompany();
      }

      //重设补助标准
      //住宿页
      var idx = 0;
      $('#hotel')
        .find("input[name='tab3_startTime']")
        .each(function () {
          var startTimeVal = $(this).val();
          var endTimeVal = $($('#hotel').find("input[name='tab3_endTime']")[idx]).val();

          var cityCodeVal;
          var cityList = $($(this).parents('tr').children()[5]).find('span > .select-item');
          if (cityList.length > 0) {
            cityCodeVal = $(cityList[cityList.length - 1]).attr('data-code');
          }
          if (startTimeVal != '' && endTimeVal != '' && cityCodeVal != '') {
            $.ajax({
              url: WEB_CTX_PATH + '/companystandardAction.do?method=queryAmount',
              data: {
                upOrgId: $('#upOrgId').val(),
                standardType: 2,
                startDate: startTimeVal,
                endDate: endTimeVal,
                userId: $('#applicantUid').val(),
                excoloum1: cityCodeVal,
                executive: $('#executive').val(),
                accompany: $('#accompany').val(),
              },
              type: 'POST',
              dataType: 'json',
              async: false,
              success: function (data) {
                if (data != null && data.result != null && data.result != '') {
                  //设置标准
                  var standardVal = data.result;
                  $($('#hotel').find("input[name='tab3_standardValue']")[idx]).val(
                    fee.Common.formatAmount(standardVal)
                  );
                  $($('#hotel').find("input[name='tab3_standard']")[idx]).val(
                    fee.Common.formatAmount(standardVal)
                  );

                  //如果是实报实销，则直接显示 实报实销
                  if (
                    standardVal == '9999.00' ||
                    standardVal == '9999' ||
                    standardVal == '9,999' ||
                    standardVal == '9,999.00'
                  ) {
                    $($('#hotel').find("input[name='tab3_standard']")[idx]).val('实报实销');
                  }
                }
              }, // 异常
              error: function (data) {
                sweetAlert({
                  title: '获取住宿标准错误',
                  type: 'error',
                  showConfirmButton: true,
                  confirmButtonText: '确认',
                });
              },
            });
          }

          idx++;
        });

      //补助页
      idx = 0;
      $('#subsidy')
        .find("input[name='tab4_startTime']")
        .each(function () {
          var startTimeVal = $(this).val();
          var endTimeVal = $($('#subsidy').find("input[name='tab4_endTime']")[idx]).val();
          var cityCodeVal;
          var cityList = $($(this).parents('tr').children()[5]).find('span > .select-item');
          if (cityList.length > 0) {
            cityCodeVal = $(cityList[cityList.length - 1]).attr('data-code');
          }
          var standarTypeVal = $($('#subsidy').find("select[name='tab4_subsidyType']")[idx]).val();
          if (
            startTimeVal != '' &&
            endTimeVal != '' &&
            cityCodeVal != '' &&
            (standarTypeVal == '1' || standarTypeVal == '3' || standarTypeVal == '5')
          ) {
            $.ajax({
              url: WEB_CTX_PATH + '/companystandardAction.do?method=queryAmount',
              data: {
                upOrgId: $('#upOrgId').val(),
                standardType: standarTypeVal,
                startDate: startTimeVal,
                endDate: endTimeVal,
                userId: $('#applicantUid').val(),
                excoloum1: cityCodeVal,
                executive: $('#executive').val(),
                accompany: $('#accompany').val(),
              },
              type: 'POST',
              dataType: 'json',
              async: false,
              success: function (data) {
                if (data != null && data.result != null && data.result != '') {
                  //设置标准
                  var standardVal = data.result;
                  $($('#subsidy').find("input[name='tab4_standardValue']")[idx]).val(
                    fee.Common.formatAmount(standardVal)
                  );

                  //如果是实报实销，则直接显示 实报实销
                  if (
                    standardVal == '9999.00' ||
                    standardVal == '9999' ||
                    standardVal == '9,999' ||
                    standardVal == '9,999.00'
                  ) {
                    $($('#subsidy').find("input[name='tab4_standardValue']")[idx]).val('实报实销');
                  }
                }
              }, // 异常
              error: function (data) {
                sweetAlert({
                  title: '获取补助标准错误',
                  type: 'error',
                  showConfirmButton: true,
                  confirmButtonText: '确认',
                });
              },
            });
          }

          idx++;
        });
    },

    // 出差申请单选择，弹出pop
    chooseApply: function () {
      url =
        WEB_CTX_PATH +
        '/ebc/rmbtrip/rmbtrip/applyList.jsp?projectUid=' +
        $('#projectUid').val() +
        '&applicantUid=' +
        $('#applicantUid').val();
      jQuery().openDlg({
        // parent: window.top,//此行调遮罩
        height: 700, // 此行调高度
        width: 1000,
        url: url,
        title: '出差申请单选择',
      });
    },
    // 选择收款人，弹出pop
    chooseStaff: function () {
      url = WEB_CTX_PATH + '/ebc/rmbtrip/rmbtrip/staffList.jsp';
      jQuery().openDlg({
        height: 700, // 此行调高度
        width: 1000,
        url: url,
        title: '收款人选择',
      });
    },
    viewApply: function () {
      var applicantBillCd = jQuery('#applicantBillCd').val();
      if (applicantBillCd != null && applicantBillCd != '') {
        doAppStatusFlow('差旅申请单详情', applicantBillCd, 'HR02001');
      }
    },
  };
})();

// 城市间交通费
rmbtrip.citytraffic = (function () {
  var i; // 行变量
  var vehicleArr; // 交通工具数组
  var jsonArray = new Array(); //回显数据
  return {
    initData: function (index, value) {
      jsonArray[index] = value;
    },
    loadData: function () {
      jQuery('#citytraffic').jqGrid('clearGridData');
      for (k = 0; k < jsonArray.length; k++) {
        rmbtrip.citytraffic.addGradRow(jsonArray[k]);
      }
      // 初始化地区控件
      $('[data-toggle="city-picker"]').citypicker({ companyId: $('#upOrgId').val() });
    },
    init: function () {
      // 未初始化设置1
      i = $('#citytraffic').find('tr').length;
      // 加载支付方式下拉列表
      ajaxFormRequest(
        WEB_CTX_PATH +
          '/codeAction.do?method=getSelectOptions&element2CodeType=' +
          encodeURI(encodeURI("{'vehicle':'trafficTool'}")),
        function (returnData) {
          vehicleArr = returnData.result.vehicle;
          // 初始化回显的下拉框
          rmbtrip.citytraffic.selected();
        },
        function (state) {},
        'rmbtripForm',
        true,
        ' '
      );
      // 初始化表格
      jQuery('#citytraffic').jqGrid({
        url: null,
        regional: 'cn',
        datatype: 'json',
        busiKey: ['id'],
        colNames: ['出发时间', '到达时间', '出发地', '到达地', '交通工具', '价税合计'],
        operatorKey: 'act',
        colModel: [
          {
            name: 'tab1_startTime',
            index: 'tab1_startTime',
            formatter: function (value, grid, rows, state) {
              return (
                "<center><input type='text' style='text-align:center;color: #333;width:100%;height:30px;border: 1px solid #ccc;border-radius: 4px;color: #555;background-color: #eee;' class='form_datetime' name='tab1_startTime' readonly placeholder='出发时间' value='" +
                (value != undefined ? value : '') +
                "'/></center>"
              );
            },
            align: 'center',
            sortable: false,
            //							resizable: false
          },
          {
            name: 'tab1_endTime',
            index: 'tab1_endTime',
            formatter: function (value, grid, rows, state) {
              return (
                "<center><input type='text' style='text-align:center;color: #333;width:100%;height:30px;border: 1px solid #ccc;border-radius: 4px;color: #555;background-color: #eee;' class='form_time' name='tab1_endTime' readonly placeholder='到达时间' value='" +
                (value != undefined ? value : '') +
                "'/></center>"
              );
            },
            align: 'center',
            sortable: false,
            //							resizable: false
          },
          {
            name: 'tab1_startAddressName',
            index: 'tab1_startAddressName',
            formatter: function (value, grid, rows, state) {
              return (
                "<div id='selectCity' style='position: relative;'><input type='text' style='text-align:center;width:auto;' class='form-control' id='tab1_startAddressName_" +
                grid.rowId +
                "' name='tab1_startAddressName' readonly placeholder='出发地' data-toggle='city-picker' value='" +
                (value != undefined ? value.name : '') +
                "'/><input type='hidden' id='tab1_startAddressName_" +
                grid.rowId +
                "_value' name='tab1_startAddressId' value='" +
                (value != undefined ? value.code : '') +
                "'/><span id='tab1_startAddressName_" +
                grid.rowId +
                "_span'/></div>"
              );
            },
            align: 'center',
            sortable: false,
            //							resizable: false
          },
          {
            name: 'tab1_endAddressName',
            index: 'tab1_endAddressName',
            formatter: function (value, grid, rows, state) {
              return (
                "<div id='selectCity' style='position: relative;'><input type='text' style='text-align:center;width:auto;' class='form-control' id='tab1_endAddressName_" +
                grid.rowId +
                "' name='tab1_endAddressName' readonly placeholder='结束地' data-toggle='city-picker' value='" +
                (value != undefined ? value.name : '') +
                "'/><input type='hidden' id='tab1_endAddressName_" +
                grid.rowId +
                "_value' name='tab1_endAddressId' value='" +
                (value != undefined ? value.code : '') +
                "'/><span id='tab1_endAddressName_" +
                grid.rowId +
                "_span'/></div>"
              );
            },
            align: 'center',
            sortable: false,
            //							resizable: false
          },
          {
            name: 'tab1_vehicle',
            index: 'tab1_vehicle',
            formatter: function (value, grid, rows, state) {
              var option = '';
              // 填充交通工具
              for (j = 0; j < vehicleArr.length; j++) {
                if (value != vehicleArr[j].code) {
                  option +=
                    "<option value='" +
                    vehicleArr[j].code +
                    "'>" +
                    vehicleArr[j].name +
                    '</option>';
                } else {
                  option +=
                    "<option value='" +
                    vehicleArr[j].code +
                    "' selected='selected'>" +
                    vehicleArr[j].name +
                    '</option>';
                }
              }

              return (
                "<center><select type='text' class='form-control citytraffic-select' id='tab1_vehicle_" +
                grid.rowId +
                "' name='tab1_vehicle'>" +
                option +
                '</select></center>'
              );
            },
            align: 'center',
            sortable: false,
            //							resizable: false
          },
          {
            name: 'tab1_amount',
            index: 'tab1_amount',
            formatter: function (value, grid, rows, state) {
              return (
                "<center><input type='text' style='text-align:center;' class='form-control' name='tab1_amount' placeholder='价税合计' onfocus='this.value=fee.Common.clearFormatAmount(this.value)' onblur='rmbtrip.citytraffic.validateNumber(this);' onkeyup='this.value=this.value.replace(/[^0-9.]/g,\"\")' maxlength='15' value='" +
                (value != undefined ? formatAmount(value) : '') +
                "'/></center>"
              );
            },
            align: 'center',
            sortable: false,
            //							resizable: false
          },
        ],
        autowidth: true,
        height: '100%',
        rownumbers: true, // 显示行号
        multiselect: true, // 多选（表格会多出一列选择框）
        mtype: 'post',
        viewrecords: false,
        pagination: false,
        expandAll: false,
        pager: '#listPager1',
        pgbuttons: false,
        shrinkToFit: true,
        loadComplete: function (e) {},
        loadError: function (e, e1, e2) {
          jQuery('#citytraffic').footerData('set', {});
          $($('.footrow').find('[aria-describedby="citytraffic_tab1_vehicle"]')[0]).html('合计');

          jQuery('#citytraffic').jqGrid('setGridWidth', jQuery('.nav.nav-tabs').width(), true);
          //回显数据
          rmbtrip.citytraffic.loadData();
        },
        caption: '',
        autoScroll: true,
        autowidth: false,
        footerrow: true,
        gridComplete: function () {
          jQuery('#citytraffic').footerData('set', {});
          $($('.footrow').find('[aria-describedby="citytraffic_tab1_vehicle"]')[0]).html('合计');
        },
      });
      // 隐藏其它控件
      jQuery('#citytraffic').jqGrid('navGrid', '#listPager1', {
        edit: false,
        add: false,
        del: false,
        search: false,
        exportExcel: false,
        refresh: true,
        position: 'left',
      });
      $('#listPager1_center').hide();
      $('#refresh_citytraffic').hide();
      // 初始化增加和删除行按钮
      rmbtrip.citytraffic.createButton('#citytraffic', '#listPager1');

      jQuery(window).on('resize.jqGrid', function () {
        jQuery('#citytraffic').jqGrid('setGridWidth', $('.nav.nav-tabs').width());
      });
      jQuery(window).triggerHandler('resize.jqGrid');
    },
    createButton: function (dataId, pagerId) {
      // 初始化增加和删除行按钮
      // 自定义导航栏删除按钮
      $(dataId)
        .jqGrid('navGrid', pagerId)
        .jqGrid('navButtonAdd', pagerId, {
          caption: '<span class="glyphicon glyphicon-minus"></span>',
          position: 'first',
          buttonicon: 'none',
          onClickButton: function () {
            // 获取选中的数据IDs
            var ids = $(dataId).jqGrid('getGridParam', 'selarrrow');
            if (ids.length == 0) {
              swal({
                title: '请选择要删除的数据!',
                type: 'warning',
                confirmButtonText: '确定',
              });
              return false;
            }
            rmbtrip.citytraffic.deleteGradRow(dataId);
          },
        });

      // 自定义导航栏添加按钮
      $(dataId)
        .jqGrid('navGrid', pagerId)
        .jqGrid('navButtonAdd', pagerId, {
          caption: '<span class="glyphicon glyphicon-plus"></span>',
          position: 'first',
          buttonicon: 'none',
          onClickButton: function () {
            rmbtrip.citytraffic.addGradRow(undefined);
          },
        });
    },
    addGradRow: function (json) {
      jQuery('#citytraffic').jqGrid('addRowData', i, json != undefined ? json : {});
      // 初始化日期控件
      $.initDataPlugin();
      // 初始化地区控件
      $('[data-toggle="city-picker"]').citypicker({ companyId: $('#upOrgId').val() });
      // 增加金额单据统计
      sumBillCount();
      // 行号累加
      i++;
    },
    // 删除行
    deleteGradRow: function (id) {
      var selectedRowIds = jQuery(id).jqGrid('getGridParam', 'selarrrow');
      var len = selectedRowIds.length;
      if (len > 0) {
        sweetAlert(
          {
            title: '删除',
            text: '确认删除吗?',
            type: 'warning',
            showConfirmButton: true,
            showCancelButton: true,
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            closeOnConfirm: true,
          },
          function (isConfirm) {
            // 是否确认删除
            if (!isConfirm) {
              // 取消
              return;
            } else {
              for (var i = 0; i < len; i++) {
                $(id).jqGrid('delRowData', selectedRowIds[0]);
              }
              // 增加金额单据统计
              sumBillCount();
            }
          }
        );
      }
    },
    selected: function () {
      // 加载下拉列表和选中项
      $('.citytraffic-select').each(function () {
        var selected = $(this).attr('check');
        for (j = 0; j < vehicleArr.length; j++) {
          if (selected != vehicleArr[j].code) {
            $(this).append(
              "<option value='" + vehicleArr[j].code + "'>" + vehicleArr[j].name + '</option>'
            );
          } else {
            $(this).append(
              "<option selected='selected' value='" +
                vehicleArr[j].code +
                "'>" +
                vehicleArr[j].name +
                '</option>'
            );
          }
        }
      });
    },
    validateNull: function () {
      var result = true;
      // 校验必填项
      $('#citytraffic')
        .find('input')
        .each(function () {
          if ($(this).attr('type') != 'button') {
            if ($(this).val() == '' || $(this).val() == undefined) {
              $(this).css('border-color', 'yellow');
              // 提示必填项
              if ($(this).attr('placeholder') != undefined) {
                // 未选中数据
                sweetAlert({
                  title: '录入提示',
                  text: '[' + $(this).attr('placeholder') + ']为必填项',
                  type: 'error',
                  showConfirmButton: true,
                  confirmButtonText: '确认',
                });
                result = false;
                return;
              }
            } else {
              $(this).css('border-color', '#cccccc');
            }
          }
        });
      //			// 判断城市间交通费
      //			if($("#citytraffic").find("tr").length<=1){
      //				sweetAlert({
      //					title: "录入提示",
      //					text:"城市间交通费不能为空",
      //					type: 'error',
      //					showConfirmButton: true,
      //					confirmButtonText:"确认",
      //				});
      //				return false;
      //			}
      // 校验重复
      if (rmbtrip.citytraffic.validateDetails() == false) {
        return false;
      }
      return result;
    },
    validateDetails: function () {
      //			// 验证重复区划
      //			// 开始日期
      //			var startTimes=$("#citytraffic .form_datetime");
      //			// 结束日期
      //			var endTimes=$("#citytraffic .form_time");
      //			for(i=0;i<startTimes.length;i++){
      //				for(j=0;j<startTimes.length&&i!=j;j++){
      //					// 判断是否属于某一个时间段
      //					if(startTimes[i].value>=startTimes[j].value&&startTimes[i].value<=endTimes[j].value||endTimes[i].value>=startTimes[j].value&&endTimes[i].value<=endTimes[j].value){
      //						sweetAlert({
      //							title: "录入提示",
      //							text:"城市间交通费时间段重叠",
      //							type: 'error',
      //							showConfirmButton: true,
      //							confirmButtonText:"确认",
      //						});
      //						return false;
      //					}else{
      //						continue;
      //					}
      //				}
      //			}
      return true;
    },
    validateNumber: function (e) {
      var re = /^\d+(?=\.{0,1}\d+$|$)/;
      if (e.value != '') {
        if (!re.test(e.value)) {
          // 未选中数据
          sweetAlert({
            title: '录入提示',
            text: '请输入正确的数字',
            type: 'error',
            showConfirmButton: true,
            confirmButtonText: '确认',
          });
          e.value = '';
          e.focus();
          return;
        } else if (parseFloat(e.value) == 0) {
          //报销金额不能为0
          sweetAlert({
            title: '录入提示',
            text: '报销金额不能为0',
            type: 'error',
            showConfirmButton: true,
            confirmButtonText: '确认',
          });
          e.value = '';
          e.focus();
          return;
        } else {
          // 格式化两位小数
          e.value = fee.Common.formatAmount(e.value);
        }
      }
      sumBillCount();
    },
  };
})();

// 市内交通费
rmbtrip.cityinside = (function () {
  var i; // 行变量
  var vehicleArr; // 交通工具数组
  var jsonArray = new Array(); //回显数据
  return {
    initData: function (index, value) {
      jsonArray[index] = value;
    },
    loadData: function () {
      for (k = 0; k < jsonArray.length; k++) {
        rmbtrip.cityinside.addGradRow(jsonArray[k]);
      }
      // 初始化地区控件
      $('[data-toggle="city-picker"]').citypicker({ companyId: $('#upOrgId').val() });
    },
    init: function () {
      // 未初始化设置1
      i = $('#cityinside').find('tr').length;
      // 加载支付方式下拉列表
      ajaxFormRequest(
        WEB_CTX_PATH +
          '/codeAction.do?method=getSelectOptions&element2CodeType=' +
          encodeURI(encodeURI("{'vehicle':'cityTrafficTool'}")),
        function (returnData) {
          vehicleArr = returnData.result.vehicle;
          // 初始化回显的下拉框
          rmbtrip.cityinside.selected();
        },
        function (state) {},
        'rmbtripForm',
        true,
        ' '
      );

      // 初始化表格
      jQuery('#cityinside').jqGrid({
        url: null,
        regional: 'cn',
        datatype: 'json',
        busiKey: ['id'],
        colNames: ['出发时间', '到达时间', '出发地', '到达地', '交通工具', '价税合计'],
        operatorKey: 'act',
        colModel: [
          {
            name: 'tab2_startTime',
            index: 'tab2_startTime',
            formatter: function (value, grid, rows, state) {
              return (
                "<center><input type='text' style='text-align:center;color: #333;width:100%;height:30px;border: 1px solid #ccc;border-radius: 4px;color: #555;background-color: #eee;' class='form_datetime' name='tab2_startTime' readonly placeholder='出发时间' value='" +
                (value != undefined ? value : '') +
                "'/></center>"
              );
            },
            align: 'center',
            sortable: false,
            //							resizable: false
          },
          {
            name: 'tab2_endTime',
            index: 'tab2_endTime',
            formatter: function (value, grid, rows, state) {
              return (
                "<center><input type='text' style='text-align:center;color: #333;width:100%;height:30px;border: 1px solid #ccc;border-radius: 4px;color: #555;background-color: #eee;' class='form_time' name='tab2_endTime' readonly placeholder='到达时间' value='" +
                (value != undefined ? value : '') +
                "'/></center>"
              );
            },
            align: 'center',
            sortable: false,
            //							resizable: false
          },
          {
            name: 'tab2_startAddressName',
            index: 'tab2_startAddressName',
            formatter: function (value, grid, rows, state) {
              return (
                "<div style='position: relative;'><input type='text' maxlength='50' style='text-align:center;width:100%' class='form-control' id='tab2_startAddressName_" +
                grid.rowId +
                "' name='tab2_startAddressName' placeholder='出发地' value='" +
                (value != undefined ? value.name : '') +
                "' /><input type='hidden' id='tab2_startAddressName_" +
                grid.rowId +
                "_value' name='tab2_startAddressId' value='" +
                (value != undefined ? value.code : '') +
                "'/></div>"
              );
            },
            align: 'center',
            sortable: false,
            //							resizable: false
          },
          {
            name: 'tab2_endAddressName',
            index: 'tab2_endAddressName',
            formatter: function (value, grid, rows, state) {
              return (
                "<div style='position: relative;'><input type='text' maxlength='50' style='text-align:center;width:100%' class='form-control' id='tab2_endAddressName_" +
                grid.rowId +
                "' name='tab2_endAddressName' placeholder='结束地' value='" +
                (value != undefined ? value.name : '') +
                "'/><input type='hidden' id='tab2_endAddressName_" +
                grid.rowId +
                "_value' name='tab2_endAddressId' value='" +
                (value != undefined ? value.code : '') +
                "'/></div>"
              );
            },
            align: 'center',
            sortable: false,
            //							resizable: false
          },
          {
            name: 'tab2_vehicle',
            index: 'tab2_vehicle',
            formatter: function (value, grid, rows, state) {
              var option = '';
              // 填充交通工具
              for (j = 0; j < vehicleArr.length; j++) {
                if (value != vehicleArr[j].code) {
                  option +=
                    "<option value='" +
                    vehicleArr[j].code +
                    "'>" +
                    vehicleArr[j].name +
                    '</option>';
                } else {
                  option +=
                    "<option value='" +
                    vehicleArr[j].code +
                    "' selected='selected'>" +
                    vehicleArr[j].name +
                    '</option>';
                }
              }

              return (
                "<center><select type='text' class='form-control citytraffic-select' id='tab2_vehicle_" +
                grid.rowId +
                "' name='tab2_vehicle'>" +
                option +
                '</select></center>'
              );
            },
            align: 'center',
            sortable: false,
            //							resizable: false
          },
          {
            name: 'tab2_amount',
            index: 'tab2_amount',
            formatter: function (value, grid, rows, state) {
              return (
                "<center><input type='text' style='text-align:center;' class='form-control' name='tab2_amount' placeholder='价税合计' onfocus='this.value=fee.Common.clearFormatAmount(this.value)' onblur='rmbtrip.citytraffic.validateNumber(this)' onkeyup='this.value=this.value.replace(/[^0-9.]/g,\"\")' maxlength='15' value='" +
                (value != undefined ? formatAmount(value) : '') +
                "'/></center>"
              );
            },
            align: 'center',
            sortable: false,
            //							resizable: false
          },
        ],
        autowidth: true,
        height: '100%',
        rownumbers: true, // 显示行号
        multiselect: true, // 多选（表格会多出一列选择框）
        mtype: 'post',
        viewrecords: false,
        pagination: false,
        expandAll: false,
        pager: '#listPager2',
        pgbuttons: false,
        shrinkToFit: true,
        loadComplete: function (e) {},
        loadError: function (e, e1, e2) {
          jQuery('#cityinside').footerData('set', {});
          $($('.footrow').find('[aria-describedby="cityinside_tab2_vehicle"]')[0]).html('合计');

          jQuery('#cityinside').jqGrid('setGridWidth', jQuery('.nav.nav-tabs').width(), true);
          //回显数据
          rmbtrip.cityinside.loadData();
        },
        caption: '',
        footerrow: true,
        gridComplete: function () {
          jQuery('#cityinside').footerData('set', {});
          $($('.footrow').find('[aria-describedby="cityinside_tab2_vehicle"]')[0]).html('合计');
        },
      });
      // 隐藏其它控件
      jQuery('#cityinside').jqGrid('navGrid', '#listPager2', {
        edit: false,
        add: false,
        del: false,
        search: false,
        exportExcel: false,
        refresh: true,
        position: 'left',
      });
      $('#listPager2_center').hide();
      $('#refresh_cityinside').hide();
      // 初始化增加和删除行按钮
      rmbtrip.cityinside.createButton('#cityinside', '#listPager2');

      jQuery(window).on('resize.jqGrid', function () {
        jQuery('#cityinside').jqGrid('setGridWidth', $('.nav.nav-tabs').width());
      });
      jQuery(window).triggerHandler('resize.jqGrid');
    },
    createButton: function (dataId, pagerId) {
      // 初始化增加和删除行按钮
      // 自定义导航栏删除按钮
      $(dataId)
        .jqGrid('navGrid', pagerId)
        .jqGrid('navButtonAdd', pagerId, {
          caption: '<span class="glyphicon glyphicon-minus"></span>',
          position: 'first',
          buttonicon: 'none',
          onClickButton: function () {
            // 获取选中的数据IDs
            var ids = $(dataId).jqGrid('getGridParam', 'selarrrow');
            if (ids.length == 0) {
              swal({
                title: '请选择要删除的数据!',
                type: 'warning',
                confirmButtonText: '确定',
              });
              return false;
            }
            rmbtrip.cityinside.deleteGradRow(dataId);
          },
        });

      // 自定义导航栏添加按钮
      $(dataId)
        .jqGrid('navGrid', pagerId)
        .jqGrid('navButtonAdd', pagerId, {
          caption: '<span class="glyphicon glyphicon-plus"></span>',
          position: 'first',
          buttonicon: 'none',
          onClickButton: function () {
            rmbtrip.cityinside.addGradRow(undefined);
          },
        });
    },
    addGradRow: function (json) {
      jQuery('#cityinside').jqGrid('addRowData', i, json != undefined ? json : {});
      // 初始化日期控件
      $.initDataPlugin();
      // 初始化地区控件
      $('[data-toggle="city-picker"]').citypicker({ companyId: $('#upOrgId').val() });
      // 增加金额单据统计
      sumBillCount();
      // 行号累加
      i++;
    },
    // 删除行
    deleteGradRow: function (id) {
      var selectedRowIds = jQuery(id).jqGrid('getGridParam', 'selarrrow');
      var len = selectedRowIds.length;
      if (len > 0) {
        sweetAlert(
          {
            title: '删除',
            text: '确认删除吗?',
            type: 'warning',
            showConfirmButton: true,
            showCancelButton: true,
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            closeOnConfirm: true,
          },
          function (isConfirm) {
            // 是否确认删除
            if (!isConfirm) {
              // 取消
              return;
            } else {
              for (var i = 0; i < len; i++) {
                $(id).jqGrid('delRowData', selectedRowIds[0]);
              }
              // 增加金额单据统计
              sumBillCount();
            }
          }
        );
      }
    },
    selected: function () {
      // 加载下拉列表和选中项
      $('.cityinside-select').each(function () {
        var selected = $(this).attr('check');
        for (j = 0; j < vehicleArr.length; j++) {
          if (selected != vehicleArr[j].code) {
            $(this).append(
              "<option value='" + vehicleArr[j].code + "'>" + vehicleArr[j].name + '</option>'
            );
          } else {
            $(this).append(
              "<option selected='selected' value='" +
                vehicleArr[j].code +
                "'>" +
                vehicleArr[j].name +
                '</option>'
            );
          }
        }
      });
    },
    validateNull: function () {
      var result = true;
      // 校验必填项
      $('#cityinside')
        .find('input')
        .each(function () {
          if ($(this).attr('type') != 'button') {
            if ($(this).val() == '' || $(this).val() == undefined) {
              $(this).css('border-color', 'yellow');
              // 提示必填项
              if ($(this).attr('placeholder') != undefined) {
                // 未选中数据
                sweetAlert({
                  title: '录入提示',
                  text: '[' + $(this).attr('placeholder') + ']为必填项',
                  type: 'error',
                  showConfirmButton: true,
                  confirmButtonText: '确认',
                });
                result = false;
                return;
              }
            } else {
              $(this).css('border-color', '#cccccc');
            }
          }
        });

      // 校验重复
      if (rmbtrip.cityinside.validateDetails() == false) {
        return false;
      }
      return result;
    },
    validateNumber: function (e) {
      var re = /^\d+(?=\.{0,1}\d+$|$)/;
      if (e.value != '') {
        if (!re.test(e.value)) {
          // 未选中数据
          sweetAlert({
            title: '录入提示',
            text: '请输入正确的数字',
            type: 'error',
            showConfirmButton: true,
            confirmButtonText: '确认',
          });
          e.value = '';
          e.focus();
          return;
        } else if (parseFloat(e.value) == 0) {
          //报销金额不能为0
          sweetAlert({
            title: '录入提示',
            text: '报销金额不能为0',
            type: 'error',
            showConfirmButton: true,
            confirmButtonText: '确认',
          });
          e.value = '';
          e.focus();
          return;
        } else {
          // 格式化两位小数
          e.value = fee.Common.formatAmount(e.value);
        }
      }
      sumBillCount();
    },
    validateDetails: function () {
      //			// 城市间交通费没填时，不校验时间段
      //			if($("#citytraffic").find("tr").length<=1){
      //				return true;
      //			}
      //			// 验证重复区划
      //			// 开始日期
      //			var startTimes=$("#cityinside .form_datetime");
      //			// 结束日期
      //			var endTimes=$("#cityinside .form_time");
      //			// 验证是否在出差申请单中
      //			// 开始日期
      //			var cityStartTimes=$("#citytraffic .form_datetime");
      //			// 结束日期
      //			var cityEndTimes=$("#citytraffic .form_time");
      //			//验证时间是否在城市间
      //			var startTimeState;
      //			var endTimeState;
      //			for(i=0;i<startTimes.length;i++){
      //				startTimeState=false;
      //				endTimeState=false;
      //				for(j=0;j<cityStartTimes.length;j++){
      //					// 判断是否属于某一个时间段
      //					if(startTimes[i].value>=cityStartTimes[j].value){
      //						startTimeState=true;
      //					}
      //					if(endTimes[i].value<=cityEndTimes[j].value){
      //						endTimeState=true;
      //					}
      //				}
      //				//判断最小开始和最大开始日期
      //				if(!startTimeState || !endTimeState){
      //					sweetAlert({
      //						title: "录入提示",
      //						text:"市内交通费时间不在城市间交通费时间之内",
      //						type: 'error',
      //						showConfirmButton: true,
      //						confirmButtonText:"确认",
      //					});
      //					return false;
      //				}
      //			}
      return true;
    },
  };
})();

// 住宿费
rmbtrip.hotel = (function () {
  var i; // 行变量
  var vehicleArr; // 交通工具数组
  var taxRateArr; // 税率数组
  var jsonArray = new Array(); //回显数据
  var tab3_flag = 0; //对 金额 限定
  return {
    initData: function (index, value) {
      jsonArray[index] = value;
    },
    loadData: function () {
      jQuery('#hotel').jqGrid('clearGridData');
      for (k = 0; k < jsonArray.length; k++) {
        rmbtrip.hotel.addGradRow(jsonArray[k]);
      }
      //加载城市控件
      $('[data-toggle="city-picker"]').citypicker({ companyId: $('#upOrgId').val() });
    },
    init: function () {
      // 初始化日期控件
      rmbtrip.hotel.initDate();
      //			ldaccompany();
      // 未初始化设置1
      i = $('#hotel').find('tr').length;
      // 加载出差类别下拉列表
      ajaxFormRequest(
        WEB_CTX_PATH +
          '/codeAction.do?method=getSelectOptions&element2CodeType=' +
          encodeURI(encodeURI("{'vehicle':'tripType'}")),
        function (returnData) {
          vehicleArr = returnData.result.vehicle;
          // 初始化回显的下拉框
          rmbtrip.hotel.selected();
        },
        function (state) {},
        'rmbtripForm',
        true,
        ' '
      );
      // 加载税率式下拉列表
      ajaxFormRequest(
        WEB_CTX_PATH +
          '/codeAction.do?method=getSelectOptions&element2CodeType=' +
          encodeURI(encodeURI("{'taxRate':'taxRate'}")),
        function (returnData) {
          taxRateArr = returnData.result.taxRate;
          // 初始化回显的下拉框
          //						rmbtrip.citytraffic.selected();
        },
        function (state) {},
        'rmbtripForm',
        true,
        ' '
      );

      // 初始化表格
      jQuery('#hotel').jqGrid({
        url: null,
        regional: 'cn',
        datatype: 'json',
        busiKey: ['id'],
        colNames: [
          '开始时间',
          '结束时间',
          '出差类别',
          '城市',
          '人数',
          '天数',
          '价税合计',
          '金额',
          '税率',
          '税额',
          '实际/人/天',
          '隐藏',
          '标准/人/天',
        ],
        operatorKey: 'act',
        colModel: [
          {
            name: 'tab3_startTime',
            index: 'tab3_startTime',
            formatter: function (value, grid, rows, state) {
              return (
                "<center><input type='text' style='text-align:center;color: #333;width:100%;height:30px;border: 1px solid #ccc;border-radius: 4px;color: #555;background-color: #eee;' class='hotel_datetime' name='tab3_startTime' readonly placeholder='开始时间' value='" +
                (value != undefined ? value : '') +
                "'/></center>"
              );
            },
            align: 'center',
            sortable: false,
            //							resizable: false
          },
          {
            name: 'tab3_endTime',
            index: 'tab3_endTime',
            formatter: function (value, grid, rows, state) {
              return (
                "<center><input type='text' style='text-align:center;color: #333;width:100%;height:30px;border: 1px solid #ccc;border-radius: 4px;color: #555;background-color: #eee;' class='hotel_time' name='tab3_endTime' readonly placeholder='结束时间' value='" +
                (value != undefined ? value : '') +
                "'/></center>"
              );
            },
            align: 'center',
            sortable: false,
            //							resizable: false
          },
          {
            name: 'tab3_traveType',
            index: 'tab3_traveType',
            formatter: function (value, grid, rows, state) {
              var option = '';
              // 填充交通工具
              for (j = 0; j < vehicleArr.length; j++) {
                if (value != vehicleArr[j].code) {
                  option +=
                    "<option value='" +
                    vehicleArr[j].code +
                    "'>" +
                    vehicleArr[j].name +
                    '</option>';
                } else {
                  option +=
                    "<option value='" +
                    vehicleArr[j].code +
                    "' selected='selected'>" +
                    vehicleArr[j].name +
                    '</option>';
                }
              }

              return (
                "<center><select type='text' class='form-control citytraffic-select' id='tab3_traveType_" +
                grid.rowId +
                "' name='tab3_traveType'>" +
                option +
                '</select></center>'
              );
            },
            align: 'center',
            sortable: false,
            hidden: true,
            //							resizable: false
          },
          {
            name: 'tab3_city',
            index: 'tab3_city',
            formatter: function (value, grid, rows, state) {
              return (
                "<div id='selectCity' style='position: relative;'><input type='text' style='text-align:center;width:130px' class='form-control' id='tab3_city_" +
                grid.rowId +
                "' name='tab3_city' readonly placeholder='城市' data-toggle='city-picker' value='" +
                (value != undefined ? value : '') +
                "'/><input type='hidden' id='tab3_city_" +
                grid.rowId +
                "_value' name='tab3_city_value'/><span id='tab3_city_" +
                grid.rowId +
                "_span'/></div>"
              );
            },
            align: 'center',
            sortable: false,
            //							resizable: false
          },
          {
            name: 'tab3_personCount',
            index: 'tab3_personCount',
            formatter: function (value, grid, rows, state) {
              return (
                "<center><input type='text' style='text-align:center;' class='form-control' id='tab3_personCount_" +
                grid.rowId +
                "' name='tab3_personCount' placeholder='人数' onblur='rmbtrip.hotel.changeActualDayNumber(this);' onkeyup='this.value=this.value.replace(/[^0-9]/g,\"\")' maxlength='15' value='" +
                (value != undefined ? value : '') +
                "'/></center>"
              );
            },
            align: 'center',
            sortable: false,
            //							resizable: false
          },
          {
            name: 'tab3_dayNumber',
            index: 'tab3_dayNumber',
            formatter: function (value, grid, rows, state) {
              return (
                "<center><input type='text' style='text-align:center;' class='form-control' id='tab3_dayNumber_" +
                grid.rowId +
                "' name='tab3_dayNumber' placeholder='天数' onblur='rmbtrip.hotel.changeDayNumber(this);rmbtrip.hotel.changeActualDayNumber(this);' onkeyup='this.value=this.value.replace(/[^0-9]/g,\"\")' maxlength='15' value='" +
                (value != undefined ? value : '') +
                "'/></center>"
              );
            },
            align: 'center',
            sortable: false,
            //							resizable: false
          },
          {
            name: 'tab3_amount',
            index: 'tab3_amount',
            formatter: function (value, grid, rows, state) {
              return (
                "<center><input type='text' style='text-align:center;' class='form-control' name='tab3_amount' placeholder='价税合计' onfocus='this.value=fee.Common.clearFormatAmount(this.value)' onblur='rmbtrip.hotel.validateNumber(this);rmbtrip.hotel.changeActualDayNumber(this);rmbtrip.hotel.checkAmount(this, 0)' onkeyup='this.value=this.value.replace(/[^0-9.]/g,\"\")' maxlength='15' value='" +
                (value != undefined ? formatAmount(value) : '') +
                "'/></center>"
              );
            },
            align: 'center',
            sortable: false,
            //							resizable: false
          },
          {
            name: 'tab3_exceptTaxRateAm',
            index: 'tab3_exceptTaxRateAm',
            formatter: function (value, grid, rows, state) {
              return (
                "<center><input type='text' style='text-align:center;' class='form-control' id='tab3_exceptTaxRateAm_" +
                grid.rowId +
                "' name='tab3_exceptTaxRateAm' onfocus='this.value=fee.Common.clearFormatAmount(this.value)' placeholder='金额' maxlength='15' onblur='rmbtrip.hotel.validateNumber(this);sumBillCount();' onkeyup='this.value=this.value.replace(/[^0-9.]/g,\"\")' value='" +
                (value != undefined ? formatAmount(value) : '') +
                "'/></center>"
              );
            },
            align: 'center',
            sortable: false,
            //								resizable: false
          },
          {
            name: 'tab3_taxRate',
            index: 'tab3_taxRate',
            formatter: function (value, grid, rows, state) {
              var option = "<option value=''></option>";
              for (j = 0; j < taxRateArr.length; j++) {
                if (value != taxRateArr[j].code) {
                  option +=
                    "<option value='" +
                    taxRateArr[j].code +
                    "'>" +
                    taxRateArr[j].name +
                    '</option>';
                } else {
                  option +=
                    "<option value='" +
                    taxRateArr[j].code +
                    "' selected='selected'>" +
                    taxRateArr[j].name +
                    '</option>';
                }
              }

              return (
                "<center><select type='text' class='form-control citytraffic-select' id='tab3_taxRate_" +
                grid.rowId +
                "' name='tab3_taxRate'>" +
                option +
                '</select></center>'
              );
            },
            align: 'center',
            sortable: false,
            //							resizable: false
          },
          {
            name: 'tab3_taxRateAm',
            index: 'tab3_taxRateAm',
            formatter: function (value, grid, rows, state) {
              return (
                "<center><input type='text' style='text-align:center;' class='form-control' id='tab3_taxRateAm_" +
                grid.rowId +
                "' name='tab3_taxRateAm' placeholder='税额' maxlength='15' onfocus='this.value=fee.Common.clearFormatAmount(this.value)' onblur='rmbtrip.hotel.validateNumber(this);sumBillCount();' onkeyup='this.value=this.value.replace(/[^0-9.]/g,\"\")' value='" +
                (value != undefined ? formatAmount(value) : '') +
                "'/></center>"
              );
            },
            align: 'center',
            sortable: false,
            //							resizable: false
          },
          {
            name: 'tab3_actualDayNumber',
            index: 'tab3_actualDayNumber',
            formatter: function (value, grid, rows, state) {
              return (
                "<center><input type='text' style='text-align:center;' class='form-control' id='tab3_actualDayNumber_" +
                grid.rowId +
                "' name='tab3_actualDayNumber' placeholder='实际/人/天' maxlength='15'  value='" +
                (value != undefined ? formatAmount(value) : '') +
                "'/></center>"
              );
            },
            align: 'center',
            sortable: false,
            //							resizable: false
          },
          {
            name: 'tab3_standardValue',
            index: 'tab3_standardValue',
            formatter: function (value, grid, rows, state) {
              return (
                "<center><input type='hidden' id='tab3_standard_" +
                grid.rowId +
                "_hide' name='tab3_standardValue' value='" +
                (value != undefined ? value : '') +
                "' readonly/></center>"
              );
            },
            align: 'center',
            sortable: false,
            width: 'none',
          },
          {
            name: 'tab3_standard',
            index: 'tab3_standard',
            formatter: function (value, grid, rows, state) {
              return (
                "<center><input type='text' style='text-align:center;' class='form-control' id='tab3_standard_" +
                grid.rowId +
                "' name='tab3_standard' placeholder='标准/人/天' maxlength='15' value='" +
                (value != undefined ? formatAmount(value) : '') +
                "' readonly/></center>"
              );
            },
            align: 'center',
            sortable: false,
            //							resizable: false
          },
        ],
        autowidth: true,
        height: '100%',
        rownumbers: true, // 显示行号
        multiselect: true, // 多选（表格会多出一列选择框）
        mtype: 'post',
        viewrecords: false,
        pagination: false,
        expandAll: false,
        pager: '#listPager3',
        pgbuttons: false,
        shrinkToFit: true,
        loadComplete: function (e) {},
        loadError: function (e, e1, e2) {
          jQuery('#hotel').footerData('set', {});
          $($('.footrow').find('[aria-describedby="hotel_tab3_dayNumber"]')[0]).html('合计');

          //回显数据
          rmbtrip.hotel.loadData();
          //							if($("#actionType").val()=="edit") {
          //								ldaccompany();
          //							}
          $('#hotel')
            .find("input[name='tab3_standard']")
            .each(function () {
              var standardId = $(this).attr('id');
              var standardValId = standardId + '_hide';
              var standardVal = fee.Common.clearFormatAmount($('#' + standardValId).val());
              accompany = standardVal != '' ? standardVal : '0';
              $(this).val(fee.Common.formatAmount(accompany));

              //如果是实报实销，则直接显示 实报实销
              if (
                standardVal == '9999.00' ||
                standardVal == '9999' ||
                standardVal == '9,999' ||
                standardVal == '9,999.00'
              ) {
                $(this).val('实报实销');
              }
            });
        },
        caption: '',
        footerrow: true,
        gridComplete: function () {
          jQuery('#hotel').footerData('set', {});
          $($('.footrow').find('[aria-describedby="hotel_tab3_dayNumber"]')[0]).html('合计');
        },
      });
      // 隐藏其它控件
      jQuery('#hotel').jqGrid('navGrid', '#listPager3', {
        edit: false,
        add: false,
        del: false,
        search: false,
        exportExcel: false,
        refresh: true,
        position: 'left',
      });
      $('#listPager3_center').hide();
      $('#refresh_hotel').hide();
      // 初始化增加和删除行按钮
      rmbtrip.hotel.createButton('#hotel', '#listPager3');

      jQuery(window).on('resize.jqGrid', function () {
        jQuery('#hotel').jqGrid('setGridWidth', $('.nav.nav-tabs').width());
      });
      jQuery(window).triggerHandler('resize.jqGrid');
    },
    createButton: function (dataId, pagerId) {
      // 初始化增加和删除行按钮
      // 自定义导航栏删除按钮
      $(dataId)
        .jqGrid('navGrid', pagerId)
        .jqGrid('navButtonAdd', pagerId, {
          caption: '<span class="glyphicon glyphicon-minus"></span>',
          position: 'first',
          buttonicon: 'none',
          onClickButton: function () {
            // 获取选中的数据IDs
            var ids = $(dataId).jqGrid('getGridParam', 'selarrrow');
            if (ids.length == 0) {
              swal({
                title: '请选择要删除的数据!',
                type: 'warning',
                confirmButtonText: '确定',
              });
              return false;
            }
            rmbtrip.hotel.deleteGradRow(dataId);
          },
        });

      // 自定义导航栏添加按钮
      $(dataId)
        .jqGrid('navGrid', pagerId)
        .jqGrid('navButtonAdd', pagerId, {
          caption: '<span class="glyphicon glyphicon-plus"></span>',
          position: 'first',
          buttonicon: 'none',
          onClickButton: function () {
            rmbtrip.hotel.addGradRow(undefined);
          },
        });
    },
    addGradRow: function (json) {
      jQuery('#hotel').jqGrid('addRowData', i, json != undefined ? json : {});
      // 初始化日期控件
      rmbtrip.hotel.initDate();
      //				ldaccompany();
      //加载城市控件
      $('[data-toggle="city-picker"]').citypicker({ companyId: $('#upOrgId').val() });
      // 增加金额单据统计
      sumBillCount();
      // 行号累加
      i++;
    },
    // 删除行
    deleteGradRow: function (id) {
      var selectedRowIds = jQuery(id).jqGrid('getGridParam', 'selarrrow');
      var len = selectedRowIds.length;
      if (len > 0) {
        sweetAlert(
          {
            title: '删除',
            text: '确认删除吗?',
            type: 'warning',
            showConfirmButton: true,
            showCancelButton: true,
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            closeOnConfirm: true,
          },
          function (isConfirm) {
            // 是否确认删除
            if (!isConfirm) {
              // 取消
              return;
            } else {
              for (var i = 0; i < len; i++) {
                $(id).jqGrid('delRowData', selectedRowIds[0]);
              }
              // 增加金额单据统计
              sumBillCount();
            }
          }
        );
      }
    },
    checkAmount: function (e, index) {
      //验证金额
      // 房产暂时不校验此项
      if ($('#upOrgId').val() == KF_companyId) {
        return true;
      }

      // 金额
      var amountTd = e.parentElement.parentElement.parentElement.children[8];
      var amount = fee.Common.clearFormatAmount(amountTd.children[0].children[0].value);
      // 天数
      var dayNumberTd = e.parentElement.parentElement.parentElement.children[7];
      var dayNumber = dayNumberTd.children[0].children[0].value;
      // 人数
      var personCountTd = e.parentElement.parentElement.parentElement.children[6];
      var personCount = personCountTd.children[0].children[0].value;
      // 补助标准
      var standardTd = e.parentElement.parentElement.parentElement.children[14];
      var standard = fee.Common.clearFormatAmount(standardTd.children[0].children[0].value);

      if ('实报实销' == standard) {
        return true;
      }
      // 重新计算实际人天
      var actualCount = '';
      if (amount > 0 && personCount > 0 && dayNumber > 0) {
        var td = e.parentElement.parentElement.parentElement.children[12];
        // 实际人天
        var actualDayNumber = td.children[0].children[0];
        actualDayNumber.value = fee.Common.formatAmount(amount / personCount / dayNumber);
        actualCount = actualDayNumber.value;
      }
      // 提示
      var result;
      if (
        personCount > 0 &&
        dayNumber > 0 &&
        standard >= 0 &&
        amount > dayNumber * standard * personCount
      ) {
        var msg;
        debugger;
        if (index == 0) {
          if (company.indexOf($('#upOrgId').val()) != -1) {
            msg =
              '实际:' +
              actualCount +
              ',标准:' +
              standard +
              ',超出标准，请核对或上传经批准的情况说明';
          } else {
            msg = '价税合计大于标准金额';
          }
        } else {
          if (company.indexOf($('#upOrgId').val()) != -1) {
            msg =
              '住宿第' +
              index +
              '条明细的实际:' +
              actualCount +
              ',标准:' +
              standard +
              ',超出标准，请核对或上传经批准的情况说明';
          } else {
            msg = '住宿第' + index + '条明细的价税合计大于标准金额';
          }
        }
        sweetAlert({
          title: '录入提示',
          text: msg,
          type: 'warning',
          showConfirmButton: true,
          confirmButtonText: '确认',
        });
        result = false;
      } else {
        tab3_flag = true;
      }
      return result;
    },
    checkAmountForJT: function (e, index) {
      //验证金额
      // 房产暂时不校验此项
      if ($('#upOrgId').val() == KF_companyId) {
        return true;
      }

      // 金额
      var amountTd = e.parentElement.parentElement.parentElement.children[8];
      var amount = fee.Common.clearFormatAmount(amountTd.children[0].children[0].value);
      // 天数
      var dayNumberTd = e.parentElement.parentElement.parentElement.children[7];
      var dayNumber = dayNumberTd.children[0].children[0].value;
      // 人数
      var personCountTd = e.parentElement.parentElement.parentElement.children[6];
      var personCount = personCountTd.children[0].children[0].value;
      // 补助标准
      var standardTd = e.parentElement.parentElement.parentElement.children[14];
      var standard = fee.Common.clearFormatAmount(standardTd.children[0].children[0].value);

      if ('实报实销' == standard) {
        return true;
      }

      // 提示
      var result;
      if (
        personCount > 0 &&
        dayNumber > 0 &&
        standard >= 0 &&
        amount > dayNumber * standard * personCount
      ) {
        result = false;
      } else {
        tab3_flag = true;
      }
      return result;
    },
    validateDetails: function () {
      // 开始日期
      var startTimes = $('.hotel_datetime');
      // 结束日期
      var endTimes = $('.hotel_time');

      // 住宿信息的开始日和结束日不能是同一天
      for (i = 0; i < startTimes.length; i++) {
        if (startTimes[i].value == endTimes[i].value) {
          sweetAlert({
            title: '录入提示',
            text: '住宿费第' + (i + 1) + '条，开始时间和结束时间不能为同一天',
            type: 'error',
            showConfirmButton: true,
            confirmButtonText: '确认',
          });
          return false;
        } else {
          continue;
        }
      }

      // 验证重复区划
      for (i = 0; i < startTimes.length; i++) {
        for (j = 0; j < startTimes.length && i != j; j++) {
          // 判断是否属于某一个时间段
          if (
            (startTimes[i].value >= startTimes[j].value &&
              startTimes[i].value < endTimes[j].value) ||
            (endTimes[i].value > startTimes[j].value && endTimes[i].value <= endTimes[j].value)
          ) {
            sweetAlert({
              title: '录入提示',
              text: '住宿费中时间段重叠',
              type: 'error',
              showConfirmButton: true,
              confirmButtonText: '确认',
            });
            return false;
          } else {
            continue;
          }
        }
      }

      //			// 城市间交通费没填时，不校验时间段
      //			if($("#citytraffic").find("tr").length<=1){
      //				return true;
      //			}
      //			// 开始日期
      //			var cityStartTimes=$("#citytraffic .form_datetime");
      //			// 结束日期
      //			var cityEndTimes=$("#citytraffic .form_time");
      //			//验证时间是否在城市间
      //			var startTimeState;
      //			var endTimeState;
      //			for(i=0;i<startTimes.length;i++){
      //				startTimeState=false;
      //				endTimeState=false;
      //				for(j=0;j<cityStartTimes.length;j++){
      //					// 判断是否属于某一个时间段
      //					if(startTimes[i].value>=cityStartTimes[j].value.substr(0,10)){
      //						startTimeState=true;
      //					}
      //					//住宿结束时间加1天根据内网规则(1天=86400000毫秒)
      //					if(rmbtrip.hotel.changeDate(endTimes[i].value)<=rmbtrip.hotel.changeDate(cityEndTimes[j].value.substr(0,10))+86400000){
      //						endTimeState=true;
      //					}
      //				}
      //				//判断最小开始和最大开始日期
      //				if(!startTimeState || !endTimeState){
      //					sweetAlert({
      //						title: "录入提示",
      //						text:"住宿费时间不在城市间交通费时间之内",
      //						type: 'error',
      //						showConfirmButton: true,
      //						confirmButtonText:"确认",
      //					});
      //					return false;
      //				}
      //			}

      return true;
    },
    changeDate: function (dataString) {
      var dependedVal = dataString;
      //根据日期字符串转换成日期
      var regEx = new RegExp('\\-', 'gi');
      dependedVal = dependedVal.replace(regEx, '/');
      return Date.parse(dependedVal);
    },
    delRow: function (_id) {
      $('#hotel .hotel_tr_' + _id).remove();
      // 增加金额单据统计
      sumBillCount();
    },
    selected: function () {
      // 加载下拉列表和选中项
      $('.hotel-select').each(function () {
        var selected = $(this).attr('check');
        for (j = 0; j < vehicleArr.length; j++) {
          if (selected != vehicleArr[j].code) {
            $(this).append(
              "<option value='" + vehicleArr[j].code + "'>" + vehicleArr[j].name + '</option>'
            );
          } else {
            $(this).append(
              "<option selected='selected' value='" +
                vehicleArr[j].code +
                "'>" +
                vehicleArr[j].name +
                '</option>'
            );
          }
        }
      });
    },
    validateNull: function () {
      var result = true;
      // 1 校验必填项
      $('#hotel')
        .find('input')
        .each(function () {
          if ($(this).attr('type') != 'button') {
            if (
              $(this).attr('name') == 'tab3_taxRate' ||
              $(this).attr('name') == 'tab3_taxRateAm' ||
              $(this).attr('name') == 'tab3_exceptTaxRateAm'
            ) {
              // 金额，税率，税额不校验 （因为普通发票的时候可以不填）
              return true;
            }

            if ($(this).val() == '' || $(this).val() == undefined) {
              $(this).css('border-color', 'yellow');
              // 提示必填项
              if ($(this).attr('placeholder') != undefined) {
                result = false;
                return false;
              }
            } else {
              $(this).css('border-color', '#cccccc');
            }
          }
        });
      if (!result) {
        sweetAlert({
          title: '录入提示',
          text: '住宿费明细的信息没有填写完整。',
          type: 'error',
          showConfirmButton: true,
          confirmButtonText: '确认',
        });
        return false;
      }

      // 2 金额，税率，税额此三项，必须同时都填或者都不填。
      var count = 1;
      $('#hotel')
        .find("select[name='tab3_taxRate']")
        .each(function () {
          var idx = $(this).attr('id').substring(13);
          var taxRate = $(this).val();
          var taxRateAm = $('#tab3_taxRateAm_' + idx).val();
          var exceptTaxRateAm = $('#tab3_exceptTaxRateAm_' + idx).val();

          if (
            (taxRate == '' && taxRateAm == '' && exceptTaxRateAm == '') ||
            (taxRate != '' && taxRateAm != '' && exceptTaxRateAm != '')
          ) {
            // 当全部没有填写，或者全部填写的时候，为正常
          } else {
            // 上记以外，即有的填写了有的没填写，则校验报错
            sweetAlert({
              title: '录入提示',
              text: '第' + count + '条明细的金额，税率，税额三项必须同时填写。',
              type: 'error',
              showConfirmButton: true,
              confirmButtonText: '确认',
            });
            result = false;
            return false;
          }

          count++;
        });

      // 3 校验重复
      if (rmbtrip.hotel.validateDetails() == false) {
        return false;
      }

      return result;
    },
    validateNumber: function (e) {
      var re = /^\d+(?=\.{0,1}\d+$|$)/;
      if (e.value != '') {
        if (!re.test(e.value)) {
          // 未选中数据
          sweetAlert({
            title: '录入提示',
            text: '请输入正确的数字',
            type: 'error',
            showConfirmButton: true,
            confirmButtonText: '确认',
          });
          e.value = '';
          e.focus();
          return;
        } else if (parseFloat(e.value) == 0) {
          //报销金额不能为0
          sweetAlert({
            title: '录入提示',
            text: '报销金额不能为0',
            type: 'error',
            showConfirmButton: true,
            confirmButtonText: '确认',
          });
          e.value = '';
          e.focus();
          return;
        } else {
          // 格式化两位小数
          e.value = fee.Common.formatAmount(e.value);
        }
      }
      sumBillCount();
    },
    initDate: function (e) {
      $('.hotel_datetime')
        .datetimepicker({
          language: 'zh-CN',
          format: 'yyyy-mm-dd',
          autoclose: true,
          todayBtn: true,
          startView: 2,
          minView: 2,
          viewSelect: 2,
          autoclose: true,
        })
        .on('hide', function (ev) {
          $(this).siblings(':first').datetimepicker('setStartTime', $(this).val());
          var td = $(this).parent().parent().parent().children()[3];
          var endt = td.children[0].children[0];
          endt = endt.value.replace(':', '');
          if (endt == '') {
            return;
          }
          // 设置天数
          var td = $(this).parent().parent().parent().children()[7];
          var dayNumber = td.children[0].children[0];
          if ($(this).val() != '' && $(this).val() >= endt) {
            // 未选中数据
            sweetAlert({
              title: '录入提示',
              text: '开始时间必须要早于结束时间',
              type: 'error',
              showConfirmButton: true,
              confirmButtonText: '确认',
            });
            $(this).val('');
            dayNumber.value = '';
            return false;
          }
          // 计算天数
          var startData = new Date(Date.parse($(this).val().substr(0, 10).replace(/-/g, '/')));
          var endData = new Date(Date.parse(endt.substr(0, 10).replace(/-/g, '/')));
          var days = (endData.getTime() - startData.getTime()) / (1000 * 60 * 60 * 24);
          dayNumber.value = days;
          var td = $(this).parent().parent().parent().children()[8];
          // 金额
          var amount = fee.Common.clearFormatAmount(td.children[0].children[0].value);
          var td = $(this).parent().parent().parent().children()[6];
          // 人数
          var personCount = td.children[0].children[0];
          /* //清空住宿标准 20171115*/
          $(this).parent().parent().parent().children()[13].children[0].children[0].value = '';
          // 设置实际人天
          if (amount != '' && amount > 0 && personCount.value != '' && personCount.value > 0) {
            var td = $(this).parent().parent().parent().children()[12];
            // 实际人天
            var actualDayNumber = td.children[0].children[0];
            if (days > 0) {
              actualDayNumber.value = fee.Common.formatAmount(amount / personCount.value / days);
            } else {
              actualDayNumber.value = '';
            }
          }

          //  20171115 开始时间  结束时间  地区 都存在的时候
          var startDate20171115 = $(this).val();
          var endDate20171115 = endt;
          var $startDateObj = $(this);
          var excoloum120171115;
          var cityList = $($(this).parents('tr').children()[5]).find('span > .select-item');
          if (cityList.length > 0) {
            excoloum120171115 = $(cityList[cityList.length - 1]).attr('data-code');
          }
          if (
            excoloum120171115 != null &&
            excoloum120171115 != '' &&
            excoloum120171115 != undefined
          ) {
            $.ajax({
              url: WEB_CTX_PATH + '/companystandardAction.do?method=queryAmount',
              data: {
                upOrgId: $('#upOrgId').val(),
                standardType: 2,
                startDate: startDate20171115,
                endDate: endDate20171115,
                userId: $('#applicantUid').val(),
                excoloum1: excoloum120171115,
                executive: $('#executive').val(),
                accompany: $('#accompany').val(),
              },
              type: 'POST',
              dataType: 'json',
              success: function (data) {
                if (data != null && data.result != null && data.result != '') {
                  //设置标准
                  var standardVal = data.result;
                  $($startDateObj.parents('tr').children()[13])
                    .find('input')
                    .val(fee.Common.formatAmount(standardVal));
                  //									ldaccompany();

                  //如果是实报实销，则直接显示 实报实销
                  if (
                    standardVal == '9999.00' ||
                    standardVal == '9999' ||
                    standardVal == '9,999' ||
                    standardVal == '9,999.00'
                  ) {
                    $($startDateObj.parents('tr').children()[14]).find('input').val('实报实销');
                  }
                }
              }, // 异常
              error: function (data) {
                sweetAlert({
                  title: '获取住宿标准错误',
                  type: 'error',
                  showConfirmButton: true,
                  confirmButtonText: '确认',
                });
              },
            });
          }

          /* //清空住宿标准 20171115
			      $(this).parent().parent().parent().children()[13].children[0].children[0].value="";*/
        });
      $('.hotel_time')
        .datetimepicker({
          language: 'zh-CN',
          format: 'yyyy-mm-dd',
          autoclose: true,
          todayBtn: true,
          startView: 2,
          minView: 2,
          viewSelect: 2,
          autoclose: true,
        })
        .on('hide', function (ev) {
          var endt = $(this).val();
          if (endt == '') return;
          var td = $(this).parent().parent().parent().children()[2];
          var stat = td.children[0].children[0];
          stat = stat.value;
          // 设置天数
          var td = $(this).parent().parent().parent().children()[7];
          var dayNumber = td.children[0].children[0];
          if (endt != '' && stat >= endt) {
            // 未选中数据
            sweetAlert({
              title: '录入提示',
              text: '结束时间必须要晚于起始时间',
              type: 'error',
              showConfirmButton: true,
              confirmButtonText: '确认',
            });
            $(this).val('');
            dayNumber.value = '';
            return false;
          }
          // 计算天数
          var startData = new Date(Date.parse(stat.substr(0, 10).replace(/-/g, '/')));
          var endData = new Date(Date.parse(endt.substr(0, 10).replace(/-/g, '/')));
          var days = (endData.getTime() - startData.getTime()) / (1000 * 60 * 60 * 24);
          dayNumber.value = days;
          var td = $(this).parent().parent().parent().children()[8];
          // 金额
          var amount = fee.Common.clearFormatAmount(td.children[0].children[0].value);
          var td = $(this).parent().parent().parent().children()[6];
          // 人数
          var personCount = td.children[0].children[0];
          // 设置实际人天
          if (amount != '' && amount > 0 && personCount.value != '' && personCount.value > 0) {
            var td = $(this).parent().parent().parent().children()[12];
            // 实际人天
            var actualDayNumber = td.children[0].children[0];
            if (days > 0) {
              actualDayNumber.value = fee.Common.formatAmount(amount / personCount.value / days);
            } else {
              actualDayNumber.value = '';
            }
          }

          // 20171115 开始时间  结束时间  地区 都存在的时候
          var startDate20171115 = stat;
          var endDate20171115 = $(this).val();
          var $startDateObj = $(this);
          var excoloum120171115;
          var cityList = $($(this).parents('tr').children()[5]).find('span > .select-item');
          if (cityList.length > 0) {
            excoloum120171115 = $(cityList[cityList.length - 1]).attr('data-code');
          }
          if (
            excoloum120171115 != null &&
            excoloum120171115 != '' &&
            excoloum120171115 != undefined
          ) {
            $.ajax({
              url: WEB_CTX_PATH + '/companystandardAction.do?method=queryAmount',
              data: {
                upOrgId: $('#upOrgId').val(),
                standardType: 2,
                startDate: startDate20171115,
                endDate: endDate20171115,
                userId: $('#applicantUid').val(),
                excoloum1: excoloum120171115,
                executive: $('#executive').val(),
                accompany: $('#accompany').val(),
              },
              type: 'POST',
              dataType: 'json',
              success: function (data) {
                if (data != null && data.result != null && data.result != '') {
                  //设置标准
                  var standardVal = data.result;
                  $($startDateObj.parents('tr').children()[13])
                    .find('input')
                    .val(fee.Common.formatAmount(standardVal));
                  //									ldaccompany();

                  //如果是实报实销，则直接显示 实报实销
                  if (
                    standardVal == '9999.00' ||
                    standardVal == '9999' ||
                    standardVal == '9,999' ||
                    standardVal == '9,999.00'
                  ) {
                    $($startDateObj.parents('tr').children()[14]).find('input').val('实报实销');
                  }
                }
              }, // 异常
              error: function (data) {
                sweetAlert({
                  title: '获取住宿标准错误',
                  type: 'error',
                  showConfirmButton: true,
                  confirmButtonText: '确认',
                });
              },
            });
          }
        });
    },
    changeActualDayNumber: function (e) {
      debugger;
      //金额
      var amountTd = e.parentElement.parentElement.parentElement.children[8];
      var amount = fee.Common.clearFormatAmount(amountTd.children[0].children[0].value);
      // 天数
      var dayNumberTd = e.parentElement.parentElement.parentElement.children[7];
      var dayNumber = dayNumberTd.children[0].children[0].value;
      // 人数
      var personCountTd = e.parentElement.parentElement.parentElement.children[6];
      var personCount = personCountTd.children[0].children[0].value;
      // 补助标准
      var standardTd = e.parentElement.parentElement.parentElement.children[13];
      var standard = fee.Common.clearFormatAmount(standardTd.children[0].children[0].value);
      // 重新计算实际人天
      var actualCount = '';
      if (amount > 0 && personCount > 0 && dayNumber > 0) {
        var td = e.parentElement.parentElement.parentElement.children[12];
        // 实际人天
        var actualDayNumber = td.children[0].children[0];
        actualDayNumber.value = fee.Common.formatAmount(amount / personCount / dayNumber);
        actualCount = actualDayNumber.value;
      }
      sumBillCount();
      if (
        personCount > 0 &&
        dayNumber > 0 &&
        standard >= 0 &&
        amount > dayNumber * standard * personCount
      ) {
        if (company.indexOf($('#upOrgId').val()) != -1) {
          msg =
            '实际:' + actualCount + ',标准:' + standard + ',超出标准，请核对或上传经批准的情况说明';
        } else {
          msg = '价税合计大于标准金额';
        }
        sweetAlert({
          title: '录入提示',
          text: msg,
          type: 'warning',
          showConfirmButton: true,
          confirmButtonText: '确认',
        });
      }
    },
    changeDayNumber: function (element) {
      // 开始日期
      var td = element.parentElement.parentElement.parentElement.children[2];
      var startTime = td.children[0].children[0];
      // 天数
      var td = element.parentElement.parentElement.parentElement.children[3];
      var endTime = td.children[0].children[0];
      if (element.value != '' && element.value != 0) {
        if (startTime.value != '' && endTime.value != '') {
          // 计算天数
          var startData = new Date(Date.parse(startTime.value.substr(0, 10).replace(/-/g, '/')));
          var endData = new Date(Date.parse(endTime.value.substr(0, 10).replace(/-/g, '/')));
          var days = (endData.getTime() - startData.getTime()) / (1000 * 60 * 60 * 24) + 1;
          // 判断超出的情况
          if (element.value > days) {
            sweetAlert({
              title: '录入提示',
              text: '天数不能大于选择的时间段',
              type: 'error',
              showConfirmButton: true,
              confirmButtonText: '确认',
            });
            element.value = days;
          }
        } else {
          sweetAlert({
            title: '录入提示',
            text: '请输入开始和结束日期',
            type: 'error',
            showConfirmButton: true,
            confirmButtonText: '确认',
          });
          element.value = '';
        }
      }
    },
  };
})();

// 出差补助
rmbtrip.subsidy = (function () {
  var i; // 行变量
  var vehicleArr; // 交通工具数组
  var subsidyTypeArr; // 补助数组
  var jsonArray = new Array(); //回显数据
  return {
    initData: function (index, value) {
      jsonArray[index] = value;
    },
    loadData: function () {
      for (k = 0; k < jsonArray.length; k++) {
        rmbtrip.subsidy.addGradRow(jsonArray[k]);
      }
      //加载城市控件
      //			$('[data-toggle="city-picker"]').citypicker({companyId: $("#upOrgId").val()});
    },
    init: function () {
      // 未初始化设置1
      i = $('#subsidy').find('tr').length;
      // 初始化时间控件
      rmbtrip.subsidy.initDatea();
      // 加载税率式下拉列表
      ajaxFormRequest(
        WEB_CTX_PATH +
          '/tripMainAction.do?method=getSelectStandardType&element2CodeType=' +
          encodeURI(encodeURI("{'standardType':'standardType'}")),
        function (returnData) {
          subsidyTypeArr = returnData.result.standardType;
          // 初始化回显的下拉框
          //						rmbtrip.citytraffic.selected();
        },
        function (state) {},
        'rmbtripForm',
        true,
        ' '
      );

      // 初始化表格
      jQuery('#subsidy').jqGrid({
        url: null,
        regional: 'cn',
        datatype: 'json',
        busiKey: ['id'],
        colNames: ['开始时间', '结束时间', '补助', '城市', '天数', '价税合计', '标准/人/天'],
        operatorKey: 'act',
        colModel: [
          {
            name: 'tab4_startTime',
            index: 'tab4_startTime',
            formatter: function (value, grid, rows, state) {
              return (
                "<center><input type='text' style='text-align:center;color: #333;width:100%;height:30px;border: 1px solid #ccc;border-radius: 4px;color: #555;background-color: #eee;' class='subsidy_datetime' id='tab4_startTime_" +
                grid.rowId +
                "' name='tab4_startTime' readonly placeholder='开始时间' value='" +
                (value != undefined ? value : '') +
                "'/><input type='hidden' id='tab4_startTime_" +
                grid.rowId +
                "_hide' name='tab4_hideStartTime'/></center>"
              );
            },
            align: 'center',
            sortable: false,
            //							resizable: false
          },
          {
            name: 'tab4_endTime',
            index: 'tab4_endTime',
            formatter: function (value, grid, rows, state) {
              return (
                "<center><input type='text' style='text-align:center;color: #333;width:100%;height:30px;border: 1px solid #ccc;border-radius: 4px;color: #555;background-color: #eee;' class='subsidy_time' id='tab4_endTime_" +
                grid.rowId +
                "' name='tab4_endTime' readonly placeholder='结束时间' value='" +
                (value != undefined ? value : '') +
                "'/><input type='hidden' id='tab4_endTime_" +
                grid.rowId +
                "_hide' name='tab4_hideEndTime'/></center>"
              );
            },
            align: 'center',
            sortable: false,
            //							resizable: false
          },
          {
            name: 'tab4_subsidyType',
            index: 'tab4_subsidyType',
            formatter: function (value, grid, rows, state) {
              var option = '';
              for (j = 0; j < subsidyTypeArr.length; j++) {
                if (value != subsidyTypeArr[j].code) {
                  option +=
                    "<option value='" +
                    subsidyTypeArr[j].code +
                    "'>" +
                    subsidyTypeArr[j].name +
                    '</option>';
                } else {
                  option +=
                    "<option value='" +
                    subsidyTypeArr[j].code +
                    "' selected='selected'>" +
                    subsidyTypeArr[j].name +
                    '</option>';
                }
              }

              return (
                "<center><select type='text' onchange='rmbtrip.subsidy.changeSubsidyType(this)' class='form-control citytraffic-select' id='tab4_subsidyType_" +
                grid.rowId +
                "' name='tab4_subsidyType'>" +
                option +
                '</select></center>'
              );
            },
            align: 'center',
            sortable: false,
            //							resizable: false
          },
          {
            name: 'tab4_city',
            index: 'tab4_city',
            formatter: function (value, grid, rows, state) {
              return (
                "<div id='selectCity' style='position: relative;'><input type='text' style='text-align:center;width:100%;' class='form-control' id='tab4_city_" +
                grid.rowId +
                "' name='tab4_city' readonly placeholder='城市' data-toggle='city-picker' value='" +
                (value != undefined ? value : '') +
                "'/><input type='hidden' id='tab4_city_" +
                grid.rowId +
                "_value' name='tab4_city_value'/><span id='tab4_city_" +
                grid.rowId +
                "_span'/></div>"
              );
            },
            align: 'center',
            sortable: false,
            //							resizable: false
          },
          {
            name: 'tab4_dayNumber',
            index: 'tab4_dayNumber',
            formatter: function (value, grid, rows, state) {
              return (
                "<center><input type='text' style='text-align:center;' class='form-control' id='tab4_dayNumber_" +
                grid.rowId +
                "' name='tab4_dayNumber' placeholder='天数' onblur='rmbtrip.subsidy.changeDayNumber(this);rmbtrip.subsidy.setAmount(this)' onkeyup='this.value=this.value.replace(/[^0-9]/g,\"\")' maxlength='15' value='" +
                (value != undefined ? value : '') +
                "'/></center>"
              );
            },
            align: 'center',
            sortable: false,
            //							resizable: false
          },
          {
            name: 'tab4_amount',
            index: 'tab4_amount',
            formatter: function (value, grid, rows, state) {
              return (
                "<center><input type='text' style='text-align:center;' class='form-control' id='tab4_amount_" +
                grid.rowId +
                "' name='tab4_amount' placeholder='价税合计' onfocus='this.value=fee.Common.clearFormatAmount(this.value)' onblur='rmbtrip.subsidy.validateNumber(this);rmbtrip.subsidy.checkAmount(this,0)' onkeyup='this.value=this.value.replace(/[^0-9.]/g,\"\")' maxlength='15' value='" +
                (value != undefined ? formatAmount(value) : '') +
                "'/></center>"
              );
            },
            align: 'center',
            sortable: false,
            //							resizable: false
          },
          {
            name: 'tab4_standardValue',
            index: 'tab4_standardValue',
            formatter: function (value, grid, rows, state) {
              return (
                "<center><input type='text' style='text-align:center;' class='form-control' id='tab4_standardValue_" +
                grid.rowId +
                "' name='tab4_standardValue' placeholder='标准/人/天' maxlength='15' value='" +
                (value != undefined ? formatAmount(value) : '') +
                "' readonly/></center>"
              );
            },
            align: 'center',
            sortable: false,
            //							resizable: false
          },
        ],
        autowidth: true,
        height: '100%',
        rownumbers: true, // 显示行号
        multiselect: true, // 多选（表格会多出一列选择框）
        mtype: 'post',
        viewrecords: false,
        pagination: false,
        expandAll: false,
        pager: '#listPager4',
        pgbuttons: false,
        shrinkToFit: true,
        loadComplete: function (e) {},
        loadError: function (e, e1, e2) {
          jQuery('#subsidy').footerData('set', {});
          $($('.footrow').find('[aria-describedby="subsidy_tab4_dayNumber"]')[0]).html('合计');

          jQuery('#subsidy').jqGrid('setGridWidth', jQuery('.nav.nav-tabs').width(), true);
          //回显数据
          rmbtrip.subsidy.loadData();

          //如果是实报实销，则直接显示 实报实销
          $('#subsidy')
            .find("input[name='tab4_standardValue']")
            .each(function () {
              var standardId = $(this).attr('id');
              var idx = $(this).attr('id').substring(19);
              var subsidyType = $('#tab4_subsidyType_' + idx).val();
              if (subsidyType != '4') {
                var standardVal = fee.Common.clearFormatAmount($('#' + standardId).val());

                if (
                  standardVal == '9999.00' ||
                  standardVal == '9999' ||
                  standardVal == '9,999' ||
                  standardVal == '9,999.00'
                ) {
                  $(this).val('实报实销');
                } else {
                  $(this).val(fee.Common.formatAmount(standardVal != '' ? standardVal : '0'));
                }
              }
            });
        },
        caption: '',
        footerrow: true,
        gridComplete: function () {
          jQuery('#subsidy').footerData('set', {});
          $($('.footrow').find('[aria-describedby="subsidy_tab4_dayNumber"]')[0]).html('合计');
        },
      });
      // 隐藏其它控件
      jQuery('#subsidy').jqGrid('navGrid', '#listPager4', {
        edit: false,
        add: false,
        del: false,
        search: false,
        exportExcel: false,
        refresh: true,
        position: 'left',
      });
      $('#listPager4_center').hide();
      $('#refresh_subsidy').hide();
      // 初始化增加和删除行按钮
      rmbtrip.subsidy.createButton('#subsidy', '#listPager4');

      jQuery(window).on('resize.jqGrid', function () {
        jQuery('#subsidy').jqGrid('setGridWidth', $('.nav.nav-tabs').width());
      });
      jQuery(window).triggerHandler('resize.jqGrid');
    },
    createButton: function (dataId, pagerId) {
      // 初始化增加和删除行按钮
      // 自定义导航栏删除按钮
      $(dataId)
        .jqGrid('navGrid', pagerId)
        .jqGrid('navButtonAdd', pagerId, {
          caption: '<span class="glyphicon glyphicon-minus"></span>',
          position: 'first',
          buttonicon: 'none',
          onClickButton: function () {
            // 获取选中的数据IDs
            var ids = $(dataId).jqGrid('getGridParam', 'selarrrow');
            if (ids.length == 0) {
              swal({
                title: '请选择要删除的数据!',
                type: 'warning',
                confirmButtonText: '确定',
              });
              return false;
            }
            rmbtrip.subsidy.deleteGradRow(dataId);
          },
        });

      // 自定义导航栏添加按钮
      $(dataId)
        .jqGrid('navGrid', pagerId)
        .jqGrid('navButtonAdd', pagerId, {
          caption: '<span class="glyphicon glyphicon-plus"></span>',
          position: 'first',
          buttonicon: 'none',
          onClickButton: function () {
            rmbtrip.subsidy.addGradRow(undefined);
          },
        });
    },
    addGradRow: function (json) {
      jQuery('#subsidy').jqGrid('addRowData', i, json != undefined ? json : {});
      // 初始化日期控件
      rmbtrip.subsidy.initDatea();

      // 增加金额单据统计
      sumBillCount();

      if ($('#tab4_subsidyType_' + i).val() == '4') {
        //				$("#tab4_startTime_"+i).attr("disabled","true");
        //				$("#tab4_endTime_"+i).attr("disabled","true");
        //				$("#tab4_dayNumber_"+i).attr("readonly","readonly");
        //				$("#tab4_city_"+i).citypicker("destroy");
        $('#tab4_standardValue_' + i).val('');
      }
      //加载城市控件
      $('#tab4_city_' + i).citypicker({ companyId: $('#upOrgId').val() });
      // 行号累加
      i++;
    },
    // 删除行
    deleteGradRow: function (id) {
      var selectedRowIds = jQuery(id).jqGrid('getGridParam', 'selarrrow');
      var len = selectedRowIds.length;
      if (len > 0) {
        sweetAlert(
          {
            title: '删除',
            text: '确认删除吗?',
            type: 'warning',
            showConfirmButton: true,
            showCancelButton: true,
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            closeOnConfirm: true,
          },
          function (isConfirm) {
            // 是否确认删除
            if (!isConfirm) {
              // 取消
              return;
            } else {
              for (var i = 0; i < len; i++) {
                $(id).jqGrid('delRowData', selectedRowIds[0]);
              }
              // 增加金额单据统计
              sumBillCount();
            }
          }
        );
      }
    },
    selected: function () {
      // 加载下拉列表和选中项
      $('.subsidy-select').each(function () {
        var selected = $(this).attr('check');
        for (j = 0; j < vehicleArr.length; j++) {
          if (selected != vehicleArr[j].code) {
            $(this).append(
              "<option value='" + vehicleArr[j].code + "'>" + vehicleArr[j].name + '</option>'
            );
          } else {
            $(this).append(
              "<option selected='selected' value='" +
                vehicleArr[j].code +
                "'>" +
                vehicleArr[j].name +
                '</option>'
            );
          }
        }
      });
    },
    validateNull: function () {
      var result = true;
      // 校验必填项
      $('#subsidy')
        .find("tr[class='ui-widget-content jqgrow ui-row-ltr']")
        .each(function () {
          var stand = $($(this).children()[4].children[0].children[0]).val();
          if (stand == 4) {
            if ($($(this).children()[7].children[0].children[0]).val() == '') {
              $($(this).children()[7].children[0].children[0]).css('border-color', 'yellow');
              sweetAlert({
                title: '录入提示',
                text: '价税合计为必填项',
                type: 'error',
                showConfirmButton: true,
                confirmButtonText: '确认',
              });
              result = false;
              return;
            } else {
              $($(this).children()[7].children[0].children[0]).css('border-color', '#fff');
            }
          } else {
            $(this)
              .find('input')
              .each(function () {
                if ($(this).attr('type') != 'button') {
                  if ($(this).val() == '' || $(this).val() == undefined) {
                    $(this).css('border-color', 'yellow');
                    // 提示必填项
                    if ($(this).attr('placeholder') != undefined) {
                      // 未选中数据
                      sweetAlert({
                        title: '录入提示',
                        text: '[' + $(this).attr('placeholder') + ']为必填项',
                        type: 'error',
                        showConfirmButton: true,
                        confirmButtonText: '确认',
                      });
                      result = false;
                      return;
                    }
                  } else {
                    $(this).css('border-color', '#cccccc');
                  }
                }
              });
          }
        });

      //			$("#subsidy").find("input").each(function(){
      //				if($(this).attr("type")!="button"){
      //					if($(this).val()==""||$(this).val()==undefined){
      //						$(this).css("border-color","yellow");
      //						// 提示必填项
      //						if($(this).attr("placeholder")!=undefined){
      //							// 未选中数据
      //							sweetAlert({
      //								title: "录入提示",
      //								text:"["+$(this).attr("placeholder")+"]为必填项",
      //								type: 'error',
      //								showConfirmButton: true,
      //								confirmButtonText:"确认",
      //							});
      //							result=false;
      //							return;
      //						}
      //					}else{
      //						$(this).css("border-color","#cccccc");
      //					}
      //				}
      //			});

      // 校验重复
      if (rmbtrip.subsidy.validateDetails() == false) {
        return false;
      }
      return result;
    },
    validateNumber: function (e) {
      var re = /^\d+(?=\.{0,1}\d+$|$)/;
      if (e.value != '') {
        if (!re.test(e.value)) {
          // 未选中数据
          sweetAlert({
            title: '录入提示',
            text: '请输入正确的数字',
            type: 'error',
            showConfirmButton: true,
            confirmButtonText: '确认',
          });
          e.value = '';
          e.focus();
          return;
        } else if (parseFloat(e.value) == 0) {
          //报销金额不能为0
          sweetAlert({
            title: '录入提示',
            text: '报销金额不能为0',
            type: 'error',
            showConfirmButton: true,
            confirmButtonText: '确认',
          });
          e.value = '';
          e.focus();
          return;
        } else {
          // 格式化两位小数
          e.value = fee.Common.formatAmount(e.value);
        }
      }
      sumBillCount();
    },
    //tab4里面的补助发生改变时，
    changeSubsidyType: function (element) {
      if ($(element).val() == 4) {
        //				$($(element).parent().parent().parent().children()[2].children[0].children[0]).val("");
        //				$($(element).parent().parent().parent().children()[3].children[0].children[0]).val("");
        //				$($(element).parent().parent().parent().children()[5].children[0].children[0]).citypicker("reset");
        //				$($(element).parent().parent().parent().children()[6].children[0].children[0]).val("");
        $($(element).parent().parent().parent().children()[7].children[0].children[0]).val('');
        $($(element).parent().parent().parent().children()[8].children[0].children[0]).val('');
        //				$($(element).parent().parent().parent().children()[2].children[0].children[0]).attr("disabled","true");
        //				$($(element).parent().parent().parent().children()[3].children[0].children[0]).attr("disabled","true");
        //				$($(element).parent().parent().parent().children()[5].children[0].children[0]).citypicker("destroy");
        //				$($(element).parent().parent().parent().children()[6].children[0].children[0]).attr("readonly","readonlye");
        return;
      }
      //			$($(element).parent().parent().parent().children()[2].children[0].children[0]).removeAttr("disabled");
      //			$($(element).parent().parent().parent().children()[3].children[0].children[0]).removeAttr("disabled");
      //			$($(element).parent().parent().parent().children()[5].children[0].children[0]).citypicker({companyId: $("#upOrgId").val() });
      //			$($(element).parent().parent().parent().children()[6].children[0].children[0]).removeAttr("readonly");
      // 计算天数
      var startData = new Date(
        Date.parse(
          $($(element).parent().parent().parent().children()[2].children[0].children[0])
            .val()
            .substr(0, 10)
            .replace(/-/g, '/')
        )
      );
      var endData = new Date(
        Date.parse(
          $($(element).parent().parent().parent().children()[3].children[0].children[0])
            .val()
            .substr(0, 10)
            .replace(/-/g, '/')
        )
      );
      var days = (endData.getTime() - startData.getTime()) / (1000 * 60 * 60 * 24) + 1;
      $($(element).parent().parent().parent().children()[6].children[0].children[0]).val(days);

      var startDate20171115 = $(
        $(element).parent().parent().parent().children()[2].children[0].children[0]
      ).val();
      var endDate20171115 = $(
        $(element).parent().parent().parent().children()[3].children[0].children[0]
      ).val();
      var standarType = $(element).val();
      var excoloum120171115;
      var cityList = $($(element).parents('tr').children()[5]).find('span > .select-item');
      if (cityList.length > 0) {
        excoloum120171115 = $(cityList[cityList.length - 1]).attr('data-code');
      }
      if (excoloum120171115 != null && excoloum120171115 != '' && excoloum120171115 != undefined) {
        $.ajax({
          url: WEB_CTX_PATH + '/companystandardAction.do?method=queryAmount',
          data: {
            upOrgId: $('#upOrgId').val(),
            standardType: standarType,
            startDate: startDate20171115,
            endDate: endDate20171115,
            userId: $('#applicantUid').val(),
            excoloum1: excoloum120171115,
            executive: $('#executive').val(),
            accompany: $('#accompany').val(),
          },
          type: 'POST',
          dataType: 'json',
          success: function (data) {
            if (data != null && data.result != null && data.result != '') {
              //设置标准
              var standardVal = data.result;
              $($(element).parent().parent().parent().children()[8])
                .find('input')
                .val(fee.Common.formatAmount(standardVal));
              //如果是实报实销，则直接显示 实报实销
              if (
                standardVal == '9999.00' ||
                standardVal == '9999' ||
                standardVal == '9,999' ||
                standardVal == '9,999.00'
              ) {
                $($(element).parent().parent().parent().children()[8])
                  .find('input')
                  .val('实报实销');
              }

              //设置报销金额
              var dayNum = $($(element).parent().parent().parent().children()[6])
                .find('input')
                .val();
              if (
                standardVal != '9999.00' &&
                standardVal != '9999' &&
                standardVal != '' &&
                dayNum != '' &&
                standardVal != '9,999' &&
                standardVal != '9,999.00'
              ) {
                $($(element).parent().parent().parent().children()[7])
                  .find('input')
                  .val(fee.Common.formatAmount(standardVal * dayNum));
                sumBillCount();
              }
            }
          }, // 异常
          error: function (data) {
            sweetAlert({
              title: '获取补助标准错误',
              type: 'error',
              showConfirmButton: true,
              confirmButtonText: '确认',
            });
          },
        });
      }
    },
    setAmount: function (e) {
      // 天数
      var dayNumberTd = e.parentElement.parentElement.parentElement.children[6];
      var dayNumber = dayNumberTd.children[0].children[0].value;
      // 补助标准
      var standardTd = e.parentElement.parentElement.parentElement.children[8];
      var standardVal = fee.Common.clearFormatAmount(standardTd.children[0].children[0].value);

      // 金额
      if (
        standardVal != '9999.00' &&
        standardVal != '9999' &&
        standardVal != '' &&
        dayNumber != '' &&
        standardVal != '9,999' &&
        standardVal != '9,999.00'
      ) {
        var amountTd = e.parentElement.parentElement.parentElement.children[7];
        amountTd.children[0].children[0].value = fee.Common.formatAmount(standardVal * dayNumber);
        sumBillCount();
      }
    },
    checkAmount: function (e, index) {
      // 房产暂时不校验此项
      if ($('#upOrgId').val() == KF_companyId) {
        return true;
      }

      //长途补贴不校验
      if (
        e.parentElement.parentElement.parentElement.children[4].children[0].children[0].value == '4'
      ) {
        return true;
      }

      // 金额
      var amountTd = e.parentElement.parentElement.parentElement.children[7];
      var amount = fee.Common.clearFormatAmount(amountTd.children[0].children[0].value);
      // 天数
      var dayNumberTd = e.parentElement.parentElement.parentElement.children[6];
      var dayNumber = dayNumberTd.children[0].children[0].value;
      // 补助标准
      var standardTd = e.parentElement.parentElement.parentElement.children[8];
      var standard = fee.Common.clearFormatAmount(standardTd.children[0].children[0].value);

      if ('实报实销' == standard) {
        return true;
      }

      // 设置实际人天
      var result;
      if (dayNumber > 0 && standard >= 0 && amount > dayNumber * standard) {
        var msg;
        if (index == 0) {
          msg = '价税合计大于标准金额';
        } else {
          msg = '补助第' + index + '条明细的价税合计大于标准金额';
        }
        sweetAlert({
          title: '录入提示',
          text: msg,
          type: 'error',
          showConfirmButton: true,
          confirmButtonText: '确认',
        });
        result = false;
      } else {
        result = true;
      }
      return result;
    },
    validateDetails: function () {
      // 验证重复区划
      // 开始日期
      var startTimes = $('.subsidy_datetime');
      // 结束日期
      var endTimes = $('.subsidy_time');
      for (i = 0; i < startTimes.length; i++) {
        if (startTimes[i].value == '') {
          continue;
        }
        var stand1 = $(
          $(startTimes[i]).parent().parent().parent().children()[4].children[0].children[0]
        ).val();
        for (j = 0; j < startTimes.length && i != j; j++) {
          if (startTimes[j].value == '') {
            continue;
          }
          var stand2 = $(
            $(startTimes[j]).parent().parent().parent().children()[4].children[0].children[0]
          ).val();
          if (stand1 != stand2) {
            continue;
          }
          // 判断是否属于某一个时间段
          if (
            (startTimes[i].value >= startTimes[j].value &&
              startTimes[i].value <= endTimes[j].value) ||
            (endTimes[i].value >= startTimes[j].value && endTimes[i].value <= endTimes[j].value)
          ) {
            sweetAlert({
              title: '录入提示',
              text: '相同类型补助的时间段重叠',
              type: 'error',
              showConfirmButton: true,
              confirmButtonText: '确认',
            });
            return false;
          } else {
            continue;
          }
        }
      }

      //			// 城市间交通费没填时，不校验时间段
      //			if($("#citytraffic").find("tr").length<=1){
      //				return true;
      //			}
      //			// 开始日期
      //			var cityStartTimes=$("#citytraffic .form_datetime");
      //			// 结束日期
      //			var cityEndTimes=$("#citytraffic .form_time");
      //			//验证时间是否在城市间
      //			var startTimeState;
      //			var endTimeState;
      //			for(i=0;i<startTimes.length;i++){
      //				startTimeState=false;
      //				endTimeState=false;
      //				if(startTimes[i].value==""){
      //					continue;
      //				}
      //				for(j=0;j<cityStartTimes.length;j++){
      //
      //					// 判断是否属于某一个时间段
      //					if(startTimes[i].value>=cityStartTimes[j].value){
      //						startTimeState=true;
      //					}
      //					if(endTimes[i].value<=cityEndTimes[j].value){
      //						endTimeState=true;
      //					}
      //				}
      //				//判断最小开始和最大开始日期
      //				if(!startTimeState || !endTimeState){
      //					sweetAlert({
      //						title: "录入提示",
      //						text:"出差补助时间不在城市间交通费时间之内",
      //						type: 'error',
      //						showConfirmButton: true,
      //						confirmButtonText:"确认",
      //					});
      //					return false;
      //				}
      //			}
      return true;
    },
    initDatea: function (e) {
      $('.subsidy_datetime')
        .datetimepicker({
          language: 'zh-CN',
          format: 'yyyy-mm-dd',
          autoclose: true,
          todayBtn: true,
          startView: 2,
          minView: 2,
          viewSelect: 2,
          autoclose: true,
        })
        .on('hide', function (ev) {
          $(this).siblings(':first').datetimepicker('setStartTime', $(this).val());
          var td = $(this).parent().parent().parent().children()[3];
          var endt = td.children[0].children[0];
          endt = endt.value.replace(':', '');
          if (endt == '') {
            return;
          }
          // 设置天数
          var td = $(this).parent().parent().parent().children()[6];
          var dayNumber = td.children[0].children[0];
          if ($(this).val() != '' && $(this).val() > endt) {
            // 未选中数据
            sweetAlert({
              title: '录入提示',
              text: '开始时间必须要早于起始时间',
              type: 'error',
              showConfirmButton: true,
              confirmButtonText: '确认',
            });
            $(this).val('');
            dayNumber.value = '';
            return false;
          }

          // 计算天数
          var startData = new Date(Date.parse($(this).val().substr(0, 10).replace(/-/g, '/')));
          var endData = new Date(Date.parse(endt.substr(0, 10).replace(/-/g, '/')));
          var days = (endData.getTime() - startData.getTime()) / (1000 * 60 * 60 * 24) + 1;
          dayNumber.value = days;

          var standarType = $(
            $(this).parent().parent().parent().children()[4].children[0].children[0]
          ).val();
          if (standarType == '4') {
            return;
          }

          // 20171115 追加判断
          //  20171115 开始时间  结束时间  地区 都存在的时候
          var startDate20171115 = $(this).val();
          var endDate20171115 = endt;
          var $startDateObj = $(this);
          var excoloum120171115;
          var cityList = $($(this).parents('tr').children()[5]).find('span > .select-item');
          if (cityList.length > 0) {
            excoloum120171115 = $(cityList[cityList.length - 1]).attr('data-code');
          }
          if (
            excoloum120171115 != null &&
            excoloum120171115 != '' &&
            excoloum120171115 != undefined
          ) {
            $.ajax({
              url: WEB_CTX_PATH + '/companystandardAction.do?method=queryAmount',
              data: {
                upOrgId: $('#upOrgId').val(),
                standardType: standarType,
                startDate: startDate20171115,
                endDate: endDate20171115,
                userId: $('#applicantUid').val(),
                excoloum1: excoloum120171115,
                executive: $('#executive').val(),
                accompany: $('#accompany').val(),
              },
              type: 'POST',
              dataType: 'json',
              success: function (data) {
                if (data != null && data.result != null && data.result != '') {
                  //设置标准
                  var standardVal = data.result;
                  $($startDateObj.parents('tr').children()[8])
                    .find('input')
                    .val(fee.Common.formatAmount(standardVal));
                  //如果是实报实销，则直接显示 实报实销
                  if (
                    standardVal == '9999.00' ||
                    standardVal == '9999' ||
                    standardVal == '9,999' ||
                    standardVal == '9,999.00'
                  ) {
                    $($startDateObj.parents('tr').children()[8]).find('input').val('实报实销');
                  }

                  //设置报销金额
                  var dayNum = $($startDateObj.parents('tr').children()[6]).find('input').val();
                  if (
                    standardVal != '9999.00' &&
                    standardVal != '9999' &&
                    standardVal != '' &&
                    dayNum != '' &&
                    standardVal != '9,999' &&
                    standardVal != '9,999.00'
                  ) {
                    $($startDateObj.parents('tr').children()[7])
                      .find('input')
                      .val(fee.Common.formatAmount(standardVal * dayNum));
                    sumBillCount();
                  }
                }
              }, // 异常
              error: function (data) {
                sweetAlert({
                  title: '获取补助标准错误',
                  type: 'error',
                  showConfirmButton: true,
                  confirmButtonText: '确认',
                });
              },
            });
          }
        });

      $('.subsidy_time')
        .datetimepicker({
          language: 'zh-CN',
          format: 'yyyy-mm-dd',
          autoclose: true,
          todayBtn: true,
          startView: 2,
          minView: 2,
          viewSelect: 2,
          autoclose: true,
        })
        .on('hide', function (ev) {
          var endt = $(this).val().replace(':', '');
          if (endt == '') return;
          var td = $(this).parent().parent().parent().children()[2];
          var stat = td.children[0].children[0];
          stat = stat.value.replace(':', '');
          // 设置天数
          var td = $(this).parent().parent().parent().children()[6];
          var dayNumber = td.children[0].children[0];
          if (endt != '' && stat > endt) {
            // 未选中数据
            sweetAlert({
              title: '录入提示',
              text: '结束时间必须要晚于起始时间',
              type: 'error',
              showConfirmButton: true,
              confirmButtonText: '确认',
            });
            $(this).val('');
            dayNumber.value = '';
            return false;
          }

          // 计算天数
          var startData = new Date(Date.parse(stat.substr(0, 10).replace(/-/g, '/')));
          var endData = new Date(Date.parse(endt.substr(0, 10).replace(/-/g, '/')));
          var days = (endData.getTime() - startData.getTime()) / (1000 * 60 * 60 * 24) + 1;
          dayNumber.value = days;

          var standarType = $(
            $(this).parent().parent().parent().children()[4].children[0].children[0]
          ).val();
          if (standarType == '4') {
            return;
          }

          // 20171115  追加判断
          var startDate20171115 = stat;
          var endDate20171115 = $(this).val();
          var $startDateObj = $(this);
          var excoloum120171115;
          var cityList = $($(this).parents('tr').children()[5]).find('span > .select-item');
          if (cityList.length > 0) {
            excoloum120171115 = $(cityList[cityList.length - 1]).attr('data-code');
          }
          if (
            excoloum120171115 != null &&
            excoloum120171115 != '' &&
            excoloum120171115 != undefined
          ) {
            $.ajax({
              url: WEB_CTX_PATH + '/companystandardAction.do?method=queryAmount',
              data: {
                upOrgId: $('#upOrgId').val(),
                standardType: standarType,
                startDate: startDate20171115,
                endDate: endDate20171115,
                userId: $('#applicantUid').val(),
                excoloum1: excoloum120171115,
                executive: $('#executive').val(),
                accompany: $('#accompany').val(),
              },
              type: 'POST',
              dataType: 'json',
              success: function (data) {
                if (data != null && data.result != null && data.result != '') {
                  //设置标准
                  $($startDateObj.parents('tr').children()[8])
                    .find('input')
                    .val(fee.Common.formatAmount(data.result));
                  //如果是实报实销，则直接显示 实报实销
                  var standardVal = data.result;
                  if (
                    standardVal == '9999.00' ||
                    standardVal == '9999' ||
                    standardVal == '9,999' ||
                    standardVal == '9,999.00'
                  ) {
                    $($startDateObj.parents('tr').children()[8]).find('input').val('实报实销');
                  }

                  //设置报销金额
                  var dayNum = $($startDateObj.parents('tr').children()[6]).find('input').val();
                  if (
                    standardVal != '9999.00' &&
                    standardVal != '9999' &&
                    standardVal != '' &&
                    dayNum != '' &&
                    standardVal != '9,999' &&
                    standardVal != '9,999.00'
                  ) {
                    $($startDateObj.parents('tr').children()[7])
                      .find('input')
                      .val(fee.Common.formatAmount(standardVal * dayNum));
                    sumBillCount();
                  }
                }
              }, // 异常
              error: function (data) {
                sweetAlert({
                  title: '获取补助标准错误',
                  type: 'error',
                  showConfirmButton: true,
                  confirmButtonText: '确认',
                });
              },
            });
          }
        });
    },
    changeDayNumber: function (element) {
      // 开始日期
      var td = element.parentElement.parentElement.parentElement.children[2];
      var startTime = td.children[0].children[0];
      // 天数
      var td = element.parentElement.parentElement.parentElement.children[3];
      var endTime = td.children[0].children[0];
      if (element.value != '' && element.value != 0) {
        if (startTime.value != '' && endTime.value != '') {
          // 计算天数
          var startData = new Date(Date.parse(startTime.value.substr(0, 10).replace(/-/g, '/')));
          var endData = new Date(Date.parse(endTime.value.substr(0, 10).replace(/-/g, '/')));
          var days = (endData.getTime() - startData.getTime()) / (1000 * 60 * 60 * 24) + 1;
          // 判断超出的情况
          if (element.value > days) {
            sweetAlert({
              title: '录入提示',
              text: '天数不能大于选择的时间段',
              type: 'error',
              showConfirmButton: true,
              confirmButtonText: '确认',
            });
            element.value = days;
          }
        } else {
          sweetAlert({
            title: '录入提示',
            text: '请输入开始和结束日期',
            type: 'error',
            showConfirmButton: true,
            confirmButtonText: '确认',
          });
          element.value = '';
        }
      }
    },
  };
})();

// 其它
rmbtrip.other = (function () {
  var i; // 行变量
  var vehicleArr; // 交通工具数组
  var jsonArray = new Array(); //回显数据
  return {
    initData: function (index, value) {
      jsonArray[index] = value;
    },
    loadData: function () {
      jQuery('#other').jqGrid('clearGridData');
      for (k = 0; k < jsonArray.length; k++) {
        rmbtrip.other.addGradRow(jsonArray[k]);
      }
    },
    init: function () {
      // 未初始化设置1
      i = $('#other').find('tr').length;

      // 初始化表格
      jQuery('#other').jqGrid({
        url: null,
        regional: 'cn',
        datatype: 'json',
        busiKey: ['id'],
        colNames: ['价税合计', '备注'],
        operatorKey: 'act',
        colModel: [
          {
            name: 'tab5_amount',
            index: 'tab5_amount',
            formatter: function (value, grid, rows, state) {
              return (
                "<center><input type='text' style='text-align:center' class='form-control amount' id='tab5_amount_" +
                grid.rowId +
                "' name='tab5_amount' placeholder='价税合计' onfocus='this.value=fee.Common.clearFormatAmount(this.value)' onblur='rmbtrip.other.validateNumber(this)' onkeyup='this.value=this.value.replace(/[^0-9.]/g,\"\")' size='5' maxlength='15' value='" +
                (value != undefined ? formatAmount(value) : '') +
                "'/></center>"
              );
            },
            align: 'center',
            sortable: false,
            width: 80,
            //							resizable: false
          },
          {
            name: 'tab5_content',
            index: 'tab5_content',
            formatter: function (value, grid, rows, state) {
              return (
                "<center><input type='text' style='text-align:left' class='form-control' id='tab5_content_" +
                grid.rowId +
                "' name='tab5_content' placeholder='备注' size='30' maxlength='100' value='" +
                (value != undefined ? value : '') +
                "'/></center>"
              );
            },
            align: 'center',
            sortable: false,
            width: 160,
            //							resizable: false
          },
        ],
        autowidth: true,
        height: '100%',
        rownumbers: true, // 显示行号
        multiselect: true, // 多选（表格会多出一列选择框）
        mtype: 'post',
        viewrecords: false,
        pagination: false,
        expandAll: false,
        pager: '#listPager5',
        pgbuttons: false,
        shrinkToFit: true,
        loadComplete: function (e) {},
        loadError: function (e, e1, e2) {
          jQuery('#other').footerData('set', {});
          $($('.footrow').find('[aria-describedby="other_tab5_amount"]')[0]).html('合计');

          jQuery('#other').jqGrid('setGridWidth', jQuery('.nav.nav-tabs').width(), true);
          //回显数据
          rmbtrip.other.loadData();
        },
        caption: '',
        footerrow: true,
        gridComplete: function () {
          jQuery('#other').footerData('set', {});
          $($('.footrow').find('[aria-describedby="other_tab5_amount"]')[0]).html('合计');
        },
      });
      // 隐藏其它控件
      jQuery('#other').jqGrid('navGrid', '#listPager5', {
        edit: false,
        add: false,
        del: false,
        search: false,
        exportExcel: false,
        refresh: true,
        position: 'left',
      });
      $('#listPager5_center').hide();
      $('#refresh_other').hide();
      // 初始化增加和删除行按钮
      rmbtrip.other.createButton('#other', '#listPager5');

      jQuery(window).on('resize.jqGrid', function () {
        jQuery('#other').jqGrid('setGridWidth', $('.nav.nav-tabs').width());
      });
      jQuery(window).triggerHandler('resize.jqGrid');
    },
    createButton: function (dataId, pagerId) {
      // 初始化增加和删除行按钮
      // 自定义导航栏删除按钮
      $(dataId)
        .jqGrid('navGrid', pagerId)
        .jqGrid('navButtonAdd', pagerId, {
          caption: '<span class="glyphicon glyphicon-minus"></span>',
          position: 'first',
          buttonicon: 'none',
          onClickButton: function () {
            // 获取选中的数据IDs
            var ids = $(dataId).jqGrid('getGridParam', 'selarrrow');
            if (ids.length == 0) {
              swal({
                title: '请选择要删除的数据!',
                type: 'warning',
                confirmButtonText: '确定',
              });
              return false;
            }
            rmbtrip.other.deleteGradRow(dataId);
          },
        });

      // 自定义导航栏添加按钮
      $(dataId)
        .jqGrid('navGrid', pagerId)
        .jqGrid('navButtonAdd', pagerId, {
          caption: '<span class="glyphicon glyphicon-plus"></span>',
          position: 'first',
          buttonicon: 'none',
          onClickButton: function () {
            rmbtrip.other.addGradRow(undefined);
          },
        });
    },
    addGradRow: function (json) {
      jQuery('#other').jqGrid('addRowData', i, json != undefined ? json : {});
      // 增加金额单据统计
      sumBillCount();
      // 行号累加
      i++;
    },
    // 删除行
    deleteGradRow: function (id) {
      var selectedRowIds = jQuery(id).jqGrid('getGridParam', 'selarrrow');
      var len = selectedRowIds.length;
      if (len > 0) {
        sweetAlert(
          {
            title: '删除',
            text: '确认删除吗?',
            type: 'warning',
            showConfirmButton: true,
            showCancelButton: true,
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            closeOnConfirm: true,
          },
          function (isConfirm) {
            // 是否确认删除
            if (!isConfirm) {
              // 取消
              return;
            } else {
              for (var i = 0; i < len; i++) {
                $(id).jqGrid('delRowData', selectedRowIds[0]);
              }
              // 增加金额单据统计
              sumBillCount();
            }
          }
        );
      }
    },
    validateNull: function () {
      var result = true;
      // 校验必填项
      $('#other')
        .find('input')
        .each(function () {
          if ($(this).attr('type') != 'button') {
            if ($(this).val() == '' || $(this).val() == undefined) {
              $(this).css('border-color', 'yellow');
              // 提示必填项
              if ($(this).attr('placeholder') != undefined) {
                // 未选中数据
                sweetAlert({
                  title: '录入提示',
                  text: '[' + $(this).attr('placeholder') + ']为必填项',
                  type: 'error',
                  showConfirmButton: true,
                  confirmButtonText: '确认',
                });
                result = false;
                return;
              }
            } else {
              $(this).css('border-color', '#cccccc');
            }
          }
        });
      return result;
    },
    validateNumber: function (e) {
      var re = /^\d+(?=\.{0,1}\d+$|$)/;
      if (e.value != '') {
        if (!re.test(e.value)) {
          // 未选中数据
          sweetAlert({
            title: '录入提示',
            text: '请输入正确的数字',
            type: 'error',
            showConfirmButton: true,
            confirmButtonText: '确认',
          });
          e.value = '';
          e.focus();
          return;
        } else if (parseFloat(e.value) == 0) {
          //报销金额不能为0
          sweetAlert({
            title: '录入提示',
            text: '报销金额不能为0',
            type: 'error',
            showConfirmButton: true,
            confirmButtonText: '确认',
          });
          e.value = '';
          e.focus();
          return;
        } else {
          // 格式化两位小数
          e.value = fee.Common.formatAmount(e.value);
        }
      }
      sumBillCount();
    },
  };
})();

$.initDataPlugin = function () {
  $('.form_datetime')
    .datetimepicker({
      language: 'zh-CN',
      format: 'yyyy-mm-dd',
      autoclose: true,
      todayBtn: true,
      startView: 2,
      minView: 2,
      viewSelect: 2,
      autoclose: true,
    })
    .on('hide', function (ev) {
      $(this).siblings(':first').datetimepicker('setStartTime', $(this).val());
      var td = $(this).parent().parent().parent().children()[3];
      var endt = td.children[0].children[0];
      endt = endt.value.replace(':', '');
      if (endt == '') {
        return;
      }
      // 设置天数
      if ($(this).val() != '' && $(this).val() > endt) {
        // 未选中数据
        sweetAlert({
          title: '录入提示',
          text: '开始时间必须要早于结束时间',
          type: 'error',
          showConfirmButton: true,
          confirmButtonText: '确认',
        });
        $(this).val('');
        return false;
      }
    });
  $('.form_time')
    .datetimepicker({
      language: 'zh-CN',
      format: 'yyyy-mm-dd',
      autoclose: true,
      todayBtn: true,
      startView: 2,
      minView: 2,
      viewSelect: 2,
      autoclose: true,
    })
    .on('hide', function (ev) {
      var endt = $(this).val().replace(':', '');
      var td = $(this).parent().parent().parent().children()[2];
      var stat = td.children[0].children[0];
      stat = stat.value.replace(':', '');
      if (endt != '' && stat > endt) {
        // 未选中数据
        sweetAlert({
          title: '录入提示',
          text: '结束时间必须要晚于起始时间',
          type: 'error',
          showConfirmButton: true,
          confirmButtonText: '确认',
        });
        $(this).val('');
        return false;
      }
    });

  $('.del_line').click(function () {
    $(this).parent().parent().remove();
  });
};

Date.prototype.format = function (format) {
  var date = {
    'M+': this.getMonth() + 1,
    'd+': this.getDate(),
    'h+': this.getHours(),
    'm+': this.getMinutes(),
    's+': this.getSeconds(),
    'q+': Math.floor((this.getMonth() + 3) / 3),
    'S+': this.getMilliseconds(),
  };
  if (/(y+)/i.test(format)) {
    format = format.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
  }
  for (var k in date) {
    if (new RegExp('(' + k + ')').test(format)) {
      format = format.replace(
        RegExp.$1,
        RegExp.$1.length == 1 ? date[k] : ('00' + date[k]).substr(('' + date[k]).length)
      );
    }
  }
  return format;
};
Date.daysInMonth = function (year, month) {
  if (month == 1) {
    if (year % 4 == 0 && year % 100 != 0) return 29;
    else return 28;
  } else if ((month <= 6 && month % 2 == 0) || (month = 6 && month % 2 == 1)) return 31;
  else return 30;
};
Date.prototype.addMonth = function (addMonth) {
  var y = this.getFullYear();
  var m = this.getMonth();
  var nextY = y;
  var nextM = m;
  // 如果当前月+要加上的月>11 这里之所以用11是因为 js的月份从0开始
  if (m > 11) {
    nextY = y + 1;
    nextM = parseInt(m + addMonth) - 11;
  } else {
    nextM = this.getMonth() + addMonth;
  }
  var daysInNextMonth = Date.daysInMonth(nextY, nextM);
  var day = this.getDate();
  if (day > daysInNextMonth) {
    day = daysInNextMonth;
  }
  return new Date(nextY, nextM, day);
};
// 统计单据数量
function sumBillCount() {
  // TAB1金额
  var citytrafficAmounts = 0;
  $('#citytraffic')
    .find("input[name='tab1_amount']")
    .each(function () {
      var oldNum = fee.Common.clearFormatAmount($(this).val());
      citytrafficAmounts += parseFloat(oldNum != '' ? oldNum : 0);
    });
  // TAB2金额
  var cityinsideAmounts = 0;
  $('#cityinside')
    .find("input[name='tab2_amount']")
    .each(function () {
      var oldNum = fee.Common.clearFormatAmount($(this).val());
      cityinsideAmounts += parseFloat(oldNum != '' ? oldNum : 0);
    });
  // TAB3金额
  var hotelAmounts = 0;
  $('#hotel')
    .find("input[name='tab3_amount']")
    .each(function () {
      var oldNum = fee.Common.clearFormatAmount($(this).val());
      hotelAmounts += parseFloat(oldNum != '' ? oldNum : 0);
    });
  // TAB4金额
  var subsidyAmounts = 0;
  $('#subsidy')
    .find("input[name='tab4_amount']")
    .each(function () {
      var oldNum = fee.Common.clearFormatAmount($(this).val());
      subsidyAmounts += parseFloat(oldNum != '' ? oldNum : 0);
    });
  // TAB5金额
  var otherAmounts = 0;
  $('#other')
    .find("input[name='tab5_amount']")
    .each(function () {
      var oldNum = fee.Common.clearFormatAmount($(this).val());
      otherAmounts += parseFloat(oldNum != '' ? oldNum : 0);
    });

  //设置各tab页的合计
  $($('.footrow').find('[aria-describedby="citytraffic_tab1_amount"]')[0]).html(
    fee.Common.formatAmount(citytrafficAmounts)
  );
  $($('.footrow').find('[aria-describedby="cityinside_tab2_amount"]')[0]).html(
    fee.Common.formatAmount(cityinsideAmounts)
  );
  $($('.footrow').find('[aria-describedby="hotel_tab3_amount"]')[0]).html(
    fee.Common.formatAmount(hotelAmounts)
  );
  $($('.footrow').find('[aria-describedby="subsidy_tab4_amount"]')[0]).html(
    fee.Common.formatAmount(subsidyAmounts)
  );
  $($('.footrow').find('[aria-describedby="other_tab5_amount"]')[0]).html(
    '合计：  ' + fee.Common.formatAmount(otherAmounts)
  );

  // 设置钱数
  $('#amount').val(
    fee.Common.formatAmount(
      citytrafficAmounts + cityinsideAmounts + hotelAmounts + subsidyAmounts + otherAmounts
    )
  );
  //计划可用金额改变时，计划内外改变
  rmbtrip.rmbtripEdit.isPlanInner();

  // TAB3稅金
  var hotelTax = 0;
  $('#hotel')
    .find("input[name='tab3_taxRateAm']")
    .each(function () {
      var oldNum = fee.Common.clearFormatAmount($(this).val());
      hotelTax += parseFloat(oldNum != '' ? oldNum : 0);
    });
  var hotelTax = fee.Common.formatAmount(hotelTax);
  if (hotelTax == '') {
    hotelTax = '0.00';
  }
  $('#taxRateAm').val(hotelTax);
  //TAB3 不含税金额
  var exceptTaxRateAm = 0;
  $('#hotel')
    .find("input[name='tab3_exceptTaxRateAm']")
    .each(function () {
      var oldNum = fee.Common.clearFormatAmount($(this).val());
      exceptTaxRateAm += parseFloat(oldNum != '' ? oldNum : 0);
    });
  $('#exceptTaxRateAm').val(fee.Common.formatAmount(exceptTaxRateAm));
  var exceptTaxRateAm = fee.Common.formatAmount(exceptTaxRateAm);
  if (exceptTaxRateAm == '') {
    exceptTaxRateAm = '0.00';
  }
  $('#exceptTaxRateAm').val(exceptTaxRateAm);
}
//根据checkbox来改变标准人天
function ldaccompany() {
  var accompany = 0;
  if ($('#accompany').is(':checked')) {
    $('#accompany').val('1');
  } else {
    $('#accompany').val('0');
  }

  // 重设住宿标准
  var idx = 0;
  $('#hotel')
    .find("input[name='tab3_startTime']")
    .each(function () {
      var startTimeVal = $(this).val();
      var endTimeVal = $($('#hotel').find("input[name='tab3_endTime']")[idx]).val();

      var cityCodeVal;
      var cityList = $($(this).parents('tr').children()[5]).find('span > .select-item');
      if (cityList.length > 0) {
        cityCodeVal = $(cityList[cityList.length - 1]).attr('data-code');
      }
      if (startTimeVal != '' && endTimeVal != '' && cityCodeVal != '') {
        $.ajax({
          url: WEB_CTX_PATH + '/companystandardAction.do?method=queryAmount',
          data: {
            upOrgId: $('#upOrgId').val(),
            standardType: 2,
            startDate: startTimeVal,
            endDate: endTimeVal,
            userId: $('#applicantUid').val(),
            excoloum1: cityCodeVal,
            executive: $('#executive').val(),
            accompany: $('#accompany').val(),
          },
          type: 'POST',
          dataType: 'json',
          async: false,
          success: function (data) {
            if (data != null && data.result != null && data.result != '') {
              //设置标准
              var standardVal = data.result;
              $($('#hotel').find("input[name='tab3_standardValue']")[idx]).val(
                fee.Common.formatAmount(standardVal)
              );
              $($('#hotel').find("input[name='tab3_standard']")[idx]).val(
                fee.Common.formatAmount(standardVal)
              );

              //如果是实报实销，则直接显示 实报实销
              if (
                standardVal == '9999.00' ||
                standardVal == '9999' ||
                standardVal == '9,999' ||
                standardVal == '9,999.00'
              ) {
                $($('#hotel').find("input[name='tab3_standard']")[idx]).val('实报实销');
              }
            }
          }, // 异常
          error: function (data) {
            sweetAlert({
              title: '获取住宿标准错误',
              type: 'error',
              showConfirmButton: true,
              confirmButtonText: '确认',
            });
          },
        });
      }

      idx++;
    });
}

//startwith方法
String.prototype.startWith = function (str) {
  if (str == null || str == '' || this.length == 0 || str.length > this.length) return false;
  if (this.substr(0, str.length) == str) return true;
  else return false;
  return true;
};

//验证回显数字格式是否正确
function formatAmount(str) {
  if (str.startWith('.')) {
    str = '0' + str;
  }

  return fee.Common.formatAmount(str);
}
function changeBillNo(oldCompanyId, oldDeptId) {
  //平行化四家、资管和刀郎没有陪同出差
  //	if ($('#upOrgId').val() == JT_companyId
  //			|| $('#upOrgId').val() == KD_companyId
  //			|| $('#upOrgId').val() == KK_companyId
  //			|| $('#upOrgId').val() == KC_companyId
  //			|| $('#upOrgId').val() == ZG_companyId
  //			|| $('#upOrgId').val() == DL_companyId
  //			|| $('#upOrgId').val() == WY_companyId) {
  //		rmbtrip.rmbtripEdit.hideAccompany();
  //	} else {
  //		//不是高管 时才显示
  //		if($("#executive").val()!="1"){
  //			rmbtrip.rmbtripEdit.showAccompany();
  //		}
  //	}

  $('#planCheckAmount').val('');
  $('#planCheckAmountState').val('');
  $('#planCheckAmountState').attr('style', 'background-color:#eee');
  $('#monthlyPlan').val('');
  //构筑部门树
  rmbtrip.rmbtripEdit.orgtree.init();

  //公司id
  var upOrgId = $('#upOrgId').val();
  //部门id
  var deptUid = $('#deptUid').val();

  //判断指定公司的资金计划是否已经同步
  fee.Common.checkSyncPlan(upOrgId);

  if (oldCompanyId != upOrgId) {
    // 公司改变时，所有内容全清空
    // 清空计划内外
    $('#amount').val('');

    // 清空明细（JQGrid）
    jQuery('#citytraffic').jqGrid('clearGridData');
    jQuery('#cityinside').jqGrid('clearGridData');
    jQuery('#hotel').jqGrid('clearGridData');
    jQuery('#subsidy').jqGrid('clearGridData');
  } else if (oldDeptId != deptUid && deptUid != '') {
    // 公司不变-部门改变时。明细不清空，但是计划内外等值要重设
    rmbtrip.rmbtripEdit.planAmount(true);
  }
}

//公司树
rmbtrip.rmbtripEdit.companytree = (function () {
  var zTree;
  return {
    init: function () {
      //同步加载模式
      jQuery.ajax({
        async: true,
        type: 'POST',
        url: WEB_CTX_PATH + '/paymentAction.do?method=getCompany',
        contentType: 'application/x-www-form-urlencoded',
        data: { isProxy: $('#isProxy').val() },
        dataType: 'json',
        beforeSend: function (xhr) {
          xhr.setRequestHeader('__REQUEST_TYPE', 'AJAX_REQUEST');
        },
        success: rmbtrip.rmbtripEdit.companytree.createTreeAll,
      });
    },
    bindEvent: function () {},
    createTreeAll: function (returnData) {
      allNodes = returnData || [];
      var setting = {
        async: {
          enable: false,
        },
        check: {
          enable: false,
          autoCheckTrigger: false,
          chkboxType: { Y: '', N: '' },
        },
        data: {
          simpleData: {
            enable: true,
            idKey: 'id',
            pIdKey: 'pId',
            rootPId: '****',
          },
        },
        view: {
          expandSpeed: 'fast',
          selectedMulti: false,
          showLine: true,
          dblClickExpand: false,
        },
        callback: {
          onClick: rmbtrip.rmbtripEdit.companytree.onClickCompany,
        },
      };
      jQuery.fn.zTree.init(jQuery('#companyTree'), setting, allNodes);
      zTree = jQuery.fn.zTree.getZTreeObj('companyTree');
    },
    onClickCompany: function (e, treeId, treeNode) {
      var oldCompanyId = $('#upOrgId').val();
      var oldDeptId = $('#deptUid').val();

      // 获取当前选中节点
      var node = zTree.getSelectedNodes()[0];
      jQuery('#upOrgId').val(node.id);
      jQuery('#companyName').val(node.name);

      $('#project_div').attr('hidden', true);

      // 隐藏menu
      rmbtrip.rmbtripEdit.companytree.hideMenu();
      // 初始化 部门
      jQuery('#deptUid').val('');
      jQuery('#orgName').val('');
      // 初始化 项目  -- 最后做
      jQuery('#projectUid').empty().select2();
      rmbtrip.rmbtripEdit.companytree.changeProject();
      // 清空表格
      changeBillNo(oldCompanyId, oldDeptId);
    },
    changeProject: function () {
      //调用下拉列表  bankName'upOrgId'为select组件id、'bankName'(改变角色)
      //取消计划外的选中
      $('#usePlanFlag').removeAttr('checked');
      $('#usePlanFlag').val('0');

      if ($('#projectUid').val() != null) {
        $('#projectUid').empty().select2();
      }
    },
    showOrgTree: function () {
      var deptName = jQuery('#companyName');
      var orgOffset = jQuery('#companyName').offset();
      jQuery('#companyContent')
        .css({
          left: orgOffset.left + 'px',
          top: orgOffset.top + deptName.outerHeight() + 'px',
        })
        .slideDown('fast');
      jQuery('body').bind('mousedown', rmbtrip.rmbtripEdit.companytree.onBodyDown);
    },
    hideMenu: function () {
      jQuery('#companyContent').fadeOut('fast');
      jQuery('body').unbind('mousedown', rmbtrip.rmbtripEdit.companytree.onBodyDown);
    },
    onBodyDown: function (event) {
      if (
        !(
          event.target.id == 'menuBtn' ||
          event.target.id == 'orgTreeBtn' ||
          jQuery(event.target).parents('#companyContent').length > 0
        )
      ) {
        rmbtrip.rmbtripEdit.companytree.hideMenu();
      }
    },
    doError: function () {
      alert('Error');
    },
    doClose: function () {},
  };
})();

//20170822 部门+项目
rmbtrip.rmbtripEdit.orgtree = (function () {
  var zTree;
  return {
    init: function () {
      var upOrgId = $('#upOrgId').val();
      //同步加载模式
      jQuery.ajax({
        async: true,
        type: 'POST',
        url: WEB_CTX_PATH + '/paymentAction.do?method=getCompanyDepartment',
        contentType: 'application/x-www-form-urlencoded',
        data: { upOrgId: upOrgId, isProxy: $('#isProxy').val() },
        dataType: 'json',
        beforeSend: function (xhr) {
          xhr.setRequestHeader('__REQUEST_TYPE', 'AJAX_REQUEST');
        },
        success: rmbtrip.rmbtripEdit.orgtree.createTreeAll,
      });
    },
    bindEvent: function () {},
    createTreeAll: function (returnData) {
      allNodes = returnData || [];
      var setting = {
        async: {
          enable: false,
        },
        check: {
          enable: false,
          autoCheckTrigger: false,
          chkboxType: { Y: '', N: '' },
        },
        data: {
          simpleData: {
            enable: true,
            idKey: 'id',
            pIdKey: 'pId',
            rootPId: '****',
          },
        },
        view: {
          expandSpeed: 'fast',
          selectedMulti: false,
          showLine: true,
          dblClickExpand: false,
        },
        callback: {
          onClick: rmbtrip.rmbtripEdit.orgtree.onClickOrg,
        },
      };
      jQuery.fn.zTree.init(jQuery('#orgTree'), setting, allNodes);
      zTree = jQuery.fn.zTree.getZTreeObj('orgTree');
    },
    onClickOrg: function (e, treeId, treeNode) {
      //取消计划外的选中
      $('#usePlanFlag').removeAttr('checked');
      $('#usePlanFlag').val('0');
      // 获取当前选中节点
      var node = zTree.getSelectedNodes()[0];
      if (node.type == 'org') {
        jQuery('#deptUid').val(node.id);
      }
      jQuery('#orgName').val(node.name);
      // 隐藏menu
      rmbtrip.rmbtripEdit.orgtree.hideMenu();
      // 初始化 项目  -- 最后做
      rmbtrip.rmbtripEdit.orgtree.changeProject();
      // 部门改变，重取计划金额（计划内外相关）
      rmbtrip.rmbtripEdit.planAmount(true);
    },

    changeProject: function () {
      $('#projectDis').attr('hidden', false);
      //调用下拉列表  bankName'upOrgId'为select组件id、'bankName'(改变角色)
      if ($('#projectUid').val() != null) {
        $('#projectUid').empty().select2();
      }
      ajaxFormRequest(
        WEB_CTX_PATH +
          '/paymentAction.do?method=getCompanyDepartmentProject' +
          '&upOrgId=' +
          $('#upOrgId').val() +
          '&orgId=' +
          $('#deptUid').val() +
          '&isProxy=' +
          $('#isProxy').val(),
        function (returnData) {
          if (returnData.length == 0) {
            $('#project_div').attr('hidden', true);
          } else {
            // 定义属性
            var obj = new Object();
            var obj1 = new Object();
            obj1.projectUid = returnData;
            // 这个属性 是控件Id
            obj.result = obj1;
            if (initSelect2(obj)) {
              $('#projectUid').val(null).select2();
            }
          }
        },
        function (state) {},
        'ordinaryMainForm',
        true,
        ' '
      );
    },
    showOrgTree: function () {
      var deptName = jQuery('#orgName');
      var orgOffset = jQuery('#orgName').offset();
      jQuery('#orgContent')
        .css({
          left: orgOffset.left + 'px',
          top: orgOffset.top + deptName.outerHeight() + 'px',
        })
        .slideDown('fast');
      jQuery('body').bind('mousedown', rmbtrip.rmbtripEdit.orgtree.onBodyDown);
    },
    hideMenu: function () {
      jQuery('#orgContent').fadeOut('fast');
      jQuery('body').unbind('mousedown', rmbtrip.rmbtripEdit.orgtree.onBodyDown);
    },
    onBodyDown: function (event) {
      if (
        !(
          event.target.id == 'menuBtn' ||
          event.target.id == 'orgTreeBtn' ||
          jQuery(event.target).parents('#orgContent').length > 0
        )
      ) {
        rmbtrip.rmbtripEdit.orgtree.hideMenu();
      }
    },
    doError: function () {
      alert('Error');
    },
    doClose: function () {},
  };
})();

jQuery.validator.addMethod(
  'checkTextAreaRequired',
  function (value, element) {
    //replace(/[\n\r]/gi,"") 替换回车符
    //replace(/[ ]/g,"");    替换空格符
    var result = true;
    if (value.replace(/[\n\r]/gi, '').replace(/[ ]/g, '') == '') {
      result = false;
      $(element).attr('style', 'border: 1px dotted red;');
    } else {
      $(element).removeAttr('style');
    }
    return result;
  },
  '出差理由必须输入'
);
jQuery.validator.addMethod(
  'checkTripBillRequired',
  function (value, element) {
    if ($('#executive').is(':checked')) {
      $(element).removeAttr('style');
      return true;
    } else if (value == '') {
      $(element).attr('style', 'border: 1px dotted red;');
      return false;
    } else {
      $(element).removeAttr('style');
      return true;
    }
  },
  '出差申请单必须输入'
);
