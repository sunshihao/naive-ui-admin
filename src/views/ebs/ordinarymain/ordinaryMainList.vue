<template>
  <div class="container-fluid p-lr-10">
    <div id="orgContent" style="display: none; position: absolute; z-index: 999">
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
    <div class="row">
      <div class="col-xs-12">
        <div class="ilead-search">
          <form id="ordinarymainForm" name="ordinarymainForm" class="" method="post">
            <div class="panel-body">
              <div class="form-group col-xs-12">
                <label class="control-label col-xs-1" style="width: 10%">公司/部门：</label>
                <div class="col-xs-2">
                  <input
                    type="text"
                    class="form-control"
                    id="upOrgName"
                    name="upOrgName"
                    readonly
                    placeholder="公司名称"
                    onclick="ordinarymain.companytree.showOrgTree(); return false;"
                  />
                  <input type="hidden" id="upOrgId" name="upOrgId" />
                </div>
                <div class="col-xs-2">
                  <input
                    type="text"
                    class="form-control"
                    id="orgName"
                    name="orgName"
                    style="margin-left: -20px"
                    readonly
                    placeholder="部门名称"
                    onclick="ordinarymain.orgtree.showOrgTree(); return false;"
                  />
                  <input type="hidden" id="orgId" name="orgId" />
                </div>
                <div class="col-xs-2" style="margin-left: -40px; display: none">
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

              <!-- 						<div class="form-group col-xs-3"> -->

              <!-- 						</div> -->
            </div>

            <div class="panel-body">
              <div class="form-group col-xs-12">
                <label class="control-label col-xs-1" style="width: 10%">单据状态：</label>
                <div class="col-xs-2">
                  <select id="state" type="text" class="form-control" name="state">
                    <option></option>
                  </select>
                </div>
                <div class="col-xs-2"></div>
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
        <div class="table-tool">
          <button
            type="button"
            class="btn"
            data-toggle="tooltip"
            data-placement="top"
            title="新建"
            @click="ordinarymain.addOrEdit('add')"
          >
            <span class="icon iconfont icon-add"></span>新建
          </button>
          <button
            type="button"
            class="btn"
            data-toggle="tooltip"
            data-placement="top"
            title="编辑"
            @click="ordinarymain.addOrEdit('edit')"
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
            @click="ordinarymain.deleteOrdinaryMain()"
          >
            <span class="iconfont icon-shanchu"></span>删除
          </button>
          <button
            type="button"
            class="btn"
            data-toggle="tooltip"
            data-placement="top"
            title="详细"
            @click="ordinarymain.addOrEdit('detail')"
          >
            <span class="icon iconfont icon-liulan"></span>详细
          </button>
          <button
            type="button"
            class="btn"
            data-toggle="tooltip"
            data-placement="top"
            title="打印"
            @click="ordinarymain.print()"
          >
            <span class="icon iconfont icon-bangongyongpin"></span>打印
          </button>
          <button
            type="button"
            class="btn"
            data-toggle="tooltip"
            data-placement="top"
            title="启动"
            @click="ordinarymain.start()"
          >
            <span class="icon iconfont icon-yunongtongcaozuochenggong"></span>启动
          </button>
          <button
            style="display: none"
            type="button"
            class="btn"
            data-toggle="tooltip"
            data-placement="top"
            title="撤回"
            @click="ordinarymain.callback()"
          >
            <span class="icon iconfont icon-shuaxin"></span>撤回
          </button>
          <button
            style="display: none"
            type="button"
            class="btn"
            data-toggle="tooltip"
            data-placement="top"
            title="撤回"
            @click="ordinarymain.test(1)"
          >
            <span class="icon iconfont icon-shuaxin"></span>测试用：不可修改的审批节点
          </button>
          <button
            style="display: none"
            type="button"
            class="btn"
            data-toggle="tooltip"
            data-placement="top"
            title="撤回"
            @click="ordinarymain.test(2)"
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
  import ordinarymain from './ordinaryMainList.js';

  onMounted(() => {
    /*
     * 初始化
     */
    jQuery(document).ready(function () {
      ordinarymain.init();
      // 初始公司
      ordinarymain.companytree.init();
      //初始化控件
      jQuery('#projectUid').select2({
        minimumResultsForSearch: -1,
        data: [],
      });
      ajaxFormRequest(
        WEB_CTX_PATH +
          '/codeAction.do?method=getSelectOptions&element2CodeType=' +
          encodeURI(encodeURI("{'state':'listFlowType'}")),
        function (returnData) {
          if (initSelect2(returnData)) {
          }
        },
        function (state) {},
        'ordinarymainForm',
        true,
        ' '
      );
    });
  });
</script>
