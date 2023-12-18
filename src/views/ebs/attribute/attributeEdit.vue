<template>
  <div class="container-fluid p-lr-10">
    <div class="row">
      <div class="col-xs-12">
        <div class="ilead-search">
          <form id="notifForm" name="notifForm" class="" method="post">
            <div class="panel-body">
              <div class="form-group col-xs-3">
                <label class="control-label col-xs-4">公司：</label>
                <div class="col-xs-8">
                  <input
                    type="text"
                    class="form-control"
                    id="companyName"
                    name="companyName"
                    readonly
                    placeholder="公司名称"
                    onclick="attribute.attributeEdit.companytree.showOrgTree(); return false;"
                    onchange="changeRole()"
                  />
                  <input type="hidden" id="upOrgId" name="upOrgId" value="" />
                </div>
              </div>
              <div class="form-group col-xs-3">
                <label class="control-label col-xs-4">标准类型：</label>
                <div class="col-xs-8">
                  <select
                    class="form-control"
                    id="standardType"
                    name="standardType"
                    style="width: 165px"
                  >
                    <option value="">-请选择-</option>
                  </select>
                </div>
              </div>
            </div>
            <div class="panel-btn">
              <button
                type="button"
                class="btn btn-default"
                id="queryBtn"
                onclick="attribute.attributeEdit.searchSelector()"
              >
                <span class="glyphicon glyphicon-search"></span> 查询
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
        <div
          class="ui-jqgrid ui-widget ui-widget-content ui-corner-all"
          id="gbox_dataList"
          dir="ltr"
          style="width: 100%"
        >
          <div class="ui-jqgrid-view" role="grid" id="gview_dataList">
            <div
              class="ui-jqgrid-titlebar ui-jqgrid-caption ui-widget-header ui-corner-top ui-helper-clearfix"
            >
              <span class="ui-jqgrid-title">公司标准属性设置</span>
            </div>
            <div class="demo">
              <div class="select_side">
                <p>待选属性</p>
                <select id="selectL" name="selectL" class="select" multiple="multiple"> </select>
              </div>
              <div class="select_opt">
                <p id="toright" title="添加">&gt;</p>
                <p id="toleft" title="移除">&lt;</p>
              </div>
              <div class="select_side">
                <p>已选属性</p>
                <select id="selectR" name="selectR" class="select" multiple="multiple"> </select>
              </div>
              <div class="sub_btn">
                <button type="button" id="saveButton" class="btn btn-default">保存</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { onMounted } from 'vue';
  import './attributeEdit.js';

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
      attribute.attributeEdit.init();
      attribute.attributeEdit.companytree.init();
    });
  });
</script>
