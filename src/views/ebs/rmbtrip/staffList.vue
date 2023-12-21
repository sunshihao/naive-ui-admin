<template>
  <div class="container-fluid p-lr-10 bg-write">
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
    <div class="row">
      <div class="col-xs-14">
        <div class="row panel panel-default ilead-search">
          <form id="staffForm" name="staffForm" class="form-inline" method="post">
            <div class="panel-body" style="margin-bottom: 12px">
              <label class="control-label col-xs-1">公司</label>
              <div class="col-xs-2">
                <input
                  type="text"
                  class="form-control"
                  id="upOrgName"
                  name="upOrgName"
                  readonly
                  placeholder="公司名称"
                  onfocus="rmbtrip.staffList.companytree.showOrgTree(); return false;"
                />
                <input type="hidden" id="upOrgId" name="upOrgId" />
              </div>
              <label class="control-label col-xs-1">部门</label>
              <div class="col-xs-2">
                <input
                  type="text"
                  class="form-control"
                  id="orgName"
                  name="orgName"
                  readonly
                  placeholder="部门名称"
                  onclick="rmbtrip.staffList.orgtree.showOrgTree(); return false;"
                />
                <input type="hidden" id="orgId" name="orgId" />
              </div>
              <label class="control-label col-xs-1">卡号</label>
              <div class="col-xs-2">
                <input
                  type="text"
                  maxlength="20"
                  class="form-control"
                  id="staffNo"
                  name="staffNo"
                  placeholder="卡号"
                />
              </div>
              <label class="control-label col-xs-1">姓名</label>
              <div class="col-xs-2">
                <input
                  type="text"
                  maxlength="20"
                  class="form-control"
                  id="staffName"
                  name="staffName"
                  placeholder="姓名"
                />
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
          </form>
        </div>
      </div>
    </div>

    <div class="row">
      <div class="col-xs-12 ilead-table">
        <table id="dataList" style="width: 100%"></table>
        <div id="listPager"></div>
      </div>
    </div>
    <div class="window-footer">
      <button type="button" id="chooseButton" class="btn btn-default">选择</button>
      <button type="button" id="closeButton" class="btn btn-hollow">关闭</button>
    </div>
  </div>
</template>

<script setup>
  import { onMounted } from 'vue';
  import './staffList.js';

  onMounted(() => {
    /*
     * 初始化
     */
    jQuery(document).ready(function () {
      rmbtrip.staffList.companytree.init();
      rmbtrip.staffList.init();
    });
  });
</script>
