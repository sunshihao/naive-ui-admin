<template>
  <div class="container-fluid p-lr-10">
    <div class="ilead-search">
      <input type="hidden" id="rollback" name="rollback" />
      <form id="templateForm" name="templateForm" method="post">
        <div class="panel-heading">
          <div class="form-group col-xs-3">
            <label class="control-label col-xs-4">所属公司</label>
            <div class="col-xs-8">
              <select
                class="form-control bs-select"
                id="subordinateCompanies"
                name="subordinateCompanies"
              ></select>
            </div>
          </div>

          <div class="form-group col-xs-3">
            <label class="col-xs-4 control-label">模板编号</label>
            <div class="col-xs-8">
              <input
                type="text"
                class="form-control"
                id="code"
                name="code"
                placeholder="模板编号"
              />
            </div>
          </div>

          <div class="form-group col-xs-3">
            <label class="col-xs-4 control-label">模板名称</label>
            <div class="col-xs-8">
              <input
                type="text"
                class="form-control"
                id="name"
                name="name"
                placeholder="模板名称"
              />
            </div>
          </div>
          <div class="form-group col-xs-3">
            <label for="type" class="col-xs-4 control-label">模板分类</label>
            <div class="col-xs-8">
              <select class="form-control" id="type" name="type">
                <option value="" selected="selected">请选择</option>
                <c:forEach var="obj" items="${typeMap}">
                  <option value="${obj.code}">${obj.name}</option>
                </c:forEach>
              </select>
            </div>
          </div>
        </div>

        <a role="button" data-toggle="collapse" href="#collapseOne" class="bmp-search-show">
          高级查询<i class="iconfont icon-xiala"></i
        ></a>
        <div id="collapseOne" class="panel-collapse collapse panel-body" aria-expanded="true">
          <div class="form-group col-xs-3">
            <label for="status" class="col-xs-4 control-label">模板状态</label>
            <div class="col-xs-8">
              <select class="form-control" id="status" name="status">
                <option value="" selected="selected">请选择</option>
                <option value="0">禁用</option>
                <option value="1">启用</option>
              </select>
            </div>
          </div>
        </div>
        <div class="panel-btn">
          <button type="reset" class="btn btn-hollow" id="resetBtn">
            <span class="glyphicon glyphicon-refresh"></span>
            重置
          </button>

          <button type="button" class="btn btn-default" id="queryBtn">
            <span class="glyphicon glyphicon-search"></span>
            查询
          </button>
        </div>
      </form>
    </div>
    <!-- 功能按钮部分、数据列表部分  -->
    <div id="grid-list" class="row">
      <div class="col-xs-12">
        <div class="table-tool">
          <dhc:PrivilegeTag url="/templateAction.do?method=doDown" type="custom">
            <button type="button" class="btn btn-default" id="downBtn">
              <span class="glyphicon glyphicon-download-alt"></span> 下载
            </button>
          </dhc:PrivilegeTag>

          <dhc:PrivilegeTag url="/templateAction.do?method=doEdit&actionType=add" type="custom">
            <button type="button" class="btn btn-default" id="addBtn">
              <span class="glyphicon glyphicon-plus"></span> 新建
            </button>
          </dhc:PrivilegeTag>
          <dhc:PrivilegeTag url="/templateAction.do?method=doEdit&actionType=edit" type="custom">
            <button type="button" class="btn btn-default" id="editBtn">
              <span class="glyphicon glyphicon-pencil"></span> 编辑
            </button>
          </dhc:PrivilegeTag>
          <dhc:PrivilegeTag url="/templateAction.do?method=doStart" type="custom">
            <button type="button" class="btn btn-default" id="startBtn">
              <span class="glyphicon glyphicon-ok"></span> 启用
            </button>
          </dhc:PrivilegeTag>
          <dhc:PrivilegeTag url="/templateAction.do?method=doEnd" type="custom">
            <button type="button" class="btn btn-default" id="endBtn">
              <span class="glyphicon glyphicon-minus"></span> 禁用
            </button>
          </dhc:PrivilegeTag>
        </div>
        <table id="dataList"></table>
        <div id="listPager"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { onMounted } from 'vue';
  import './templateList.js';
  import '../../common/select/commonSelect.js';

  onMounted(() => {
    jQuery(document).ready(function () {
      TemplateList.init();
    });
  });
</script>
