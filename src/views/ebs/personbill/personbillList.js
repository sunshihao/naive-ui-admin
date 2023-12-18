/*
 * 定义命名空间
 */
jQuery.namespace('personbill.personbillList');
personbill.personbillList = (function () {
  return {
    init: function () {
      personbill.personbillList.gridInit();
      jQuery('#resetBtn').on('click', personbill.personbillList.doReset);
      jQuery('#queryBtn').on('click', personbill.personbillList.doQuery);
      $('#adminBtn').empty();
      if (
        $('#staffNoMe').val() != null &&
        $('#staffNoMe').val() != undefined &&
        $('#staffNoMe').val() == '1'
      ) {
        $('#adminBtn').append(
          '<button id="adminEditBtn" type="button" class="btn btn-default"><span class="glyphicon glyphicon-edit"></span>&nbsp;管理员编辑</button>'
        );
        jQuery('#adminEditBtn').on('click', personbill.personbillList.doAdminEdit);
      }
    },
    /*
     * 生成表格组件
     */
    gridInit: function () {
      jQuery('#dataList').jqGrid({
        // 绝大部分情况下JS中单引号与双引号并无区别
        // 以下部分的值采用单引号和双引号无区别
        url: WEB_CTX_PATH + '/personbillAction.do?method=doInit',
        postData: { proxy: jQuery('#proxy').get(0).checked },
        regional: 'cn',
        datatype: 'json',
        colNames: [
          'id',
          '单据号',
          '公司',
          '部门',
          '单据类型',
          '单据日期',
          '价税合计',
          '收款人/单位',
          '申请人',
          '状态',
          '类型',
        ],
        colModel: [
          {
            name: 'BILLUID',
            index: 'BILLUID',
            hidden: true,
            key: true,
          },
          {
            name: 'BILLNO',
            index: 'BILLNO',
          },
          {
            name: 'UPORGNAME',
            index: 'UPORGNAME',
            align: 'center',
          },
          {
            name: 'ORGNAME',
            index: 'ORGNAME',
            align: 'center',
          },
          {
            name: 'TYPE',
            index: 'TYPE',
            formatter: function (type) {
              var titleStr = '';
              if (type == 'BX') {
                titleStr = '个人普通报销';
              } else if (type == 'CL') {
                titleStr = '个人差旅报销';
              } else if (type == 'ZJ') {
                titleStr = '银行间转款';
              } else if (type == 'FX') {
                titleStr = '支付业务';
              } else if (type == 'CX') {
                titleStr = '车辆费用报销';
              } else if (type == 'LC') {
                titleStr = '理财产品';
              } else if (type == 'XC') {
                titleStr = '薪酬发放';
              }
              return titleStr;
            },
          },

          {
            name: 'BILLDATE',
            index: 'BILLDATE',
            formatter: 'date',
            formatoptions: { srcformat: 'Y-m-d H:i:s', newformat: 'Y-m-d' },
            align: 'center',
          },
          {
            name: 'AMOUNT',
            index: 'AMOUNT',
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
            name: 'APPLICATUIDNAME',
            index: 'APPLICATUIDNAME',
            align: 'center',
          },
          {
            name: 'AGENTUIDNAME',
            index: 'AGENTUIDNAME',
            align: 'center',
          },

          {
            name: 'STATE',
            index: 'STATE',
            align: 'center',
          },
          {
            name: 'TYPE',
            index: 'TYPE',
            hidden: true,
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
        sortname: 'CREATEDATE', // 默认的排序索引,可根据需求添加该项
        sortorder: 'desc',
        gridComplete: function () {
          var ids = jQuery('#dataList').jqGrid('getDataIDs');
          var userData = jQuery('#dataList').jqGrid('getGridParam', 'userData');
          for (var i = 0; i < ids.length; i++) {
            var appStatus = jQuery('#dataList').jqGrid('getCell', ids[i], 'STATE');
            /*alert(appStatus);*/
            var id = jQuery('#dataList').jqGrid('getCell', ids[i], 'BILLNO');

            if (appStatus == '') {
              var btn = '<span>待审批</span>';
              jQuery('#dataList').jqGrid('setRowData', ids[i], { STATE: btn });
            } else if (appStatus == '待审批') {
              var btn = '<span>待审批</span>';
              jQuery('#dataList').jqGrid('setRowData', ids[i], { STATE: btn });
            } else {
              var type = jQuery('#dataList').jqGrid('getCell', ids[i], 'TYPE').trim();
              var titleStr = '';
              var bcode = '';
              if (type == '个人普通报销') {
                titleStr = '个人普通报销';
                bcode = 'FEE01001';
              } else if (type == '个人差旅报销') {
                titleStr = '个人差旅报销';
                bcode = 'FEE01002';
              } else if (type == '银行间转款') {
                titleStr = '银行间转款';
                bcode = 'FEE03001';
              } else if (type == '支付业务') {
                titleStr = '支付业务';
                bcode = 'FEE02001';
              } else if (type == '车辆费用报销') {
                titleStr = '车辆费用报销';
                bcode = 'FEE01003';
              } else if (type == '理财产品') {
                titleStr = '理财产品';
                bcode = 'FEE03002';
              } else if (type == '薪酬发放') {
                titleStr = '薪酬发放';
                bcode = 'FEE03003';
              }

              var btn =
                "<a id='view' href='javascript:void(0);'  onclick=\"doAppStatusFlow('" +
                titleStr +
                "','" +
                id +
                "','" +
                bcode +
                '\');">' +
                appStatus +
                '</a>';
              jQuery('#dataList').jqGrid('setRowData', ids[i], { STATE: btn });
            }
          }
        },

        emptyMsg: '查询结果为空', // 如果设置了该选项，在表格为空数据时撑开表格并显示设置的信息
        caption: '个人单据列表',
      });
      //导出表格
      jQuery('#dataList').jqGrid('navGrid', '#listPager', {
        add: false,
        del: false,
        edit: false,
        search: false,
        refresh: false,
      });

      /** 表格大小调整*/

      jQuery(window).on('resize.jqGrid', function () {
        jQuery('#dataList').jqGrid('setGridWidth', jQuery('.col-xs-12').width());
      });
      jQuery(window).triggerHandler('resize.jqGrid');
    },
    /*
     * 清空input框内容
     */
    doReset: function () {
      jQuery('input,select,textarea', jQuery('#dataList')).each(function () {
        if (this.type != 'button') {
          this.value = '';
        }
      });
      $('#state').val(null).select2();
      $('#type').val(null).select2();
      $('.select2-selection__placeholder').text('-请选择-');
      ajaxFormRequest(
        WEB_CTX_PATH +
          '/codeAction.do?method=getSelectOptions&element2CodeType=' +
          encodeURI(encodeURI("{'state':'flowType'}")),
        function (returnData) {
          if (initSelect2(returnData)) {
          }
        },
        function (state) {},
        'notifForm',
        true,
        ' '
      );

      ajaxFormRequest(
        WEB_CTX_PATH +
          '/codeAction.do?method=getSelectOptions&element2CodeType=' +
          encodeURI(encodeURI("{'type':'billType'}")),
        function (returnData) {
          if (initSelect2(returnData)) {
          }
        },
        function (type) {},
        'notifForm',
        true,
        ' '
      );
    },
    //详细画面
    queryDetail: function () {
      //码表id
      var paramIdArr = '';
      //页头
      var titleStr = '';
      //url
      var url = '';
      //判断id是否为空
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
      //单据类型判断
      var type = $('#dataList').jqGrid('getRowData', paramIdArr).TYPE;
      var titleStr = '';
      if (type == 'BX') {
        titleStr = '个人普通报销单详细';
        url =
          WEB_CTX_PATH +
          '/ordinarymainAction.do?method=doAddOrEdit&actionType=detail&billUid=' +
          paramIdArr[0];
        //					jQuery().openDlg({
        ////						parent: window.top,//此行调遮罩
        //						height: 800,//此行调高度
        //						width: 1100,
        //						url:url,
        //						title: titleStr
        //					});
      } else if (type == 'CL') {
        titleStr = '人民币差旅报销单详细';
        url =
          WEB_CTX_PATH +
          '/tripMainAction.do?method=detail&actionType=detail&paramId=' +
          paramIdArr[0];
        //					jQuery().openDlg({
        //						// parent: window.top,//此行调遮罩
        //						height : 700,// 此行调高度
        //						width : 1100,
        //						url : url,
        //						title : titleStr
        //					});
      } else if (type == 'ZJ') {
        titleStr = '银行间转款单详细';
        //					url = WEB_CTX_PATH+"/bankTransferStatAction.do?method=queryDetail&billUid="+paramIdArr[0]+"&actionType="+"detail";
        url =
          WEB_CTX_PATH +
          '/bankTransferAction.do?method=doAddOrEdit&actionType=detail&billUid=' +
          paramIdArr[0];
        //					jQuery().openDlg({
        ////						parent: window.top,//此行调遮罩
        //						height: 680,//此行调高度
        //						width: 1000,
        //						url:url,
        //						title: titleStr
        //					});
      } else if (type == 'FX') {
        titleStr = '付款报销单详细';
        url =
          WEB_CTX_PATH +
          '/paymentAction.do?method=doAddOrEdit&actionType=detail&paramId=' +
          paramIdArr[0];
        //					jQuery().openDlg({
        ////						parent: window.top,//此行调遮罩
        //						height: 700,//此行调高度
        //						width: 1100,
        //						url:url,
        //						title: titleStr
        //					});
      } else if (type == 'CX') {
        titleStr = '车辆费用报销';
        url =
          WEB_CTX_PATH +
          '/vehicleExpenseAction.do?method=doAddOrEdit&actionType=detail&billUid=' +
          paramIdArr[0];
        //					jQuery().openDlg({
        ////						parent: window.top,//此行调遮罩
        //						height: 700,//此行调高度
        //						width: 1100,
        //						url:url,
        //						title: titleStr
        //					});
      } else if (type == 'LC') {
        titleStr = '理财产品单详细';
        url =
          WEB_CTX_PATH +
          '/financingAction.do?method=doAddOrEdit&actionType=detail&billUid=' +
          paramIdArr[0];
      } else if (type == 'XC') {
        titleStr = '薪酬发放单详细';
        url =
          WEB_CTX_PATH +
          '/salaryAction.do?method=doEditOrDetail&actionType=detail&billUid=' +
          paramIdArr[0];
      }
      layer.open({
        type: 2,
        title: titleStr,
        content: url,
        fix: true,
        area: ['100%', '100%'],
        //		           /*注释部分功能：弹窗后立即最大化*/
        success: function (layerObj) {
          var currLayer = jQuery(layerObj);
          currLayer
            .css({ top: '0px', left: '0px', width: '100%', height: jQuery(window).height() })
            .find('iframe')
            .css('height', jQuery(window).height() - 50);
        },
      });
    },
    //打印画面
    doPrint: function () {
      //码表id
      var paramIdArr = '';
      //页头
      var titleStr = '';
      //url
      var url = '';
      //判断id是否为空
      paramIdArr = $('#dataList').jqGrid('getGridParam', 'selarrrow');
      if (paramIdArr && paramIdArr.length > 1) {
        //选中多条
        sweetAlert({
          title: '提示',
          text: '只能选择一条数据进行打印',
          type: 'error',
          showConfirmButton: true,
          confirmButtonText: '确认',
        });
        return;
      } else if (paramIdArr.length == 0) {
        //未选中数据
        sweetAlert({
          title: '提示',
          text: '请选择一条数据进行打印',
          type: 'error',
          showConfirmButton: true,
          confirmButtonText: '确认',
        });
        return;
      }
      var appStatus = $('#dataList').jqGrid('getRowData', paramIdArr).STATE;
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
      //单据类型判断
      var type = $('#dataList').jqGrid('getRowData', paramIdArr).TYPE;
      if (type == 'BX') {
        titleStr = '个人普通报销单打印';
        url = WEB_CTX_PATH + '/ordinarymainAction.do?method=print&paramId=' + paramIdArr[0];
        //					jQuery().openDlg({
        //						// parent: window.top,//此行调遮罩
        //						height : 600,// 此行调高度
        //						width : 1000,
        //						url : url,
        //						title : titleStr
        //					});
      } else if (type == 'CL') {
        titleStr = '人民币差旅报销单打印';
        url = WEB_CTX_PATH + '/tripMainAction.do?method=print&paramId=' + paramIdArr[0];
        //					jQuery().openDlg({
        //						// parent: window.top,//此行调遮罩
        //						height : 600,// 此行调高度
        //						width : 1000,
        //						url : url,
        //						title : titleStr
        //					});
      } else if (type == 'ZJ') {
        titleStr = '银行间转款单打印';
        url =
          WEB_CTX_PATH +
          '/bankTransferAction.do?method=print&billUid=' +
          paramIdArr[0] +
          '&actionType=print';
        //					jQuery().openDlg({
        ////						parent: window.top,//此行调遮罩
        //						height: 700,//此行调高度
        //						width: 1000,
        //						url:url,
        //						title: titleStr
        //					});
      } else if (type == 'CX') {
        titleStr = '车辆费用报销单打印';
        url = WEB_CTX_PATH + '/vehicleExpenseAction.do?method=print&paramId=' + paramIdArr[0];
        //					jQuery().openDlg({
        //						// parent: window.top,//此行调遮罩
        //						height : 600,// 此行调高度
        //						width : 1000,
        //						url : url,
        //						title : titleStr
        //					});
      } else if (type == 'FX') {
        titleStr = '付款报销单打印';
        url = WEB_CTX_PATH + '/paymentAction.do?method=print&paramId=' + paramIdArr[0];
        //					jQuery().openDlg({
        //						// parent: window.top,//此行调遮罩
        //						height : 600,// 此行调高度
        //						width : 1000,
        //						url : url,
        //						title : titleStr
        //					});
      } else if (type == 'LC') {
        titleStr = '理财产品单打印';
        url = WEB_CTX_PATH + '/financingAction.do?method=print&billUid=' + paramIdArr[0];
      } else if (type == 'XC') {
        titleStr = '薪酬发放单打印';
        url = WEB_CTX_PATH + '/salaryAction.do?method=print&billUid=' + paramIdArr[0];
      } else {
        return;
      }
      layer.open({
        type: 2,
        title: titleStr,
        content: url,
        fix: true,
        area: ['100%', '100%'],
        //		           /*注释部分功能：弹窗后立即最大化*/
        success: function (layerObj) {
          var currLayer = jQuery(layerObj);
          currLayer
            .css({ top: '0px', left: '0px', width: '100%', height: jQuery(window).height() })
            .find('iframe')
            .css('height', jQuery(window).height() - 50);
        },
      });
    },
    //根据条件重新加载数据
    doQuery: function () {
      var billNo = jQuery('#billNo').val();
      var state = jQuery('#state').val();
      var type = jQuery('#type').val();
      var starttime = jQuery('#startTime').val();
      var endtime = jQuery('#endTime').val();
      var proxy = jQuery('#proxy').get(0).checked;
      var upOrgId = jQuery('#upOrgId').val();
      var orgId = jQuery('#orgId').val();
      if (proxy == false) {
        proxy = '';
      }
      jQuery('#dataList')
        .jqGrid('setGridParam', {
          url: WEB_CTX_PATH + '/personbillAction.do?method=doInit',
          page: 1,
          postData: {
            billNo: billNo,
            state: state,
            type: type,
            starttime: starttime,
            endtime: endtime,
            proxy: proxy,
            upOrgId: upOrgId,
            orgId: orgId,
          },
        })
        .trigger('reloadGrid');
    },
    // 管理员编辑
    doAdminEdit: function () {
      var ids = jQuery('#dataList').jqGrid('getGridParam', 'selarrrow');
      if (ids.length != 1) {
        swal({
          title: '请选择要编辑的单据!',
          type: 'warning',
          confirmButtonText: '取消',
        });
        return false;
      }
      var type = $('#dataList').jqGrid('getRowData', ids[0]).TYPE;
      var billNo = $('#dataList').jqGrid('getCell', ids[0], 'BILLNO');
      jQuery().openDlg({
        width: 1250,
        height: 800,
        url:
          WEB_CTX_PATH +
          '/paymentAction.do?method=doAdminEdit&id=' +
          ids[0] +
          '&type=' +
          type +
          '&billNo=' +
          billNo,
        title: '管理员编辑',
        data: {
          parent: personbill.personbillList,
        },
      });
    },
  };
})();

personbill.personbillList.companytree = (function () {
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
        success: personbill.personbillList.companytree.createTreeAll,
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
          onClick: personbill.personbillList.companytree.onClickCompany,
        },
      };
      jQuery.fn.zTree.init(jQuery('#companyTree'), setting, allNodes);
      zTree = jQuery.fn.zTree.getZTreeObj('companyTree');
    },

    onClickCompany: function (e, treeId, treeNode) {
      //获取当前选中节点
      var node = zTree.getSelectedNodes()[0];
      jQuery('#upOrgId').val(node.id);
      jQuery('#upOrgName').val(node.name);
      var billtype = jQuery('#type').val();
      // 隐藏menu
      personbill.personbillList.companytree.hideMenu();
      // 初始化 部门
      jQuery('#orgId').val('');
      jQuery('#orgName').val('');
      personbill.personbillList.orgtree.init(node.id);
      // 初始化 项目
      jQuery('#projectUid').empty().select2();

      personbill.personbillList.companytree.changeProject();
      personbill.personbillList.superDetailTree.init();
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
      jQuery('body').bind('mousedown', personbill.personbillList.companytree.onBodyDown);
    },
    hideMenu: function () {
      jQuery('#companyContent').fadeOut('fast');
      jQuery('body').unbind('mousedown', personbill.personbillList.companytree.onBodyDown);
    },
    onBodyDown: function (event) {
      if (
        !(
          event.target.id == 'menuBtn' ||
          event.target.id == 'orgTreeBtn' ||
          jQuery(event.target).parents('#companyContent').length > 0
        )
      ) {
        personbill.personbillList.companytree.hideMenu();
      }
    },
    doError: function () {
      alert('Error');
    },
    doClose: function () {},
  };
})();

//20170822 部门+项目
personbill.personbillList.orgtree = (function () {
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
        success: personbill.personbillList.orgtree.createTreeAll,
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
          onClick: personbill.personbillList.orgtree.onClickOrg,
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
      personbill.personbillList.orgtree.hideMenu();
      // 初始化 项目  -- 最后做
      personbill.personbillList.orgtree.changeProject();
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
            $('.select2-selection__placeholder').text('-请选择-');
          }
        },
        function (state) {},
        'deptbillForm',
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
      jQuery('body').bind('mousedown', personbill.personbillList.orgtree.onBodyDown);
    },
    hideMenu: function () {
      jQuery('#orgContent').fadeOut('fast');
      jQuery('body').unbind('mousedown', personbill.personbillList.orgtree.onBodyDown);
    },
    onBodyDown: function (event) {
      if (
        !(
          event.target.id == 'menuBtn' ||
          event.target.id == 'orgTreeBtn' ||
          jQuery(event.target).parents('#orgContent').length > 0
        )
      ) {
        personbill.personbillList.orgtree.hideMenu();
      }
    },
    doError: function () {
      alert('Error');
    },

    doClose: function () {},
  };
})();
