/*
 * 定义命名空间
 */
jQuery.namespace('vehicleExpense.vehicleExpenseList');
vehicleExpense.vehicleExpenseList = (function () {
  return {
    init: function () {
      vehicleExpense.vehicleExpenseList.gridInit();
      jQuery('#delBtn').on('click', vehicleExpense.vehicleExpenseList.deleteMainParam);
      jQuery('#queryBtn').on('click', vehicleExpense.vehicleExpenseList.doQuery);
      jQuery('#resetBtn').on('click', vehicleExpense.vehicleExpenseList.resetQuery);
    },
    /*
     * 生成表格组件
     */
    gridInit: function () {
      jQuery('#dataList').jqGrid({
        // 绝大部分情况下JS中单引号与双引号并无区别
        // 以下部分的值采用单引号和双引号无区别
        url: WEB_CTX_PATH + '/vehicleExpenseAction.do?method=doInit',
        regional: 'cn',
        datatype: 'json',
        colNames: [
          'id',
          '单据号',
          '车牌号码',
          '单据日期',
          '价税合计',
          '收款人/单位',
          '申请人',
          '业务内容',
          'state',
          '状态',
          'createDate',
        ],
        operatorKey: 'act',
        shrinkToFit: true,
        colModel: [
          {
            name: 'billUid',
            index: 'billUid',
            hidden: true,
            key: true,
          },
          {
            name: 'billNo',
            index: 'billNo',
          },
          {
            name: 'licensePlate',
            index: 'licensePlate',
            hidden: true,
          },
          {
            name: 'billDate',
            index: 'billDate',
            formatter: 'date',
            formatoptions: { srcformat: 'Y-m-d H:i:s', newformat: 'Y-m-d' },
            align: 'center',
          },
          {
            name: 'amount',
            index: 'amount',
            formatter: 'number',
            formatoptions: {
              decimalSeparator: '.',
              thousandsSeparator: ',',
              decimalPlaces: 2,
              defaultValue: '0.00',
            },
            align: 'right',
          },
          {
            name: 'applicateName',
            index: 'applicateName',
            align: 'center',
          },
          {
            name: 'agentName',
            index: 'agentName',
            align: 'center',
          },
          {
            name: 'remark',
            index: 'remark',
          },
          {
            name: 'state',
            index: 'state',
            hidden: true,
          },
          {
            name: 'stateName',
            index: 'stateName',
            align: 'center',
          },
          {
            name: 'createDate',
            index: 'createDate',
            hidden: true,
          },
        ],
        rowNum: 10, // 每页最大显示行数
        sortname: 'createDate',
        sortorder: 'desc',
        gridComplete: function () {
          var ids = jQuery('#dataList').jqGrid('getDataIDs');
          var userData = jQuery('#dataList').jqGrid('getGridParam', 'userData');
          for (var i = 0; i < ids.length; i++) {
            var appStatus = jQuery('#dataList').jqGrid('getCell', ids[i], 'stateName');
            /*alert(appStatus);*/
            var billNo = jQuery('#dataList').jqGrid('getCell', ids[i], 'billNo');

            if (appStatus == '') {
              var btn = '<span>待审批</span>';
              jQuery('#dataList').jqGrid('setRowData', ids[i], { stateName: btn });
            } else if (appStatus == '待审批') {
              var btn = '<span>待审批</span>';
              jQuery('#dataList').jqGrid('setRowData', ids[i], { stateName: btn });
            } else {
              var btn =
                "<a id='view' href='javascript:void(0);'  onclick=\"doAppStatusFlow('车辆费用报销','" +
                billNo +
                "','FEE01003');\">" +
                appStatus +
                '</a>';
              jQuery('#dataList').jqGrid('setRowData', ids[i], { stateName: btn });
            }
          }
        },
        autowidth: true, // grid的宽度会根据父元素的宽度自动重新计算
        height: '100%',
        multiselect: true, // 多选（表格会多出一列选择框）
        rownumbers: true, // 显示行号
        rowList: [10, 20, 30], // 其他可选每页最大显示行数
        pager: '#listPager',
        mtype: 'post',
        viewrecords: false,
        emptyMsg: '查询结果为空', // 如果设置了该选项，在表格为空数据时撑开表格并显示设置的信息
        caption: '车辆费用报销列表',
      });
      /*
       * 表格大小调整
       */
      jQuery(window).on('resize.jqGrid', function () {
        jQuery('#dataList').jqGrid('setGridWidth', jQuery('.col-xs-12').width(), true);
      });
      jQuery(window).triggerHandler('resize.jqGrid');
    },

    initSelect: function () {},

    //编辑或添加
    addOrEdit: function (clickType) {
      //码表id
      var paramIdArr = '';
      //页头
      var titleStr = '';
      //url
      var url = '';
      //判断id是否为空
      if (clickType == 'edit') {
        titleStr = '车辆费用报销单编辑';
        paramIdArr = $('#dataList').jqGrid('getGridParam', 'selarrrow');
        if (paramIdArr && paramIdArr.length > 1) {
          //选中多条
          sweetAlert({
            title: '提示',
            text: '只能选择一条数据进行编辑',
            type: 'error',
            showConfirmButton: true,
            confirmButtonText: '确认',
          });
          return;
        } else if (paramIdArr.length == 0) {
          var obj = $('#dataList').jqGrid('getRowData', paramIdArr[0]);
          if (obj.state == '') {
          }
          //未选中数据
          sweetAlert({
            title: '提示',
            text: '请选择一条数据进行编辑',
            type: 'error',
            showConfirmButton: true,
            confirmButtonText: '确认',
          });
          return;
        }

        var obj = $('#dataList').jqGrid('getRowData', paramIdArr[0]);
        if (obj.state == '2') {
          sweetAlert({
            title: '提示',
            text: '状态为审批中的数据不可以编辑！',
            type: 'error',
            showConfirmButton: true,
            confirmButtonText: '确认',
          });
          return;
        }

        url =
          WEB_CTX_PATH +
          '/vehicleExpenseAction.do?method=doAddOrEdit&actionType=' +
          clickType +
          '&billUid=' +
          paramIdArr[0];
      } else if (clickType == 'detail') {
        titleStr = '车辆费用报销单详细';
        paramIdArr = $('#dataList').jqGrid('getGridParam', 'selarrrow');
        if (paramIdArr && paramIdArr.length > 1) {
          //选中多条
          sweetAlert({
            title: '提示',
            text: '只能选择一条数据进行查看',
            type: 'error',
            showConfirmButton: true,
            confirmButtonText: '确认',
          });
          return;
        } else if (paramIdArr.length == 0) {
          //未选中数据
          sweetAlert({
            title: '提示',
            text: '请选择一条数据进行查看',
            type: 'error',
            showConfirmButton: true,
            confirmButtonText: '确认',
          });
          return;
        }
        url =
          WEB_CTX_PATH +
          '/vehicleExpenseAction.do?method=doAddOrEdit&actionType=' +
          clickType +
          '&billUid=' +
          paramIdArr[0];
      } else if (clickType == 'add') {
        titleStr = '车辆费用报销单新建';
        url = WEB_CTX_PATH + '/vehicleExpenseAction.do?method=doAddOrEdit&actionType=' + clickType;
      }
      //			jQuery().openDlg({
      //				height: 800,//此行调高度
      //				width: 1100,
      //				url:url,
      //				title: titleStr
      //			});
      layer.open({
        type: 2,
        title: titleStr,
        content: url,
        fix: true,
        area: ['100%', '100%'],
        //	           /*注释部分功能：弹窗后立即最大化*/
        success: function (layerObj) {
          var currLayer = jQuery(layerObj);
          currLayer
            .css({ top: '0px', left: '0px', width: '100%', height: jQuery(window).height() })
            .find('iframe')
            .css('height', jQuery(window).height() - 50);
        },
      });
    },
    //编辑或添加
    test: function (type) {
      //判断id是否为空
      var titleStr = '车辆费用报销单详细';
      var paramIdArr = $('#dataList').jqGrid('getGridParam', 'selarrrow');
      if (paramIdArr && paramIdArr.length > 1) {
        //选中多条
        sweetAlert({
          title: '提示',
          text: '只能选择一条数据进行查看',
          type: 'error',
          showConfirmButton: true,
          confirmButtonText: '确认',
        });
        return;
      } else if (paramIdArr.length == 0) {
        //未选中数据
        sweetAlert({
          title: '提示',
          text: '请选择一条数据进行查看',
          type: 'error',
          showConfirmButton: true,
          confirmButtonText: '确认',
        });
        return;
      }
      var url =
        WEB_CTX_PATH +
        '/vehicleExpenseAction.do?method=detail&viewType=' +
        type +
        '&billUid=' +
        $('#dataList').jqGrid('getRowData', paramIdArr[0]).billNo;
      layer.open({
        type: 2,
        title: titleStr,
        content: url,
        fix: true,
        area: ['100%', '100%'],
        //	           /*注释部分功能：弹窗后立即最大化*/
        success: function (layerObj) {
          var currLayer = jQuery(layerObj);
          currLayer
            .css({ top: '0px', left: '0px', width: '100%', height: jQuery(window).height() })
            .find('iframe')
            .css('height', jQuery(window).height() - 50);
        },
      });
    },
    //弹出代理新建页面
    goVehicleExpenseMainEdit: function () {
      //弹出新建车辆费用报销画面
      url = WEB_CTX_PATH + '/vehicleExpenseAction.do?method=goVehicleExpenseMainEdit';

      //			jQuery().openDlg({
      //				height: 800,//此行调高度
      //				width: 1100,
      //				url:url,
      //				title: "新建代理报销"
      //			});
      layer.open({
        type: 2,
        title: '新建代理报销',
        content: url,
        fix: true,
        area: ['100%', '100%'],
        //	           /*注释部分功能：弹窗后立即最大化*/
        success: function (layerObj) {
          var currLayer = jQuery(layerObj);
          currLayer
            .css({ top: '0px', left: '0px', width: '100%', height: jQuery(window).height() })
            .find('iframe')
            .css('height', jQuery(window).height() - 50);
        },
      });
    },

    //删除码表数据
    deleteTVehicleExpenseMain: function () {
      var billUids = '';
      var billUidArr = $('#dataList').jqGrid('getGridParam', 'selarrrow');
      if (!billUidArr || billUidArr.length == 0) {
        //未选中数据
        sweetAlert({
          title: '删除',
          text: '请选择一条数据进行删除',
          type: 'error',
          showConfirmButton: true,
          confirmButtonText: '确认',
        });
        return;
      } else {
        sweetAlert(
          {
            title: '删除',
            text: '确认删除吗?',
            type: 'warning',
            showConfirmButton: true,
            showCancelButton: true,
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            closeOnConfirm: false,
          },
          function (isConfirm) {
            //是否确认删除
            if (!isConfirm) {
              //取消
              return;
            } else {
              //确认
              for (var i = 0; i < billUidArr.length; i++) {
                var obj = $('#dataList').jqGrid('getRowData', billUidArr[i]);
                if (obj.state == '2') {
                  sweetAlert({
                    title: '提示',
                    text: '【审批中】的数据不可以删除！',
                    type: 'error',
                    showConfirmButton: true,
                    confirmButtonText: '确认',
                  });
                  return;
                }

                //i==0时不拼接","
                if (i == 0) {
                  billUids = billUidArr[i];
                } else {
                  //拼接","
                  billUids = billUids + ',' + billUidArr[i];
                }
              }
              $.ajax({
                url: WEB_CTX_PATH + '/vehicleExpenseAction.do?method=deleteTVehicleExpenseMain',
                data: { billUids: billUids },
                type: 'POST',
                dataType: 'json',
                success: function (data) {
                  //删除成功
                  if (data.success) {
                    sweetAlert(
                      {
                        title: '删除成功！',
                        type: 'success',
                        showConfirmButton: true,
                        confirmButtonText: '确认',
                      },
                      function () {
                        //重新加载数据
                        jQuery('#dataList')
                          .jqGrid('setGridParam', {
                            url: WEB_CTX_PATH + '/vehicleExpenseAction.do?method=doInit',
                            page: 1,
                          })
                          .trigger('reloadGrid');
                      }
                    );
                  } else {
                    //失败
                    sweetAlert({
                      title: '删除失败',
                      text: '' + data.msg,
                      type: 'error',
                      showConfirmButton: true,
                      confirmButtonText: '确认',
                    });
                  }
                },
                //异常
                error: function (data) {
                  sweetAlert({
                    title: '系统错误',
                    type: 'error',
                    showConfirmButton: true,
                    confirmButtonText: '确认',
                  });
                },
              });
            }
          }
        );
      }
    },

    //代理报销子画面
    agencyPerson: function (showType) {
      //页头
      var titleStr = '';
      //url
      var url = '';
      titleStr = '代理人身份认证';
      url = WEB_CTX_PATH + '/ordinarymainAction.do?method=agencyPerson&showType=' + showType;
      jQuery().openDlg({
        height: 250, //此行调高度
        width: 500,
        url: url,
        title: titleStr,
      });
    },

    // 打印
    print: function () {
      // 码表id
      var paramIdArr = '';
      // url
      var url = '';
      // 页头
      var titleStr = '车辆费用报销单打印';
      paramIdArr = $('#dataList').jqGrid('getGridParam', 'selarrrow');
      // 判断id是否为空
      if (paramIdArr && paramIdArr.length > 1) {
        // 选中多条
        sweetAlert({
          title: '提示',
          text: '只能选择一条数据进行打印',
          type: 'error',
          showConfirmButton: true,
          confirmButtonText: '确认',
        });
        return;
      } else if (paramIdArr.length == 0) {
        // 未选中数据
        sweetAlert({
          title: '提示',
          text: '请选择一条数据进行打印',
          type: 'error',
          showConfirmButton: true,
          confirmButtonText: '确认',
        });
        return;
      }
      var appStatus = $('#dataList').jqGrid('getRowData', paramIdArr).stateName;
      // 字符串中没有审批通过则给出提示
      if (appStatus.indexOf('审批通过') == -1) {
        sweetAlert({
          title: '提示',
          text: '只有审批通过的数据才可打印。',
          type: 'error',
          showConfirmButton: true,
          confirmButtonText: '确认',
        });
        return;
      }
      url = WEB_CTX_PATH + '/vehicleExpenseAction.do?method=print&paramId=' + paramIdArr[0];
      //			jQuery().openDlg({
      //				// parent: window.top,//此行调遮罩
      //				height : 600,// 此行调高度
      //				width : 1000,
      //				url : url,
      //				title : titleStr
      //			});
      layer.open({
        type: 2,
        title: titleStr,
        content: url,
        fix: true,
        area: ['100%', '100%'],
        //	           /*注释部分功能：弹窗后立即最大化*/
        success: function (layerObj) {
          var currLayer = jQuery(layerObj);
          currLayer
            .css({ top: '0px', left: '0px', width: '100%', height: jQuery(window).height() })
            .find('iframe')
            .css('height', jQuery(window).height() - 50);
        },
      });
    },
    // 批量启动
    start: function () {
      var paramIds = '';
      var paramIdArr = $('#dataList').jqGrid('getGridParam', 'selarrrow');
      if (!paramIdArr || paramIdArr.length == 0) {
        // 未选中数据
        sweetAlert({
          title: '提示',
          text: '请选择数据进行启动',
          type: 'error',
          showConfirmButton: true,
          confirmButtonText: '确认',
        });
        return;
      } else {
        sweetAlert(
          {
            title: '提示',
            text: '确认全部启动吗?',
            type: 'warning',
            showConfirmButton: true,
            showCancelButton: true,
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            closeOnConfirm: false,
          },
          function (isConfirm) {
            // 是否确认启动
            if (!isConfirm) {
              // 取消
              return;
            } else {
              // 确认
              for (var i = 0; i < paramIdArr.length; i++) {
                var obj = $('#dataList').jqGrid('getRowData', paramIdArr[i]);
                if (obj.state == '2') {
                  sweetAlert({
                    title: '提示',
                    text: '状态为审批中的数据不可以启动！',
                    type: 'error',
                    showConfirmButton: true,
                    confirmButtonText: '确认',
                  });
                  return;
                }

                // i==0时不拼接","
                if (i == 0) {
                  paramIds = paramIdArr[i];
                } else {
                  // 拼接","
                  paramIds = paramIds + ',' + paramIdArr[i];
                }
              }
              $.ajax({
                url: WEB_CTX_PATH + '/vehicleExpenseAction.do?method=start',
                data: {
                  paramIds: paramIds,
                },
                type: 'POST',
                dataType: 'json',
                success: function (data) {
                  if (data.success) {
                    sweetAlert(
                      {
                        title: '启动成功！',
                        type: 'success',
                        showConfirmButton: true,
                        confirmButtonText: '确认',
                      },
                      function () {
                        // 重新加载数据
                        jQuery('#dataList')
                          .jqGrid('setGridParam', {
                            url: WEB_CTX_PATH + '/vehicleExpenseAction.do?method=doInit',
                            page: 1,
                          })
                          .trigger('reloadGrid');
                      }
                    );
                  } else {
                    // 失败
                    sweetAlert({
                      title: '启动失败',
                      text: '' + data.msg,
                      type: 'error',
                      showConfirmButton: true,
                      confirmButtonText: '确认',
                    });
                  }
                },
                // 异常
                error: function (data) {
                  alert('系统错误');
                  sweetAlert({
                    title: '系统错误',
                    type: 'error',
                    showConfirmButton: true,
                    confirmButtonText: '确认',
                  });
                },
              });
            }
          }
        );
      }
    },
    // 批量撤回
    callback: function () {
      var paramIds = '';
      var paramIdArr = $('#dataList').jqGrid('getGridParam', 'selarrrow');
      if (!paramIdArr || paramIdArr.length == 0) {
        // 未选中数据
        sweetAlert({
          title: '提示',
          text: '请选择数据进行撤回',
          type: 'error',
          showConfirmButton: true,
          confirmButtonText: '确认',
        });
        return;
      } else {
        sweetAlert(
          {
            title: '提示',
            text: '确认全部撤回吗?',
            type: 'warning',
            showConfirmButton: true,
            showCancelButton: true,
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            closeOnConfirm: false,
          },
          function (isConfirm) {
            // 是否确认启动
            if (!isConfirm) {
              // 取消
              return;
            } else {
              // 确认
              for (var i = 0; i < paramIdArr.length; i++) {
                var obj = $('#dataList').jqGrid('getRowData', paramIdArr[i]);
                if (obj.state == '1' || obj.state == '3' || obj.state == '9') {
                  sweetAlert({
                    title: '提示',
                    text: '只有状态为审批中的数据才可以撤回！',
                    type: 'error',
                    showConfirmButton: true,
                    confirmButtonText: '确认',
                  });
                  return;
                }

                // i==0时不拼接","
                if (i == 0) {
                  paramIds = paramIdArr[i];
                } else {
                  // 拼接","
                  paramIds = paramIds + ',' + paramIdArr[i];
                }
              }
              $.ajax({
                url: WEB_CTX_PATH + '/vehicleExpenseAction.do?method=callback',
                data: {
                  paramIds: paramIds,
                },
                type: 'POST',
                dataType: 'json',
                success: function (data) {
                  if (data.success) {
                    sweetAlert(
                      {
                        title: '撤回成功！',
                        type: 'success',
                        showConfirmButton: true,
                        confirmButtonText: '确认',
                      },
                      function () {
                        // 重新加载数据
                        jQuery('#dataList')
                          .jqGrid('setGridParam', {
                            url: WEB_CTX_PATH + '/vehicleExpenseAction.do?method=doInit',
                            page: 1,
                          })
                          .trigger('reloadGrid');
                      }
                    );
                  } else {
                    // 失败
                    sweetAlert({
                      title: '撤回失败',
                      text: '' + data.msg,
                      type: 'error',
                      showConfirmButton: true,
                      confirmButtonText: '确认',
                    });
                  }
                },
                // 异常
                error: function (data) {
                  sweetAlert({
                    title: '系统错误',
                    type: 'error',
                    showConfirmButton: true,
                    confirmButtonText: '确认',
                  });
                },
              });
            }
          }
        );
      }
    },

    /*
     * 按钮关闭
     */
    doClose: function () {
      jQuery().closeDlg(parent.layer);
    },
    //查询
    doQuery: function () {
      var billNo = jQuery('#billNo').val();
      var state = jQuery('#state').val();
      var startTime = jQuery('#startTime').val();
      var endTime = jQuery('#endTime').val();
      var companyId = $('#upOrgId').val();
      var departmentId = $('#orgId').val();
      var projectId = $('#projectUid').val();
      var licensePlate = $('#licensePlate').val();
      //重新加载数据
      jQuery('#dataList')
        .jqGrid('setGridParam', {
          url: WEB_CTX_PATH + '/vehicleExpenseAction.do?method=doInit',
          page: 1,
          postData: {
            upOrgId: companyId,
            deptUid: departmentId,
            projectUid: projectId,
            billNo: billNo,
            state: state,
            startTime: startTime,
            endTime: endTime,
            licensePlate: licensePlate,
          },
        })
        .trigger('reloadGrid');
    },
    //重置
    resetQuery: function () {
      $('#upOrgId').val('');
      $('#orgId').val('');
      $('#projectUid').empty().select2();
      $('#projectUid').val('');
      $('#starttime').val('');
      $('#endtime').val('');
      $('#billNo').val('');
      $('#state').val('');
      $('#licensePlate').val('');
      vehicleExpense.vehicleExpenseList.orgtree.init();
      ajaxFormRequest(
        WEB_CTX_PATH +
          '/codeAction.do?method=getSelectOptions&element2CodeType=' +
          encodeURI(encodeURI("{'state':'listFlowType'}")),
        function (returnData) {
          if (initSelect2(returnData)) {
          }
        },
        function (state) {},
        'vehicleExpenseForm',
        true,
        ' '
      );
      vehicleExpense.vehicleExpenseList.getLicensePlatesOptions();
    },

    //input框去空格
    cky: function (obj) {
      var t = obj.value.replace(/\s+/g, '');
      if (obj.value != t) obj.value = t;
    },
  };
})();

vehicleExpense.vehicleExpenseList.getLicensePlatesOptions = function () {
  $('#licensePlate').empty().select2();
  $('#licensePlate').append('<option></option>');

  // 加载车牌号信息
  ajaxFormRequest(
    WEB_CTX_PATH +
      '/vehicleExpenseAction.do?method=getLicensePlatesOptions&upOrgId=' +
      $('#upOrgId').val(),
    function (returnData) {
      if (initSelect2(returnData)) {
      }
    },
    function (state) {},
    'vehicleExpenseForm',
    true,
    ' '
  );
};
//20170822 公司树形
vehicleExpense.vehicleExpenseList.companytree = (function () {
  var zTree;
  return {
    init: function () {
      //同步加载模式
      jQuery.ajax({
        async: true,
        type: 'POST',
        url: WEB_CTX_PATH + '/paymentAction.do?method=getCompany',
        contentType: 'application/x-www-form-urlencoded',
        data: {},
        dataType: 'json',
        beforeSend: function (xhr) {
          xhr.setRequestHeader('__REQUEST_TYPE', 'AJAX_REQUEST');
        },
        success: vehicleExpense.vehicleExpenseList.companytree.createTreeAll,
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
          onClick: vehicleExpense.vehicleExpenseList.companytree.onClickCompany,
        },
      };
      jQuery.fn.zTree.init(jQuery('#companyTree'), setting, allNodes);
      zTree = jQuery.fn.zTree.getZTreeObj('companyTree');
    },
    onClickCompany: function (e, treeId, treeNode) {
      // 获取当前选中节点
      var node = zTree.getSelectedNodes()[0];
      jQuery('#upOrgId').val(node.id);
      jQuery('#upOrgName').val(node.name);
      // 隐藏menu
      vehicleExpense.vehicleExpenseList.companytree.hideMenu();
      // 初始化 部门
      jQuery('#orgId').val('');
      jQuery('#orgName').val('');
      vehicleExpense.vehicleExpenseList.orgtree.init(node.id);
      // 初始化 项目  -- 最后做
      jQuery('#projectUid').empty().select2();
      vehicleExpense.vehicleExpenseList.companytree.changeProject();
      // 加载车牌号信息
      vehicleExpense.vehicleExpenseList.getLicensePlatesOptions();
    },
    changeProject: function () {
      //调用下拉列表  bankName'upOrgId'为select组件id、'bankName'(改变角色)
      if ($('#projectUid').val() != null) {
        $('#projectUid').empty().select2();
      }
    },
    showOrgTree: function () {
      var orgName = jQuery('#upOrgName');
      var orgOffset = jQuery('#upOrgName').offset();
      jQuery('#companyContent')
        .css({
          left: orgOffset.left + 'px',
          top: orgOffset.top + orgName.outerHeight() + 'px',
        })
        .slideDown('fast');
      jQuery('body').bind('mousedown', vehicleExpense.vehicleExpenseList.companytree.onBodyDown);
    },
    hideMenu: function () {
      jQuery('#companyContent').fadeOut('fast');
      jQuery('body').unbind('mousedown', vehicleExpense.vehicleExpenseList.companytree.onBodyDown);
    },
    onBodyDown: function (event) {
      if (
        !(
          event.target.id == 'menuBtn' ||
          event.target.id == 'orgTreeBtn' ||
          jQuery(event.target).parents('#companyContent').length > 0
        )
      ) {
        vehicleExpense.vehicleExpenseList.companytree.hideMenu();
      }
    },
    doError: function () {
      alert('Error');
    },
    doClose: function () {},
  };
})();
//20170822 部门+项目
vehicleExpense.vehicleExpenseList.orgtree = (function () {
  var zTree;
  return {
    init: function (upOrgId) {
      //同步加载模式
      jQuery.ajax({
        async: true,
        type: 'POST',
        url: WEB_CTX_PATH + '/paymentAction.do?method=getCompanyDepartment',
        contentType: 'application/x-www-form-urlencoded',
        data: { upOrgId: upOrgId },
        dataType: 'json',
        beforeSend: function (xhr) {
          xhr.setRequestHeader('__REQUEST_TYPE', 'AJAX_REQUEST');
        },
        success: vehicleExpense.vehicleExpenseList.orgtree.createTreeAll,
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
          onClick: vehicleExpense.vehicleExpenseList.orgtree.onClickOrg,
        },
      };
      jQuery.fn.zTree.init(jQuery('#orgTree'), setting, allNodes);
      zTree = jQuery.fn.zTree.getZTreeObj('orgTree');
    },
    onClickOrg: function (e, treeId, treeNode) {
      // 获取当前选中节点
      var node = zTree.getSelectedNodes()[0];
      if (node.type == 'org') {
        jQuery('#orgId').val(node.id);
      }
      jQuery('#orgName').val(node.name);
      // 隐藏menu
      vehicleExpense.vehicleExpenseList.orgtree.hideMenu();
      // 初始化 项目  -- 最后做
      vehicleExpense.vehicleExpenseList.orgtree.changeProject();
    },
    changeProject: function () {
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
          $('#orgId').val(),
        function (returnData) {
          // 定义属性
          var obj = new Object();
          var obj1 = new Object();
          obj1.projectUid = returnData;
          // 这个属性 是控件Id
          obj.result = obj1;
          if (initSelect2(obj)) {
            $('#projectUid').val(null).select2();
          }
        },
        function (state) {},
        'vehicleExpenseForm',
        true,
        ' '
      );
    },
    showOrgTree: function () {
      var orgName = jQuery('#orgName');
      var orgOffset = jQuery('#orgName').offset();
      jQuery('#orgContent')
        .css({
          left: orgOffset.left + 'px',
          top: orgOffset.top + orgName.outerHeight() + 'px',
        })
        .slideDown('fast');
      jQuery('body').bind('mousedown', vehicleExpense.vehicleExpenseList.orgtree.onBodyDown);
    },
    hideMenu: function () {
      jQuery('#orgContent').fadeOut('fast');
      jQuery('body').unbind('mousedown', vehicleExpense.vehicleExpenseList.orgtree.onBodyDown);
    },
    onBodyDown: function (event) {
      if (
        !(
          event.target.id == 'menuBtn' ||
          event.target.id == 'orgTreeBtn' ||
          jQuery(event.target).parents('#orgContent').length > 0
        )
      ) {
        vehicleExpense.vehicleExpenseList.orgtree.hideMenu();
      }
    },
    doError: function () {
      alert('Error');
    },
    doClose: function () {},
  };
})();
