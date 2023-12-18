/*
 * 定义命名空间
 */
jQuery.namespace('attribute.attributeEdit');
attribute.attributeEdit = (function () {
  //初始化选择器
  var leftSel = $('#selectL');
  var rightSel = $('#selectR');
  //原始json数据
  var baseData;
  return {
    init: function () {
      //初始化选择器
      attribute.attributeEdit.initSelector();
      jQuery('#saveButton').on('click', attribute.attributeEdit.save);
      //变换标准类型
      jQuery('#standardType').on('change', function () {
        //切换标准类型时清除保存的JSON数据
        baseData = undefined;
      });

      //获得标准类型下拉框
      ajaxFormRequest(
        WEB_CTX_PATH +
          '/companystandardAction.do?method=getSelectStandardType&element2CodeType=' +
          encodeURI(encodeURI("{'standardType':'standardType'}")),
        function (returnData) {
          if (initSelect2(returnData)) {
          }
        },
        function (state) {},
        'notifForm',
        true,
        ' '
      );

      // 校验
      jQuery('#notifForm').validate({
        rules: {
          companyName: {
            required: true,
          },
          standardType: {
            required: true,
          },
        },
      });
    },
    checkParent: function (element) {
      //循环所有节点
      var parentId = element.attr('pid');
      if (parentId != '' && parentId != undefined) {
        //查找子级数量
        var right = rightSel.find("option[value='" + parentId + "']").length;
        //查找子级数量
        var left = leftSel.find("option[value='" + parentId + "']").length;
        //验证是否返回
        if (right == 0) {
          sweetAlert({
            title: '系统提示',
            text: '请选择父节点[' + leftSel.find("option[value='" + parentId + "']").text() + ']',
            type: 'error',
            showConfirmButton: true,
            confirmButtonText: '确认',
          });
          return false;
        }
      }
      return true;
    },
    appendToRight: function (element) {
      var have = false;
      rightSel.find('option').each(function () {
        if (this.value == element.val()) {
          have = true;
        }
      });
      if (have) {
        return;
      }
      rightSel.append(element.clone());
    },
    initSelector: function () {
      leftSel.dblclick(function () {
        $(this)
          .find('option:selected')
          .each(function () {
            //attribute.attributeEdit.checkParent($(this),leftSel,rightSel);
            //$(this).appendTo(rightSel);
            attribute.attributeEdit.appendToRight($(this));
          });
      });
      $('#toright').bind('click', function () {
        leftSel.find('option:selected').each(function () {
          attribute.attributeEdit.appendToRight($(this));
        });
      });

      rightSel.dblclick(function () {
        $(this)
          .find('option:selected')
          .each(function () {
            //attribute.attributeEdit.checkParent($(this),rightSel,leftSel);
            $(this).remove();
          });
      });
      $('#toleft').bind('click', function () {
        rightSel.find('option:selected').each(function () {
          //attribute.attributeEdit.checkParent($(this),rightSel,leftSel);
          $(this).remove();
        });
      });
    },
    insertLeft: function (id, pid, name) {
      //添加备选
      $('#selectL').append("<option value='" + id + "' pid='" + pid + "'>" + name + '</option>');
    },
    insertRight: function (id, pid, name) {
      //添加备选
      $('#selectR').append("<option value='" + id + "' pid='" + pid + "'>" + name + '</option>');
    },
    save: function () {
      //添加备选
      //校验数据变化
      if (baseData == undefined) {
        sweetAlert({
          title: '系统提示',
          text: '请重新点击查询按钮再保存',
          type: 'error',
          showConfirmButton: true,
          confirmButtonText: '确认',
        });
        return;
      }
      //获得右侧保存项
      var selVal = [];
      rightSel.find('option').each(function () {
        selVal.push(this.value);
      });
      //检证是否通过
      var isCheck = false;
      rightSel.find('option').each(function () {
        if (attribute.attributeEdit.checkParent($(this)) == false) {
          isCheck = true;
          return;
        }
      });
      //验证是否有上级节点,验证数据是否有修改
      if (isCheck || attribute.attributeEdit.checkData()) {
        return;
      }
      selVals = selVal.join(',');
      //selVals = rightSel.val();
      if (selVals == '') {
        //未选中数据
        sweetAlert({
          title: '系统提示',
          text: '没有选择任何项',
          type: 'error',
          showConfirmButton: true,
          confirmButtonText: '确认',
        });
        return;
      } else {
        // form表单校验
        if (!jQuery('#notifForm').valid()) {
          return false;
        }
        var upOrgId = $('#upOrgId').val();
        var standardType = $('#standardType').val();
        jQuery.ajax({
          url: WEB_CTX_PATH + '/attributeAction.do?method=updateRelation',
          data: { upOrgId: upOrgId, standardType: standardType, ids: selVals },
          type: 'POST',
          dataType: 'json',
          success: function (data) {
            //刷新页面数据
            attribute.attributeEdit.searchSelector();
            //显示成功信息
            var msg, type;
            if (data.data == 1) {
              msg = '操作成功';
              type = 'success';
            } else {
              msg = '操作失败';
              type = 'error';
            }
            //未选中数据
            sweetAlert({
              title: '系统提示',
              text: msg,
              type: type,
              showConfirmButton: true,
              confirmButtonText: '确认',
            });
          },
        });
      }
    },
    checkData: function () {
      //校验数据变化
      if (baseData != undefined) {
        //保存的数量
        var rightSelected = rightSel.find('option').length;
        //判断总数是否一致
        if (baseData.length != rightSelected) {
          return false;
        }
        var isHave = true;
        //右侧所有列
        var rightOptions = rightSel.find('option');
        for (i = 0; i < baseData.length; i++) {
          //(returnData[i].feeTypeAttrUid,returnData[i].parentId,returnData[i].attributeName);
          var optionHave = false;
          for (j = 0; j < rightOptions.length; j++) {
            if (baseData[i].feeTypeAttrUid == rightOptions[j].value) {
              optionHave = true;
              break;
            }
          }
          if (optionHave == false) {
            isHave = false;
            break;
          }
        }
        //判断数据是否有更改
        if (!isHave) {
          return false;
        } else {
          sweetAlert({
            title: '系统提示',
            text: '数据没有修改',
            type: 'error',
            showConfirmButton: true,
            confirmButtonText: '确认',
          });
          return true;
        }
      } else {
        return false;
      }
    },
    searchSelector: function () {
      //清除json数据
      baseData = undefined;
      //禁用保存
      $('#saveButton').attr('disabled', true);
      // form表单校验
      if ($('#upOrgId').val() == '') {
        //未选中数据
        sweetAlert({
          title: '系统提示',
          text: '请选择公司',
          type: 'error',
          showConfirmButton: true,
          confirmButtonText: '确认',
        });
        return false;
      }
      //获得待选的数据项
      ajaxFormRequest(
        WEB_CTX_PATH +
          '/attributeAction.do?method=doInitLeftSelector&upOrgId=' +
          $('#upOrgId').val(),
        function (returnData) {
          //清空数据
          $('#selectL').empty();
          //插入备选
          if (returnData != undefined && returnData != null && returnData.length > 0) {
            for (i = 0; i < returnData.length; i++) {
              attribute.attributeEdit.insertLeft(
                returnData[i].feeTypeAttrUid,
                returnData[i].parentId,
                returnData[i].attributeName
              );
            }
          }
        },
        function (state) {},
        'notifForm',
        true,
        ' '
      );
      //获得已选的数据项
      ajaxFormRequest(
        WEB_CTX_PATH +
          '/attributeAction.do?method=doInitRightSelector&upOrgId=' +
          $('#upOrgId').val() +
          '&standardType=' +
          $('#standardType').val(),
        function (returnData) {
          baseData = returnData;
          //清空数据
          $('#selectR').empty();
          //插入备选
          if (returnData != undefined && returnData != null && returnData.length > 0) {
            for (i = 0; i < returnData.length; i++) {
              attribute.attributeEdit.insertRight(
                returnData[i].feeTypeAttrUid,
                returnData[i].parentId,
                returnData[i].attributeName
              );
            }
          }
          //解禁
          $('#saveButton').attr('disabled', false);
        },
        function (state) {},
        'notifForm',
        true,
        ' '
      );
    },
  };
})();

var api = parent.layer.getUserData();
var actionType;

attribute.attributeEdit.companytree = (function () {
  var zTree;
  return {
    init: function () {
      //			attribute.attributeEdit.companytree.createTree();
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
        success: attribute.attributeEdit.companytree.createTreeAll,
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
          onClick: attribute.attributeEdit.companytree.onClickOrg,
          onAsyncSuccess: attribute.attributeEdit.companytree.checkTree,
        },
      };

      jQuery.fn.zTree.init(jQuery('#companyTree'), setting, allNodes);
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
      //查询
      attribute.attributeEdit.searchSelector();
      attribute.attributeEdit.companytree.hideMenu();
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

      jQuery('body').bind('mousedown', attribute.attributeEdit.companytree.onBodyDown);
    },
    hideMenu: function () {
      jQuery('#companyContent').fadeOut('fast');
      jQuery('body').unbind('mousedown', attribute.attributeEdit.companytree.onBodyDown);
    },
    onBodyDown: function (event) {
      if (
        !(
          event.target.id == 'menuBtn' ||
          event.target.id == 'orgTreeBtn' ||
          jQuery(event.target).parents('#companyContent').length > 0
        )
      ) {
        attribute.attributeEdit.companytree.hideMenu();
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
      attribute.attributeEdit.companytree.doClose();
    },
    doError: function () {
      alert('Error');
    },
    doClose: function () {},
  };
})();
