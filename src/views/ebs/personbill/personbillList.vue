<template>
  <div id="orgContent" style="display: none; position: absolute; z-index: 999">
    <ul
      id="orgTree"
      class="ztree"
      style="
        width: 280px;
        min-height: 300px;
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
        min-height: 300px;
        margin-top: 1px;
        border: 1px solid #617775;
        background: #f0f6e4;
        overflow-y: scroll;
        overflow-x: auto;
      "
    ></ul>
  </div>
  <div class="container-fluid p-lr-10">
    <div class="row">
      <div class="col-xs-12">
        <div class="ilead-search">
          <form id="notifForm" name="notifForm" class="" method="post">
            <div class="panel-body">
              <input
                type="hidden"
                id="staffNoMe"
                name="staffNoMe"
                value="<%=staffNoMe%>"
                readonly
              />
              <div class="form-group col-xs-12">
                <label class="control-label col-xs-1">公司/部门：</label>
                <div class="col-xs-3">
                  <input
                    type="text"
                    class="form-control"
                    id="upOrgName"
                    name="upOrgName"
                    readonly
                    placeholder="公司名称"
                    onclick="personbill.personbillList.companytree.showOrgTree(); return false;"
                  />
                  <input type="hidden" id="upOrgId" name="upOrgId" />
                </div>

                <div class="col-xs-2">
                  <input
                    type="text"
                    class="form-control"
                    id="orgName"
                    name="orgName"
                    readonly
                    placeholder="部门名称"
                    onclick="personbill.personbillList.orgtree.showOrgTree(); return false;"
                  />
                  <input type="hidden" id="orgId" name="orgId" />
                </div>

                <div class="col-xs-2" style="margin-left: -3%; display: none">
                  <select class="form-control" id="projectUid" name="projectUid"> </select>
                </div>

                <label class="control-label col-xs-1">单据号：</label>
                <div class="col-xs-2">
                  <input
                    type="text"
                    maxlength="20"
                    class="form-control"
                    id="billNo"
                    name="billNo"
                    placeholder="单据号"
                  />
                </div>
              </div>
              <div class="form-group col-xs-12">
                <label class="control-label col-xs-1">单据类型：</label>
                <div class="col-xs-2">
                  <select id="type" type="text" class="form-control" name="type">
                    <option></option>
                  </select>
                </div>
                <label class="control-label col-xs-1">单据状态：</label>
                <div class="col-xs-2">
                  <select id="state" type="text" class="form-control" name="state">
                    <option></option>
                  </select>
                </div>
                <label class="control-label col-xs-1">单据日期：</label>
                <div class="col-xs-2">
                  <input
                    type="text"
                    class="laydate-icon-default ilead-laydate-icon-default form-control"
                    id="startTime"
                    name="startTime"
                    placeholder="起始"
                    onclick="laydate({istime: true, format: 'YYYY-MM-DD'})"
                  />
                </div>
                <div class="col-xs-2">
                  <input
                    type="text"
                    class="laydate-icon-default ilead-laydate-icon-default form-control"
                    id="endTime"
                    name="endTime"
                    placeholder="结束"
                    onclick="laydate({istime: true, format: 'YYYY-MM-DD'})"
                  />
                </div>
                <div class="form-group col-xs-3" style="display: none">
                  <label class="control-label col-xs-4">代理：</label>
                  <div class="col-xs-8">
                    <input
                      type="checkbox"
                      id="proxy"
                      style="position: absolute; top: 5px"
                      checked
                    />
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
            title="详细"
            onclick="personbill.personbillList.queryDetail()"
            id="detailBtn"
          >
            <span class="icon iconfont icon-liulan"></span>详细
          </button>
          <button
            type="button"
            class="btn"
            data-toggle="tooltip"
            data-placement="top"
            title="打印"
            onclick="personbill.personbillList.doPrint()"
            id="printBtn"
          >
            <span class="icon iconfont icon-bangongyongpin"></span>打印
          </button>
          <div id="adminBtn" style="float: right"> </div>
        </div>
        <table id="dataList" style="width: 100%"></table>
        <div id="listPager"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { onMounted } from 'vue';
  import './personbillList.js';

  onMounted(() => {
    /*
     * 初始化
     */
    jQuery(document).ready(function () {
      //初始化控件
      jQuery('#role').select2({
        minimumResultsForSearch: -1,
        data: [],
      });
      personbill.personbillList.init();
      personbill.personbillList.companytree.init();
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
    });
  });
</script>
