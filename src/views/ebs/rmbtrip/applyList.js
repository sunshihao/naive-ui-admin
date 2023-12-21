/*
 * 定义命名空间
 */
jQuery.namespace('rmbtrip.applyList');
rmbtrip.applyList = (function () {
  return {
    init: function () {
      rmbtrip.applyList.gridInit();
      // 查询
      jQuery('#queryBtn').on('click', rmbtrip.applyList.doQuery);
      // 重置
      jQuery('#resetBtn').on('click', rmbtrip.applyList.resetQuery);
      // 选择
      jQuery('#chooseButton').on('click', rmbtrip.applyList.ChooseContract);
      // 关闭
      jQuery('#closeButton').on('click', rmbtrip.applyList.doClose);
    },
    /*
     * 生成表格组件
     */
    gridInit: function () {
      jQuery('#dataList').jqGrid({
        // 绝大部分情况下JS中单引号与双引号并无区别
        // 以下部分的值采用单引号和双引号无区别
        url:
          WEB_CTX_PATH +
          '/tripMainAction.do?method=doApply&projectUid=' +
          $('#projectId').val() +
          '&applicantUid=' +
          $('#applicantUid').val(),
        regional: 'cn',
        datatype: 'json',
        colNames: [
          'id',
          '公司ID',
          '公司名',
          '部门ID',
          '部门名',
          '出差申请单号',
          '计划开始日期',
          '计划结束日期',
          '申请日期',
          '出差申请单备注',
          '出发地',
          '到达地',
        ],
        operatorKey: 'act',
        shrinkToFit: true,
        colModel: [
          {
            name: 'planId',
            index: 'planId',
            hidden: true,
            key: true,
          },
          {
            name: 'workTripUpOrg',
            index: 'workTripUpOrg',
            hidden: true,
          },
          {
            name: 'workTripUpOrgName',
            index: 'workTripUpOrgName',
          },
          {
            name: 'workTripOrg',
            index: 'workTripOrg',
            hidden: true,
          },
          {
            name: 'workTripOrgName',
            index: 'workTripOrgName',
          },
          {
            name: 'planNo',
            index: 'planNo',
          },
          {
            name: 'startDate',
            index: 'startDate',
            //					formatter : "date",
            //					formatoptions : {
            //						srcformat : 'Y-m-d H:i:s',
            //						newformat : 'Y-m-d'
            //					},
            align: 'center',
          },
          {
            name: 'endDate',
            index: 'endDate',
            //					formatter : "date",
            //					formatoptions : {
            //						srcformat : 'Y-m-d H:i:s',
            //						newformat : 'Y-m-d'
            //					},
            align: 'center',
          },
          {
            name: 'createDate',
            index: 'createDate',
            //					formatter : "date",
            //					formatoptions : {
            //						srcformat : 'Y-m-d H:i:s',
            //						newformat : 'Y-m-d'
            //					},
            align: 'center',
          },
          {
            name: 'memo',
            index: 'memo',
          },
          {
            name: 'outPlace',
            index: 'outPlace',
          },
          {
            name: 'objectPlace',
            index: 'objectPlace',
          },
        ],
        rowNum: 10, // 每页最大显示行数
        autowidth: true, // grid的宽度会根据父元素的宽度自动重新计算
        height: '100%',
        multiselect: true, // 多选（表格会多出一列选择框）
        multiboxonly: true, // 支持若多选，单击就只选中一条
        beforeSelectRow: function () {
          $('#dataList').jqGrid('resetSelection');
          return true; //true两边的括号不能去，且必须有multiboxonly和multiselect两个属性。
        },
        gridComplete: function () {
          $('#cb_dataList').attr('disabled', 'disabled');
        },
        rownumbers: true, // 显示行号
        rowList: [10, 20, 30], // 其他可选每页最大显示行数
        pager: '#listPager',
        mtype: 'post',
        viewrecords: false,
        sortname: 'paramTypeName', // 默认的排序索引,可根据需求添加该项
        emptyMsg: '查询结果为空', // 如果设置了该选项，在表格为空数据时撑开表格并显示设置的信息
        caption: '出差申请单列表',
      });

      /*
       * 表格大小调整
       */
      jQuery(window).on('resize.jqGrid', function () {
        jQuery('#dataList').jqGrid('setGridWidth', jQuery('.col-xs-11').width(), true);
      });
      jQuery(window).triggerHandler('resize.jqGrid');
    },

    // 选择合同
    ChooseContract: function () {
      // 合同id
      var paramIdArr = '';
      // 页头
      var titleStr = '';
      // url
      var url = '';

      titleStr = '选择合同';
      paramIdArr = $('#dataList').jqGrid('getGridParam', 'selarrrow');
      if (paramIdArr && paramIdArr.length > 1) {
        // 选中多条
        sweetAlert({
          title: '提示',
          text: '只能选择一条数据',
          type: 'error',
          showConfirmButton: true,
          confirmButtonText: '确认',
        });
        return;
      } else if (paramIdArr.length == 0) {
        // 未选中数据
        sweetAlert({
          title: '提示',
          text: '请选择一条数据',
          type: 'error',
          showConfirmButton: true,
          confirmButtonText: '确认',
        });
        return;
      }

      // TODO 全局中方法和父页面中方法调用
      var oldCompanyId = parent.$('#upOrgId').val();
      var oldDeptId = parent.$('#deptUid').val();

      // 调用父画面的选择合同的方法
      var conid = paramIdArr[0];
      var obj = $('#dataList').jqGrid('getRowData', conid);
      parent.$('#applicantBillCd').val(obj.planNo);
      parent.$('#upOrgId').val(obj.workTripUpOrg);
      parent.$('#companyName').val(obj.workTripUpOrgName);
      parent.$('#deptUid').val(obj.workTripOrg);
      parent.$('#orgName').val(obj.workTripOrgName);

      // TODO
      // console.log('parent.window', parent.window);
      console.log('parent.rmbtrip', parent.rmbtrip);

      // top.window.changeBillNo(oldCompanyId, oldDeptId);

      parent.rmbtrip.changeBillNo(oldCompanyId, oldDeptId);

      //显示查看出差申请单的按钮
      parent.$('#viewApply').show();

      // 关闭子画面
      jQuery().closeDlg(parent.layer);
    },
    /*
     * 按钮关闭
     */
    doClose: function () {
      jQuery().closeDlg(parent.layer);
    },
    // 查询
    doQuery: function () {
      var planNo = jQuery('#planNo').val();
      var startDate = jQuery('#startDate').val();
      var endDate = jQuery('#endDate').val();
      // 重新加载数据
      jQuery('#dataList')
        .jqGrid('setGridParam', {
          url:
            WEB_CTX_PATH +
            '/tripMainAction.do?method=doApply&projectUid=' +
            $('#projectId').val() +
            '&applicantUid=' +
            $('#applicantUid').val(),
          page: 1,
          postData: {
            planNo: planNo,
            startDate: startDate,
            endDate: endDate,
          },
        })
        .trigger('reloadGrid');
    },
    // 重置
    resetQuery: function () {
      $('#starttime').val('');
      $('#endtime').val('');
      $('#contractNo').val('');
      $('#contractName').val('');

      var sdate = '';
      var edate = '';
      var contractNo = '';
      var contractName = '';

      // 重新加载数据
      jQuery('#dataList')
        .jqGrid('setGridParam', {
          url: WEB_CTX_PATH + '/tripMainAction.do?method=doApply',
          page: 1,
          postData: {
            contractNo: contractNo,
            contractName: contractName,
            sdate: sdate,
            edate: edate,
            projectUid: $('#projectId').val(),
            applicantUid: $('#applicantUid').val(),
          },
        })
        .trigger('reloadGrid');
      //
    },

    // input框去空格
    cky: function (obj) {
      var t = obj.value.replace(/\s+/g, '');
      if (obj.value != t) obj.value = t;
    },
  };
})();
