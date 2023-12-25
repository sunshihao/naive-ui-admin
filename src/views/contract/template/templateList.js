//定义命名空间根据模块名和页面名称定义
jQuery.namespace('TemplateList');

TemplateList = (function () {
  return {
    init: function () {
      TemplateList.gridInit();
      TemplateList.bindEvent();
      // hr.CommonSelect.initCompanySelect("subordinateCompanies","dept","");
      hr.CommonSelect.initCompanySelect('subordinateCompanies', '', '', '', '1'); // 所属权限
    },

    bindEvent: function () {
      jQuery('#queryBtn').on('click', TemplateList.doQuery);
      jQuery('#resetBtn').on('click', TemplateList.doReset);
      jQuery('#downBtn').on('click', TemplateList.doDown);
      jQuery('#addBtn').on('click', TemplateList.doNew);
      jQuery('#editBtn').on('click', TemplateList.doEdit);
      jQuery('#startBtn').on('click', TemplateList.doStart);
      jQuery('#endBtn').on('click', TemplateList.doEnd);
    },

    gridInit: function () {
      //生成表格组件
      jQuery('#dataList').jqGrid({
        //绝大部分情况下JS中单引号与双引号并无区别
        //以下部分的值采用单引号和双引号无区别
        //		        url : WEB_CTX_PATH_CON + "/templateAction.do?method=doQuery",
        regional: 'cn',
        datatype: 'json',
        colNames: [
          '模板ID',
          '所属公司',
          '模板编号',
          '模板名称',
          '模板分类ID',
          '模板分类',
          '备注',
          '模板状态ID',
          '模板状态',
          '资质凭证状态',
          '资质凭证url',
          '创建人',
          '创建时间',
          '修改人',
          '修改时间',
        ],
        operatorKey: 'act',
        shrinkToFit: true,
        colModel: [
          { name: 'templateId', index: 'templateId', hidden: true, key: true },
          {
            name: 'subordinateCompanies',
            index: 'subordinateCompanies',
            align: 'center',
            width: 25,
          },
          { name: 'code', index: 'code', align: 'center', width: 15 },
          { name: 'name', index: 'name', align: 'center', width: 25 },
          { name: 'type', index: 'type', hidden: true },
          { name: 'typeNm', index: 'typeNm', align: 'center', width: 20 },
          { name: 'remark', index: 'remark', align: 'center', width: 25 },
          { name: 'status', index: 'status', hidden: true },
          { name: 'statusNm', index: 'statusNm', align: 'center', width: 15 },
          { name: 'certificateName', index: 'certificateName', align: 'center', hidden: true },
          { name: 'certificateUrl', index: 'certificateUrl', align: 'center', hidden: true },
          { name: 'createBy', index: 'createBy', align: 'center', hidden: true },
          {
            name: 'createDate',
            index: 'createDate',
            align: 'center',
            hidden: true,
            formatter: 'date',
            formatoptions: { srcformat: 'Y-m-d H:i:s', newformat: 'Y-m-d H:i:s' },
          },
          { name: 'updateBy', index: 'updateBy', align: 'center', hidden: true },
          {
            name: 'updateDate',
            index: 'updateDate',
            align: 'center',
            hidden: true,
            formatter: 'date',
            formatoptions: { srcformat: 'Y-m-d H:i:s', newformat: 'Y-m-d H:i:s' },
          },
        ],
        //exportCol:'all',//设置使用导航栏中的excel导出功能时导出的列:1.默认:导出所有非隐藏列 2.'all':包括隐藏列都导出 3.自定义
        //exportCol:['notifNo','notifTitle','editPer'],
        rowNum: 10, //每页最大显示行数
        autowidth: true, // grid的宽度会根据父元素的宽度自动重新计算
        height: '100%',
        multiselect: true, //多选（表格会多出一列选择框）
        multiboxonly: true, // 只可单选
        beforeSelectRow: TemplateList.beforeSelectRow,
        rownumbers: true, //显示行号
        rownumWidth: 50,
        rowList: [10, 20, 30], //其他可选每页最大显示行数
        pager: '#listPager',
        mtype: 'post',
        viewrecords: false,
        sortname: 'updateDate', //默认的排序索引,可根据需求添加该项
        sortorder: 'desc', //默认的排序顺序,可根据需求添加该项
        emptyMsg: '查询结果为空', //如果设置了该选项，在表格为空数据时撑开表格并显示设置的信息
        gridComplete: function () {
          // 为指定列做 公司编码到名称 的映射
          var ids = jQuery('#dataList').jqGrid('getDataIDs');
          var userData = jQuery('#dataList').jqGrid('getGridParam', 'userData');
        },
        footerrow: false, //如果需要一行统计行则设置该属性
        caption: '合同模板列表',
      });
      //			jQuery("#dataList").jqGrid('navGrid', '#listPager', {
      //				edit : false,add : false,del : false,refresh : false,
      //				exportExcel :true
      //			});
      //下面代码是为了在用户调整浏览器时表格宽度始终与窗口宽度一致
      jQuery(window).on('resize.jqGrid', function () {
        jQuery('#dataList').jqGrid('setGridWidth', jQuery('.col-xs-12').width(), true);
      });
      jQuery(window).triggerHandler('resize.jqGrid');
    },

    beforeSelectRow: function () {
      $('#dataList').jqGrid('resetSelection');
      return true;
    },

    /* 表格查询 */
    doQuery: function () {
      /*获取注脚的数据*/
      //			var footer = jQuery("#dataList").footerData("get");
      /*获取当前页数。可用于表格查询后保持原先页数*/
      //			var pageNum = jQuery("#dataList").jqGrid("getCurrentPage");
      var qUrl = WEB_CTX_PATH_CON + '/templateAction.do?method=doQuery&';
      jQuery('#dataList')
        .jqGrid('setGridParam', {
          url: qUrl,
          //		        page : pageNum,
          page: 1,
          postData: jQuery('#templateForm').serializeJson(), //将表单内查询条件转换为json数据
        })
        .trigger('reloadGrid');
    },

    // 表格重置
    doReset: function () {
      jQuery('input,select,textarea', jQuery('#templateForm')).each(function () {
        if (this.type != 'button') {
          this.value = '';
        }
      });
    },

    // 新建
    doNew: function () {
      var lapi = jQuery().openDlg({
        width: 1142,
        height: 554,
        offset: ['72px', '212px'],
        //modal: true,
        url: WEB_CTX_PATH_CON + '/templateAction.do?method=doEdit&actionType=add',
        title: '新增合同模板',
        data: {
          parent: TemplateList,
        },
      });

      /*另一种弹窗方式*/
      //			jQuery().openDlg({
      //				 width: 760,
      //				 height: 500,
      //				 url : WEB_CTX_PATH_CON + "/ui4NotifAction.do?method=doEdit",
      //				 title: "查看公告",
      //				 data: {
      //					 "actionType": "add"
      //				 }
      //			});
    },

    // 编辑
    doEdit: function (rowId, id) {
      // 获取选中的数据ID
      var ids = $('#dataList').jqGrid('getGridParam', 'selarrrow');

      if (ids.length == 0 || ids.length > 1) {
        var alertTitle = '';

        if (ids.length == 0) {
          alertTitle = SYS_MSG.TITLE_RECORD_SELECT;
        } else if (ids.length > 1) {
          alertTitle = SYS_MSG.TITLE_NO_MORE_RECORD_SELECT;
        }

        sweetAlert({
          title: alertTitle,
          text: SYS_MSG.MSG_AUOT_CLOSE,
          type: 'warning',
          showConfirmButton: false,
          timer: SYS_CONF.ALERT_TIMER,
        });
        return false;
      }

      jQuery().openDlg({
        parent: window.top,
        width: 1142,
        height: 554,
        offset: ['72px', '212px'],
        //				modal: true,
        url: WEB_CTX_PATH_CON + '/templateAction.do?method=doEdit&actionType=edit&id=' + ids,
        title: '编辑合同模板',
        data: {
          parent: TemplateList,
        },
      });
    },

    //下载
    doDown: function (rowId, id) {
      // 获取选中的数据ID
      var ids = $('#dataList').jqGrid('getGridParam', 'selarrrow');

      if (ids.length == 0 || ids.length > 1) {
        var alertTitle = '';

        if (ids.length == 0) {
          alertTitle = SYS_MSG.TITLE_RECORD_SELECT;
        } else if (ids.length > 1) {
          alertTitle = SYS_MSG.TITLE_NO_MORE_RECORD_SELECT;
        }

        sweetAlert({
          title: alertTitle,
          text: SYS_MSG.MSG_AUOT_CLOSE,
          type: 'warning',
          showConfirmButton: false,
          timer: SYS_CONF.ALERT_TIMER,
        });
        return false;
      }
      var rowData = $('#dataList').jqGrid('getRowData', ids);

      if (rowData.status == 0) {
        sweetAlert({
          title: '模板已禁用，无法下载',
          text: SYS_MSG.MSG_AUOT_CLOSE,
          type: 'warning',
          showConfirmButton: false,
          timer: SYS_CONF.ALERT_TIMER,
        });
        return false;
      }
      jQuery().openDlg({
        width: 1142,
        height: 554,
        offset: ['72px', '212px'],
        //				modal: true,
        url: WEB_CTX_PATH_CON + '/templateAction.do?method=doDown&id=' + ids,
        title: '下载合同模板',
        data: {},
      });
    },

    // 启用
    doStart: function (rowId, id) {
      /// 获取选中的数据ID
      var ids = $('#dataList').jqGrid('getGridParam', 'selarrrow');

      if (ids.length == 0 || ids.length > 1) {
        var alertTitle = '';

        if (ids.length == 0) {
          alertTitle = SYS_MSG.TITLE_RECORD_SELECT;
        } else if (ids.length > 1) {
          alertTitle = SYS_MSG.TITLE_NO_MORE_RECORD_SELECT;
        }

        sweetAlert({
          title: alertTitle,
          text: SYS_MSG.MSG_AUOT_CLOSE,
          type: 'warning',
          showConfirmButton: false,
          timer: SYS_CONF.ALERT_TIMER,
        });
        return false;
      }

      // 模板状态
      var rowData = $('#dataList').jqGrid('getRowData', ids);

      if (rowData.status == 1) {
        sweetAlert({
          title: '该状态不能进行此操作',
          text: SYS_MSG.MSG_AUOT_CLOSE,
          type: 'warning',
          showConfirmButton: false,
          timer: SYS_CONF.ALERT_TIMER,
        });
        return false;
      } else
        ajaxRequest(
          'templateAction.do?method=doStart',
          TemplateList.delSuccess,
          TemplateList.initError,
          'ids=' + ids
        );
    },

    // 停用
    doEnd: function (rowId, id) {
      // 获取选中的数据ID
      var ids = $('#dataList').jqGrid('getGridParam', 'selarrrow');

      if (ids.length == 0 || ids.length > 1) {
        var alertTitle = '';

        if (ids.length == 0) {
          alertTitle = SYS_MSG.TITLE_RECORD_SELECT;
        } else if (ids.length > 1) {
          alertTitle = SYS_MSG.TITLE_NO_MORE_RECORD_SELECT;
        }

        sweetAlert({
          title: alertTitle,
          text: SYS_MSG.MSG_AUOT_CLOSE,
          type: 'warning',
          showConfirmButton: false,
          timer: SYS_CONF.ALERT_TIMER,
        });
        return false;
      }

      // 模板状态
      var rowData = $('#dataList').jqGrid('getRowData', ids);

      if (rowData.status == 0) {
        sweetAlert({
          title: '该状态不能进行此操作',
          text: SYS_MSG.MSG_AUOT_CLOSE,
          type: 'warning',
          showConfirmButton: false,
          timer: SYS_CONF.ALERT_TIMER,
        });
        return false;
      } else
        ajaxRequest(
          'templateAction.do?method=doEnd',
          TemplateList.delSuccess,
          TemplateList.initError,
          'ids=' + ids
        );
    },
    delSuccess: function (returnData) {
      if (returnData.result === 'success') {
        // 提示保存成功
        sweetAlert({
          title: '操作成功',
          text: SYS_MSG.MSG_AUOT_CLOSE,
          type: 'success',
          showConfirmButton: false,
          timer: SYS_CONF.ALERT_TIMER,
        });
        TemplateList.doQuery();
      } else {
        sweetAlert({
          title: '操作失败',
          text: SYS_MSG.MSG_AUOT_CLOSE,
          type: 'success',
          showConfirmButton: false,
          timer: SYS_CONF.ALERT_TIMER,
        });
      }
    },

    initError: function (req, status, error) {
      sweetAlert({
        title: status + '||' + error,
        text: SYS_MSG.MSG_AUOT_CLOSE,
        type: 'error',
        showConfirmButton: false,
        timer: SYS_CONF.ALERT_TIMER,
      });
    },
  };
})();
