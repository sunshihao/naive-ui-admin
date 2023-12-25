import { doAppStatusFlow } from '@/utils/tools';

/*
 * 定义命名空间
 */
jQuery.namespace('rmbtrip.rmbtripDetail');
//var JT_companyId = "10000";//金投
//var KD_companyId = "10001";//凯迪
//var KK_companyId = "10004";//凯矿
//var KC_companyId = "10005";//凯创
//var ZG_companyId = "10003";//资管
//var DL_companyId = "10007";//刀郎
//var WY_companyId = "10012";//物業
let citytrafficCnt = 0;

rmbtrip.rmbtripDetail = (function () {
  return {
    init: function () {
      // 出纳确认，修改时， 金额可编辑
      if ($('#actionType').val() == 'cashier') {
        $('#amount').removeAttr('readonly');
        $('#saveButton').show();
      }

      //计划内外的颜色
      if ($('#planCheckAmountState').val() == '计划内') {
        $('#planCheckAmountState').attr(
          'style',
          'background-color:#00FA9A;color:black;font-weight:900'
        );
      } else if ($('#planCheckAmountState').val() == '计划外') {
        $('#planCheckAmountState').attr(
          'style',
          'background-color:#FF6347;color:black;font-weight:900'
        );
      }

      if ($('#accompany').val() == '1') {
        $('#accompany').attr('checked', true);
      } else {
        $('#accompany').attr('checked', false);
      }
      //是否高管
      if ($('#executive').val() == '1') {
        $('#executive').attr('checked', true);
        $('#accompany').hide();
        $('#accompany_label').hide();
        $('#applicatDiv').removeAttr('class');
      } else {
        if (applicantBillCd != null && applicantBillCd != '') {
          $('#viewApply').show();
        }
        $('#executive').attr('checked', false);
        $('#applicatDiv').attr('class', 'input-group');
      }
      //是否计划外 0-否 1-是
      if ($('#usePlanFlag').val() == '1') {
        $('#usePlanFlag').attr('checked', true);
      } else {
        $('#usePlanFlag').attr('checked', false);
      }

      rmbtrip.rmbtripDetail.gridInit();
      jQuery('#saveButton').on('click', rmbtrip.rmbtripDetail.saveOrUpdate);
      jQuery('#viewApply').on('click', rmbtrip.rmbtripDetail.viewApply);
      jQuery('#closeButton').on('click', rmbtrip.rmbtripDetail.doClose);
      // 加载支付方式下拉列表
      ajaxFormRequest(
        WEB_CTX_PATH +
          '/codeAction.do?method=getSelectOptions&element2CodeType=' +
          encodeURI(encodeURI("{'payType':'payType'}")),
        function (returnData) {
          if (initSelect2(returnData)) {
            // 操作类型
            $('#payType').val(payType).select2();
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
            $('#expenseType').val(expenseType).select2();
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
        bindPropVal: $('#attachmentId').val(),
        mainType: 'CL',
        fileDivId: 'fileUploadDiv',
        operType: 'view',
        maxFileNumber: 100,
        //				acceptFileTypes: "jpg,jpeg,png,txt,pdf,docx,doc,xls,xlsx",
        maxFileSize: 600000000,
      });

      //自适应 // ???
      $('#citytraffic_a').bind('click', function () {
        jQuery('#citytrafficNew').jqGrid('setGridWidth', jQuery('.nav.nav-tabs').width());
      });
      $('#cityinside_a').bind('click', function () {
        jQuery('#cityinsideNew').jqGrid('setGridWidth', jQuery('.nav.nav-tabs').width());
      });
      $('#hotel_a').bind('click', function () {
        jQuery('#hotelNew').jqGrid('setGridWidth', jQuery('.nav.nav-tabs').width());
      });
      $('#subsidy_a').bind('click', function () {
        jQuery('#subsidyNew').jqGrid('setGridWidth', jQuery('.nav.nav-tabs').width());
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

      //切到有明细的tab
      // TODO
      // if (citytrafficCnt == 0) {
      //   if (cityInsideCnt > 0) {
      //     jQuery('#cityinside_a').click();
      //   } else if (hotelCnt > 0) {
      //     jQuery('#hotel_a').click();
      //   } else {
      //     jQuery('#subsidy_a').click();
      //   }
      // }
    },
    /*
     * 生成表格组件
     */
    gridInit: function () {
      // 校验
      jQuery('#rmbtripForm').validate({
        rules: {
          amount: {
            required: true,
          },
        },
      });
    },
    // 确认按钮
    saveOrUpdate: function () {
      // form表单校验
      if (!jQuery('#rmbtripForm').valid()) {
        return false;
      }
      // 表单提交
      $('#rmbtripForm').ajaxSubmit({
        url: WEB_CTX_PATH + '/tripMainAction.do?method=doCashierEdit',
        dataType: 'json',
        method: 'POST',
        target: '#rmbtripForm',
        data: {},
        success: function (data) {
          if (data.result == 'success') {
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
                parent.cashierconfirm.cashierList.doQuery();
              }
            );
          } else {
            sweetAlert(
              {
                title: '系统提示',
                text: '失败，请刷新后重试。',
                type: 'error',
                showConfirmButton: true,
                confirmButtonText: '确认',
              },
              function () {}
            );
          }
        },
        // 异常
        error: function (data) {
          // 失败
          sweetAlert(
            {
              title: '系统提示',
              text: '失败，请刷新后重试。',
              type: 'error',
              showConfirmButton: true,
              confirmButtonText: '确认',
            },
            function () {}
          );
        },
        beforeSend: function (xhr) {
          xhr.setRequestHeader('__REQUEST_TYPE', 'AJAX_REQUEST');
        },
      });
    },
    /*
     * 按钮关闭
     */
    doClose: function () {
      jQuery().closeDlg(parent.layer);
    },
    // 出差申请单选择，弹出pop
    chooseApply: function () {
      url = WEB_CTX_PATH + '/ebc/rmbtrip/rmbtrip/applyList.jsp';
      jQuery().openDlg({
        // parent: window.top,//此行调遮罩
        height: 700, // 此行调高度
        width: 800,
        url: url,
        title: '出差申请单选择',
      });
    },
    viewApply: function () {
      var applicantBillCd = jQuery('#applicantBillCd').val();
      doAppStatusFlow('差旅申请单详情', applicantBillCd, 'HR02001');
    },
    // 统计单据数量
    sumBillCount: sumBillCount,
  };
})();

// 城市间交通费
rmbtrip.citytraffic = (function () {
  let i = 0; // 行变量
  let vehicleArr = []; // 交通工具数组
  let jsonArray = []; //回显数据
  return {
    initData: function (index, value) {
      jsonArray[index] = value;
    },
    loadData: function () {
      jQuery('#citytrafficNew').jqGrid('clearGridData');
      setTimeout(() => {
        for (let k = 0; k < jsonArray.length; k++) {
          rmbtrip.citytraffic.addGradRow(jsonArray[k]);
        }
      }, 100);
    },
    init: async function () {
      // 初始化表格
      // jQuery('#citytrafficNew').innerHTML = '111';
      // jQuery('#listPager1').innerHTML = '222';
      // jQuery('#citytrafficNew').jqGrid('clearGridData');
      // jQuery('#citytrafficNew').jqGrid('reloadGrid');
      // console.log('111', jQuery('#citytrafficNew').jqGrid());

      jQuery('#gview_citytraffic').innerHTML = '222';
      // 未初始化设置1
      i = $('#citytrafficNew').find('tr').length;
      // 加载支付方式下拉列表
      await ajaxFormRequest(
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
      await jQuery('#citytrafficNew').jqGrid({
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
                "<center><input type='text' disabled='disabled' style='text-align:center;width:100%;height:30px;border: 1px solid #ccc;border-radius: 4px;color: #555;background-color: #eee;' class='form_datetime' name='tab1_startTime' readonly placeholder='出发时间' value='" +
                (value != undefined ? value : '') +
                "'/></center>"
              );
            },
            align: 'center',
            sortable: false,
          },
          {
            name: 'tab1_endTime',
            index: 'tab1_endTime',
            formatter: function (value, grid, rows, state) {
              return (
                "<center><input type='text' disabled='disabled' style='text-align:center;width:100%;height:30px;border: 1px solid #ccc;border-radius: 4px;color: #555;background-color: #eee;' class='form_time' name='tab1_endTime' readonly placeholder='到达时间' value='" +
                (value != undefined ? value : '') +
                "'/></center>"
              );
            },
            align: 'center',
            sortable: false,
          },
          {
            name: 'tab1_startAddressName',
            index: 'tab1_startAddressName',
            formatter: function (value, grid, rows, state) {
              // 开始地主键
              var tab1_startAddressName = 'tab1_startAddressName_' + grid.rowId;
              return (
                "<center><input type='text' disabled='disabled' style='text-align:center' class='form-control' id='tab1_startAddressName_" +
                grid.rowId +
                "' name='tab1_startAddressName' readonly placeholder='出发地' onclick='rmbtrip.rmbtripDetail.tree.showOrgTree(\"" +
                tab1_startAddressName +
                "\")' value='" +
                (value != undefined ? value.name : '') +
                "'/><input type='hidden' id='tab1_startAddressName_" +
                grid.rowId +
                "_value' name='tab1_startAddressId' value='" +
                (value != undefined ? value.code : '') +
                "'/></center>"
              );
            },
            align: 'center',
            sortable: false,
          },
          {
            name: 'tab1_endAddressName',
            index: 'tab1_endAddressName',
            formatter: function (value, grid, rows, state) {
              // 结束地主键
              var tab1_endAddressName = 'tab1_endAddressName_' + grid.rowId;
              return (
                "<center><input type='text' disabled='disabled' style='text-align:center' class='form-control' id='tab1_endAddressName_" +
                grid.rowId +
                "' name='tab1_endAddressName' readonly placeholder='结束地'  onclick='rmbtrip.rmbtripDetail.tree.showOrgTree(\"" +
                tab1_endAddressName +
                "\")' value='" +
                (value != undefined ? value.name : '') +
                "'/><input type='hidden' id='tab1_endAddressName_" +
                grid.rowId +
                "_value' name='tab1_endAddressId' value='" +
                (value != undefined ? value.code : '') +
                "'/></center>"
              );
            },
            align: 'center',
            sortable: false,
          },
          {
            name: 'tab1_vehicle',
            index: 'tab1_vehicle',
            formatter: function (value, grid, rows, state) {
              var option = '';
              // 填充交通工具
              for (let j = 0; j < vehicleArr.length; j++) {
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
                "<center><select type='text' disabled='disabled' class='form-control citytraffic-select' id='tab1_vehicle_" +
                grid.rowId +
                "' name='tab1_vehicle'>" +
                option +
                '</select></center>'
              );
            },
            align: 'center',
            sortable: false,
          },
          {
            name: 'tab1_amount',
            index: 'tab1_amount',
            formatter: function (value, grid, rows, state) {
              return (
                "<center><input type='text' disabled='disabled' style='text-align:center' class='form-control' name='tab1_amount' placeholder='价税合计' onblur='rmbtrip.citytraffic.validateNumber(this)' onkeyup='this.value=this.value.replace(/[^0-9.]/g,\"\")' maxlength='15' value='" +
                (value != undefined ? formatAmount(value) : '') +
                "'/></center>"
              );
            },
            align: 'center',
            sortable: false,
          },
        ],
        autowidth: true,
        height: '100%',
        rownumbers: true, // 显示行号
        multiselect: false, // 多选（表格会多出一列选择框）
        mtype: 'post',
        viewrecords: false,
        pagination: false,
        expandAll: false,
        pager: '#listPager1',
        pgbuttons: false,
        shrinkToFit: true,
        loadComplete: function (e) {},
        loadError: function (e, e1, e2) {
          jQuery('#citytrafficNew').footerData('set', {});
          $($('.footrow').find('[aria-describedby="citytraffic_tab1_vehicle"]')[0]).html('合计');
          jQuery('#citytrafficNew').jqGrid('setGridWidth', jQuery('.nav.nav-tabs').width(), true);
          //回显数据
          rmbtrip.citytraffic.loadData();
        },
        caption: '',
        footerrow: true,
        gridComplete: function () {
          jQuery('#citytrafficNew').footerData('set', {});
          $($('.footrow').find('[aria-describedby="citytraffic_tab1_vehicle"]')[0]).html('合计');
        },
      });
      // 隐藏其它控件
      jQuery('#citytrafficNew').jqGrid('navGrid', '#listPager1', {
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

      jQuery(window).on('resize.jqGrid', function () {
        jQuery('#citytrafficNew').jqGrid('setGridWidth', $('.nav.nav-tabs').width());
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
      jQuery('#citytrafficNew').jqGrid('addRowData', i, json || {});
      // 初始化日期控件
      $.initDataPlugin(); // 1222
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
              for (let i = 0; i < len; i++) {
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
        for (let j = 0; j < vehicleArr.length; j++) {
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
      $('#citytrafficNew')
        .find('input')
        .each(function () {
          if ($(this).attr('type') != 'button') {
            if ($(this).val() == '' || $(this).val() == undefined) {
              $(this).css('background-color', 'yellow');
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
              $(this).css('background-color', '#fff');
            }
          }
        });
      // 判断城市间交通费
      if ($('#citytrafficNew').find('tr').length <= 1) {
        sweetAlert({
          title: '录入提示',
          text: '城市间交通费不能为空',
          type: 'error',
          showConfirmButton: true,
          confirmButtonText: '确认',
        });
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
        } else {
          // 格式化两位小数
          e.value = fee.Common.formatAmount(e.value);
        }
      }
    },
  };
})();

// 市内交通费
rmbtrip.cityinside = (function () {
  let i; // 行变量
  let vehicleArr = []; // 交通工具数组
  let jsonArray = []; //回显数据
  return {
    initData: function (index, value) {
      jsonArray[index] = value;
    },
    loadData: function () {
      setTimeout(() => {
        for (let k = 0; k < jsonArray.length; k++) {
          rmbtrip.cityinside.addGradRow(jsonArray[k]);
        }
      }, 100);
    },
    init: async function () {
      // 未初始化设置1
      i = $('#cityinsideNew').find('tr').length;
      // 加载支付方式下拉列表
      await ajaxFormRequest(
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
      await jQuery('#cityinsideNew').jqGrid({
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
                "<center><input type='text' disabled='disabled' style='text-align:center;width:100%;height:30px;border: 1px solid #ccc;border-radius: 4px;color: #555;background-color: #eee;' class='form_datetime' name='tab2_startTime' placeholder='出发时间' value='" +
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
                "<center><input type='text' disabled='disabled' style='text-align:center;width:100%;height:30px;border: 1px solid #ccc;border-radius: 4px;color: #555;background-color: #eee;' class='form_time' name='tab2_endTime' readonly placeholder='到达时间' value='" +
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
              // 开始地主键
              var tab2_startAddressName = 'tab2_startAddressName_' + grid.rowId;
              return (
                "<center><input type='text' disabled='disabled' style='text-align:center' class='form-control' id='tab2_startAddressName_" +
                grid.rowId +
                "' name='tab2_startAddressName' readonly placeholder='出发地' onclick='rmbtrip.rmbtripDetail.tree.showOrgTree(\"" +
                tab2_startAddressName +
                "\")' value='" +
                (value != undefined ? value.name : '') +
                "'/><input type='hidden' id='tab2_startAddressName_" +
                grid.rowId +
                "_value' name='tab2_startAddressId' value='" +
                (value != undefined ? value.code : '') +
                "'/></center>"
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
              // 结束地主键
              var tab2_endAddressName = 'tab2_endAddressName_' + grid.rowId;
              return (
                "<center><input type='text' disabled='disabled' style='text-align:center' class='form-control' id='tab2_endAddressName_" +
                grid.rowId +
                "' name='tab2_endAddressName' readonly placeholder='结束地'  onclick='rmbtrip.rmbtripDetail.tree.showOrgTree(\"" +
                tab2_endAddressName +
                "\")' value='" +
                (value != undefined ? value.name : '') +
                "'/><input type='hidden' id='tab2_endAddressName_" +
                grid.rowId +
                "_value' name='tab2_endAddressId' value='" +
                (value != undefined ? value.code : '') +
                "'/></center>"
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
              for (let j = 0; j < vehicleArr.length; j++) {
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
                "<center><select type='text' disabled='disabled' class='form-control citytraffic-select' id='tab2_vehicle_" +
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
                "<center><input type='text' disabled='disabled' style='text-align:center' class='form-control' name='tab2_amount' placeholder='价税合计' onblur='rmbtrip.citytraffic.validateNumber(this)' onkeyup='this.value=this.value.replace(/[^0-9.]/g,\"\")' maxlength='15' value='" +
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
        multiselect: false, // 多选（表格会多出一列选择框）
        mtype: 'post',
        viewrecords: false,
        pagination: false,
        expandAll: false,
        pager: '#listPager2',
        pgbuttons: false,
        shrinkToFit: true,
        loadComplete: function (e) {},
        loadError: function (e, e1, e2) {
          jQuery('#cityinsideNew').footerData('set', {});
          $($('.footrow').find('[aria-describedby="cityinside_tab2_vehicle"]')[0]).html('合计');

          jQuery('#cityinsideNew').jqGrid('setGridWidth', jQuery('.nav.nav-tabs').width(), true);
          //回显数据
          rmbtrip.cityinside.loadData();
        },
        caption: '',
        footerrow: true,
        gridComplete: function () {
          jQuery('#cityinsideNew').footerData('set', {});
          $($('.footrow').find('[aria-describedby="cityinside_tab2_vehicle"]')[0]).html('合计');
        },
      });
      // 隐藏其它控件
      jQuery('#cityinsideNew').jqGrid('navGrid', '#listPager2', {
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
      jQuery(window).on('resize.jqGrid', function () {
        jQuery('#cityinsideNew').jqGrid('setGridWidth', $('.nav.nav-tabs').width());
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
      jQuery('#cityinsideNew').jqGrid('addRowData', i, json != undefined ? json : {});
      // 初始化日期控件
      $.initDataPlugin();
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
              for (let i = 0; i < len; i++) {
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
        for (let j = 0; j < vehicleArr.length; j++) {
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
      $('#cityinsideNew')
        .find('input')
        .each(function () {
          if ($(this).attr('type') != 'button') {
            if ($(this).val() == '' || $(this).val() == undefined) {
              $(this).css('background-color', 'yellow');
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
              $(this).css('background-color', '#fff');
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
        }
        // 格式化金额
        e.value = fee.Common.formatAmount(e.value);
      }
    },
    validateDetails: function () {
      // 验证重复区划
      // 开始日期
      var startTimes = $('#cityinsideNew .form_datetime');
      // 结束日期
      var endTimes = $('#cityinsideNew .form_time');
      // 验证是否在出差申请单中
      // 开始日期
      var cityStartTimes = $('#citytrafficNew .form_datetime');
      // 结束日期
      var cityEndTimes = $('#citytrafficNew .form_time');
      for (let i = 0; i < startTimes.length; i++) {
        var isHave = false;
        for (let j = 0; j < cityStartTimes.length; j++) {
          // 判断是否属于某一个时间段
          if (
            startTimes[i].value >= cityStartTimes[j].value &&
            startTimes[i].value <= cityEndTimes[j].value &&
            endTimes[i].value >= cityStartTimes[j].value &&
            endTimes[i].value <= cityEndTimes[j].value
          ) {
            isHave = true;
            break;
          }
        }
        if (!isHave) {
          sweetAlert({
            title: '录入提示',
            text: '市内交通费时间不在城市间交通费时间之内',
            type: 'error',
            showConfirmButton: true,
            confirmButtonText: '确认',
          });
          return false;
        }
      }
      return true;
    },
  };
})();

// 住宿费
rmbtrip.hotel = (function () {
  let i; // 行变量
  let vehicleArr = []; // 交通工具数组
  let taxRateArr = []; // 税率数组
  let jsonArray = []; //回显数据
  return {
    initData: function (index, value) {
      jsonArray[index] = value;
    },
    initData2: function (data) {
      if (data) jsonArray = data;
    },
    loadData: function () {
      jQuery('#hotelNew').jqGrid('clearGridData');
      setTimeout(() => {
        for (let k = 0; k < jsonArray.length; k++) {
          rmbtrip.hotel.addGradRow(jsonArray[k]);
        }
      });
    },
    init: async function () {
      // 未初始化设置1
      i = $('#hotelNew').find('tr').length;
      // 加载支付方式下拉列表
      await ajaxFormRequest(
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
      await ajaxFormRequest(
        WEB_CTX_PATH +
          '/codeAction.do?method=getSelectOptions&element2CodeType=' +
          encodeURI(encodeURI("{'taxRate':'taxRate'}")),
        function (returnData) {
          taxRateArr = returnData.result.taxRate;
          // 初始化回显的下拉框
          // rmbtrip.citytraffic.selected();
        },
        function (state) {},
        'rmbtripForm',
        true,
        ' '
      );
      // 初始化表格
      await jQuery('#hotelNew').jqGrid({
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
          '标准/人/天',
        ],
        operatorKey: 'act',
        colModel: [
          {
            name: 'tab3_startTime',
            index: 'tab3_startTime',
            formatter: function (value, grid, rows, state) {
              return (
                "<center><input type='text' disabled='disabled' style='text-align:center;width:100%;height:30px;border: 1px solid #ccc;border-radius: 4px;color: #555;background-color: #eee;' class='hotel_datetime' name='tab3_startTime' readonly placeholder='开始时间' value='" +
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
                "<center><input type='text' disabled='disabled' style='text-align:center;width:100%;height:30px;border: 1px solid #ccc;border-radius: 4px;color: #555;background-color: #eee;' class='hotel_time' name='tab3_endTime' readonly placeholder='结束时间' value='" +
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
              for (let j = 0; j < vehicleArr.length; j++) {
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
                "<center><select type='text' disabled='disabled' class='form-control citytraffic-select' id='tab3_traveType_" +
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
              // 开始地主键
              var tab3_city = 'tab3_city_' + grid.rowId;
              return (
                "<center><input type='text' disabled='disabled' style='text-align:center' class='form-control' id='tab3_city_" +
                grid.rowId +
                "' name='tab3_city' readonly placeholder='城市' onclick='rmbtrip.rmbtripDetail.tree.showOrgTree(\"" +
                tab3_city +
                "\")' value='" +
                (value != undefined ? value : '') +
                "'/><input type='hidden' id='tab3_city_" +
                grid.rowId +
                "_value' name=''/></center>"
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
                "<center><input type='text' disabled='disabled' style='text-align:center' class='form-control' id='tab3_personCount_" +
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
                "<center><input type='text' disabled='disabled' style='text-align:center' class='form-control' id='tab3_dayNumber_" +
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
                "<center><input type='text' disabled='disabled' style='text-align:center' class='form-control' name='tab3_amount' placeholder='价税合计' onblur='rmbtrip.hotel.validateNumber(this);rmbtrip.hotel.changeActualDayNumber(this);rmbtrip.hotel.checkAmount(this)' onkeyup='this.value=this.value.replace(/[^0-9.]/g,\"\")' maxlength='15' value='" +
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
                "<center><input type='text' disabled='disabled' style='text-align:center;' class='form-control' name='tab3_exceptTaxRateAm' placeholder='金额' onblur='rmbtrip.citytraffic.validateNumber(this)' onkeyup='this.value=this.value.replace(/[^0-9.]/g,\"\")' maxlength='15' value='" +
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
              for (let j = 0; j < taxRateArr.length; j++) {
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
                "<center><select type='text' disabled='disabled' class='form-control citytraffic-select' id='tab3_taxRate_" +
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
                "<center><input type='text' disabled='disabled' style='text-align:center;' class='form-control' name='tab3_taxRateAm' placeholder='税额' maxlength='15' value='" +
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
                "<center><input type='text' disabled='disabled' style='text-align:center' class='form-control' id='tab3_actualDayNumber_" +
                grid.rowId +
                "' name='tab3_actualDayNumber' placeholder='实际/人/天'  maxlength='15' readonly value='" +
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
                "<center><input type='text' disabled='disabled' style='text-align:center' class='form-control' id='tab3_standardValue_" +
                grid.rowId +
                "' name='tab3_standardValue' placeholder='标准/人/天' maxlength='15' value='" +
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
        multiselect: false, // 多选（表格会多出一列选择框）
        mtype: 'post',
        viewrecords: false,
        pagination: false,
        expandAll: false,
        pager: '#listPager3',
        pgbuttons: false,
        shrinkToFit: true,
        loadComplete: function (e) {},
        loadError: function (e, e1, e2) {
          jQuery('#hotelNew').footerData('set', {});
          $($('.footrow').find('[aria-describedby="hotel_tab3_dayNumber"]')[0]).html('合计');

          jQuery('#hotelNew').jqGrid('setGridWidth', jQuery('.nav.nav-tabs').width(), true);
          //回显数据
          rmbtrip.hotel.loadData();
          ldaccompany();
        },
        caption: '',
        footerrow: true,
        gridComplete: function () {
          jQuery('#hotelNew').footerData('set', {});
          $($('.footrow').find('[aria-describedby="hotel_tab3_dayNumber"]')[0]).html('合计');
        },
      });

      // 初始化日期控件
      rmbtrip.hotel.initDate();

      // 隐藏其它控件
      jQuery('#hotelNew').jqGrid('navGrid', '#listPager3', {
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

      jQuery(window).on('resize.jqGrid', function () {
        jQuery('#hotelNew').jqGrid('setGridWidth', $('.nav.nav-tabs').width());
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
      jQuery('#hotelNew').jqGrid('addRowData', i, json != undefined ? json : {});
      // 初始化日期控件
      rmbtrip.hotel.initDate();
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
              for (let i = 0; i < len; i++) {
                $(id).jqGrid('delRowData', selectedRowIds[0]);
              }
              // 增加金额单据统计
              sumBillCount();
            }
          }
        );
      }
    },
    checkAmount: function (e) {
      //验证金额
      // 金额
      var amountTd = e.parentElement.parentElement.parentElement.children[8];
      var amount = amountTd.children[0].children[0];
      // 天数
      var dayNumberTd = e.parentElement.parentElement.parentElement.children[7];
      var dayNumber = dayNumberTd.children[0].children[0];
      // 人数
      var personCountTd = e.parentElement.parentElement.parentElement.children[6];
      var personCount = personCountTd.children[0].children[0];
      // 补助标准
      var standardTd = e.parentElement.parentElement.parentElement.children[12];
      var standard = standardTd.children[0].children[0];
      // 提示
      if (
        personCount.value > 0 &&
        dayNumber.value > 0 &&
        standard.value > 0 &&
        amount.value > dayNumber.value * standard.value * personCount.value
      ) {
        sweetAlert({
          title: '录入提示',
          text: '金额超标准',
          type: 'error',
          showConfirmButton: true,
          confirmButtonText: '确认',
        });
      }
    },
    validateDetails: function () {
      // 验证重复区划
      // 开始日期
      var startTimes = $('.hotel_datetime');
      // 结束日期
      var endTimes = $('.hotel_time');
      for (let i = 0; i < startTimes.length; i++) {
        for (let j = 0; j < startTimes.length && i != j; j++) {
          // 判断是否属于某一个时间段
          if (
            (startTimes[i].value >= startTimes[j].value &&
              startTimes[i].value <= endTimes[j].value) ||
            (endTimes[i].value >= startTimes[j].value && endTimes[i].value <= endTimes[j].value)
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
      // 验证是否在出差申请单中
      // 开始日期
      var cityStartTimes = $('#citytrafficNew .form_datetime');
      // 结束日期
      var cityEndTimes = $('#citytrafficNew .form_time');
      for (let i = 0; i < startTimes.length; i++) {
        var isHave = false;
        for (let j = 0; j < cityStartTimes.length; j++) {
          // 判断是否属于某一个时间段
          if (
            startTimes[i].value >= cityStartTimes[j].value &&
            startTimes[i].value <= cityEndTimes[j].value &&
            endTimes[i].value >= cityStartTimes[j].value &&
            endTimes[i].value <= cityEndTimes[j].value
          ) {
            isHave = true;
            break;
          }
        }
        if (!isHave) {
          sweetAlert({
            title: '录入提示',
            text: '住宿费时间不在城市间交通费时间之内',
            type: 'error',
            showConfirmButton: true,
            confirmButtonText: '确认',
          });
          return false;
        }
      }

      return true;
    },
    delRow: function (_id) {
      $('#hotelNew .hotel_tr_' + _id).remove();
      // 增加金额单据统计
      sumBillCount();
    },
    selected: function () {
      // 加载下拉列表和选中项
      $('.hotel-select').each(function () {
        var selected = $(this).attr('check');
        for (let j = 0; j < vehicleArr.length; j++) {
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
      $('#hotelNew')
        .find('input')
        .each(function () {
          if ($(this).attr('type') != 'button') {
            if ($(this).val() == '' || $(this).val() == undefined) {
              $(this).css('background-color', 'yellow');
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
              $(this).css('background-color', '#fff');
            }
          }
        });

      // 校验重复
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
        } else {
          // 格式化两位小数
          e.value = fee.Common.formatAmount(e.value);
        }
      }
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
          var startData = new Date(Date.parse($(this).val().replace(/-/g, '/')));
          var endData = new Date(Date.parse(endt.replace(/-/g, '/')));
          var days = (endData.getTime() - startData.getTime()) / (1000 * 60 * 60 * 24);
          dayNumber.value = days;
          var td = $(this).parent().parent().parent().children()[8];
          // 金额
          var amount = td.children[0].children[0];
          var td = $(this).parent().parent().parent().children()[6];
          // 人数
          var personCount = td.children[0].children[0];
          // 设置实际人天
          if (
            amount.value != '' &&
            amount.value > 0 &&
            personCount.value != '' &&
            personCount.value > 0
          ) {
            var td = $(this).parent().parent().parent().children()[11];
            // 实际人天
            var actualDayNumber = td.children[0].children[0];
            actualDayNumber.value = toFixed(amount.value / personCount.value / days);
          }
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
          var endt = $(this).val().replace(':', '');
          var td = $(this).parent().parent().parent().children()[2];
          var stat = td.children[0].children[0];
          stat = stat.value.replace(':', '');
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
          var startData = new Date(Date.parse(stat.replace(/-/g, '/')));
          var endData = new Date(Date.parse(endt.replace(/-/g, '/')));
          var days = (endData.getTime() - startData.getTime()) / (1000 * 60 * 60 * 24);
          dayNumber.value = days;
          var td = $(this).parent().parent().parent().children()[8];
          // 金额
          var amount = td.children[0].children[0];
          var td = $(this).parent().parent().parent().children()[6];
          // 人数
          var personCount = td.children[0].children[0];
          // 设置实际人天
          if (
            amount.value != '' &&
            amount.value > 0 &&
            personCount.value != '' &&
            personCount.value > 0
          ) {
            var td = $(this).parent().parent().parent().children()[11];
            // 实际人天
            var actualDayNumber = td.children[0].children[0];
            actualDayNumber.value = toFixed(amount.value / personCount.value / days);
          }
        });
    },
    changeActualDayNumber: function (e) {
      //金额
      var amountTd = e.parentElement.parentElement.parentElement.children[8];
      var amount = amountTd.children[0].children[0];
      // 天数
      var dayNumberTd = e.parentElement.parentElement.parentElement.children[7];
      var dayNumber = dayNumberTd.children[0].children[0];
      // 人数
      var personCountTd = e.parentElement.parentElement.parentElement.children[6];
      var personCount = personCountTd.children[0].children[0];
      // 补助标准
      var standardTd = e.parentElement.parentElement.parentElement.children[12];
      var standard = standardTd.children[0].children[0];
      // 重新计算实际人天
      if (amount.value > 0 && personCount.value > 0 && dayNumber.value > 0 && standard.value > 0) {
        var td = e.parentElement.parentElement.parentElement.children[11];
        // 实际人天
        var actualDayNumber = td.children[0].children[0];
        actualDayNumber.value = toFixed(amount.value / personCount.value / dayNumber.value);
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
          var startData = new Date(Date.parse(startTime.value.replace(/-/g, '/')));
          var endData = new Date(Date.parse(endTime.value.replace(/-/g, '/')));
          var days = (endData.getTime() - startData.getTime()) / (1000 * 60 * 60 * 24);
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
  let i; // 行变量
  let vehicleArr; // 交通工具数组
  let jsonArray = []; //回显数据
  return {
    initData: function (index, value) {
      jsonArray[index] = value;
    },
    loadData: function () {
      jQuery('#subsidyNew').jqGrid('clearGridData');
      setTimeout(() => {
        for (let k = 0; k < jsonArray.length; k++) {
          rmbtrip.subsidy.addGradRow(jsonArray[k]);
        }
      }, 100);
    },
    init: function () {
      // 未初始化设置1
      i = $('#subsidyNew').find('tr').length;

      // 初始化表格
      jQuery('#subsidyNew').jqGrid({
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
                "<center><input type='text' disabled='disabled' style='text-align:center;width:100%;height:30px;border: 1px solid #ccc;border-radius: 4px;color: #555;background-color: #eee;' class='subsidy_datetime' name='tab4_startTime' readonly placeholder='开始时间' value='" +
                (value != undefined ? value : '') +
                "'/></center>"
              );
            },
            align: 'center',
            sortable: false,
          },
          {
            name: 'tab4_endTime',
            index: 'tab4_endTime',
            formatter: function (value, grid, rows, state) {
              return (
                "<center><input type='text' disabled='disabled' style='text-align:center;width:100%;height:30px;border: 1px solid #ccc;border-radius: 4px;color: #555;background-color: #eee;' class='subsidy_time' name='tab4_endTime' readonly placeholder='结束时间' value='" +
                (value != undefined ? value : '') +
                "'/></center>"
              );
            },
            align: 'center',
            sortable: false,
          },
          {
            name: 'tab4_subsidyType',
            index: 'tab4_subsidyType',
            formatter: function (value, grid, rows, state) {
              return (
                "<center><input type='text' disabled='disabled' style='text-align:center' class='form-control' name='tab4_subsidyType' readonly placeholder='' value='" +
                (value != undefined ? value : '') +
                "'/></center>"
              );
            },
            align: 'center',
            sortable: false,
          },
          {
            name: 'tab4_city',
            index: 'tab4_city',
            formatter: function (value, grid, rows, state) {
              // 开始地主键
              var tab4_city = 'tab4_city_' + grid.rowId;
              return (
                "<center><input type='text' disabled='disabled' style='text-align:center' class='form-control' id='tab4_city_" +
                grid.rowId +
                "' name='tab4_city' readonly placeholder='城市' onclick='rmbtrip.rmbtripDetail.tree.showOrgTree(\"" +
                tab4_city +
                "\")' value='" +
                (value != undefined ? value : '') +
                "'/><input type='hidden' id='tab4_city_" +
                grid.rowId +
                "_value' name=''/></center>"
              );
            },
            align: 'center',
            sortable: false,
          },
          {
            name: 'tab4_dayNumber',
            index: 'tab4_dayNumber',
            formatter: function (value, grid, rows, state) {
              return (
                "<center><input type='text' disabled='disabled' style='text-align:center' class='form-control' id='tab4_dayNumber_" +
                grid.rowId +
                "' name='tab4_dayNumber' placeholder='天数' onblur='rmbtrip.subsidy.changeDayNumber(this)' onkeyup='this.value=this.value.replace(/[^0-9]/g,\"\")' maxlength='15' value='" +
                (value != undefined ? value : '') +
                "'/></center>"
              );
            },
            align: 'center',
            sortable: false,
          },
          {
            name: 'tab4_amount',
            index: 'tab4_amount',
            formatter: function (value, grid, rows, state) {
              return (
                "<center><input type='text' disabled='disabled' style='text-align:center' class='form-control' id='tab4_amount_" +
                grid.rowId +
                "' name='tab4_amount' placeholder='价税合计' onblur='rmbtrip.subsidy.validateNumber(this);rmbtrip.subsidy.checkAmount(this)' onkeyup='this.value=this.value.replace(/[^0-9.]/g,\"\")' maxlength='15' value='" +
                (value != undefined ? formatAmount(value) : '') +
                "'/></center>"
              );
            },
            align: 'center',
            sortable: false,
          },
          {
            name: 'tab4_standardValue',
            index: 'tab4_standardValue',
            formatter: function (value, grid, rows, state) {
              return (
                "<center><input type='text' disabled='disabled' style='text-align:center' class='form-control' id='tab4_standardValue_" +
                grid.rowId +
                "' name='tab4_standardValue' placeholder='标准/人/天' maxlength='15' value='" +
                (value != undefined ? formatAmount(value) : '') +
                "' readonly/></center>"
              );
            },
            align: 'center',
            sortable: false,
          },
        ],
        autowidth: true,
        height: '100%',
        rownumbers: true, // 显示行号
        multiselect: false, // 多选（表格会多出一列选择框）
        // mtype: 'post',
        viewrecords: false,
        pagination: false,
        expandAll: false,
        pager: '#listPager4',
        pgbuttons: false,
        shrinkToFit: true,
        loadComplete: function (e) {},
        loadError: function (e, e1, e2) {
          jQuery('#subsidyNew').footerData('set', {});
          $($('.footrow').find('[aria-describedby="subsidy_tab4_dayNumber"]')[0]).html('合计');

          jQuery('#subsidyNew').jqGrid('setGridWidth', jQuery('.nav.nav-tabs').width(), true);
          //回显数据
          rmbtrip.subsidy.loadData();

          //如果是实报实销，则直接显示 实报实销
          $('#subsidyNew')
            .find("input[name='tab4_standardValue']")
            .each(function () {
              var standardId = $(this).attr('id');
              var standardVal = fee.Common.clearFormatAmount($('#' + standardId).val());

              if (
                standardVal == '9999.00' ||
                standardVal == '9999' ||
                standardVal == '9,999' ||
                standardVal == '9,999.00'
              ) {
                $(this).val('实报实销');
              } else {
                $(this).val(
                  fee.Common.formatAmount(parseFloat(standardVal != '' ? standardVal : 0))
                );
              }
            });
        },
        caption: '',
        footerrow: true,
        gridComplete: function () {
          jQuery('#subsidyNew').footerData('set', {});
          $($('.footrow').find('[aria-describedby="subsidy_tab4_dayNumber"]')[0]).html('合计');
        },
      });

      // 初始化时间控件 初始化表格之后进行初始化时间空间操作
      rmbtrip.subsidy.initDate();

      // 隐藏其它控件
      jQuery('#subsidyNew').jqGrid('navGrid', '#listPager4', {
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

      jQuery(window).on('resize.jqGrid', function () {
        jQuery('#subsidyNew').jqGrid('setGridWidth', $('.nav.nav-tabs').width());
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
      jQuery('#subsidyNew').jqGrid('addRowData', i, json || {});
      // 初始化日期控件
      rmbtrip.subsidy.initDate();
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
              for (let i = 0; i < len; i++) {
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
        for (let j = 0; j < vehicleArr.length; j++) {
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
      $('#subsidyNew')
        .find('input')
        .each(function () {
          if ($(this).attr('type') != 'button') {
            if ($(this).val() == '' || $(this).val() == undefined) {
              $(this).css('background-color', 'yellow');
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
              $(this).css('background-color', '#fff');
            }
          }
        });

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
          sweetAlert({
            title: '录入提示',
            text: '请输入正确的数字',
            type: 'error',
            showConfirmButton: true,
            confirmButtonText: '确认',
          });
          e.value = '';
          e.focus();
        } else {
          // 格式化两位小数
          e.value = fee.Common.formatAmount(e.value);
        }
      }
    },
    checkAmount: function (e) {
      // 金额
      var amountTd = e.parentElement.parentElement.parentElement.children[6];
      var amount = amountTd.children[0].children[0];
      // 天数
      var dayNumberTd = e.parentElement.parentElement.parentElement.children[5];
      var dayNumber = dayNumberTd.children[0].children[0];
      // 补助标准
      var standardTd = e.parentElement.parentElement.parentElement.children[7];
      var standard = standardTd.children[0].children[0];
      // 设置实际人天
      if (
        dayNumber.value > 0 &&
        standard.value > 0 &&
        amount.value > dayNumber.value * standard.value
      ) {
        sweetAlert({
          title: '录入提示',
          text: '金额超标准',
          type: 'error',
          showConfirmButton: true,
          confirmButtonText: '确认',
        });
      }
    },
    validateDetails: function () {
      // 验证重复区划
      // 开始日期
      var startTimes = $('.subsidy_datetime');
      // 结束日期
      var endTimes = $('.subsidy_time');
      for (let i = 0; i < startTimes.length; i++) {
        for (let j = 0; j < startTimes.length && i != j; j++) {
          // 判断是否属于某一个时间段
          if (
            (startTimes[i].value >= startTimes[j].value &&
              startTimes[i].value <= endTimes[j].value) ||
            (endTimes[i].value >= startTimes[j].value && endTimes[i].value <= endTimes[j].value)
          ) {
            sweetAlert({
              title: '录入提示',
              text: '出差补助时间段重叠',
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
      // 验证是否在出差申请单中
      // 开始日期
      var cityStartTimes = $('#citytrafficNew .form_datetime');
      // 结束日期
      var cityEndTimes = $('#citytrafficNew .form_time');
      for (let i = 0; i < startTimes.length; i++) {
        var isHave = false;
        for (let j = 0; j < cityStartTimes.length; j++) {
          // 判断是否属于某一个时间段
          if (
            startTimes[i].value >= cityStartTimes[j].value &&
            startTimes[i].value <= cityEndTimes[j].value &&
            endTimes[i].value >= cityStartTimes[j].value &&
            endTimes[i].value <= cityEndTimes[j].value
          ) {
            isHave = true;
            break;
          }
        }
        if (!isHave) {
          sweetAlert({
            title: '录入提示',
            text: '出差补助时间不在城市间交通费时间之内',
            type: 'error',
            showConfirmButton: true,
            confirmButtonText: '确认',
          });
          return false;
        }
      }
      return true;
    },
    initDate: function (e) {
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
          var td = $(this).parent().parent().parent().children()[5];
          var dayNumber = td.children[0].children[0];
          if ($(this).val() != '' && $(this).val() >= endt) {
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
          var startData = new Date(Date.parse($(this).val().replace(/-/g, '/')));
          var endData = new Date(Date.parse(endt.replace(/-/g, '/')));
          var days = (endData.getTime() - startData.getTime()) / (1000 * 60 * 60 * 24);
          dayNumber.value = days;
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
          var td = $(this).parent().parent().parent().children()[2];
          var stat = td.children[0].children[0];
          stat = stat.value.replace(':', '');
          // 设置天数
          var td = $(this).parent().parent().parent().children()[5];
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
          var startData = new Date(Date.parse(stat.replace(/-/g, '/')));
          var endData = new Date(Date.parse(endt.replace(/-/g, '/')));
          var days = (endData.getTime() - startData.getTime()) / (1000 * 60 * 60 * 24);
          dayNumber.value = days;
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
          var startData = new Date(Date.parse(startTime.value.replace(/-/g, '/')));
          var endData = new Date(Date.parse(endTime.value.replace(/-/g, '/')));
          var days = (endData.getTime() - startData.getTime()) / (1000 * 60 * 60 * 24);
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
  let i; // 行变量
  let vehicleArr; // 交通工具数组
  let jsonArray = []; //回显数据
  return {
    initData: function (index, value) {
      jsonArray[index] = value;
    },
    loadData: function () {
      jQuery('#other').jqGrid('clearGridData');
      setTimeout(() => {
        for (let k = 0; k < jsonArray.length; k++) {
          rmbtrip.other.addGradRow(jsonArray[k]);
        }
      }, 100);
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
                "<center><input type='text' disabled='disabled' style='text-align:center' class='form-control amount' id='tab5_amount_" +
                grid.rowId +
                "' name='tab5_amount' placeholder='价税合计' onblur='rmbtrip.other.validateNumber(this)' onkeyup='this.value=this.value.replace(/[^0-9.]/g,\"\")' size='5' maxlength='15' value='" +
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
                "<center><input type='text' disabled='disabled' style='text-align:left' class='form-control' id='tab5_content_" +
                grid.rowId +
                "' name='tab5_content' placeholder='备注' size='30' maxlength='200' value='" +
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
        multiselect: false, // 多选（表格会多出一列选择框）
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
              for (let i = 0; i < len; i++) {
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
      $('.amount').each(function () {
        if ($(this).attr('type') != 'button') {
          if ($(this).val() == '' || $(this).val() == undefined) {
            $(this).css('background-color', 'yellow');
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
            $(this).css('background-color', '#fff');
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
  for (let k in date) {
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
// 保留小数点后两位小数
function toFixed(Number) {
  return Number.toFixed(2);
}
//根据checkbox来改变标准人天
function ldaccompany() {
  var accompany = 0;
  if ($('#accompany').is(':checked')) {
    $('#accompany').val('1');
  } else {
    $('#accompany').val('0');
  }
  $('#hotelNew')
    .find("input[name='tab3_standardValue']")
    .each(function () {
      var standardId = $(this).attr('id');
      var standardVal = fee.Common.clearFormatAmount($('#' + standardId).val());

      //如果是实报实销，则直接显示 实报实销
      if (
        standardVal == '9999.00' ||
        standardVal == '9999' ||
        standardVal == '9,999' ||
        standardVal == '9,999.00'
      ) {
        $(this).val('实报实销');
      } else {
        accompany = parseFloat(standardVal != '' ? standardVal : 0);
        $(this).val(fee.Common.formatAmount(accompany));
      }
    });
}
// 统计单据数量
function sumBillCount() {
  // TAB1金额
  var citytrafficAmounts = 0;
  $('#citytrafficNew')
    .find("input[name='tab1_amount']")
    .each(function () {
      var oldNum = fee.Common.clearFormatAmount($(this).val());
      citytrafficAmounts += parseFloat(oldNum != '' ? oldNum : 0);
    });
  // TAB2金额
  var cityinsideAmounts = 0;
  $('#cityinsideNew')
    .find("input[name='tab2_amount']")
    .each(function () {
      var oldNum = fee.Common.clearFormatAmount($(this).val());
      cityinsideAmounts += parseFloat(oldNum != '' ? oldNum : 0);
    });
  // TAB3金额
  var hotelAmounts = 0;
  $('#hotelNew')
    .find("input[name='tab3_amount']")
    .each(function () {
      var oldNum = fee.Common.clearFormatAmount($(this).val());
      hotelAmounts += parseFloat(oldNum != '' ? oldNum : 0);
    });
  // TAB4金额
  var subsidyAmounts = 0;
  $('#subsidyNew')
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
  // if (str && str.startWith('.')) {
  //   str = '0' + str;
  //   return fee.Common.formatAmount(str);
  // }
  return str;
}
