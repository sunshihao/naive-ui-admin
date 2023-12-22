<template>
  <div class="container-fluid bg-write">
    <div class="panel-content temp-p-10">
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
            >
              <input type="hidden" :value="rmbtripPage.billUid" id="billUid" name="billUid" />
              <input
                type="hidden"
                :value="rmbtripPage.applicantUid"
                id="applicantUid"
                name="applicantUid"
              />

              <div class="form-group col-xs-12">
                <label class="control-label col-xs-1">申请人</label>
                <div class="col-xs-2">
                  <input
                    class="form-control"
                    readonly
                    placeholder=""
                    :value="
                      rmbtripPage.agentUid ? `${rmbtripPage.agentUid} ${rmbtripPage.agentName}` : ''
                    "
                  />
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
                  <input class="form-control" readonly placeholder="" :value="rmbtripPage.billNo" />
                </div>
                <label class="control-label col-xs-1">是否高管</label>
                <div class="col-xs-2">
                  <input
                    type="checkbox"
                    id="executive"
                    name="executive"
                    disabled="disabled"
                    style="margin: 10px 0 0 0"
                    :value="rmbtripPage.executive"
                  />
                </div>
              </div>
              <div class="form-group col-xs-12">
                <label class="control-label col-xs-1">收款人</label>
                <div class="col-xs-2">
                  <input
                    class="form-control"
                    readonly
                    placeholder=""
                    :value="
                      rmbtripPage.applicantUid
                        ? `${rmbtripPage.applicantUid} ${rmbtripPage.applicantName}`
                        : ''
                    "
                  />
                </div>
                <label class="control-label col-xs-1">开户银行</label>
                <div class="col-xs-2">
                  <input
                    class="form-control"
                    readonly
                    placeholder=""
                    id="bankName"
                    name="bankName"
                    :value="rmbtripPage.bankName"
                    maxlength="50"
                  />
                </div>
                <label class="control-label col-xs-1">银行卡号</label>
                <div class="col-xs-2">
                  <input
                    class="form-control"
                    readonly
                    placeholder=""
                    id="cardNo"
                    name="cardNo"
                    :value="rmbtripPage.cardNo"
                    maxlength="50"
                  />
                </div>
              </div>
              <div class="form-group col-xs-12">
                <label class="control-label col-xs-1">出差申请单</label>
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
                <label class="control-label col-xs-1">公司/部门</label>
                <div class="col-xs-3">
                  <input
                    class="form-control"
                    id="companyName"
                    name="companyName"
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
                    readonly
                    placeholder=""
                    :value="rmbtripPage.deptName"
                  />
                  <input type="hidden" id="deptUid" name="deptUid" :value="rmbtripPage.deptUid" />
                </div>
              </div>
              <div class="form-group col-xs-12">
                <label class="control-label col-xs-1"
                  >费用类型<span style="color: red">*</span></label
                >
                <div class="col-xs-2">
                  <select
                    class="form-control"
                    name="expenseType"
                    id="expenseType"
                    disabled="disabled"
                  >
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
                      :value="rmbtripPage.planCheckAmount"
                      placeholder=""
                    />
                    <label class="input-group-addon">元</label>
                    <input type="hidden" name="monthlyPlan" id="monthlyPlan" value="" />
                  </div>
                </div>
                <label class="control-label col-xs-1">计划内外</label>
                <div class="col-xs-2">
                  <input
                    class="form-control ronly"
                    type="text"
                    id="planCheckAmountState"
                    readonly="readonly"
                    name="planCheckAmountState"
                    :value="rmbtripPage.planCheckAmountState"
                  />
                </div>
                <div class="col-xs-1">
                  <input
                    type="checkbox"
                    id="usePlanFlag"
                    name="usePlanFlag"
                    style="margin: 10px 0 0 0"
                    :value="rmbtripPage.usePlanFlag"
                  />
                </div>
              </div>
              <div class="form-group col-xs-12">
                <label class="control-label col-xs-1">支付方式</label>
                <div class="col-xs-2">
                  <select class="form-control" name="payType" id="payType" disabled="disabled">
                  </select>
                </div>
                <label class="control-label col-xs-1">票据数量</label>
                <div class="col-xs-2">
                  <input
                    class="form-control"
                    type="text"
                    id="receiptNumber"
                    readonly
                    name="receiptNumber"
                    :value="rmbtripPage.receiptNumber"
                    placeholder="票据数量"
                    maxlength="15"
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
                      :value="rmbtripPage.amount"
                      placeholder="未录入"
                      maxlength="15"
                      readonly
                      onfocus="this.value=fee.Common.clearFormatAmount(this.value)"
                      onkeyup="fee.Common.numberformat(this)"
                      onblur="this.value=fee.Common.formatAmount(this.value)"
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
                    disabled="disabled"
                    name="accompany"
                    style="display: none; margin: 10px 0 0 0"
                    :value="rmbtripPage.accompany"
                  />
                </div>
              </div>

              <div class="row" style="display: none">
                <label class="control-label col-xs-1">项目名称</label>
                <div class="col-xs-2">
                  <input
                    class="form-control"
                    readonly
                    placeholder=""
                    :value="rmbtripPage.projectName"
                  />
                </div>
                <label class="control-label col-xs-1">金额</label>
                <div class="col-xs-2">
                  <div class="input-group" style="padding: 0px 0px">
                    <input
                      class="form-control"
                      type="text"
                      id="exceptTaxRateAm"
                      name="exceptTaxRateAm"
                      :value="rmbtripPage.exceptTaxRateAm"
                      placeholder="未录入"
                      maxlength="15"
                      readonly
                    />
                    <label class="input-group-addon">元</label>
                  </div>
                </div>
                <div class="col-xs-2">
                  <div class="input-group" style="padding: 0px 0px">
                    <input
                      class="form-control"
                      type="text"
                      id="taxRateAm"
                      name="taxRateAm"
                      :value="rmbtripPage.taxRateAm"
                      placeholder="未录入"
                      maxlength="15"
                      readonly
                    />
                    <label class="input-group-addon">元</label>
                  </div>
                </div>
              </div>

              <div class="form-group col-xs-12">
                <label class="control-label col-xs-1">业务内容</label>
                <div class="col-xs-11">
                  <textarea
                    rows="4"
                    id="remark"
                    placeholder="出差理由"
                    :value="rmbtripPage.remark"
                    name="remark"
                    class="form-control"
                    maxlength="200"
                    readonly
                  >
                  </textarea>
                </div>
              </div>

              <!-- Tab页开始 -->
              <ul class="nav nav-tabs">
                <li v-if="pageData?.citytraffic && pageData.citytraffic.length > 0" class="active"
                  ><a
                    href="#resume-dataList1"
                    id="citytraffic_a"
                    data-toggle="tab"
                    aria-controls="profile"
                    >城市间交通费</a
                  ></li
                >
                <li v-if="pageData?.cityinside && pageData.cityinside.length > 0"
                  ><a
                    href="#resume-dataList2"
                    data-toggle="tab"
                    id="cityinside_a"
                    aria-controls="profile"
                    >市内交通费</a
                  ></li
                >
                <li v-if="pageData?.hotel && pageData.hotel.length > 0"
                  ><a
                    href="#resume-dataList3"
                    data-toggle="tab"
                    id="hotel_a"
                    aria-controls="profile"
                    >住宿费</a
                  ></li
                >
                <li v-if="pageData?.subsidy && pageData.subsidy.length > 0"
                  ><a
                    href="#resume-dataList4"
                    data-toggle="tab"
                    id="subsidy_a"
                    aria-controls="profile"
                    >补助</a
                  ></li
                >
                <!-- <li v-if="pageData?.other && pageData.other.length > 0" style="display: none"
                  ><a
                    href="#resume-dataList5"
                    data-toggle="tab"
                    id="other_a"
                    aria-controls="profile"
                    >其它</a
                  ></li
                > -->
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
                :value="rmbtripPage.attachmentId"
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

            <div class="window-footer">
              <button type="button" id="saveButton" class="btn btn-default" style="display: none"
                >保存</button
              >
              <button type="button" id="closeButton" class="btn btn-hollow">关闭</button>
            </div>
            <div id="treeContent" style="display: none; position: absolute">
              <ul
                id="orgTree"
                class="ztree"
                style="
                  width: 340px;
                  margin-top: 1px;
                  border: 1px solid #617775;
                  background: #f0f6e4;
                  overflow-y: scroll;
                  overflow-x: auto;
                "
              ></ul>
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
  import './rmbtripDetail.js';

  // form表单数据
  let rmbtripPage = ref({});

  let pageData = ref({});

  let actionType = ref('detail');

  onMounted(async () => {
    const res = await getDetail({
      actionType: 'detail',
      paramId: '24508c0c950e44d8b446527f5d5afaf3',
    }); // 初始化

    console.log('res------------', res);

    rmbtripPage.value = res.rmbtrip;
    actionType.value = res.actionType;
    pageData.value = res;

    /*
     * 初始化
     */
    jQuery(document).ready(function () {
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
      // 表单初始化
      rmbtrip.rmbtripDetail.init();

      // 城市间交通费Tab1
      rmbtrip.citytraffic.init(); // 初始化

      let citytrafficData = res.citytraffic.map((detail, index) => {
        const json = {
          tab1_startTime: detail.startTimeString,
          tab1_endTime: detail.endTimeString,
          tab1_startAddressName: { name: detail.startAddressName, code: detail.startAddressId },
          tab1_endAddressName: { name: detail.endAddressName, code: detail.endAddressId },
          tab1_vehicle: detail.vehicle,
          tab1_amount: detail.amount2,
        };
        rmbtrip.citytraffic.initData(index, json);
        return json;
      });

      // 城内交通费Tab2
      rmbtrip.cityinside.init();

      res.cityinside.map((detail, index) => {
        const json = {
          tab2_startTime: detail.startTimeString,
          tab2_endTime: detail.endTimeString,
          tab2_startAddressName: { name: detail.startAddressName, code: detail.startAddressId },
          tab2_endAddressName: { name: detail.endAddressName, code: detail.endAddressId },
          tab2_vehicle: detail.vehicle,
          tab2_amount: detail.amount2,
        };
        rmbtrip.cityinside.initData(index, json);
        return json;
      });

      // 住宿费Tab3
      rmbtrip.hotel.init();

      let htDaata = res.hotel.map((detail, index) => {
        const json = {
          tab3_startTime: detail.startTime, // startTime
          tab3_endTime: detail.endTime, // endTime
          tab3_traveType: detail.traveType,
          tab3_city: detail.city,
          tab3_personCount: detail.personCount,
          tab3_dayNumber: detail.dayNumber,
          tab3_amount: detail.amount, // amount
          tab3_actualDayNumber: detail.actualDayNumber,
          tab3_standardValue: detail.standardValue,
          tab3_exceptTaxRateAm: detail.exceptTaxRateAm,
          tab3_taxRate: detail.taxRate,
          tab3_taxRateAm: detail.taxRateAm,
        };
        rmbtrip.hotel.initData(index, json);
        return json;
      });

      // 出差补助Tab4
      rmbtrip.subsidy.init();
      res.subsidy.map((detail, index) => {
        const json = {
          tab4_startTime: detail.startTimeString,
          tab4_endTime: detail.endTimeString,
          tab4_city: detail.city,
          tab4_dayNumber: detail.dayNumber,
          tab4_amount: detail.amount2,
          tab4_standardValue: detail.standardValue,
          tab4_subsidyType: detail.subsidyType,
        };
        rmbtrip.subsidy.initData(index, json);
        return json;
      });
      // 其它Tab45
      // rmbtrip.other.init();
      // 统计单据数量
      rmbtrip.rmbtripDetail.sumBillCount();
    });
  });
</script>
