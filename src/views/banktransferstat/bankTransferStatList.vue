<template>
  <div class="container-fluid p-lr-10">
    <div class="row">
      <div class="col-xs-12">
        <div class=" ilead-search">
          <form id="bankTransferStatForm" name="bankTransferStatForm" class="" method="post">

            <div class="panel-body">
              <div class="form-group col-xs-3">
                <label class="control-label col-xs-4">转出公司：</label>
                <div class="col-xs-8">
                  <input type="text" class="form-control" id="companyName" name="companyName" readonly placeholder="公司名称"
                    onclick="banktransferstat.bankTransferStatList.companytree.showOrgTree(); return false;"
                    onchange="changeRole()">
                  <input type="hidden" id="outUpOrgId" name="outUpOrgId" />
                </div>
              </div>
              <div class="form-group col-xs-3">
                <label class="control-label col-xs-4">转入公司：</label>
                <div class="col-xs-8">
                  <input type="text" class="form-control" id="companyName2" name="companyName2" readonly
                    placeholder="公司名称"
                    onclick="banktransferstat.bankTransferStatList.orgTree.showOrgTree(); return false;"
                    onchange="changeRole()">
                  <input type="hidden" id="inUpOrgId" name="inUpOrgId" />
                </div>
              </div>
              <div class="form-group col-xs-3">
                <label class="control-label col-xs-4">单据号：</label>
                <div class="col-xs-8">
                  <input type="text" class="form-control" id="billNo" name="billNo" placeholder="单据号" maxlength="20">
                </div>
              </div>
              <div class="form-group col-xs-3">
                <label class="control-label col-xs-4">状态：</label>
                <div class="col-xs-8">
                  <select type="text" class="form-control" id="state" name="state">
                    <option value=""></option>
                  </select>
                </div>
              </div>
            </div>

            <div class="panel-body">
              <div class="form-group col-xs-3">
                <label class="control-label col-xs-4">单据日期：</label>
                <div class="col-xs-8">
                  <input type="text" class="laydate-icon-default ilead-laydate-icon-default form-control" id="startTime"
                    name="startTime" placeholder="起始" onclick="laydate({istime: true, format: 'YYYY-MM-DD'})">
                </div>
              </div>
              <div class="form-group col-xs-3">
                <div class="col-xs-8">
                  <input type="text" class="laydate-icon-default ilead-laydate-icon-default form-control" id="endTime"
                    name="endTime" placeholder="结束" onclick="laydate({istime: true, format: 'YYYY-MM-DD'})">
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
              <ul id="orgTree" class="ztree"
                style="width: 280px; height: auto; margin-top: 1px; border: 1px solid #617775; background: #f0f6e4; overflow-y: scroll; overflow-x: auto;">
              </ul>
            </div>
            <div id="companyContent" style="display: none; position: absolute; z-index: 999">
              <ul id="companyTree" class="ztree"
                style="width: 280px; height: auto; margin-top: 1px; border: 1px solid #617775; background: #f0f6e4; overflow-y: scroll; overflow-x: auto;">
              </ul>
            </div>

          </form>
        </div>
      </div>
    </div>

    <div class="row">
      <div class="col-xs-12 ilead-table">
        <div class="table-tool">
          <button type="button" class="btn " data-toggle="tooltip" data-placement="top" title="详细"
            onclick="banktransferstat.bankTransferStatList.queryDetail()" id='detailBtn'>
            <span class="icon iconfont icon-liulan"></span>详细
          </button>
          <button type="button" class="btn" data-toggle="tooltip" data-placement="top" title="打印"
            onclick="banktransferstat.bankTransferStatList.doPrint()" id='printBtn'>
            <span class="icon iconfont icon-bangongyongpin"></span>打印
          </button>
        </div>
        <table id="dataList" style="width:100%"></table>
        <div id="listPager"></div>
      </div>
    </div>
  </div>
</template>
  
<script setup>

import { onMounted } from 'vue'
import { banktransferstat } from "./bankTransferStatList.js"

onMounted(() => {
  jQuery(document).ready(function () {
    banktransferstat.init();

    banktransferstat.companytree.init();
    banktransferstat.orgTree.init();

    //	调用下拉列表  state 'upOrgId'为select组件id、'flowType'
    ajaxFormRequest(
      WEB_CTX_PATH
      + "/codeAction.do?method=getSelectOptions&element2CodeType="
      + encodeURI(encodeURI("{'state':'flowType'}")),
      function (returnData) {
        if (initSelect2(returnData)) {
          // 操作类型
          var actionType = jQuery("#actionType").val();
          if (actionType == "edit" || actionType == "datail") {
            $("#state").val(state).select2();
          }
        }
      }, function (state) {
        
      }, "bankTransferStatForm", true, " ");
  });

})

</script>
  