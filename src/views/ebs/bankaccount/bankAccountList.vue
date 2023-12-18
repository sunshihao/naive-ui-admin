<template>
  <div class="container-fluid p-lr-10">
    <div class="row">
      <div class="col-xs-12">
        <div class="ilead-search">
          <form id="bankAccountForm" name="bankAccountForm" class="" method="post">
            <div class="panel-body">
              <div class="form-group col-xs-12">
                <label class="control-label col-xs-1">公司名称：</label>
                <div class="col-xs-2">
                  <input
                    type="text"
                    class="form-control"
                    id="companyName"
                    name="companyName"
                    style=""
                    readonly
                    placeholder="公司名称"
                    onclick="bankaccount.bankAccountList.companytree.showOrgTree(); return false;"
                    onchange="changeRole()"
                  />
                  <input type="hidden" id="upOrgId" name="upOrgId" />
                </div>

                <label class="control-label col-xs-1">银行：</label>
                <div class="col-xs-2">
                  <select type="text" class="form-control" id="bankCd" name="bankCd">
                    <option></option>
                  </select>
                </div>

                <label class="control-label col-xs-1">银行帐号：</label>
                <div class="col-xs-2">
                  <input
                    type="text"
                    class="form-control"
                    onkeyup="bankaccount.bankAccountList.cky(this)"
                    id="bankAccount"
                    name="bankAccount"
                    maxlength="100"
                  />
                </div>

                <label class="control-label col-xs-1">启用状态：</label>
                <div class="col-xs-2">
                  <select type="text" class="form-control" id="startState" name="startState">
                    <option></option>
                  </select>
                </div>
              </div>
            </div>
            <div class="panel-btn">
              <button type="button" class="btn btn-default" id="queryBtn">
                <span class="glyphicon glyphicon-search"></span> 查询
              </button>
              <button type="reset" class="btn btn-default" id="resetBtn">
                <span class="glyphicon glyphicon-refresh"></span> 重置
              </button>
            </div>

            <div id="treeContent" style="display: none; position: absolute; z-index: 999">
              <ul
                id="orgTree"
                class="ztree"
                style="
                  width: 280px;
                  height: auto;
                  margin-top: 1px;
                  border: 1px solid #617775;
                  background: #f0f6e4;
                  overflow-y: scroll;
                  overflow-x: auto;
                "
              ></ul>
            </div>
            <div id="companyContent" style="display: none; position: absolute; z-index: 999">
              <ul
                id="companyTree"
                class="ztree"
                style="
                  width: 280px;
                  height: auto;
                  margin-top: 1px;
                  border: 1px solid #617775;
                  background: #f0f6e4;
                  overflow-y: scroll;
                  overflow-x: auto;
                "
              ></ul>
            </div>
          </form>
        </div>
      </div>
    </div>

    <div class="row">
      <div class="col-xs-12 ilead-table">
        <div class="table-tool">
          <button
            type="button"
            class="btn"
            data-toggle="tooltip"
            data-placement="top"
            title="新建"
            onclick="bankaccount.bankAccountList.addOrEdit('add')"
            id="addBtn"
          >
            <span class="icon iconfont icon-add"></span>新建
          </button>
          <button
            type="button"
            class="btn"
            data-toggle="tooltip"
            data-placement="top"
            title="编辑"
            onclick="bankaccount.bankAccountList.addOrEdit('edit')"
            id="editBtn"
          >
            <span class="icon iconfont icon-fankui"></span>编辑
          </button>
          <button
            type="button"
            id="delBtn"
            class="btn"
            data-toggle="tooltip"
            data-placement="top"
            title="删除"
            onclick="bankaccount.bankAccountList.deleteBankAccount()"
          >
            <span class="iconfont icon-shanchu"></span>删除
          </button>
          <button
            type="button"
            class="btn"
            data-toggle="tooltip"
            data-placement="top"
            title="详细"
            onclick="bankaccount.bankAccountList.addOrEdit('datail')"
            id="detailBtn"
          >
            <span class="icon iconfont icon-liulan"></span>详细
          </button>
        </div>
        <table id="dataList" style="width: 100%"></table>
        <div id="listPager"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { onMounted } from 'vue';
  import './bankAccountList.js';

  onMounted(() => {
    /*
     * 初始化
     */
    jQuery(document).ready(function () {
      bankaccount.bankAccountList.init();
      bankaccount.bankAccountList.companytree.init();
      //调用下拉列表  bankName'upOrgId'为select组件id、'bankName'
      ajaxFormRequest(
        WEB_CTX_PATH +
          '/codeAction.do?method=getSelectOptions&element2CodeType=' +
          encodeURI(encodeURI("{'bankCd':'bankName'}")),
        function (returnData) {
          if (initSelect2(returnData)) {
            // 操作类型
            var actionType = jQuery('#actionType').val();
            if (actionType == 'edit' || actionType == 'datail') {
              $('#bankCd').val(bankCd).select2();
            }
          }
        },
        function (state) {},
        'bankAccountForm',
        true,
        ' '
      );

      ajaxFormRequest(
        WEB_CTX_PATH +
          '/codeAction.do?method=getSelectOptions&element2CodeType=' +
          encodeURI(encodeURI("{'startState':'startType'}")),
        function (returnData) {
          if (initSelect2(returnData)) {
            // 操作类型
            var actionType = jQuery('#actionType').val();
            if (actionType == 'edit' || actionType == 'datail') {
              $('#startState').val(startState).select2();
            }
          }
        },
        function (state) {},
        'bankAccountForm',
        true,
        ' '
      );
    });
  });
</script>
