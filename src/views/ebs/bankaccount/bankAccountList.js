/*
 * 定义命名空间
 */
jQuery.namespace('bankaccount.bankAccountList');
bankaccount.bankAccountList = (function () {
  return {
    init: function () {
      bankaccount.bankAccountList.gridInit();
      jQuery('#delBtn').on('click', bankaccount.bankAccountList.deleteMainParam);
      jQuery('#queryBtn').on('click', bankaccount.bankAccountList.doQuery);
      jQuery('#resetBtn').on('click', bankaccount.bankAccountList.resetVal); //重置
    },

    //重置画面查询条件
    resetVal: function () {
      $('#bankCd').val('').select2();
      $('#startState').val('').select2();
      $('#upOrgId').val('');
    },

    /*
     * 生成表格组件
     */
    gridInit: function () {
      jQuery('#dataList').jqGrid({
        // 绝大部分情况下JS中单引号与双引号并无区别
        // 以下部分的值采用单引号和双引号无区别
        url: WEB_CTX_PATH + '/bankaccountAction.do?method=doInit',
        regional: 'cn',
        datatype: 'json',
        colNames: ['id', '公司名称', '银行', '银行户名', '银行帐号', '科目', '启用状态'],
        operatorKey: 'act',
        shrinkToFit: true,
        colModel: [
          {
            name: 'bankAccountUid',
            index: 'bankAccountUid',
            hidden: true,
            key: true,
          },
          {
            name: 'upOrgId',
            index: 'upOrgId',
          },
          {
            name: 'bankCd',
            index: 'bankCd',
          },
          {
            name: 'bankAccountName',
            index: 'bankAccountName',
          },
          {
            name: 'bankAccount',
            index: 'bankAccount',
          },
          {
            name: 'bankSubjectCode',
            index: 'bankSubjectCode',
          },
          {
            name: 'startState',
            index: 'startState',
          },
        ],
        rowNum: 10, // 每页最大显示行数
        autowidth: true, // grid的宽度会根据父元素的宽度自动重新计算
        height: '100%',
        multiselect: true, // 多选（表格会多出一列选择框）
        rownumbers: true, // 显示行号
        rowList: [10, 20, 30], // 其他可选每页最大显示行数
        pager: '#listPager',
        mtype: 'post',
        viewrecords: false,
        sortname: 'paramTypeName', // 默认的排序索引,可根据需求添加该项
        emptyMsg: '查询结果为空', // 如果设置了该选项，在表格为空数据时撑开表格并显示设置的信息
        caption: '银行账号对应关系列表',
      });

      /*
       * 表格大小调整
       */
      jQuery(window).on('resize.jqGrid', function () {
        jQuery('#dataList').jqGrid('setGridWidth', jQuery('.col-xs-12').width());
      });
      jQuery(window).triggerHandler('resize.jqGrid');
    },
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
        titleStr = '银行账号对应关系编辑';
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
        url =
          WEB_CTX_PATH +
          '/bankaccountAction.do?method=doAddOrEdit&actionType=' +
          clickType +
          '&bankAccountUid=' +
          paramIdArr[0];
      } else if (clickType == 'datail') {
        titleStr = '银行账号对应关系详细';
        paramIdArr = $('#dataList').jqGrid('getGridParam', 'selarrrow');
        if (paramIdArr && paramIdArr.length > 1) {
          //选中多条
          sweetAlert({
            title: '提示',
            text: '只能选择一条数据进行查看详细',
            type: 'error',
            showConfirmButton: true,
            confirmButtonText: '确认',
          });
          return;
        } else if (paramIdArr.length == 0) {
          //未选中数据
          sweetAlert({
            title: '提示',
            text: '请选择一条数据进行查看详细',
            type: 'error',
            showConfirmButton: true,
            confirmButtonText: '确认',
          });
          return;
        }
        url =
          WEB_CTX_PATH +
          '/bankaccountAction.do?method=doAddOrEdit&actionType=' +
          clickType +
          '&bankAccountUid=' +
          paramIdArr[0];
      } else if (clickType == 'add') {
        titleStr = '银行账号对应关系添加';
        url = WEB_CTX_PATH + '/bankaccountAction.do?method=doAddOrEdit&actionType=' + clickType;
      }
      jQuery().openDlg({
        //				parent: window.top,//此行调遮罩
        height: 350, //此行调高度
        width: 700,
        url: url,
        title: titleStr,
      });
    },
    //删除码表数据
    deleteBankAccount: function () {
      var bankAccountUids = '';
      var bankAccountUidArr = $('#dataList').jqGrid('getGridParam', 'selarrrow');
      if (!bankAccountUidArr || bankAccountUidArr.length == 0) {
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
              for (var i = 0; i < bankAccountUidArr.length; i++) {
                //i==0时不拼接","
                if (i == 0) {
                  bankAccountUids = bankAccountUidArr[i];
                } else {
                  //拼接","
                  bankAccountUids = bankAccountUids + ',' + bankAccountUidArr[i];
                }
              }
              $.ajax({
                url: WEB_CTX_PATH + '/bankaccountAction.do?method=deleteBankAccount',
                data: { bankAccountUids: bankAccountUids },
                type: 'POST',
                dataType: 'json',
                success: function (data) {
                  //删除成功
                  if (data.success) {
                    sweetAlert(
                      {
                        title: data.msg,
                        type: 'success',
                        showConfirmButton: true,
                        confirmButtonText: '确认',
                      },
                      function () {
                        //重新加载数据
                        jQuery('#dataList')
                          .jqGrid('setGridParam', {
                            url: WEB_CTX_PATH + '/bankaccountAction.do?method=doInit',
                            page: 1,
                          })
                          .trigger('reloadGrid');
                      }
                    );
                  } else {
                    //失败
                    sweetAlert({
                      title: '删除失败',
                      text: '请刷新后重试',
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
    /*
     * 按钮关闭
     */
    doClose: function () {
      jQuery().closeDlg(parent.layer);
    },
    //查询
    doQuery: function () {
      var bankCd = jQuery('#bankCd').val(); //银行
      var bankAccount = jQuery('#bankAccount').val(); //银行帐号
      var upOrgId = jQuery('#upOrgId').val(); //公司
      var startState = jQuery('#startState').val(); //启用状态
      //重新加载数据
      jQuery('#dataList')
        .jqGrid('setGridParam', {
          url: WEB_CTX_PATH + '/bankaccountAction.do?method=doInit',
          page: 1,
          postData: {
            bankCd: bankCd,
            bankAccount: bankAccount,
            upOrgId: upOrgId,
            startState: startState,
          },
        })
        .trigger('reloadGrid');
    },
    //input框去空格
    cky: function (obj) {
      var t = obj.value.replace(/\s+/g, '');
      if (obj.value != t) obj.value = t;
    },
  };
})();

var api = parent.layer.getUserData();
var actionType;

bankaccount.bankAccountList.companytree = (function () {
  var zTree;
  return {
    init: function () {
      //			bankaccount.bankAccountList.companytree.createTree();
      //同步加载模式
      jQuery.ajax({
        async: true,
        type: 'POST',
        url: WEB_CTX_PATH + '/paymentAction.do?method=getCompany',
        contentType: 'application/x-www-form-urlencoded',
        data: { userId: api.userId },
        dataType: 'json',
        beforeSend: function (xhr) {
          xhr.setRequestHeader('__REQUEST_TYPE', 'AJAX_REQUEST');
        },
        success: bankaccount.bankAccountList.companytree.createTreeAll,
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
          onClick: bankaccount.bankAccountList.companytree.onClickOrg,
          onAsyncSuccess: bankaccount.bankAccountList.companytree.checkTree,
        },
      };

      jQuery.fn.zTree.init(jQuery('#companyTree'), setting, allNodes);
      zTree = jQuery.fn.zTree.getZTreeObj('companyTree');
    },
    createTree: function () {
      var setting = {
        async: {
          enable: false,
          autoParam: ['id', 'name', 'type'],
          dataType: 'text',
          type: 'post',
          url: WEB_CTX_PATH + '/paymentAction.do?method=getCompany',
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
          onClick: bankaccount.bankAccountList.companytree.onClickOrg,
          onAsyncSuccess: bankaccount.bankAccountList.companytree.checkTree,
        },
      };
      jQuery.fn.zTree.init(jQuery('#companyTree'), setting, null);
      zTree = jQuery.fn.zTree.getZTreeObj('companyTree');
    },
    onClickOrg: function (e, treeId, treeNode) {
      var node = zTree.getSelectedNodes()[0];
      var v = '';
      if (node.type == 'position') {
        var orgNode = node.getParentNode();
        while (true) {
          if (orgNode.type == 'position') orgNode = orgNode.getParentNode();
          else break;
        }
        v = orgNode.name + ',' + node.name;
        jQuery('#upOrgId').val(orgNode.id);
      }
      if (node.type == 'org') {
        v = node.name;
        jQuery('#upOrgId').val(node.id);
      }
      jQuery('#companyName').val(v);
      bankaccount.bankAccountList.companytree.hideMenu();
      //变换角色类型
      bankaccount.bankAccountList.companytree.changeRole();
      //初始化城市
      jQuery('#city').val('');
      jQuery('#orgName').val('');
      //			bankaccount.bankAccountList.tree.init(node.id);
    },
    showOrgTree: function () {
      var orgName = jQuery('#companyName');
      var orgOffset = jQuery('#companyName').offset();
      jQuery('#companyContent')
        .css({
          left: orgOffset.left - 17 + 'px',
          top: orgOffset.top - 20 + orgName.outerHeight() + 'px',
        })
        .slideDown('fast');

      jQuery('body').bind('mousedown', bankaccount.bankAccountList.companytree.onBodyDown);
    },
    hideMenu: function () {
      jQuery('#companyContent').fadeOut('fast');
      jQuery('body').unbind('mousedown', bankaccount.bankAccountList.companytree.onBodyDown);
    },
    onBodyDown: function (event) {
      if (
        !(
          event.target.id == 'menuBtn' ||
          event.target.id == 'orgTreeBtn' ||
          jQuery(event.target).parents('#companyContent').length > 0
        )
      ) {
        bankaccount.bankAccountList.companytree.hideMenu();
      }
    },
    initSuccess: function (returnData) {
      jQuery('#userForm').initForm({
        data: returnData.result,
      });
    },
    doSuccess: function (data) {
      if (data.resultType != 1) {
        alert(data.resultMsg ? '保存失败:' + data.resultMsg : '保存失败');
        return false;
      }
      alert('保存成功');
      parent.auth.UserList.doQuery();
      bankaccount.bankAccountList.companytree.doClose();
    },
    checkTree: function () {
      //回显组织名称
      var node = zTree.getNodeByParam('id', upOrgId);
      if (node != undefined && node != null) {
        zTree.selectNode(node);
        $('#companyName').val(node.name);
        //变换角色类型
        bankaccount.bankAccountList.companytree.changeRole();
      }
    },
    initRole: function () {
      //调用下拉列表  bankName'upOrgId'为select组件id、'bankName'(初始化)
      ajaxFormRequest(
        WEB_CTX_PATH +
          '/hrInfoAction.do?method=getSelectOptions&element2CodeType=' +
          encodeURI(encodeURI("{'role':'" + $('#upOrgId').val() + "'}")),
        function (returnData) {
          if (initSelect2(returnData)) {
            // 操作类型
            var actionType = jQuery('#actionType').val();
            if (actionType == 'edit') {
              $('#role').val(role).select2();
            }
          }
        },
        function (state) {},
        'standardForm',
        true,
        ' '
      );
    },
    changeRole: function () {
      //调用下拉列表  bankName'upOrgId'为select组件id、'bankName'(改变角色)
      if ($('#role').val() != null) {
        $('#role').empty().select2();
      }
      ajaxFormRequest(
        WEB_CTX_PATH +
          '/hrInfoAction.do?method=getSelectOptions&element2CodeType=' +
          encodeURI(encodeURI("{'role':'" + $('#upOrgId').val() + "'}")),
        function (returnData) {
          if (initSelect2(returnData)) {
          }
        },
        function (state) {},
        'notifForm',
        true,
        ' '
      );
    },
    doError: function () {
      alert('Error');
    },
    doClose: function () {},
  };
})();
