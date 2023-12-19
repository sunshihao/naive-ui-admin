<template>
  <div class="container-fluid bg-write">
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
    <div class="panel-content temp-p-12">
      <div class="col-xs-12" style="margin-top: 15px">
        <div class="panel panel-default">
          <div class="panel-body">
            <input type="hidden" value="${actionType}" id="actionType" />

            <form
              name="rmbtripForm"
              id="rmbtripForm"
              action="<%=webPath%>/tripMainAction.do?method=doSaveOrUpdate"
              method="post"
              class="window-page"
              autocomplete="off"
            >
              <input type="hidden" value="${rmbtrip.billUid}" id="billUid" name="billUid" />
              <input type="hidden" name="saveAndStart" id="saveAndStart" value="" />
              <input type="hidden" name="execessiveFlag" id="execessiveFlag" value="" />

              <div class="form-group col-xs-12">
                <label class="control-label col-xs-1">申请人</label>
                <div class="col-xs-2">
                  <input
                    class="form-control"
                    readonly
                    placeholder=""
                    value="rmbtrip.agentUid + rmbtrip.agentName"
                  />
                  <input type="hidden" value="rmbtrip.agentUid" name="agentUid" />
                  <input type="hidden" value="rmbtrip.agentName" name="agentName" />
                </div>
                <label class="control-label col-xs-1">单据日期</label>
                <div class="col-xs-2">
                  <input class="form-control" readonly placeholder="" value="rmbtrip.startTime" />
                </div>
                <label class="control-label col-xs-1">单据编号</label>
                <div class="col-xs-2">
                  <input
                    class="form-control"
                    readonly
                    placeholder=""
                    id="billState"
                    value="加载中.."
                  />
                  <input type="hidden" id="billNo" name="billNo" value="rmbtrip.billNo" />
                </div>
                <label class="control-label col-xs-1">是否高管</label>
                <div class="col-xs-2">
                  <input
                    type="checkbox"
                    id="executive"
                    name="executive"
                    style="margin: 10px 0 0 0"
                    value="rmbtrip.executive"
                  />
                </div>
              </div>
              <div class="form-group col-xs-12">
                <label class="control-label col-xs-1">收款人<font color="red">*</font></label>
                <div class="col-xs-2">
                  <div class="input-group" style="padding: 0px 0px">
                    <input
                      class="form-control"
                      readonly
                      placeholder=""
                      id="showApplication"
                      value="${rmbtrip.applicantUid} &nbsp; ${rmbtrip.applicantName}"
                    />
                    <span class="input-group-btn">
                      <button
                        class="btn btn-default"
                        type="button"
                        style="
                          color: #333;
                          background-color: #eee;
                          border: 1px solid #ccc;
                          height: 30px;
                          width: 50px;
                        "
                        onclick="rmbtrip.rmbtripEdit.chooseStaff()"
                      >
                        <i class="fa fa-search" style="color: #555"></i>
                      </button>
                    </span>
                  </div>
                  <input
                    type="hidden"
                    value="rmbtrip.applicantUid"
                    id="applicantUid"
                    name="applicantUid"
                  />
                  <input
                    type="hidden"
                    value="rmbtrip.applicantName"
                    id="applicantName"
                    name="applicantName"
                  />
                </div>
                <label class="control-label col-xs-1">开户银行<font color="red">*</font></label>
                <div class="col-xs-2">
                  <input
                    class="form-control"
                    placeholder=""
                    id="bankName"
                    name="bankName"
                    value="rmbtrip.bankName"
                    maxlength="50"
                  />
                </div>
                <label class="control-label col-xs-1">银行卡号<font color="red">*</font></label>
                <div class="col-xs-2">
                  <input
                    class="form-control"
                    placeholder=""
                    id="cardNo"
                    name="cardNo"
                    value="rmbtrip.cardNo"
                    maxlength="50"
                    onkeyup="fee.Common.numberformat(this)"
                  />
                </div>
              </div>
              <div class="form-group col-xs-12">
                <label class="control-label col-xs-1"
                  >出差申请单<font color="red" id="trip_request_sign">*</font></label
                >
                <div class="col-xs-2">
                  <div id="applicatDiv" class="input-group" style="padding: 0px 0px">
                    <input
                      class="form-control"
                      type="text"
                      id="applicantBillCd"
                      name="applicantBillCd"
                      value="rmbtrip.applicantBillCd"
                      placeholder="出差申请单"
                      maxlength="20"
                      readonly
                    />
                    <span class="input-group-btn">
                      <button
                        class="btn btn-default"
                        id="chooseApply"
                        type="button"
                        style="
                          color: #333;
                          background-color: #eee;
                          border: 1px solid #ccc;
                          height: 30px;
                          width: 50px;
                        "
                      >
                        <i class="fa fa-search" style="color: #555"></i>
                      </button>
                    </span>
                    <span class="input-group-btn">
                      <button
                        class="btn btn-default"
                        id="viewApply"
                        type="button"
                        style="
                          color: #333;
                          background-color: #eee;
                          border: 1px solid #ccc;
                          height: 30px;
                          width: 50px;
                          display: none;
                        "
                      >
                        <i class="fa fa-eye" style="color: #555"></i>
                      </button>
                    </span>
                  </div>
                </div>
                <label class="control-label col-xs-1">公司/部门<font color="red">*</font></label>
                <div class="col-xs-3">
                  <input
                    class="form-control"
                    id="companyName"
                    name="companyName"
                    onclick="rmbtrip.rmbtripEdit.companytree.showOrgTree(); return false;"
                    readonly
                    placeholder="公司"
                    value="rmbtrip.upOrgName"
                  />
                  <input type="hidden" id="upOrgId" name="upOrgId" value="${rmbtrip.upOrgId}" />
                </div>
                <div class="col-xs-2">
                  <input
                    class="form-control"
                    id="orgName"
                    name="orgName"
                    onclick="rmbtrip.rmbtripEdit.orgtree.showOrgTree(); return false;"
                    readonly
                    placeholder="部门"
                    value="${rmbtrip.deptName}"
                  />
                  <input type="hidden" id="deptUid" name="deptUid" value="${rmbtrip.deptUid}" />
                </div>
              </div>
              <div class="form-group col-xs-12">
                <label class="control-label col-xs-1">费用类型<font color="red">*</font></label>
                <div class="col-xs-2">
                  <select class="form-control" name="expenseType" id="expenseType">
                    <option value="">-请选择-</option>
                  </select>
                </div>

                <label class="control-label col-xs-1">计划可用</label>
                <div class="col-xs-2">
                  <div class="input-group" style="padding: 0px 0px">
                    <input
                      class="form-control ronly"
                      type="text"
                      id="planCheckAmount"
                      readonly="readonly"
                      name="planCheckAmount"
                      value="${rmbtrip.planCheckAmount}"
                      placeholder=""
                    />
                    <label class="input-group-addon">元</label>
                  </div>
                  <input type="hidden" name="monthlyPlan" id="monthlyPlan" value="" />
                </div>
                <label class="control-label col-xs-1">计划内外</label>
                <div class="col-xs-2">
                  <input
                    class="form-control ronly"
                    type="text"
                    id="planCheckAmountState"
                    readonly="readonly"
                    name="planCheckAmountState"
                    value="${rmbtrip.planCheckAmountState}"
                  />
                </div>
                <div class="col-xs-1">
                  <input
                    type="checkbox"
                    id="usePlanFlag"
                    name="usePlanFlag"
                    style="margin: 10px 0 0 0"
                    value="${rmbtrip.usePlanFlag}"
                  />
                </div>
              </div>
              <div class="form-group col-xs-12">
                <label class="control-label col-xs-1">支付方式<font color="red">*</font></label>
                <div class="col-xs-2">
                  <select class="form-control" name="payType" id="payType">
                    <option value="">-请选择-</option>
                  </select>
                </div>
                <label class="control-label col-xs-1">票据数量<font color="red">*</font></label>
                <div class="col-xs-2">
                  <input
                    class="form-control"
                    type="text"
                    id="receiptNumber"
                    name="receiptNumber"
                    value="${rmbtrip.receiptNumber}"
                    placeholder="票据数量"
                    maxlength="15"
                    onkeyup="this.value=this.value.replace(/[^0-9]/g,'')"
                  />
                </div>
                <label class="control-label col-xs-1">总价税合计</label>
                <div class="col-xs-2">
                  <div class="input-group" style="padding: 0px 0px">
                    <input
                      class="form-control"
                      type="text"
                      id="amount"
                      name="amount"
                      value="${rmbtrip.amount}"
                      placeholder="未录入"
                      maxlength="15"
                      readonly
                    />
                    <label class="input-group-addon">元</label>
                  </div>
                </div>
                <label class="control-label col-xs-1" id="accompany_label" style="display: none"
                  >陪同出差</label
                >
                <div class="col-xs-2">
                  <input
                    type="checkbox"
                    id="accompany"
                    name="accompany"
                    style="margin: 10px 0 0 0; display: none"
                    value="${rmbtrip.accompany}"
                  />
                </div>
              </div>
              <div class="form-group col-xs-12" style="display: none">
                <input
                  type="hidden"
                  value="${rmbtrip.haveProject}"
                  id="haveProject"
                  name="haveProject"
                />
                <div class="col-xs-3" id="project_div" style="display: none">
                  <select class="form-control" name="projectUid" id="projectUid">
                    <option value="">-请选择-</option>
                    <c:forEach
                      var="project"
                      items="${rmbtrip.comProject}"
                      begin="0"
                      step="1"
                      varStatus="status"
                    >
                      <c:choose>
                        <c:when test="${rmbtrip.projectUid==project.key}">
                          <option value="${project.key}" selected="selected"
                            >${project.value}</option
                          >
                        </c:when>
                        <c:otherwise>
                          <option value="${project.key}">${project.value}</option>
                        </c:otherwise>
                      </c:choose>
                    </c:forEach>
                  </select>
                </div>
                <label class="control-label col-xs-1">费用科目<font color="red">*</font></label>
                <div class="col-xs-2">
                  <select
                    class="form-control"
                    name="expenseAccount"
                    id="expenseAccount"
                    disabled="disabled"
                  >
                    <option value="6602">差旅费</option>
                  </select>
                </div>
                <label class="control-label col-xs-1">费用明细<font color="red">*</font></label>
                <div class="col-xs-2">
                  <select
                    class="form-control"
                    name="expenseDetail"
                    id="expenseDetail"
                    disabled="disabled"
                  >
                    <option value="660205">差旅费</option>
                  </select>
                </div>
                <label class="control-label col-xs-1">金额<font color="red">*</font></label>
                <div class="col-xs-2">
                  <div class="input-group" style="padding: 0px 0px">
                    <input
                      class="form-control"
                      type="text"
                      id="exceptTaxRateAm"
                      name="exceptTaxRateAm"
                      value="${rmbtrip.exceptTaxRateAm}"
                      placeholder="未录入"
                      maxlength="15"
                      readonly
                    />
                    <label class="input-group-addon">元</label>
                  </div>
                </div>
                <label class="control-label col-xs-1">税额<font color="red">*</font></label>
                <div class="col-xs-2">
                  <div class="input-group" style="padding: 0px 0px">
                    <input
                      class="form-control"
                      type="text"
                      id="taxRateAm"
                      name="taxRateAm"
                      value="${rmbtrip.taxRateAm}"
                      placeholder="未录入"
                      maxlength="15"
                      readonly
                    />
                    <label class="input-group-addon">元</label>
                  </div>
                </div>
              </div>
              <div class="form-group col-xs-12">
                <label class="control-label col-xs-1">业务内容<font color="red">*</font></label>
                <div class="col-xs-11">
                  <textarea
                    rows="4"
                    id="remark"
                    placeholder="出差理由"
                    name="remark"
                    class="form-control"
                    maxlength="200"
                  >
										${rmbtrip.remark}
									</textarea
                  >
                  <label class="control-label" style="color: red; margin-top: 5px"
                    >该文本框的内容将被审批中心作为审批事项说明的内容，请谨慎填写</label
                  >
                  <label class="control-label" style="color: #b9b9b9; margin-top: 5px; float: right"
                    >出差理由描述不超过200字</label
                  >
                </div>
              </div>

              <!-- Tab页开始 -->
              <ul class="nav nav-tabs">
                <li class="active">
                  <a
                    href="#resume-dataList1"
                    data-toggle="tab"
                    aria-controls="profile"
                    id="citytraffic_a"
                    >城市间交通费</a
                  >
                </li>
                <li>
                  <a
                    href="#resume-dataList2"
                    data-toggle="tab"
                    aria-controls="profile"
                    id="cityinside_a"
                    >市内交通费</a
                  >
                </li>
                <li>
                  <a href="#resume-dataList3" data-toggle="tab" aria-controls="profile" id="hotel_a"
                    >住宿费</a
                  >
                </li>
                <li>
                  <a
                    href="#resume-dataList4"
                    data-toggle="tab"
                    aria-controls="profile"
                    id="subsidy_a"
                    >补助</a
                  >
                </li>
                <li style="display: none">
                  <a href="#resume-dataList5" data-toggle="tab" aria-controls="profile" id="other_a"
                    >其它</a
                  >
                </li>
              </ul>
              <div class="tab-content" id="manage-detail-grid-tabs" style="padding-top: 10px">
                <div id="resume-dataList1" class="tab-pane fade in active">
                  <div class="row">
                    <div class="col-xs-12 ilead-table">
                      <table id="citytraffic"></table>
                      <div id="listPager1"></div>
                    </div>
                  </div>
                </div>
                <div id="resume-dataList2" class="tab-pane fade">
                  <div class="row">
                    <div class="col-xs-12 ilead-table">
                      <table id="cityinside"></table>
                      <div id="listPager2"></div>
                    </div>
                  </div>
                </div>
                <div id="resume-dataList3" class="tab-pane fade">
                  <div class="row">
                    <div class="col-xs-12 ilead-table">
                      <table id="hotel"></table>
                      <div id="listPager3"></div>
                    </div>
                  </div>
                </div>
                <div id="resume-dataList4" class="tab-pane fade">
                  <div class="row">
                    <div class="col-xs-12 ilead-table">
                      <table id="subsidy"></table>
                      <div id="listPager4"></div>
                    </div>
                  </div>
                </div>
                <div id="resume-dataList5" class="tab-pane fade">
                  <div class="row">
                    <div class="col-xs-12 ilead-table">
                      <table id="other"></table>
                      <div id="listPager5"></div>
                    </div>
                  </div>
                </div>
              </div>
              <!-- Tab页结束 -->

              <!-- 上传附件的ID-->
              <input
                type="hidden"
                value="${rmbtrip.attachmentId}"
                id="attachmentId"
                name="attachmentId"
              />
            </form>

            <!-- 上传附件-->
            <div class="page-line"></div>
            <div class="form-group form-group-sm col-xs-12">
              <div class="form-group form-group-sm col-xs-2-2">
                <label class="col-xs-9">附件<font color="red" /></label>
              </div>
              <div class="container-fluid">
                <div class="col-xs-9-8 m-t-20">
                  <div id="fileUploadDiv"></div>
                </div>
              </div>
            </div>

            <div class="window-footer" style="margin-top: 50px">
              <button type="button" id="saveButton" class="btn btn-default">保存</button>
              <button type="button" id="saveStartButton" class="btn btn-default">保存并启动</button>
              <button type="button" id="closeButton" class="btn btn-hollow">关闭</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { onMounted, onBeforeMount, reactive } from 'vue';
  import { getDetail } from './api';
  import './rmbtripEdit.js';
  import '../common/feeCommon';

  // // form表单数据
  // const rmbtrip = reactive({
  //   agentUid: undefined,
  //   agentName: undefined,
  //   startTime: undefined, // 单据日期
  //   billNo: undefined, // 单据编号
  //   executive: undefined, // 是否高管
  //   applicantName: undefined, // 收款人
  //   bankName: undefined, // 开户银行
  //   cardNo: undefined, // 银行卡号
  //   applicantBillCd: undefined, // 出差申请
  //   upOrgName: undefined, // 公司部门
  //   deptName: undefined,
  //   expenseType: undefined, // 费用类型
  //   planCheckAmount: undefined, // 计划可用
  //   planCheckAmountState: undefined, // 计划内外
  //   payType: undefined, // 支付方式
  //   receiptNumber: undefined, // 票据数量
  //   amount: undefined, // 总价税合计
  //   remark: undefined, // 业务内容
  // });

  const initPage = () => {
    return getDetail({
      actionType: 'detail',
      paramId: '24508c0c950e44d8b446527f5d5afaf3',
    });
  };

  // onBeforeMount(async () => {
  //   const res = await initPage(); // 初始化

  //   console.log('resresres', res);

  //   Window.rmbtrip = {
  //     ...Window.rmbtrip,
  //     ...res.rmbtrip,
  //   };

  //   console.log('Window.rmbtrip - new', Window.rmbtrip);
  // });

  onMounted(async () => {
    const res = await getDetail({
      actionType: 'detail',
      paramId: '24508c0c950e44d8b446527f5d5afaf3',
    }); // 初始化

    console.log('resresres', res);

    Window.rmbtrip = {
      ...Window.rmbtrip,
      ...res.rmbtrip,
    };

    console.log('Window.rmbtrip - new', Window.rmbtrip);

    /*
     * 初始化
     */
    await jQuery(document).ready(function () {
      console.log('Window.rmbtrip - new - 22222', Window.rmbtrip);

      // 临时
      $('#amount').val(fee.Common.formatAmount($('#amount').val()));
      $('#exceptTaxRateAm').val(fee.Common.formatAmount($('#exceptTaxRateAm').val()));
      $('#taxRateAm').val(fee.Common.formatAmount($('#taxRateAm').val()));
      $('#planCheckAmount').val(fee.Common.formatAmount($('#planCheckAmount').val()));

      // 清空业务内容回车换行
      jQuery('#remark').val(
        jQuery('#remark')
          .val()
          .replace(/[\r\n\t]/g, '')
      );
      // 公司部门树
      rmbtrip.rmbtripEdit.companytree.init();
      if ($('#actionType').val() == 'edit') {
        rmbtrip.rmbtripEdit.orgtree.init();
      }
      // 表单初始化
      rmbtrip.rmbtripEdit.init();
      // 城市间交通费Tab1
      rmbtrip.rmbtripEdit.citytraffic.init();
      // 城内交通费Tab2
      rmbtrip.rmbtripEdit.cityinside.init();
      // 住宿费Tab3
      rmbtrip.rmbtripEdit.hotel.init();
      // 出差补助Tab4
      rmbtrip.rmbtripEdit.subsidy.init();
      // 其它Tab45
      rmbtrip.rmbtripEdit.other.init();
      // 初始化日期控件
      $.initDataPlugin();
      // 统计单据数量
      //sumBillCount();

      $('.tabs').keyup(function (e) {
        // 增加金额单据统计
        sumBillCount();
      });


    });
  });
</script>
