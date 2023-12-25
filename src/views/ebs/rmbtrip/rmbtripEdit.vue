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
            <input type="hidden" :value="actionType" id="actionType" />

            <form
              name="rmbtripForm"
              id="rmbtripForm"
              action="<%=webPath%>/tripMainAction.do?method=doSaveOrUpdate"
              method="post"
              class="window-page"
              autocomplete="off"
            >
              <input type="hidden" value="rmbtrip.billUid" id="billUid" name="billUid" />
              <input type="hidden" name="saveAndStart" id="saveAndStart" value="" />
              <input type="hidden" name="execessiveFlag" id="execessiveFlag" value="" />

              <div class="form-group col-xs-12">
                <label class="control-label col-xs-1">申请人</label>
                <div class="col-xs-2">
                  <input
                    class="form-control"
                    readonly
                    placeholder=""
                    :value="`${rmbtripPage.agentUid} ${rmbtripPage.agentName}`"
                  />
                  <input type="hidden" value="rmbtrip.agentUid" name="agentUid" />
                  <input type="hidden" value="rmbtrip.agentName" name="agentName" />
                </div>
                <label class="control-label col-xs-1">单据日期</label>
                <div class="col-xs-2">
                  <input
                    class="form-control"
                    readonly
                    placeholder=""
                    :value="rmbtripPage.startTime"
                  />
                </div>
                <label class="control-label col-xs-1">单据编号</label>
                <div class="col-xs-2">
                  <input
                    class="form-control"
                    id="billNo"
                    readonly
                    name="billNo"
                    :value="rmbtripPage.billNo"
                  />
                </div>
                <label class="control-label col-xs-1">是否高管</label>
                <div class="col-xs-2">
                  <input
                    type="checkbox"
                    id="executive"
                    name="executive"
                    style="margin: 10px 0 0 0"
                    :value="rmbtripPage.executive"
                  />
                </div>
              </div>
              <div class="form-group col-xs-12">
                <label class="control-label col-xs-1">收款人<span color="red">*</span></label>
                <div class="col-xs-2">
                  <div class="input-group" style="padding: 0px 0px">
                    <input
                      class="form-control"
                      readonly
                      placeholder=""
                      id="showApplication"
                      :value="`${rmbtripPage.applicantUid} ${rmbtripPage.applicantName}`"
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
                    :value="rmbtripPage.applicantUid"
                    id="applicantUid"
                    name="applicantUid"
                  />
                  <input
                    type="hidden"
                    :value="rmbtripPage.applicantName"
                    id="applicantName"
                    name="applicantName"
                  />
                </div>
                <label class="control-label col-xs-1">开户银行<span color="red">*</span></label>
                <div class="col-xs-2">
                  <input
                    class="form-control"
                    placeholder=""
                    id="bankName"
                    name="bankName"
                    :value="rmbtripPage.bankName"
                    maxlength="50"
                  />
                </div>
                <label class="control-label col-xs-1">银行卡号<span color="red">*</span></label>
                <div class="col-xs-2">
                  <input
                    class="form-control"
                    placeholder=""
                    id="cardNo"
                    name="cardNo"
                    :value="rmbtripPage.cardNo"
                    maxlength="50"
                    onkeyup="fee.Common.numberformat(this)"
                  />
                </div>
              </div>
              <div class="form-group col-xs-12">
                <label class="control-label col-xs-1"
                  >出差申请单<span color="red" id="trip_request_sign">*</span></label
                >
                <div class="col-xs-2">
                  <div id="applicatDiv" class="input-group" style="padding: 0px 0px">
                    <input
                      class="form-control"
                      type="text"
                      id="applicantBillCd"
                      name="applicantBillCd"
                      :value="rmbtripPage.applicantBillCd"
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
                        1<i class="fa fa-search" style="color: #555"></i>
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
                <label class="control-label col-xs-1">公司/部门<span color="red">*</span></label>
                <div class="col-xs-3">
                  <input
                    class="form-control"
                    id="companyName"
                    name="companyName"
                    onclick="rmbtrip.rmbtripEdit.companytree.showOrgTree(); return false;"
                    readonly
                    placeholder="公司"
                    :value="rmbtripPage.upOrgName"
                  />
                  <input type="hidden" id="upOrgId" name="upOrgId" :value="rmbtripPage.upOrgId" />
                </div>
                <div class="col-xs-2">
                  <input
                    class="form-control"
                    id="orgName"
                    name="orgName"
                    onclick="rmbtrip.rmbtripEdit.orgtree.showOrgTree(); return false;"
                    readonly
                    placeholder="部门"
                    :value="`${rmbtripPage.deptName}`"
                  />
                  <input
                    type="hidden"
                    id="deptUid"
                    name="deptUid"
                    :value="`${rmbtripPage.deptUid}`"
                  />
                </div>
              </div>
              <div class="form-group col-xs-12">
                <label class="control-label col-xs-1">费用类型<span color="red">*</span></label>
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
                      :value="`${rmbtripPage.planCheckAmount}`"
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
                    :value="`${rmbtripPage.planCheckAmountState}`"
                  />
                </div>
                <div class="col-xs-1">
                  <input
                    type="checkbox"
                    id="usePlanFlag"
                    name="usePlanFlag"
                    style="margin: 10px 0 0 0"
                    :value="`${rmbtripPage.usePlanFlag}`"
                  />
                </div>
              </div>
              <div class="form-group col-xs-12">
                <label class="control-label col-xs-1">支付方式<span color="red">*</span></label>
                <div class="col-xs-2">
                  <select class="form-control" name="payType" id="payType">
                    <option value="">-请选择-</option>
                  </select>
                </div>
                <label class="control-label col-xs-1">票据数量<span color="red">*</span></label>
                <div class="col-xs-2">
                  <input
                    class="form-control"
                    type="text"
                    id="receiptNumber"
                    name="receiptNumber"
                    :value="`${rmbtripPage.receiptNumber}`"
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
                      :value="`${rmbtripPage.amount}`"
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
                    :value="`${rmbtripPage.accompany}`"
                  />
                </div>
              </div>
              <div class="form-group col-xs-12" style="display: none">
                <input
                  type="hidden"
                  :value="`${rmbtripPage.haveProject}`"
                  id="haveProject"
                  name="haveProject"
                />
                <div class="col-xs-3" id="project_div" style="display: none">
                  <select class="form-control" name="projectUid" id="projectUid">
                    <option value="">-请选择-</option>
                    <!-- <c:forEach
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
                    </c:forEach> -->
                    <!-- for start -->
                    <div v-for="(project, index) of rmbtripPage.comProject" :key="index">
                      <option
                        v-if="rmbtripPage.projectUid == project.key"
                        :value="project.key"
                        selected="selected"
                        >{{ project.value }}</option
                      >
                      <option v-else :value="project.key">{{ project.value }}</option>
                    </div>
                    <!-- for end -->
                  </select>
                </div>
                <label class="control-label col-xs-1">费用科目<span color="red">*</span></label>
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
                <label class="control-label col-xs-1">费用明细<span color="red">*</span></label>
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
                <label class="control-label col-xs-1">金额<span color="red">*</span></label>
                <div class="col-xs-2">
                  <div class="input-group" style="padding: 0px 0px">
                    <input
                      class="form-control"
                      type="text"
                      id="exceptTaxRateAm"
                      name="exceptTaxRateAm"
                      :value="`${rmbtripPage.exceptTaxRateAm}`"
                      placeholder="未录入"
                      maxlength="15"
                      readonly
                    />
                    <label class="input-group-addon">元</label>
                  </div>
                </div>
                <label class="control-label col-xs-1">税额<span color="red">*</span></label>
                <div class="col-xs-2">
                  <div class="input-group" style="padding: 0px 0px">
                    <input
                      class="form-control"
                      type="text"
                      id="taxRateAm"
                      name="taxRateAm"
                      :value="`${rmbtripPage.taxRateAm}`"
                      placeholder="未录入"
                      maxlength="15"
                      readonly
                    />
                    <label class="input-group-addon">元</label>
                  </div>
                </div>
              </div>
              <div class="form-group col-xs-12">
                <label class="control-label col-xs-1">业务内容<span color="red">*</span></label>
                <div class="col-xs-11">
                  <textarea
                    rows="4"
                    id="remark"
                    placeholder="出差理由"
                    name="remark"
                    class="form-control"
                    maxlength="200"
                    :value="rmbtripPage.remark"
                  >
                  </textarea>
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
                <label class="col-xs-9">附件</label>
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
  import { onMounted, reactive, ref } from 'vue';
  import '../common/feeCommon';
  import { getDetail } from './api';
  import './rmbtripEdit.js';

  // form表单数据
  let rmbtripPage = ref({});

  let actionType = ref('detail');

  onMounted(async () => {
    const res = await getDetail({
      actionType: 'detail',
      paramId: '24508c0c950e44d8b446527f5d5afaf3',
    }); // 初始化
    rmbtripPage.value = res.rmbtrip;
    actionType.value = res.actionType;
    /*
     * 初始化
     */
    await jQuery(document).ready(function () {
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
      let citytrafficData = res.citytraffic.map((detail, index) => {
        return {
          ...detail,
          tab1_startTime: detail.startTimeString,
          tab1_endTime: detail.endTimeString,
          tab1_startAddressName: { name: detail.startAddressName, code: detail.startAddressId },
          tab1_endAddressName: { name: detail.endAddressName, code: detail.endAddressId },
          tab1_vehicle: detail.vehicle,
          tab1_amount: detail.amount2,
        };
      });
      rmbtrip.citytraffic.init(citytrafficData); // 初始化

      // 城内交通费Tab2
      let cityinsideData = res.cityinside.map((detail, index) => {
        return {
          ...detail,
          tab2_startTime: detail.startTimeString,
          tab2_endTime: detail.endTimeString,
          tab2_startAddressName: { name: detail.startAddressName, code: detail.startAddressId },
          tab2_endAddressName: { name: detail.endAddressName, code: detail.endAddressId },
          tab2_vehicle: detail.vehicle,
          tab2_amount: detail.amount2,
        };
      });
      rmbtrip.cityinside.init(cityinsideData);

      // 住宿费Tab3
      let hotelData = res.hotel.map((detail, index) => {
        return {
          ...detail,
          tab3_startTime: detail.startTimeString,
          tab3_endTime: detail.endTimeString,
          tab3_traveType: detail.traveType,
          tab3_city: detail.city,
          tab3_personCount: detail.personCount,
          tab3_dayNumber: detail.dayNumber,
          tab3_amount: detail.amount2,
          tab3_actualDayNumber: detail.actualDayNumber,
          tab3_standardValue: detail.standardValue,
          tab3_exceptTaxRateAm: detail.exceptTaxRateAm,
          tab3_taxRate: detail.taxRate,
          tab3_taxRateAm: detail.taxRateAm,
        };
      });
      rmbtrip.hotel.init(hotelData);

      // 出差补助Tab4
      let subsidyData = res.subsidy.map((detail, index) => {
        return {
          ...detail,
          tab4_startTime: detail.startTimeString,
          tab4_endTime: detail.endTimeString,
          tab4_city: detail.city,
          tab4_dayNumber: detail.dayNumber,
          tab4_amount: detail.amount2,
          tab4_standardValue: detail.standardValue,
          tab4_subsidyType: detail.subsidyType,
        };
      });
      rmbtrip.subsidy.init(subsidyData);

      // 其它Tab45
      let otherData = res.other.map((detail, index) => {
        return {
          ...detail,
          tab5_amount: detail.amount2,
          tab5_content: detail.content,
        };
      });
      rmbtrip.other.init(res.other);

      // 初始化日期控件
      $.initDataPlugin();

      $('.tabs').keyup(function (e) {
        // 增加金额单据统计
        sumBillCount();
      });
    });
  });
</script>
