<template>
  <div class="container-fluid p-lr-10">
    <div class="row">
      <div class="col-xs-12">
        <div class="ilead-search">
          <form id="notifForm" name="notifForm" class="" method="post">
            <div class="panel-body">
              <div class="form-group col-xs-3">
                <label class="control-label col-xs-4">单据号：</label>
                <div class="col-xs-8">
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
              <div class="form-group col-xs-3">
                <label class="control-label col-xs-4">单据状态：</label>
                <div class="col-xs-8">
                  <select id="state" type="text" class="form-control" name="state">
                    <option></option>
                  </select>
                </div>
              </div>
              <div class="panel-body">
                <div class="form-group col-xs-5">
                  <label class="control-label col-xs-2">单据日期：</label>
                  <div class="col-xs-5">
                    <input
                      type="text"
                      class="laydate-icon-default ilead-laydate-icon-default form-control"
                      id="startTime"
                      name="startTime"
                      placeholder="起始"
                      onclick="laydate({istime:
                    true, format: 'YYYY-MM-DD'})"
                    />
                  </div>
                  <div class="col-xs-5">
                    <input
                      type="text"
                      class="laydate-icon-default ilead-laydate-icon-default form-control"
                      id="endTime"
                      name="endTime"
                      placeholder="结束"
                      onclick="laydate({istime: true,
                    format: 'YYYY-MM-DD'})"
                    />
                  </div>
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
          <!-- 					<button type="button" class="btn" data-toggle="tooltip"
        data-placement="top" style="right: 515px" title="代理报销"
        onclick="rmbtrip.rmbtripList.agencyPerson('trips')">
        <span class="icon iconfont icon-baoxiao"></span>代理报销
      </button> -->
          <button
            type="button"
            class="btn"
            data-toggle="tooltip"
            data-placement="top"
            style="right: 455px"
            title="新建"
            onclick="rmbtrip.rmbtripList.addOrEdit('add')"
          >
            <span class="icon iconfont icon-add"></span>新建
          </button>
          <button
            type="button"
            class="btn"
            data-toggle="tooltip"
            data-placement="top"
            style="right: 395px"
            title="编辑"
            onclick="rmbtrip.rmbtripList.addOrEdit('edit')"
          >
            <span class="icon iconfont icon-fankui"></span>编辑
          </button>
          <button
            type="button"
            class="btn"
            data-toggle="tooltip"
            data-placement="top"
            style="right: 335px"
            title="删除"
            onclick="rmbtrip.rmbtripList.deleteIds()"
          >
            <span class="iconfont icon-shanchu"></span>删除
          </button>
          <button
            type="button"
            class="btn"
            data-toggle="tooltip"
            data-placement="top"
            style="right: 275px"
            title="详细"
            onclick="rmbtrip.rmbtripList.detail()"
          >
            <span class="icon iconfont icon-liulan"></span>详细
          </button>
          <button
            type="button"
            class="btn"
            data-toggle="tooltip"
            data-placement="top"
            style="right: 215px"
            title="打印"
            onclick="rmbtrip.rmbtripList.print()"
          >
            <span class="icon iconfont icon-bangongyongpin"></span>打印
          </button>
          <button
            type="button"
            class="btn"
            data-toggle="tooltip"
            data-placement="top"
            style="right: 155px"
            title="启动"
            onclick="rmbtrip.rmbtripList.start()"
          >
            <span class="icon iconfont icon-yunongtongcaozuochenggong"></span>启动
          </button>
          <button
            style="display: none right: 95px"
            type="button"
            class="btn"
            data-toggle="tooltip"
            data-placement="top"
            title="撤回"
            onclick="rmbtrip.rmbtripList.callback()"
          >
            <span class="icon iconfont icon-shuaxin"></span>撤回
          </button>

          <button
            style="display: none right: 95px"
            type="button"
            class="btn"
            data-toggle="tooltip"
            data-placement="top"
            onclick="rmbtrip.rmbtripList.test(1)"
          >
            <span class="icon iconfont icon-shuaxin"></span>测试用：不可修改的审批节点
          </button>
          <button
            style="display: none right: 95px"
            type="button"
            class="btn"
            data-toggle="tooltip"
            data-placement="top"
            onclick="rmbtrip.rmbtripList.test(2)"
          >
            <span class="icon iconfont icon-shuaxin"></span>测试用：可修改的审批节点
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
  import './rmbtripList.js';

  onMounted(() => {
    /*
     * 初始化
     */
    jQuery(document).ready(function () {
      // 初始化控件
      jQuery('#role').select2({
        minimumResultsForSearch: -1,
        data: [],
      });
      rmbtrip.rmbtripList.init();
      ajaxFormRequest(
        WEB_CTX_PATH +
          '/codeAction.do?method=getSelectOptions&element2CodeType=' +
          encodeURI(encodeURI("{'state':'listFlowType'}")),
        function (returnData) {
          if (initSelect2(returnData)) {
          }
        },
        function (state) {},
        'notifForm',
        true,
        ' '
      );
    });
  });
</script>
