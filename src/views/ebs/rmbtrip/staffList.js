/*
 * 定义命名空间
 */
jQuery.namespace('rmbtrip.staffList');
rmbtrip.staffList = (function () {
  return {
    init: function () {
      rmbtrip.staffList.gridInit();
      // 查询
      jQuery('#queryBtn').on('click', rmbtrip.staffList.doQuery);
      // 重置
      jQuery('#resetBtn').on('click', rmbtrip.staffList.resetQuery);
      // 选择
      jQuery('#chooseButton').on('click', rmbtrip.staffList.ChooseStaff);
      // 关闭
      jQuery('#closeButton').on('click', rmbtrip.staffList.doClose);
    },
    /*
     * 生成表格组件
     */
    gridInit: function () {
      jQuery('#dataList').jqGrid({
        // 绝大部分情况下JS中单引号与双引号并无区别
        // 以下部分的值采用单引号和双引号无区别
        url: WEB_CTX_PATH + '/tripMainAction.do?method=queryStaffInfo',
        regional: 'cn',
        datatype: 'json',
        colNames: ['员工卡号', '员工姓名', '所属公司', '所属部门', '开户银行', '银行卡号'],
        operatorKey: 'act',
        shrinkToFit: true,
        colModel: [
          {
            name: 'staffNo',
            index: 'staffNo',
            key: true,
          },
          {
            name: 'staffName',
            index: 'staffName',
          },
          {
            name: 'upOrgName',
            index: 'upOrgName',
          },
          {
            name: 'orgName',
            index: 'orgName',
          },
          {
            name: 'bankName',
            index: 'bankName',
          },
          {
            name: 'cardNo',
            index: 'cardNo',
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
        caption: '员工信息列表',
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
    ChooseStaff: function () {
      // 合同id
      var paramIdArr = $('#dataList').jqGrid('getGridParam', 'selarrrow');
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

      // 调用父画面的选择合同的方法
      var conid = paramIdArr[0];
      var obj = $('#dataList').jqGrid('getRowData', conid);
      parent.$('#applicantUid').val(obj.staffNo);
      parent.$('#applicantName').val(obj.staffName);
      parent.$('#showApplication').val(obj.staffNo + ' ' + obj.staffName);
      parent.$('#bankName').val(obj.bankName);
      parent.$('#cardNo').val(obj.cardNo);

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
      var upOrgId = jQuery('#upOrgId').val();
      var orgId = jQuery('#orgId').val();
      var staffNo = jQuery('#staffNo').val();
      var staffName = jQuery('#staffName').val();
      // 重新加载数据
      jQuery('#dataList')
        .jqGrid('setGridParam', {
          url:
            WEB_CTX_PATH +
            '/tripMainAction.do?method=queryStaffInfo&upOrgId=' +
            upOrgId +
            '&orgId=' +
            orgId +
            '&staffNo=' +
            staffNo +
            '&staffName=' +
            staffName,
          page: 1,
          postData: {},
        })
        .trigger('reloadGrid');
    },
    // 重置
    resetQuery: function () {
      $('#upOrgName').val('');
      $('#upOrgId').val('');
      $('#orgName').val('');
      $('#orgId').val('');
      $('#orgTree').empty();
      $('#staffNo').val('');
      $('#staffName').val('');
    },
  };
})();

//公司树形
rmbtrip.staffList.companytree = (function () {
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
        success: rmbtrip.staffList.companytree.createTreeAll,
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
          onClick: rmbtrip.staffList.companytree.onClickCompany,
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
      rmbtrip.staffList.companytree.hideMenu();
      // 初始化 部门
      jQuery('#orgId').val('');
      jQuery('#orgName').val('');
      rmbtrip.staffList.orgtree.init(node.id);
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
      jQuery('body').bind('mousedown', rmbtrip.staffList.companytree.onBodyDown);
    },
    hideMenu: function () {
      jQuery('#companyContent').fadeOut('fast');
      jQuery('body').unbind('mousedown', rmbtrip.staffList.companytree.onBodyDown);
    },
    onBodyDown: function (event) {
      if (
        !(
          event.target.id == 'menuBtn' ||
          event.target.id == 'orgTreeBtn' ||
          jQuery(event.target).parents('#companyContent').length > 0
        )
      ) {
        rmbtrip.staffList.companytree.hideMenu();
      }
    },
    doError: function () {
      alert('Error');
    },
    doClose: function () {},
  };
})();

//部门
rmbtrip.staffList.orgtree = (function () {
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
        success: rmbtrip.staffList.orgtree.createTreeAll,
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
          onClick: rmbtrip.staffList.orgtree.onClickOrg,
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
      rmbtrip.staffList.orgtree.hideMenu();
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
      jQuery('body').bind('mousedown', rmbtrip.staffList.orgtree.onBodyDown);
    },
    hideMenu: function () {
      jQuery('#orgContent').fadeOut('fast');
      jQuery('body').unbind('mousedown', rmbtrip.staffList.orgtree.onBodyDown);
    },
    onBodyDown: function (event) {
      if (
        !(
          event.target.id == 'menuBtn' ||
          event.target.id == 'orgTreeBtn' ||
          jQuery(event.target).parents('#orgContent').length > 0
        )
      ) {
        rmbtrip.staffList.orgtree.hideMenu();
      }
    },
    doError: function () {
      alert('Error');
    },
    doClose: function () {},
  };
})();
