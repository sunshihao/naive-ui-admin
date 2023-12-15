const rmbtrip = (function () {
  return {
    init: function () {
      rmbtrip.gridInit();
      jQuery('#resetBtn').on('click', rmbtrip.reset);
      jQuery('#queryBtn').on('click', rmbtrip.doQuery);
    },
    /*
     * 生成表格组件
     */
    gridInit: function () {
      jQuery('#dataList').jqGrid({
        // 绝大部分情况下JS中单引号与双引号并无区别
        // 以下部分的值采用单引号和双引号无区别
        url: WEB_CTX_PATH + '/tripMainAction.do?method=doInit',
        regional: 'cn',
        datatype: 'json',
        colNames: [
          'id',
          '创建日期',
          '单据号',
          '单据日期',
          '价税合计',
          '收款人',
          '申请人',
          '状态值',
          '状态',
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
            name: 'createDate',
            index: 'createDate',
            hidden: true,
          },
          {
            name: 'billNo',
            index: 'billNo',
          },
          {
            name: 'billDate',
            index: 'billDate',
            formatter: 'date',
            formatoptions: {
              srcformat: 'Y-m-d H:i:s',
              newformat: 'Y-m-d',
            },
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
            name: 'applicantName',
            index: 'applicantName',
            align: 'center',
          },
          {
            name: 'agentName',
            index: 'agentName',
            align: 'center',
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
            var id = jQuery('#dataList').jqGrid('getCell', ids[i], 'billNo');

            if (appStatus == '') {
              var btn = '<span>待审批</span>';
              jQuery('#dataList').jqGrid('setRowData', ids[i], { stateName: btn });
            } else if (appStatus == '待审批') {
              var btn = '<span>待审批</span>';
              jQuery('#dataList').jqGrid('setRowData', ids[i], { stateName: btn });
            } else {
              var btn =
                "<a id='view' href='javascript:void(0);'  onclick=\"doAppStatusFlow('个人差旅报销','" +
                id +
                "','FEE01002');\">" +
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
        caption: '个人差旅报销列表',
      });

      /*
       * 表格大小调整
       */
      jQuery(window).on('resize.jqGrid', function () {
        jQuery('#dataList').jqGrid('setGridWidth', jQuery('.col-xs-12').width());
      });
      jQuery(window).triggerHandler('resize.jqGrid');
    },
    // 编辑或添加
    addOrEdit: function (clickType) {
      // 码表id
      var paramIdArr = '';
      // 页头
      var titleStr = '';
      // url
      var url = '';
      // 判断id是否为空
      if (clickType == 'edit') {
        titleStr = '个人差旅报销单编辑';
        paramIdArr = $('#dataList').jqGrid('getGridParam', 'selarrrow');
        if (paramIdArr && paramIdArr.length > 1) {
          // 选中多条
          sweetAlert({
            title: '提示',
            text: '只能选择一条数据进行编辑',
            type: 'error',
            showConfirmButton: true,
            confirmButtonText: '确认',
          });
          return;
        } else if (paramIdArr.length == 0) {
          // 未选中数据
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
          '/tripMainAction.do?method=doAddOrEdit&actionType=' +
          clickType +
          '&paramId=' +
          paramIdArr[0];
      } else if (clickType == 'add') {
        titleStr = '个人差旅报销单新建';
        url = WEB_CTX_PATH + '/tripMainAction.do?method=doAddOrEdit&actionType=' + clickType;
      } else if (clickType == 'agent') {
        titleStr = '个人差旅报销单新建';
        url = WEB_CTX_PATH + '/tripMainAction.do?method=doAddOrEdit&actionType=' + clickType;
      }
      //			jQuery().openDlg({
      //				// parent: window.top,//此行调遮罩
      //				height : 800,// 此行调高度
      //				width : 1100,
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
    // 详细
    detail: function () {
      // 码表id
      var paramIdArr = '';
      // url
      var url = '';
      // 页头
      var titleStr = '个人差旅报销单详细';
      paramIdArr = $('#dataList').jqGrid('getGridParam', 'selarrrow');
      // 判断id是否为空
      if (paramIdArr && paramIdArr.length > 1) {
        // 选中多条
        sweetAlert({
          title: '提示',
          text: '只能选择一条数据进行查看',
          type: 'error',
          showConfirmButton: true,
          confirmButtonText: '确认',
        });
        return;
      } else if (paramIdArr.length == 0) {
        // 未选中数据
        sweetAlert({
          title: '提示',
          text: '请选择一条数据进行编辑',
          type: 'error',
          showConfirmButton: true,
          confirmButtonText: '确认',
        });
        return;
      }
      url =
        WEB_CTX_PATH +
        '/tripMainAction.do?method=detail&actionType=detail&paramId=' +
        paramIdArr[0];
      //			jQuery().openDlg({
      //				// parent: window.top,//此行调遮罩
      //				height : 700,// 此行调高度
      //				width : 1100,
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
    // 详细
    test: function (type) {
      // 码表id
      var paramIdArr = '';
      // url
      var url = '';
      // 页头
      var titleStr = '个人差旅报销单详细';
      paramIdArr = $('#dataList').jqGrid('getGridParam', 'selarrrow');
      // 判断id是否为空
      if (paramIdArr && paramIdArr.length > 1) {
        // 选中多条
        sweetAlert({
          title: '提示',
          text: '只能选择一条数据进行查看',
          type: 'error',
          showConfirmButton: true,
          confirmButtonText: '确认',
        });
        return;
      } else if (paramIdArr.length == 0) {
        // 未选中数据
        sweetAlert({
          title: '提示',
          text: '请选择一条数据进行编辑',
          type: 'error',
          showConfirmButton: true,
          confirmButtonText: '确认',
        });
        return;
      }
      url =
        WEB_CTX_PATH +
        '/tripMainAction.do?method=detail2&viewType=' +
        type +
        '&paramId=' +
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
    // 打印
    print: function () {
      // 码表id
      var paramIdArr = '';
      // url
      var url = '';
      // 页头
      var titleStr = '个人差旅报销单打印';
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
      url = WEB_CTX_PATH + '/tripMainAction.do?method=print&paramId=' + paramIdArr[0];
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
    // 删除码表数据
    deleteIds: function () {
      var paramIds = '';
      var paramIdArr = $('#dataList').jqGrid('getGridParam', 'selarrrow');
      if (!paramIdArr || paramIdArr.length == 0) {
        // 未选中数据
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
            // 是否确认删除
            if (!isConfirm) {
              // 取消
              return;
            } else {
              // 确认
              for (var i = 0; i < paramIdArr.length; i++) {
                //判断审批状态
                var obj = $('#dataList').jqGrid('getRowData', paramIdArr[i]);
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
                // i==0时不拼接","
                if (i == 0) {
                  paramIds = paramIdArr[i];
                } else {
                  // 拼接","
                  paramIds = paramIds + ',' + paramIdArr[i];
                }
              }
              $.ajax({
                url: WEB_CTX_PATH + '/tripMainAction.do?method=deleteByIds',
                data: {
                  paramIds: paramIds,
                },
                type: 'POST',
                dataType: 'json',
                success: function (data) {
                  // 删除成功
                  if (data.success) {
                    sweetAlert(
                      {
                        title: '删除成功！',
                        type: 'success',
                        showConfirmButton: true,
                        confirmButtonText: '确认',
                      },
                      function () {
                        // 重新加载数据
                        jQuery('#dataList')
                          .jqGrid('setGridParam', {
                            url: WEB_CTX_PATH + '/tripMainAction.do?method=doInit',
                            page: 1,
                          })
                          .trigger('reloadGrid');
                      }
                    );
                  } else {
                    // 失败
                    sweetAlert({
                      title: '删除失败',
                      text: '请刷新后重试',
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
                //判断审批状态
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
                url: WEB_CTX_PATH + '/tripMainAction.do?method=start',
                data: {
                  paramIds: paramIds,
                },
                type: 'POST',
                dataType: 'json',
                success: function (data) {
                  // 成功
                  if (data.success == true) {
                    sweetAlert(
                      {
                        title: '批量启动成功！',
                        type: 'success',
                        showConfirmButton: true,
                        confirmButtonText: '确认',
                      },
                      function () {
                        // 重新加载数据
                        jQuery('#dataList')
                          .jqGrid('setGridParam', {
                            url: WEB_CTX_PATH + '/tripMainAction.do?method=doInit',
                            page: 1,
                          })
                          .trigger('reloadGrid');
                      }
                    );
                  } else {
                    var msg = data.msg;
                    if (msg == null || msg == '') {
                      msg = '请刷新后重试';
                    }
                    // 失败
                    sweetAlert({
                      title: '批量启动失败',
                      text: msg,
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
                //判断审批状态
                var obj = $('#dataList').jqGrid('getRowData', paramIdArr[i]);
                if (obj.state == '1') {
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
                url: WEB_CTX_PATH + '/tripMainAction.do?method=callback',
                data: {
                  paramIds: paramIds,
                },
                type: 'POST',
                dataType: 'json',
                success: function (data) {
                  // 成功
                  if (data.success == true) {
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
                            url: WEB_CTX_PATH + '/tripMainAction.do?method=doInit',
                            page: 1,
                          })
                          .trigger('reloadGrid');
                      }
                    );
                  } else {
                    // 失败
                    sweetAlert({
                      title: '批量撤回失败',
                      text: '请刷新后重试',
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
    /*
     * 按钮关闭
     */
    doClose: function () {
      jQuery().closeDlg(parent.layer);
    },
    reset: function () {
      $('#startTime').val('');
      $('#endTime').val('');
      $('#state').val(null).select2();
    },
    // 查询
    doQuery: function () {
      var billNo = jQuery('#billNo').val();
      var state = jQuery('#state').val();
      var starttime = jQuery('#startTime').val();
      var endtime = jQuery('#endTime').val();
      // 重新加载数据
      jQuery('#dataList')
        .jqGrid('setGridParam', {
          url: WEB_CTX_PATH + '/tripMainAction.do?method=doInit',
          page: 1,
          postData: {
            billNo: billNo,
            state: state,
            startTime: starttime,
            endTime: endtime,
          },
        })
        .trigger('reloadGrid');
    },
    // input框去空格
    cky: function (obj) {
      var t = obj.value.replace(/\s+/g, '');
      if (obj.value != t) obj.value = t;
    },
    // 代理报销子画面
    agencyPerson: function (type) {
      // 页头
      var titleStr = '';
      // url
      var url = '';
      titleStr = '代理人身份认证';
      url = WEB_CTX_PATH + '/ordinarymainAction.do?method=agencyPerson&showType=' + type;
      jQuery().openDlg({
        height: 300, // 此行调高度
        width: 500,
        url: url,
        title: titleStr,
      });
    },
  };
})();

export default rmbtrip;
