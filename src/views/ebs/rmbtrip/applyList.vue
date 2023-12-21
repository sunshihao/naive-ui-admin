<template>
  <div class="container-fluid p-lr-10">
    <div class="row">
      <div class="col-xs-14">
        <div class="row panel panel-default ilead-search">
          <form id="notifForm" name="notifForm" class="form-inline" method="post">
            <input type="hidden" id="applicantUid" name="applicantUid" :value="applicantUid" />
            <input type="hidden" id="projectId" name="projectId" :value="projectUid" />
            <div class="panel-body" style="margin-bottom: 10px">
              <label class="control-label col-xs-1">单号：</label>
              <div class="col-xs-3">
                <input
                  type="text"
                  maxlength="20"
                  class="form-control"
                  id="planNo"
                  name="planNo"
                  placeholder="单据号"
                />
              </div>
              <label class="control-label col-xs-2">单据日期：</label>
              <div class="col-xs-3">
                <input
                  type="text"
                  class="laydate-icon-default ilead-laydate-icon-default form-control"
                  id="startDate"
                  name="startDate"
                  placeholder="起始"
                  onclick="laydate({istime: true, format: 'YYYY-MM-DD'})"
                />
              </div>
              <div class="col-xs-3">
                <input
                  type="text"
                  class="laydate-icon-default ilead-laydate-icon-default form-control"
                  id="endDate"
                  name="endDate"
                  placeholder="结束"
                  onclick="laydate({istime: true, format: 'YYYY-MM-DD'})"
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
  import { onMounted, reactive, ref } from 'vue';
  import { useRoute } from 'vue-router';
  import './applyList.js';

  let route = useRoute();
  const applicantUid = ref(route.applicantUid);
  const projectUid = ref(route.projectUid);

  onMounted(() => {
    /*
     * 初始化
     */
    jQuery(document).ready(function () {
      rmbtrip.applyList.init();
    });
  });
</script>
